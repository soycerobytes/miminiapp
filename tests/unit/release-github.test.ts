import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  GitHubReader,
  checkPromotion,
  currentCandidate,
} from '../../scripts/release/github.ts';
import { type DeploymentPolicy } from '../../scripts/release/gate.ts';

const sha = 'a'.repeat(40),
  tree = 'b'.repeat(40),
  base = 'c'.repeat(40),
  merge = 'e'.repeat(40),
  digest = 'd'.repeat(64);
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
const repository = {
  id: Number(policy.repositoryId),
  full_name: policy.repository,
};
const actor = { login: policy.owner };
const run = {
  id: 123,
  run_attempt: 2,
  head_sha: sha,
  head_branch: 'staging',
  head_repository: repository,
  event: 'push',
  status: 'completed',
  conclusion: 'success',
  actor,
  triggering_actor: actor,
  path: '.github/workflows/staging.yml',
  run_started_at: '2026-11-06T00:00:00Z',
  pull_requests: [],
};
const manifest = {
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
const receipt = {
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
const candidateArtifact = {
  id: 456,
  name: `release-candidate-${sha}-2`,
  digest: `sha256:${digest}`,
  expired: false,
  created_at: '2026-11-06T00:00:01Z',
  workflow_run: { id: 123, head_sha: sha },
};
const receiptArtifact = {
  ...candidateArtifact,
  id: 789,
  name: `staging-validation-${sha}-2`,
};
const temporary: string[] = [];
afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  await Promise.all(
    temporary
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true })),
  );
});

function setup(
  options: {
    runs?: unknown[];
    artifact?: object;
    identity?: object;
    concurrentBase?: boolean;
  } = {},
) {
  let mainReads = 0;
  const requests: string[] = [];
  const fetcher = vi.fn(async (input: string | URL, init?: RequestInit) => {
    const url = String(input);
    requests.push(url);
    expect(init?.method ?? 'GET').toBe('GET');
    if (url.startsWith(policy.targets.staging.url))
      return Response.json(options.identity ?? manifest);
    const path = new URL(url).pathname.replace(
      `/repos/${policy.repository}/`,
      '',
    );
    if (path === 'git/ref/heads/staging')
      return Response.json({ object: { sha } });
    if (path === 'git/ref/heads/main')
      return Response.json({
        object: { sha: options.concurrentBase && ++mainReads > 1 ? sha : base },
      });
    if (path === 'actions/workflows/staging.yml/runs')
      return Response.json({ workflow_runs: options.runs ?? [run] });
    if (path === 'actions/runs/123/attempts/2/jobs')
      return Response.json({
        jobs: [
          {
            name: 'remote-test',
            conclusion: 'success',
            status: 'completed',
            run_attempt: 2,
          },
        ],
      });
    if (path === 'actions/runs/123/artifacts')
      return Response.json({
        artifacts: [options.artifact ?? candidateArtifact, receiptArtifact],
      });
    if (path === `git/commits/${sha}`)
      return Response.json({ sha, tree: { sha: tree }, parents: [] });
    if (path === `git/commits/${merge}`)
      return Response.json({
        sha: merge,
        tree: { sha: tree },
        parents: [{ sha: base }, { sha }],
      });
    if (path === 'pulls/7')
      return Response.json({
        number: 7,
        state: 'open',
        merged: false,
        merge_commit_sha: merge,
        merged_by: null,
        base: { ref: 'main', sha: base, repo: repository },
        head: { ref: 'staging', sha, repo: repository },
        user: actor,
      });
    if (path === 'actions/runs')
      return Response.json({
        workflow_runs: [
          {
            ...run,
            id: 100,
            event: 'pull_request',
            path: '.github/workflows/ci.yml',
            pull_requests: [{ number: 7 }],
          },
        ],
      });
    if (path === 'actions/runs/100/attempts/2/jobs')
      return Response.json({
        jobs: [
          {
            name: 'quality',
            conclusion: 'success',
            status: 'completed',
            run_attempt: 2,
          },
        ],
      });
    throw new Error(`Unmocked read: ${path}`);
  });
  vi.stubGlobal('fetch', fetcher);
  const archives = vi
    .spyOn(GitHubReader.prototype, 'artifactJSON')
    .mockImplementation(
      async (artifact) =>
        (artifact.name.startsWith('release-candidate-')
          ? manifest
          : receipt) as never,
    );
  return {
    client: new GitHubReader(policy, 'test-token'),
    fetcher,
    archives,
    requests,
  };
}

