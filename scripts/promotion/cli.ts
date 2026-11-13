import { readFile, appendFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import {
  assertDispatch,
  assertProjection,
  assertRun,
  commitPattern,
  digest,
  projectionDigest,
  provenancePath,
  requireValue,
  selectFiles,
  treeEntries,
  validatePolicy,
  type Entry,
  type Job,
  type Policy,
  type Run,
} from './core.ts';
import { GitHub } from './github.ts';

const policyURL = new URL(
  '../../.github/promotion-policy.json',
  import.meta.url,
);
export async function readPolicy(): Promise<Policy> {
  const value: unknown = JSON.parse(await readFile(policyURL, 'utf8'));
  validatePolicy(value);
  return value;
}
async function tree(client: GitHub, sha: string) {
  requireValue(commitPattern.test(sha), 'Expected a complete commit SHA.');
  const commit = await client.request<{
    tree: { sha: string };
    parents: { sha: string }[];
  }>(`/git/commits/${sha}`);
  requireValue(commitPattern.test(commit.tree.sha), 'Invalid commit tree.');
  const listing = await client.request<{ tree: Entry[]; truncated: boolean }>(
    `/git/trees/${commit.tree.sha}?recursive=1`,
  );
  return {
    sha: commit.tree.sha,
    files: treeEntries(listing.tree, listing.truncated),
    parents: commit.parents,
  };
}
async function sourceRef(client: GitHub) {
  return (
    await client.request<{ object: { sha: string } }>('/git/ref/heads/staging')
  ).object.sha;
}
async function latestRun(client: GitHub, policy: Policy, sha: string) {
  const runs = await client.pages<Run>(
    `/actions/workflows/staging.yml/runs?branch=staging&event=push&head_sha=${sha}`,
    'workflow_runs',
  );
  requireValue(runs.length > 0, 'No staging validation for this SHA.');
  const run = [...runs].sort((a, b) => b.id - a.id)[0];
  requireValue(
    run.path === policy.source.workflow,
    'Unexpected source workflow.',
  );
  return client.request<Run>(`/actions/runs/${run.id}`);
}
export async function inspectCandidate(policy: Policy, sha: string) {
  requireValue(
    commitPattern.test(sha),
    'Enter a complete, lowercase 40-character staging SHA.',
  );
  const source = new GitHub(policy.source.repository);
  const meta = await source.request<{ id: number; full_name: string }>('');
  requireValue(
    String(meta.id) === policy.source.id &&
      meta.full_name === policy.source.repository,
    'Source repository identity changed.',
  );
  requireValue(
    (await sourceRef(source)) === sha,
    'Only the currently published staging candidate may be prepared.',
  );
  const snapshot = await tree(source, sha);
  requireValue(
    snapshot.files[policy.source.workflow]?.sha === policy.source.workflowBlob,
    'Source workflow differs from the reviewed verifier.',
  );
  const run = await latestRun(source, policy, sha);
  const jobs = await source.pages<Job>(
    `/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs`,
    'jobs',
  );
  assertRun(policy, sha, run, jobs);
  const response = await fetch(policy.source.manifest, {
    redirect: 'error',
    signal: AbortSignal.timeout(20_000),
    cache: 'no-store',
  });
  requireValue(
    response.ok,
    `Staging identity unavailable: HTTP ${response.status}.`,
  );
  const text = await response.text();
  requireValue(text.length < 16_384, 'Oversized public release identity.');
  const identity = JSON.parse(text) as Record<string, unknown>;
  requireValue(
    identity.schemaVersion === 1 &&
      identity.repository === policy.source.repository &&
      identity.repositoryId === policy.source.id &&
      identity.sourceSha === sha &&
      identity.sourceTree === snapshot.sha &&
      typeof identity.payloadSha256 === 'string' &&
      /^[a-f0-9]{64}$/.test(identity.payloadSha256),
    'Live staging does not serve the exact verified source/tree/payload identity.',
  );
  const selected = selectFiles(policy, snapshot.files);
  // Reread both mutable run state and ref; an old success cannot hide a newer failure/rerun.
  const currentRun = await latestRun(source, policy, sha);
  requireValue(
    JSON.stringify(currentRun) === JSON.stringify(run) &&
      (await sourceRef(source)) === sha,
    'Staging evidence changed during verification.',
  );
  return {
    source,
    snapshot,
    selected,
    proof: {
      schemaVersion: 1,
      sourceRepository: policy.source.repository,
      sourceRepositoryId: policy.source.id,
      sourceSha: sha,
      sourceTree: snapshot.sha,
      sourceRunId: String(run.id),
      sourceRunAttempt: run.run_attempt,
      stagingPayloadSha256: identity.payloadSha256,
      projectionSha256: projectionDigest(selected),
      policySha256: digest(JSON.stringify(policy)),
    },
  };
}
async function destination(policy: Policy) {
  const token = process.env.GH_TOKEN;
  requireValue(token, 'A destination GITHUB_TOKEN is required.');
  const client = new GitHub(policy.destination.repository, token);
  const meta = await client.request<{ id: number; full_name: string }>('');
  requireValue(
    String(meta.id) === policy.destination.id &&
      meta.full_name === policy.destination.repository,
    'Destination repository identity changed.',
  );
  return client;
}
async function mainRef(client: GitHub) {
  return (
    await client.request<{ object: { sha: string } }>('/git/ref/heads/main')
  ).object.sha;
}
async function output(name: string, value: string) {
  requireValue(
    /^[\w-]+$/.test(name) && !/[\r\n]/.test(value),
    'Invalid workflow output.',
  );
  if (process.env.GITHUB_OUTPUT)
    await appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}
function assertNoCredentials(path: string, bytes: Buffer) {
  const text = bytes.toString('utf8');
  requireValue(
    !/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{40,}/.test(
      text,
    ),
    `Credential-shaped content is forbidden: ${path}`,
  );
  if (path === '.npmrc')
    requireValue(
      text
        .split('\n')
        .every(
          (line) =>
            !line.trim() ||
            /^(?:engine-strict|strict-peer-deps|save-exact)=true$/.test(
              line.trim(),
            ),
        ),
      'Only reviewed non-secret npm settings may be imported.',
    );
}
export async function prepare(write = false) {
  const policy = await readPolicy();
  assertDispatch(policy);
  const sha = process.env.STAGING_SHA ?? '';
  const candidate = await inspectCandidate(policy, sha);
  const client = await destination(policy);
  const baseSha = process.env.GITHUB_SHA!;
  requireValue(
    (await mainRef(client)) === baseSha,
    'Production main advanced; run preparation again.',
  );
  const base = await tree(client, baseSha);
  const fingerprint = digest(
    JSON.stringify({ baseSha, proof: candidate.proof }),
  );
  await output('fingerprint', fingerprint);
  if (!write) {
    console.log(
      `Verified staging ${sha}; ${Object.keys(candidate.selected).length} authorized files. No branch or PR created.`,
    );
    return;
  }
  requireValue(
    process.env.EXPECTED_FINGERPRINT === fingerprint,
    'Candidate differs from the read-only verification job.',
  );
  const suffix = `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`;
  requireValue(/^[1-9]\d*-[1-9]\d*$/.test(suffix), 'Invalid run identity.');
  const branch = `release/${sha.slice(0, 12)}-${suffix}`;
  const changes: {
    path: string;
    mode: string;
    type: string;
    sha: string | null;
  }[] = [];
  for (const path of policy.files) {
    const expected = candidate.selected[path];
    const previous = base.files[path];
    if (expected?.sha === previous?.sha && expected?.mode === previous?.mode)
      continue;
    if (!expected) {
      if (previous)
        changes.push({ path, mode: previous.mode, type: 'blob', sha: null });
      continue;
    }
    // Raw immutable files avoid exhausting the unauthenticated API blob quota.
    const response = await fetch(
      `https://raw.githubusercontent.com/${policy.source.repository}/${sha}/${path.split('/').map(encodeURIComponent).join('/')}`,
      { redirect: 'error', signal: AbortSignal.timeout(30_000) },
    );
    requireValue(
      response.ok,
      `Cannot download authorized source file: ${path}`,
    );
    const bytes = Buffer.from(await response.arrayBuffer());
    requireValue(
      bytes.length <= 4_000_000 &&
        createHash('sha1')
          .update(`blob ${bytes.length}\0`)
          .update(bytes)
          .digest('hex') === expected.sha,
      'Source bytes differ from the immutable Git blob.',
    );
    assertNoCredentials(path, bytes);
    const blob = await client.request<{ sha: string }>('/git/blobs', 'POST', {
      content: bytes.toString('base64'),
      encoding: 'base64',
    });
    requireValue(
      blob.sha === expected.sha,
      'Destination blob identity mismatch.',
    );
    changes.push({ path, mode: expected.mode, type: 'blob', sha: blob.sha });
  }
  if (!changes.length) {
    console.log(
      'No authorized application changes; no release branch or PR created.',
    );
    return;
  }
  const provenance = { ...candidate.proof, destinationBaseSha: baseSha };
  const blob = await client.request<{ sha: string }>('/git/blobs', 'POST', {
    content: `${JSON.stringify(provenance, null, 2)}\n`,
    encoding: 'utf-8',
  });
  changes.push({
    path: provenancePath,
    mode: '100644',
    type: 'blob',
    sha: blob.sha,
  });
  const createdTree = await client.request<{ sha: string }>(
    '/git/trees',
    'POST',
    { base_tree: base.sha, tree: changes },
  );
  const commit = await client.request<{
    sha: string;
    parents: { sha: string }[];
  }>('/git/commits', 'POST', {
    message: `Release ${sha.slice(0, 12)} from verified staging`,
    tree: createdTree.sha,
    parents: [baseSha],
  });
  requireValue(
    commit.parents.length === 1 && commit.parents[0].sha === baseSha,
    'Release must have only the destination parent.',
  );
  const finalCandidate = await inspectCandidate(policy, sha);
  requireValue(
    JSON.stringify(finalCandidate.proof) === JSON.stringify(candidate.proof) &&
      (await mainRef(client)) === baseSha,
    'Candidate/base changed; no release branch created.',
  );
  await client.request('/git/refs', 'POST', {
    ref: `refs/heads/${branch}`,
    sha: commit.sha,
  });
  const pr = await client.request<{ number: number; html_url: string }>(
    '/pulls',
    'POST',
    {
      head: branch,
      base: 'main',
      title: `Release ${sha.slice(0, 12)}`,
      body: `Imports the authorized files from staging ${sha}, validated by source run ${candidate.proof.sourceRunId} (attempt ${candidate.proof.sourceRunAttempt}).\n\nSource history is not imported. Production configuration is preserved. Cloudflare Workers Builds will rebuild after a manual merge.\n\nReview the diff and wait for quality. No automatic merge or deployment is performed by this workflow.`,
    },
  );
  console.log(pr.html_url);
  // GITHUB_TOKEN-created PRs may suppress pull_request/push workflows. Dispatch explicitly.
  await client.request('/actions/workflows/ci.yml/dispatches', 'POST', {
    ref: branch,
    inputs: { pr_number: String(pr.number) },
  });
}

export async function checkPR() {
  const policy = await readPolicy();
  requireValue(
    process.env.GITHUB_REPOSITORY === policy.destination.repository &&
      process.env.GITHUB_REPOSITORY_ID === policy.destination.id,
    'CI must run in production repository.',
  );
  const event = JSON.parse(
    await readFile(process.env.GITHUB_EVENT_PATH!, 'utf8'),
  ) as {
    pull_request?: { number: number };
    inputs?: { pr_number?: string };
  };
  const number = event.pull_request?.number ?? Number(event.inputs?.pr_number);
  requireValue(
    Number.isSafeInteger(number) && number > 0,
    'An exact PR number is required.',
  );
  const client = await destination(policy);
  interface PR {
    number: number;
    state: string;
    base: { ref: string; sha: string; repo: { id: number } };
    head: { ref: string; sha: string; repo: { id: number } };
    merge_commit_sha: string | null;
  }
  const pr = await client.request<PR>(`/pulls/${number}`);
  requireValue(
    pr.state === 'open' &&
      pr.base.ref === 'main' &&
      String(pr.base.repo.id) === policy.destination.id &&
      commitPattern.test(pr.base.sha) &&
      commitPattern.test(pr.head.sha),
    'Invalid or closed production PR.',
  );
  if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
    const context = JSON.parse(
      await readFile(process.env.GITHUB_EVENT_PATH!, 'utf8'),
    ) as { pull_request: PR };
    requireValue(
      context.pull_request.head.sha === pr.head.sha &&
        context.pull_request.base.sha === pr.base.sha,
      'Obsolete PR event.',
    );
  } else {
    requireValue(
      process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
        process.env.GITHUB_SHA === pr.head.sha &&
        process.env.GITHUB_REF === `refs/heads/${pr.head.ref}`,
      'Dispatch must identify the exact current release head.',
    );
  }
  requireValue(
    commitPattern.test(pr.merge_commit_sha ?? ''),
    'PR merge candidate is not ready; rerun CI.',
  );
  const merge = await tree(client, pr.merge_commit_sha!);
  requireValue(
    merge.parents.length === 2 &&
      merge.parents[0].sha === pr.base.sha &&
      merge.parents[1].sha === pr.head.sha,
    'PR merge candidate does not contain the exact current base and head.',
  );
  if (pr.head.ref.startsWith('release/')) {
    requireValue(
      String(pr.head.repo.id) === policy.destination.id &&
        /^release\/[a-f0-9]{12}-[1-9]\d*-[1-9]\d*$/.test(pr.head.ref),
      'Untrusted release branch.',
    );
    const head = await tree(client, pr.head.sha);
    const base = await tree(client, pr.base.sha);
    const provenanceEntry = head.files[provenancePath];
    requireValue(provenanceEntry, 'Release provenance is required.');
    const proof = JSON.parse(
      (await client.blob(provenanceEntry.sha)).toString('utf8'),
    ) as Record<string, unknown>;
    requireValue(
      typeof proof.sourceSha === 'string',
      'Missing source identity.',
    );
    const candidate = await inspectCandidate(policy, proof.sourceSha);
    requireValue(
      JSON.stringify(Object.entries(proof).sort()) ===
        JSON.stringify(
          Object.entries({
            ...candidate.proof,
            destinationBaseSha: pr.base.sha,
          }).sort(),
        ),
      'Release proof is obsolete or differs from verified staging/base.',
    );
    assertProjection(policy, base.files, head.files, candidate.snapshot.files);
    requireValue(
      head.parents.length === 1 && head.parents[0].sha === pr.base.sha,
      'Release ancestry must be a single new destination commit.',
    );
  } else {
    requireValue(
      process.env.GITHUB_EVENT_NAME === 'pull_request',
      'Manual CI dispatch is only for prepared releases.',
    );
  }
  const current = await client.request<PR>(`/pulls/${number}`);
  requireValue(
    current.head.sha === pr.head.sha &&
      current.base.sha === pr.base.sha &&
      current.merge_commit_sha === pr.merge_commit_sha &&
      current.state === 'open',
    'PR changed while checking provenance.',
  );
  await output('merge-sha', pr.merge_commit_sha!);
  await output('head-sha', pr.head.sha);
  console.log(
    `Verified PR #${number}, head ${pr.head.sha}; merge candidate ${pr.merge_commit_sha}.`,
  );
}
export async function main(args: string[]) {
  requireValue(args.length === 1, 'Choose inspect, prepare or check-pr.');
  if (args[0] === 'inspect') await prepare();
  else if (args[0] === 'prepare') await prepare(true);
  else if (args[0] === 'check-pr') await checkPR();
  else throw new Error('Unknown promotion command.');
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Promotion failed.');
    process.exitCode = 1;
  });
