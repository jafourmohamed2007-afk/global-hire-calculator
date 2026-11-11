import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CalculateButton } from '@/components/CalculateButton';
import { CookieConsent, CookieSettingsButton } from '@/components/CookieConsent';
import { DATA_YEAR } from '@/data/country-matrix';
import { SHOW_PARTNER_OFFERS } from '@/data/partners';
import { consentBootstrapScript } from '@/lib/consent';
import {
  ADSENSE_CLIENT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  USE_GOOGLE_CMP,
} from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} (${DATA_YEAR})`,
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'cost to hire remote developer',
    'employer of record calculator',
    'international payroll tax calculator',
    'hire developer abroad cost',
    'EOR cost calculator',
    'global hiring compliance',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} (${DATA_YEAR})`,
    description: SITE_DESCRIPTION,
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} (${DATA_YEAR})`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: false, address: false, email: false },
  category: 'finance',
  ...(ADSENSE_CLIENT ? { other: { 'google-adsense-account': ADSENSE_CLIENT } } : {}),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2553eb',
  colorScheme: 'light',
};

const FOOTER_SECTIONS = [
  {
    title: 'Calculators',
    links: [
      { href: '/hire/us-to-india', label: 'US → India' },
      { href: '/hire/us-to-brazil', label: 'US → Brazil' },
      { href: '/hire/uk-to-poland', label: 'UK → Poland' },
      { href: '/hire/us-to-philippines', label: 'US → Philippines' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/blog', label: 'All guides' },
      { href: '/blog/true-cost-of-hiring-a-remote-developer-abroad', label: 'True cost of hiring abroad' },
      { href: '/blog/employer-of-record-vs-independent-contractor', label: 'EOR vs. contractor' },
      { href: '/blog/contractor-misclassification-risk-abroad', label: 'Misclassification risk' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy-policy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of use' },
      { href: '/cookie-policy', label: 'Cookie policy' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
  },
] as const;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-US" dir="ltr">
      <head>
        {/* Consent defaults must run before any Google ad script. */}
        {/* It also loads the AdSense library afterwards when NEXT_PUBLIC_ADSENSE_CLIENT is set. */}
        <script dangerouslySetInnerHTML={{ __html: consentBootstrapScript(USE_GOOGLE_CMP, ADSENSE_CLIENT) }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-hidden bg-slate-50 font-sans text-base leading-relaxed text-slate-800">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-700 focus:shadow-lg"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
          <nav
            aria-label="Primary"
            className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6"
          >
            <Link
              href="/"
              className="flex min-h-12 min-w-0 items-center gap-2.5 rounded-lg font-bold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-black text-white"
              >
                GH
              </span>
              <span className="hidden truncate text-base min-[400px]:inline sm:text-lg">
                Global<span className="text-brand-600">Hire</span> Calc
              </span>
              <span className="sr-only min-[400px]:hidden">{SITE_NAME}</span>
            </Link>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Link
                href="/blog"
                className="inline-flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                Guides
              </Link>
              <CalculateButton />
            </div>
          </nav>
        </header>

        <main id="main" className="w-full flex-1">
          {children}
        </main>

        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-bold text-ink">{SITE_NAME}</p>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Free planning estimates of salary, employer payroll taxes, mandatory benefits and compliance risk for
                  hiring remote talent across borders.
                </p>
              </div>
              {FOOTER_SECTIONS.map((section) => (
                <nav key={section.title} aria-label={section.title}>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{section.title}</p>
                  <ul className="mt-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex min-h-12 items-center text-sm font-medium text-slate-700 underline-offset-4 hover:text-brand-700 hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {section.title === 'Company' && (
                      <li>
                        <CookieSettingsButton />
                      </li>
                    )}
                  </ul>
                </nav>
              ))}
            </div>
            <div className="mt-8 space-y-2 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
              {SHOW_PARTNER_OFFERS && (
                <p>
                  <strong className="font-semibold text-slate-600">Affiliate disclosure:</strong> some links on this site
                  are referral links. We may earn a commission if you sign up with a partner, at no extra cost to you.
                  Partner placement never changes calculator results.
                </p>
              )}
              <p>
                <strong className="font-semibold text-slate-600">Not tax or legal advice:</strong> rates, caps and
                exchange rates are indicative {DATA_YEAR} planning figures. Confirm with a qualified local adviser or an
                Employer of Record before making a hiring decision.
              </p>
              <p>
                © {DATA_YEAR} {SITE_NAME}
              </p>
            </div>
          </div>
        </footer>

        {!USE_GOOGLE_CMP && <CookieConsent />}
      </body>
    </html>
  );
}
