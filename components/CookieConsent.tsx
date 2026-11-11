'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CONSENT_OPEN_EVENT, applyConsent, readConsent, type ConsentChoice } from '@/lib/consent';

/**
 * Cookie consent banner. "Accept" and "Reject" have equal weight (GDPR/ePrivacy guidance).
 * Reopened from the footer's "Cookie settings" button.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  function choose(choice: ConsentChoice) {
    applyConsent(choice);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-text"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <div className="min-w-0 flex-1">
          <p id="cookie-consent-title" className="text-sm font-bold text-ink">
            We value your privacy
          </p>
          <p id="cookie-consent-text" className="mt-1 text-sm text-slate-600">
            We use cookies to run this site and, with your permission, Google AdSense uses cookies to show and measure
            personalized ads. You can change your choice at any time from “Cookie settings” in the footer.
          </p>
          <Link
            href="/cookie-policy"
            className="mt-1 inline-flex min-h-12 items-center text-sm font-semibold text-brand-700 underline underline-offset-2"
          >
            Read our cookie policy
          </Link>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="min-h-12 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer link that reopens the consent banner. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="flex min-h-12 items-center text-left text-sm font-medium text-slate-700 underline-offset-4 hover:text-brand-700 hover:underline"
    >
      Cookie settings
    </button>
  );
}
