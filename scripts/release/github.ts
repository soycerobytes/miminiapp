import {
  appendFile,
  mkdir,
  readFile,
  writeFile,
  mkdtemp,
  rm,
} from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { sha256, isCommit, type ReleaseManifest } from './manifest.ts';
import {
  type CandidateProof,
  type DeploymentPolicy,
  type MergeEvidence,
  type StagingReceipt,
  type Target,
  verifyCandidate,
  verifyMerge,
} from './gate.ts';
import { successfulPRQuality } from './pr-ci.ts';

interface Repository {
  id: number;
  full_name: string;
}
interface Actor {
  login: string;
}
interface Commit {
  sha: string;
  tree: { sha: string };
  parents: { sha: string }[];
}
/** The commit-associated listing omits detail-only fields such as `merged`. */
interface PullRequestSummary {
  number: number;
  state: string;
  merged_at: string | null;
  merge_commit_sha: string | null;
  base: { ref: string };
}
interface PullRequest extends PullRequestSummary {
  merged: boolean;
  merge_commit_sha: string;
  merged_by: Actor | null;
  base: { ref: string; sha: string; repo: Repository };
  head: { ref: string; sha: string; repo: Repository };
  user: Actor;
}
interface Run {
  id: number;
  run_attempt: number;
  head_sha: string;
  head_branch: string;
  head_repository: Repository;
  event: string;
  status: string;
  conclusion: string | null;
  actor: Actor;
  triggering_actor: Actor;
  path: string;
  run_started_at: string;
  pull_requests: { number: number }[];
}
interface Artifact {
  id: number;
  name: string;
  digest: string;
  expired: boolean;
  created_at: string;
  workflow_run: { id: number; head_sha: string };
}
interface Event {
  before?: string;
  after?: string;
  number?: number;
  pull_request?: { number: number };
  repository: Repository;
}

