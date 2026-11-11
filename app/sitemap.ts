import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/data/articles';
import { getAllCorridors } from '@/data/country-matrix';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/blog'), lastModified, changeFrequency: 'weekly', priority: 0.8 },
    ...ARTICLES.map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
      lastModified: new Date(`${article.updated}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: absoluteUrl('/reviews'), lastModified, changeFrequency: 'daily' as const, priority: 0.5 },
    ...['/about', '/contact', '/privacy-policy', '/terms', '/cookie-policy', '/disclaimer'].map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
    ...getAllCorridors().map((corridor) => ({
      url: absoluteUrl(`/hire/${corridor.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: corridor.company.slug === 'us' ? 0.9 : 0.8,
    })),
  ];
}
