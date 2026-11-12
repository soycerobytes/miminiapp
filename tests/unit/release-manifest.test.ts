import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  packageRelease,
  verifyRelease,
  type ReleaseSource,
} from '../../scripts/release/manifest.ts';

const source: ReleaseSource = {
  repository: 'aalexlpez/miminiapp',
  repositoryId: '1445849027',
  sourceSha: 'a'.repeat(40),
  sourceTree: 'b'.repeat(40),
  buildRunId: '123',
  buildRunAttempt: 1,
};
const temporary: string[] = [];
async function example() {
  const root = await mkdtemp(join(tmpdir(), 'miminiapp-release-test-'));
  temporary.push(root);
  const dist = join(root, 'dist');
  for (const path of ['es', 'en'])
    await mkdir(join(dist, path), { recursive: true });
  for (const path of [
    'index.html',
    '404.html',
    'es/index.html',
    'en/index.html',
  ])
    await writeFile(
      join(dist, path),
      `<html lang="${path.startsWith('en') ? 'en' : 'es'}">${path}</html>`,
    );
  return { root, dist, artifact: join(root, 'artifact') };
}
afterEach(async () => {
  await Promise.all(
    temporary
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('immutable release artifact', () => {
  it('packages repeatably without changing dist or deriving identity from mutable timestamps', async () => {
    const { root, dist, artifact } = await example();
    const first = await packageRelease(dist, artifact, source);
    const second = await packageRelease(dist, join(root, 'second'), source);
    expect(first).toEqual(second);
    expect(await verifyRelease(artifact)).toEqual(first);
    const publicIdentity = JSON.parse(
      await readFile(join(artifact, 'site/release-manifest.json'), 'utf8'),
    );
    expect(publicIdentity).toEqual({
      schemaVersion: 1,
      repository: source.repository,
      repositoryId: source.repositoryId,
      sourceSha: source.sourceSha,
      sourceTree: source.sourceTree,
      payloadSha256: first.payloadSha256,
    });
    await expect(
      readFile(join(dist, 'release-manifest.json')),
    ).rejects.toThrow();
    expect(first.siteSha256).not.toBe(first.payloadSha256);
  });

  it.each(['changed', 'added', 'removed', 'identity'])(
    'rejects %s bytes or inventory after packaging',
    async (change) => {
      const { artifact, dist } = await example();
      await packageRelease(dist, artifact, source);
      if (change === 'changed')
        await writeFile(join(artifact, 'site/es/index.html'), 'changed');
      if (change === 'added')
        await writeFile(join(artifact, 'site/extra.txt'), 'extra');
      if (change === 'removed') await rm(join(artifact, 'site/404.html'));
      if (change === 'identity')
        await writeFile(join(artifact, 'site/release-manifest.json'), '{}');
      await expect(verifyRelease(artifact)).rejects.toThrow('differ');
    },
  );

  it.each(['.env', '.env.local', 'i02-fixture-example.txt'])(
    'excludes %s before an archive can be uploaded',
    async (name) => {
      const { artifact, dist } = await example();
      await writeFile(join(dist, name), 'not public');
      await expect(packageRelease(dist, artifact, source)).rejects.toThrow(
        'Forbidden release path',
      );
    },
  );

  it('rejects synthetic text hidden in a normal file and symlinks escaping the payload', async () => {
    const { artifact, dist } = await example();
    await writeFile(join(dist, 'es/index.html'), 'I02_DRAFT_SECRET');
    await expect(packageRelease(dist, artifact, source)).rejects.toThrow(
      'Synthetic content',
    );
    await writeFile(join(dist, 'es/index.html'), 'normal');
    await symlink('/etc/passwd', join(dist, 'escape'));
    await expect(packageRelease(dist, artifact, source)).rejects.toThrow(
      'symlinks',
    );
  });

  it('does not overwrite a prior candidate or accept a package inside dist', async () => {
    const { artifact, dist } = await example();
    await packageRelease(dist, artifact, source);
    await expect(packageRelease(dist, artifact, source)).rejects.toThrow();
    await expect(
      packageRelease(dist, join(dist, 'artifact'), source),
    ).rejects.toThrow('outside dist');
  });
});
