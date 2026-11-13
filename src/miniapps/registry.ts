import {
  validateRegistry,
  type MiniappRegistration,
} from '../lib/miniapp-registry';

// A real tool is added only after its own approval. Test fixtures live in tests/.
// Published entry: { descriptor: metadata, loadEntry: () => import('./tool/entry.astro') }
// Step-by-step guide: docs/miniapps.md
export const miniappRegistry = validateRegistry(
  [] satisfies readonly MiniappRegistration[],
);
