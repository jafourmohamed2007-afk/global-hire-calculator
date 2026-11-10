import type { MetadataRoute } from 'next';
import { getAllCorridors } from '@/data/country-matrix';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'weekly', priority: 1 },
    ...getAllCorridors().map((corridor) => ({
      url: absoluteUrl(`/hire/${corridor.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: corridor.company.slug === 'us' ? 0.9 : 0.8,
    })),
  ];
}
