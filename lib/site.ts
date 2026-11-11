function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

export const SITE_NAME = 'Global Remote Hire Tax & Cost Calculator';
export const SITE_SHORT_NAME = 'GlobalHire Calc';
export const SITE_URL = resolveSiteUrl();
export const SITE_DESCRIPTION =
  'Calculate the true cost of hiring a remote developer abroad: base salary, employer payroll taxes, mandatory benefits, currency conversions and compliance risk — instantly, for free.';

export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Google AdSense publisher ID, e.g. "ca-pub-1234567890123456". Ads and ads.txt stay off until set. */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || '';

/**
 * Set to "true" once Google's certified consent message (AdSense → Privacy & messaging) is enabled,
 * so visitors don't see two cookie banners.
 */
export const USE_GOOGLE_CMP = process.env.NEXT_PUBLIC_USE_GOOGLE_CMP === 'true';

function resolveContactEmail(): string {
  const explicit = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (explicit) return explicit;
  const host = new URL(SITE_URL).hostname.replace(/^www\./, '');
  return `contact@${host}`;
}

/** Public contact address shown on the Contact, Privacy and Terms pages. */
export const CONTACT_EMAIL = resolveContactEmail();

/** Optional link to a feedback/review form (e.g. a Google Form) for collecting genuine user reviews. */
export const FEEDBACK_URL = process.env.NEXT_PUBLIC_FEEDBACK_URL?.trim() || '';

/** Date the legal pages were last updated. */
export const POLICIES_LAST_UPDATED = '11 November 2026';
