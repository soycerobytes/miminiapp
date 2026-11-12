import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import {
  verifyFixtureCatalogue,
  verifyI01InFixture,
} from './i01-browser-regression.ts';

const projectRoot = path.resolve(
  fileURLToPath(new URL('../..', import.meta.url)),
);
const evidenceRoot = path.join(projectRoot, '.local/verification/i02/modular');
const fixturesRoot = path.join(
  projectRoot,
  'tests/integration/fixtures/miniapps',
);
const astroBin = path.join(projectRoot, 'node_modules/astro/bin/astro.mjs');
const fixtureNames = ['i02-fixture-a', 'i02-fixture-b', 'i02-fixture-draft'];
const forbiddenDraftMarkers = [
  'i02-fixture-draft',
  'I02_DRAFT_',
  'draft-marker',
];

async function filesIn(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? filesIn(entryPath) : [entryPath];
    }),
  );
  return files.flat().sort();
}

async function hashesIn(directory: string): Promise<Record<string, string>> {
  return Object.fromEntries(
    await Promise.all(
      (await filesIn(directory)).map(async (filename) => [
        path.relative(directory, filename),
        createHash('sha256')
          .update(await readFile(filename))
          .digest('hex'),
      ]),
    ),
  );
}

async function copyFixture(name: string, sourceRoot: string) {
  const fixtureRoot = path.join(fixturesRoot, name);
  for (const filename of await filesIn(fixtureRoot)) {
    assert(filename.endsWith('.fixture'), `Unrecognized fixture: ${filename}`);
    const relative = path
      .relative(fixtureRoot, filename)
      .replace(/\.fixture$/, '');
    const destination = path.join(sourceRoot, 'miniapps', name, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(filename, destination);
  }
}

function registrySource(includeB: boolean): string {
  return `import { validateRegistry, type MiniappRegistration } from '../lib/miniapp-registry';
import { metadata as a } from './i02-fixture-a/metadata';
import { metadata as draft } from './i02-fixture-draft/metadata';
${includeB ? "import { metadata as b } from './i02-fixture-b/metadata';" : ''}

export const miniappRegistry = [
  { descriptor: a, loadEntry: () => import('./i02-fixture-a/entry.astro') },
  { descriptor: draft },
  ${includeB ? "{ descriptor: b, loadEntry: () => import('./i02-fixture-b/entry.astro') }," : ''}
] satisfies readonly MiniappRegistration[];
validateRegistry(miniappRegistry);
`;
}

async function prepareProject(
  name: string,
  includeB: boolean,
): Promise<string> {
  const stageRoot = path.join(evidenceRoot, name);
  await mkdir(stageRoot, { recursive: true });
  for (const file of [
    'astro.config.mjs',
    'vitest.config.ts',
    'tsconfig.json',
    'package.json',
  ]) {
    await cp(path.join(projectRoot, file), path.join(stageRoot, file));
  }
  await cp(path.join(projectRoot, 'src'), path.join(stageRoot, 'src'), {
    recursive: true,
  });
  await cp(path.join(projectRoot, 'public'), path.join(stageRoot, 'public'), {
    recursive: true,
  });
  await symlink(
    path.join(projectRoot, 'node_modules'),
    path.join(stageRoot, 'node_modules'),
    'dir',
  );
  for (const fixture of [
    'i02-fixture-a',
    'i02-fixture-draft',
    ...(includeB ? ['i02-fixture-b'] : []),
  ]) {
    await copyFixture(fixture, path.join(stageRoot, 'src'));
  }
  await writeFile(
    path.join(stageRoot, 'src/miniapps/registry.ts'),
    registrySource(includeB),
  );
  return stageRoot;
}

async function buildProject(
  stageRoot: string,
  name: string,
  expectedError?: string,
) {
  const result = spawnSync(
    process.execPath,
    [astroBin, 'build', '--root', stageRoot],
    {
      cwd: projectRoot,
      encoding: 'utf8',
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
      maxBuffer: 16 * 1024 * 1024,
    },
  );
  await writeFile(
    path.join(evidenceRoot, `${name}-build.log`),
    `${result.stdout ?? ''}${result.stderr ?? ''}`,
  );
  if (expectedError) {
    assert.notEqual(
      result.status,
      0,
      `${name}: invalid translation build unexpectedly passed`,
    );
    assert(
      `${result.stdout ?? ''}${result.stderr ?? ''}`.includes(expectedError),
      `${name}: build failed for an unexpected reason`,
    );
  } else {
    assert.equal(
      result.status,
      0,
      `${name}: Astro build failed; see ${name}-build.log`,
    );
  }
}

async function testOwnModules(
  stageRoot: string,
  name: string,
  expectedTests: number,
) {
  const result = spawnSync(
    process.execPath,
    [
      path.join(projectRoot, 'node_modules/vitest/vitest.mjs'),
      'run',
      '--root',
      stageRoot,
      '--config',
      path.join(stageRoot, 'vitest.config.ts'),
      '--project',
      'unit',
      '--reporter',
      'json',
      '--outputFile',
      path.join(evidenceRoot, `${name}-unit.json`),
    ],
    {
      cwd: projectRoot,
      encoding: 'utf8',
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
      maxBuffer: 16 * 1024 * 1024,
    },
  );
  await writeFile(
    path.join(evidenceRoot, `${name}-unit.log`),
    `${result.stdout ?? ''}${result.stderr ?? ''}`,
  );
  assert.equal(
    result.status,
    0,
    `${name}: own-module tests failed; see ${name}-unit.log`,
  );
  const report = JSON.parse(
    await readFile(path.join(evidenceRoot, `${name}-unit.json`), 'utf8'),
  ) as { numPassedTests: number; numFailedTests: number };
  assert.equal(
    report.numPassedTests,
    expectedTests,
    `${name}: module test discovery incomplete`,
  );
  assert.equal(report.numFailedTests, 0);
  return { passed: report.numPassedTests, failed: report.numFailedTests };
}

function importsIn(source: string): string[] {
  const parsed = ts.createSourceFile(
    'module.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const result: string[] = [];
  function visit(node: ts.Node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      result.push(node.moduleSpecifier.text);
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    )
      result.push(node.arguments[0].text);
    ts.forEachChild(node, visit);
  }
  visit(parsed);
  return result;
}

async function resolveImport(filename: string, specifier: string) {
  if (!specifier.startsWith('.')) return specifier;
  const resolved = path.resolve(path.dirname(filename), specifier);
  for (const candidate of [
    resolved,
    `${resolved}.ts`,
    `${resolved}.tsx`,
    `${resolved}.astro`,
    path.join(resolved, 'index.ts'),
    path.join(resolved, 'index.tsx'),
  ]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      /* Try the next supported local module extension. */
    }
  }
  return resolved;
}

