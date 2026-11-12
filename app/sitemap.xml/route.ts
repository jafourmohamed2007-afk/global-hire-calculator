import { requestOrigin, sitemapXml } from '@/lib/sitemap';

// Built per request so every URL uses the domain the sitemap was fetched from.
export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  return new Response(sitemapXml(requestOrigin(request)), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
