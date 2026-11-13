import { createHash } from 'node:crypto';
import { requireValue } from './core.ts';

/** Public source requests deliberately carry no destination token. */
export class GitHub {
  readonly repository: string;
  private readonly token?: string;
  constructor(repository: string, token?: string) {
    this.repository = repository;
    this.token = token;
    requireValue(
      ['aalexlpez/miminiapp', 'soycerobytes/miminiapp'].includes(repository),
      'Unapproved repository.',
    );
    requireValue(
      !token || repository === 'soycerobytes/miminiapp',
      'Destination token cannot be sent to source.',
    );
  }
  async request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
    requireValue(
      (path === '' || path.startsWith('/')) && !path.includes('..'),
      'Invalid API path.',
    );
    requireValue(
      method === 'GET' || !!this.token,
      'Writes require a destination token.',
    );
    const response = await fetch(
      `https://api.github.com/repos/${this.repository}${path}`,
      {
        method,
        redirect: 'error',
        signal: AbortSignal.timeout(30_000),
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      },
    );
    requireValue(
      response.ok,
      `GitHub ${method} ${path}: HTTP ${response.status}.`,
    );
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
  async pages<T>(path: string, key: string): Promise<T[]> {
    const result: T[] = [];
    for (let page = 1; page <= 20; page++) {
      const data = await this.request<Record<string, T[]>>(
        `${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`,
      );
      requireValue(Array.isArray(data[key]), 'Incomplete API collection.');
      result.push(...data[key]);
      if (data[key].length < 100) return result;
    }
    throw new Error('Collection exceeds audited pagination limit.');
  }
  async blob(sha: string) {
    const blob = await this.request<{
      encoding: string;
      content: string;
      size: number;
    }>(`/git/blobs/${sha}`);
    requireValue(
      blob.encoding === 'base64' && blob.size <= 4_000_000,
      'Unsupported or oversized source blob.',
    );
    const bytes = Buffer.from(blob.content, 'base64');
    requireValue(bytes.length === blob.size, 'Truncated blob.');
    requireValue(
      createHash('sha1')
        .update(`blob ${bytes.length}\0`)
        .update(bytes)
        .digest('hex') === sha,
      'Blob bytes do not match their Git identity.',
    );
    return bytes;
  }
}
