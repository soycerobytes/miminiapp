import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const runNode = promisify(execFile);

describe('native Node release CLI', () => {
  it('imports the complete CLI using native TypeScript stripping without a test transform', async () => {
    await expect(
      runNode(process.execPath, [
        '--input-type=module',
        '--eval',
        'await import("./scripts/release/cli.ts");',
      ]),
    ).resolves.toMatchObject({ stdout: '', stderr: '' });
  });

  it.each(['staging', 'production'])(
    'runs the real CLI and rejects Phase A %s even with the activation variable',
    async (target) => {
      await expect(
        runNode(
          process.execPath,
          [
            '--input-type=module',
            '--eval',
            `
        import assert from 'node:assert/strict';
        import { main } from './scripts/release/cli.ts';
        await assert.rejects(main(['assert-phase-b', '${target}']), /Phase B is not authorized: publication is disabled/);
      `,
          ],
          { env: { ...process.env, I03_PHASE_B_AUTHORIZED: 'true' } },
        ),
      ).resolves.toMatchObject({ stdout: '', stderr: '' });
      await expect(
        runNode(
          process.execPath,
          ['scripts/release/cli.ts', 'assert-phase-b', target],
          {
            encoding: 'utf8',
            env: { ...process.env, I03_PHASE_B_AUTHORIZED: 'true' },
          },
        ),
      ).rejects.toMatchObject({
        code: 1,
      });
    },
  );

  it('blocks the real staging access check before reading secrets or touching the network', async () => {
    await expect(
      runNode(process.execPath, [
        '--input-type=module',
        '--eval',
        `
      import assert from 'node:assert/strict';
      import { main } from './scripts/release/cli.ts';
      process.env.RELEASE_TARGET = 'staging';
      process.env.GITHUB_EVENT_NAME = 'pull_request';
      process.env.I03_STAGING_PUBLICATION_AUTHORIZED = 'true';
      globalThis.fetch = () => { throw new Error('Network must remain unused'); };
      await assert.rejects(main(['probe-staging-access']), /Phase B is not authorized|Publication requires/);
    `,
      ]),
    ).resolves.toMatchObject({ stdout: '', stderr: '' });
  });

  it('rejects the native publisher before any network access or artifact lookup', async () => {
    await expect(
      runNode(
        process.execPath,
        [
          '--input-type=module',
          '--eval',
          `
      import assert from 'node:assert/strict';
      import { main } from './scripts/release/cli.ts';
      globalThis.fetch = () => { throw new Error('Network must not run in Phase A'); };
      await assert.rejects(main(['publish', 'production', '/missing-native-artifact']), /Phase B is not authorized/);
    `,
        ],
        {
          encoding: 'utf8',
          env: { ...process.env, I03_PHASE_B_AUTHORIZED: 'true' },
        },
      ),
    ).resolves.toMatchObject({ stdout: '', stderr: '' });
  });
});
