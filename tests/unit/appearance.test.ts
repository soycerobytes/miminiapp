import { describe, expect, it } from 'vitest';
import {
  appearanceKey,
  parseAppearance,
  resolveAppearance,
} from '../../src/lib/appearance';

describe('shared appearance contract', () => {
  it('uses a single namespaced platform preference', () => {
    expect(appearanceKey).toBe('miminiapp.appearance');
  });
  it.each([undefined, null, '', 'DARK', 'auto', '"dark"', '<script>', {}, 1])(
    'treats untrusted or absent storage %j as system',
    (value) => {
      expect(resolveAppearance(parseAppearance(value), true)).toBe('dark');
      expect(resolveAppearance(parseAppearance(value), false)).toBe('light');
    },
  );
  it.each(['light', 'dark'] as const)(
    'preserves an explicit %s override of either device scheme',
    (value) => {
      expect(resolveAppearance(parseAppearance(value), true)).toBe(value);
      expect(resolveAppearance(parseAppearance(value), false)).toBe(value);
    },
  );
});
