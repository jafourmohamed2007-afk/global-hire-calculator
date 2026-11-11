import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { PageShell } from '@/components/PageShell';
import { ARTICLES, formatArticleDate, readingMinutes } from '@/data/articles';
import { DATA_YEAR } from '@/data/country-matrix';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

const TITLE = `Global Hiring Guides (${DATA_YEAR})`;
const DESCRIPTION =
  'Practical guides to hiring developers abroad: employer taxes, Employer of Record vs. contractors, misclassification risk and country-by-country payroll costs.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: { type: 'website', title: TITLE, description: DESCRIPTION, url: '/blog' },
};

export default function BlogIndexPage() {
  return (
    <PageShell
      title="Global hiring guides"
      intro="Plain-English guides to the true cost and legal side of hiring developers in other countries, written with the same verified 2026 figures as our calculator."
    >
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `${SITE_NAME} guides`,
          url: absoluteUrl('/blog'),
          description: DESCRIPTION,
          blogPost: ARTICLES.map((article) => ({
            '@type': 'BlogPosting',
            headline: article.title,
            url: absoluteUrl(`/blog/${article.slug}`),
            datePublished: article.published,
            dateModified: article.updated,
          })),
        }}
      />
      <ul className="grid grid-cols-1 gap-3">
        {ARTICLES.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="group block rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:border-brand-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{article.category}</p>
              <h2 className="mt-1 text-lg font-bold leading-snug text-ink group-hover:text-brand-700">{article.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{article.description}</p>
              <p className="mt-3 text-xs text-slate-500">
                <time dateTime={article.updated}>{formatArticleDate(article.updated)}</time> ·{' '}
                {readingMinutes(article)} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
