import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CostCalculator } from '@/components/CostCalculator';
import { JsonLd } from '@/components/JsonLd';
import { PartnerCards } from '@/components/PartnerCards';
import { RiskBadge } from '@/components/RiskBadge';
import {
  COMPANY_COUNTRIES,
  DATA_YEAR,
  TALENT_COUNTRIES,
  buildCorridorSlug,
  getAllCorridors,
  parseCorridorSlug,
  type CompanyCountry,
  type TalentCountry,
} from '@/data/country-matrix';
import { EOR_MONTHLY_FEE_USD } from '@/data/partners';
import { calculateHireCost, convertFromUSD, type CostBreakdown } from '@/lib/cost-engine';
import { formatCurrency, formatPercent } from '@/lib/format';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

interface HirePageProps {
  params: Promise<{ slug: string }>;
}

/** Only pre-built corridors exist; anything else is a 404 (no thin or duplicate pages). */
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllCorridors().map((corridor) => ({ slug: corridor.slug }));
}

function buildTitle(company: CompanyCountry, talent: TalentCountry): string {
  return `Cost to Hire a Developer from ${talent.countryName} in ${company.nameInSentence} (${DATA_YEAR} Calculator)`;
}

function buildDescription(company: CompanyCountry, talent: TalentCountry, cost: CostBreakdown): string {
  const inHq = (usd: number) => formatCurrency(convertFromUSD(usd, company.usdToLocalRate), company.currencyCode);
  return `A mid-level developer in ${talent.countryName} earning ${inHq(cost.baseSalaryUSD)} costs a company in ${company.nameInSentence} about ${inHq(cost.trueCostUSD)} a year after ${formatPercent(talent.employerTaxRate)} employer taxes and mandatory benefits. ${talent.complianceRiskScore} compliance risk. Free ${DATA_YEAR} calculator.`;
}

