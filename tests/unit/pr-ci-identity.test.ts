import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CI_WORKFLOW_BLOB_SHA,
  CI_WORKFLOW_PATH,
  expectedPRCIName,
  successfulPRQuality,
} from '../../scripts/release/pr-ci.ts';
import { type DeploymentPolicy } from '../../scripts/release/gate.ts';

const sha = 'a'.repeat(40);
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
  url: `https://api.github.com/repos/${policy.repository}`,
};
const context = {
  number: 3,
  base: 'staging',
  headSha: sha,
  headRef: 'feature/i03-example',
  mergeSha: 'e'.repeat(40),
};
const title = `I03 CI v1 | repo=${policy.repository} | id=${policy.repositoryId} | pr=3 | base=staging | head=${sha}`;
const run = {
  id: 100,
  name: title,
  workflow_id: 408984944,
  path: CI_WORKFLOW_PATH,
  event: 'pull_request',
  repository,
  head_repository: repository,
  head_sha: sha,
  head_branch: context.headRef,
  display_title: title,
  run_attempt: 2,
  status: 'completed',
  conclusion: 'success',
  pull_requests: [],
};
const association = {
  number: 3,
  base: { ref: 'staging', repo: repository },
  head: { ref: context.headRef, sha, repo: repository },
};
type Metadata = Record<string, unknown>;

afterEach(() => vi.restoreAllMocks());

function setup(
  options: {
    runs?: Metadata[];
    finalRuns?: Metadata[];
    detailRuns?: Metadata[];
    workflow?: Metadata;
    source?: Metadata;
    mergedSource?: Metadata;
    jobs?: Metadata[];
  } = {},
) {
  const runs = options.runs ?? [run];
  let listReads = 0;
  let detailReads = 0;
  const requests: string[] = [];
  const get = vi.fn(async <T>(suffix: string): Promise<T> => {
    requests.push(suffix);
    if (suffix.startsWith('actions/runs?')) {
      expect(suffix).toBe(
        `actions/runs?event=pull_request&head_sha=${sha}&per_page=100`,
      );
      return {
        workflow_runs: listReads++ === 0 ? runs : (options.finalRuns ?? runs),
      } as T;
    }
    if (suffix === 'actions/workflows/ci.yml')
      return (options.workflow ?? {
        id: 408984944,
        path: CI_WORKFLOW_PATH,
        name: 'CI',
        state: 'active',
      }) as T;
    if (suffix === `contents/${CI_WORKFLOW_PATH}?ref=${sha}`)
      return (options.source ?? {
        type: 'file',
        path: CI_WORKFLOW_PATH,
        sha: CI_WORKFLOW_BLOB_SHA,
      }) as T;
    if (suffix === `contents/${CI_WORKFLOW_PATH}?ref=${context.mergeSha}`)
      return (options.mergedSource ?? {
        type: 'file',
        path: CI_WORKFLOW_PATH,
        sha: CI_WORKFLOW_BLOB_SHA,
      }) as T;
    const runMatch = /^actions\/runs\/(\d+)$/.exec(suffix);
    if (runMatch) {
      const details = options.detailRuns;
      const result = details
        ? details[Math.min(detailReads++, details.length - 1)]
        : runs.find((item) => item.id === Number(runMatch[1]));
      if (!result) throw new Error('Unmocked workflow run ID');
      return result as T;
    }
    if (/^actions\/runs\/\d+\/attempts\/\d+\/jobs\?per_page=100$/.test(suffix))
      return {
        jobs: options.jobs ?? [
          {
            name: 'quality',
            status: 'completed',
            conclusion: 'success',
            run_attempt: 2,
          },
        ],
      } as T;
    throw new Error(`Unexpected read-only CI metadata request: ${suffix}`);
  });
  return {
    client: {
      policy,
      get: <T>(suffix: string): Promise<T> => get(suffix) as Promise<T>,
    },
    get,
    requests,
  };
}

