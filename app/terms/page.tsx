import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { CONTACT_EMAIL, POLICIES_LAST_UPDATED, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: `The terms that apply when you use ${SITE_NAME} and its calculator and guides.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <PageShell title="Terms of use" updated={POLICIES_LAST_UPDATED}>
      <div className="article-body">
        <p>By using {SITE_NAME} (the “Site”), you agree to these terms. If you don’t agree, please don’t use the Site.</p>

        <h2>Information only</h2>
        <p>
          The calculator and guides provide general planning estimates. They are not tax, legal, accounting or financial
          advice, and they don’t create an adviser–client relationship. Laws, rates and exchange rates change, and your
          situation may differ. Confirm all figures with a qualified professional before you act. See our{' '}
          <Link href="/disclaimer">disclaimer</Link>.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Don’t use the Site for anything unlawful.</li>
          <li>Don’t try to disrupt, overload or gain unauthorized access to the Site.</li>
          <li>Don’t scrape or copy large parts of the Site for republication without permission.</li>
        </ul>

        <h2>Intellectual property</h2>
        <p>
          The Site’s text, design and code are owned by us or our licensors. You may quote short extracts with a link back
          to the source page.
        </p>

        <h2>Third-party links and advertising</h2>
        <p>
          The Site contains links to other websites and shows ads from third parties. We aren’t responsible for their
          content, products or privacy practices.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          The Site is provided “as is”, without warranties of any kind. To the fullest extent permitted by law, we are not
          liable for any loss arising from your use of, or reliance on, the Site. Nothing in these terms limits liability
          that cannot be limited by law.
        </p>

        <h2>Changes</h2>
        <p>We may update these terms. The date at the top shows when they last changed.</p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </PageShell>
  );
}
