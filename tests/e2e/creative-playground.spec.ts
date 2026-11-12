import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ reducedMotion: 'no-preference' });

test('matches the approved WAAPI assembly at the same elapsed times after its CSS port', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const svg = document.querySelector('header [data-motion-seen="true"]');
      if (!svg) return;
      const animations = svg.getAnimations({ subtree: true });
      if (animations.length === 4) {
        animations.forEach((a) => a.pause());
        observer.disconnect();
      }
    });
    observer.observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-motion-seen'],
    });
  });
  await page.goto('/es/');
  await expect
    .poll(() =>
      page
        .locator('header .brand-wordmark')
        .evaluate(
          (n) =>
            n
              .getAnimations({ subtree: true })
              .filter((a) => a.playState === 'paused').length,
        ),
    )
    .toBe(4);
  const differences = await page.evaluate(() => {
    const svg = document.querySelector('header .brand-wordmark')!;
    const pieces = [...svg.querySelectorAll<SVGElement>('.brand-piece')];
    const css = svg.getAnimations({ subtree: true });
    const parent = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    parent.style.cssText =
      'position:fixed;left:-10000px;width:502.8px;height:110px';
    parent.setAttribute('viewBox', '-5 16 502.8 110');
    parent.setAttribute('aria-hidden', 'true');
    document.body.append(parent);
    const starts = [
      [-60, -58, -38],
      [34, -92, 52],
      [-30, 86, -46],
      [90, 35, 34],
    ];
    const reference = pieces.map((piece, i) => {
      const clone = piece.cloneNode(true) as SVGElement;
      clone.removeAttribute('class');
      clone.style.transformBox = 'fill-box';
      clone.style.transformOrigin = 'center';
      parent.append(clone);
      const [x, y, r] = starts[i];
      const animation = clone.animate(
        [
          {
            transform: `translate(${x * 1.5}px,${y * 1.45}px) rotate(${r * 1.6}deg)`,
          },
          {
            transform: `translate(${x * 0.13}px,${y * 0.13}px) rotate(${r * 0.12}deg)`,
            offset: 0.64,
          },
          {
            transform: `translate(${i % 2 ? 2 : -2}px,${i % 2 ? -2 : 2}px) rotate(${i % 2 ? 1.7 : -1.7}deg)`,
            offset: 0.84,
          },
          { transform: 'translate(0,0) rotate(0)' },
        ],
        {
          duration: 1450,
          delay: i * 70,
          easing: 'cubic-bezier(.2,.65,.25,1)',
          fill: 'backwards',
        },
      );
      animation.pause();
      return { clone, animation };
    });
    const result = [];
    for (const time of [0, 80, 240, 400, 650, 900, 1200, 1430, 1650]) {
      css.forEach((a) => (a.currentTime = time));
      reference.forEach((r) => (r.animation.currentTime = time));
      result.push(
        ...pieces.map((p, i) => {
          const a = new DOMMatrix(getComputedStyle(p).transform),
            b = new DOMMatrix(getComputedStyle(reference[i].clone).transform);
          return {
            time,
            piece: i,
            max: Math.max(
              ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) =>
                Math.abs(
                  (a[k as keyof DOMMatrix] as number) -
                    (b[k as keyof DOMMatrix] as number),
                ),
              ),
            ),
          };
        }),
      );
    }
    reference.forEach((r) => r.animation.cancel());
    parent.remove();
    return result;
  });
  expect(
    differences.every((d) => d.max < 0.03),
    JSON.stringify(differences),
  ).toBe(true);
});

