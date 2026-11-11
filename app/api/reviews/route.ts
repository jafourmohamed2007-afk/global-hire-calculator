import { randomUUID } from 'node:crypto';
import { getReviewStore } from '@/lib/reviews/store';
import { clientIp, hashIdentifier, json } from '@/lib/reviews/server';
import { toPublicReview, type StoredReview } from '@/lib/reviews/types';
import { validateReview } from '@/lib/reviews/validate';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 10_000;
const SUBMISSIONS_PER_IP_PER_DAY = 3;

const UNAVAILABLE = { error: 'Reviews are temporarily unavailable. Please try again later.' };

/** Published reviews, newest first. Emails are never included. */
export async function GET() {
  const store = getReviewStore();
  if (!store) return json({ reviews: [], available: false });
  try {
    const reviews = (await store.all())
      .filter((review) => review.status === 'published')
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(toPublicReview);
    return json({ reviews, available: true });
  } catch {
    return json(UNAVAILABLE, 503);
  }
}

/** Submit a review. Clean reviews publish instantly; flagged ones wait for manual approval. */
export async function POST(request: Request) {
  const store = getReviewStore();
  if (!store) return json(UNAVAILABLE, 503);

  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BODY_BYTES) return json({ error: 'Your review is too long.' }, 413);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const result = validateReview(body);
  if (!result.ok) {
    // Bots get a normal-looking answer so they can't learn what tripped the trap.
    if (result.bot) return json({ status: 'pending' }, 202);
    return json({ errors: result.errors }, 400);
  }

  try {
    const ipKey = `ip:${hashIdentifier(clientIp(request))}`;
    if (!(await store.allowHit(ipKey, SUBMISSIONS_PER_IP_PER_DAY, 24 * 60 * 60))) {
      return json({ error: 'You have sent several reviews today. Please try again tomorrow.' }, 429);
    }

    const emailHash = hashIdentifier(result.value.email);
    if (!(await store.claimEmail(emailHash))) {
      return json({ errors: { email: 'A review has already been submitted with this email address.' } }, 409);
    }

    const review: StoredReview = {
      id: randomUUID(),
      ...result.value,
      date: new Date().toISOString(),
      status: result.flags.length === 0 ? 'published' : 'pending',
      flags: result.flags,
    };
    try {
      await store.save(review);
    } catch (error) {
      await store.releaseEmail(emailHash);
      throw error;
    }

    return review.status === 'published'
      ? json({ status: 'published', review: toPublicReview(review) }, 201)
      : json({ status: 'pending' }, 202);
  } catch {
    return json(UNAVAILABLE, 503);
  }
}
