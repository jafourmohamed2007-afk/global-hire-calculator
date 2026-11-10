import { redirect } from 'next/navigation';
import { buildCorridorSlug, getCompanyCountry, getTalentCountry } from '@/data/country-matrix';

interface HireIndexProps {
  searchParams: Promise<{ from?: string | string[]; to?: string | string[] }>;
}

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

/**
 * No-JavaScript fallback for the homepage selector form (`GET /hire?from=us&to=india`).
 * Validates both countries and issues a redirect to the canonical `/hire/[slug]` page.
 */
export default async function HireIndexPage({ searchParams }: HireIndexProps) {
  const params = await searchParams;
  const company = getCompanyCountry(first(params.from));
  const talent = getTalentCountry(first(params.to));

  if (company && talent) redirect(`/hire/${buildCorridorSlug(company.slug, talent.slug)}`);
  redirect('/#calculator');
}
