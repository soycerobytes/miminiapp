import { createHash } from 'node:crypto';
import { matchesGlob } from 'node:path';

export interface Policy {
  schemaVersion: 2;
  source: {
    repository: string;
    id: string;
    branch: string;
    workflow: string;
    workflowBlob: string;
    manifest: string;
  };
  destination: { repository: string; id: string; branch: string };
  selection: 'snapshot';
}
export interface Entry {
  path: string;
  mode: string;
  type: string;
  sha: string;
}
export type Snapshot = Record<string, Pick<Entry, 'mode' | 'sha'>>;
export const provenancePath = '.github/release-provenance.json';
// Only destination-owned paths trigger automatic configuration CI. Keep the
// identical, ordered list in ci.yml; tests enforce parity and import isolation.
export const configurationPaths = [
  '.github/**',
  'scripts/promotion/**',
  'scripts/release/**',
  'scripts/validate-hosting.ts',
  'deploy/**',
  'docs/production-promotion.md',
  'docs/design-docs/index.md',
  'docs/exec-plans/active/PR-01-promocion-entre-repositorios.md',
  'docs/PLANS.md',
  'docs/BOOTSTRAP.md',
  'docs/harness-decisions.md',
  'tests/helpers/workflow-yaml.ts',
  'tests/fixtures/source-release/**',
  'tests/remote/**',
  'tests/unit/production-*.test.ts',
  'tests/unit/release-*.test.ts',
  'tests/unit/workflow-safety.test.ts',
  'tests/unit/pr-ci-identity.test.ts',
  'tests/unit/staging-token-probe.test.ts',
  'tests/unit/remote-target.test.ts',
  'README.md',
  'ARCHITECTURE.md',
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.gitignore',
  '.gitattributes',
  `!${provenancePath}`,
] as const;

