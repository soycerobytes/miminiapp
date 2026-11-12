import { createHash } from 'node:crypto';

/** Read-only checks executed by GitHub Actions, never by the Codex runtime. */
export interface StagingAccessReport {
  schemaVersion: 1;
  worker: 'miminiapp-staging';
  readonly: true;
  stagingReadVerified: true;
  workersDevEnabled: true;
  previewUrlsEnabled: boolean | null;
  accountOwnedTokenVerification: 'active' | 'not-readable';
  otherWorkerRead: 'denied' | 'inconclusive-not-found';
  otherWorkerHttpStatus: number;
  scopeEvidence: 'owner-attested-per-worker-editor';
  writeIsolation: 'not-tested';
}

export async function probeStagingAccess(options: {
  accountId: string;
  accountIdSha256: string;
  token: string;
  worker?: string;
  fetch?: typeof fetch;
}): Promise<StagingAccessReport> {
  if (
    !/^[a-f0-9]{32}$/.test(options.accountId) ||
    !/^[a-f0-9]{64}$/.test(options.accountIdSha256) ||
    createHash('sha256').update(options.accountId).digest('hex') !==
      options.accountIdSha256 ||
    !options.token ||
    (options.worker !== undefined && options.worker !== 'miminiapp-staging')
  )
    throw new Error(
      'An explicit account, staging Worker and token are required.',
    );

  const request = options.fetch ?? globalThis.fetch;
  const base = `https://api.cloudflare.com/client/v4/accounts/${options.accountId}`;
  async function get(path: string) {
    try {
      return await request(`${base}${path}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${options.token}`,
          Accept: 'application/json',
        },
        redirect: 'error',
        cache: 'no-store',
        signal: AbortSignal.timeout(20_000),
      });
    } catch {
      // Fetch errors can contain headers or provider data. Never relay them.
      throw new Error(
        'Cloudflare read-only probe could not receive a response.',
      );
    }
  }
  async function object(response: Response) {
    try {
      if (!response.ok) throw new Error();
      const text = await response.text();
      if (text.length > 262144) throw new Error();
      const value = JSON.parse(text) as {
        success?: boolean;
        result?: Record<string, unknown>;
      };
      if (
        value.success !== true ||
        !value.result ||
        typeof value.result !== 'object' ||
        Array.isArray(value.result)
      )
        throw new Error();
      return value.result;
    } catch {
      throw new Error(
        'Cloudflare returned an invalid or unsuccessful probe response.',
      );
    }
  }
  async function discard(response: Response) {
    try {
      await response.body?.cancel();
    } catch {
      throw new Error('Cloudflare probe could not close a response safely.');
    }
  }

  await object(await get('/workers/scripts/miminiapp-staging/settings'));
  const subdomain = await object(
    await get('/workers/scripts/miminiapp-staging/subdomain'),
  );
  if (subdomain.enabled !== true)
    throw new Error('The existing staging Worker does not enable workers.dev.');

  const verification = await get('/tokens/verify');
  let accountOwnedTokenVerification: 'active' | 'not-readable' = 'not-readable';
  if (verification.ok) {
    const token = await object(verification);
    if (token.status !== 'active')
      throw new Error('The account-owned token is not active.');
    accountOwnedTokenVerification = 'active';
  } else {
    if (verification.status === 401)
      throw new Error(
        'Cloudflare token authentication failed; publication is blocked.',
      );
    if (![403, 404].includes(verification.status))
      throw new Error(
        'Token verification is unavailable; publication is blocked.',
      );
    await discard(verification);
  }

  // A GET never creates production or changes another Worker's settings.
  const other = await get('/workers/scripts/miminiapp/settings');
  const otherWorkerHttpStatus = other.status;
  await discard(other);
  if (other.ok)
    throw new Error(
      'The staging token can read another Worker; publication is blocked.',
    );
  if (![403, 404].includes(other.status))
    throw new Error(
      'The other-Worker read check is inconclusive; publication is blocked.',
    );

  return {
    schemaVersion: 1,
    worker: 'miminiapp-staging',
    readonly: true,
    stagingReadVerified: true,
    workersDevEnabled: true,
    previewUrlsEnabled:
      typeof subdomain.previews_enabled === 'boolean'
        ? subdomain.previews_enabled
        : null,
    accountOwnedTokenVerification,
    otherWorkerRead: other.status === 404 ? 'inconclusive-not-found' : 'denied',
    otherWorkerHttpStatus,
    scopeEvidence: 'owner-attested-per-worker-editor',
    writeIsolation: 'not-tested',
  };
}
