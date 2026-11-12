import { describe, expect, it } from 'vitest';
import { runChild } from '../../scripts/release/process.ts';

describe('asynchronous release subprocess', () => {
  it('runs the native Node executable successfully without shell expansion', async () => {
    await expect(
      runChild(
        process.execPath,
        [
          '--input-type=module',
          '--eval',
          'import assert from "node:assert/strict"; assert.equal(process.argv[1], "$(must-never-be-executed)");',
          '$(must-never-be-executed)',
        ],
        { stdio: 'ignore' },
      ),
    ).resolves.toBeUndefined();
  });
  it('rejects a nonzero child exit rather than declaring a successful deployment', async () => {
    await expect(
      runChild(process.execPath, ['--eval', 'process.exit(23)'], {
        stdio: 'ignore',
      }),
    ).rejects.toThrow('Release subprocess failed (exit 23)');
  });
  it('rejects a missing executable', async () => {
    await expect(
      runChild('/missing-miminiapp-executable', [], { stdio: 'ignore' }),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });
});
