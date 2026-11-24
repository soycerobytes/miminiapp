import type { CommonCopy } from './types';

export const es = {
  meta: {
    title: 'MiMiniApp · Ideas que se vuelven herramientas',
    description:
      'Un laboratorio creativo de miniapps para resolver, explorar y jugar. Descubre el catálogo de MiMiniApp en español.',
  },
  navigation: {
    skip: 'Saltar al contenido',
    label: 'Navegación principal',
    catalogue: 'Catálogo',
    project: 'El proyecto',
    language: 'Idioma',
    spanish: 'ES · Ver en español',
    english: 'EN · Ver en inglés',
  },
  hero: {
    badge: 'Laboratorio creativo · ES / EN',
    titleLines: ['Ideas que se', 'vuelven'],
    titleAccent: 'herramientas.',
    emptyLead:
      'Un laboratorio de miniapps para resolver, explorar y jugar. Aún no hay herramientas publicadas.',
    populatedLead:
      'Un laboratorio de miniapps para resolver, explorar y jugar. Encuentra tu próxima herramienta en el catálogo.',
    cta: 'Ver el catálogo',
  },
  catalogue: {
    eyebrow: 'Por explorar',
    title: 'El catálogo',
    quietLines: ['Pequeñas herramientas.', 'A su ritmo.'],
    open: 'Abrir herramienta',
    emptyTitleLines: ['Un espacio para', 'lo que viene.'],
    emptyDescription:
      'Aún no hay miniapps publicadas. Aquí aparecerán las herramientas cuando estén listas.',
    emptyNoteLines: ['Espacio para', 'lo que viene'],
  },
  footer: { description: 'Hecho para explorar' },
  appearance: {
    label: 'Apariencia',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
  },
  motion: {
    pause: 'Pausar animaciones',
    resume: 'Reanudar animaciones',
    running: 'Animaciones activas',
    paused: 'Animaciones en pausa',
  },
  errors: {
    title: 'Página no encontrada · MiMiniApp',
    description: 'Esta página no existe. Vuelve al catálogo de MiMiniApp.',
    heading: 'Esta página se salió del laboratorio.',
    message:
      'No encontramos la página que buscas. Puedes volver al catálogo y seguir explorando.',
    home: 'Volver al catálogo en español',
  },
} satisfies CommonCopy;
