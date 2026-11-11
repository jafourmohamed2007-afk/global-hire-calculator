import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { COMPANY_COUNTRIES, FX_RATES_AS_OF, TALENT_COUNTRIES } from '@/data/country-matrix';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About us',
  description: `Who runs ${SITE_NAME}, how our hiring cost figures are researched and calculated, and how the site is funded.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE_NAME}`}
      intro="A free, independent tool that shows founders, HR teams and hiring managers what an international hire really costs before they make an offer."
    >
      <div className="article-body">
        <h2>Why we built it</h2>
        <p>
          Hiring a developer in another country looks simple until the first payroll. Employer social security, 13th-month
          salaries, contribution caps, currency swings and the risk of treating an employee as a contractor can add tens of
          thousands of dollars a year to a salary. That information is usually scattered across government sites in
          different languages and vendor pages written to sell a product.
        </p>
        <p>
          We bring it together in one place: a calculator that shows the base salary next to the true business cost, and
          guides that explain the rules behind the numbers.
        </p>

        <h2>What we cover</h2>
        <p>
          The calculator covers {TALENT_COUNTRIES.length} talent markets (
          {TALENT_COUNTRIES.map((country) => country.countryName).join(', ')}) for companies based in{' '}
          {COMPANY_COUNTRIES.length} countries — {TALENT_COUNTRIES.length * COMPANY_COUNTRIES.length} hiring corridors in
          total.
        </p>

        <h2>How we research and calculate</h2>
        <ul>
          <li>
            Employer costs are modelled component by component — every pension, health, housing and payroll levy has its
            own rate, salary cap and threshold, rather than a single flat percentage.
          </li>
          <li>
            Rates are checked against official sources where available and against established payroll guides, and every
            figure has a listed source.
          </li>
          <li>Exchange rates are mid-market reference rates, last updated on {FX_RATES_AS_OF}.</li>
          <li>
            Our calculations are covered by automated tests that compare the results with examples worked out by hand from
            the statutory rates.
          </li>
          <li>
            Rates were last reviewed in November 2026. Many countries change their caps and minimum wages in January and
            July.
          </li>
        </ul>

        <h2>Editorial independence and funding</h2>
        <p>
          The site is free to use and is funded by advertising. Advertisers have no influence over our figures, rankings or
          guides. If we ever add partner or referral links, we will label them clearly and explain them in our{' '}
          <Link href="/disclaimer">disclaimer</Link>.
        </p>

        <h2>Important</h2>
        <p>
          Our figures are planning estimates, not tax, legal or financial advice. Always confirm the details with a qualified
          local adviser or your payroll provider before you hire. Spotted something out of date?{' '}
          <Link href="/contact">Tell us</Link> and we will check it.
        </p>
      </div>
    </PageShell>
  );
}
