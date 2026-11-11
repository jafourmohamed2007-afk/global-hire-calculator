import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { CONTACT_EMAIL, POLICIES_LAST_UPDATED, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: `How ${SITE_NAME} collects, uses and protects information, including cookies and Google AdSense advertising.`,
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell title="Privacy policy" updated={POLICIES_LAST_UPDATED}>
      <div className="article-body">
        <p>
          This policy explains how {SITE_NAME} (“we”, “us”) handles information when you visit {SITE_URL} (the “Site”).
          If you have questions, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Calculator inputs:</strong> salaries and countries you enter are processed in your browser to show
            results. We do not store them on our servers.
          </li>
          <li>
            <strong>Your choices:</strong> we store your cookie choice in your browser’s local storage so we don’t ask again
            on every page.
          </li>
          <li>
            <strong>Technical data:</strong> like most websites, our hosting provider automatically records standard server
            logs (IP address, browser type, pages requested, date and time) to deliver the Site and keep it secure.
          </li>
          <li>
            <strong>Messages you send us:</strong> if you email us, we receive your email address and message and use them
            only to reply and, if you agree, to publish your review.
          </li>
        </ul>

        <h2>Advertising and Google AdSense</h2>
        <p>
          We use Google AdSense to show advertising. Third-party vendors, including Google, use cookies to serve ads based on
          your prior visits to this Site or other websites. Google’s use of advertising cookies enables it and its partners
          to serve ads to you based on your visits to this Site and/or other sites on the internet.
        </p>
        <ul>
          <li>
            You can opt out of personalized advertising in{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            You can opt out of some third-party vendors’ use of cookies for personalized advertising at{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            .
          </li>
          <li>
            Learn how Google uses information from sites that use its services at{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              policies.google.com/technologies/partner-sites
            </a>
            .
          </li>
        </ul>
        <p>
          Until you make a choice in our cookie banner, ad requests are paused. If you reject non-essential cookies, Google
          is asked to show only non-personalized ads. You can change your choice at any time with “Cookie settings” in the
          footer. See our <Link href="/cookie-policy">cookie policy</Link> for details.
        </p>

        <h2>How we use information</h2>
        <ul>
          <li>To provide, maintain and secure the Site.</li>
          <li>To understand which pages are useful and improve our content.</li>
          <li>To show advertising that funds the Site, in line with your consent choices.</li>
          <li>To reply to messages and handle privacy requests.</li>
        </ul>
        <p>We do not sell your personal information.</p>

        <h2>Legal bases (EEA, UK and Switzerland)</h2>
        <p>
          We rely on your consent for advertising and analytics cookies, and on our legitimate interests to operate and
          secure the Site. You can withdraw consent at any time without affecting earlier processing.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live (for example under the GDPR, UK GDPR or California privacy laws), you may have the
          right to access, correct, delete or receive a copy of your personal information, to object to or restrict
          processing, and to opt out of the sale or sharing of personal information for targeted advertising. To make a
          request, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You may also complain to your local data
          protection authority.
        </p>

        <h2>Data retention</h2>
        <p>
          Server logs are kept only as long as needed for security and troubleshooting. Emails are kept for as long as
          needed to handle your request. Cookie choices stay in your browser until you clear them.
        </p>

        <h2>Children</h2>
        <p>The Site is intended for businesses and adults. It is not directed to children under 16.</p>

        <h2>International transfers</h2>
        <p>
          Our hosting and advertising providers may process information in countries other than yours, using safeguards
          such as standard contractual clauses where required.
        </p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy. The date at the top shows when it last changed.</p>
      </div>
    </PageShell>
  );
}
