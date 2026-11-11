/**
 * Review validation and automatic moderation, shared by the form (instant feedback)
 * and the server (the real gate). Pure functions, no I/O.
 *
 * Moderation never filters by star rating: negative reviews are published exactly like
 * positive ones (suppressing negative reviews is itself illegal under the US FTC rule on
 * consumer reviews). Only spam-like content is held for a manual look.
 */
import type { ReviewSubmission } from './types';

export const REVIEW_LIMITS = {
  nameMin: 2,
  nameMax: 50,
  roleMax: 60,
  textMin: 20,
  textMax: 1000,
  /** Submissions faster than this after opening the form are treated as bots. */
  minFillMs: 3000,
} as const;

export interface CleanReview {
  readonly name: string;
  readonly email: string;
  readonly role?: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly text: string;
}

export type ValidationResult =
  | { readonly ok: true; readonly value: CleanReview; readonly flags: string[] }
  | { readonly ok: false; readonly errors: Partial<Record<keyof ReviewSubmission | 'form', string>>; readonly bot?: true };

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const URL_PATTERN = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|xyz|ru|cn|info|biz|top|click|link|shop)\b)/i;
const CONTACT_PATTERN = /([^\s@]+@[^\s@]+\.[a-z]{2,}|\+?\d[\d\s().-]{8,}\d)/i;
const HTML_PATTERN = /<[^>]+>/;
const BLOCKED_WORDS = [
  'fuck', 'shit', 'bitch', 'cunt', 'asshole', 'bastard', 'dick',
  'porn', 'casino', 'viagra', 'cialis', 'escort', 'betting', 'crypto giveaway', 'forex signals', 'payday loan',
];

/** Collapses whitespace, removes control characters and trims. Keeps single line breaks in text. */
function clean(value: unknown, multiline = false): string {
  if (typeof value !== 'string') return '';
  const noControl = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028-\u202E]/g, '');
  if (!multiline) return noControl.replace(/\s+/g, ' ').trim();
  return noControl
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function hasBlockedWord(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((word) => new RegExp(`\\b${word.replace(/ /g, '\\s+')}`, 'i').test(lower));
}

function isShouting(text: string): boolean {
  const letters = text.replace(/[^A-Za-z]/g, '');
  if (letters.length < 20) return false;
  const upper = letters.replace(/[^A-Z]/g, '').length;
  return upper / letters.length > 0.6;
}

export function validateReview(raw: unknown, now: number = Date.now()): ValidationResult {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Partial<ReviewSubmission>;

  // Bot traps: silently rejected, never stored.
  if (clean(input.website) !== '') return { ok: false, errors: { form: 'Submission rejected.' }, bot: true };
  if (typeof input.startedAt === 'number' && now - input.startedAt < REVIEW_LIMITS.minFillMs) {
    return { ok: false, errors: { form: 'Submission rejected.' }, bot: true };
  }

  const name = clean(input.name);
  const email = clean(input.email).toLowerCase();
  const role = clean(input.role);
  const text = clean(input.text, true);
  const rating = Number(input.rating);

  const errors: Partial<Record<keyof ReviewSubmission | 'form', string>> = {};
  if (name.length < REVIEW_LIMITS.nameMin || name.length > REVIEW_LIMITS.nameMax) {
    errors.name = `Please enter a name between ${REVIEW_LIMITS.nameMin} and ${REVIEW_LIMITS.nameMax} characters.`;
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) errors.email = 'Please enter a valid email address.';
  if (role.length > REVIEW_LIMITS.roleMax) errors.role = `Please keep this under ${REVIEW_LIMITS.roleMax} characters.`;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = 'Please choose a rating from 1 to 5 stars.';
  if (text.length < REVIEW_LIMITS.textMin) errors.text = `Please write at least ${REVIEW_LIMITS.textMin} characters.`;
  if (text.length > REVIEW_LIMITS.textMax) errors.text = `Please keep your review under ${REVIEW_LIMITS.textMax} characters.`;
  if (input.consent !== true) errors.consent = 'Please confirm we can publish your review.';
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // Automatic moderation: anything suspicious is held for a manual look instead of auto-publishing.
  const flags: string[] = [];
  const combined = `${name} ${role} ${text}`;
  if (URL_PATTERN.test(combined)) flags.push('contains a link');
  if (CONTACT_PATTERN.test(`${role} ${text}`)) flags.push('contains contact details');
  if (HTML_PATTERN.test(combined)) flags.push('contains HTML');
  if (hasBlockedWord(combined)) flags.push('contains blocked words');
  if (isShouting(text)) flags.push('mostly capital letters');
  if (/(.)\1{6,}/.test(text)) flags.push('repeated characters');
  if (/\d{3,}/.test(name)) flags.push('unusual name');

  return {
    ok: true,
    value: { name, email, ...(role ? { role } : {}), rating: rating as 1 | 2 | 3 | 4 | 5, text },
    flags,
  };
}
