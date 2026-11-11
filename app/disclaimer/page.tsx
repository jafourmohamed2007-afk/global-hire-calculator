import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { FX_RATES_AS_OF } from '@/data/country-matrix';
import { SHOW_PARTNER_OFFERS } from '@/data/partners';
import { POLICIES_LAST_UPDATED, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `Important information about the accuracy and limits of ${SITE_NAME}'s estimates, advertising and links.`,
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <PageShell title="Disclaimer" updated={POLICIES_LAST_UPDATED}>
      <div className="article-body">
        <h2>Not professional advice</h2>
        <p>
          {SITE_NAME} provides general information to help you plan. It is not tax, legal, accounting, immigration or
          financial advice. Employment law and payroll rules are complex and change often; always get advice from a
          qualified professional in the relevant country before hiring.
        </p>

        <h2>Accuracy of estimates</h2>
        <ul>
          <li>Rates and caps reflect our research into 2026 rules and may not capture every regional or sector rule.</li>
          <li>Exchange rates are indicative mid-market rates from {FX_RATES_AS_OF}; your bank or provider will use its own.</li>
          <li>
            Salary ranges come from public salary surveys, which vary widely. Real offers depend on skills, seniority and
            location.
          </li>
          <li>Employer of Record fees shown are typical published list prices and may differ from your quote.</li>
        </ul>
        <p>
          Found an error? <Link href="/contact">Let us know</Link> and we will review it.
        </p>

        <h2>Advertising</h2>
        <p>
          The Site is funded by advertising, including Google AdSense. Ads are clearly separate from our content, and
          advertisers do not influence our calculations or guides.
        </p>

        <h2>Affiliate links</h2>
        <p>
          {SHOW_PARTNER_OFFERS
            ? 'Some links to Employer of Record providers are referral links. If you sign up through them, we may earn a commission at no extra cost to you. Partner placement never changes calculator results.'
            : 'We do not currently use affiliate or referral links. If we add them in the future, they will be clearly labelled and disclosed here.'}
        </p>

        <h2>External links</h2>
        <p>
          We link to official sources and other websites for reference. We are not responsible for their content or
          availability.
        </p>
      </div>
    </PageShell>
  );
}