async function assertBoundaries(sourceRoot: string) {
  const miniappsRoot = path.join(sourceRoot, 'miniapps');
  const inspected: string[] = [];
  for (const filename of await filesIn(miniappsRoot)) {
    if (!/\.(?:ts|tsx|astro)$/.test(filename)) continue;
    const relative = path.relative(miniappsRoot, filename);
    const moduleName = relative.split(path.sep)[0];
    if (moduleName === 'registry.ts') continue;
    let source = await readFile(filename, 'utf8');
    if (filename.endsWith('.astro')) source = source.split('---')[1] ?? '';
    for (const specifier of importsIn(source)) {
      const resolved = await resolveImport(filename, specifier);
      if (resolved.startsWith(`${miniappsRoot}${path.sep}`)) {
        const importedModule = path
          .relative(miniappsRoot, resolved)
          .split(path.sep)[0];
        assert.equal(
          importedModule,
          moduleName,
          `${relative}: cross-miniapp import`,
        );
      }
      if (relative.includes(`${path.sep}domain${path.sep}`)) {
        assert(
          !/^(react|astro)(?:\/|$)/.test(specifier),
          `${relative}: UI/runtime import in domain`,
        );
        assert(
          !/\.(astro|tsx)$|(?:^|\/)(?:i18n|components)(?:\/|$)/.test(resolved),
          `${relative}: UI/i18n import in domain`,
        );
      }
      if (path.basename(filename) === 'metadata.ts') {
        assert(
          !/\.(astro|tsx)$|(?:^|\/)(?:entry|App)(?:\.|$)/.test(resolved),
          `${relative}: metadata imports UI`,
        );
      }
    }
    if (relative.includes(`${path.sep}domain${path.sep}`)) {
      assert(
        !/\b(?:window|document|localStorage|sessionStorage)\b/.test(source),
        `${relative}: browser state in domain`,
      );
    }
    inspected.push(relative);
  }
  for (const commonDirectory of ['components', 'layouts', 'i18n/common']) {
    for (const filename of await filesIn(
      path.join(sourceRoot, commonDirectory),
    )) {
      if (!/\.(?:ts|tsx|astro)$/.test(filename)) continue;
      let source = await readFile(filename, 'utf8');
      if (filename.endsWith('.astro')) source = source.split('---')[1] ?? '';
      for (const specifier of importsIn(source)) {
        const resolved = path.resolve(path.dirname(filename), specifier);
        assert(
          !resolved.startsWith(`${miniappsRoot}${path.sep}`),
          `${filename}: common component imports miniapps`,
        );
      }
    }
  }
  return inspected;
}

