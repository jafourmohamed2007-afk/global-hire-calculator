import { ARTICLES } from '@/data/articles';
import { getAllCorridors } from '@/data/country-matrix';
import { SITE_URL } from '@/lib/site';

/** Date the calculator data and static pages were last reviewed (ISO). Update when content changes. */
export const CONTENT_LAST_UPDATED = '2026-11-11';

export interface SitemapEntry {
  readonly path: string;
  readonly lastModified?: string;
  readonly changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  readonly priority: number;
}

/** Every public page that should be indexed. */
export function sitemapEntries(): SitemapEntry[] {
  return [
    { path: '/', lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'weekly', priority: 1 },
    { path: '/blog', lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    ...ARTICLES.map((article) => ({
      path: `/blog/${article.slug}`,
      lastModified: article.updated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getAllCorridors().map((corridor) => ({
      path: `/hire/${corridor.slug}`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: corridor.company.slug === 'us' ? 0.9 : 0.8,
    })),
    { path: '/reviews', changeFrequency: 'daily', priority: 0.5 },
    ...['/about', '/contact', '/privacy-policy', '/terms', '/cookie-policy', '/disclaimer'].map((path) => ({
      path,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}

const HOST_PATTERN = /^(?=.{1,253}(?::\d{1,5})?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*(?::\d{1,5})?$/i;

/**
 * The origin the request was made to (e.g. https://www.example.com).
 * Search Console only accepts sitemap URLs on the same host as the sitemap itself, so the
 * sitemap and robots.txt must use the domain they were requested on, not a fixed setting.
 */
export function requestOrigin(request: Request): string {
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '')
    .split(',')[0]!
    .trim()
    .toLowerCase();
  if (!HOST_PATTERN.test(host)) return SITE_URL;
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto = forwardedProto === 'http' || forwardedProto === 'https' ? forwardedProto : isLocal ? 'http' : 'https';
  return `${proto}://${host}`;
}

export function sitemapXml(origin: string): string {
  const urls = sitemapEntries()
    .map((entry) => {
      const lastmod = entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : '';
      return `<url><loc>${origin}${entry.path}</loc>${lastmod}<changefreq>${entry.changeFrequency}</changefreq><priority>${entry.priority}</priority></url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
