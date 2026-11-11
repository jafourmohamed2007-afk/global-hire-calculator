/**
 * Browser-side review API. The single-page preview swaps this module for one backed by the
 * artifact database; the website talks to /api/reviews.
 */
import type { PublicReview, ReviewSubmission, SubmitResult } from './types';

export class ReviewSubmitError extends Error {
  constructor(
    message: string,
    readonly fieldErrors: Partial<Record<keyof ReviewSubmission | 'form', string>> = {},
  ) {
    super(message);
  }
}

export async function fetchPublishedReviews(): Promise<PublicReview[]> {
  const response = await fetch('/api/reviews', { cache: 'no-store' });
  if (!response.ok) throw new Error('Reviews could not be loaded.');
  const body = (await response.json()) as { reviews?: PublicReview[] };
  return body.reviews ?? [];
}

export async function submitReview(submission: ReviewSubmission): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
  } catch {
    throw new ReviewSubmitError('We could not reach the server. Check your connection and try again.');
  }
  const body = (await response.json().catch(() => ({}))) as {
    status?: 'published' | 'pending';
    review?: PublicReview;
    error?: string;
    errors?: Partial<Record<keyof ReviewSubmission | 'form', string>>;
  };
  if (response.ok && body.status === 'published' && body.review) return { status: 'published', review: body.review };
  if (response.ok) return { status: 'pending' };
  throw new ReviewSubmitError(body.error ?? 'Please check the highlighted fields.', body.errors ?? {});
}
