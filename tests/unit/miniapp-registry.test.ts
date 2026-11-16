import { describe, expect, it, vi } from 'vitest';
import {
  findPublished,
  getMiniappPaths,
  getPublishedMetadata,
  miniappCategories,
  validateRegistry,
  type MiniappDescriptor,
  type MiniappRegistration,
  type PublishedMiniappRegistration,
} from '../../src/lib/miniapp-registry';
import {
  defaultLocale,
  equivalentPath,
  homePath,
  isLocale,
  miniappPath,
} from '../../src/lib/locales';
import { miniappRegistry } from '../../src/miniapps/registry';

function published(id: string): PublishedMiniappRegistration {
  return {
    descriptor: {
      id,
      slug: `fixture-${id}`,
      status: 'published',
      category: 'calculator',
      publishedAt: '2026-11-05',
      copy: {
        es: { title: `Prueba ${id}`, description: `Descripción ${id}` },
        en: { title: `Test ${id}`, description: `Description ${id}` },
      },
    },
    loadEntry: vi.fn(async () => {
      throw new Error('Metadata and route planning must not load any UI.');
    }),
  };
}

function draft(id = 'd'): Extract<MiniappRegistration, { loadEntry?: never }> {
  return {
    descriptor: { ...published(id).descriptor, status: 'draft' },
  };
}

function malformed(value: unknown): readonly MiniappRegistration[] {
  return [value] as readonly MiniappRegistration[];
}

