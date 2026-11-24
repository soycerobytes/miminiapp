export const appearanceKey = 'miminiapp.appearance';
export type Appearance = 'light' | 'dark' | 'system';

export function parseAppearance(value: unknown): Appearance {
  return value === 'light' || value === 'dark' ? value : 'system';
}

export function resolveAppearance(preference: Appearance, dark: boolean) {
  return preference === 'system' ? (dark ? 'dark' : 'light') : preference;
}
