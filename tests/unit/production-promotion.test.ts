import { createHash } from 'node:crypto';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  assertDispatch,
  assertProjection,
  assertRun,
  digest,
  projectionDigest,
  provenancePath,
  safePath,
  selectFiles,
  treeEntries,
  validatePolicy,
  type Entry,
  type Job,
  type Policy,
  type Run,
  type Snapshot,
} from '../../scripts/promotion/core.ts';
import {
  inspectCandidate,
  prepare,
  readPolicy,
  checkPR,
} from '../../scripts/promotion/cli.ts';

const sha = 'a'.repeat(40);
const treeSha = 'b'.repeat(40);
const baseSha = 'c'.repeat(40);
const gitHash = (bytes: Buffer | string) => {
  const value = Buffer.from(bytes);
  return createHash('sha1')
    .update(`blob ${value.length}\0`)
    .update(value)
    .digest('hex');
};
const entry = (path: string, value = path): Entry => ({
  path,
  type: 'blob',
  mode: '100644',
  sha: gitHash(value),
});
const blob = { mode: '100644', sha };
const basicPolicy: Policy = {
  schemaVersion: 1,
  source: {
    repository: 'aalexlpez/miminiapp',
    id: '1445849027',
    branch: 'staging',
    workflow: '.github/workflows/staging.yml',
    workflowBlob: sha,
    registryBlob: gitHash('registry'),
    manifest:
      'https://miminiapp-staging.miminiapp-lab.workers.dev/release-manifest.json',
  },
  destination: {
    repository: 'soycerobytes/miminiapp',
    id: '1455524397',
    branch: 'main',
  },
  files: ['src/miniapps/registry.ts', 'src/platform.ts'],
  miniapps: [],
};
const sourceFiles: Snapshot = {
  'src/miniapps/registry.ts': {
    mode: '100644',
    sha: basicPolicy.source.registryBlob,
  },
  'src/platform.ts': blob,
};
const sourceRun = (policy = basicPolicy): Run => ({
  id: 12,
  workflow_id: 34,
  run_attempt: 1,
  head_sha: sha,
  head_branch: 'staging',
  event: 'push',
  path: policy.source.workflow,
  status: 'completed',
  conclusion: 'success',
  repository: { id: 1445849027, full_name: 'aalexlpez/miminiapp' },
  head_repository: { id: 1445849027, full_name: 'aalexlpez/miminiapp' },
});
const jobs = (): Job[] => [
  {
    name: 'prepare',
    head_sha: sha,
    status: 'completed',
    conclusion: 'success',
    run_attempt: 1,
    steps: ['Run npm run verify', 'Package the already tested build'].map(
      (name) => ({ name, conclusion: 'success', status: 'completed' }),
    ),
  },
  {
    name: 'remote-test',
    head_sha: sha,
    status: 'completed',
    conclusion: 'success',
    run_attempt: 1,
    steps: [
      'Publish only the staging Worker',
      'Test the live staging identity and application',
      'Record successful validation separately from the payload',
    ].map((name) => ({ name, conclusion: 'success', status: 'completed' })),
  },
];
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('production import boundary', () => {
  it('selects exact reviewed files, ignoring source deployment/governance files', () => {
    expect(
      selectFiles(basicPolicy, {
        ...sourceFiles,
        '.github/workflows/evil.yml': blob,
        'deploy/cloudflare/production.jsonc': blob,
      }),
    ).toEqual(sourceFiles);
  });
  it.each([
    'src/miniapps/unapproved/entry.astro',
    'public/new-tool.svg',
    'src/components/Unknown.astro',
    'tests/e2e/unapproved.spec.ts',
  ])('rejects unreviewed application additions: %s', (path) => {
    expect(() =>
      selectFiles(basicPolicy, { ...sourceFiles, [path]: blob }),
    ).toThrow('Unapproved application file');
  });
  it('rejects enabling miniapps by changing only the registry', () => {
    expect(() =>
      selectFiles(basicPolicy, {
        ...sourceFiles,
        'src/miniapps/registry.ts': blob,
      }),
    ).toThrow('reviewed empty catalogue');
  });
  it.each([
    '../secret',
    '/etc/passwd',
    'src/../secret',
    '.env',
    'src/.env.local',
    'a//b',
    'a\\b',
    'a\nb',
  ])('rejects unsafe/secret paths: %s', (path) =>
    expect(safePath(path)).toBe(false),
  );
  it.each([
    '.github/workflows/ci.yml',
    'deploy/cloudflare/production.jsonc',
    'scripts/promotion/core.ts',
    'AGENTS.md',
    '.env.production',
  ])(
    'rejects a policy that imports destination controls/secrets: %s',
    (path) => {
      expect(() =>
        validatePolicy({ ...basicPolicy, files: [...basicPolicy.files, path] }),
      ).toThrow();
    },
  );
  it('rejects truncated trees, symlinks, submodules and duplicate paths', () => {
    expect(() => treeEntries([], true)).toThrow('Incomplete');
    for (const [mode, type] of [
      ['120000', 'blob'],
      ['160000', 'commit'],
    ])
      expect(() =>
        treeEntries([{ ...entry('src/platform.ts'), mode, type }]),
      ).toThrow('Unsupported');
    expect(() => treeEntries([entry('a'), entry('a')])).toThrow('Unsupported');
  });
  it('handles managed deletions and preserves every unmanaged production file', () => {
    const base = {
      ...sourceFiles,
      '.github/workflows/ci.yml': blob,
      'deploy/custom.jsonc': blob,
    };
    const source = {
      'src/miniapps/registry.ts': sourceFiles['src/miniapps/registry.ts'],
    };
    const head: Snapshot = { ...base, [provenancePath]: blob };
    delete head['src/platform.ts'];
    expect(() =>
      assertProjection(basicPolicy, base, head, source),
    ).not.toThrow();
    expect(() =>
      assertProjection(
        basicPolicy,
        base,
        { ...head, 'src/platform.ts': blob },
        source,
      ),
    ).toThrow();
    expect(() =>
      assertProjection(
        basicPolicy,
        base,
        { ...head, '.github/workflows/ci.yml': { ...blob, sha: baseSha } },
        source,
      ),
    ).toThrow('overwrite production controls');
  });
});

