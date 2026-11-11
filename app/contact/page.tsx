import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact us',
  description: `How to contact the ${SITE_NAME} team about corrections, feedback, reviews, privacy requests or partnerships.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact us"
      intro="Questions, corrections or feedback about the calculator? We read every message."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Email</p>
        <p className="mt-1 break-all text-xl font-bold text-ink">
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-12 items-center underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-2 text-sm text-slate-600">We aim to reply within a few business days.</p>
      </div>

      <div className="article-body mt-8">
        <h2>What to write to us about</h2>
        <ul>
          <li>
            <strong>Corrections:</strong> if a rate, cap or rule looks out of date, tell us the country and, if you can, a
            link to the official source.
          </li>
          <li>
            <strong>Reviews:</strong> you can publish a review yourself on our{' '}
            <Link href="/reviews">reviews page</Link>. Email us if you want yours changed or removed.
          </li>
          <li>
            <strong>Privacy requests:</strong> to exercise your data rights, see our{' '}
            <Link href="/privacy-policy">privacy policy</Link> and email us with the subject line “Privacy request”.
          </li>
          <li>
            <strong>Partnerships and advertising:</strong> include your company name and website.
          </li>
        </ul>
        <p>
          We can’t give individual tax or legal advice. For decisions about a specific hire, please speak to a qualified
          local adviser.
        </p>
      </div>
    </PageShell>
  );
}
