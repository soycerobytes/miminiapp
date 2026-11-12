import { describe, expect, it } from 'vitest';
import {
  expectedReleaseIdentity,
  remoteOrigins,
  resolveRemoteTarget,
} from '../remote/target';

describe('explicit remote test destinations', () => {
  it.each(['staging', 'production'] as const)(
    'accepts only the approved %s origin for that target',
    (target) => {
      expect(
        resolveRemoteTarget({
          REMOTE_TARGET: target,
          REMOTE_BASE_URL: remoteOrigins[target],
        }),
      ).toEqual({ target, baseURL: `${remoteOrigins[target]}/` });
    },
  );

  it.each([
    { label: 'missing destination', environment: {} },
    { label: 'missing URL', environment: { REMOTE_TARGET: 'staging' } },
    {
      label: 'unknown target',
      environment: {
        REMOTE_TARGET: 'preview',
        REMOTE_BASE_URL: remoteOrigins.staging,
      },
    },
    {
      label: 'production URL selected as staging',
      environment: {
        REMOTE_TARGET: 'staging',
        REMOTE_BASE_URL: remoteOrigins.production,
      },
    },
    {
      label: 'staging URL selected as production',
      environment: {
        REMOTE_TARGET: 'production',
        REMOTE_BASE_URL: remoteOrigins.staging,
      },
    },
  ])('rejects $label without choosing a fallback', ({ environment }) => {
    expect(() => resolveRemoteTarget(environment)).toThrow();
  });

  it.each([
    'http://127.0.0.1:4321/',
    'http://miminiapp-staging.miminiapp-lab.workers.dev/',
    'https://example.com/',
    'https://miminiapp-staging.miminiapp-lab.workers.dev.example.com/',
    `${remoteOrigins.staging}:444/`,
    `${remoteOrigins.staging}/es/`,
    `${remoteOrigins.staging}/?candidate=other`,
    `${remoteOrigins.staging}/#other`,
    'https://user:password@miminiapp-staging.miminiapp-lab.workers.dev/',
    'not-a-url',
  ])('rejects unapproved remote URL %s', (REMOTE_BASE_URL) => {
    expect(() =>
      resolveRemoteTarget({ REMOTE_TARGET: 'staging', REMOTE_BASE_URL }),
    ).toThrow();
  });
});

const trustedIdentity = {
  RELEASE_SOURCE_SHA: 'a'.repeat(40),
  RELEASE_SOURCE_TREE: 'b'.repeat(40),
  RELEASE_PAYLOAD_SHA256: 'c'.repeat(64),
};

describe('trusted remote release expectations', () => {
  it('compares the public identity to trusted source, tree and payload values', () => {
    expect(expectedReleaseIdentity(trustedIdentity)).toEqual({
      schemaVersion: 1,
      repository: 'aalexlpez/miminiapp',
      repositoryId: '1445849027',
      sourceSha: trustedIdentity.RELEASE_SOURCE_SHA,
      sourceTree: trustedIdentity.RELEASE_SOURCE_TREE,
      payloadSha256: trustedIdentity.RELEASE_PAYLOAD_SHA256,
    });
  });

  it('does not obtain a missing expected identity from the served application', () => {
    expect(() => expectedReleaseIdentity({})).toThrow(
      'Trusted RELEASE_SOURCE_SHA',
    );
  });

  it.each([
    ['RELEASE_SOURCE_SHA', undefined],
    ['RELEASE_SOURCE_TREE', undefined],
    ['RELEASE_PAYLOAD_SHA256', undefined],
    ['RELEASE_SOURCE_SHA', 'a'.repeat(39)],
    ['RELEASE_SOURCE_TREE', 'b'.repeat(41)],
    ['RELEASE_SOURCE_TREE', 'g'.repeat(40)],
    ['RELEASE_PAYLOAD_SHA256', 'c'.repeat(63)],
    ['RELEASE_PAYLOAD_SHA256', 'C'.repeat(64)],
  ])('rejects missing or malformed %s', (name, value) => {
    expect(() =>
      expectedReleaseIdentity({ ...trustedIdentity, [name!]: value }),
    ).toThrow('Trusted RELEASE_SOURCE_SHA');
  });
});
