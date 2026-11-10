import { EOR_PARTNERS } from '@/data/partners';
import { formatCurrency } from '@/lib/format';

interface PartnerCardsProps {
  /** Country the visitor is hiring in; omit for a generic global placement. */
  readonly talentCountryName?: string;
  readonly heading?: string;
}

export function PartnerCards({ talentCountryName, heading }: PartnerCardsProps) {
  const where = talentCountryName ? `in ${talentCountryName}` : 'globally';
  return (
    <section
      aria-labelledby="eor-partners-heading"
      className="rounded-2xl border-2 border-brand-200 bg-gradient-to-b from-brand-50 to-white p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id="eor-partners-heading" className="text-lg font-bold tracking-tight text-ink">
          {heading ?? `Hire ${where} compliantly — without a local entity`}
        </h2>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Sponsored</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        An Employer of Record legally employs your hire, runs local payroll and files every tax for you.
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {EOR_PARTNERS.map((partner) => (
          <li key={partner.id}>
            <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`grid size-11 shrink-0 place-items-center rounded-xl text-lg font-black ${partner.accentClass}`}
                >
                  {partner.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-ink">{partner.name}</h3>
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-800">
                      {partner.badge}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{partner.tagline}</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {partner.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="mt-0.5 size-4 shrink-0 fill-emerald-600"
                    >
                      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4">
                <a
                  href={partner.href}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  Hire {where} with {partner.name}
                  <span aria-hidden="true">→</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <p className="mt-2 text-center text-xs text-slate-500">
                  EOR from ~{formatCurrency(partner.fromPriceMonthlyUSD, 'USD')}/employee/month · list price, confirm
                  on site
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-slate-500">
        Affiliate links: we may earn a referral commission at no cost to you.
      </p>
    </section>
  );
}
