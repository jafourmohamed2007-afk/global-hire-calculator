export type ReviewStatus = 'published' | 'pending' | 'hidden';

/** What visitors see. The email address is never part of a public review. */
export interface PublicReview {
  readonly id: string;
  readonly name: string;
  readonly role?: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly text: string;
  /** ISO timestamp of submission. */
  readonly date: string;
}

/**
 * What the database keeps. The email address itself is never stored: only a one-way hash,
 * used to stop the same person reviewing twice.
 */
export interface StoredReview extends PublicReview {
  readonly emailHash: string;
  readonly status: ReviewStatus;
  /** Reasons automatic moderation held the review back (empty when auto-published). */
  readonly flags: readonly string[];
}

/** Raw form data sent by the review form. */
export interface ReviewSubmission {
  name: string;
  email: string;
  role?: string;
  rating: number;
  text: string;
  consent: boolean;
  /** Honeypot: hidden from people, filled in by bots. Must stay empty. */
  website?: string;
  /** Epoch ms when the form was opened, used to detect instant bot submissions. */
  startedAt?: number;
}

export type SubmitResult =
  | { readonly status: 'published'; readonly review: PublicReview }
  | { readonly status: 'pending' };

export function toPublicReview(review: StoredReview): PublicReview {
  const { id, name, role, rating, text, date } = review;
  return role ? { id, name, role, rating, text, date } : { id, name, rating, text, date };
}