describe('staging evidence', () => {
  it('requires the successful exact workflow/run/attempt, including verify and live tests', () =>
    expect(() =>
      assertRun(basicPolicy, sha, sourceRun(), jobs()),
    ).not.toThrow());
  it.each([
    { head_sha: baseSha },
    { event: 'pull_request' },
    { conclusion: 'failure' },
    { status: 'in_progress' },
    { head_branch: 'main' },
    { run_attempt: 0 },
    { path: '.github/workflows/fake.yml' },
    { repository: { id: 1, full_name: 'aalexlpez/miminiapp' } },
    {
      head_repository: { id: 1455524397, full_name: 'soycerobytes/miminiapp' },
    },
  ])('rejects a run identity/result regression: %j', (change) =>
    expect(() =>
      assertRun(basicPolicy, sha, { ...sourceRun(), ...change }, jobs()),
    ).toThrow(),
  );
  it.each(['failure', 'skipped', null])(
    'rejects a non-successful required step: %s',
    (conclusion) => {
      const value = jobs();
      value[0].steps[0].conclusion = conclusion;
      expect(() => assertRun(basicPolicy, sha, sourceRun(), value)).toThrow(
        'successful staging step',
      );
    },
  );
  it('rejects a stale attempt and missing/duplicate jobs', () => {
    const value = jobs();
    value[1].run_attempt = 2;
    expect(() => assertRun(basicPolicy, sha, sourceRun(), value)).toThrow();
    expect(() =>
      assertRun(basicPolicy, sha, sourceRun(), jobs().slice(0, 1)),
    ).toThrow();
    expect(() =>
      assertRun(basicPolicy, sha, sourceRun(), [...jobs(), jobs()[0]]),
    ).toThrow();
  });
  it.each(['push', 'pull_request', 'repository_dispatch'])(
    'a %s event cannot prepare production',
    (GITHUB_EVENT_NAME) => {
      expect(() =>
        assertDispatch(basicPolicy, {
          GITHUB_ACTIONS: 'true',
          GITHUB_EVENT_NAME,
          GITHUB_REF: 'refs/heads/main',
          GITHUB_REPOSITORY: basicPolicy.destination.repository,
          GITHUB_REPOSITORY_ID: basicPolicy.destination.id,
          GITHUB_SHA: baseSha,
        }),
      ).toThrow('manual dispatch');
    },
  );
});

