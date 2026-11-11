import type { Metadata } from 'next';
import Link from 'next/link';
import { CookieSettingsButton } from '@/components/CookieConsent';
import { PageShell } from '@/components/PageShell';
import { CONSENT_STORAGE_KEY } from '@/lib/consent';
import { POLICIES_LAST_UPDATED, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookie policy',
  description: `Which cookies and similar technologies ${SITE_NAME} uses, why, and how to change your choices.`,
  alternates: { canonical: '/cookie-policy' },
};

export default function CookiePolicyPage() {
  return (
    <PageShell title="Cookie policy" updated={POLICIES_LAST_UPDATED}>
      <div className="article-body">
        <p>
          Cookies are small files that websites store on your device. Similar technologies, such as your browser’s local
          storage, work in a similar way. This page explains what {SITE_NAME} uses and how you stay in control.
        </p>

        <h2>Strictly necessary</h2>
        <p>
          We store your cookie choice in local storage under the key <code>{CONSENT_STORAGE_KEY}</code>, so the banner
          doesn’t reappear on every page. This is needed to respect your choice and does not track you.
        </p>

        <h2>Advertising (only with your consent)</h2>
        <p>
          We use Google AdSense to show ads. With your consent, Google and its partners use cookies to show personalized ads
          and measure their performance. If you reject these cookies, ads that appear are non-personalized. Google may still
          use cookies or similar technologies to limit fraud and abuse and to cap how often an ad is shown. Read{' '}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            how Google uses cookies in advertising
          </a>
          .
        </p>

        <h2>Changing your choice</h2>
        <p>You can change or withdraw your consent at any time:</p>
        <div className="not-prose">
          <CookieSettingsButton />
        </div>
        <p>
          You can also delete cookies and site data in your browser settings, or opt out of personalized ads in{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          . For more on how we handle data, see our <Link href="/privacy-policy">privacy policy</Link>.
        </p>
      </div>
    </PageShell>
  );
}
