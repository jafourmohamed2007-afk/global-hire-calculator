import Link from 'next/link';
import { HireRouteSelector } from '@/components/HireRouteSelector';

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">We don’t have that hiring corridor yet</h1>
      <p className="mt-3 text-slate-600">
        Choose a supported company and candidate location below to open the cost calculator.
      </p>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <HireRouteSelector />
      </div>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-12 items-center font-semibold text-brand-700 underline-offset-4 hover:underline"
      >
        ← Back to the homepage
      </Link>
    </div>
  );
}
