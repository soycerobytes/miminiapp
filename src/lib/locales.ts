export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' && locales.some((locale) => locale === value)
  );
}

export function homePath(locale: Locale): string {
  return `/${locale}/`;
}

export function miniappPath(locale: Locale, slug: string): string {
  return `/${locale}/apps/${slug}/`;
}

export function equivalentPath(locale: Locale, appSlug?: string): string {
  return appSlug ? miniappPath(locale, appSlug) : homePath(locale);
}
