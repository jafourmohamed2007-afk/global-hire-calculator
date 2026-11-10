'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState, type FormEvent } from 'react';
import {
  COMPANY_COUNTRIES,
  TALENT_COUNTRIES,
  buildCorridorSlug,
  type CompanySlug,
  type TalentSlug,
} from '@/data/country-matrix';

interface SelectFieldProps {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly hint: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: ReadonlyArray<{ value: string; label: string }>;
}

function SelectField({ id, name, label, hint, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <p id={`${id}-hint`} className="text-xs text-slate-500">
        {hint}
      </p>
      <div className="relative mt-2">
        <select
          id={id}
          name={name}
          value={value}
          aria-describedby={`${id}-hint`}
          onChange={(event) => onChange(event.target.value)}
          className="block min-h-14 w-full cursor-pointer appearance-none truncate rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-12 text-lg font-medium text-ink shadow-sm transition-colors hover:border-brand-500 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 fill-slate-500"
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </div>
    </div>
  );
}

const COMPANY_OPTIONS = COMPANY_COUNTRIES.map((c) => ({ value: c.slug, label: c.countryName }));
const TALENT_OPTIONS = TALENT_COUNTRIES.map((c) => ({ value: c.slug, label: c.countryName }));

interface HireRouteSelectorProps {
  readonly defaultCompany?: CompanySlug;
  readonly defaultTalent?: TalentSlug;
}

/**
 * Progressive-enhancement form: with JavaScript it routes client-side to `/hire/[slug]`;
 * without JavaScript the GET form posts to `/hire?from=…&to=…`, which redirects server-side.
 */
export function HireRouteSelector({ defaultCompany = 'us', defaultTalent = 'india' }: HireRouteSelectorProps) {
  const router = useRouter();
  const baseId = useId();
  const [company, setCompany] = useState<string>(defaultCompany);
  const [talent, setTalent] = useState<string>(defaultTalent);
  const [isNavigating, setIsNavigating] = useState(false);

  const href = `/hire/${buildCorridorSlug(company, talent)}`;

  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsNavigating(true);
    router.push(href);
  }

  return (
    <form action="/hire" method="get" onSubmit={handleSubmit} className="space-y-4" aria-label="Choose a hiring corridor">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
        <SelectField
          id={`${baseId}-company`}
          name="from"
          label="Company Location"
          hint="Where your business is headquartered"
          value={company}
          onChange={setCompany}
          options={COMPANY_OPTIONS}
        />
        <div aria-hidden="true" className="hidden h-14 items-center justify-center text-2xl text-slate-400 sm:flex">
          →
        </div>
        <SelectField
          id={`${baseId}-talent`}
          name="to"
          label="Candidate Location"
          hint="Where your new hire lives and works"
          value={talent}
          onChange={setTalent}
          options={TALENT_OPTIONS}
        />
      </div>

      <button
        type="submit"
        disabled={isNavigating}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-lg font-bold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-80"
      >
        {isNavigating ? 'Loading your calculator…' : 'Calculate true hiring cost'}
        {!isNavigating && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
