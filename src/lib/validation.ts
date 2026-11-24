export type LabelValidation =
  { ok: true; value: string } | { ok: false; error: string };

export function validateLabel(input: string): LabelValidation {
  const value = input.trim().replace(/\s+/gu, ' ');
  const length = Array.from(value).length;

  if (length === 0) {
    return { ok: false, error: 'Escribe una etiqueta.' };
  }

  if (length < 3) {
    return { ok: false, error: 'Usa al menos 3 caracteres.' };
  }

  if (length > 32) {
    return { ok: false, error: 'Usa como máximo 32 caracteres.' };
  }

  return { ok: true, value };
}
