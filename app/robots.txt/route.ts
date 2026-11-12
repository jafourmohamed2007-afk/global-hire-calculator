import { requestOrigin } from '@/lib/sitemap';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const origin = requestOrigin(request);
  const body = ['User-Agent: *', 'Allow: /', 'Disallow: /hire?', 'Disallow: /api/', 'Disallow: /admin/', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' },
  });
}
