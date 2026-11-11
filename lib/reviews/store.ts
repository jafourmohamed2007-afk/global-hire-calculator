/**
 * Server-side review storage.
 *
 * - Production: Upstash Redis over its REST API (free tier; one click from the Vercel Marketplace,
 *   which sets UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN automatically).
 * - Local or self-hosted Node: a JSON file (default .data/reviews.json).
 * - Serverless without Redis configured: unavailable (the file system is read-only there).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ReviewStatus, StoredReview } from './types';

export interface ReviewStore {
  readonly kind: 'redis' | 'file';
  all(): Promise<StoredReview[]>;
  get(id: string): Promise<StoredReview | null>;
  save(review: StoredReview): Promise<void>;
  setStatus(id: string, status: ReviewStatus): Promise<StoredReview | null>;
  remove(id: string): Promise<void>;
  /** Reserves an email hash; resolves false if a review already used it. */
  claimEmail(emailHash: string): Promise<boolean>;
  releaseEmail(emailHash: string): Promise<void>;
  /** Counts a hit and resolves whether the key is still within `limit` for the window. */
  allowHit(key: string, limit: number, windowSeconds: number): Promise<boolean>;
}

const PREFIX = 'ghc:';

// ───────────────────────── Upstash Redis (REST) ─────────────────────────

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ''), token } : null;
}

function createRedisStore(config: { url: string; token: string }): ReviewStore {
  async function pipeline(commands: string[][]): Promise<unknown[]> {
    const response = await fetch(`${config.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Review storage error (${response.status})`);
    const results = (await response.json()) as Array<{ result?: unknown; error?: string }>;
    return results.map((entry) => {
      if (entry.error) throw new Error(`Review storage error: ${entry.error}`);
      return entry.result;
    });
  }

  const hashKey = `${PREFIX}reviews`;

  return {
    kind: 'redis',
    async all() {
      const [flat] = (await pipeline([['HGETALL', hashKey]])) as [string[] | null];
      const reviews: StoredReview[] = [];
      for (let i = 1; flat && i < flat.length; i += 2) reviews.push(JSON.parse(flat[i]!) as StoredReview);
      return reviews;
    },
    async get(id) {
      const [value] = (await pipeline([['HGET', hashKey, id]])) as [string | null];
      return value ? (JSON.parse(value) as StoredReview) : null;
    },
    async save(review) {
      await pipeline([['HSET', hashKey, review.id, JSON.stringify(review)]]);
    },
    async setStatus(id, status) {
      const current = await this.get(id);
      if (!current) return null;
      const updated = { ...current, status };
      await this.save(updated);
      return updated;
    },
    async remove(id) {
      await pipeline([['HDEL', hashKey, id]]);
    },
    async claimEmail(emailHash) {
      const [result] = await pipeline([['SET', `${PREFIX}review-email:${emailHash}`, '1', 'NX']]);
      return result === 'OK';
    },
    async releaseEmail(emailHash) {
      await pipeline([['DEL', `${PREFIX}review-email:${emailHash}`]]);
    },
    async allowHit(key, limit, windowSeconds) {
      const redisKey = `${PREFIX}rate:${key}`;
      const [count] = (await pipeline([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, String(windowSeconds), 'NX'],
      ])) as [number, number];
      return count <= limit;
    },
  };
}

// ───────────────────────── JSON file (local / self-hosted) ─────────────────────────

interface FileData {
  reviews: StoredReview[];
  emails: string[];
  rate: Record<string, { count: number; resetAt: number }>;
}

function createFileStore(filePath: string): ReviewStore {
  let queue: Promise<unknown> = Promise.resolve();

  async function read(): Promise<FileData> {
    try {
      return JSON.parse(await fs.readFile(filePath, 'utf8')) as FileData;
    } catch {
      return { reviews: [], emails: [], rate: {} };
    }
  }

  /** Serializes read-modify-write cycles so concurrent requests can't overwrite each other. */
  function mutate<T>(change: (data: FileData) => T): Promise<T> {
    const run = queue.then(async () => {
      const data = await read();
      const result = change(data);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      const tmp = `${filePath}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(data, null, 2));
      await fs.rename(tmp, filePath);
      return result;
    });
    queue = run.catch(() => undefined);
    return run;
  }

  return {
    kind: 'file',
    async all() {
      await queue;
      return (await read()).reviews;
    },
    async get(id) {
      await queue;
      return (await read()).reviews.find((review) => review.id === id) ?? null;
    },
    save(review) {
      return mutate((data) => {
        data.reviews = [...data.reviews.filter((r) => r.id !== review.id), review];
      });
    },
    setStatus(id, status) {
      return mutate((data) => {
        const index = data.reviews.findIndex((r) => r.id === id);
        if (index === -1) return null;
        const updated = { ...data.reviews[index]!, status };
        data.reviews[index] = updated;
        return updated;
      });
    },
    remove(id) {
      return mutate((data) => {
        data.reviews = data.reviews.filter((r) => r.id !== id);
      });
    },
    claimEmail(emailHash) {
      return mutate((data) => {
        if (data.emails.includes(emailHash)) return false;
        data.emails.push(emailHash);
        return true;
      });
    },
    releaseEmail(emailHash) {
      return mutate((data) => {
        data.emails = data.emails.filter((e) => e !== emailHash);
      });
    },
    allowHit(key, limit, windowSeconds) {
      return mutate((data) => {
        const now = Date.now();
        for (const [k, v] of Object.entries(data.rate)) if (v.resetAt <= now) delete data.rate[k];
        const entry = data.rate[key] ?? { count: 0, resetAt: now + windowSeconds * 1000 };
        entry.count += 1;
        data.rate[key] = entry;
        return entry.count <= limit;
      });
    },
  };
}

/** The configured store, or null when reviews can't be saved in this environment. */
export function getReviewStore(): ReviewStore | null {
  const redis = redisConfig();
  if (redis) return createRedisStore(redis);
  if (process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) return null;
  return createFileStore(process.env.REVIEWS_FILE || path.join(process.cwd(), '.data', 'reviews.json'));
}
