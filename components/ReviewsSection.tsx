'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchPublishedReviews } from '@/lib/reviews/client';
import type { PublicReview } from '@/lib/reviews/types';
import { ReviewForm } from './ReviewForm';

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span role="img" aria-label={label} className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`size-4 ${star <= Math.round(rating) ? 'fill-amber-400' : 'fill-slate-200'}`}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

interface ReviewsSectionProps {
  /** Show at most this many reviews (homepage). Omit to show all (Reviews page). */
  readonly limit?: number;
  /** Open the form straight away (Reviews page). */
  readonly formOpen?: boolean;
  readonly headingLevel?: 'h1' | 'h2';
}

/**
 * Live reviews from real visitors. New reviews that pass automatic moderation appear instantly;
 * every star rating is published, not only good ones.
 */
export function ReviewsSection({ limit, formOpen = false, headingLevel = 'h2' }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<PublicReview[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [showForm, setShowForm] = useState(formOpen);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => active && setLoadError(true), 10_000);
    fetchPublishedReviews()
      .then((list) => {
        if (!active) return;
        clearTimeout(timer);
        setReviews(list);
        setLoadError(false);
      })
      .catch(() => {
        if (!active) return;
        clearTimeout(timer);
        setLoadError(true);
      });
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const count = reviews?.length ?? 0;
  const average = count ? reviews!.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  const shown = reviews ? (limit ? reviews.slice(0, limit) : reviews) : [];
  const Heading = headingLevel;

  return (
    <section aria-labelledby="reviews-heading" className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Heading
            id="reviews-heading"
            className={
              headingLevel === 'h1'
                ? 'text-3xl font-black tracking-tight text-ink sm:text-4xl'
                : 'text-2xl font-bold tracking-tight text-ink'
            }
          >
            What users say
          </Heading>
          {count > 0 ? (
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <Stars rating={average} label={`Average rating ${average.toFixed(1)} out of 5`} />
              {average.toFixed(1)} / 5 from {count} {count === 1 ? 'review' : 'reviews'}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">Real reviews from people who used the calculator.</p>
          )}
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Write a review
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-5">
          <ReviewForm onPublished={(review) => setReviews((current) => [review, ...(current ?? [])])} />
        </div>
      )}

      <div className="mt-5" aria-live="polite">
        {reviews === null && !loadError && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading reviews">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </ul>
        )}
        {loadError && reviews === null && (
          <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            Reviews can’t be loaded right now. Please refresh the page in a moment.
          </p>
        )}
        {reviews !== null && count === 0 && !showForm && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
            No reviews yet. Used the calculator to plan a hire? Be the first to share how it went.
          </p>
        )}
        {shown.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((review) => (
              <li key={review.id}>
                <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5">
                  <Stars rating={review.rating} label={`${review.rating} out of 5 stars`} />
                  <blockquote className="mt-3 flex-1 whitespace-pre-line break-words text-sm leading-relaxed text-slate-700">
                    “{review.text}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold text-ink">{review.name}</span>
                    {review.role && <span className="text-slate-500"> · {review.role}</span>}
                    <time dateTime={review.date} className="block text-xs text-slate-500">
                      {formatDate(review.date)}
                    </time>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
        {limit !== undefined && count > limit && (
          <Link
            href="/reviews"
            className="mt-4 inline-flex min-h-12 items-center text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            See all {count} reviews <span aria-hidden="true">&nbsp;→</span>
          </Link>
        )}
      </div>
    </section>
  );
}
