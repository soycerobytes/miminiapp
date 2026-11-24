import { validateRegistry, type MiniappRegistration } from '../lib/miniapp-registry';

export const miniappRegistry = validateRegistry([
] satisfies readonly MiniappRegistration[]);
