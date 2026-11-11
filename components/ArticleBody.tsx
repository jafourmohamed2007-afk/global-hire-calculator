import Link from 'next/link';
import type { ReactNode } from 'react';
import { TALENT_COUNTRIES } from '@/data/country-matrix';
import type { ArticleBlock } from '@/data/articles/types';
import { calculateHireCost } from '@/lib/cost-engine';
import { formatCurrency, formatPercent } from '@/lib/format';

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

/** Renders **bold** and [text](href) inside article text. */
export function InlineText({ text }: { text: string }): ReactNode {
  return text.split(INLINE_PATTERN).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link as unknown as [string, string, string];
      return href.startsWith('/') ? (
        <Link key={index} href={href} className="font-medium text-brand-700 underline underline-offset-2">
          {label}
        </Link>
      ) : (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 underline underline-offset-2"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

function CostTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="px-3 pt-3 text-left text-xs text-slate-500">
          Mid-level developer at the market mid-point, employed directly (no EOR fee). Calculated with the same engine
          as the calculator.
        </caption>
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-semibold">Country</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">Base salary</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">Employer taxes</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">Mandatory benefits</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">True cost</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">Above base</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 tabular-nums">
          {TALENT_COUNTRIES.map((country) => {
            const cost = calculateHireCost(country, country.avgDevSalaryUSD);
            return (
              <tr key={country.slug}>
                <th scope="row" className="px-3 py-2.5 font-semibold text-ink">
                  <Link href={`/hire/us-to-${country.slug}`} className="underline-offset-2 hover:underline">
                    {country.countryName}
                  </Link>
                </th>
                <td className="px-3 py-2.5">{formatCurrency(cost.baseSalaryUSD, 'USD')}</td>
                <td className="px-3 py-2.5">{formatPercent(cost.effectiveEmployerTaxRate)}</td>
                <td className="px-3 py-2.5">{formatPercent(country.mandatoryBenefitsRate)}</td>
                <td className="px-3 py-2.5 font-semibold text-ink">{formatCurrency(cost.trueCostUSD, 'USD')}</td>
                <td className="px-3 py-2.5">+{formatPercent(cost.trueCostUSD / cost.baseSalaryUSD - 1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ArticleBody({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={index}>{block.text}</h2>;
          case 'h3':
            return <h3 key={index}>{block.text}</h3>;
          case 'p':
            return (
              <p key={index}>
                <InlineText text={block.text} />
              </p>
            );
          case 'ul':
          case 'ol': {
            const List = block.type;
            return (
              <List key={index}>
                {block.items.map((item) => (
                  <li key={item}>
                    <InlineText text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case 'table':
            return (
              <div key={index} className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[30rem] text-left text-sm">
                  <caption className="px-3 pt-3 text-left text-xs text-slate-500">{block.caption}</caption>
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      {block.head.map((cell) => (
                        <th key={cell} scope="col" className="px-3 py-2.5 font-semibold">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 tabular-nums">
                    {block.rows.map((row) => (
                      <tr key={row.join('|')}>
                        {row.map((cell, cellIndex) =>
                          cellIndex === 0 ? (
                            <th key={cellIndex} scope="row" className="px-3 py-2.5 font-semibold text-ink">
                              <InlineText text={cell} />
                            </th>
                          ) : (
                            <td key={cellIndex} className="px-3 py-2.5">
                              <InlineText text={cell} />
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'callout':
            return (
              <aside key={index} className="my-6 rounded-2xl border border-brand-200 bg-brand-50 p-4">
                <p className="!mt-0 font-bold text-ink">{block.title}</p>
                <p className="!mt-1 text-sm">
                  <InlineText text={block.text} />
                </p>
              </aside>
            );
          case 'cost-table':
            return <CostTable key={index} />;
          case 'cta':
            return (
              <p key={index} className="!my-6">
                <Link
                  href={`/hire/${block.corridor}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 font-semibold text-white no-underline hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {block.label} <span aria-hidden="true">→</span>
                </Link>
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
