import type { AppearanceSettings } from './appearanceTypes';

export const appearanceStorageKey = 'animals-within.appearance.v1';

export interface AppearanceStorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const allowedValues = {
  language: ['el', 'en'],
  mode: ['system', 'light', 'dark'],
  colorTheme: ['forest', 'ocean', 'amber', 'plum'],
  fontFamily: ['system-sans', 'serif', 'readable'],
  textSize: ['small', 'normal', 'large', 'extra-large'],
} as const;

function isAllowed<T extends keyof AppearanceSettings>(
  key: T,
  value: unknown,
): value is AppearanceSettings[T] {
  return (allowedValues[key] as readonly unknown[]).includes(value);
}

export function normalizeStoredSettings(
  value: unknown,
  defaults: AppearanceSettings,
): AppearanceSettings {
  if (!value || typeof value !== 'object') {
    return defaults;
  }

  const candidate = value as Partial<AppearanceSettings>;
  return {
    language: isAllowed('language', candidate.language) ? candidate.language : defaults.language,
    mode: isAllowed('mode', candidate.mode) ? candidate.mode : defaults.mode,
    colorTheme: isAllowed('colorTheme', candidate.colorTheme)
      ? candidate.colorTheme
      : defaults.colorTheme,
    fontFamily: isAllowed('fontFamily', candidate.fontFamily)
      ? candidate.fontFamily
      : defaults.fontFamily,
    textSize: isAllowed('textSize', candidate.textSize) ? candidate.textSize : defaults.textSize,
  };
}

export function restoreAppearanceSettings(
  storage: AppearanceStorageAdapter | null,
  defaults: AppearanceSettings,
): AppearanceSettings {
  if (!storage) {
    return defaults;
  }

  try {
    const storedValue = storage.getItem(appearanceStorageKey);
    return storedValue ? normalizeStoredSettings(JSON.parse(storedValue), defaults) : defaults;
  } catch {
    return defaults;
  }
}

export function persistAppearanceSettings(
  storage: AppearanceStorageAdapter | null,
  settings: AppearanceSettings,
): void {
  try {
    storage?.setItem(appearanceStorageKey, JSON.stringify(settings));
  } catch {
    // Appearance persistence is optional; the application remains usable with in-memory settings.
  }
}

export function getBrowserAppearanceStorage(): AppearanceStorageAdapter | null {
  try {
    return (globalThis as { localStorage?: AppearanceStorageAdapter }).localStorage ?? null;
  } catch {
    return null;
  }
}