describe('persistent PR identity in GitHub CI metadata', () => {
  it('uses an exact versioned title from PR identity rather than mutable descriptive text', () => {
    expect(expectedPRCIName(policy, context)).toBe(title);
    expect(
      expectedPRCIName(policy, { ...context, headRef: 'a-title-or-branch' }),
    ).toBe(title);
  });

  it.each([
    ['empty associations after merge', run],
    ['omitted associations', { ...run, pull_requests: undefined }],
    ['matching native association', { ...run, pull_requests: [association] }],
  ])('accepts valid pinned CI with %s', async (_label, candidate) => {
    const { client, requests } = setup({ runs: [candidate] });
    await expect(successfulPRQuality(client, context)).resolves.toBe('success');
    expect(requests).toContain(`contents/${CI_WORKFLOW_PATH}?ref=${sha}`);
    expect(requests).toContain(
      `contents/${CI_WORKFLOW_PATH}?ref=${context.mergeSha}`,
    );
    expect(requests).toContain('actions/runs/100/attempts/2/jobs?per_page=100');
    expect(requests.filter((path) => path === 'actions/runs/100')).toHaveLength(
      2,
    );
    expect(
      requests.filter((path) => path.startsWith('actions/runs?')),
    ).toHaveLength(2);
  });

  it.each([
    ['missing persistent evidence', { ...run, display_title: undefined }],
    ['wrong PR', { ...run, display_title: title.replace('pr=3', 'pr=4') }],
    [
      'wrong title repository',
      {
        ...run,
        display_title: title.replace(
          'repo=aalexlpez/miminiapp',
          'repo=other/repo',
        ),
      },
    ],
    [
      'wrong base',
      { ...run, display_title: title.replace('base=staging', 'base=main') },
    ],
    [
      'wrong head SHA in persistent evidence',
      { ...run, display_title: title.replace(sha, 'b'.repeat(40)) },
    ],
    [
      'manipulated evidence',
      { ...run, display_title: `${title} ignored-suffix` },
    ],
    ['different head SHA', { ...run, head_sha: 'b'.repeat(40) }],
    ['push instead of PR', { ...run, event: 'push' }],
    ['other repository', { ...run, repository: { ...repository, id: 999 } }],
    [
      'foreign head repository',
      { ...run, head_repository: { ...repository, full_name: 'other/repo' } },
    ],
    ['other workflow ID', { ...run, workflow_id: 999 }],
    ['other workflow file', { ...run, path: '.github/workflows/foreign.yml' }],
    ['wrong head branch', { ...run, head_branch: 'another-branch' }],
    ['contradictory dynamic run name', { ...run, name: 'Other' }],
    ['pending CI', { ...run, status: 'in_progress', conclusion: null }],
    ['failed CI', { ...run, conclusion: 'failure' }],
    ['invalid attempt', { ...run, run_attempt: 0 }],
  ])(
    'rejects %s even when other metadata looks successful',
    async (_label, candidate) => {
      const { client } = setup({ runs: [candidate] });
      await expect(successfulPRQuality(client, context)).resolves.toBe(
        'failure',
      );
    },
  );

  it.each([
    ['another PR', [{ number: 4 }]],
    ['mixed correct and contradictory PRs', [association, { number: 4 }]],
    [
      'contradictory base',
      [{ ...association, base: { ...association.base, ref: 'main' } }],
    ],
    [
      'contradictory head',
      [{ ...association, head: { ...association.head, sha: 'b'.repeat(40) } }],
    ],
    [
      'contradictory head branch',
      [
        {
          ...association,
          head: { ...association.head, ref: 'other-branch' },
        },
      ],
    ],
    [
      'contradictory repository identity',
      [
        {
          ...association,
          base: { ...association.base, repo: { ...repository, id: 999 } },
        },
      ],
    ],
    [
      'contradictory repository API origin',
      [
        {
          ...association,
          head: {
            ...association.head,
            repo: {
              ...repository,
              url: 'https://api.github.com/repos/other/repo',
            },
          },
        },
      ],
    ],
    ['malformed association list', { number: 3 }],
  ])(
    'rejects %s in supplied native associations',
    async (_label, pullRequests) => {
      const { client } = setup({
        runs: [{ ...run, pull_requests: pullRequests }],
      });
      await expect(successfulPRQuality(client, context)).resolves.toBe(
        'failure',
      );
    },
  );

  it.each([
    [
      'a workflow with a modified run-name or body',
      { type: 'file', path: CI_WORKFLOW_PATH, sha: 'f'.repeat(40) },
    ],
    ['missing source identity', { type: 'file', path: CI_WORKFLOW_PATH }],
  ])('rejects %s despite a matching display title', async (_label, source) => {
    const { client } = setup({ source });
    await expect(successfulPRQuality(client, context)).resolves.toBe('failure');
  });

  it('rejects a workflow inherited differently in the merge even if the head has the pinned template', async () => {
    const { client } = setup({
      mergedSource: {
        type: 'file',
        path: CI_WORKFLOW_PATH,
        sha: 'f'.repeat(40),
      },
    });
    await expect(successfulPRQuality(client, context)).resolves.toBe('failure');
  });

  it.each([
    ['missing quality job', []],
    [
      'failed quality job',
      [
        {
          name: 'quality',
          status: 'completed',
          conclusion: 'failure',
          run_attempt: 2,
        },
      ],
    ],
    [
      'successful job from an older attempt',
      [
        {
          name: 'quality',
          status: 'completed',
          conclusion: 'success',
          run_attempt: 1,
        },
      ],
    ],
  ])('rejects %s', async (_label, jobs) => {
    const { client } = setup({ jobs });
    await expect(successfulPRQuality(client, context)).resolves.toBe('failure');
  });

  it.each([
    ['failed', { ...run, id: 101, conclusion: 'failure' }],
    [
      'without identity evidence',
      { ...run, id: 101, display_title: undefined },
    ],
    [
      'with contradictory repository identity',
      { ...run, id: 101, repository: { ...repository, id: 999 } },
    ],
  ])(
    'does not fall back to an older green run when the latest is %s',
    async (_label, latest) => {
      const { client } = setup({ runs: [run, latest] });
      await expect(successfulPRQuality(client, context)).resolves.toBe(
        'failure',
      );
    },
  );

  it('rejects a newer run appearing during job validation', async () => {
    const { client } = setup({
      finalRuns: [run, { ...run, id: 101, conclusion: 'failure' }],
    });
    await expect(successfulPRQuality(client, context)).resolves.toBe('failure');
  });

  it('rejects a later failed rerun instead of trusting the prior successful attempt', async () => {
    const { client } = setup({
      detailRuns: [run, { ...run, run_attempt: 3, conclusion: 'failure' }],
    });
    await expect(successfulPRQuality(client, context)).resolves.toBe('failure');
  });
});
