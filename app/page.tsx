import type { Metadata } from 'next';
import Link from 'next/link';
import { HireRouteSelector } from '@/components/HireRouteSelector';
import { JsonLd } from '@/components/JsonLd';
import { PartnerCards } from '@/components/PartnerCards';
import { SHOW_PARTNER_OFFERS } from '@/data/partners';
import { ReviewsSection } from '@/components/ReviewsSection';
import { RiskBadge } from '@/components/RiskBadge';
import { ARTICLES, formatArticleDate, readingMinutes } from '@/data/articles';
import {
  COMPANY_COUNTRIES,
  DATA_YEAR,
  TALENT_COUNTRIES,
  buildCorridorSlug,
} from '@/data/country-matrix';
import { calculateHireCost } from '@/lib/cost-engine';
import { formatCurrency, formatPercent } from '@/lib/format';
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} (${DATA_YEAR}) — True Cost of Hiring Remote Developers Abroad` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
};

const STEPS = [
  {
    title: 'Pick your corridor',
    body: 'Choose where your company is based and where your candidate lives.',
  },
  {
    title: 'Set the salary',
    body: 'Drag the touch-friendly slider or use a seniority preset for the role.',
  },
  {
    title: 'See the true cost',
    body: 'Employer taxes, mandatory benefits, FX conversions and compliance risk — instantly.',
  },
] as const;

const corridorCount = COMPANY_COUNTRIES.length * TALENT_COUNTRIES.length;

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': absoluteUrl('/#website'),
        url: absoluteUrl('/'),
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebApplication',
        '@id': absoluteUrl('/#app'),
        name: SITE_NAME,
        url: absoluteUrl('/'),
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires a modern web browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'ItemList',
        name: `Remote developer hiring corridors from the United States (${DATA_YEAR})`,
        itemListElement: TALENT_COUNTRIES.map((talent, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `Cost to hire a developer from ${talent.countryName} in the United States`,
          url: absoluteUrl(`/hire/${buildCorridorSlug('us', talent.slug)}`),
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-slate-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[min(56rem,140vw)] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl"
        />
        <div className="relative mx-auto grid grid-cols-1 w-full max-w-6xl gap-8 px-4 pb-12 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:pb-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
              Updated for {DATA_YEAR} · Free · No sign-up
            </p>
            <h1 className="mt-4 text-balance text-4xl font-black leading-[1.1] tracking-tight text-ink sm:text-5xl">
              What does a remote developer <span className="text-brand-600">really</span> cost?
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-lg text-slate-600">
              Salary is only the start. Instantly calculate employer payroll taxes, mandatory benefits, currency
              conversions and legal compliance risk before you hire across borders.
            </p>
            <ul className="mt-6 grid grid-cols-3 gap-3 text-center sm:max-w-md">
              {[
                { value: String(TALENT_COUNTRIES.length), label: 'talent markets' },
                { value: String(COMPANY_COUNTRIES.length), label: 'HQ countries' },
                { value: String(corridorCount), label: 'cost corridors' },
              ].map((stat) => (
                <li key={stat.label} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                  <span className="block text-2xl font-black text-ink">{stat.value}</span>
                  <span className="block text-xs font-medium text-slate-500">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            id="calculator"
            className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6"
          >
            <h2 className="text-xl font-bold tracking-tight text-ink">Start your hiring cost estimate</h2>
            <p className="mb-5 mt-1 text-sm text-slate-600">Two taps. Real numbers. Zero guesswork.</p>
            <HireRouteSelector />
          </div>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section aria-labelledby="how-heading" className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
        <h2 id="how-heading" className="text-2xl font-bold tracking-tight text-ink">
          How the calculator works
        </h2>
        <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-xl bg-brand-600 text-sm font-black text-white"
              >
                {index + 1}
              </span>
              <h3 className="mt-3 font-bold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── Talent market comparison ───────────── */}
      <section aria-labelledby="markets-heading" className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="markets-heading" className="text-2xl font-bold tracking-tight text-ink">
            Compare talent markets ({DATA_YEAR})
          </h2>
          <p className="text-sm text-slate-500">Mid-level developer, hired from the US</p>
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TALENT_COUNTRIES.map((talent) => {
            const cost = calculateHireCost(talent, talent.avgDevSalaryUSD);
            return (
              <li key={talent.slug}>
                <Link
                  href={`/hire/${buildCorridorSlug('us', talent.slug)}`}
                  className="group flex h-full min-h-12 flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:border-brand-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-ink group-hover:text-brand-700">{talent.countryName}</span>
                    <RiskBadge score={talent.complianceRiskScore} />
                  </span>
                  <span className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <span>
                      <span className="block text-xs text-slate-500">Avg. salary</span>
                      <span className="block font-bold tabular-nums text-ink">
                        {formatCurrency(talent.avgDevSalaryUSD, 'USD')}
                      </span>
                    </span>
                    <span>
                      <span className="block text-xs text-slate-500">True cost</span>
                      <span className="block font-bold tabular-nums text-brand-700">
                        {formatCurrency(cost.trueCostUSD, 'USD')}
                      </span>
                    </span>
                  </span>
                  <span className="mt-2 text-xs text-slate-500">
                    Employer taxes {formatPercent(talent.employerTaxRate)} · Benefits{' '}
                    {formatPercent(talent.mandatoryBenefitsRate)}
                  </span>
                  <span className="mt-auto pt-3 text-sm font-semibold text-brand-700">
                    Open calculator <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────────── Partners (hidden until affiliate approval) ───────────── */}
      {SHOW_PARTNER_OFFERS && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
          <PartnerCards heading="Ready to hire? Let an Employer of Record handle payroll & compliance" />
        </div>
      )}

      {/* ───────────── Latest guides ───────────── */}
      <section aria-labelledby="guides-heading" className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="guides-heading" className="text-2xl font-bold tracking-tight text-ink">
            Hiring guides
          </h2>
          <Link
            href="/blog"
            className="inline-flex min-h-12 items-center text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            All guides <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.slice(0, 6).map((article) => (
            <li key={article.slug}>
              <Link
                href={`/blog/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:border-brand-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{article.category}</span>
                <span className="mt-1 font-bold leading-snug text-ink group-hover:text-brand-700">{article.title}</span>
                <span className="mt-auto pt-3 text-xs text-slate-500">
                  {formatArticleDate(article.updated)} · {readingMinutes(article)} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ReviewsSection limit={6} />

      {/* ───────────── Corridor directory (internal linking) ───────────── */}
      <section aria-labelledby="directory-heading" className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6">
        <h2 id="directory-heading" className="text-2xl font-bold tracking-tight text-ink">
          All hiring cost calculators
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Jump straight to any of the {corridorCount} company-to-candidate country combinations.
        </p>
        <div className="mt-5 space-y-3">
          {COMPANY_COUNTRIES.map((company, index) => (
            <details
              key={company.slug}
              open={index === 0}
              className="group rounded-2xl border border-slate-200 bg-white"
            >
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                Hiring from {company.countryName}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="size-5 shrink-0 fill-slate-500 transition-transform group-open:rotate-180"
                >
                  <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
                </svg>
              </summary>
              <ul className="grid grid-cols-1 gap-x-4 px-4 pb-3 sm:grid-cols-2 lg:grid-cols-4">
                {TALENT_COUNTRIES.map((talent) => (
                  <li key={talent.slug}>
                    <Link
                      href={`/hire/${buildCorridorSlug(company.slug, talent.slug)}`}
                      className="flex min-h-12 items-center text-sm text-slate-700 underline-offset-4 hover:text-brand-700 hover:underline"
                    >
                      Hire a developer in {talent.countryName}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