export function isConfigurationPath(path: string) {
  let included = false;
  for (const pattern of configurationPaths) {
    const negative = pattern.startsWith('!');
    if (matchesGlob(path, negative ? pattern.slice(1) : pattern))
      included = !negative;
  }
  return included;
}
export const commitPattern = /^[a-f0-9]{40}$/;
export const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex');
export function requireValue(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
export function safePath(path: string) {
  return (
    typeof path === 'string' &&
    path.length > 0 &&
    path.length <= 1024 &&
    !path.startsWith('/') &&
    !path.includes('\\') &&
    [...path].every(
      (char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127,
    ) &&
    !path.split('/').some((part) => !part || part === '.' || part === '..') &&
    !/(^|\/)(?:\.git|\.env(?:\..*)?|\.dev\.vars(?:\..*)?|\.netrc|\.pypirc|\.git-credentials|\.ssh|node_modules|\.local)(\/|$)/.test(
      path,
    )
  );
}
/** Every normal versioned project file is imported except destination controls. */
export function isSnapshotPath(path: string) {
  return (
    safePath(path) && path !== provenancePath && !isConfigurationPath(path)
  );
}
export function managedPaths(base: Snapshot, source: Snapshot) {
  return [...new Set([...Object.keys(base), ...Object.keys(source)])]
    .filter(isSnapshotPath)
    .sort();
}
export function validatePolicy(value: unknown): asserts value is Policy {
  const p = value as Policy;
  requireValue(
    p?.schemaVersion === 2 &&
      p.source?.repository === 'aalexlpez/miminiapp' &&
      p.source.id === '1445849027' &&
      p.source.branch === 'staging' &&
      p.source.workflow === '.github/workflows/staging.yml' &&
      commitPattern.test(p.source.workflowBlob) &&
      p.source.manifest ===
        'https://miminiapp-staging.miminiapp-lab.workers.dev/release-manifest.json' &&
      p.destination?.repository === 'soycerobytes/miminiapp' &&
      p.destination.id === '1455524397' &&
      p.destination.branch === 'main' &&
      p.selection === 'snapshot' &&
      !Object.hasOwn(p, 'files') &&
      !Object.hasOwn(p, 'miniapps') &&
      !Object.hasOwn(p.source, 'registryBlob'),
    'Invalid snapshot promotion policy.',
  );
}
export function treeEntries(entries: Entry[], truncated = false): Snapshot {
  requireValue(!truncated && Array.isArray(entries), 'Incomplete Git tree.');
  const result: Snapshot = Object.create(null);
  for (const entry of entries) {
    requireValue(safePath(entry.path), 'Unsafe Git path.');
    if (entry.type === 'tree') continue;
    requireValue(
      entry.type === 'blob' &&
        ['100644', '100755'].includes(entry.mode) &&
        commitPattern.test(entry.sha) &&
        !Object.hasOwn(result, entry.path),
      `Unsupported Git entry (symlinks/submodules forbidden): ${entry.path}`,
    );
    result[entry.path] = { mode: entry.mode, sha: entry.sha };
  }
  return result;
}
export function selectFiles(policy: Policy, source: Snapshot): Snapshot {
  validatePolicy(policy);
  const result: Snapshot = Object.create(null);
  for (const path of Object.keys(source).filter(isSnapshotPath).sort())
    result[path] = source[path];
  return result;
}
export function projectionDigest(files: Snapshot) {
  return digest(
    JSON.stringify(
      Object.fromEntries(
        Object.keys(files)
          .sort()
          .map((path) => [path, files[path]]),
      ),
    ),
  );
}
export function assertProjection(
  policy: Policy,
  base: Snapshot,
  head: Snapshot,
  source: Snapshot,
) {
  const selected = selectFiles(policy, source);
  const expected = Object.fromEntries([
    ...Object.entries(base).filter(([path]) => !isSnapshotPath(path)),
    ...Object.entries(selected),
  ]);
  delete expected[provenancePath];
  const actual = { ...head };
  delete actual[provenancePath];
  requireValue(
    projectionDigest(actual) === projectionDigest(expected),
    'PR changes do not match the authorized projection or overwrite production controls.',
  );
}
export function assertDispatch(policy: Policy, env = process.env) {
  validatePolicy(policy);
  requireValue(
    env.GITHUB_ACTIONS === 'true' &&
      env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
      env.GITHUB_REPOSITORY === policy.destination.repository &&
      env.GITHUB_REPOSITORY_ID === policy.destination.id &&
      env.GITHUB_REF === 'refs/heads/main' &&
      commitPattern.test(env.GITHUB_SHA ?? ''),
    'Release preparation requires a manual dispatch on production main.',
  );
}

export interface Run {
  id: number;
  workflow_id: number;
  run_attempt: number;
  head_sha: string;
  head_branch: string;
  event: string;
  path: string;
  status: string;
  conclusion: string | null;
  repository: { id: number; full_name: string };
  head_repository: { id: number; full_name: string };
}
export interface Job {
  name: string;
  head_sha: string;
  status: string;
  conclusion: string | null;
  run_attempt: number;
  steps: { name: string; conclusion: string | null; status: string }[];
}
export function assertRun(policy: Policy, sha: string, run: Run, jobs: Job[]) {
  requireValue(
    Number.isSafeInteger(run.id) &&
      run.id > 0 &&
      Number.isSafeInteger(run.run_attempt) &&
      run.run_attempt > 0 &&
      Number.isSafeInteger(run.workflow_id) &&
      run.workflow_id > 0 &&
      run.head_sha === sha &&
      run.head_branch === 'staging' &&
      run.event === 'push' &&
      run.path === policy.source.workflow &&
      run.status === 'completed' &&
      run.conclusion === 'success' &&
      [run.repository, run.head_repository].every(
        (repo) =>
          repo?.full_name === policy.source.repository &&
          String(repo.id) === policy.source.id,
      ),
    'Staging run identity/result is not trusted.',
  );
  for (const [name, requiredSteps] of [
    ['prepare', ['Run npm run verify', 'Package the already tested build']],
    [
      'remote-test',
      [
        'Publish only the staging Worker',
        'Test the live staging identity and application',
        'Record successful validation separately from the payload',
      ],
    ],
  ] as const) {
    const matches = jobs.filter((job) => job.name === name);
    const job = matches[0];
    requireValue(
      matches.length === 1 &&
        job.head_sha === sha &&
        job.run_attempt === run.run_attempt &&
        job.status === 'completed' &&
        job.conclusion === 'success',
      `Missing successful staging job: ${name}`,
    );
    for (const stepName of requiredSteps)
      requireValue(
        job.steps.filter(
          (step) =>
            step.name === stepName &&
            step.status === 'completed' &&
            step.conclusion === 'success',
        ).length === 1,
        `Missing successful staging step: ${stepName}`,
      );
  }
}