/** Read-only API client. No mutation method or caller-provided API origin is accepted. */
export class GitHubReader {
  readonly policy: DeploymentPolicy;
  private readonly token: string;
  constructor(policy: DeploymentPolicy, token: string) {
    if (!token)
      throw new Error(
        'A read-only GitHub token is required for trusted metadata.',
      );
    this.policy = policy;
    this.token = token;
  }
  private async request(path: string) {
    if (
      !path.startsWith(`/repos/${this.policy.repository}/`) ||
      path.includes('..')
    )
      throw new Error('GitHub endpoint outside the configured repository.');
    const response = await fetch(`https://api.github.com${path}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      redirect: 'manual',
    });
    if (!response.ok && response.status !== 302)
      throw new Error(
        `GitHub read failed (${response.status}) at ${path.split('?')[0]}.`,
      );
    return response;
  }
  async get<T>(suffix: string): Promise<T> {
    return (await (
      await this.request(`/repos/${this.policy.repository}/${suffix}`)
    ).json()) as T;
  }
  async commit(sha: string) {
    if (!isCommit(sha)) throw new Error('Invalid commit.');
    return this.get<Commit>(`git/commits/${sha}`);
  }
  async ref(branch: string) {
    return (
      await this.get<{ object: { sha: string } }>(`git/ref/heads/${branch}`)
    ).object.sha;
  }
  async artifactJSON<T>(artifact: Artifact, filename: string): Promise<T> {
    if (!/^sha256:[a-f0-9]{64}$/.test(artifact.digest) || artifact.expired)
      throw new Error('Artifact is expired or lacks a trusted archive digest.');
    const response = await this.request(
      `/repos/${this.policy.repository}/actions/artifacts/${artifact.id}/zip`,
    );
    const location = response.headers.get('location');
    let bytes: Uint8Array;
    if (response.status === 302 && location) {
      const destination = new URL(location);
      if (
        destination.protocol !== 'https:' ||
        ![
          '.blob.core.windows.net',
          '.actions.githubusercontent.com',
          '.githubusercontent.com',
        ].some((suffix) => destination.hostname.endsWith(suffix))
      )
        throw new Error('Unexpected artifact download origin.');
      // The GitHub authorization header must never follow the signed storage redirect.
      const download = await fetch(destination, { redirect: 'error' });
      if (!download.ok)
        throw new Error(`Artifact download failed (${download.status}).`);
      bytes = new Uint8Array(await download.arrayBuffer());
    } else bytes = new Uint8Array(await response.arrayBuffer());
    if (`sha256:${sha256(bytes)}` !== artifact.digest)
      throw new Error('GitHub artifact archive digest mismatch.');
    const temp = await mkdtemp(join(tmpdir(), 'miminiapp-artifact-'));
    try {
      const archive = join(temp, 'artifact.zip');
      await writeFile(archive, bytes);
      // Extract one fixed JSON member to stdout; never extract paths from an archive to disk.
      const value = execFileSync('unzip', ['-p', archive, filename], {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      return JSON.parse(value) as T;
    } finally {
      await rm(temp, { recursive: true, force: true });
    }
  }
}

export async function githubContext(policy: DeploymentPolicy) {
  if (
    process.env.GITHUB_REPOSITORY !== policy.repository ||
    process.env.GITHUB_REPOSITORY_ID !== policy.repositoryId ||
    process.env.GITHUB_ACTOR !== policy.owner ||
    process.env.GITHUB_TRIGGERING_ACTOR !== policy.owner ||
    !process.env.GITHUB_EVENT_PATH
  )
    throw new Error('Untrusted GitHub execution context.');
  const event = JSON.parse(
    await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'),
  ) as Event;
  if (
    String(event.repository?.id) !== policy.repositoryId ||
    event.repository?.full_name !== policy.repository
  )
    throw new Error('GitHub event repository mismatch.');
  return {
    client: new GitHubReader(
      policy,
      process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '',
    ),
    event,
  };
}

async function successfulJob(client: GitHubReader, run: Run, name: string) {
  const jobs = await client.get<{
    jobs: {
      name: string;
      conclusion: string;
      status: string;
      run_attempt: number;
    }[];
  }>(`actions/runs/${run.id}/attempts/${run.run_attempt}/jobs?per_page=100`);
  return jobs.jobs.some(
    (job) =>
      job.name === name &&
      job.status === 'completed' &&
      job.conclusion === 'success' &&
      job.run_attempt === run.run_attempt,
  );
}

async function successfulPRCheck(
  client: GitHubReader,
  sha: string,
  pr: number,
  path: string,
  job: string,
) {
  const { workflow_runs: runs } = await client.get<{ workflow_runs: Run[] }>(
    `actions/runs?event=pull_request&head_sha=${sha}&per_page=100`,
  );
  const matching = runs.filter(
    (run) =>
      run.path === path &&
      run.head_sha === sha &&
      String(run.head_repository?.id) === client.policy.repositoryId &&
      run.pull_requests.some((item) => item.number === pr),
  );
  const latest = matching.sort((a, b) => b.id - a.id)[0];
  return latest?.status === 'completed' &&
    latest.conclusion === 'success' &&
    (await successfulJob(client, latest, job))
    ? 'success'
    : 'failure';
}

function trustedRun(
  run: Run,
  policy: DeploymentPolicy,
  path: string,
  branch: string,
  sha?: string,
) {
  if (
    run.path !== path ||
    run.event !== 'push' ||
    run.head_branch !== branch ||
    (sha && run.head_sha !== sha) ||
    String(run.head_repository?.id) !== policy.repositoryId ||
    run.head_repository.full_name !== policy.repository ||
    run.actor?.login !== policy.owner ||
    run.triggering_actor?.login !== policy.owner ||
    run.status !== 'completed' ||
    run.conclusion !== 'success' ||
    !Number.isSafeInteger(run.run_attempt) ||
    run.run_attempt < 1
  )
    throw new Error(
      'Run is not a completed trusted release for the required source.',
    );
}

export interface TrustedCandidate {
  proof: CandidateProof;
  manifest: ReleaseManifest;
  receipt: StagingReceipt;
}

async function candidateFromRun(
  client: GitHubReader,
  run: Run,
  mainSha: string,
  mainTree: string,
  currentStagingSha: string,
): Promise<TrustedCandidate> {
  trustedRun(
    run,
    client.policy,
    '.github/workflows/staging.yml',
    'staging',
    currentStagingSha,
  );
  if (!(await successfulJob(client, run, 'remote-test')))
    throw new Error(
      'Staging remote tests did not succeed in the latest run attempt.',
    );
  const { artifacts } = await client.get<{ artifacts: Artifact[] }>(
    `actions/runs/${run.id}/artifacts?per_page=100`,
  );
  const select = (name: string) => {
    const matches = artifacts.filter(
      (item) =>
        item.name === name &&
        !item.expired &&
        item.workflow_run.id === run.id &&
        item.workflow_run.head_sha === run.head_sha &&
        Date.parse(item.created_at) >= Date.parse(run.run_started_at),
    );
    if (matches.length !== 1)
      throw new Error(
        `Missing or ambiguous artifact from latest attempt: ${name}`,
      );
    return matches[0];
  };
  const artifact = select(
    `release-candidate-${run.head_sha}-${run.run_attempt}`,
  );
  const validation = select(
    `staging-validation-${run.head_sha}-${run.run_attempt}`,
  );
  const [manifest, receipt] = await Promise.all([
    client.artifactJSON<ReleaseManifest>(artifact, 'manifest.json'),
    client.artifactJSON<StagingReceipt>(validation, 'staging-validation.json'),
  ]);
  const proof: CandidateProof = {
    repository: client.policy.repository,
    repositoryId: client.policy.repositoryId,
    sourceSha: run.head_sha,
    sourceTree: (await client.commit(run.head_sha)).tree.sha,
    currentStagingSha,
    mainSha,
    mainTree,
    runId: String(run.id),
    runAttempt: run.run_attempt,
    artifactId: String(artifact.id),
    artifactDigest: artifact.digest,
    receiptArtifactId: String(validation.id),
    receiptArtifactDigest: validation.digest,
  };
  verifyCandidate(manifest, receipt, proof);
  return { proof, manifest, receipt };
}

export async function currentCandidate(
  client: GitHubReader,
  mainSha: string,
  mainTree: string,
) {
  const stagingSha = await client.ref('staging');
  const { workflow_runs: runs } = await client.get<{ workflow_runs: Run[] }>(
    `actions/workflows/staging.yml/runs?event=push&head_sha=${stagingSha}&per_page=100`,
  );
  // A newer failed/in-progress attempt invalidates an older success; never cherry-pick a green run.
  const latest = runs
    .filter(
      (run) => run.head_branch === 'staging' && run.head_sha === stagingSha,
    )
    .sort((a, b) => b.id - a.id)[0];
  if (!latest)
    throw new Error('No staging run exists for the current candidate.');
  const candidate = await candidateFromRun(
    client,
    latest,
    mainSha,
    mainTree,
    stagingSha,
  );
  const response = await fetch(
    `${client.policy.targets.staging.url}/release-manifest.json`,
    {
      redirect: 'error',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    },
  );
  if (!response.ok)
    throw new Error(
      `Current staging identity is unavailable (${response.status}).`,
    );
  const identity = await response.text();
  if (identity.length > 16384)
    throw new Error('Invalid staging identity size.');
  const served = JSON.parse(identity) as Record<string, unknown>;
  for (const key of [
    'schemaVersion',
    'repository',
    'repositoryId',
    'sourceSha',
    'sourceTree',
    'payloadSha256',
  ] as const) {
    if (served[key] !== candidate.manifest[key])
      throw new Error(
        'The candidate is no longer the release currently served and validated in staging.',
      );
  }
  return candidate;
}

export async function checkPromotion(policy: DeploymentPolicy) {
  const { client, event } = await githubContext(policy);
  if (process.env.GITHUB_EVENT_NAME !== 'pull_request')
    throw new Error('Promotion gate requires a pull request event.');
  const number = event.number ?? event.pull_request?.number;
  if (!Number.isSafeInteger(number)) throw new Error('Missing pull request.');
  const pr = await client.get<PullRequest>(`pulls/${number}`);
  const [mainSha, stagingSha] = await Promise.all([
    client.ref('main'),
    client.ref('staging'),
  ]);
  if (
    pr.state !== 'open' ||
    pr.merged ||
    pr.base.ref !== 'main' ||
    pr.base.sha !== mainSha ||
    pr.head.ref !== 'staging' ||
    pr.head.sha !== stagingSha ||
    String(pr.head.repo.id) !== policy.repositoryId ||
    String(pr.base.repo.id) !== policy.repositoryId ||
    !isCommit(pr.merge_commit_sha)
  )
    throw new Error(
      'Promotion is not the current same-repository staging to main pull request.',
    );
  const merged = await client.commit(pr.merge_commit_sha);
  if (
    merged.parents[0]?.sha !== mainSha ||
    merged.parents[1]?.sha !== stagingSha
  )
    throw new Error('Promotion base/head changed.');
  const result = await currentCandidate(client, mainSha, merged.tree.sha);
  // Re-read refs after all downloads to close the metadata/download race.
  if (
    (await client.ref('main')) !== mainSha ||
    (await client.ref('staging')) !== stagingSha
  )
    throw new Error('Branches changed while validating promotion.');
  return result;
}

export async function checkMerged(policy: DeploymentPolicy, target: Target) {
  const { client, event } = await githubContext(policy);
  const sha = process.env.GITHUB_SHA ?? '';
  const branch = policy.targets[target].branch;
  const [commit, currentRef, pulls] = await Promise.all([
    client.commit(sha),
    client.ref(branch),
    client.get<PullRequestSummary[]>(`commits/${sha}/pulls?per_page=100`),
  ]);
  const matching = pulls.filter(
    (pr) =>
      pr.state === 'closed' &&
      typeof pr.merged_at === 'string' &&
      Number.isFinite(Date.parse(pr.merged_at)) &&
      pr.merge_commit_sha === sha &&
      pr.base.ref === branch,
  );
  if (matching.length !== 1)
    throw new Error(
      'Exactly one merged pull request is required for a deployment.',
    );
  const summary = matching[0];
  if (!Number.isSafeInteger(summary.number) || summary.number < 1)
    throw new Error('Invalid associated pull request number.');
  // A summary identifies a candidate; only the detailed endpoint confirms it.
  const pr = await client.get<PullRequest>(`pulls/${summary.number}`);
  if (
    pr.number !== summary.number ||
    pr.state !== 'closed' ||
    pr.merged !== true ||
    typeof pr.merged_at !== 'string' ||
    !Number.isFinite(Date.parse(pr.merged_at)) ||
    pr.merge_commit_sha !== sha ||
    pr.base.ref !== branch ||
    String(pr.base.repo.id) !== policy.repositoryId ||
    pr.base.repo.full_name !== policy.repository ||
    String(pr.head.repo.id) !== policy.repositoryId ||
    pr.head.repo.full_name !== policy.repository
  )
    throw new Error(
      'Detailed pull request does not confirm the associated merged candidate.',
    );
  const quality = await successfulPRQuality(client, {
    number: pr.number,
    base: pr.base.ref,
    headSha: pr.head.sha,
    headRef: pr.head.ref,
    mergeSha: sha,
  });
  const promotion =
    target === 'production'
      ? await successfulPRCheck(
          client,
          pr.head.sha,
          pr.number,
          '.github/workflows/promotion.yml',
          'promotion',
        )
      : undefined;
  const evidence: MergeEvidence = {
    repository: event.repository.full_name,
    repositoryId: String(event.repository.id),
    actor: process.env.GITHUB_ACTOR ?? '',
    triggeringActor: process.env.GITHUB_TRIGGERING_ACTOR ?? '',
    eventName: process.env.GITHUB_EVENT_NAME ?? '',
    eventRef: process.env.GITHUB_REF ?? '',
    eventSha: sha,
    currentRefSha: currentRef,
    mergeCommitSha: pr.merge_commit_sha,
    mergeTree: commit.tree.sha,
    expectedBaseSha: event.before ?? '',
    actualBaseSha: commit.parents[0]?.sha ?? '',
    pr: {
      merged: pr.merged,
      base: pr.base.ref,
      head: pr.head.ref,
      headRepositoryId: String(pr.head.repo.id),
      mergedBy: pr.merged_by?.login ?? '',
      headSha: pr.head.sha,
    },
    checks: { quality, promotion },
  };
  verifyMerge(evidence, policy, target);
  const candidate =
    target === 'production'
      ? await currentCandidate(client, sha, commit.tree.sha)
      : undefined;
  if (candidate && candidate.proof.sourceSha !== pr.head.sha)
    throw new Error(
      'The merged head is no longer the validated staging candidate.',
    );
  if ((await client.ref(branch)) !== sha)
    throw new Error('Destination changed during gate validation.');
  return { client, evidence, candidate };
}

export async function writeOutputs(values: Record<string, string | number>) {
  if (!process.env.GITHUB_OUTPUT) return;
  for (const [key, value] of Object.entries(values)) {
    if (!/^[a-z0-9-]+$/.test(key) || /[\r\n]/.test(String(value)))
      throw new Error('Invalid workflow output.');
    await appendFile(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  }
}

export async function saveProof(
  candidate: TrustedCandidate,
  path = '.local/promotion-proof.json',
) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(candidate.proof, null, 2)}\n`);
  await writeOutputs({
    'candidate-run-id': candidate.proof.runId,
    'candidate-artifact-id': candidate.proof.artifactId,
    'candidate-receipt-id': candidate.proof.receiptArtifactId,
    'source-sha': candidate.manifest.sourceSha,
    'source-tree': candidate.manifest.sourceTree,
    'payload-sha256': candidate.manifest.payloadSha256,
  });
}

export interface ProductionRelease {
  schemaVersion: 1;
  target: Target;
  productionRunId: string;
  productionRunAttempt: number;
  sourceRunId: string;
  sourceRunAttempt: number;
  sourceSha: string;
  sourceTree: string;
  artifactId: string;
  receiptArtifactId: string;
  siteSha256: string;
}

/** Exceptional rollback selects a prior successful release, never an arbitrary upload. */
export async function checkRollback(policy: DeploymentPolicy, target: Target) {
  const { client } = await githubContext(policy);
  const priorRun = process.env.PRIOR_RUN_ID ?? '';
  if (
    process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch' ||
    process.env.GITHUB_REF !== `refs/heads/${policy.targets[target].branch}` ||
    !/^\d+$/.test(priorRun) ||
    priorRun === process.env.GITHUB_RUN_ID ||
    (await client.ref(policy.targets[target].branch)) !== process.env.GITHUB_SHA
  )
    throw new Error(
      'Rollback requires an owner dispatch from the current protected destination and an explicit prior run.',
    );
  const run = await client.get<Run>(`actions/runs/${priorRun}`);
  let candidate: TrustedCandidate;
  if (target === 'staging')
    candidate = await candidateFromRun(
      client,
      run,
      process.env.GITHUB_SHA ?? '',
      (await client.commit(run.head_sha)).tree.sha,
      run.head_sha,
    );
  else {
    trustedRun(run, policy, '.github/workflows/production.yml', 'main');
    if (!(await successfulJob(client, run, 'remote-test')))
      throw new Error(
        'Prior production release did not pass its deployment and remote smoke job.',
      );
    const { artifacts } = await client.get<{ artifacts: Artifact[] }>(
      `actions/runs/${run.id}/artifacts?per_page=100`,
    );
    const matches = artifacts.filter(
      (item) =>
        item.name === `production-release-${run.head_sha}-${run.run_attempt}` &&
        !item.expired &&
        item.workflow_run.id === run.id &&
        Date.parse(item.created_at) >= Date.parse(run.run_started_at),
    );
    if (matches.length !== 1)
      throw new Error('Prior production release record missing.');
    const record = await client.artifactJSON<ProductionRelease>(
      matches[0],
      'production-release.json',
    );
    if (
      record.schemaVersion !== 1 ||
      record.target !== 'production' ||
      record.productionRunId !== String(run.id) ||
      record.productionRunAttempt !== run.run_attempt ||
      !Number.isSafeInteger(record.sourceRunAttempt) ||
      record.sourceRunAttempt < 1 ||
      !/^\d+$/.test(record.sourceRunId)
    )
      throw new Error('Invalid prior production release record.');
    const sourceRun = await client.get<Run>(
      `actions/runs/${record.sourceRunId}/attempts/${record.sourceRunAttempt}`,
    );
    candidate = await candidateFromRun(
      client,
      sourceRun,
      process.env.GITHUB_SHA ?? '',
      record.sourceTree,
      record.sourceSha,
    );
    if (
      record.artifactId !== candidate.proof.artifactId ||
      record.receiptArtifactId !== candidate.proof.receiptArtifactId ||
      record.siteSha256 !== candidate.manifest.siteSha256 ||
      (await client.commit(run.head_sha)).tree.sha !== record.sourceTree
    )
      throw new Error(
        'Prior production record does not identify the previously published artifact.',
      );
  }
  if (
    (await client.ref(policy.targets[target].branch)) !== process.env.GITHUB_SHA
  )
    throw new Error('Destination advanced during rollback validation.');
  return candidate;
}
