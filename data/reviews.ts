/**
 * Genuine user reviews only.
 *
 * Add a review here ONLY when a real visitor submitted it (e.g. through your feedback form) and agreed
 * to have it published. Never write, edit the meaning of, or pay for reviews: fake or incentivised
 * reviews are illegal in many countries (e.g. the US FTC rule on fake reviews, 2024) and violate
 * Google's publisher and structured-data policies, which can get the site rejected or banned from AdSense.
 */

export interface UserReview {
  /** Name exactly as the reviewer agreed to have it shown (first name + initial is fine). */
  readonly name: string;
  /** Optional role or company, only if the reviewer provided it. */
  readonly role?: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly text: string;
  /** ISO date the review was submitted, e.g. "2026-12-01". */
  readonly date: string;
}

export const USER_REVIEWS: readonly UserReview[] = [];