export async function generateMetadata({ params }: HirePageProps): Promise<Metadata> {
  const { slug } = await params;
  const corridor = parseCorridorSlug(slug);
  if (!corridor) return { title: 'Hiring corridor not found', robots: { index: false, follow: true } };

  const { company, talent } = corridor;
  const cost = calculateHireCost(talent, talent.avgDevSalaryUSD);
  const title = buildTitle(company, talent);
  const description = buildDescription(company, talent, cost);
  const path = `/hire/${corridor.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `cost to hire developer in ${talent.countryName}`,
      `hire developer ${talent.countryName} from ${company.countryName}`,
      `${talent.countryName} employer payroll tax`,
      `${talent.countryName} employer of record cost`,
      `${talent.countryName} developer salary ${DATA_YEAR}`,
      `remote developer ${talent.countryName} true cost`,
    ],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function buildFaq(company: CompanyCountry, talent: TalentCountry, cost: CostBreakdown) {
  const inHq = (usd: number) => formatCurrency(convertFromUSD(usd, company.usdToLocalRate), company.currencyCode);
  const inLocal = (usd: number) => formatCurrency(convertFromUSD(usd, talent.usdToLocalRate), talent.currencyCode);
  const eorYear = EOR_MONTHLY_FEE_USD * 12;

  return [
    {
      question: `How much does it cost to hire a developer from ${talent.countryName} in ${company.nameInSentence}?`,
      answer: `At the ${DATA_YEAR} market average of ${inHq(cost.baseSalaryUSD)} (${inLocal(cost.baseSalaryUSD)}) per year, the true employment cost is about ${inHq(cost.trueCostUSD)} once ${formatPercent(talent.employerTaxRate)} employer payroll taxes and ${formatPercent(talent.mandatoryBenefitsRate)} mandatory benefits are added. Through an Employer of Record at roughly ${formatCurrency(EOR_MONTHLY_FEE_USD, 'USD')} per month, budget about ${inHq(cost.trueCostUSD + eorYear)} per year.`,
    },
    {
      question: `What employer taxes do you pay when hiring in ${talent.countryName}?`,
      answer: `${talent.localTaxNotes.slice(0, 3).join(' ')} In total, employer statutory contributions are roughly ${formatPercent(talent.employerTaxRate)} of gross salary.`,
    },
    {
      question: `Is it risky to hire a contractor in ${talent.countryName}?`,
      answer: `${talent.countryName} is rated ${talent.complianceRiskScore.toLowerCase()} compliance risk. ${talent.complianceRiskSummary} At the average salary, back-dated employer contributions and benefits could reach about ${inHq(cost.misclassificationExposureUSD)} per year of engagement if a contractor is reclassified.`,
    },
    {
      question: `Can a company in ${company.nameInSentence} hire in ${talent.countryName} without a local entity?`,
      answer: `Yes. An Employer of Record (EOR) such as Deel or Remote becomes the legal employer in ${talent.countryName}, runs compliant local payroll, withholds taxes and provides mandatory benefits, while your company directs the day-to-day work. Alternatively, a genuinely independent contractor can invoice you directly. ${talent.contractorModel}`,
    },
    {
      question: `How much paid leave do employees in ${talent.countryName} get?`,
      answer: talent.paidLeaveSummary,
    },
  ];
}

export default async function HirePage({ params }: HirePageProps) {
  const { slug } = await params;
  const corridor = parseCorridorSlug(slug);
  if (!corridor) notFound();

  const { company, talent } = corridor;
  const path = `/hire/${corridor.slug}`;
  const cost = calculateHireCost(talent, talent.avgDevSalaryUSD);
  const title = buildTitle(company, talent);
  const description = buildDescription(company, talent, cost);
  const faq = buildFaq(company, talent, cost);
  const inHq = (usd: number) => formatCurrency(convertFromUSD(usd, company.usdToLocalRate), company.currencyCode);

  const otherTalent = TALENT_COUNTRIES.filter((t) => t.slug !== talent.slug);
  const otherCompanies = COMPANY_COUNTRIES.filter((c) => c.slug !== company.slug);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': absoluteUrl(`${path}#webpage`),
        url: absoluteUrl(path),
        name: title,
        description,
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', '@id': absoluteUrl('/#website'), name: SITE_NAME, url: absoluteUrl('/') },
        about: [
          { '@type': 'Country', name: talent.countryName },
          { '@type': 'Country', name: company.countryName },
        ],
        breadcrumb: { '@id': absoluteUrl(`${path}#breadcrumb`) },
        mainEntity: { '@id': absoluteUrl(`${path}#calculator`) },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': absoluteUrl(`${path}#breadcrumb`),
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${company.countryName} to ${talent.countryName} hiring cost`,
            item: absoluteUrl(path),
          },
        ],
      },
      {
        '@type': 'WebApplication',
        '@id': absoluteUrl(`${path}#calculator`),
        name: `${talent.countryName} Developer Hiring Cost Calculator for ${company.countryName} Companies`,
        url: absoluteUrl(path),
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: [
          'Base salary vs true employment cost',
          `${talent.countryName} employer payroll tax estimate`,
          `${talent.currencyCode} / ${company.currencyCode} / USD currency conversion`,
          'Compliance and misclassification risk warning',
        ],
      },
      {
        '@type': 'MonetaryAmountDistribution',
        name: `Mid-level software developer salary in ${talent.countryName} (${DATA_YEAR})`,
        currency: 'USD',
        duration: 'P1Y',
        median: talent.avgDevSalaryUSD,
      },
      {
        '@type': 'FAQPage',
        '@id': absoluteUrl(`${path}#faq`),
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="pt-4">
          <ol className="flex flex-wrap items-center gap-x-1.5 text-sm text-slate-500">
            <li>
              <Link href="/" className="inline-flex min-h-12 items-center hover:text-brand-700 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="min-w-0 truncate font-medium text-slate-700">
              {company.countryName} to {talent.countryName} hiring cost
            </li>
          </ol>
        </nav>

        {/* ───────────── Intro ───────────── */}
        <header className="pb-6 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <RiskBadge score={talent.complianceRiskScore} />
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
              {DATA_YEAR} rates
            </span>
          </div>
          <h1 className="mt-3 text-balance text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
            Cost to Hire a Developer from {talent.countryName} in {company.nameInSentence}
          </h1>
          <p className="mt-3 max-w-3xl text-pretty text-base text-slate-600 sm:text-lg">
            A mid-level software developer in {talent.countryName} earns around{' '}
            <strong className="text-ink">{inHq(cost.baseSalaryUSD)}</strong> a year. After employer payroll
            taxes and mandatory benefits, the true cost to a company in {company.nameInSentence} is about{' '}
            <strong className="text-ink">{inHq(cost.trueCostUSD)}</strong> — {formatPercent(cost.overheadUSD / cost.baseSalaryUSD)}{' '}
            above base salary.
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Avg. dev salary', value: formatCurrency(talent.avgDevSalaryUSD, 'USD') },
              { label: 'Employer taxes', value: formatPercent(talent.employerTaxRate) },
              { label: 'Mandatory benefits', value: formatPercent(talent.mandatoryBenefitsRate) },
              { label: 'Local currency', value: talent.currencyCode },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
                <dt className="text-xs font-medium text-slate-500">{stat.label}</dt>
                <dd className="mt-0.5 break-words text-lg font-bold tabular-nums text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* ───────────── Calculator engine ───────────── */}
        <CostCalculator
          company={company}
          talent={talent}
          partnerSlot={<PartnerCards talentCountryName={talent.countryName} />}
        />

        {/* ───────────── Local rules ───────────── */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section aria-labelledby="local-tax-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 id="local-tax-heading" className="text-xl font-bold tracking-tight text-ink">
              Employer taxes &amp; mandatory benefits in {talent.countryName}
            </h2>
            <ul className="mt-4 space-y-3">
              {talent.localTaxNotes.map((note) => (
                <li key={note} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              <strong className="text-ink">Paid leave:</strong> {talent.paidLeaveSummary}
            </p>
          </section>

          <section aria-labelledby="cross-border-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 id="cross-border-heading" className="text-xl font-bold tracking-tight text-ink">
              Paying talent abroad from {company.nameInSentence}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">{company.crossBorderNote}</p>
            <h3 className="mt-5 font-bold text-ink">Contractor model in {talent.countryName}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{talent.contractorModel}</p>
            <h3 className="mt-5 font-bold text-ink">Employee vs. contractor at the market average</h3>
            <dl className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 text-sm">
              <div className="flex justify-between gap-3 px-3 py-2.5">
                <dt className="text-slate-600">Contractor (invoice only)</dt>
                <dd className="font-bold tabular-nums text-ink">{inHq(cost.baseSalaryUSD)}</dd>
              </div>
              <div className="flex justify-between gap-3 px-3 py-2.5">
                <dt className="text-slate-600">Employee (statutory cost)</dt>
                <dd className="font-bold tabular-nums text-ink">{inHq(cost.trueCostUSD)}</dd>
              </div>
              <div className="flex justify-between gap-3 px-3 py-2.5">
                <dt className="text-slate-600">Employee via EOR</dt>
                <dd className="font-bold tabular-nums text-brand-700">
                  {inHq(cost.trueCostUSD + EOR_MONTHLY_FEE_USD * 12)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* ───────────── FAQ ───────────── */}
        <section aria-labelledby="faq-heading" className="mt-12">
          <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-ink">
            Hiring in {talent.countryName} from {company.nameInSentence}: FAQ
          </h2>
          <div className="mt-4 space-y-3">
            {faq.map((item, index) => (
              <details key={item.question} open={index === 0} className="group rounded-2xl border border-slate-200 bg-white">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                  <h3 className="text-base">{item.question}</h3>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="size-5 shrink-0 fill-slate-500 transition-transform group-open:rotate-180"
                  >
                    <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
                  </svg>
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-slate-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ───────────── Related corridors (internal linking) ───────────── */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <nav aria-labelledby="related-talent-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 id="related-talent-heading" className="text-lg font-bold text-ink">
              Compare other talent markets from {company.nameInSentence}
            </h2>
            <ul className="mt-2 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              {otherTalent.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/hire/${buildCorridorSlug(company.slug, t.slug)}`}
                    className="flex min-h-12 items-center justify-between gap-2 text-sm text-slate-700 hover:text-brand-700"
                  >
                    <span className="underline-offset-4 hover:underline">Hire in {t.countryName}</span>
                    <span className="text-xs text-slate-500">{formatPercent(t.employerTaxRate)} tax</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="related-company-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 id="related-company-heading" className="text-lg font-bold text-ink">
              Hiring in {talent.countryName} from another country
            </h2>
            <ul className="mt-2 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              {otherCompanies.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/hire/${buildCorridorSlug(c.slug, talent.slug)}`}
                    className="flex min-h-12 items-center text-sm text-slate-700 underline-offset-4 hover:text-brand-700 hover:underline"
                  >
                    From {c.countryName} ({c.currencyCode})
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-slate-500">
          Estimates use indicative {DATA_YEAR} statutory rates and reference exchange rates for planning. Contribution
          caps, regional surcharges, collective agreements and individual tax status can change real costs. This
          page is not tax or legal advice — confirm with a local adviser or an Employer of Record before hiring.
        </p>
      </div>
    </>
  );
}
