'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { ReviewStatus, StoredReview } from '@/lib/reviews/types';

const TOKEN_KEY = 'ghc-admin-token';

const STATUS_STYLE: Record<ReviewStatus, string> = {
  published: 'bg-emerald-50 text-emerald-800 ring-emerald-600/25',
  pending: 'bg-amber-50 text-amber-900 ring-amber-600/30',
  hidden: 'bg-slate-100 text-slate-700 ring-slate-400/30',
};

const buttonClass =
  'inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600';

export function ReviewAdmin() {
  const [token, setToken] = useState('');
  const [reviews, setReviews] = useState<StoredReview[] | null>(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending');

  const request = useCallback(
    async (method: string, url = '/api/admin/reviews', body?: unknown) => {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store',
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; reviews?: StoredReview[] };
      if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`);
      return data;
    },
    [token],
  );

  const load = useCallback(async () => {
    try {
      const data = await request('GET');
      setReviews(data.reviews ?? []);
      setMessage('');
      try {
        sessionStorage.setItem(TOKEN_KEY, token);
      } catch {
        // Storage blocked: the token only lasts for this page view.
      }
    } catch (error) {
      setReviews(null);
      setMessage((error as Error).message);
    }
  }, [request, token]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(TOKEN_KEY);
      if (saved) setToken(saved);
    } catch {
      // ignore
    }
  }, []);

  async function setStatus(id: string, status: ReviewStatus) {
    try {
      await request('PATCH', undefined, { id, status });
      setReviews((list) => list?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function remove(id: string) {
    try {
      await request('DELETE', `/api/admin/reviews?id=${encodeURIComponent(id)}`);
      setReviews((list) => list?.filter((r) => r.id !== id) ?? null);
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    void load();
  }

  const counts = { all: reviews?.length ?? 0, published: 0, pending: 0, hidden: 0 };
  reviews?.forEach((r) => counts[r.status]++);
  const visible = reviews?.filter((r) => filter === 'all' || r.status === filter) ?? [];

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={handleLogin} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="admin-token" className="sr-only">
          Admin token
        </label>
        <input
          id="admin-token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin token"
          autoComplete="current-password"
          className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        <button type="submit" className={`${buttonClass} bg-brand-600 text-white hover:bg-brand-700`}>
          {reviews ? 'Refresh' : 'Open'}
        </button>
      </form>

      {message && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-800">{message}</p>}

      {reviews && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(['pending', 'published', 'hidden', 'all'] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={`${buttonClass} border capitalize ${
                  filter === key ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                {key} ({counts[key]})
              </button>
            ))}
          </div>

          {visible.length === 0 && <p className="text-sm text-slate-600">Nothing here.</p>}

          <ul className="space-y-3">
            {visible.map((review) => (
              <li key={review.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">
                    {'★'.repeat(review.rating)}
                    <span className="text-slate-300">{'★'.repeat(5 - review.rating)}</span> {review.name}
                    {review.role && <span className="font-normal text-slate-500"> · {review.role}</span>}
                  </p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLE[review.status]}`}>
                    {review.status}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line break-words text-sm text-slate-700">{review.text}</p>
                <p className="mt-2 break-all text-xs text-slate-500">
                  {review.email} · {new Date(review.date).toLocaleString('en-US')}
                </p>
                {review.flags.length > 0 && (
                  <p className="mt-1 text-xs font-medium text-amber-800">Held because: {review.flags.join(', ')}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {review.status !== 'published' && (
                    <button type="button" onClick={() => setStatus(review.id, 'published')} className={`${buttonClass} bg-emerald-600 text-white`}>
                      Publish
                    </button>
                  )}
                  {review.status !== 'hidden' && (
                    <button type="button" onClick={() => setStatus(review.id, 'hidden')} className={`${buttonClass} border border-slate-300 bg-white text-slate-800`}>
                      Hide
                    </button>
                  )}
                  <button type="button" onClick={() => remove(review.id)} className={`${buttonClass} border border-rose-300 bg-white text-rose-700`}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
