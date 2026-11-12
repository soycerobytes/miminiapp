import { describe, expect, it } from 'vitest';
import { validateLabel } from '../../src/lib/validation';

describe('validateLabel', () => {
  it('normalizes leading, trailing and repeated whitespace', () => {
    expect(validateLabel('  Base\t local\n comprobada  ')).toEqual({
      ok: true,
      value: 'Base local comprobada',
    });
  });

  it.each(['', '   ', '\t\n\r'])('rejects an empty label: %j', (input) => {
    expect(validateLabel(input)).toEqual({
      ok: false,
      error: 'Escribe una etiqueta.',
    });
  });

  it.each(['a', 'ab', '  ab  ', '🌱🌱'])(
    'rejects fewer than three characters: %j',
    (input) => {
      expect(validateLabel(input)).toEqual({
        ok: false,
        error: 'Usa al menos 3 caracteres.',
      });
    },
  );

  it('accepts the minimum of three characters after normalization', () => {
    expect(validateLabel('  sol  ')).toEqual({ ok: true, value: 'sol' });
  });

  it('accepts exactly 32 characters', () => {
    const value = 'a'.repeat(32);
    expect(validateLabel(value)).toEqual({ ok: true, value });
  });

  it('rejects 33 characters', () => {
    expect(validateLabel('a'.repeat(33))).toEqual({
      ok: false,
      error: 'Usa como máximo 32 caracteres.',
    });
  });

  it('counts Unicode code points rather than UTF-16 code units', () => {
    const value = '🌱'.repeat(32);
    expect(validateLabel('🌱🌱🌱')).toEqual({ ok: true, value: '🌱🌱🌱' });
    expect(validateLabel(value)).toEqual({ ok: true, value });
    expect(validateLabel(`${value}🌱`)).toEqual({
      ok: false,
      error: 'Usa como máximo 32 caracteres.',
    });
  });

  it('checks the normalized length rather than the raw input length', () => {
    expect(validateLabel(`  ${'a'.repeat(32)}  `)).toEqual({
      ok: true,
      value: 'a'.repeat(32),
    });
  });

  it('preserves punctuation as text', () => {
    expect(validateLabel('<b>Texto</b>')).toEqual({
      ok: true,
      value: '<b>Texto</b>',
    });
  });
});
