import { readFile, readdir } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  mapping,
  parseYaml,
  type Mapping,
  type Value,
} from '../helpers/workflow-yaml.ts';
import { assertPhaseB, readPolicy } from '../../scripts/release/gate.ts';
import {
  configurationPaths,
  isConfigurationPath,
  provenancePath,
  selectFiles,
  isSnapshotPath,
} from '../../scripts/promotion/core.ts';
import { readPolicy as readPromotionPolicy } from '../../scripts/promotion/cli.ts';

const directory = new URL('../../.github/workflows/', import.meta.url);
const pins: Record<string, string> = {
  'actions/checkout': '3d3c42e5aac5ba805825da76410c181273ba90b1',
  'actions/setup-node': '949feb2413d6458794dcd2491c4babbbce0c15c1',
  'actions/upload-artifact': 'cf430e030ddbb5b0abf93d22962f4752f3646cd9',
};
async function workflow(name: string) {
  return parseYaml(await readFile(new URL(name, directory), 'utf8'));
}
function demand(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
function audit(name: string, w: Mapping) {
  const triggers = mapping(w.on, 'on');
  demand(
    !('push' in triggers) &&
      !('pull_request_target' in triggers) &&
      !('workflow_run' in triggers),
    'Production must not react to staging pushes or privileged PR events',
  );
  demand(
    JSON.stringify(w.permissions) ===
      JSON.stringify(
        name === 'ci.yml'
          ? { contents: 'read', 'pull-requests': 'read' }
          : { contents: 'read' },
      ),
    'Unexpected global permissions',
  );
  demand(
    !JSON.stringify(w.env ?? {}).includes('secrets.'),
    'Global credentials',
  );
  demand(
    !/CLOUDFLARE|wrangler\s+(deploy|rollback|publish)|cli\.ts publish|auto.merge|\/merges\b/.test(
      JSON.stringify(w),
    ),
    'Additional publisher or automatic merge',
  );
  const jobs = mapping(w.jobs, 'jobs');
  if (!['ci.yml', 'prepare-release.yml'].includes(name)) {
    demand(
      Object.keys(triggers).join() === 'workflow_dispatch',
      'Legacy workflow event is active',
    );
    demand(
      Object.values(jobs).every((j) => mapping(j, 'job').if === '${{ false }}'),
      'Legacy publisher is active',
    );
  }
  for (const [id, value] of Object.entries(jobs)) {
    const job = mapping(value, 'job');
    demand(
      job['runs-on'] === 'ubuntu-24.04' &&
        !job.environment &&
        !job['continue-on-error'],
      'Unsafe job context',
    );
    demand(
      !/secrets\./.test(JSON.stringify(job)),
      'Production workflows must not use external secrets',
    );
    if (job.permissions)
      demand(
        name === 'prepare-release.yml' &&
          id === 'prepare' &&
          JSON.stringify(job.permissions) ===
            JSON.stringify({
              contents: 'write',
              'pull-requests': 'write',
              actions: 'write',
            }),
        'Unexpected write permissions',
      );
    const steps = (job.steps as Value[]).map((v) => mapping(v, 'step'));
    for (const step of steps) {
      demand(!step['continue-on-error'], 'Failure ignored');
      if (!step.uses) continue;
      const [action, pin] = String(step.uses).split('@');
      demand(pins[action] === pin, 'Unpinned action');
      const options = mapping(step.with, 'with');
      if (action === 'actions/checkout')
        demand(
          options['persist-credentials'] === false,
          'Persistent credential',
        );
      if (action === 'actions/setup-node')
        demand(
          options['node-version'] === '24.22.2' &&
            options['package-manager-cache'] === false,
          'Runtime/cache drift',
        );
    }
    if (name === 'prepare-release.yml') {
      demand(
        Object.keys(triggers).join() === 'workflow_dispatch',
        'Preparation must be manual',
      );
      demand(
        job.if ===
          "${{ github.repository == 'soycerobytes/miminiapp' && github.repository_id == '1455524397' && github.ref == 'refs/heads/main' }}",
        'Untrusted preparation context',
      );
      demand(
        steps
          .filter(
            (s) => s.uses && String(s.uses).startsWith('actions/checkout@'),
          )
          .every((s) => mapping(s.with, 'with').ref === '${{ github.sha }}'),
        'Mutable control checkout',
      );
      demand(
        !steps.some((s) =>
          /npm |npx |application|raw\.githubusercontent/.test(String(s.run)),
        ),
        'Imported code executed in preparation',
      );
      demand(
        steps.some(
          (s) =>
            s.run ===
            `node scripts/promotion/cli.ts ${id === 'inspect' ? 'inspect' : 'prepare'}`,
        ),
        'Missing concrete guarded operation',
      );
      if (id === 'prepare')
        demand(
          job.needs === 'inspect' &&
            steps.some(
              (s) =>
                mapping(s.env ?? {}, 'env').EXPECTED_FINGERPRINT ===
                '${{ needs.inspect.outputs.fingerprint }}',
            ),
          'Missing independent inspection',
        );
    }
  }
  if (name === 'ci.yml') {
    demand(
      JSON.stringify(mapping(triggers.pull_request, 'pr').branches) ===
        '["main"]',
      'Configuration PRs must target main',
    );
    demand(
      JSON.stringify(mapping(triggers.pull_request, 'pr').paths) ===
        JSON.stringify(configurationPaths) &&
        !mapping(triggers.pull_request, 'pr')['paths-ignore'],
      'Configuration CI filters differ from the protected import boundary',
    );
    demand(
      triggers.workflow_dispatch,
      'Bot-created PR needs explicit CI dispatch',
    );
    const quality = mapping(jobs.quality, 'quality');
    demand(
      quality.name === 'quality' && !quality.if && !quality.permissions,
      'Quality must not be skipped or privileged',
    );
    const steps = (quality.steps as Value[]).map((s) => mapping(s, 'step'));
    const controls = mapping(steps[0].with, 'trusted checkout');
    demand(
      controls.ref === "${{ github.event.pull_request.base.sha || 'main' }}" &&
        controls.path === 'control',
      'PR must not provide its own verifier',
    );
    const releaseCondition =
      "${{ github.event_name == 'workflow_dispatch' || startsWith(github.head_ref, 'release/') }}";
    const configurationCondition =
      "${{ github.event_name == 'pull_request' && !startsWith(github.head_ref, 'release/') }}";
    const checks = steps.filter(
      (s) => s.run === 'node control/scripts/promotion/cli.ts check-pr',
    );
    demand(
      checks.length === 1 && checks[0].if === releaseCondition,
      'Release transfer must be checked with trusted controls',
    );
    demand(
      !/npm run verify|playwright|test:e2e|test:components|test:integration|astro build/.test(
        JSON.stringify(steps),
      ),
      'Production must not repeat application tests',
    );
    for (const step of steps) {
      if (
        /npm |npx |configuration/.test(String(step.run)) ||
        step['working-directory'] === 'configuration'
      )
        demand(
          step.if === configurationCondition,
          'Configuration tools must not run for a release',
        );
    }
    demand(
      steps.some(
        (s) =>
          String(s.run).includes(
            'tests/unit/production-promotion.test.ts tests/unit/production-workflow-safety.test.ts',
          ) && s.if === configurationCondition,
      ),
      'Production control changes require their own tests',
    );
    const extraCheckout = steps
      .filter((s) => s.uses && String(s.uses).startsWith('actions/checkout@'))
      .slice(1);
    demand(
      extraCheckout.length === 1 &&
        extraCheckout[0].if === configurationCondition &&
        mapping(extraCheckout[0].with, 'configuration checkout').ref ===
          '${{ github.sha }}',
      'Release must not check out or execute application code',
    );
  }
}

describe('actual production workflows and publication lock', () => {
  it('audits every actual workflow, with no staging push subscription or second publisher', async () => {
    const names = (await readdir(directory))
      .filter((f) => /\.ya?ml$/.test(f))
      .sort();
    expect(names).toEqual([
      'ci.yml',
      'prepare-release.yml',
      'production.yml',
      'promotion.yml',
      'rollback.yml',
      'staging.yml',
    ]);
    for (const name of names) audit(name, await workflow(name));
  });
  it('the old Actions publishing CLI cannot be enabled using either activation flag', async () => {
    const policy = await readPolicy();
    expect(policy).toMatchObject({
      repository: 'soycerobytes/miminiapp',
      repositoryId: '1455524397',
      deploymentsEnabled: false,
      promotionEnabled: false,
      rollbackEnabled: false,
    });
    for (const target of ['staging', 'production'])
      expect(() => assertPhaseB(policy, target, 'true')).toThrow(
        'publication is disabled',
      );
  });
  it.each(['push', 'pull_request_target', 'workflow_run'])(
    'rejects adding %s to preparation',
    async (trigger) => {
      const w = await workflow('prepare-release.yml');
      mapping(w.on, 'on')[trigger] = {};
      expect(() => audit('prepare-release.yml', w)).toThrow();
    },
  );
  it('rejects activating a legacy publication job', async () => {
    const w = await workflow('production.yml');
    mapping(mapping(w.jobs, 'jobs').disabled, 'job').if = '${{ true }}';
    expect(() => audit('production.yml', w)).toThrow('publisher is active');
  });
  it('rejects installing dependencies in the write-enabled preparation job', async () => {
    const w = await workflow('prepare-release.yml');
    const job = mapping(mapping(w.jobs, 'jobs').prepare, 'job');
    (job.steps as Value[]).push({ run: 'npm ci' });
    expect(() => audit('prepare-release.yml', w)).toThrow('Imported code');
  });
  it('rejects repeating the full application suite in production', async () => {
    const w = await workflow('ci.yml');
    const job = mapping(mapping(w.jobs, 'jobs').quality, 'job');
    (job.steps as Value[]).push({ run: 'npm run verify' });
    expect(() => audit('ci.yml', w)).toThrow('repeat application tests');
  });
  it('rejects configuration dependency installation leaking into releases', async () => {
    const w = await workflow('ci.yml');
    const job = mapping(mapping(w.jobs, 'jobs').quality, 'job');
    const step = (job.steps as Value[])
      .map((s) => mapping(s, 'step'))
      .find((s) => s.run === 'npm ci')!;
    delete step.if;
    expect(() => audit('ci.yml', w)).toThrow('must not run for a release');
  });
  it('rejects CI using release code as its own trusted verifier', async () => {
    const w = await workflow('ci.yml');
    const job = mapping(mapping(w.jobs, 'jobs').quality, 'job');
    mapping(mapping((job.steps as Value[])[0], 'step').with, 'with').ref =
      '${{ github.sha }}';
    expect(() => audit('ci.yml', w)).toThrow('own verifier');
  });
  it('rejects re-including release provenance in automatic PR checks', async () => {
    const w = await workflow('ci.yml');
    const paths = mapping(mapping(w.on, 'on').pull_request, 'pr')
      .paths as Value[];
    paths.push(provenancePath);
    expect(() => audit('ci.yml', w)).toThrow('protected import boundary');
  });
  it('rejects dropping configuration paths from automatic validation', async () => {
    const w = await workflow('ci.yml');
    mapping(mapping(w.on, 'on').pull_request, 'pr').paths = ['docs/**'];
    expect(() => audit('ci.yml', w)).toThrow('protected import boundary');
  });
});

describe('one CI execution per prepared release', () => {
  it('reproduces PR #2 without matching any automatic PR trigger', () => {
    const changed = [
      provenancePath,
      'public/fonts/DMSans-OFL.txt',
      'public/fonts/SpaceGrotesk-OFL.txt',
    ];
    expect(changed.some(isConfigurationPath)).toBe(false);
    expect(
      [...changed, '.github/workflows/ci.yml'].some(isConfigurationPath),
    ).toBe(true);
  });
  it('no authorized import or its generated provenance can trigger configuration CI', async () => {
    const policy = await readPromotionPolicy();
    expect(policy.selection).toBe('snapshot');
    const project = {
      'src/new-tool.ts': { mode: '100644', sha: 'a'.repeat(40) },
      'docs/new-tool.md': { mode: '100644', sha: 'b'.repeat(40) },
    };
    expect(
      Object.keys(selectFiles(policy, project)).filter(isConfigurationPath),
    ).toEqual([]);
    expect(isConfigurationPath(provenancePath)).toBe(false);
  });
  it.each([
    '.github/workflows/ci.yml',
    '.github/promotion-policy.json',
    '.github/deployment-policy.json',
    'scripts/promotion/core.ts',
    'scripts/release/gate.ts',
    'deploy/cloudflare/production.jsonc',
    'docs/production-promotion.md',
    'docs/design-docs/index.md',
    'tests/unit/production-workflow-safety.test.ts',
    'tests/unit/release-gate.test.ts',
    'tests/unit/workflow-safety.test.ts',
    'tests/helpers/workflow-yaml.ts',
    'tests/fixtures/source-release/README.md',
    'tests/remote/target.ts',
    'README.md',
    'ARCHITECTURE.md',
    'AGENTS.md',
    'CLAUDE.md',
    'GEMINI.md',
    '.gitignore',
    '.gitattributes',
  ])(
    'configuration and documentation changes still trigger CI: %s',
    async (path) => {
      expect(isConfigurationPath(path)).toBe(true);
      const policy = await readPromotionPolicy();
      expect(isSnapshotPath(path)).toBe(false);
      expect(
        selectFiles(policy, {
          [path]: { mode: '100644', sha: 'a'.repeat(40) },
        })[path],
      ).toBeUndefined();
    },
  );
  it.each([
    'src/miniapps/approved/entry.astro',
    'src/components/Home.astro',
    'package.json',
    'package-lock.json',
    'public/new-asset.svg',
    'docs/new-procedure.md',
    'scripts/new-tool-helper.ts',
    'tests/helpers/new-tool-helper.ts',
  ])(
    'application changes rely on the explicit release validation: %s',
    (path) => {
      expect(isConfigurationPath(path)).toBe(false);
    },
  );
});
