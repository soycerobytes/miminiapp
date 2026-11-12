import { spawn } from 'node:child_process';

/** Preserve child output and reject failures without synchronous Node subprocesses. */
export function runChild(
  command: string,
  args: readonly string[],
  options: { env?: NodeJS.ProcessEnv; stdio?: 'inherit' | 'ignore' } = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: options.env ?? process.env,
      stdio: options.stdio ?? 'inherit',
      shell: false,
    });
    child.once('error', reject);
    child.once('close', (code, signal) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(
            `Release subprocess failed (${signal ? `signal ${signal}` : `exit ${code ?? 'unknown'}`}).`,
          ),
        );
    });
  });
}