/** Full mocked REST boundary; not a shell/Git mock that could conceal source ancestry. */
async function githubFixture() {
  const policy = await readPolicy();
  const bytes = new Map<string, Buffer>();
  const sourceEntries = policy.files.map((path) => {
    const content =
      path === 'src/miniapps/registry.ts'
        ? Buffer.from('')
        : Buffer.from(`reviewed ${path}\n`);
    const e = entry(path, content.toString());
    bytes.set(e.sha, content);
    return e;
  });
  sourceEntries.find((e) => e.path === 'src/miniapps/registry.ts')!.sha =
    policy.source.registryBlob;
  sourceEntries.push({
    path: policy.source.workflow,
    type: 'blob',
    mode: '100644',
    sha: policy.source.workflowBlob,
  });
  const baseEntries = structuredClone(sourceEntries);
  const changedPath = 'src/styles/global.css';
  baseEntries.find((e) => e.path === changedPath)!.sha = gitHash(
    'previous production',
  );
  const writes: {
    path: string;
    method: string;
    body: Record<string, unknown>;
  }[] = [];
  const reads: { url: string; headers: HeadersInit | undefined }[] = [];
  let currentSourceRef = sha;
  let run = sourceRun(policy);
  let identitySha = sha;
  let headEntries: Entry[] = [];
  let parents = [{ sha: baseSha }];
  let baseRef = baseSha;
  let sourceRefReads = 0;
  let changeSourceAfter = Infinity;
  const pr = {
    number: 42,
    state: 'open',
    base: { ref: 'main', sha: baseSha, repo: { id: 1455524397 } },
    head: {
      ref: `release/${sha.slice(0, 12)}-99-1`,
      sha: 'e'.repeat(40),
      repo: { id: 1455524397 },
    },
    merge_commit_sha: 'f'.repeat(40),
  };
  const fetchMock = vi.fn(
    async (input: string | URL | Request, options?: RequestInit) => {
      const url = String(input);
      const method = options?.method ?? 'GET';
      const u = new URL(url);
      const source = u.pathname.startsWith('/repos/aalexlpez/');
      if (
        source ||
        u.hostname.endsWith('workers.dev') ||
        u.hostname === 'raw.githubusercontent.com'
      )
        expect(new Headers(options?.headers).get('Authorization')).toBeNull();
      const path = u.pathname.replace(
        /^\/repos\/(?:aalexlpez|soycerobytes)\/miminiapp/,
        '',
      );
      const json = (data: unknown, status = 200) =>
        new Response(JSON.stringify(data), { status });
      if (method !== 'GET') {
        const body = JSON.parse(String(options?.body)) as Record<
          string,
          unknown
        >;
        writes.push({ path, method, body });
        if (path === '/git/blobs')
          return json({
            sha: gitHash(
              Buffer.from(
                body.content as string,
                body.encoding === 'base64' ? 'base64' : 'utf8',
              ),
            ),
          });
        if (path === '/git/trees') return json({ sha: 'd'.repeat(40) });
        if (path === '/git/commits')
          return json({ sha: 'e'.repeat(40), parents: [{ sha: baseSha }] });
        if (path === '/git/refs') return json({ ref: body.ref });
        if (path === '/pulls')
          return json({
            number: 42,
            html_url: 'https://github.com/soycerobytes/miminiapp/pull/42',
          });
        if (path === '/actions/workflows/ci.yml/dispatches')
          return new Response(null, { status: 204 });
        throw new Error(`Unexpected write ${method} ${path}`);
      }
      reads.push({ url, headers: options?.headers });
      if (u.hostname === 'raw.githubusercontent.com') {
        const file = sourceEntries.find((e) =>
          u.pathname.endsWith(`/${e.path}`),
        );
        return new Response(new Uint8Array(bytes.get(file!.sha)!));
      }
      if (u.hostname.endsWith('workers.dev'))
        return json({
          schemaVersion: 1,
          repository: policy.source.repository,
          repositoryId: policy.source.id,
          sourceSha: identitySha,
          sourceTree: treeSha,
          payloadSha256: 'f'.repeat(64),
        });
      if (!path)
        return json({
          id: Number(source ? policy.source.id : policy.destination.id),
          full_name: source
            ? policy.source.repository
            : policy.destination.repository,
        });
      if (path === '/git/ref/heads/staging') {
        sourceRefReads++;
        return json({
          object: {
            sha:
              sourceRefReads >= changeSourceAfter ? baseSha : currentSourceRef,
          },
        });
      }
      if (path === '/git/ref/heads/main')
        return json({ object: { sha: baseRef } });
      if (path === '/pulls/42') return json(pr);
      if (path.startsWith('/git/blobs/')) {
        const content = bytes.get(path.split('/').at(-1)!)!;
        return json({
          encoding: 'base64',
          content: content.toString('base64'),
          size: content.length,
        });
      }
      if (path.startsWith('/git/commits/')) {
        if (!source && path.endsWith(pr.merge_commit_sha))
          return json({
            tree: { sha: 'd'.repeat(40) },
            parents: [{ sha: pr.base.sha }, { sha: pr.head.sha }],
          });
        return json({
          tree: {
            sha: source
              ? treeSha
              : path.endsWith(pr.head.sha)
                ? 'd'.repeat(40)
                : baseSha,
          },
          parents: source ? [] : path.endsWith(pr.head.sha) ? parents : [],
        });
      }
      if (path.startsWith('/git/trees/'))
        return json({
          tree: source
            ? sourceEntries
            : path.includes('d'.repeat(40))
              ? headEntries
              : baseEntries,
          truncated: false,
        });
      if (path === '/actions/workflows/staging.yml/runs')
        return json({ workflow_runs: [run] });
      if (path === '/actions/runs/12') return json(run);
      if (path === '/actions/runs/12/attempts/1/jobs')
        return json({ jobs: jobs() });
      throw new Error(`Unexpected read ${url}`);
    },
  );
  vi.stubGlobal('fetch', fetchMock);
  for (const [key, value] of Object.entries({
    GITHUB_ACTIONS: 'true',
    GITHUB_EVENT_NAME: 'workflow_dispatch',
    GITHUB_REF: 'refs/heads/main',
    GITHUB_REPOSITORY: policy.destination.repository,
    GITHUB_REPOSITORY_ID: policy.destination.id,
    GITHUB_SHA: baseSha,
    GITHUB_RUN_ID: '99',
    GITHUB_RUN_ATTEMPT: '1',
    STAGING_SHA: sha,
    GH_TOKEN: 'destination-token',
  }))
    vi.stubEnv(key, value);
  vi.stubEnv('GITHUB_OUTPUT', '');
  return {
    policy,
    writes,
    reads,
    sourceEntries,
    baseEntries,
    pr,
    setBaseRef: (value: string) => {
      baseRef = value;
    },
    changeSourceAfter: (count: number) => {
      changeSourceAfter = count;
    },
    setupRelease: async (
      changeProof?: (proof: Record<string, unknown>) => void,
    ) => {
      const candidate = await inspectCandidate(policy, sha);
      const proof: Record<string, unknown> = {
        ...candidate.proof,
        destinationBaseSha: baseSha,
      };
      changeProof?.(proof);
      const content = Buffer.from(JSON.stringify(proof));
      const e = entry(provenancePath, content.toString());
      bytes.set(e.sha, content);
      headEntries = [...structuredClone(sourceEntries), e];
      return headEntries;
    },
    setParents: (value: { sha: string }[]) => {
      parents = value;
    },
    setSourceRef: (v: string) => {
      currentSourceRef = v;
    },
    setIdentity: (v: string) => {
      identitySha = v;
    },
    setRun: (v: Run) => {
      run = v;
    },
  };
}

