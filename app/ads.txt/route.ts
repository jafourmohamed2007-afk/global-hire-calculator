import { ADSENSE_CLIENT } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Authorized Digital Sellers file required by AdSense.
 * Served only when NEXT_PUBLIC_ADSENSE_CLIENT is set (e.g. ca-pub-1234567890123456).
 */
export function GET() {
  if (!ADSENSE_CLIENT) {
    return new Response('ads.txt is not configured yet.\n', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }
  const publisherId = ADSENSE_CLIENT.replace(/^ca-/, '');
  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
