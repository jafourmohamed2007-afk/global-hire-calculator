import Link from 'next/link';
import { USER_REVIEWS } from '@/data/reviews';
import { FEEDBACK_URL } from '@/lib/site';

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

/** Shows real, consented reviews from data/reviews.ts, or an invitation to leave the first one. */
export function ReviewsSection() {
  const count = USER_REVIEWS.length;
  const average = count ? USER_REVIEWS.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  const feedbackHref = FEEDBACK_URL || '/contact';
  const feedbackIsExternal = Boolean(FEEDBACK_URL);

  const feedbackLink = feedbackIsExternal ? (
    <a
      href={feedbackHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      Leave a review <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <Link
      href={feedbackHref}
      className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      Leave a review
    </Link>
  );

  return (
    <section aria-labelledby="reviews-heading" className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="reviews-heading" className="text-2xl font-bold tracking-tight text-ink">
            What users say
          </h2>
          {count > 0 ? (
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <Stars rating={average} label={`Average rating ${average.toFixed(1)} out of 5`} />
              {average.toFixed(1)} / 5 from {count} {count === 1 ? 'review' : 'reviews'}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">Real feedback from people who used the calculator.</p>
          )}
        </div>
        {count > 0 && feedbackLink}
      </div>

      {count > 0 ? (
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {USER_REVIEWS.map((review) => (
            <li key={`${review.name}-${review.date}`}>
              <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5">
                <Stars rating={review.rating} label={`${review.rating} out of 5 stars`} />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">“{review.text}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-ink">{review.name}</span>
                  {review.role && <span className="text-slate-500"> · {review.role}</span>}
                  <time dateTime={review.date} className="block text-xs text-slate-500">
                    {new Date(`${review.date}T00:00:00Z`).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </time>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 flex flex-col items-start gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-ink">No reviews yet</p>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Used the calculator to plan a hire? Tell us how it went. Reviews are published only with your
              permission, exactly as you wrote them.
            </p>
          </div>
          {feedbackLink}
        </div>
      )}
    </section>
  );
}
