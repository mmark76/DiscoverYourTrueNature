import type {
  AppearanceSettings,
  ColorTheme,
  FontFamilyChoice,
  ResolvedAppearanceMode,
  SemanticColors,
  TextSizeChoice,
  TypographySettings,
} from './appearanceTypes';

export const appearancePresets: Record<
  ColorTheme,
  Record<ResolvedAppearanceMode, SemanticColors>
> = {
  forest: {
    light: {
      background: '#F3EBDD', backgroundMuted: '#EEE4D3', surface: '#FFFCF5', surfaceMuted: '#F8F2E7',
      text: '#26364A', heading: '#4A210E', mutedText: '#5D6879', primary: '#AD5200', primaryPressed: '#873409',
      onPrimary: '#FFFFFF', accent: '#A9430D', accentPressed: '#873409', onAccent: '#FFFFFF',
      accentMuted: '#FFF1D6', border: '#CBD5DF', borderStrong: '#AEBBC8', focus: '#C86400',
      disabled: '#DDD8CF', disabledText: '#68717C', success: '#55705E', successSurface: '#E8EFE9',
      warning: '#9A5A16', warningSurface: '#FFF0D8', progressTrack: '#E5DED1', selection: '#FFF0D2',
      footerBackground: '#FFFCF5', footerText: '#53657C', footerMuted: '#687589', heroMuted: '#F5E6CD',
      heroDecoration: '#E8C18C', heroDecorationStrong: '#C97924',
    },
    dark: {
      background: '#1E1915', backgroundMuted: '#27201A', surface: '#30271F', surfaceMuted: '#392E25',
      text: '#DCE2EA', heading: '#F3D4B8', mutedText: '#AAB3C0', primary: '#E89A3D', primaryPressed: '#F0AE58',
      onPrimary: '#2D1807', accent: '#D9852D', accentPressed: '#E79B45', onAccent: '#2D1807',
      accentMuted: '#493421', border: '#51463B', borderStrong: '#746658', focus: '#F0AE58',
      disabled: '#3E3832', disabledText: '#9D968E', success: '#9AB5A0', successSurface: '#2D3930',
      warning: '#E4A55C', warningSurface: '#493421', progressTrack: '#463D34', selection: '#493621',
      footerBackground: '#18130F', footerText: '#D7DEE7', footerMuted: '#9EA8B5', heroMuted: '#4A321F',
      heroDecoration: '#8C5A2D', heroDecorationStrong: '#E8B779',
    },
  },
  ocean: {
    light: {
      background: '#EEF4F6', backgroundMuted: '#DDE9ED', surface: '#FFFFFF', surfaceMuted: '#F5F9FA',
      text: '#142A33', heading: '#142A33', mutedText: '#526A73', primary: '#17627A', primaryPressed: '#104B5E',
      onPrimary: '#FFFFFF', accent: '#A84C3D', accentPressed: '#84372C', onAccent: '#FFFFFF',
      accentMuted: '#F5E2DE', border: '#CDDCE1', borderStrong: '#9CB4BC', focus: '#8B321F',
      disabled: '#D8E2E5', disabledText: '#63777E', success: '#216A55', successSurface: '#DDF0E9',
      warning: '#79431E', warningSurface: '#F6E7D8', progressTrack: '#D4E4E8', selection: '#DDEEF3',
      footerBackground: '#142A33', footerText: '#FFFFFF', footerMuted: '#C1D2D8', heroMuted: '#D7EBF0',
      heroDecoration: '#5B91A2', heroDecorationStrong: '#14556A',
    },
    dark: {
      background: '#0D171C', backgroundMuted: '#132229', surface: '#172830', surfaceMuted: '#1C3039',
      text: '#EFF7F9', heading: '#EFF7F9', mutedText: '#B2C8CE', primary: '#75C6DF', primaryPressed: '#9AD8E9',
      onPrimary: '#08212A', accent: '#F2A08F', accentPressed: '#FFC0B2', onAccent: '#2B0F09',
      accentMuted: '#3E2926', border: '#344B55', borderStrong: '#5D7883', focus: '#FFB4A3',
      disabled: '#2C3A40', disabledText: '#98AAB0', success: '#80D4B5', successSurface: '#16372D',
      warning: '#F2BD83', warningSurface: '#3D2E20', progressTrack: '#2E4650', selection: '#214757',
      footerBackground: '#081014', footerText: '#FFFFFF', footerMuted: '#B8CCD2', heroMuted: '#D9EEF3',
      heroDecoration: '#619CB0', heroDecorationStrong: '#104D61',
    },
  },
  amber: {
    light: {
      background: '#F7F1E6', backgroundMuted: '#ECE1CF', surface: '#FFFFFF', surfaceMuted: '#FCF8F1',
      text: '#332516', heading: '#332516', mutedText: '#6E5B45', primary: '#7A4B10', primaryPressed: '#5D3608',
      onPrimary: '#FFFFFF', accent: '#A73E2B', accentPressed: '#812C1D', onAccent: '#FFFFFF',
      accentMuted: '#F4DFD7', border: '#E0D2BD', borderStrong: '#B8A486', focus: '#92321F',
      disabled: '#E2DBD0', disabledText: '#756B5C', success: '#35633A', successSurface: '#E4EFE2',
      warning: '#78420B', warningSurface: '#F6E5C7', progressTrack: '#E6DAC6', selection: '#F0E1C6',
      footerBackground: '#332516', footerText: '#FFFFFF', footerMuted: '#D9CCBC', heroMuted: '#F1E3CE',
      heroDecoration: '#A27A43', heroDecorationStrong: '#6A410C',
    },
    dark: {
      background: '#19130D', backgroundMuted: '#251C12', surface: '#2B2116', surfaceMuted: '#332719',
      text: '#FBF4EA', heading: '#FBF4EA', mutedText: '#D2C1AA', primary: '#E6B25F', primaryPressed: '#F2C981',
      onPrimary: '#2A1902', accent: '#F29B84', accentPressed: '#FFB9A7', onAccent: '#2C0E08',
      accentMuted: '#432720', border: '#50402D', borderStrong: '#7C674C', focus: '#FFB39F',
      disabled: '#3A332A', disabledText: '#AA9E8F', success: '#9BD09D', successSurface: '#203523',
      warning: '#F2C06E', warningSurface: '#46331A', progressTrack: '#493A28', selection: '#51401F',
      footerBackground: '#100C08', footerText: '#FFFFFF', footerMuted: '#D4C6B4', heroMuted: '#F6E7D1',
      heroDecoration: '#B58B4A', heroDecorationStrong: '#6D460C',
    },
  },
  plum: {
    light: {
      background: '#F5F0F5', backgroundMuted: '#E9DFE9', surface: '#FFFFFF', surfaceMuted: '#FAF7FA',
      text: '#302033', heading: '#302033', mutedText: '#6C586F', primary: '#69416F', primaryPressed: '#513057',
      onPrimary: '#FFFFFF', accent: '#9B4A35', accentPressed: '#793624', onAccent: '#FFFFFF',
      accentMuted: '#F2E0DB', border: '#DED1DF', borderStrong: '#B8A3BA', focus: '#873820',
      disabled: '#DFD8E0', disabledText: '#736976', success: '#356448', successSurface: '#E2EFE7',
      warning: '#75411F', warningSurface: '#F4E4D7', progressTrack: '#E3D8E4', selection: '#EADDEC',
      footerBackground: '#302033', footerText: '#FFFFFF', footerMuted: '#D6C8D8', heroMuted: '#EEDFF0',
      heroDecoration: '#947099', heroDecorationStrong: '#5D3763',
    },
    dark: {
      background: '#171018', backgroundMuted: '#221724', surface: '#291D2B', surfaceMuted: '#322236',
      text: '#FAF2FB', heading: '#FAF2FB', mutedText: '#D0BCD3', primary: '#CAA0D0', primaryPressed: '#DDBCE2',
      onPrimary: '#28132B', accent: '#F0A08B', accentPressed: '#FFBEAC', onAccent: '#2B0F08',
      accentMuted: '#432822', border: '#4A394D', borderStrong: '#735C77', focus: '#FFB6A3',
      disabled: '#39313A', disabledText: '#A79BA9', success: '#94D1A9', successSurface: '#203628',
      warning: '#F0B988', warningSurface: '#44301F', progressTrack: '#433247', selection: '#4A3150',
      footerBackground: '#0F0A10', footerText: '#FFFFFF', footerMuted: '#D0C1D2', heroMuted: '#F0E0F2',
      heroDecoration: '#A17AA6', heroDecorationStrong: '#603867',
    },
  },
};

export const textSizeScales: Record<TextSizeChoice, number> = {
  small: 0.9,
  normal: 1,
  large: 1.15,
  'extra-large': 1.3,
};

export const fontFamilyPresets: Record<FontFamilyChoice, Omit<TypographySettings, 'scale'>> = {
  'system-sans': { fontFamily: undefined, letterSpacing: 0 },
  serif: { fontFamily: 'serif', letterSpacing: 0 },
  readable: { fontFamily: 'Arial', letterSpacing: 0.2 },
};

export function createDefaultSettings(): AppearanceSettings {
  return {
    language: 'en',
    mode: 'light',
    colorTheme: 'amber',
    fontFamily: 'system-sans',
    textSize: 'large',
  };
}

export function resolveTypography(
  fontFamily: FontFamilyChoice,
  textSize: TextSizeChoice,
): TypographySettings {
  return {
    ...fontFamilyPresets[fontFamily],
    scale: textSizeScales[textSize],
  };
}

export function updateAppearanceSettings(
  current: AppearanceSettings,
  updates: Partial<AppearanceSettings>,
): AppearanceSettings {
  return { ...current, ...updates };
}
