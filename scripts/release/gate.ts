import { readFile } from 'node:fs/promises';
import {
  isCommit,
  isDigest,
  sha256,
  type ReleaseManifest,
  validateManifest,
} from './manifest.ts';

export type Target = 'staging' | 'production';
export interface DeploymentPolicy {
  schemaVersion: 1;
  phase: 'A' | 'B';
  deploymentsEnabled: boolean;
  promotionEnabled?: boolean;
  rollbackEnabled?: boolean;
  repository: string;
  repositoryId: string;
  owner: string;
  cloudflareAccountIdSha256?: string;
  targets: Record<
    Target,
    {
      branch: string;
      worker: string;
      url: string;
      deploymentsEnabled?: boolean;
    }
  >;
}

export function assertTarget(value: unknown): asserts value is Target {
  if (value !== 'staging' && value !== 'production')
    throw new Error('An explicit staging or production target is required.');
}

export function validatePolicy(
  value: unknown,
): asserts value is DeploymentPolicy {
  const policy = value as DeploymentPolicy;
  if (
    !policy ||
    policy.schemaVersion !== 1 ||
    !['A', 'B'].includes(policy.phase) ||
    typeof policy.deploymentsEnabled !== 'boolean' ||
    (policy.cloudflareAccountIdSha256 !== undefined &&
      !isDigest(policy.cloudflareAccountIdSha256)) ||
    (policy.promotionEnabled !== undefined &&
      typeof policy.promotionEnabled !== 'boolean') ||
    (policy.rollbackEnabled !== undefined &&
      typeof policy.rollbackEnabled !== 'boolean') ||
    policy.repository !== 'aalexlpez/miminiapp' ||
    !/^\d+$/.test(policy.repositoryId ?? '') ||
    policy.owner !== 'aalexlpez'
  )
    throw new Error('Invalid deployment policy.');
  const expected = {
    staging: ['staging', 'miminiapp-staging'],
    production: ['main', 'miminiapp'],
  } as const;
  for (const target of ['staging', 'production'] as const) {
    const value = policy.targets?.[target];
    const [branch, worker] = expected[target];
    if (
      value?.branch !== branch ||
      value.worker !== worker ||
      value.url !== `https://${worker}.miminiapp-lab.workers.dev` ||
      (value.deploymentsEnabled !== undefined &&
        typeof value.deploymentsEnabled !== 'boolean')
    )
      throw new Error(`Deployment destination mismatch: ${target}`);
  }
}

export async function readPolicy(filename = '.github/deployment-policy.json') {
  const value: unknown = JSON.parse(await readFile(filename, 'utf8'));
  validatePolicy(value);
  return value;
}

/** Called before any network request or credentials are used by a publisher. */
export function assertPhaseB(
  policy: DeploymentPolicy,
  target: unknown,
  flag: unknown,
) {
  validatePolicy(policy);
  assertTarget(target);
  if (
    policy.phase !== 'B' ||
    policy.deploymentsEnabled !== true ||
    policy.targets[target].deploymentsEnabled !== true ||
    (target === 'production' && policy.promotionEnabled !== true) ||
    flag !== 'true'
  )
    throw new Error('Phase B is not authorized: publication is disabled.');
}

export function assertCloudflareAccount(
  policy: DeploymentPolicy,
  accountId: string,
) {
  if (
    !/^[a-f0-9]{32}$/.test(accountId) ||
    !isDigest(policy.cloudflareAccountIdSha256) ||
    sha256(accountId) !== policy.cloudflareAccountIdSha256
  )
    throw new Error(
      'Cloudflare account differs from the approved destination.',
    );
}

export function publicationFlag(target: Target, environment = process.env) {
  return target === 'staging'
    ? environment.I03_STAGING_PUBLICATION_AUTHORIZED
    : environment.I03_PRODUCTION_PUBLICATION_AUTHORIZED;
}

/** Cheap event checks precede GitHub metadata, artifacts and Cloudflare secrets. */
export function assertPublicationContext(
  policy: DeploymentPolicy,
  target: Target,
  environment: NodeJS.ProcessEnv = process.env,
) {
  validatePolicy(policy);
  assertTarget(target);
  if (
    environment.GITHUB_ACTIONS !== 'true' ||
    environment.GITHUB_EVENT_NAME !== 'push' ||
    environment.GITHUB_REF !== `refs/heads/${policy.targets[target].branch}` ||
    environment.GITHUB_REPOSITORY !== policy.repository ||
    environment.GITHUB_REPOSITORY_ID !== policy.repositoryId ||
    environment.GITHUB_ACTOR !== policy.owner ||
    environment.GITHUB_TRIGGERING_ACTOR !== policy.owner ||
    !isCommit(environment.GITHUB_SHA) ||
    !/^[1-9]\d*$/.test(environment.GITHUB_RUN_ID ?? '') ||
    !/^[1-9]\d*$/.test(environment.GITHUB_RUN_ATTEMPT ?? '')
  )
    throw new Error(
      'Publication requires an owner-triggered protected-branch push in GitHub Actions.',
    );
}