describe('manual preparation end to end with isolated API fixtures', () => {
  it('inspect is read-only and prepare creates a destination-only commit/PR with explicit CI dispatch', async () => {
    const f = await githubFixture();
    await prepare();
    expect(f.writes).toEqual([]);
    const candidate = await inspectCandidate(f.policy, sha);
    expect(candidate.proof.projectionSha256).toBe(
      projectionDigest(candidate.selected),
    );
    vi.stubEnv(
      'EXPECTED_FINGERPRINT',
      digest(JSON.stringify({ baseSha, proof: candidate.proof })),
    );
    await prepare(true);
    const commit = f.writes.find((w) => w.path === '/git/commits')!;
    expect(commit.body.parents).toEqual([baseSha]);
    expect(f.writes.find((w) => w.path === '/git/refs')!.body.ref).toBe(
      `refs/heads/release/${sha.slice(0, 12)}-99-1`,
    );
    expect(f.writes.find((w) => w.path === '/pulls')!.body).toMatchObject({
      base: 'main',
      head: `release/${sha.slice(0, 12)}-99-1`,
    });
    expect(f.writes.at(-1)).toMatchObject({
      path: '/actions/workflows/ci.yml/dispatches',
      body: {
        ref: `release/${sha.slice(0, 12)}-99-1`,
        inputs: { pr_number: '42' },
      },
    });
    expect(f.writes.every((w) => w.method === 'POST')).toBe(true);
    expect(f.writes.some((w) => /merge|deployments/.test(w.path))).toBe(false);
  });
  it('rejects an unpublished SHA before writes', async () => {
    const f = await githubFixture();
    f.setSourceRef(baseSha);
    await expect(prepare(true)).rejects.toThrow('currently published');
    expect(f.writes).toEqual([]);
  });
  it('rejects a disagreeing live identity before writes', async () => {
    const f = await githubFixture();
    f.setIdentity(baseSha);
    await expect(prepare(true)).rejects.toThrow('Live staging');
    expect(f.writes).toEqual([]);
  });
  it('never falls back to an old green attempt when the latest run failed', async () => {
    const f = await githubFixture();
    f.setRun({ ...sourceRun(f.policy), conclusion: 'failure' });
    await expect(prepare(true)).rejects.toThrow('run identity/result');
    expect(f.writes).toEqual([]);
  });
  it('rejects unexpected files or a different source workflow', async () => {
    const f = await githubFixture();
    f.sourceEntries.push(entry('public/unapproved.svg'));
    await expect(prepare(true)).rejects.toThrow('Unapproved application file');
    expect(f.writes).toEqual([]);
  });
  it('requires the read-only job fingerprint before any writes', async () => {
    const f = await githubFixture();
    vi.stubEnv('EXPECTED_FINGERPRINT', 'wrong');
    await expect(prepare(true)).rejects.toThrow('read-only verification job');
    expect(f.writes).toEqual([]);
  });
  it('imports the native TypeScript CLI without performing any actions', () => {
    expect(
      execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          'await import("./scripts/promotion/cli.ts")',
        ],
        { encoding: 'utf8' },
      ),
    ).toBe('');
  });
  it('detects staging changing during an inspection', async () => {
    const f = await githubFixture();
    f.changeSourceAfter(2);
    await expect(prepare(true)).rejects.toThrow('changed during verification');
    expect(f.writes).toEqual([]);
  });
  it('detects production main advancing before any writes', async () => {
    const f = await githubFixture();
    f.setBaseRef('f'.repeat(40));
    await expect(prepare(true)).rejects.toThrow('main advanced');
    expect(f.writes).toEqual([]);
  });
  it('does not expose a branch if staging changes after commit-object preparation', async () => {
    const f = await githubFixture();
    const c = await inspectCandidate(f.policy, sha);
    vi.stubEnv(
      'EXPECTED_FINGERPRINT',
      digest(JSON.stringify({ baseSha, proof: c.proof })),
    );
    f.changeSourceAfter(5);
    await expect(prepare(true)).rejects.toThrow('currently published');
    expect(f.writes.some((w) => w.path === '/git/commits')).toBe(true);
    expect(
      f.writes.some((w) => w.path === '/git/refs' || w.path === '/pulls'),
    ).toBe(false);
  });
  it('rejects changes to the trusted staging verifier', async () => {
    const f = await githubFixture();
    f.sourceEntries.find((e) => e.path === f.policy.source.workflow)!.sha =
      baseSha;
    await expect(prepare(true)).rejects.toThrow('reviewed verifier');
    expect(f.writes).toEqual([]);
  });
  it('does not create a release for an unchanged application', async () => {
    const f = await githubFixture();
    f.baseEntries.splice(
      0,
      f.baseEntries.length,
      ...structuredClone(f.sourceEntries),
    );
    const c = await inspectCandidate(f.policy, sha);
    vi.stubEnv(
      'EXPECTED_FINGERPRINT',
      digest(JSON.stringify({ baseSha, proof: c.proof })),
    );
    await prepare(true);
    expect(f.writes).toEqual([]);
  });
});

