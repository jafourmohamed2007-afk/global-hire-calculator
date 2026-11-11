import { createHash, timingSafeEqual } from 'node:crypto';

/** One-way hash so emails and IP addresses can be compared without being exposed in keys. */
export function hashIdentifier(value: string): string {
  const salt = process.env.REVIEWS_HASH_SALT || 'global-hire-calculator';
  return createHash('sha256').update(`${salt}:${value.trim().toLowerCase()}`).digest('hex').slice(0, 32);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

/** Constant-time check of the admin token. Admin is disabled when no token is configured. */
export function isAdmin(request: Request): boolean {
  const expected = process.env.REVIEWS_ADMIN_TOKEN;
  if (!expected || expected.length < 16) return false;
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
