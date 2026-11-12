import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  assertPhaseB,
  assertCloudflareAccount,
  assertPublicationContext,
  publicationFlag,
  assertPromotionAuthorized,
  assertRollbackAuthorized,
  verifyCandidate,
  verifyMerge,
  type CandidateProof,
  type DeploymentPolicy,
  type MergeEvidence,
  type StagingReceipt,
} from '../../scripts/release/gate.ts';
import { publish } from '../../scripts/release/cli.ts';
import {
  sha256,
  type ReleaseManifest,
} from '../../scripts/release/manifest.ts';

const sha = 'a'.repeat(40);
const tree = 'b'.repeat(40);
const base = 'c'.repeat(40);
const digest = 'd'.repeat(64);
const policy: DeploymentPolicy = {
  schemaVersion: 1,
  phase: 'A',
  deploymentsEnabled: false,
  repository: 'aalexlpez/miminiapp',
  repositoryId: '1445849027',
  owner: 'aalexlpez',
  targets: {
    staging: {
      branch: 'staging',
      worker: 'miminiapp-staging',
      url: 'https://miminiapp-staging.miminiapp-lab.workers.dev',
    },
    production: {
      branch: 'main',
      worker: 'miminiapp',
      url: 'https://miminiapp.miminiapp-lab.workers.dev',
    },
  },
};
const manifest: ReleaseManifest = {
  schemaVersion: 1,
  repository: policy.repository,
  repositoryId: policy.repositoryId,
  sourceSha: sha,
  sourceTree: tree,
  buildRunId: '123',
  buildRunAttempt: 2,
  payloadSha256: digest,
  siteSha256: digest,
  files: { 'release-manifest.json': digest },
};
const proof: CandidateProof = {
  repository: policy.repository,
  repositoryId: policy.repositoryId,
  sourceSha: sha,
  sourceTree: tree,
  currentStagingSha: sha,
  mainSha: base,
  mainTree: tree,
  runId: '123',
  runAttempt: 2,
  artifactId: '456',
  artifactDigest: `sha256:${digest}`,
  receiptArtifactId: '789',
  receiptArtifactDigest: `sha256:${digest}`,
};
const receipt: StagingReceipt = {
  schemaVersion: 1,
  repository: policy.repository,
  repositoryId: policy.repositoryId,
  sourceSha: sha,
  sourceTree: tree,
  payloadSha256: digest,
  siteSha256: digest,
  runId: '123',
  runAttempt: 2,
  artifactId: '456',
  artifactDigest: `sha256:${digest}`,
  remoteTestsPassed: true,
};
const merge: MergeEvidence = {
  repository: policy.repository,
  repositoryId: policy.repositoryId,
  actor: policy.owner,
  triggeringActor: policy.owner,
  eventName: 'push',
  eventRef: 'refs/heads/main',
  eventSha: sha,
  currentRefSha: sha,
  mergeCommitSha: sha,
  mergeTree: tree,
  expectedBaseSha: base,
  actualBaseSha: base,
  pr: {
    merged: true,
    base: 'main',
    head: 'staging',
    headRepositoryId: policy.repositoryId,
    mergedBy: policy.owner,
    headSha: sha,
  },
  checks: { quality: 'success', promotion: 'success' },
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('Phase A publication stop', () => {
  it.each([undefined, '', 'false', 'TRUE', '1', ' true', 'true '])(
    'keeps an enabled staging policy closed without the exact authorization flag: %s',
    (flag) => {
      const stagingEnabled: DeploymentPolicy = {
        ...policy,
        phase: 'B',
        deploymentsEnabled: true,
        targets: {
          staging: { ...policy.targets.staging, deploymentsEnabled: true },
          production: {
            ...policy.targets.production,
            deploymentsEnabled: false,
          },
        },
      };
      expect(() => assertPhaseB(stagingEnabled, 'staging', flag)).toThrow(
        'not authorized',
      );
    },
  );

  it('requires both a committed Phase B policy and the separate activation flag', () => {
    expect(() => assertPhaseB(policy, 'production', 'true')).toThrow(
      'not authorized',
    );
    const enabled: DeploymentPolicy = {
      ...policy,
      phase: 'B',
      deploymentsEnabled: true,
    };
    expect(() => assertPhaseB(enabled, 'production', undefined)).toThrow(
      'not authorized',
    );
    expect(() => assertPhaseB(enabled, 'production', 'false')).toThrow(
      'not authorized',
    );
    expect(() => assertPhaseB(enabled, 'production', 'true')).toThrow(
      'not authorized',
    );
    const stageOnly: DeploymentPolicy = {
      ...enabled,
      targets: {
        staging: { ...policy.targets.staging, deploymentsEnabled: true },
        production: { ...policy.targets.production, deploymentsEnabled: false },
      },
    };
    expect(() => assertPhaseB(stageOnly, 'staging', 'true')).not.toThrow();
    expect(() => assertPhaseB(stageOnly, 'production', 'true')).toThrow(
      'not authorized',
    );
    expect(() =>
      assertPhaseB(
        {
          ...enabled,
          targets: { ...enabled.targets, staging: enabled.targets.production },
        },
        'staging',
        'true',
      ),
    ).toThrow('destination mismatch');
  });

  it('direct publisher invocation is rejected before network, token use, artifact read, or Wrangler', async () => {
    const network = vi.fn(() => {
      throw new Error('Network must remain unused.');
    });
    vi.stubGlobal('fetch', network);
    vi.stubEnv('I03_PHASE_B_AUTHORIZED', 'true');
    await expect(publish('production', '/does/not/exist')).rejects.toThrow(
      'Phase B is not authorized',
    );
    expect(network).not.toHaveBeenCalled();
  });
});

describe('staging candidate equivalence', () => {
  it('accepts only the byte identity and provenance of the trusted successful attempt', () => {
    expect(() => verifyCandidate(manifest, receipt, proof)).not.toThrow();
  });
  it.each([
    ['currentStagingSha', base],
    ['mainTree', sha],
    ['runId', '999'],
    ['runAttempt', 3],
    ['sourceTree', sha],
    ['artifactDigest', 'forged'],
    ['repositoryId', '888'],
  ])('rejects stale or forged trusted metadata %s', (key, value) => {
    expect(() =>
      verifyCandidate(manifest, receipt, { ...proof, [key]: value }),
    ).toThrow();
  });
  it.each([
    ['artifactId', '999'],
    ['artifactDigest', `sha256:${'e'.repeat(64)}`],
    ['runAttempt', 1],
    ['siteSha256', 'e'.repeat(64)],
    ['payloadSha256', 'e'.repeat(64)],
    ['remoteTestsPassed', false],
    ['sourceTree', sha],
  ])('rejects substituted validation receipt %s', (key, value) => {
    expect(() =>
      verifyCandidate(
        manifest,
        { ...receipt, [key]: value } as StagingReceipt,
        proof,
      ),
    ).toThrow();
  });
  it('rejects a rebuild with the same source and different bytes', () => {
    expect(() =>
      verifyCandidate(
        { ...manifest, payloadSha256: 'e'.repeat(64) },
        receipt,
        proof,
      ),
    ).toThrow();
  });
});

describe('owner merge and race boundaries', () => {
  it('accepts the current manually merged staging promotion with both native checks', () => {
    expect(() => verifyMerge(merge, policy, 'production')).not.toThrow();
  });
  it.each([
    ['triggeringActor', 'other'],
    ['actor', 'other'],
    ['eventName', 'workflow_dispatch'],
    ['eventRef', 'refs/tags/release'],
    ['currentRefSha', base],
    ['actualBaseSha', sha],
    ['repositoryId', '888'],
  ])('rejects invalid event context %s', (key, value) => {
    expect(() =>
      verifyMerge({ ...merge, [key]: value }, policy, 'production'),
    ).toThrow();
  });
  it.each([
    ['head', 'feature/new'],
    ['headRepositoryId', '999'],
    ['mergedBy', 'other'],
    ['merged', false],
  ])('rejects an unauthorized PR field %s', (key, value) => {
    expect(() =>
      verifyMerge(
        { ...merge, pr: { ...merge.pr, [key]: value } },
        policy,
        'production',
      ),
    ).toThrow();
  });
  it.each(['quality', 'promotion'])(
    'does not treat missing, skipped or failed %s as a passing gate',
    (key) => {
      for (const value of ['failure', 'skipped', undefined])
        expect(() =>
          verifyMerge(
            { ...merge, checks: { ...merge.checks, [key]: value } },
            policy,
            'production',
          ),
        ).toThrow();
    },
  );
});

describe('independent staging publication authority', () => {
  const environment = {
    GITHUB_ACTIONS: 'true',
    GITHUB_EVENT_NAME: 'push',
    GITHUB_REF: 'refs/heads/staging',
    GITHUB_REPOSITORY: policy.repository,
    GITHUB_REPOSITORY_ID: policy.repositoryId,
    GITHUB_ACTOR: policy.owner,
    GITHUB_TRIGGERING_ACTOR: policy.owner,
    GITHUB_SHA: sha,
    GITHUB_RUN_ID: '123',
    GITHUB_RUN_ATTEMPT: '1',
  };
  it('accepts a protected branch event as an input to the subsequent online merged-PR check', () => {
    expect(() =>
      assertPublicationContext(policy, 'staging', environment),
    ).not.toThrow();
  });
  it.each([
    ['GITHUB_EVENT_NAME', 'pull_request'],
    ['GITHUB_EVENT_NAME', 'workflow_dispatch'],
    ['GITHUB_REF', 'refs/pull/3/merge'],
    ['GITHUB_REF', 'refs/heads/feature/tool'],
    ['GITHUB_REF', 'refs/heads/main'],
    ['GITHUB_ACTIONS', 'false'],
    ['GITHUB_ACTOR', 'another-user'],
    ['GITHUB_TRIGGERING_ACTOR', 'another-user'],
    ['GITHUB_REPOSITORY_ID', '999'],
    ['GITHUB_REPOSITORY', 'another/repo'],
    ['GITHUB_RUN_ID', '0'],
    ['GITHUB_RUN_ATTEMPT', '0'],
    ['GITHUB_SHA', 'invalid'],
  ])(
    'rejects unauthorized context %s=%s before credentials or metadata',
    (key, value) => {
      expect(() =>
        assertPublicationContext(policy, 'staging', {
          ...environment,
          [key]: value,
        }),
      ).toThrow('protected-branch push');
    },
  );
  it('does not accept the old global flag as staging or production authorization', () => {
    const legacy = { I03_PHASE_B_AUTHORIZED: 'true' };
    expect(publicationFlag('staging', legacy)).toBeUndefined();
    expect(publicationFlag('production', legacy)).toBeUndefined();
    const stage = { I03_STAGING_PUBLICATION_AUTHORIZED: 'true' };
    expect(publicationFlag('staging', stage)).toBe('true');
    expect(publicationFlag('production', stage)).toBeUndefined();
  });
  it('binds the destination to the approved Cloudflare account', () => {
    const bound = {
      ...policy,
      cloudflareAccountIdSha256: sha256('a'.repeat(32)),
    };
    expect(() => assertCloudflareAccount(bound, 'a'.repeat(32))).not.toThrow();
    expect(() => assertCloudflareAccount(bound, 'b'.repeat(32))).toThrow(
      'approved destination',
    );
    expect(() => assertCloudflareAccount(policy, 'b'.repeat(32))).toThrow(
      'approved destination',
    );
  });
  it('keeps promotion and rollback separately closed', () => {
    expect(() => assertPromotionAuthorized(policy)).toThrow('not authorized');
    expect(() => assertRollbackAuthorized(policy)).toThrow('not authorized');
  });
});
