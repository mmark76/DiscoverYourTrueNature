import type { AppLanguage } from '../settings/appearanceTypes';
import { englishContent } from './content/en.ts';
import { greekContent } from './content/el.ts';
import type { TranslationContent } from './translationTypes';

export const translations = {
  el: greekContent,
  en: englishContent,
} satisfies Record<AppLanguage, TranslationContent>;

export function getTranslation(language: AppLanguage): TranslationContent {
  const content = translations[language];

  if (!content) {
    throw new Error(`Missing application translations for language: ${language}`);
  }

  return content;
}

export function formatTranslation(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{([a-zA-Z]+)\}/g, (_match, key: string) => {
    const value = values[key];

    if (value === undefined) {
      throw new Error(`Missing translation value for placeholder: ${key}`);
    }

    return String(value);
  });
}
