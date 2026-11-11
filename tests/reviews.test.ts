/**
 * Review system tests: validation, automatic moderation, and the API routes end to end
 * (using the file store in a temporary directory).
 */
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { before, describe, it } from 'node:test';
import { validateReview } from '@/lib/reviews/validate';

const GOOD = {
  name: 'Ana P.',
  email: 'ana@example.com',
  role: 'Founder',
  rating: 5,
  text: 'Helped me budget my first hire in Brazil before making an offer.',
  consent: true,
  website: '',
  startedAt: 0,
};
const NOW = 60_000;

describe('validateReview', () => {
  it('accepts a clean review with no moderation flags', () => {
    const result = validateReview(GOOD, NOW);
    assert.ok(result.ok);
    assert.deepEqual(result.flags, []);
  });

  it('publishes low ratings exactly like high ones', () => {
    const result = validateReview({ ...GOOD, rating: 1, text: 'The numbers for Mexico did not match my payroll quote.' }, NOW);
    assert.ok(result.ok);
    assert.deepEqual(result.flags, []);
  });

  it('rejects missing fields with clear messages', () => {
    const result = validateReview({ ...GOOD, name: 'A', email: 'nope', rating: 0, text: 'short', consent: false }, NOW);
    assert.ok(!result.ok);
    assert.deepEqual(Object.keys(result.errors).sort(), ['consent', 'email', 'name', 'rating', 'text']);
  });

  it('treats a filled honeypot or an instant submit as a bot', () => {
    const honeypot = validateReview({ ...GOOD, website: 'http://spam.example' }, NOW);
    const instant = validateReview({ ...GOOD, startedAt: NOW - 500 }, NOW);
    assert.ok(!honeypot.ok && honeypot.bot);
    assert.ok(!instant.ok && instant.bot);
  });

  it('holds spam-like reviews for a manual check', () => {
    const cases: Array<[string, Partial<typeof GOOD>]> = [
      ['contains a link', { text: 'Great tool, also visit www.cheap-deals.com for offers!' }],
      ['contains contact details', { text: 'Great tool! Call me on +1 555 123 4567 for consulting.' }],
      ['contains blocked words', { text: 'Best casino bonus ever, this calculator is great too.' }],
      ['mostly capital letters', { text: 'THIS IS THE BEST CALCULATOR I HAVE EVER USED' }],
      ['repeated characters', { text: 'Amazing calculatorrrrrrrrr for my team planning' }],
    ];
    for (const [flag, change] of cases) {
      const result = validateReview({ ...GOOD, ...change }, NOW);
      assert.ok(result.ok, flag);
      assert.ok(result.flags.includes(flag), `${flag}: got ${result.flags}`);
    }
  });

  it('cleans whitespace and control characters', () => {
    const result = validateReview({ ...GOOD, name: '  Ana\u0000   P. ', email: ' ANA@Example.com ' }, NOW);
    assert.ok(result.ok);
    assert.equal(result.value.name, 'Ana P.');
    assert.equal(result.value.email, 'ana@example.com');
  });
});

describe('reviews API', () => {
  let api: typeof import('@/app/api/reviews/route');
  let admin: typeof import('@/app/api/admin/reviews/route');
  const TOKEN = 'test-admin-token-1234567890';

  before(async () => {
    process.env.REVIEWS_FILE = path.join(mkdtempSync(path.join(tmpdir(), 'ghc-reviews-')), 'reviews.json');
    process.env.REVIEWS_ADMIN_TOKEN = TOKEN;
    delete process.env.VERCEL;
    api = await import('@/app/api/reviews/route');
    admin = await import('@/app/api/admin/reviews/route');
  });

  const post = (body: unknown, ip = '203.0.113.1') =>
    api.POST(
      new Request('http://localhost/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
        body: JSON.stringify(body),
      }),
    );
  const adminRequest = (method: string, url = 'http://localhost/api/admin/reviews', body?: unknown, token = TOKEN) =>
    new Request(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

  it('publishes a clean review instantly and never exposes the email', async () => {
    const response = await post({ ...GOOD, startedAt: Date.now() - 10_000 });
    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.status, 'published');
    assert.equal(body.review.email, undefined);

    const list = await (await api.GET()).json();
    assert.equal(list.reviews.length, 1);
    assert.equal(list.reviews[0].name, 'Ana P.');
    assert.ok(!JSON.stringify(list).includes('ana@example.com'));
  });

  it('allows only one review per email address', async () => {
    const response = await post({ ...GOOD, email: 'ANA@example.com', startedAt: Date.now() - 10_000 }, '203.0.113.2');
    assert.equal(response.status, 409);
  });

  it('holds flagged reviews out of the public list', async () => {
    const response = await post(
      { ...GOOD, email: 'spam@example.com', text: 'Visit www.cheap-deals.com now for offers!', startedAt: Date.now() - 10_000 },
      '203.0.113.3',
    );
    assert.equal(response.status, 202);
    const list = await (await api.GET()).json();
    assert.equal(list.reviews.length, 1);
  });

  it('silently drops bot submissions', async () => {
    const response = await post({ ...GOOD, email: 'bot@example.com', website: 'x', startedAt: Date.now() - 10_000 }, '203.0.113.4');
    assert.equal(response.status, 202);
    const all = await (await admin.GET(adminRequest('GET'))).json();
    assert.ok(!all.reviews.some((r: { email: string }) => r.email === 'bot@example.com'));
  });

  it('rate-limits to 3 submissions per IP per day', async () => {
    const ip = '198.51.100.7';
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) {
      const response = await post({ ...GOOD, email: `user${i}@example.com`, startedAt: Date.now() - 10_000 }, ip);
      statuses.push(response.status);
    }
    assert.deepEqual(statuses, [201, 201, 201, 429]);
  });

  it('protects admin with the token', async () => {
    assert.equal((await admin.GET(adminRequest('GET', undefined, undefined, 'wrong-token-wrong-token'))).status, 401);
  });

  it('lets the admin publish, hide and delete reviews', async () => {
    const all = (await (await admin.GET(adminRequest('GET'))).json()).reviews as Array<{ id: string; email: string; status: string }>;
    const held = all.find((r) => r.email === 'spam@example.com')!;
    assert.equal(held.status, 'pending');

    await admin.PATCH(adminRequest('PATCH', undefined, { id: held.id, status: 'published' }));
    let list = await (await api.GET()).json();
    assert.ok(list.reviews.some((r: { id: string }) => r.id === held.id));

    await admin.PATCH(adminRequest('PATCH', undefined, { id: held.id, status: 'hidden' }));
    list = await (await api.GET()).json();
    assert.ok(!list.reviews.some((r: { id: string }) => r.id === held.id));

    const deleted = await admin.DELETE(adminRequest('DELETE', `http://localhost/api/admin/reviews?id=${held.id}`));
    assert.equal(deleted.status, 200);
    // The email is free again after deletion.
    const again = await post({ ...GOOD, email: 'spam@example.com', startedAt: Date.now() - 10_000 }, '203.0.113.9');
    assert.equal(again.status, 201);
  });
});
