import type { CommonCopy } from './types';

export const en = {
  meta: {
    title: 'MiMiniApp · Ideas become little tools',
    description:
      'A creative miniapp laboratory for solving, exploring and playing. Discover the MiMiniApp catalogue in English.',
  },
  navigation: {
    skip: 'Skip to content',
    label: 'Main navigation',
    catalogue: 'Catalogue',
    project: 'The project',
    language: 'Language',
    spanish: 'ES · View in Spanish',
    english: 'EN · View in English',
  },
  hero: {
    badge: 'A creative lab · ES / EN',
    titleLines: ['Ideas become'],
    titleAccent: 'little tools.',
    emptyLead:
      'A miniapp laboratory for solving, exploring and playing. No tools are published yet.',
    populatedLead:
      'A miniapp laboratory for solving, exploring and playing. Find your next tool in the catalogue.',
    cta: 'Explore the catalogue',
  },
  catalogue: {
    eyebrow: 'Room to explore',
    title: 'The catalogue',
    quietLines: ['Small tools.', 'At their own pace.'],
    open: 'Open tool',
    emptyTitleLines: ['A place for', 'what comes next.'],
    emptyDescription:
      'No miniapps are published yet. Tools will appear here once they’re ready.',
    emptyNoteLines: ['Room for', 'what comes next'],
  },
  footer: { description: 'Made for exploring' },
  appearance: {
    label: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  motion: {
    pause: 'Pause animations',
    resume: 'Resume animations',
    running: 'Animations playing',
    paused: 'Animations paused',
  },
  errors: {
    title: 'Page not found · MiMiniApp',
    description: 'This page does not exist. Return to the MiMiniApp catalogue.',
    heading: 'This page wandered out of the lab.',
    message:
      'We couldn’t find the page you’re looking for. Head back to the catalogue and keep exploring.',
    home: 'Back to the catalogue in English',
  },
} satisfies CommonCopy;
