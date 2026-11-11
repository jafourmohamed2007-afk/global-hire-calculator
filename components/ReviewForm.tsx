'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ReviewSubmitError, submitReview } from '@/lib/reviews/client';
import type { PublicReview, ReviewSubmission } from '@/lib/reviews/types';
import { REVIEW_LIMITS, validateReview } from '@/lib/reviews/validate';

type FieldErrors = Partial<Record<keyof ReviewSubmission | 'form', string>>;

interface ReviewFormProps {
  readonly onPublished: (review: PublicReview) => void;
}

const inputClass =
  'block min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100 aria-[invalid=true]:border-rose-500';

export function ReviewForm({ onPublished }: ReviewFormProps) {
  const id = useId();
  const startedAt = useRef<number>(0);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'published' | 'pending'>('idle');

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const submission: ReviewSubmission = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      role: String(form.get('role') ?? ''),
      rating,
      text,
      consent: form.get('consent') === 'on',
      website: String(form.get('website') ?? ''),
      startedAt: startedAt.current,
    };

    // Same rules as the server, for instant feedback (timing check skipped on the client).
    const local = validateReview({ ...submission, startedAt: undefined });
    if (!local.ok) {
      setErrors(local.errors);
      return;
    }

    setErrors({});
    setState('sending');
    try {
      const result = await submitReview(submission);
      if (result.status === 'published') {
        setState('published');
        onPublished(result.review);
      } else {
        setState('pending');
      }
    } catch (error) {
      setState('idle');
      if (error instanceof ReviewSubmitError) {
        setErrors({ form: error.message, ...error.fieldErrors });
      } else {
        setErrors({ form: 'Something went wrong. Please try again.' });
      }
    }
  }

  /** Clears a field's error as soon as the visitor edits it. */
  function clearError(name: string) {
    setErrors((current) => {
      if (!(name in current) && !current.form) return current;
      const next = { ...current };
      delete next[name as keyof FieldErrors];
      delete next.form;
      return next;
    });
  }

  if (state === 'published' || state === 'pending') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
        <p className="font-bold">Thank you for your review!</p>
        <p className="mt-1 text-sm">
          {state === 'published'
            ? 'It is now live on the site.'
            : 'It will appear once it has been checked — usually within a day.'}
        </p>
      </div>
    );
  }

  const field = (name: keyof ReviewSubmission) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
  });
  const fieldError = (name: keyof ReviewSubmission) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-sm font-medium text-rose-700">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      onInput={(event) => clearError((event.target as HTMLInputElement).name)}
      noValidate
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Your rating</legend>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <label
              key={star}
              className="grid size-12 cursor-pointer place-items-center rounded-xl has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100"
            >
              <input
                type="radio"
                name="rating"
                value={star}
                checked={rating === star}
                onChange={() => setRating(star)}
                className="sr-only"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className={`size-8 transition-colors ${star <= rating ? 'fill-amber-400' : 'fill-slate-200'}`}
              >
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
              <span className="sr-only">
                {star} {star === 1 ? 'star' : 'stars'}
              </span>
            </label>
          ))}
        </div>
        {fieldError('rating')}
      </fieldset>

      <div>
        <label htmlFor={`${id}-text`} className="block text-sm font-semibold text-ink">
          Your review
        </label>
        <textarea
          id={`${id}-text`}
          name="text"
          rows={5}
          value={text}
          maxLength={REVIEW_LIMITS.textMax}
          onChange={(event) => setText(event.target.value)}
          placeholder="How did the calculator help you plan your hire?"
          className={`${inputClass} mt-2 resize-y`}
          {...field('text')}
        />
        <p className="mt-1 text-right text-xs tabular-nums text-slate-500">
          {text.length} / {REVIEW_LIMITS.textMax}
        </p>
        {fieldError('text')}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="block text-sm font-semibold text-ink">
            Name shown with your review
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            maxLength={REVIEW_LIMITS.nameMax}
            className={`${inputClass} mt-2`}
            {...field('name')}
          />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor={`${id}-role`} className="block text-sm font-semibold text-ink">
            Role or company <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id={`${id}-role`}
            name="role"
            autoComplete="organization-title"
            maxLength={REVIEW_LIMITS.roleMax}
            className={`${inputClass} mt-2`}
            {...field('role')}
          />
          {fieldError('role')}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="block text-sm font-semibold text-ink">
          Email <span className="font-normal text-slate-500">(never published)</span>
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className={`${inputClass} mt-2`}
          {...field('email')}
        />
        {fieldError('email')}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex min-h-12 cursor-pointer items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 size-6 shrink-0 cursor-pointer accent-brand-600"
            {...field('consent')}
          />
          <span>
            I agree that my name, role, rating and review are published on this site. My email stays private and is only
            used to prevent duplicates and contact me about my review. See the{' '}
            <Link href="/privacy-policy" className="font-semibold text-brand-700 underline underline-offset-2">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {fieldError('consent')}
      </div>

      {errors.form && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-800">
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-600 px-5 font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
      >
        {state === 'sending' ? 'Sending…' : 'Publish my review'}
      </button>
    </form>
  );
}
