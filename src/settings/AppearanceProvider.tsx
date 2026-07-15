import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import {
  appearancePresets,
  createDefaultSettings,
  resolveTypography,
  updateAppearanceSettings,
} from './appearancePresets';
import {
  getBrowserAppearanceStorage,
  persistAppearanceSettings,
  restoreAppearanceSettings,
} from './appearanceStorage';
import type {
  AppearanceSettings,
  ResolvedAppearanceMode,
  SemanticColors,
  TypographySettings,
} from './appearanceTypes';
import { getSettingsLabel } from './settingsTranslations';
import type { SettingsTranslationKey } from './settingsTranslations';

interface AppearanceContextValue {
  colors: SemanticColors;
  resolvedMode: ResolvedAppearanceMode;
  settings: AppearanceSettings;
  typography: TypographySettings;
  resetSettings: () => void;
  translate: (key: SettingsTranslationKey) => string;
  updateSettings: (updates: Partial<AppearanceSettings>) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function getDeviceLocale(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return undefined;
  }
}

interface AppearanceProviderProps {
  children: ReactNode;
}

export function AppearanceProvider({ children }: AppearanceProviderProps) {
  const deviceLocale = getDeviceLocale();
  const storage = getBrowserAppearanceStorage();
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<AppearanceSettings>(() =>
    restoreAppearanceSettings(storage, createDefaultSettings(deviceLocale)),
  );

  useEffect(() => {
    persistAppearanceSettings(storage, settings);
  }, [settings, storage]);

  const resolvedMode: ResolvedAppearanceMode =
    settings.mode === 'system' ? (systemColorScheme === 'dark' ? 'dark' : 'light') : settings.mode;
  const colors = appearancePresets[settings.colorTheme][resolvedMode];
  const typography = resolveTypography(settings.fontFamily, settings.textSize);

  const value = useMemo<AppearanceContextValue>(
    () => ({
      colors,
      resolvedMode,
      settings,
      typography,
      resetSettings: () => setSettings(createDefaultSettings(getDeviceLocale())),
      translate: (key) => getSettingsLabel(settings.language, key),
      updateSettings: (updates) => setSettings((current) => updateAppearanceSettings(current, updates)),
    }),
    [colors, resolvedMode, settings, typography],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const value = useContext(AppearanceContext);

  if (!value) {
    throw new Error('useAppearance must be used inside AppearanceProvider.');
  }

  return value;
}
