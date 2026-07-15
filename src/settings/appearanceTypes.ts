export type AppLanguage = 'el' | 'en';
export type AppearanceMode = 'system' | 'light' | 'dark';
export type ResolvedAppearanceMode = 'light' | 'dark';
export type ColorTheme = 'forest' | 'ocean' | 'amber' | 'plum';
export type FontFamilyChoice = 'system-sans' | 'serif' | 'readable';
export type TextSizeChoice = 'small' | 'normal' | 'large' | 'extra-large';

export interface AppearanceSettings {
  language: AppLanguage;
  mode: AppearanceMode;
  colorTheme: ColorTheme;
  fontFamily: FontFamilyChoice;
  textSize: TextSizeChoice;
}

export interface SemanticColors {
  background: string;
  backgroundMuted: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  mutedText: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  accent: string;
  accentPressed: string;
  onAccent: string;
  accentMuted: string;
  border: string;
  borderStrong: string;
  focus: string;
  disabled: string;
  disabledText: string;
  success: string;
  successSurface: string;
  warning: string;
  warningSurface: string;
  progressTrack: string;
  selection: string;
  footerBackground: string;
  footerText: string;
  footerMuted: string;
  heroMuted: string;
  heroDecoration: string;
  heroDecorationStrong: string;
}

export interface TypographySettings {
  fontFamily?: string;
  letterSpacing: number;
  scale: number;
}