describe('trusted GitHub candidate lookup', () => {
  it('finds current completed staging push, exact attempt artifacts and served identity using read-only calls', async () => {
    const { client, fetcher } = setup();
    const candidate = await currentCandidate(client, base, tree);
    expect(candidate.proof.artifactId).toBe('456');
    expect(candidate.proof.receiptArtifactId).toBe('789');
    expect(fetcher).toHaveBeenLastCalledWith(
      `${policy.targets.staging.url}/release-manifest.json`,
      expect.objectContaining({ redirect: 'error', cache: 'no-store' }),
    );
  });

  it('does not fall back to an older green run when a newer run failed', async () => {
    const { client, archives } = setup({
      runs: [run, { ...run, id: 124, conclusion: 'failure' }],
    });
    await expect(currentCandidate(client, base, tree)).rejects.toThrow(
      'trusted release',
    );
    expect(archives).not.toHaveBeenCalled();
  });

  it.each([
    ['head_repository', { id: 888, full_name: 'other/repo' }],
    ['event', 'pull_request'],
    ['actor', { login: 'other' }],
    ['triggering_actor', { login: 'other' }],
    ['status', 'in_progress'],
    ['path', '.github/workflows/foreign.yml'],
  ])('rejects forged run provenance %s', async (key, value) => {
    const { client, archives } = setup({ runs: [{ ...run, [key]: value }] });
    await expect(currentCandidate(client, base, tree)).rejects.toThrow();
    expect(archives).not.toHaveBeenCalled();
  });

  it.each([
    ['expired', true],
    ['created_at', '2026-11-05T00:00:00Z'],
    ['workflow_run', { id: 999, head_sha: sha }],
    ['name', `release-candidate-${base}`],
  ])('rejects unavailable or wrong-attempt archive %s', async (key, value) => {
    const { client } = setup({
      artifact: { ...candidateArtifact, [key]: value },
    });
    await expect(currentCandidate(client, base, tree)).rejects.toThrow(
      'Missing or ambiguous artifact',
    );
  });

  it('rejects a staging rollback or different payload still served under unchanged refs', async () => {
    const { client } = setup({
      identity: { ...manifest, payloadSha256: 'f'.repeat(64) },
    });
    await expect(currentCandidate(client, base, tree)).rejects.toThrow(
      'no longer the release currently served',
    );
  });

  it('re-reads the main base after metadata and archive downloads and rejects a concurrent merge', async () => {
    setup({ concurrentBase: true });
    const root = await mkdtemp(join(tmpdir(), 'miminiapp-event-'));
    temporary.push(root);
    const path = join(root, 'event.json');
    await writeFile(path, JSON.stringify({ repository, number: 7 }));
    for (const [key, value] of Object.entries({
      GITHUB_REPOSITORY: policy.repository,
      GITHUB_REPOSITORY_ID: policy.repositoryId,
      GITHUB_ACTOR: policy.owner,
      GITHUB_TRIGGERING_ACTOR: policy.owner,
      GITHUB_EVENT_NAME: 'pull_request',
      GITHUB_EVENT_PATH: path,
      GITHUB_TOKEN: 'read-only-test',
    }))
      vi.stubEnv(key, value);
    await expect(checkPromotion(policy)).rejects.toThrow('Branches changed');
  });

  it('never forwards a GitHub bearer credential to a storage redirect', async () => {
    const fetcher = vi.fn(async (input: string | URL) => {
      expect(String(input)).toContain('https://api.github.com/');
      return new Response(null, {
        status: 302,
        headers: { location: 'https://evil.example/archive.zip' },
      });
    });
    vi.stubGlobal('fetch', fetcher);
    const client = new GitHubReader(policy, 'test-token');
    await expect(
      client.artifactJSON(candidateArtifact, 'manifest.json'),
    ).rejects.toThrow('Unexpected artifact download origin');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0]?.[0]).toBe(
      `https://api.github.com/repos/${policy.repository}/actions/artifacts/456/zip`,
    );
  });
});