for (const locale of ['es', 'en']) {
  test(`pauses seven independent loops and resumes without restarting in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto(`/${locale}/`);
    const hero = page.locator('.hero-art');
    await expect(hero).toHaveAttribute('data-motion-entered', 'true');
    await expect(page.locator('header .brand-wordmark')).toHaveAttribute(
      'data-motion-assembled',
      'true',
    );
    const timing = await hero.evaluate((n) =>
      n.getAnimations({ subtree: true }).map((a) => ({
        name: (a as CSSAnimation).animationName,
        duration: a.effect!.getTiming().duration,
        iterations: a.effect!.getTiming().iterations,
        delay: a.effect!.getTiming().delay,
      })),
    );
    expect(timing).toHaveLength(7);
    expect(timing.map((t) => [t.name, t.duration, t.delay]).sort()).toEqual(
      [
        ['mma-lime', 5800, 0],
        ['mma-coral', 7300, -1200],
        ['mma-orbit', 8600, -2000],
        ['mma-rings', 6700, -500],
        ['mma-satellite', 4900, -1400],
        ['mma-wave', 7900, -3000],
        ['mma-tile', 6400, -900],
      ].sort(),
    );
    timing.forEach((t) => expect(t.iterations).toBe(Infinity));
    const control = page.locator('[data-motion-control]');
    await expect(control).toHaveAccessibleName(
      locale === 'es' ? 'Pausar animaciones' : 'Pause animations',
    );
    await control.focus();
    await page.keyboard.press('Space');
    await expect(control).toHaveAccessibleName(
      locale === 'es' ? 'Reanudar animaciones' : 'Resume animations',
    );
    await expect(control).toBeFocused();
    await expect(page.locator('header [data-motion-control]')).toHaveCount(1);
    await expect(control.locator('svg')).toHaveCount(1);
    await expect(control.locator('.motion-icon-slash')).toBeVisible();
    await expect(control).not.toHaveAttribute('popovertarget');
    const state = () =>
      hero.evaluate((n) =>
        n.getAnimations({ subtree: true }).map((a) => ({
          name: (a as CSSAnimation).animationName,
          time: a.currentTime,
          state: a.playState,
          transform: getComputedStyle((a.effect as KeyframeEffect).target!)
            .transform,
        })),
      );
    await page.waitForTimeout(60);
    const frozen = await state();
    await page.waitForTimeout(180);
    expect(await state()).toEqual(frozen);
    frozen.forEach((a) => expect(a.state).toBe('paused'));
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press('Space');
    await page.waitForTimeout(80);
    const resumed = await state();
    await expect(control.locator('.motion-icon-slash')).toBeHidden();
    resumed.forEach((a, i) => {
      expect(a.state).toBe('running');
      expect(Number(a.time)).toBeGreaterThan(Number(frozen[i].time));
    });
    await expect(page.locator('astro-island')).toHaveCount(0);
    await expect(page.locator('script[src]')).toHaveCount(0);
    // CP-02 adds exactly one bounded pre-paint initializer, not another runtime.
    await expect(page.locator('script')).toHaveCount(2);
    await expect(page.locator('head script:not([type])')).toHaveCount(1);
    const init = await page.locator('head script:not([type])').textContent();
    expect(init).toContain('miminiapp.appearance');
    expect(gzipSync(init!).length).toBeLessThanOrEqual(1024);
    await expect(page.locator('script[type="module"]')).toHaveCount(1);
    const script = await page.locator('script[type="module"]').textContent();
    const html = await readFile(`dist/${locale}/index.html`, 'utf8');
    expect(script).toBe(
      html.match(/<script type="module">([\s\S]*?)<\/script>/)![1],
    );
    expect(gzipSync(script!).length).toBeLessThanOrEqual(5120);
    expect(
      gzipSync(await readFile('src/styles/motion.css')).length,
    ).toBeLessThanOrEqual(5120);
  });
}

test('starts active even with reduced motion and only the icon changes manual pause', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  const button = page.locator('[data-motion-control]');
  const hero = page.locator('.hero-art');
  await expect(button).toBeEnabled();
  await expect(button).toHaveAccessibleName('Pausar animaciones');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(hero).toHaveAttribute('data-motion-entered', 'true');
  const ambient = hero.locator('[data-ambient]:not([data-ambient="dots"])');
  expect(await ambient.count()).toBe(7);
  const playing = () =>
    ambient.evaluateAll((nodes) =>
      nodes.every((n) =>
        n.getAnimations().some((a) => a.playState === 'running'),
      ),
    );
  expect(await playing()).toBe(true);
  await button.focus();
  await page.keyboard.press('Space');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(button.locator('.motion-icon-slash')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(button).toHaveAccessibleName('Reanudar animaciones');
  expect(
    await page
      .locator('[data-motion]')
      .evaluateAll((nodes) =>
        nodes
          .flatMap((n) => n.getAnimations({ subtree: true }))
          .every((a) => a.playState === 'paused'),
      ),
  ).toBe(true);
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  expect(await playing()).toBe(true);
  expect(
    await page
      .locator('header .brand-wordmark')
      .evaluate((n) => n.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await button.click();
  await page.reload();
  await expect(button).toHaveAccessibleName('Pausar animaciones');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(hero).toHaveAttribute('data-motion-entered', 'true');
  expect(await playing()).toBe(true);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('uses a finite hover only for hover-capable pointers and never for keyboard focus', async ({
  page,
  isMobile,
}) => {
  await page.goto('/es/');
  const mark = page.locator('header .brand-wordmark');
  await expect(mark).toHaveAttribute('data-motion-assembled', 'true');
  await page.locator('header .brand').focus();
  expect(
    await mark.evaluate((n) => n.getAnimations({ subtree: true }).length),
  ).toBe(0);
  if (isMobile) {
    await page
      .locator('header .brand')
      .dispatchEvent('pointerover', { pointerType: 'touch' });
    expect(
      await mark.evaluate((n) => n.getAnimations({ subtree: true }).length),
    ).toBe(0);
  } else {
    await page.mouse.move(0, 0);
    await page.locator('header .brand').hover();
    const anims = await mark.evaluate((n) =>
      n.getAnimations({ subtree: true }).map((a) => ({
        name: (a as CSSAnimation).animationName,
        duration: a.effect!.getTiming().duration,
        delay: a.effect!.getTiming().delay,
      })),
    );
    expect(anims).toHaveLength(4);
    anims.forEach((a, i) => {
      expect(a.name).toBe('mma-hover');
      expect(a.duration).toBe(480);
      expect(a.delay).toBeCloseTo(i * 18, 9);
    });
    await expect(mark).not.toHaveAttribute('data-motion-hover', 'true');
    expect(
      await mark.evaluate((n) => n.getAnimations({ subtree: true }).length),
    ).toBe(0);
  }
});

test('pauses offscreen loops without replaying entrance or clearing a manual pause', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 500 });
  await page.goto('/es/');
  const hero = page.locator('.hero-art');
  await expect(hero).toHaveAttribute('data-motion-entered', 'true');
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(hero).toHaveAttribute('data-motion-visible', 'false');
  expect(
    await hero.evaluate((n) =>
      n.getAnimations({ subtree: true }).every((a) => a.playState === 'paused'),
    ),
  ).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(hero).toHaveAttribute('data-motion-visible', 'true');
  expect(
    await hero.evaluate((n) =>
      n
        .getAnimations({ subtree: true })
        .every(
          (a) =>
            (a as CSSAnimation).animationName !== 'mma-enter' &&
            a.playState === 'running',
        ),
    ),
  ).toBe(true);
  await page
    .locator('[data-motion-control]')
    .evaluate((button: HTMLButtonElement) => button.click());
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(hero).toHaveAttribute('data-motion-visible', 'false');
  await page.evaluate(() => scrollTo(0, 0));
  await expect(hero).toHaveAttribute('data-motion-visible', 'true');
  expect(
    await hero.evaluate((n) =>
      n.getAnimations({ subtree: true }).every((a) => a.playState === 'paused'),
    ),
  ).toBe(true);
});

test('fails closed with a blocked module or observer initialization failure', async ({
  browser,
}) => {
  for (const failure of ['blocked', 'initialization']) {
    const context = await browser.newContext({
      viewport: { width: 393, height: 851 },
    });
    try {
      if (failure === 'blocked')
        await context.route('**/es/', async (route) => {
          const response = await route.fetch();
          await route.fulfill({
            response,
            headers: {
              ...response.headers(),
              'content-security-policy': "script-src 'none'",
            },
          });
        });
      else
        await context.addInitScript(() =>
          Object.defineProperty(window, 'IntersectionObserver', {
            value: class {
              constructor() {
                throw new Error('Deliberate initialization failure');
              }
            },
          }),
        );
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:4321/es/');
      await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
      await expect(page.locator('[data-motion-control]')).toBeHidden();
      await expect(page.locator('header .brand-wordmark')).toBeVisible();
      expect(await page.evaluate(() => document.getAnimations().length)).toBe(
        0,
      );
      await page
        .getByRole('link', { name: 'Ver el catálogo', exact: true })
        .click();
      await expect(page.locator('#catalogo')).toBeInViewport();
    } finally {
      await context.close();
    }
  }
});

test('reserves layout while motion, pause and preference changes run', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.addInitScript(() => {
    const shifts: number[] = [];
    Object.defineProperty(window, 'motionShifts', { value: shifts });
    new PerformanceObserver((list) =>
      shifts.push(
        ...list
          .getEntries()
          .map((e) => (e as PerformanceEntry & { value: number }).value),
      ),
    ).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/es/');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    (window as unknown as { motionShifts: number[] }).motionShifts.length = 0;
  });
  const boxes = () =>
    page.evaluate(() =>
      [
        '.site-header',
        '.home-hero',
        '.hero-visual',
        '.motion-control-slot',
        '#catalogo',
      ].map((s) => {
        const n = document.querySelector(s) as HTMLElement;
        return [n.offsetTop, n.offsetLeft, n.offsetWidth, n.offsetHeight];
      }),
    );
  const baseline = await boxes();
  await page.waitForTimeout(250);
  expect(await boxes()).toEqual(baseline);
  await page
    .locator('[data-motion-control]')
    .evaluate((b: HTMLButtonElement) => b.click());
  expect(await boxes()).toEqual(baseline);
  await page
    .locator('[data-motion-control]')
    .evaluate((b: HTMLButtonElement) => b.click());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await boxes()).toEqual(baseline);
  await page.waitForTimeout(80);
  expect(
    await page.evaluate(() =>
      (window as unknown as { motionShifts: number[] }).motionShifts.reduce(
        (a, b) => a + b,
        0,
      ),
    ),
  ).toBe(0);
});
