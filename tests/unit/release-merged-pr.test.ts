import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkMerged } from '../../scripts/release/github.ts';
import { type DeploymentPolicy } from '../../scripts/release/gate.ts';
import {
  CI_WORKFLOW_BLOB_SHA,
  CI_WORKFLOW_PATH,
  expectedPRCIName,
} from '../../scripts/release/pr-ci.ts';

const headSha = 'a'.repeat(40);
const treeSha = 'b'.repeat(40);
const baseSha = 'c'.repeat(40);
const mergeSha = 'e'.repeat(40);
const policy: DeploymentPolicy = {
  schemaVersion: 1,
  phase: 'B',
  deploymentsEnabled: true,
  repository: 'aalexlpez/miminiapp',
  repositoryId: '1445849027',
  owner: 'aalexlpez',
  targets: {
    staging: {
      branch: 'staging',
      worker: 'miminiapp-staging',
      url: 'https://miminiapp-staging.miminiapp-lab.workers.dev',
      deploymentsEnabled: true,
    },
    production: {
      branch: 'main',
      worker: 'miminiapp',
      url: 'https://miminiapp.miminiapp-lab.workers.dev',
      deploymentsEnabled: false,
    },
  },
};
const repository = {
  id: Number(policy.repositoryId),
  full_name: policy.repository,
};
const actor = { login: policy.owner };
// commits/{sha}/pulls returns summaries: merged and merged_by are absent.
const summary = {
  number: 3,
  state: 'closed',
  merged_at: '2026-11-06T18:00:00Z',
  merge_commit_sha: mergeSha,
  base: { ref: 'staging', sha: mergeSha, repo: repository },
  head: {
    ref: 'feature/i03-staging-first-release',
    sha: headSha,
    repo: repository,
  },
  user: actor,
};
const detail = { ...summary, merged: true, merged_by: actor };
const ciName = expectedPRCIName(policy, {
  number: 3,
  base: 'staging',
  headSha,
  headRef: summary.head.ref,
  mergeSha,
});
const qualityRun = {
  id: 100,
  name: ciName,
  workflow_id: 408984944,
  repository,
  run_attempt: 2,
  head_sha: headSha,
  head_branch: summary.head.ref,
  head_repository: repository,
  event: 'pull_request',
  status: 'completed',
  conclusion: 'success',
  actor,
  triggering_actor: actor,
  path: CI_WORKFLOW_PATH,
  display_title: ciName,
  pull_requests: [{ number: 3 }],
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

async function setup(
  options: {
    summaries?: unknown[];
    detail?: unknown;
    runs?: unknown[];
    jobs?: unknown[];
    refs?: string[];
    event?: object;
    environment?: Record<string, string>;
  } = {},
) {
  const root = await mkdtemp(join(tmpdir(), 'miminiapp-merged-pr-'));
  temporary.push(root);
  const eventPath = join(root, 'event.json');
  await writeFile(
    eventPath,
    JSON.stringify({
      repository,
      before: baseSha,
      after: mergeSha,
      ...options.event,
    }),
  );
  for (const [key, value] of Object.entries({
    GITHUB_ACTIONS: 'true',
    GITHUB_REPOSITORY: policy.repository,
    GITHUB_REPOSITORY_ID: policy.repositoryId,
    GITHUB_ACTOR: policy.owner,
    GITHUB_TRIGGERING_ACTOR: policy.owner,
    GITHUB_EVENT_NAME: 'push',
    GITHUB_REF: 'refs/heads/staging',
    GITHUB_SHA: mergeSha,
    GITHUB_EVENT_PATH: eventPath,
    GITHUB_TOKEN: 'read-only-fixture-token',
    ...options.environment,
  }))
    vi.stubEnv(key, value);
  const requests: string[] = [];
  let refReads = 0;
  const fetcher = vi.fn(async (input: string | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    expect(url.origin).toBe('https://api.github.com');
    expect(init?.method ?? 'GET').toBe('GET');
    requests.push(url.pathname + url.search);
    const path = url.pathname.replace(`/repos/${policy.repository}/`, '');
    if (path === `git/commits/${mergeSha}`)
      return Response.json({
        sha: mergeSha,
        tree: { sha: treeSha },
        parents: [{ sha: baseSha }, { sha: headSha }],
      });
    if (path === 'git/ref/heads/staging') {
      const refs = options.refs ?? [mergeSha, mergeSha];
      const sha = refs[Math.min(refReads++, refs.length - 1)];
      return Response.json({ object: { sha } });
    }
    if (path === `commits/${mergeSha}/pulls`)
      return Response.json(options.summaries ?? [summary]);
    if (path === 'pulls/3') return Response.json(options.detail ?? detail);
    if (path === 'actions/runs') {
      expect(url.searchParams.get('event')).toBe('pull_request');
      expect(url.searchParams.get('head_sha')).toBe(headSha);
      return Response.json({ workflow_runs: options.runs ?? [qualityRun] });
    }
    if (path === 'actions/workflows/ci.yml')
      return Response.json({
        id: 408984944,
        path: CI_WORKFLOW_PATH,
        name: 'CI',
        state: 'active',
      });
    if (path === `contents/${CI_WORKFLOW_PATH}`) {
      expect([headSha, mergeSha]).toContain(url.searchParams.get('ref'));
      return Response.json({
        type: 'file',
        path: CI_WORKFLOW_PATH,
        sha: CI_WORKFLOW_BLOB_SHA,
      });
    }
    const runMatch = /^actions\/runs\/(\d+)$/.exec(path);
    if (runMatch) {
      const selected = (options.runs ?? [qualityRun]).find(
        (run) => (run as { id: number }).id === Number(runMatch[1]),
      );
      if (!selected) throw new Error('Unexpected workflow run ID');
      return Response.json(selected);
    }
    if (path === 'actions/runs/100/attempts/2/jobs')
      return Response.json({
        jobs: options.jobs ?? [
          {
            name: 'quality',
            status: 'completed',
            conclusion: 'success',
            run_attempt: 2,
          },
        ],
      });
    throw new Error(`Unmocked GitHub read: ${path}`);
  });
  vi.stubGlobal('fetch', fetcher);
  return { requests, fetcher };
}

describe('merged pull request lookup with GitHub summary responses', () => {
  it('resolves the real summary shape without merged, then verifies detail and the exact PR CI', async () => {
    const { requests } = await setup();
    expect(Object.hasOwn(summary, 'merged')).toBe(false);
    expect(Object.hasOwn(summary, 'merged_by')).toBe(false);
    const result = await checkMerged(policy, 'staging');
    expect(result.evidence.pr.merged).toBe(true);
    expect(result.evidence.pr.mergedBy).toBe(policy.owner);
    expect(result.evidence.checks.quality).toBe('success');
    expect(result.evidence.actualBaseSha).toBe(baseSha);
    // GitHub may update base.sha after merging; provenance uses the actual first parent.
    expect(detail.base.sha).not.toBe(baseSha);
    const prefix = `/repos/${policy.repository}/`;
    expect(requests).toContain(
      `${prefix}commits/${mergeSha}/pulls?per_page=100`,
    );
    const detailIndex = requests.indexOf(`${prefix}pulls/3`);
    const ciIndex = requests.findIndex((path) =>
      path.startsWith(`${prefix}actions/runs?`),
    );
    expect(detailIndex).toBeGreaterThan(-1);
    expect(ciIndex).toBeGreaterThan(detailIndex);
    expect(
      requests.filter((path) => path === `${prefix}git/ref/heads/staging`),
    ).toHaveLength(2);
  });

  it('ignores unrelated summaries instead of resolving another PR detail', async () => {
    const { requests } = await setup({
      summaries: [
        { ...summary, number: 4, merged_at: null },
        { ...summary, number: 5, merge_commit_sha: baseSha },
        summary,
      ],
    });
    await expect(checkMerged(policy, 'staging')).resolves.toBeDefined();
    expect(requests.filter((path) => /\/pulls\/\d+$/.test(path))).toEqual([
      `/repos/${policy.repository}/pulls/3`,
    ]);
  });

  it.each([
    ['open state', { ...summary, state: 'open' }],
    [
      'null merged_at despite merged true',
      { ...summary, merged_at: null, merged: true },
    ],
    [
      'missing merged_at despite merged true',
      { ...summary, merged_at: undefined, merged: true },
    ],
    ['invalid merged_at', { ...summary, merged_at: 'not-a-date' }],
    ['wrong merge SHA', { ...summary, merge_commit_sha: baseSha }],
    [
      'wrong destination',
      { ...summary, base: { ...summary.base, ref: 'main' } },
    ],
  ])('rejects an ineligible summary: %s', async (_label, value) => {
    const { requests } = await setup({ summaries: [value] });
    await expect(checkMerged(policy, 'staging')).rejects.toThrow(
      'Exactly one merged pull request',
    );
    expect(requests.some((path) => /\/pulls\/\d+$/.test(path))).toBe(false);
  });

  it.each([
    { summaries: [] },
    { summaries: [summary, { ...summary, number: 4 }] },
  ])('rejects absent or ambiguous associated PRs', async ({ summaries }) => {
    await setup({ summaries });
    await expect(checkMerged(policy, 'staging')).rejects.toThrow(
      'Exactly one merged pull request',
    );
  });

  it.each([0, 1.5, Number.MAX_SAFE_INTEGER + 1])(
    'rejects an invalid summary number %s before detail lookup',
    async (number) => {
      const { requests } = await setup({ summaries: [{ ...summary, number }] });
      await expect(checkMerged(policy, 'staging')).rejects.toThrow();
      expect(
        requests.some((path) =>
          path.startsWith(`/repos/${policy.repository}/pulls/`),
        ),
      ).toBe(false);
    },
  );

  it.each([
    ['not merged', { ...detail, merged: false }],
    ['missing merged', { ...detail, merged: undefined }],
    ['open state', { ...detail, state: 'open' }],
    ['missing merge date', { ...detail, merged_at: null }],
    ['invalid merge date', { ...detail, merged_at: 'not-a-date' }],
    ['different PR number', { ...detail, number: 4 }],
    ['wrong merge SHA', { ...detail, merge_commit_sha: baseSha }],
    ['wrong destination', { ...detail, base: { ...detail.base, ref: 'main' } }],
  ])(
    'rejects unverified PR detail before consulting CI: %s',
    async (_label, value) => {
      const { requests } = await setup({ detail: value });
      await expect(checkMerged(policy, 'staging')).rejects.toThrow();
      expect(requests.some((path) => path.includes('/actions/'))).toBe(false);
    },
  );

  it.each(['head', 'base'] as const)(
    'rejects foreign %s repository identity in the detail',
    async (side) => {
      for (const repo of [
        { ...repository, id: 999 },
        { ...repository, full_name: 'other/repository' },
      ]) {
        const { requests } = await setup({
          detail: {
            ...detail,
            [side]: { ...detail[side], repo },
          },
        });
        await expect(checkMerged(policy, 'staging')).rejects.toThrow();
        expect(requests.some((path) => path.includes('/actions/'))).toBe(false);
      }
    },
  );

  it('rejects a PR merged by another user', async () => {
    await setup({ detail: { ...detail, merged_by: { login: 'other' } } });
    await expect(checkMerged(policy, 'staging')).rejects.toThrow(
      'owner-merged pull request',
    );
  });

  it.each([
    ['no PR CI', { runs: [] }],
    [
      'CI without persistent PR identity',
      {
        runs: [{ ...qualityRun, display_title: undefined, pull_requests: [] }],
      },
    ],
    ['missing required job', { jobs: [] }],
    [
      'newer failed CI after an older green run',
      { runs: [qualityRun, { ...qualityRun, id: 101, conclusion: 'failure' }] },
    ],
  ])('does not bypass required quality: %s', async (_label, options) => {
    await setup(options);
    await expect(checkMerged(policy, 'staging')).rejects.toThrow(
      'owner-merged pull request',
    );
  });

  it('accepts missing native PR associations only with valid pinned persistent CI identity', async () => {
    await setup({ runs: [{ ...qualityRun, pull_requests: [] }] });
    await expect(checkMerged(policy, 'staging')).resolves.toMatchObject({
      evidence: { checks: { quality: 'success' } },
    });
  });

  it('rejects an obsolete merge at the initial destination read', async () => {
    await setup({ refs: [headSha] });
    await expect(checkMerged(policy, 'staging')).rejects.toThrow(
      'obsolete or concurrent',
    );
  });

  it('rechecks the destination and rejects a concurrent advance after PR and CI validation', async () => {
    await setup({ refs: [mergeSha, headSha] });
    await expect(checkMerged(policy, 'staging')).rejects.toThrow(
      'Destination changed',
    );
  });

  it('rejects a push before SHA inconsistent with the merge first parent', async () => {
    await setup({ event: { before: headSha } });
    await expect(checkMerged(policy, 'staging')).rejects.toThrow(
      'obsolete or concurrent',
    );
  });

  it('rejects a foreign event repository before any API call', async () => {
    const { fetcher } = await setup({
      event: { repository: { ...repository, id: 999 } },
    });
    await expect(checkMerged(policy, 'staging')).rejects.toThrow(
      'repository mismatch',
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
});
