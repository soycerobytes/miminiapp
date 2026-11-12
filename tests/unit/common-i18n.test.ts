import { describe, expect, it } from 'vitest';
import { common, getCommon } from '../../src/i18n/common';
import { validateTranslationParity } from '../../src/i18n/validation';

describe('required platform translations', () => {
  it('provides complete ES/EN dictionaries without missing required keys', () => {
    expect(() => validateTranslationParity(common.es, common.en)).not.toThrow();
    expect(getCommon('es').navigation.catalogue).toBe('Catálogo');
    expect(getCommon('en').navigation.catalogue).toBe('Catalogue');
  });

  it.each([
    [{ title: '' }, { title: 'Complete' }],
    [{ title: 'Complete' }, { title: ' ' }],
    [{ title: 'Complete' }, {}],
    [{ title: 'Complete' }, { title: 'Complete', unexpected: 'Extra' }],
    [{ lines: [] }, { lines: ['Complete'] }],
    [{ lines: [' '] }, { lines: ['Complete'] }],
    [{ lines: ['Complete'] }, { lines: [] }],
    [{ lines: ['Complete'] }, { lines: [' '] }],
    [{ lines: ['Complete'] }, { lines: [42] }],
    [{ nested: { title: 'Complete' } }, { nested: null }],
  ])(
    'rejects missing, empty or malformed required copy in either locale',
    (es, en) => {
      expect(() => validateTranslationParity(es, en)).toThrow();
    },
  );

  it('allows locale-specific line wrapping without changing required keys', () => {
    expect(() =>
      validateTranslationParity(
        { lines: ['Ideas que se', 'vuelven'] },
        { lines: ['Ideas become'] },
      ),
    ).not.toThrow();
  });

  it('includes useful copy for zero and populated catalogues in each locale', () => {
    for (const copy of Object.values(common)) {
      expect(copy.hero.emptyLead).not.toBe(copy.hero.populatedLead);
      expect(copy.catalogue.emptyDescription).toBeTruthy();
      expect(copy.catalogue.open).toBeTruthy();
    }
  });
});
