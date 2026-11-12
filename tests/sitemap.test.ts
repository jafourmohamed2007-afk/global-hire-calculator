import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { requestOrigin, sitemapEntries, sitemapXml } from '@/lib/sitemap';

const req = (headers: Record<string, string>) => new Request('http://internal/sitemap.xml', { headers });

describe('sitemap', () => {
  it('uses the host the sitemap was requested on', () => {
    assert.equal(requestOrigin(req({ host: 'global-hire-calculator-f44q.vercel.app' })), 'https://global-hire-calculator-f44q.vercel.app');
    assert.equal(requestOrigin(req({ host: 'www.example.com', 'x-forwarded-proto': 'https' })), 'https://www.example.com');
    assert.equal(requestOrigin(req({ 'x-forwarded-host': 'example.com', host: 'internal' })), 'https://example.com');
    assert.equal(requestOrigin(req({ host: 'localhost:3000' })), 'http://localhost:3000');
  });

  it('ignores malformed host headers', () => {
    const origin = requestOrigin(req({ host: 'evil.com/<script>' }));
    assert.ok(!origin.includes('<'));
    assert.ok(!origin.includes('evil.com/'));
  });

  it('lists every page once, all on the same host', () => {
    const xml = sitemapXml('https://example.com');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    assert.equal(locs.length, sitemapEntries().length);
    assert.equal(new Set(locs).size, locs.length);
    assert.ok(locs.every((loc) => loc.startsWith('https://example.com/')));
    assert.ok(locs.includes('https://example.com/hire/us-to-india'));
    assert.ok(!locs.some((loc) => loc.includes('/admin') || loc.includes('/api')));
  });

  it('uses fixed, valid lastmod dates', () => {
    const xml = sitemapXml('https://example.com');
    for (const [, date] of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
      assert.match(date!, /^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
