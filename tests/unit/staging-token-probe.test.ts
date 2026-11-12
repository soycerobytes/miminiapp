import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { probeStagingAccess } from '../../scripts/release/cloudflare.ts';

const accountId = 'a'.repeat(32);
const accountIdSha256 = createHash('sha256').update(accountId).digest('hex');
const token = 'private-probe-token-never-log';
const ok = (result: object) => Response.json({ success: true, result });

function transport(otherStatus = 403, verifyStatus = 200) {
  return vi.fn<typeof fetch>(async (url, init) => {
    const path = new URL(String(url));
    expect(path.origin).toBe('https://api.cloudflare.com');
    expect(path.pathname.startsWith(`/client/v4/accounts/${accountId}/`)).toBe(
      true,
    );
    expect(init?.method).toBe('GET');
    expect(init?.redirect).toBe('error');
    expect(init?.cache).toBe('no-store');
    expect(new Headers(init?.headers).get('Authorization')).toBe(
      `Bearer ${token}`,
    );
    if (path.pathname.endsWith('/miminiapp-staging/settings'))
      return ok({ bindings: [{ name: 'DO_NOT_ECHO', text: token }] });
    if (path.pathname.endsWith('/miminiapp-staging/subdomain'))
      return ok({ enabled: true, previews_enabled: false });
    if (path.pathname.endsWith('/tokens/verify'))
      return verifyStatus === 200
        ? ok({ id: 'sensitive-token-id', status: 'active' })
        : new Response('', { status: verifyStatus });
    if (path.pathname.endsWith('/miminiapp/settings'))
      return new Response(token, { status: otherStatus });
    throw new Error('Unexpected endpoint');
  });
}

describe('read-only staging token check', () => {
  it('checks only the fixed account and endpoints without returning credentials or provider data', async () => {
    const request = transport();
    const report = await probeStagingAccess({
      accountId,
      accountIdSha256,
      token,
      fetch: request,
    });
    expect(request).toHaveBeenCalledTimes(4);
    expect(report).toMatchObject({
      worker: 'miminiapp-staging',
      readonly: true,
      stagingReadVerified: true,
      otherWorkerRead: 'denied',
      accountOwnedTokenVerification: 'active',
      scopeEvidence: 'owner-attested-per-worker-editor',
      writeIsolation: 'not-tested',
    });
    expect(JSON.stringify(report)).not.toMatch(
      /private-probe-token|sensitive-token-id|DO_NOT_ECHO/,
    );
    expect(JSON.stringify(report)).not.toContain(accountId);
  });

  it('reports an absent other Worker as inconclusive rather than isolation proof', async () => {
    const report = await probeStagingAccess({
      accountId,
      accountIdSha256,
      token,
      fetch: transport(404),
    });
    expect(report.otherWorkerRead).toBe('inconclusive-not-found');
    expect(report.writeIsolation).toBe('not-tested');
  });

  it.each([403, 404])(
    'does not turn an unreadable token metadata endpoint (%s) into a scope claim',
    async (status) => {
      const report = await probeStagingAccess({
        accountId,
        accountIdSha256,
        token,
        fetch: transport(403, status),
      });
      expect(report.accountOwnedTokenVerification).toBe('not-readable');
      expect(report.scopeEvidence).toBe('owner-attested-per-worker-editor');
    },
  );

  it('fails closed on an authentication failure in token verification', async () => {
    await expect(
      probeStagingAccess({
        accountId,
        accountIdSha256,
        token,
        fetch: transport(403, 401),
      }),
    ).rejects.toThrow('authentication failed');
  });

  it.each([200, 201])(
    'blocks a token that can read the other Worker (%s)',
    async (status) => {
      await expect(
        probeStagingAccess({
          accountId,
          accountIdSha256,
          token,
          fetch: transport(status),
        }),
      ).rejects.toThrow('can read another Worker');
    },
  );

  it.each([401, 429, 500, 302])(
    'fails closed on an inconclusive other-Worker response (%s)',
    async (status) => {
      await expect(
        probeStagingAccess({
          accountId,
          accountIdSha256,
          token,
          fetch: transport(status),
        }),
      ).rejects.toThrow('inconclusive');
    },
  );

  it.each(['../production', 'miminiapp', 'miminiapp-staging/other'])(
    'refuses a different Worker before network: %s',
    async (worker) => {
      const request = transport();
      await expect(
        probeStagingAccess({
          accountId,
          accountIdSha256,
          token,
          worker,
          fetch: request,
        }),
      ).rejects.toThrow('explicit account');
      expect(request).not.toHaveBeenCalled();
    },
  );

  it.each(['', 'b'.repeat(31), '../account', 'b'.repeat(32) + '/other'])(
    'refuses malformed account identifiers',
    async (accountId) => {
      const request = transport();
      await expect(
        probeStagingAccess({
          accountId,
          accountIdSha256,
          token,
          fetch: request,
        }),
      ).rejects.toThrow('explicit account');
      expect(request).not.toHaveBeenCalled();
    },
  );

  it('rejects another well-formed account before any request', async () => {
    const request = transport();
    await expect(
      probeStagingAccess({
        accountId: 'b'.repeat(32),
        accountIdSha256,
        token,
        fetch: request,
      }),
    ).rejects.toThrow('explicit account');
    expect(request).not.toHaveBeenCalled();
  });

  it('sanitizes thrown network errors that could contain credentials', async () => {
    const request = vi.fn<typeof fetch>().mockRejectedValue(new Error(token));
    await expect(
      probeStagingAccess({ accountId, accountIdSha256, token, fetch: request }),
    ).rejects.toThrow('could not receive a response');
    try {
      await probeStagingAccess({
        accountId,
        accountIdSha256,
        token,
        fetch: request,
      });
    } catch (error) {
      expect(String(error)).not.toContain(token);
    }
  });

  it('rejects unsuccessful staging responses without echoing error bodies', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(token, { status: 403 }));
    await expect(
      probeStagingAccess({ accountId, accountIdSha256, token, fetch: request }),
    ).rejects.toThrow('unsuccessful probe response');
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('rejects a disabled workers.dev endpoint', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(ok({}))
      .mockResolvedValueOnce(ok({ enabled: false }));
    await expect(
      probeStagingAccess({ accountId, accountIdSha256, token, fetch: request }),
    ).rejects.toThrow('does not enable workers.dev');
  });
});
