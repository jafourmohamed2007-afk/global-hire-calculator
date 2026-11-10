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
