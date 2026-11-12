import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { locales, type Locale } from './locales';

export interface MiniappCopy {
  readonly title: string;
  readonly description: string;
}

/** Pure metadata: importing this descriptor must never import tool UI. */
export interface MiniappDescriptor {
  readonly id: string;
  readonly slug: string;
  readonly status: 'draft' | 'published';
  readonly copy: Readonly<Record<Locale, MiniappCopy>>;
}

export type PublishedMiniappDescriptor = MiniappDescriptor & {
  readonly status: 'published';
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
