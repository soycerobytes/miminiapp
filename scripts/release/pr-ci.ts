import { isCommit } from './manifest.ts';
import { type DeploymentPolicy } from './gate.ts';

export const CI_WORKFLOW_PATH = '.github/workflows/ci.yml';
// Full Git blob, not a partial YAML/text match. Update only with reviewed CI changes.
export const CI_WORKFLOW_BLOB_SHA = '0eeba0f156faf009d65e265f41f4123d1b583c02';
export const CI_RUN_NAME_EXPRESSION =
  "${{ github.event_name == 'pull_request' && format('I03 CI v1 | repo={0} | id={1} | pr={2} | base={3} | head={4}', github.event.pull_request.base.repo.full_name, github.event.pull_request.base.repo.id, github.event.pull_request.number, github.event.pull_request.base.ref, github.event.pull_request.head.sha) || format('I03 CI push | repo={0} | head={1}', github.repository, github.sha) }}";

interface Repository {
  id: number;
  full_name: string;
}
export interface PRCIContext {
  number: number;
  base: string;
  headSha: string;
  headRef: string;
  mergeSha: string;
}
interface Reader {
  readonly policy: DeploymentPolicy;
  get<T>(suffix: string): Promise<T>;
}
interface Run {
  id: number;
  name: string;
  workflow_id: number;
  path: string;
  repository: Repository;
  head_repository: Repository;
  head_sha: string;
  head_branch: string;
  event: string;
  display_title: string;
  status: string;
  conclusion: string | null;
  run_attempt: number;
  pull_requests?: unknown;
}

const positiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export function expectedPRCIName(policy: DeploymentPolicy, pr: PRCIContext) {
  return `I03 CI v1 | repo=${policy.repository} | id=${policy.repositoryId} | pr=${pr.number} | base=${pr.base} | head=${pr.headSha}`;
}

function sameRepository(
  repo: Repository | undefined,
  policy: DeploymentPolicy,
) {
  return (
    String(repo?.id) === policy.repositoryId &&
    repo?.full_name === policy.repository
  );
}

function consistentAssociations(
  value: unknown,
  policy: DeploymentPolicy,
  pr: PRCIContext,
) {
  if (value === undefined) return true; // Identity is still mandatory below.
  if (!Array.isArray(value)) return false;
  return value.every((entry: unknown) => {
    if (!record(entry) || entry.number !== pr.number) return false;
    const api = `https://api.github.com/repos/${policy.repository}`;
    if ('url' in entry && entry.url !== `${api}/pulls/${pr.number}`)
      return false;
    for (const side of ['base', 'head'] as const) {
      if (!(side in entry)) continue;
      const ref = entry[side];
      if (!record(ref)) return false;
      if ('ref' in ref && ref.ref !== (side === 'base' ? pr.base : pr.headRef))
        return false;
      if (side === 'head' && 'sha' in ref && ref.sha !== pr.headSha)
        return false;
      if (!('repo' in ref)) continue;
      const repo = ref.repo;
      if (
        !record(repo) ||
        ('id' in repo && String(repo.id) !== policy.repositoryId) ||
        ('full_name' in repo && repo.full_name !== policy.repository) ||
        ('name' in repo && repo.name !== policy.repository.split('/')[1]) ||
        ('url' in repo && repo.url !== api)
      )
        return false;
    }
    return true;
  });
}

/** Select first; invalid identity/provenance must not hide a newer failed run. */
function latestRun(runs: Run[], pr: PRCIContext) {
  return runs
    .filter(
      (run) =>
        run.path === CI_WORKFLOW_PATH &&
        run.event === 'pull_request' &&
        run.head_sha === pr.headSha,
    )
    .sort((a, b) => b.id - a.id)[0];
}

/** Read-only proof from GitHub metadata plus an exact, reviewed workflow blob. */
export async function successfulPRQuality(client: Reader, pr: PRCIContext) {
  const { policy } = client;
  if (
    !positiveInteger(pr.number) ||
    !isCommit(pr.headSha) ||
    !isCommit(pr.mergeSha) ||
    !pr.headRef ||
    !Object.values(policy.targets).some((target) => target.branch === pr.base)
  )
    return 'failure';
  const query = `actions/runs?event=pull_request&head_sha=${pr.headSha}&per_page=100`;
  const { workflow_runs: runs } = await client.get<{ workflow_runs: Run[] }>(
    query,
  );
  const latest = latestRun(runs, pr);
  if (!latest || !positiveInteger(latest.id)) return 'failure';

  const workflow = await client.get<{
    id: number;
    path: string;
    name: string;
    state: string;
  }>('actions/workflows/ci.yml');
  type WorkflowSource = {
    type: string;
    path: string;
    sha: string;
  };
  const source = await client.get<WorkflowSource>(
    `contents/${CI_WORKFLOW_PATH}?ref=${pr.headSha}`,
  );
  const mergedSource = await client.get<WorkflowSource>(
    `contents/${CI_WORKFLOW_PATH}?ref=${pr.mergeSha}`,
  );
  if (
    !positiveInteger(workflow.id) ||
    workflow.path !== CI_WORKFLOW_PATH ||
    workflow.name !== 'CI' ||
    workflow.state !== 'active' ||
    ![source, mergedSource].every(
      (file) =>
        file.type === 'file' &&
        file.path === CI_WORKFLOW_PATH &&
        file.sha === CI_WORKFLOW_BLOB_SHA,
    )
  )
    return 'failure';

  const expectedName = expectedPRCIName(policy, pr);
  const valid = (run: Run) =>
    run.id === latest.id &&
    run.name === expectedName &&
    run.workflow_id === workflow.id &&
    run.path === CI_WORKFLOW_PATH &&
    run.event === 'pull_request' &&
    run.head_sha === pr.headSha &&
    run.head_branch === pr.headRef &&
    sameRepository(run.repository, policy) &&
    sameRepository(run.head_repository, policy) &&
    run.display_title === expectedName &&
    consistentAssociations(run.pull_requests, policy, pr) &&
    positiveInteger(run.run_attempt) &&
    run.run_attempt === latest.run_attempt &&
    run.status === 'completed' &&
    run.conclusion === 'success';
  if (!valid(latest)) return 'failure';
  const current = await client.get<Run>(`actions/runs/${latest.id}`);
  if (!valid(current)) return 'failure';
  const { jobs } = await client.get<{
    jobs: {
      name: string;
      status: string;
      conclusion: string;
      run_attempt: number;
    }[];
  }>(
    `actions/runs/${current.id}/attempts/${current.run_attempt}/jobs?per_page=100`,
  );
  const quality = jobs.filter((job) => job.name === 'quality');
  if (
    quality.length !== 1 ||
    quality[0].status !== 'completed' ||
    quality[0].conclusion !== 'success' ||
    quality[0].run_attempt !== current.run_attempt
  )
    return 'failure';
  if (!valid(await client.get<Run>(`actions/runs/${latest.id}`)))
    return 'failure';
  const fresh = latestRun(
    (await client.get<{ workflow_runs: Run[] }>(query)).workflow_runs,
    pr,
  );
  return fresh && valid(fresh) ? 'success' : 'failure';
}
