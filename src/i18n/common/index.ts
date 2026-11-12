import { es } from './es';
import { en } from './en';
import type { CommonCopy } from './types';
import type { Locale } from '../../lib/locales';
import { validateTranslationParity } from '../validation';

export const common: Record<Locale, CommonCopy> = { es, en };

// Run during prerender as well as tests; incomplete copy must fail the build.
validateTranslationParity(common.es, common.en);

export function getCommon(locale: Locale): CommonCopy {
  return common[locale];
}
