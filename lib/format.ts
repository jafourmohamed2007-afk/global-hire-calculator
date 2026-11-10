/**
 * Locale is pinned to en-US so server-rendered and client-rendered output match exactly
 * (prevents hydration mismatches across visitors' browser locales).
 */
const LOCALE = 'en-US';
const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(key: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, options);
    formatterCache.set(key, formatter);
  }
  return formatter;
}

export function formatCurrency(amount: number, currencyCode: string, compact = false): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return getFormatter(`c:${currencyCode}:${compact}`, {
    style: 'currency',
    currency: currencyCode,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
    minimumFractionDigits: 0,
  }).format(safe);
}

export function formatPercent(rate: number, maximumFractionDigits = 1): string {
  const safe = Number.isFinite(rate) ? rate : 0;
  return getFormatter(`p:${maximumFractionDigits}`, {
    style: 'percent',
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(safe);
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  const safe = Number.isFinite(value) ? value : 0;
  return getFormatter(`n:${maximumFractionDigits}`, { maximumFractionDigits }).format(safe);
}
