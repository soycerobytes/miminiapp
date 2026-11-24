/** Validate required translation keys without requiring identical line wrapping. */
export function validateTranslationParity(
  reference: unknown,
  candidate: unknown,
  path = 'translations',
): void {
  if (typeof reference === 'string') {
    if (
      reference.trim().length === 0 ||
      typeof candidate !== 'string' ||
      candidate.trim().length === 0
    ) {
      throw new Error(`Missing translation: ${path}`);
    }
    return;
  }

  if (Array.isArray(reference)) {
    if (
      reference.length === 0 ||
      reference.some((line) => typeof line !== 'string' || !line.trim()) ||
      !Array.isArray(candidate) ||
      candidate.length === 0 ||
      candidate.some((line) => typeof line !== 'string' || !line.trim())
    ) {
      throw new Error(`Missing translation lines: ${path}`);
    }
    return;
  }

  if (
    reference === null ||
    typeof reference !== 'object' ||
    candidate === null ||
    typeof candidate !== 'object' ||
    Array.isArray(candidate)
  ) {
    throw new Error(`Invalid translation object: ${path}`);
  }

  const referenceKeys = Object.keys(reference);
  const candidateKeys = Object.keys(candidate);
  if (
    referenceKeys.length !== candidateKeys.length ||
    referenceKeys.some((key) => !Object.hasOwn(candidate, key))
  ) {
    throw new Error(`Translation keys differ: ${path}`);
  }

  for (const key of referenceKeys) {
    validateTranslationParity(
      (reference as Record<string, unknown>)[key],
      (candidate as Record<string, unknown>)[key],
      `${path}.${key}`,
    );
  }
}
