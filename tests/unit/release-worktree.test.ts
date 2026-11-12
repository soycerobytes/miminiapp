import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertCleanWorktree } from '../../scripts/release/cli.ts';

const temporary: string[] = [];
afterEach(async () => {
  await Promise.all(
    temporary
      .splice(0)
      .map((path) => rm(path, { recursive: true, force: true })),
  );
});
async function repository() {
  const root = await mkdtemp(join(tmpdir(), 'miminiapp-clean-release-'));
  temporary.push(root);
  const git = (...args: string[]) =>
    execFileSync('git', ['-C', root, ...args], { stdio: 'ignore' });
  git('init', '--initial-branch=fixture');
  await writeFile(join(root, '.gitignore'), '.local/\ndist/\n');
  await writeFile(join(root, 'source.txt'), 'committed source');
  git('add', '.');
  git(
    '-c',
    'user.name=Release Test',
    '-c',
    'user.email=release-test@example.invalid',
    '-c',
    'commit.gpgsign=false',
    'commit',
    '-m',
    'isolated fixture',
  );
  return { root, git };
}

describe('release source identity', () => {
  it('accepts a clean checkout and ignored build/evidence outputs', async () => {
    const { root } = await repository();
    await mkdir(join(root, '.local'));
    await writeFile(join(root, '.local/evidence.json'), '{}');
    expect(() => assertCleanWorktree(root)).not.toThrow();
  });
  it.each(['tracked', 'staged', 'untracked'])(
    'refuses to label %s changes as the committed source tree',
    async (kind) => {
      const { root, git } = await repository();
      await writeFile(
        join(root, kind === 'untracked' ? 'unexpected.txt' : 'source.txt'),
        'not committed',
      );
      if (kind === 'staged') git('add', 'source.txt');
      expect(() => assertCleanWorktree(root)).toThrow(
        'clean tracked and untracked',
      );
    },
  );
});
