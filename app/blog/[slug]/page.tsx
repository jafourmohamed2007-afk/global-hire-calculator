import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleBody } from '@/components/ArticleBody';
import { JsonLd } from '@/components/JsonLd';
import { PageShell } from '@/components/PageShell';
import { ARTICLES, formatArticleDate, getArticle, readingMinutes } from '@/data/articles';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'Guide not found', robots: { index: false } };
  const path = `/blog/${article.slug}`;
  return {
    title: { absolute: article.title },
    description: article.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url: path,
      siteName: SITE_NAME,
      publishedTime: article.published,
      modifiedTime: article.updated,
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.description },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/blog/${article.slug}`;
  const others = ARTICLES.filter((other) => other.slug !== article.slug).slice(0, 3);

  return (
    <PageShell
      title={article.title}
      breadcrumb={{ href: '/blog', label: 'Guides' }}
      intro={
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-brand-700">{article.category}</span> · By the {SITE_NAME} editorial
          team · Updated <time dateTime={article.updated}>{formatArticleDate(article.updated)}</time> ·{' '}
          {readingMinutes(article)} min read
        </p>
      }
    >
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              headline: article.title,
              description: article.description,
              datePublished: article.published,
              dateModified: article.updated,
              mainEntityOfPage: absoluteUrl(path),
              author: { '@type': 'Organization', name: `${SITE_NAME} editorial team`, url: absoluteUrl('/about') },
              publisher: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
              inLanguage: 'en-US',
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
                { '@type': 'ListItem', position: 2, name: 'Guides', item: absoluteUrl('/blog') },
                { '@type': 'ListItem', position: 3, name: article.title, item: absoluteUrl(path) },
              ],
            },
          ],
        }}
      />

      <article>
        <ArticleBody blocks={article.blocks} />

        <section aria-labelledby="sources-heading" className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 id="sources-heading" className="text-base font-bold text-ink">
            Sources
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            {article.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center text-brand-700 underline underline-offset-2"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Figures are planning estimates based on 2026 statutory rates and are not tax or legal advice.
          </p>
          <Link
            href="/disclaimer"
            className="inline-flex min-h-12 items-center text-sm font-semibold text-brand-700 underline underline-offset-2"
          >
            Read our disclaimer
          </Link>
        </section>
      </article>

      <nav aria-labelledby="more-guides-heading" className="mt-10">
        <h2 id="more-guides-heading" className="text-lg font-bold text-ink">
          More guides
        </h2>
        <ul className="mt-2 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/blog/${other.slug}`}
                className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-800 hover:text-brand-700"
              >
                {other.title}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageShell>
  );
}