describe('explicit miniapp registry', () => {
  it('ships an empty production catalogue without test fixtures', () => {
    expect(miniappRegistry).toEqual([]);
    expect(getPublishedMetadata(miniappRegistry)).toEqual([]);
    expect(getMiniappPaths(miniappRegistry)).toEqual([]);
  });

  it('projects published metadata without invoking UI loaders', () => {
    const a = published('a');
    const d = draft();
    expect(getPublishedMetadata([a, d])).toEqual([a.descriptor]);
    expect(a.loadEntry).not.toHaveBeenCalled();
    expect(getPublishedMetadata([a, d])[0]).not.toHaveProperty('loadEntry');
  });

  it('adds B by one registration, retaining A and excluding D in both languages', () => {
    const a = published('a');
    const b = published('b');
    const d = draft();
    const before = [a, d];
    const after = [...before, b];
    const beforeDescriptor = JSON.stringify(getPublishedMetadata(before)[0]);
    const beforePaths = getMiniappPaths(before);

    expect(getPublishedMetadata(after)).toEqual([a.descriptor, b.descriptor]);
    expect(JSON.stringify(getPublishedMetadata(after)[0])).toBe(
      beforeDescriptor,
    );
    expect(getMiniappPaths(after)).toEqual([
      ...beforePaths,
      { params: { locale: 'es', slug: 'fixture-b' }, props: { id: 'b' } },
      { params: { locale: 'en', slug: 'fixture-b' }, props: { id: 'b' } },
    ]);
    expect(JSON.stringify(getMiniappPaths(after))).not.toContain('fixture-d');
    expect(a.loadEntry).not.toHaveBeenCalled();
    expect(b.loadEntry).not.toHaveBeenCalled();
  });

  it('resolves a published entry by stable id without executing its loader', () => {
    const a = published('a');
    expect(findPublished([a, draft()], 'a')).toBe(a);
    expect(a.loadEntry).not.toHaveBeenCalled();
    expect(() => findPublished([a, draft()], 'd')).toThrow('not found');
    expect(() => findPublished([a], 'absent')).toThrow('not found');
  });

  it('keeps route props serializable and components/loaders out of paths', () => {
    const paths = getMiniappPaths([published('a')]);
    expect(paths).toEqual(JSON.parse(JSON.stringify(paths)));
    expect(paths[0].props).toEqual({ id: 'a' });
  });

  it('rejects duplicate stable ids across published entries and drafts', () => {
    const a = published('a');
    const other = {
      descriptor: { ...draft('a').descriptor, slug: 'different' },
    };
    expect(() => validateRegistry([a, other])).toThrow('Duplicate miniapp id');
  });

  it('rejects duplicate stable slugs independently of ids', () => {
    const a = published('a');
    const b = published('b');
    expect(() =>
      validateRegistry([
        a,
        { ...b, descriptor: { ...b.descriptor, slug: a.descriptor.slug } },
      ]),
    ).toThrow('Duplicate miniapp slug');
  });

  it.each([
    '',
    ' ',
    'Mayúscula',
    '../tool',
    'tool/app',
    '/tool',
    'two words',
    'uno?',
    'álgebra',
    '-tool',
    'tool-',
    'two--dashes',
  ])('rejects invalid stable slug %j', (slug) => {
    const a = published('a');
    expect(() =>
      validateRegistry([{ ...a, descriptor: { ...a.descriptor, slug } }]),
    ).toThrow('slug');
  });

  it.each(['', ' ', 'Nombre traducido', '../tool', '🌱'])(
    'rejects invalid stable id %j',
    (id) => {
      const a = published('a');
      expect(() =>
        validateRegistry([{ ...a, descriptor: { ...a.descriptor, id } }]),
      ).toThrow('id');
    },
  );

  it.each(['es', 'en'] as const)(
    'requires nonempty title and description for %s',
    (locale) => {
      const a = published('a');
      for (const key of ['title', 'description'] as const) {
        const descriptor = {
          ...a.descriptor,
          copy: {
            ...a.descriptor.copy,
            [locale]: { ...a.descriptor.copy[locale], [key]: '  ' },
          },
        };
        expect(() => validateRegistry([{ ...a, descriptor }])).toThrow(
          `Missing ${locale} metadata`,
        );
      }
    },
  );

  it('rejects absent required locale rather than silently falling back', () => {
    const a = published('a');
    const descriptor = { ...a.descriptor, copy: { es: a.descriptor.copy.es } };
    expect(() => validateRegistry(malformed({ ...a, descriptor }))).toThrow(
      'Missing en metadata',
    );
  });

  it('rejects absent translation data, malformed registration and unknown status', () => {
    const a = published('a');
    expect(() => validateRegistry(malformed(null))).toThrow('descriptor');
    expect(() => validateRegistry(malformed({}))).toThrow('descriptor');
    expect(() =>
      validateRegistry(
        malformed({ ...a, descriptor: { ...a.descriptor, copy: null } }),
      ),
    ).toThrow('translations');
    expect(() =>
      validateRegistry(
        malformed({ ...a, descriptor: { ...a.descriptor, status: 'hidden' } }),
      ),
    ).toThrow('status');
  });

  it('accepts every category named by the product definition and no other', () => {
    const a = published('a');
    expect(miniappCategories).toEqual([
      'calculator',
      'productivity',
      'everyday',
      'science',
      'game',
      'experience',
    ]);
    for (const category of miniappCategories)
      expect(() =>
        validateRegistry([{ ...a, descriptor: { ...a.descriptor, category } }]),
      ).not.toThrow();
    for (const category of [undefined, '', 'Calculadora', 'tools', 7])
      expect(() =>
        validateRegistry(
          malformed({ ...a, descriptor: { ...a.descriptor, category } }),
        ),
      ).toThrow('Invalid category');
  });

  it('requires a real calendar publication date once a tool is published', () => {
    const a = published('a');
    for (const publishedAt of [
      undefined,
      '',
      '2026-13-01',
      '2026-02-30',
      '05/11/2026',
      '2026-11-05T10:00:00Z',
      20261105,
    ])
      expect(() =>
        validateRegistry(
          malformed({ ...a, descriptor: { ...a.descriptor, publishedAt } }),
        ),
      ).toThrow('Invalid publication date');
    const { publishedAt: _unused, ...undated } = draft().descriptor;
    expect(_unused).toBe('2026-11-05');
    expect(validateRegistry([{ descriptor: undated }])).toHaveLength(1);
    expect(() =>
      validateRegistry([{ descriptor: { ...undated, publishedAt: 'pronto' } }]),
    ).toThrow('Invalid publication date');
  });

  it('keeps optional tags as unique stable keywords', () => {
    const a = published('a');
    const withTags = (tags: unknown) =>
      malformed({ ...a, descriptor: { ...a.descriptor, tags } });
    expect(() => validateRegistry(withTags([]))).not.toThrow();
    expect(() =>
      validateRegistry(withTags(['finanzas', 'interes-compuesto'])),
    ).not.toThrow();
    for (const tags of [
      'finanzas',
      ['Finanzas'],
      ['con espacio'],
      [''],
      [3],
      ['repetida', 'repetida'],
    ])
      expect(() => validateRegistry(withTags(tags))).toThrow('Invalid tags');
  });

  it('requires a loader only for published entries', () => {
    const a = published('a');
    expect(() =>
      validateRegistry(malformed({ descriptor: a.descriptor })),
    ).toThrow('requires an entry loader');
    expect(() =>
      validateRegistry(malformed({ ...a, loadEntry: 'not-a-function' })),
    ).toThrow('requires an entry loader');
    expect(validateRegistry([draft()])).toHaveLength(1);
    expect(() =>
      validateRegistry(
        malformed({ descriptor: draft().descriptor, loadEntry: a.loadEntry }),
      ),
    ).toThrow('Draft miniapp cannot');
    expect(() =>
      validateRegistry(
        malformed({ descriptor: draft().descriptor, loadEntry: undefined }),
      ),
    ).toThrow('Draft miniapp cannot');
    expect(a.loadEntry).not.toHaveBeenCalled();
  });

  it('validates descriptors without changing their metadata', () => {
    const a = published('a');
    const before: MiniappDescriptor = structuredClone(a.descriptor);
    validateRegistry([a]);
    expect(a.descriptor).toEqual(before);
  });
});

describe('explicit locale routes', () => {
  it('defaults to Spanish while recognizing only the two approved locales', () => {
    expect(defaultLocale).toBe('es');
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(true);
    for (const locale of ['fr', 'ES', 'es-ES', '', undefined, null])
      expect(isLocale(locale)).toBe(false);
  });

  it('generates trailing-slash URLs and preserves the tool slug across languages', () => {
    expect(homePath('es')).toBe('/es/');
    expect(equivalentPath('en')).toBe('/en/');
    expect(miniappPath('es', 'stable-slug')).toBe('/es/apps/stable-slug/');
    expect(equivalentPath('en', 'stable-slug')).toBe('/en/apps/stable-slug/');
  });
});