async function assertNoMarkers(directory: string, markers: string[]) {
  const artifactFiles = await filesIn(directory);
  for (const filename of artifactFiles) {
    const relative = path.relative(directory, filename);
    const text = (await readFile(filename)).toString('utf8');
    for (const marker of markers) {
      assert(
        !relative.includes(marker) && !text.includes(marker),
        `${relative}: leaked ${marker}`,
      );
    }
  }
  return artifactFiles.length;
}

async function assertStage(stageRoot: string, expectedModules: string[]) {
  const outputRoot = path.join(stageRoot, 'dist');
  const pages = (await filesIn(outputRoot))
    .map((filename) =>
      path.relative(outputRoot, filename).replaceAll(path.sep, '/'),
    )
    .filter(
      (filename) => filename.includes('/apps/') && filename.endsWith('.html'),
    );
  const expectedPages = expectedModules.flatMap((name) =>
    ['es', 'en'].map((locale) => `${locale}/apps/${name}/index.html`),
  );
  assert.deepEqual(pages.sort(), expectedPages.sort());
  for (const locale of ['es', 'en']) {
    const catalogue = await readFile(
      path.join(outputRoot, locale, 'index.html'),
      'utf8',
    );
    for (const name of expectedModules) {
      const route = `/${locale}/apps/${name}/`;
      assert(
        catalogue.includes(`href="${route}"`),
        `Missing catalogue link ${route}`,
      );
      const html = await readFile(
        path.join(outputRoot, locale, 'apps', name, 'index.html'),
        'utf8',
      );
      assert(html.includes(`lang="${locale}"`));
      assert(
        html.includes(
          name === 'i02-fixture-a' ? 'I02_FIXTURE_A_UI' : 'I02_FIXTURE_B_UI',
        ),
      );
      assert(
        html.includes(`href="/${locale === 'es' ? 'en' : 'es'}/apps/${name}/"`),
        'Language switch lost tool context',
      );
      assert(
        html.includes(locale === 'es' ? 'Prueba aislada' : 'Isolated test'),
        'Module translations not rendered',
      );
      assert(
        html.includes(
          name === 'i02-fixture-a' ? '>5</output>' : '>12</output>',
        ),
        'Domain result not rendered',
      );
    }
  }
  const count = await assertNoMarkers(outputRoot, forbiddenDraftMarkers);
  return { pages, artifactCount: count };
}

