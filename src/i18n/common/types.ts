export interface CommonCopy {
  meta: { title: string; description: string };
  navigation: {
    skip: string;
    label: string;
    catalogue: string;
    project: string;
    language: string;
    spanish: string;
    english: string;
  };
  hero: {
    badge: string;
    titleLines: readonly string[];
    titleAccent: string;
    emptyLead: string;
    populatedLead: string;
    cta: string;
  };
  catalogue: {
    eyebrow: string;
    title: string;
    quietLines: readonly string[];
    open: string;
    emptyTitleLines: readonly string[];
    emptyDescription: string;
    emptyNoteLines: readonly string[];
  };
  footer: { description: string };
  appearance: { label: string; light: string; dark: string; system: string };
  motion: {
    pause: string;
    resume: string;
    running: string;
    paused: string;
  };
  errors: {
    title: string;
    description: string;
    heading: string;
    message: string;
    home: string;
  };
}