export function assertPromotionAuthorized(policy: DeploymentPolicy) {
  validatePolicy(policy);
  if (policy.promotionEnabled !== true)
    throw new Error('Promotion is not authorized during staging setup.');
}

export function assertRollbackAuthorized(policy: DeploymentPolicy) {
  validatePolicy(policy);
  if (policy.rollbackEnabled !== true)
    throw new Error('Rollback is not authorized during staging setup.');
}

export interface CandidateProof {
  repository: string;
  repositoryId: string;
  sourceSha: string;
  sourceTree: string;
  currentStagingSha: string;
  mainSha: string;
  mainTree: string;
  runId: string;
  runAttempt: number;
  artifactId: string;
  artifactDigest: string;
  receiptArtifactId: string;
  receiptArtifactDigest: string;
}

export interface StagingReceipt {
  schemaVersion: 1;
  repository: string;
  repositoryId: string;
  sourceSha: string;
  sourceTree: string;
  payloadSha256: string;
  siteSha256: string;
  runId: string;
  runAttempt: number;
  artifactId: string;
  artifactDigest: string;
  remoteTestsPassed: true;
}

export function verifyCandidate(
  manifest: ReleaseManifest,
  receipt: StagingReceipt,
  proof: CandidateProof,
) {
  validateManifest(manifest);
  if (
    !proof ||
    proof.repository !== manifest.repository ||
    proof.repositoryId !== manifest.repositoryId ||
    proof.sourceSha !== manifest.sourceSha ||
    proof.sourceTree !== manifest.sourceTree ||
    proof.currentStagingSha !== manifest.sourceSha ||
    proof.mainTree !== manifest.sourceTree ||
    proof.runId !== manifest.buildRunId ||
    proof.runAttempt !== manifest.buildRunAttempt ||
    !/^\d+$/.test(proof.artifactId) ||
    !/^\d+$/.test(proof.receiptArtifactId) ||
    !/^sha256:[a-f0-9]{64}$/.test(proof.artifactDigest) ||
    !/^sha256:[a-f0-9]{64}$/.test(proof.receiptArtifactDigest) ||
    !isCommit(proof.mainSha)
  )
    throw new Error(
      'Candidate no longer matches the trusted staging run or current merge tree.',
    );
  const pairs: [unknown, unknown][] = [
    [receipt?.schemaVersion, 1],
    [receipt?.repository, manifest.repository],
    [receipt?.repositoryId, manifest.repositoryId],
    [receipt?.sourceSha, manifest.sourceSha],
    [receipt?.sourceTree, manifest.sourceTree],
    [receipt?.payloadSha256, manifest.payloadSha256],
    [receipt?.siteSha256, manifest.siteSha256],
    [receipt?.runId, proof.runId],
    [receipt?.runAttempt, proof.runAttempt],
    [receipt?.artifactId, proof.artifactId],
    [receipt?.artifactDigest, proof.artifactDigest],
    [receipt?.remoteTestsPassed, true],
  ];
  if (
    pairs.some(([actual, expected]) => actual !== expected) ||
    !isDigest(receipt.payloadSha256)
  )
    throw new Error(
      'Staging validation receipt does not authorize this artifact.',
    );
}

export interface MergeEvidence {
  repository: string;
  repositoryId: string;
  actor: string;
  triggeringActor: string;
  eventName: string;
  eventRef: string;
  eventSha: string;
  currentRefSha: string;
  mergeCommitSha: string;
  mergeTree: string;
  expectedBaseSha: string;
  actualBaseSha: string;
  pr: {
    merged: boolean;
    base: string;
    head: string;
    headRepositoryId: string;
    mergedBy: string;
    headSha: string;
  };
  checks: { quality: string; promotion?: string };
}

export function verifyMerge(
  evidence: MergeEvidence,
  policy: DeploymentPolicy,
  target: Target,
) {
  validatePolicy(policy);
  assertTarget(target);
  if (
    !evidence ||
    evidence.repository !== policy.repository ||
    evidence.repositoryId !== policy.repositoryId ||
    evidence.actor !== policy.owner ||
    evidence.triggeringActor !== policy.owner ||
    evidence.eventName !== 'push' ||
    evidence.eventRef !== `refs/heads/${policy.targets[target].branch}` ||
    !isCommit(evidence.eventSha) ||
    evidence.eventSha !== evidence.currentRefSha ||
    evidence.eventSha !== evidence.mergeCommitSha ||
    !isCommit(evidence.mergeTree) ||
    !isCommit(evidence.expectedBaseSha) ||
    evidence.expectedBaseSha !== evidence.actualBaseSha
  )
    throw new Error('Untrusted, obsolete or concurrent merge event.');
  const pr = evidence.pr;
  if (
    !pr?.merged ||
    pr.base !== policy.targets[target].branch ||
    pr.headRepositoryId !== policy.repositoryId ||
    pr.mergedBy !== policy.owner ||
    !isCommit(pr.headSha) ||
    evidence.checks?.quality !== 'success'
  )
    throw new Error(
      'A valid owner-merged pull request with successful quality checks is required.',
    );
  if (
    target === 'production' &&
    (pr.head !== 'staging' || evidence.checks.promotion !== 'success')
  )
    throw new Error('Production requires a validated staging promotion.');
}
