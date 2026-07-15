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
      background: '#F4F2EC', backgroundMuted: '#ECEDE8', surface: '#FAF9F5', surfaceMuted: '#F0F1ED',
      text: '#3D4843', mutedText: '#5F6A64', primary: '#556C60', primaryPressed: '#485F53',
      onPrimary: '#FFFFFF', accent: '#A39482', accentPressed: '#8E806F', onAccent: '#332E28',
      accentMuted: '#EEE8E0', border: '#D8DDD8', borderStrong: '#B8C1BB', focus: '#786B5B',
      disabled: '#D6D9D5', disabledText: '#5F6A64', success: '#526E5F', successSurface: '#E3EAE5',
      warning: '#6F6253', warningSurface: '#EEE8E0', progressTrack: '#E2E6E2', selection: '#E1E8E3',
      footerBackground: '#E8EBE7', footerText: '#3D4843', footerMuted: '#626C67', heroMuted: '#E8EEE9',
      heroDecoration: '#B8C8BF', heroDecorationStrong: '#81998C',
    },
    dark: {
      background: '#1B211E', backgroundMuted: '#202824', surface: '#262E2A', surfaceMuted: '#2D3732',
      text: '#E5E9E6', mutedText: '#A6AEA9', primary: '#A1B8AC', primaryPressed: '#B5C8BE',
      onPrimary: '#24302A', accent: '#B5A692', accentPressed: '#C5B7A5', onAccent: '#2D2923',
      accentMuted: '#3A342D', border: '#3E4943', borderStrong: '#59655F', focus: '#B9AA96',
      disabled: '#343C38', disabledText: '#929B96', success: '#9DB6A8', successSurface: '#303D36',
      warning: '#B5A692', warningSurface: '#3A342D', progressTrack: '#39433E', selection: '#36443D',
      footerBackground: '#171C1A', footerText: '#E5E9E6', footerMuted: '#A5AEA9', heroMuted: '#DCE5E0',
      heroDecoration: '#667D72', heroDecorationStrong: '#B2C5BB',
    },
  },
  ocean: {
    light: {
      background: '#EEF4F6', backgroundMuted: '#DDE9ED', surface: '#FFFFFF', surfaceMuted: '#F5F9FA',
      text: '#142A33', mutedText: '#526A73', primary: '#17627A', primaryPressed: '#104B5E',
      onPrimary: '#FFFFFF', accent: '#A84C3D', accentPressed: '#84372C', onAccent: '#FFFFFF',
      accentMuted: '#F5E2DE', border: '#CDDCE1', borderStrong: '#9CB4BC', focus: '#8B321F',
      disabled: '#D8E2E5', disabledText: '#63777E', success: '#216A55', successSurface: '#DDF0E9',
      warning: '#79431E', warningSurface: '#F6E7D8', progressTrack: '#D4E4E8', selection: '#DDEEF3',
      footerBackground: '#142A33', footerText: '#FFFFFF', footerMuted: '#C1D2D8', heroMuted: '#D7EBF0',
      heroDecoration: '#5B91A2', heroDecorationStrong: '#14556A',
    },
    dark: {
      background: '#0D171C', backgroundMuted: '#132229', surface: '#172830', surfaceMuted: '#1C3039',
      text: '#EFF7F9', mutedText: '#B2C8CE', primary: '#75C6DF', primaryPressed: '#9AD8E9',
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
      text: '#332516', mutedText: '#6E5B45', primary: '#7A4B10', primaryPressed: '#5D3608',
      onPrimary: '#FFFFFF', accent: '#A73E2B', accentPressed: '#812C1D', onAccent: '#FFFFFF',
      accentMuted: '#F4DFD7', border: '#E0D2BD', borderStrong: '#B8A486', focus: '#92321F',
      disabled: '#E2DBD0', disabledText: '#756B5C', success: '#35633A', successSurface: '#E4EFE2',
      warning: '#78420B', warningSurface: '#F6E5C7', progressTrack: '#E6DAC6', selection: '#F0E1C6',
      footerBackground: '#332516', footerText: '#FFFFFF', footerMuted: '#D9CCBC', heroMuted: '#F1E3CE',
      heroDecoration: '#A27A43', heroDecorationStrong: '#6A410C',
    },
    dark: {
      background: '#19130D', backgroundMuted: '#251C12', surface: '#2B2116', surfaceMuted: '#332719',
      text: '#FBF4EA', mutedText: '#D2C1AA', primary: '#E6B25F', primaryPressed: '#F2C981',
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
      text: '#302033', mutedText: '#6C586F', primary: '#69416F', primaryPressed: '#513057',
      onPrimary: '#FFFFFF', accent: '#9B4A35', accentPressed: '#793624', onAccent: '#FFFFFF',
      accentMuted: '#F2E0DB', border: '#DED1DF', borderStrong: '#B8A3BA', focus: '#873820',
      disabled: '#DFD8E0', disabledText: '#736976', success: '#356448', successSurface: '#E2EFE7',
      warning: '#75411F', warningSurface: '#F4E4D7', progressTrack: '#E3D8E4', selection: '#EADDEC',
      footerBackground: '#302033', footerText: '#FFFFFF', footerMuted: '#D6C8D8', heroMuted: '#EEDFF0',
      heroDecoration: '#947099', heroDecorationStrong: '#5D3763',
    },
    dark: {
      background: '#171018', backgroundMuted: '#221724', surface: '#291D2B', surfaceMuted: '#322236',
      text: '#FAF2FB', mutedText: '#D0BCD3', primary: '#CAA0D0', primaryPressed: '#DDBCE2',
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

export function resolveDeviceLanguage(locale?: string): AppearanceSettings['language'] {
  const normalizedLocale = locale?.toLowerCase() ?? '';
  return normalizedLocale.startsWith('el') ? 'el' : 'en';
}

export function createDefaultSettings(locale?: string): AppearanceSettings {
  return {
    language: resolveDeviceLanguage(locale),
    mode: 'system',
    colorTheme: 'forest',
    fontFamily: 'system-sans',
    textSize: 'normal',
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
