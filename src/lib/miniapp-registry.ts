import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { locales, type Locale } from './locales';

export interface MiniappCopy {
  readonly title: string;
  readonly description: string;
}

/** Stable identifiers taken from the kinds of tool in the product definition. */
export const miniappCategories = [
  'calculator',
  'productivity',
  'everyday',
  'science',
  'game',
  'experience',
] as const;

export type MiniappCategory = (typeof miniappCategories)[number];

/** Pure metadata: importing this descriptor must never import tool UI. */
export interface MiniappDescriptor {
  readonly id: string;
  readonly slug: string;
  readonly status: 'draft' | 'published';
  readonly category: MiniappCategory;
  /** Optional stable keywords, written like slugs; not translated copy. */
  readonly tags?: readonly string[];
  /** Calendar date of first publication, YYYY-MM-DD; required once published. */
  readonly publishedAt?: string;
  readonly copy: Readonly<Record<Locale, MiniappCopy>>;
}

export type PublishedMiniappDescriptor = MiniappDescriptor & {
  readonly status: 'published';
  readonly publishedAt: string;
};

export interface MiniappEntryModule {
  readonly default: AstroComponentFactory;
}

export type PublishedMiniappRegistration = {
  readonly descriptor: PublishedMiniappDescriptor;
  readonly loadEntry: () => Promise<MiniappEntryModule>;
};

export type MiniappRegistration =
  | PublishedMiniappRegistration
  | {
      readonly descriptor: MiniappDescriptor & { readonly status: 'draft' };
      readonly loadEntry?: never;
    };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const idPattern = /^[a-z0-9][a-z0-9._-]*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonemptyText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isCategory(value: unknown): value is MiniappCategory {
  return miniappCategories.some((category) => category === value);
}

/** Accepts only a real calendar day, so ordering by this text is reliable. */
function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/** Runtime validation also protects builds from malformed data and JS callers. */
export function validateRegistry(
  registry: readonly MiniappRegistration[],
): readonly MiniappRegistration[] {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const registration of registry) {
    if (!isRecord(registration) || !isRecord(registration.descriptor)) {
      throw new Error('Miniapp registration must contain a descriptor.');
    }
    const descriptor = registration.descriptor;
    if (!nonemptyText(descriptor.id) || !idPattern.test(descriptor.id)) {
      throw new Error('Miniapp id must be a nonempty stable ASCII identifier.');
    }
    if (ids.has(descriptor.id)) {
      throw new Error(`Duplicate miniapp id: ${descriptor.id}`);
    }
    if (!nonemptyText(descriptor.slug) || !slugPattern.test(descriptor.slug)) {
      throw new Error(
        `Invalid stable miniapp slug: ${String(descriptor.slug)}`,
      );
    }
    if (slugs.has(descriptor.slug)) {
      throw new Error(`Duplicate miniapp slug: ${descriptor.slug}`);
    }
    const status: unknown = descriptor.status;
    if (status !== 'published' && status !== 'draft') {
      throw new Error(`Invalid miniapp status: ${String(status)}`);
    }
    if (!isCategory(descriptor.category)) {
      throw new Error(
        `Invalid category for miniapp ${descriptor.id}: ${String(descriptor.category)}`,
      );
    }
    const tags: unknown = descriptor.tags;
    if (
      tags !== undefined &&
      (!Array.isArray(tags) ||
        tags.some((tag) => typeof tag !== 'string' || !slugPattern.test(tag)) ||
        new Set(tags).size !== tags.length)
    ) {
      throw new Error(`Invalid tags for miniapp: ${descriptor.id}`);
    }
    const publishedAt: unknown = descriptor.publishedAt;
    if (
      status === 'published'
        ? !isCalendarDate(publishedAt)
        : publishedAt !== undefined && !isCalendarDate(publishedAt)
    ) {
      throw new Error(`Invalid publication date for miniapp: ${descriptor.id}`);
    }
    if (!isRecord(descriptor.copy)) {
      throw new Error(`Missing translations for miniapp: ${descriptor.id}`);
    }
    for (const locale of locales) {
      const copy = descriptor.copy[locale];
      if (
        !isRecord(copy) ||
        !nonemptyText(copy.title) ||
        !nonemptyText(copy.description)
      ) {
        throw new Error(
          `Missing ${locale} metadata for miniapp: ${descriptor.id}`,
        );
      }
    }
    if (
      descriptor.status === 'published' &&
      typeof registration.loadEntry !== 'function'
    ) {
      throw new Error(
        `Published miniapp requires an entry loader: ${descriptor.id}`,
      );
    }
    if (descriptor.status === 'draft' && 'loadEntry' in registration) {
      throw new Error(
        `Draft miniapp cannot have an entry loader: ${descriptor.id}`,
      );
    }
    ids.add(descriptor.id);
    slugs.add(descriptor.slug);
  }
  return registry;
}

/** Metadata projection is deliberately independent of UI loaders. */
export function getPublishedMetadata(
  registry: readonly MiniappRegistration[],
): readonly PublishedMiniappDescriptor[] {
  return validateRegistry(registry)
    .filter(
      (registration): registration is PublishedMiniappRegistration =>
        registration.descriptor.status === 'published',
    )
    .map(({ descriptor }) => descriptor);
}

export function getMiniappPaths(registry: readonly MiniappRegistration[]) {
  return getPublishedMetadata(registry).flatMap((descriptor) =>
    locales.map((locale) => ({
      params: { locale, slug: descriptor.slug },
      props: { id: descriptor.id },
    })),
  );
}

export function findPublished(
  registry: readonly MiniappRegistration[],
  id: string,
): PublishedMiniappRegistration {
  validateRegistry(registry);
  const registration = registry.find(
    (entry): entry is PublishedMiniappRegistration =>
      entry.descriptor.id === id && entry.descriptor.status === 'published',
  );
  if (!registration) throw new Error(`Published miniapp not found: ${id}`);
  return registration;
}
