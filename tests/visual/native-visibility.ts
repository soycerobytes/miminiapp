import { chromium, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';

/** Headed, native visibility: no document.hidden override or synthetic events.
 * Requires a private X display with a window manager, e.g. the existing Xorg
 * dummy/xfwm4 in Codex. noDefaults avoids Playwright's focus emulation.
 */
export async function verifyNativeVisibility(origin: string, output: string) {
  if (!process.env.DISPLAY)
    throw new Error('A real/private X display is required.');
  const profile = await mkdtemp(join(tmpdir(), 'miminiapp-native-visibility-'));
  const child = spawn(
    chromium.executablePath(),
    [
      '--no-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--remote-debugging-address=127.0.0.1',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  let browser: Awaited<ReturnType<typeof chromium.connectOverCDP>> | undefined;
  try {
    let endpoint = '';
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null)
        throw new Error('The isolated Chromium exited.');
      try {
        endpoint = await readFile(join(profile, 'DevToolsActivePort'), 'utf8');
        break;
      } catch {
        await wait(100);
      }
    }
    const [port, path] = endpoint.trim().split('\n');
    browser = await chromium.connectOverCDP(`ws://127.0.0.1:${port}${path}`, {
      noDefaults: true,
    });
    expect(browser.version()).toBe('156.0.8078.4');
    const context = browser.contexts()[0];
    const page = context.pages()[0];
    await page.goto(`${origin}/es/`);
    const hero = page.locator('.hero-art');
    await expect(hero).toHaveAttribute('data-motion-entered', 'true');
    await page.evaluate(() => {
      const trace: { state: string; trusted: boolean }[] = [];
      Object.defineProperty(window, 'nativeVisibilityTrace', { value: trace });
      document.addEventListener('visibilitychange', (e) =>
        trace.push({ state: document.visibilityState, trusted: e.isTrusted }),
      );
      window.addEventListener('pageshow', (e) => {
        (
          window as unknown as { restoredFromCache: boolean }
        ).restoredFromCache = e.persisted;
      });
    });
    const session = await context.newCDPSession(page);
    const { windowId } = await session.send('Browser.getWindowForTarget');
    const times = () =>
      hero.evaluate((n) =>
        n.getAnimations({ subtree: true }).map((a) => ({
          name: (a as CSSAnimation).animationName,
          time: a.currentTime,
          state: a.playState,
        })),
      );
    async function minimize() {
      await session.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'minimized' },
      });
      await expect
        .poll(() => page.evaluate(() => document.visibilityState))
        .toBe('hidden');
      await expect(page.locator('html')).toHaveAttribute(
        'data-motion-paused',
        'true',
      );
    }
    async function restore() {
      await session.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'normal' },
      });
      await page.bringToFront();
      await expect
        .poll(() => page.evaluate(() => document.visibilityState))
        .toBe('visible');
    }
    await minimize();
    await wait(100);
    const hidden = await times();
    await wait(200);
    expect(await times()).toEqual(hidden);
    hidden.forEach((a) => expect(a.state).toBe('paused'));
    await restore();
    await wait(100);
    const resumed = await times();
    resumed.forEach((a, i) => {
      expect(a.state).toBe('running');
      expect(Number(a.time)).toBeGreaterThan(Number(hidden[i].time));
    });
    await page.locator('[data-motion-control]').click();
    await minimize();
    await restore();
    await expect(page.locator('html')).toHaveAttribute(
      'data-motion-paused',
      'true',
    );
    const manuallyPaused = await times();
    await wait(150);
    expect(await times()).toEqual(manuallyPaused);
    const events = await page.evaluate(
      () =>
        (
          window as unknown as {
            nativeVisibilityTrace: { state: string; trusted: boolean }[];
          }
        ).nativeVisibilityTrace,
    );
    expect(
      events.filter((e) => e.state === 'hidden').length,
    ).toBeGreaterThanOrEqual(2);
    expect(events.every((e) => e.trusted)).toBe(true);
    await page.goto(`${origin}/en/`);
    // BFCache restores do not emit a new load event. Navigate the native
    // history entry and observe the restored document instead of awaiting load.
    const history = await session.send('Page.getNavigationHistory');
    await session.send('Page.navigateToHistoryEntry', {
      entryId: history.entries[history.currentIndex - 1].id,
    });
    await expect.poll(() => page.url()).toBe(`${origin}/es/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    const restoredFromCache = await page.evaluate(
      () =>
        (window as unknown as { restoredFromCache?: boolean })
          .restoredFromCache ?? false,
    );
    if (restoredFromCache) {
      await expect(page.locator('html')).toHaveAttribute(
        'data-motion-paused',
        'true',
      );
      expect(
        await page
          .locator('header .brand-wordmark')
          .evaluate((n) => n.getAnimations({ subtree: true }).length),
      ).toBe(0);
    }
    const result = {
      browser: browser.version(),
      executable: chromium.executablePath(),
      method: 'headed Chromium, noDefaults CDP, native window minimize/restore',
      events,
      hidden,
      resumed,
      manuallyPaused,
      restoredFromCache,
    };
    await writeFile(
      join(output, 'native-visibility.json'),
      JSON.stringify(result, null, 2) + '\n',
    );
    return result;
  } finally {
    if (browser) {
      const session = await browser
        .newBrowserCDPSession()
        .catch(() => undefined);
      await session?.send('Browser.close').catch(() => {});
      await browser.close().catch(() => {});
    }
    child.kill();
    if (child.exitCode === null)
      await new Promise<void>((resolve) => {
        child.once('exit', () => resolve());
        setTimeout(resolve, 3000);
      });
    await rm(profile, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 100,
    }).catch(() => {});
  }
}
