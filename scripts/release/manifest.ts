import { createHash } from 'node:crypto';
import {
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export const publicManifestName = 'release-manifest.json';
export const sha256 = (value: string | Uint8Array) =>
  createHash('sha256').update(value).digest('hex');
export const isCommit = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
export const isDigest = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

export interface ReleaseManifest {
  schemaVersion: 1;
  repository: string;
  repositoryId: string;
  sourceSha: string;
  sourceTree: string;
  buildRunId: string;
  buildRunAttempt: number;
  payloadSha256: string;
  siteSha256: string;
  files: Record<string, string>;
}

export type ReleaseSource = Pick<
  ReleaseManifest,
  | 'repository'
  | 'repositoryId'
  | 'sourceSha'
  | 'sourceTree'
  | 'buildRunId'
  | 'buildRunAttempt'
>;

const forbidden =
  /(?:i02-fixture-|I02_FIXTURE_|I02_DRAFT_|environment-fixture|Etiqueta de prueba)/;
const forbiddenPath =
  /(?:^|\/)(?:\.env(?:\.[^/]*)?|node_modules|\.git|\.local|tests|src)(?:\/|$)/;

/** Sorted paths and hashes, without timestamps or host-specific paths. */
export async function hashFiles(
  directory: string,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  async function visit(relative: string) {
    const absolute = join(directory, relative);
    const entries = await readdir(absolute, { withFileTypes: true });
    for (const entry of entries.sort((a, b) =>
      a.name.localeCompare(b.name, 'en'),
    )) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (forbiddenPath.test(name) || forbidden.test(name))
        throw new Error(`Forbidden release path: ${name}`);
      const filename = join(directory, name);
      const details = await lstat(filename);
      if (details.isSymbolicLink())
        throw new Error(`Release symlinks are forbidden: ${name}`);
      if (details.isDirectory()) await visit(name);
      else if (details.isFile()) {
        const bytes = await readFile(filename);
        if (forbidden.test(bytes.toString('utf8')))
          throw new Error(`Synthetic content in release: ${name}`);
        result[name] = sha256(bytes);
      } else throw new Error(`Unsupported release file: ${name}`);
    }
  }
  await visit('');
  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => a.localeCompare(b, 'en')),
  );
}

export function hashTable(files: Record<string, string>) {
  return sha256(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(files).sort(([a], [b]) => a.localeCompare(b, 'en')),
      ),
    ),
  );
}

export function validateManifest(
  value: unknown,
): asserts value is ReleaseManifest {
  const manifest = value as ReleaseManifest;
  if (
    !manifest ||
    manifest.schemaVersion !== 1 ||
    manifest.repository !== 'aalexlpez/miminiapp' ||
    !/^\d+$/.test(manifest.repositoryId ?? '') ||
    !isCommit(manifest.sourceSha) ||
    !isCommit(manifest.sourceTree) ||
    !/^\d+$/.test(manifest.buildRunId ?? '') ||
    !Number.isSafeInteger(manifest.buildRunAttempt) ||
    manifest.buildRunAttempt < 1 ||
    !isDigest(manifest.payloadSha256) ||
    !isDigest(manifest.siteSha256) ||
    !manifest.files ||
    Array.isArray(manifest.files)
  ) {
    throw new Error('Invalid release manifest or provenance.');
  }
  const entries = Object.entries(manifest.files);
  if (!entries.length || !Object.hasOwn(manifest.files, publicManifestName))
    throw new Error('Missing release identity.');
  for (const [filename, digest] of entries) {
    if (
      !filename ||
      filename.startsWith('/') ||
      filename
        .split('/')
        .some((part) => !part || part === '.' || part === '..') ||
      filename.includes('\\') ||
      forbiddenPath.test(filename) ||
      !isDigest(digest)
    )
      throw new Error('Invalid release file table.');
  }
}

export async function packageRelease(
  dist: string,
  artifactDirectory: string,
  source: ReleaseSource,
): Promise<ReleaseManifest> {
  if (!isCommit(source.sourceSha) || !isCommit(source.sourceTree))
    throw new Error('Release source commit and tree are required.');
  const input = resolve(dist);
  const output = resolve(artifactDirectory);
  if (output === input || output.startsWith(`${input}/`))
    throw new Error('Release output must be outside dist.');
  const originalFiles = await hashFiles(input);
  if (Object.hasOwn(originalFiles, publicManifestName))
    throw new Error('Input must not already contain release identity.');
  for (const required of [
    'es/index.html',
    'en/index.html',
    '404.html',
    'index.html',
  ]) {
    if (!Object.hasOwn(originalFiles, required))
      throw new Error(`Missing static route: ${required}`);
  }
  // A nonempty output is rejected rather than leaving stale files in an artifact.
  await mkdir(dirname(output), { recursive: true });
  await mkdir(output);
  const site = join(output, 'site');
  await cp(input, site, { recursive: true });
  const payloadSha256 = hashTable(originalFiles);
  const publicIdentity = {
    schemaVersion: 1,
    repository: source.repository,
    repositoryId: source.repositoryId,
    sourceSha: source.sourceSha,
    sourceTree: source.sourceTree,
    payloadSha256,
  };
  await writeFile(
    join(site, publicManifestName),
    `${JSON.stringify(publicIdentity, null, 2)}\n`,
  );
  const files = await hashFiles(site);
  const manifest: ReleaseManifest = {
    schemaVersion: 1,
    ...source,
    payloadSha256,
    siteSha256: hashTable(files),
    files,
  };
  validateManifest(manifest);
  await writeFile(
    join(output, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return manifest;
}

export async function verifyRelease(
  artifactDirectory: string,
): Promise<ReleaseManifest> {
  const manifest: unknown = JSON.parse(
    await readFile(join(artifactDirectory, 'manifest.json'), 'utf8'),
  );
  validateManifest(manifest);
  const files = await hashFiles(join(artifactDirectory, 'site'));
  if (
    JSON.stringify(files) !==
      JSON.stringify(
        Object.fromEntries(
          Object.entries(manifest.files).sort(([a], [b]) =>
            a.localeCompare(b, 'en'),
          ),
        ),
      ) ||
    hashTable(files) !== manifest.siteSha256
  )
    throw new Error('Release files differ from validated artifact.');
  const payload = Object.fromEntries(
    Object.entries(files).filter(([name]) => name !== publicManifestName),
  );
  if (hashTable(payload) !== manifest.payloadSha256)
    throw new Error('Release payload digest differs.');
  const identity = JSON.parse(
    await readFile(join(artifactDirectory, 'site', publicManifestName), 'utf8'),
  );
  for (const key of [
    'schemaVersion',
    'repository',
    'repositoryId',
    'sourceSha',
    'sourceTree',
    'payloadSha256',
  ] as const) {
    if (identity[key] !== manifest[key])
      throw new Error(`Release identity mismatch: ${key}`);
  }
  return manifest;
}