async function withPreview<T>(
  stageRoot: string,
  run: (baseURL: string) => Promise<T>,
): Promise<T> {
  const previewLog = path.join(
    evidenceRoot,
    `${path.basename(stageRoot)}-preview.log`,
  );
  let log = '';
  const child = spawn(
    process.execPath,
    [
      astroBin,
      'preview',
      '--root',
      stageRoot,
      '--host',
      '127.0.0.1',
      '--port',
      '4322',
      '--ignore-lock',
    ],
    {
      cwd: projectRoot,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  child.stdout.on('data', (chunk: Buffer) => {
    log += chunk.toString();
  });
  child.stderr.on('data', (chunk: Buffer) => {
    log += chunk.toString();
  });
  try {
    const baseURL = 'http://127.0.0.1:4322';
    const deadline = Date.now() + 60_000;
    let ready = false;
    while (!ready && Date.now() < deadline) {
      assert(child.exitCode === null, `Fixture preview exited: ${log}`);
      try {
        ready = (await fetch(`${baseURL}/es/`)).ok;
      } catch {
        /* Starting preview. */
      }
      if (!ready) await new Promise((resolve) => setTimeout(resolve, 200));
    }
    assert(ready, 'Fixture preview did not become ready');
    return await run(baseURL);
  } finally {
    if (child.exitCode === null) {
      const exited = new Promise<void>((resolve) =>
        child.once('exit', () => resolve()),
      );
      child.kill('SIGTERM');
      await exited;
    }
    await writeFile(previewLog, log);
  }
}

await stat(path.join(projectRoot, 'dist/es/index.html')).catch(() => {
  throw new Error('Build the empty public deliverable first: npm run build');
});
await rm(evidenceRoot, { recursive: true, force: true });
await mkdir(evidenceRoot, { recursive: true });
const originalSourceHashes = await hashesIn(path.join(projectRoot, 'src'));
const originalOutputHashes = await hashesIn(path.join(projectRoot, 'dist'));
const stageA = await prepareProject('a', false);
const stageAB = await prepareProject('ab', true);
const sourceA = await hashesIn(path.join(stageA, 'src'));
const sourceAB = await hashesIn(path.join(stageAB, 'src'));
for (const [filename, hash] of Object.entries(originalSourceHashes)) {
  if (filename === 'miniapps/registry.ts') continue;
  assert.equal(
    sourceA[filename],
    hash,
    `Stage A changed production source: ${filename}`,
  );
  assert.equal(
    sourceAB[filename],
    hash,
    `Stage AB changed production source: ${filename}`,
  );
}
for (const [filename, hash] of Object.entries(sourceA)) {
  if (filename === 'miniapps/registry.ts') continue;
  assert.equal(
    sourceAB[filename],
    hash,
    `Existing source changed while adding B: ${filename}`,
  );
}
const addedFiles = Object.keys(sourceAB).filter(
  (filename) => !(filename in sourceA),
);
assert(
  addedFiles.length > 0 &&
    addedFiles.every((filename) =>
      filename.startsWith('miniapps/i02-fixture-b/'),
    ),
);
const boundaries = await assertBoundaries(path.join(stageAB, 'src'));
const moduleTestsA = await testOwnModules(stageA, 'a', 2);
const moduleTestsAB = await testOwnModules(stageAB, 'ab', 4);
await buildProject(stageA, 'a');
const a = await assertStage(stageA, ['i02-fixture-a']);
await buildProject(stageAB, 'ab');
const ab = await assertStage(stageAB, ['i02-fixture-a', 'i02-fixture-b']);
const invalidStage = await prepareProject('invalid-translations', true);
const invalidTranslationPath = path.join(
  invalidStage,
  'src/miniapps/i02-fixture-b/i18n/en.ts',
);
const invalidTranslation = (
  await readFile(invalidTranslationPath, 'utf8')
).replace("output: 'Synthetic result'", "output: ''");
assert(invalidTranslation.includes("output: ''"));
await writeFile(invalidTranslationPath, invalidTranslation);
await buildProject(
  invalidStage,
  'invalid-translations',
  'Missing translation:',
);
const stableA: Record<
  string,
  {
    beforeSha256: string;
    afterSha256: string;
    normalizedSha256: string;
  }
> = {};
// Astro 7 derives this opaque hydration identifier from the pre-rewrite
// component URL, which contains the isolated project root. Preserve every
// other byte, including island props, URLs, scripts, CSS and visible content.
const islandUidRule = /<astro-island uid="[^"]+"/g;
for (const locale of ['es', 'en']) {
  const relative = `${locale}/apps/i02-fixture-a/index.html`;
  const before = await readFile(path.join(stageA, 'dist', relative));
  const after = await readFile(path.join(stageAB, 'dist', relative));
  const normalizedBefore = before
    .toString()
    .replace(islandUidRule, '<astro-island uid="[isolated-build-uid]"');
  const normalizedAfter = after
    .toString()
    .replace(islandUidRule, '<astro-island uid="[isolated-build-uid]"');
  assert.equal(
    normalizedAfter,
    normalizedBefore,
    `A output changed in ${locale}`,
  );
  stableA[relative] = {
    beforeSha256: createHash('sha256').update(before).digest('hex'),
    afterSha256: createHash('sha256').update(after).digest('hex'),
    normalizedSha256: createHash('sha256')
      .update(normalizedAfter)
      .digest('hex'),
  };
}
const publicArtifactCount = await assertNoMarkers(
  path.join(projectRoot, 'dist'),
  [
    ...fixtureNames,
    'I02_FIXTURE_',
    'I02_DRAFT_',
    'draft-marker',
    'environment-fixture',
    'Etiqueta de prueba',
  ],
);
assert.deepEqual(
  await hashesIn(path.join(projectRoot, 'src')),
  originalSourceHashes,
  'Harness modified production source',
);
assert.deepEqual(
  await hashesIn(path.join(projectRoot, 'dist')),
  originalOutputHashes,
  'Harness modified public deliverable',
);
const singleCatalogue = await withPreview(stageA, (baseURL) =>
  verifyFixtureCatalogue(baseURL, path.join(evidenceRoot, 'catalogue-a'), [
    'i02-fixture-a',
  ]),
);
const browser = await withPreview(stageAB, async (baseURL) => {
  for (const url of [
    '/es/apps/i02-fixture-draft/',
    '/en/apps/i02-fixture-draft/',
  ]) {
    assert.equal(
      (await fetch(`${baseURL}${url}`)).status,
      404,
      `Draft route returned a non-404: ${url}`,
    );
  }
  const multipleCatalogue = await verifyFixtureCatalogue(
    baseURL,
    path.join(evidenceRoot, 'catalogue-ab'),
    ['i02-fixture-a', 'i02-fixture-b'],
  );
  const i01 = await verifyI01InFixture(
    baseURL,
    path.join(evidenceRoot, 'i01-browser'),
  );
  return { multipleCatalogue, i01 };
});
const result = {
  timestamp: new Date().toISOString(),
  commands: ['npm run build', 'node tests/integration/modular-build.ts'],
  a,
  ab,
  moduleTestsA,
  moduleTestsAB,
  stableA,
  aOutputComparison: {
    normalization:
      'Only /<astro-island uid="[^"]+"/g; replace uid with [isolated-build-uid]',
    reason:
      'Astro 7 hydration uid includes the isolated project root before component URL rewriting.',
    allOtherHtmlBytesIdentical: true,
  },
  addedFiles,
  boundaries,
  sharedSourceUnchanged: true,
  productionSourceUnchanged: true,
  publicBuildUnchanged: true,
  publicArtifactCount,
  publicFixturesAndDraftsAbsent: true,
  incompleteModuleTranslationBuildRejected: true,
  singleCatalogue,
  browser,
};
await writeFile(
  path.join(evidenceRoot, 'result.json'),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(JSON.stringify(result, null, 2));
