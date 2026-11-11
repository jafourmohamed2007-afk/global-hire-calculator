import { getReviewStore } from '@/lib/reviews/store';
import { isAdmin, json } from '@/lib/reviews/server';
import type { ReviewStatus } from '@/lib/reviews/types';

export const dynamic = 'force-dynamic';

const STATUSES: readonly ReviewStatus[] = ['published', 'pending', 'hidden'];

function guard(request: Request) {
  if (!process.env.REVIEWS_ADMIN_TOKEN) return json({ error: 'Set REVIEWS_ADMIN_TOKEN to enable review admin.' }, 503);
  if (!isAdmin(request)) return json({ error: 'Wrong admin token.' }, 401);
  return null;
}

/** All reviews with their moderation status and flags. */
export async function GET(request: Request) {
  const denied = guard(request);
  if (denied) return denied;
  const store = getReviewStore();
  if (!store) return json({ error: 'Review storage is not configured.' }, 503);
  const reviews = (await store.all()).sort((a, b) => b.date.localeCompare(a.date));
  return json({ reviews });
}

/** Change a review's status: { id, status: "published" | "pending" | "hidden" }. */
export async function PATCH(request: Request) {
  const denied = guard(request);
  if (denied) return denied;
  const store = getReviewStore();
  if (!store) return json({ error: 'Review storage is not configured.' }, 503);
  const body = (await request.json().catch(() => ({}))) as { id?: string; status?: ReviewStatus };
  if (!body.id || !body.status || !STATUSES.includes(body.status)) return json({ error: 'Invalid request.' }, 400);
  const updated = await store.setStatus(body.id, body.status);
  return updated ? json({ review: updated }) : json({ error: 'Review not found.' }, 404);
}

/** Permanently delete a review: DELETE /api/admin/reviews?id=… (the email can then review again). */
export async function DELETE(request: Request) {
  const denied = guard(request);
  if (denied) return denied;
  const store = getReviewStore();
  if (!store) return json({ error: 'Review storage is not configured.' }, 503);
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ error: 'Missing id.' }, 400);
  const review = await store.get(id);
  if (!review) return json({ error: 'Review not found.' }, 404);
  await store.remove(id);
  await store.releaseEmail(review.emailHash);
  return json({ deleted: id });
}
