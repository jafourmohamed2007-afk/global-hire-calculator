/**
 * Employer of Record (EOR) referral partners shown next to calculator results.
 * Affiliate URLs are read from server-side environment variables at build time.
 */

export interface EorPartner {
  readonly id: 'deel' | 'remote';
  readonly name: string;
  readonly badge: string;
  readonly tagline: string;
  readonly highlights: readonly string[];
  /** Published list price for EOR employees, USD per employee per month. */
  readonly fromPriceMonthlyUSD: number;
  /** Short pricing qualifier shown under the CTA. */
  readonly priceNote: string;
  readonly href: string;
  /** Tailwind classes for the monogram tile. */
  readonly accentClass: string;
}

/** Published EOR list price of both Deel and Remote (Nov 2026), used for the optional "EOR fee" line. */
export const EOR_MONTHLY_FEE_USD = 599;

export const EOR_PARTNERS: readonly EorPartner[] = [
  {
    id: 'deel',
    name: 'Deel',
    badge: 'Most popular',
    tagline: 'Employer of Record and contractor management in one global platform.',
    highlights: [
      'Compliant local employment contracts',
      'Payroll, benefits and statutory filings handled',
      'Switch contractors to full employees later',
    ],
    fromPriceMonthlyUSD: 599,
    priceNote: 'list price; volume discounts available',
    href: process.env.DEEL_AFFILIATE_URL ?? 'https://www.deel.com/',
    accentClass: 'bg-slate-900 text-white',
  },
  {
    id: 'remote',
    name: 'Remote',
    badge: 'Owned entities',
    tagline: 'Global EOR built on Remote-owned local legal entities.',
    highlights: [
      'Local payroll, taxes and benefits',
      'IP and invoice protection built in',
      'Localized benefits packages',
    ],
    fromPriceMonthlyUSD: 599,
    priceNote: 'billed annually ($699 billed monthly)',
    href: process.env.REMOTE_AFFILIATE_URL ?? 'https://remote.com/',
    accentClass: 'bg-blue-600 text-white',
  },
];