const temporary: string[] = [];
afterEach(async () => {
  await Promise.all(
    temporary
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true })),
  );
});
async function releaseContext(f: Awaited<ReturnType<typeof githubFixture>>) {
  const directory = await mkdtemp(join(tmpdir(), 'production-pr-'));
  temporary.push(directory);
  const filename = join(directory, 'event.json');
  await writeFile(filename, JSON.stringify({ inputs: { pr_number: '42' } }));
  vi.stubEnv('GITHUB_EVENT_PATH', filename);
  vi.stubEnv('GITHUB_SHA', f.pr.head.sha);
  vi.stubEnv('GITHUB_REF', `refs/heads/${f.pr.head.ref}`);
}
describe('trusted PR provenance gate', () => {
  it('accepts the exact projection with destination-only ancestry without writing', async () => {
    const f = await githubFixture();
    await f.setupRelease();
    await releaseContext(f);
    await expect(checkPR()).resolves.toBeUndefined();
    expect(f.writes).toEqual([]);
  });
  it('rejects overwriting production control files', async () => {
    const f = await githubFixture();
    const head = await f.setupRelease();
    head.push(entry('.github/workflows/ci.yml', 'tampered'));
    await releaseContext(f);
    await expect(checkPR()).rejects.toThrow('overwrite production controls');
  });
  it('rejects forged provenance', async () => {
    const f = await githubFixture();
    await f.setupRelease((proof) => {
      proof.sourceRunId = '999';
    });
    await releaseContext(f);
    await expect(checkPR()).rejects.toThrow('proof is obsolete');
  });
  it('rejects importing source commit ancestry', async () => {
    const f = await githubFixture();
    await f.setupRelease();
    f.setParents([{ sha: baseSha }, { sha }]);
    await releaseContext(f);
    await expect(checkPR()).rejects.toThrow('single new destination commit');
  });
  it('rejects a stale dispatched head and a release from a fork', async () => {
    const f = await githubFixture();
    await f.setupRelease();
    await releaseContext(f);
    vi.stubEnv('GITHUB_SHA', baseSha);
    await expect(checkPR()).rejects.toThrow('exact current release head');
    vi.stubEnv('GITHUB_SHA', f.pr.head.sha);
    f.pr.head.repo.id = 1;
    await expect(checkPR()).rejects.toThrow('Untrusted release branch');
  });
});
