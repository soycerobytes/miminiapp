import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { experimental_readRawConfig, unstable_readConfig } from 'wrangler';

const repositoryRoot = new URL('../', import.meta.url);
const targets = [
  { target: 'staging', name: 'miminiapp-staging' },
  { target: 'production', name: 'miminiapp' },
] as const;
const allowedKeys = [
  '$schema',
  'name',
  'compatibility_date',
  'workers_dev',
  'preview_urls',
  'assets',
].sort();
const expectedAssets = {
  directory: '../../dist',
  html_handling: 'auto-trailing-slash',
  not_found_handling: '404-page',
  run_worker_first: false,
};

// This reads and validates configuration only: no deploy, login, account lookup,
// resource creation, remote preview or Cloudflare API operation is invoked.
for (const { target, name } of targets) {
  const configPath = fileURLToPath(
    new URL(`deploy/cloudflare/${target}.jsonc`, repositoryRoot),
  );
  const raw = experimental_readRawConfig({ config: configPath });
  assert.equal(
    raw.redirected,
    false,
    'Generated configuration must not replace the explicit target.',
  );
  assert.equal(raw.configPath, configPath);
  assert.deepEqual(Object.keys(raw.rawConfig).sort(), allowedKeys);
  assert.equal(raw.rawConfig.name, name);
  assert.equal(
    raw.rawConfig.$schema,
    '../../node_modules/wrangler/config-schema.json',
  );
  assert.equal(raw.rawConfig.compatibility_date, '2026-11-04');
  assert.equal(raw.rawConfig.workers_dev, true);
  assert.equal(raw.rawConfig.preview_urls, false);
  assert.deepEqual(raw.rawConfig.assets, expectedAssets);

  // Use the installed, pinned Wrangler parser and its own validation rules.
  const config = unstable_readConfig({ config: configPath });
  assert.equal(config.name, name);
  assert.equal(
    config.main,
    undefined,
    'Static hosting must not introduce a Worker script.',
  );
  assert.equal(
    config.account_id,
    undefined,
    'Account ID must be supplied securely outside committed configuration.',
  );
  assert.deepEqual(config.assets, expectedAssets);
  assert.equal(
    resolve(dirname(configPath), config.assets?.directory ?? ''),
    fileURLToPath(new URL('dist', repositoryRoot)),
  );
}

assert.equal(
  await readFile(new URL('public/_redirects', repositoryRoot), 'utf8'),
  '/ /es/ 301\n',
  'The delivered static assets must define the approved HTTP 301 root redirect.',
);
console.log(
  'Cloudflare staging/production configuration validated offline; no resources or content published.',
);
