import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  appearancePresets,
  createDefaultSettings,
  resolveTypography,
  textSizeScales,
  updateAppearanceSettings,
} from '../src/settings/appearancePresets.ts';
import {
  appearanceStorageKey,
  normalizeStoredSettings,
  restoreAppearanceSettings,
} from '../src/settings/appearanceStorage.ts';
import { getTranslation, translations } from '../src/i18n/translations.ts';

const requiredSemanticTokens = [
  'background',
  'surface',
  'surfaceMuted',
  'text',
  'heading',
  'mutedText',
  'primary',
  'accent',
  'border',
  'focus',
  'disabled',
  'success',
  'warning',
];

const documentedDefaults = {
  language: 'en',
  mode: 'light',
  colorTheme: 'amber',
  fontFamily: 'system-sans',
  textSize: 'large',
};

function createMemoryStorage(initialValue) {
  const values = new Map();
  if (initialValue !== undefined) {
    values.set(appearanceStorageKey, initialValue);
  }

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

test('every appearance preset contains all required semantic tokens', () => {
  for (const preset of Object.values(appearancePresets)) {
    for (const mode of ['light', 'dark']) {
      for (const token of requiredSemanticTokens) {
        assert.match(preset[mode][token], /^#[0-9A-F]{6}$/i);
      }
    }
  }
});

test('the internal Forest theme uses the exact Warm Ivory Light and Dark palettes', () => {
  assert.deepEqual(appearancePresets.forest.light, {
    background: '#F3EBDD', backgroundMuted: '#EEE4D3', surface: '#FFFCF5', surfaceMuted: '#F8F2E7',
    text: '#26364A', heading: '#4A210E', mutedText: '#5D6879', primary: '#AD5200', primaryPressed: '#873409',
    onPrimary: '#FFFFFF', accent: '#A9430D', accentPressed: '#873409', onAccent: '#FFFFFF',
    accentMuted: '#FFF1D6', border: '#CBD5DF', borderStrong: '#AEBBC8', focus: '#C86400',
    disabled: '#DDD8CF', disabledText: '#68717C', success: '#55705E', successSurface: '#E8EFE9',
    warning: '#9A5A16', warningSurface: '#FFF0D8', progressTrack: '#E5DED1', selection: '#FFF0D2',
    footerBackground: '#FFFCF5', footerText: '#53657C', footerMuted: '#687589', heroMuted: '#F5E6CD',
    heroDecoration: '#E8C18C', heroDecorationStrong: '#C97924',
  });
  assert.deepEqual(appearancePresets.forest.dark, {
    background: '#1E1915', backgroundMuted: '#27201A', surface: '#30271F', surfaceMuted: '#392E25',
    text: '#DCE2EA', heading: '#F3D4B8', mutedText: '#AAB3C0', primary: '#E89A3D', primaryPressed: '#F0AE58',
    onPrimary: '#2D1807', accent: '#D9852D', accentPressed: '#E79B45', onAccent: '#2D1807',
    accentMuted: '#493421', border: '#51463B', borderStrong: '#746658', focus: '#F0AE58',
    disabled: '#3E3832', disabledText: '#9D968E', success: '#9AB5A0', successSurface: '#2D3930',
    warning: '#E4A55C', warningSurface: '#493421', progressTrack: '#463D34', selection: '#493621',
    footerBackground: '#18130F', footerText: '#D7DEE7', footerMuted: '#9EA8B5', heroMuted: '#4A321F',
    heroDecoration: '#8C5A2D', heroDecorationStrong: '#E8B779',
  });
});

test('Warm Ivory Light and Dark text roles meet WCAG AA contrast', () => {
  for (const mode of ['light', 'dark']) {
    const colors = appearancePresets.forest[mode];
    const pairs = [
      ['text/background', colors.text, colors.background],
      ['text/surface', colors.text, colors.surface],
      ['heading/background', colors.heading, colors.background],
      ['heading/surface', colors.heading, colors.surface],
      ['mutedText/background', colors.mutedText, colors.background],
      ['mutedText/surfaceMuted', colors.mutedText, colors.surfaceMuted],
      ['primary/surface', colors.primary, colors.surface],
      ['primary/selection', colors.primary, colors.selection],
      ['onPrimary/primary', colors.onPrimary, colors.primary],
      ['onAccent/accent', colors.onAccent, colors.accent],
      ['warning/warningSurface', colors.warning, colors.warningSurface],
      ['success/successSurface', colors.success, colors.successSurface],
      ['footerText/footerBackground', colors.footerText, colors.footerBackground],
      ['footerMuted/footerBackground', colors.footerMuted, colors.footerBackground],
      ['text/selection', colors.text, colors.selection],
      ['heading/selection', colors.heading, colors.selection],
    ];

    for (const [name, foreground, background] of pairs) {
      assert.ok(
        contrastRatio(foreground, background) >= 4.5,
        `forest.${mode} ${name} must meet 4.5:1 contrast`,
      );
    }
  }
});

test('components use semantic Warm Ivory roles without hard-coded legacy sage values', () => {
  const componentSources = sourceFiles('src')
    .filter((path) => path.endsWith('.tsx'))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
  assert.doesNotMatch(componentSources, /#[A-Fa-f0-9]{6}/, 'components must not hard-code palette colors');
  assert.doesNotMatch(
    componentSources,
    /#(?:F4F2EC|556C60|485F53|1B211E|A1B8AC|36443D)\b/i,
    'components must not hard-code former sage palette values',
  );
  const forestValues = JSON.stringify(appearancePresets.forest);
  assert.doesNotMatch(forestValues, /#(?:F4F2EC|556C60|485F53|1B211E|A1B8AC|36443D)\b/i);

  for (const path of [
    'src/features/home/components/HeroSection.tsx',
    'src/features/home/components/FeatureCard.tsx',
    'src/features/information/components/HowItWorksScreen.tsx',
    'src/features/results/components/ResultScreen.tsx',
  ]) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /backgroundColor:\s*colors\.primary\b/, `${path} must use primary actions`);
    assert.match(source, /color:\s*colors\.onPrimary\b/, `${path} must use onPrimary action text`);
  }

  const footer = readFileSync('src/shared/components/AppFooter.tsx', 'utf8');
  assert.match(footer, /backgroundColor:\s*colors\.footerBackground/);
  assert.match(footer, /color:\s*colors\.footerMuted/);
});

test('page and card headings use heading while body copy uses text', () => {
  const headingFiles = [
    'src/features/home/components/HeroSection.tsx',
    'src/features/home/components/FeatureCard.tsx',
    'src/features/home/components/HomeScreen.tsx',
    'src/features/assessment/components/AssessmentScreen.tsx',
    'src/features/animals/components/AnimalCard.tsx',
    'src/features/animals/components/AnimalsScreen.tsx',
    'src/features/information/components/HowItWorksScreen.tsx',
    'src/features/results/components/ResultScreen.tsx',
    'src/settings/components/SettingsScreen.tsx',
  ];
  for (const path of headingFiles) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /color:\s*colors\.heading\b/, `${path} must use heading`);
  }
  for (const path of [
    'src/features/home/components/HeroSection.tsx',
    'src/features/home/components/FeatureCard.tsx',
    'src/features/assessment/components/OptionButton.tsx',
    'src/features/animals/components/AnimalCard.tsx',
    'src/features/animals/components/AnimalsScreen.tsx',
    'src/features/information/components/HowItWorksScreen.tsx',
    'src/features/results/components/ResultScreen.tsx',
    'src/settings/components/SettingsScreen.tsx',
  ]) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /color:\s*colors\.text\b/, `${path} must retain body text`);
  }
});

test('navigation, cards, and settings controls use warm semantic selected states', () => {
  const header = readFileSync('src/shared/components/AppHeader.tsx', 'utf8');
  const cards = readFileSync('src/features/home/components/FeatureCard.tsx', 'utf8');
  const optionGroup = readFileSync('src/settings/components/SettingsOptionGroup.tsx', 'utf8');
  assert.match(header, /navButtonSelected:\s*\{[^}]*backgroundColor:\s*colors\.selection[^}]*borderColor:\s*colors\.primary/);
  assert.match(cards, /backgroundColor:\s*colors\.surface/);
  assert.match(cards, /borderColor:\s*colors\.border/);
  assert.match(optionGroup, /backgroundColor:\s*colors\.selection/);
});

test('Ocean, Amber, and Plum retain text-compatible heading tokens', () => {
  for (const themeName of ['ocean', 'amber', 'plum']) {
    for (const mode of ['light', 'dark']) {
      assert.equal(appearancePresets[themeName][mode].heading, appearancePresets[themeName][mode].text);
    }
  }
});

test('selected settings use a calm semantic surface', () => {
  const optionGroup = readFileSync('src/settings/components/SettingsOptionGroup.tsx', 'utf8');
  assert.match(optionGroup, /backgroundColor:\s*colors\.selection/);
});

test('stored valid settings are restored', () => {
  const storedSettings = {
    language: 'en',
    mode: 'dark',
    colorTheme: 'plum',
    fontFamily: 'serif',
    textSize: 'large',
  };
  const storage = createMemoryStorage(JSON.stringify(storedSettings));

  assert.deepEqual(restoreAppearanceSettings(storage, documentedDefaults), storedSettings);
});

test('new users receive defaults while saved preferences keep priority', () => {
  assert.deepEqual(restoreAppearanceSettings(createMemoryStorage(), documentedDefaults), documentedDefaults);

  const saved = {
    language: 'el',
    mode: 'dark',
    colorTheme: 'plum',
    fontFamily: 'readable',
    textSize: 'extra-large',
  };
  assert.deepEqual(
    restoreAppearanceSettings(createMemoryStorage(JSON.stringify(saved)), documentedDefaults),
    saved,
  );
});

test('invalid stored values fall back safely', () => {
  const invalid = {
    language: 'fr',
    mode: 'midnight',
    colorTheme: 'neon',
    fontFamily: 'remote-font',
    textSize: 'huge',
  };

  assert.deepEqual(normalizeStoredSettings(invalid, documentedDefaults), documentedDefaults);
  assert.deepEqual(
    restoreAppearanceSettings(createMemoryStorage('{invalid-json'), documentedDefaults),
    documentedDefaults,
  );
});

test('new users and Reset Appearance receive the documented defaults', () => {
  assert.deepEqual(createDefaultSettings(), documentedDefaults);

  const provider = readFileSync('src/settings/AppearanceProvider.tsx', 'utf8');
  const presets = readFileSync('src/settings/appearancePresets.ts', 'utf8');
  assert.match(provider, /resetSettings:\s*\(\) => setSettings\(createDefaultSettings\(\)\)/);
  assert.doesNotMatch(provider, /Intl\.DateTimeFormat|useColorScheme\(\).*language/s);
  assert.doesNotMatch(presets, /resolveDeviceLanguage|locale\?\s*:/);
});

test('switching appearance mode and color preserves assessment state', () => {
  const assessmentState = { questionIndex: 4, scores: { affiliation: 2, reasoning: -1 } };
  const state = { appearance: documentedDefaults, assessment: assessmentState };
  const nextState = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { mode: 'dark', colorTheme: 'ocean' }),
  };

  assert.strictEqual(nextState.assessment, assessmentState);
  assert.deepEqual(nextState.assessment, state.assessment);
});

test('switching font and text size preserves accumulated scores', () => {
  const accumulatedScores = {
    affiliation: 2,
    reasoning: -1,
    tempo: 3,
    structure: 0,
    influence: 1,
    exploration: -2,
    expression: 1,
    perspective: 2,
  };
  const state = { appearance: documentedDefaults, accumulatedScores };
  const nextState = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, {
      fontFamily: 'readable',
      textSize: 'extra-large',
    }),
  };

  assert.strictEqual(nextState.accumulatedScores, accumulatedScores);
});

test('all four text sizes resolve to valid typography scales', () => {
  assert.deepEqual(Object.keys(textSizeScales), ['small', 'normal', 'large', 'extra-large']);
  for (const textSize of Object.keys(textSizeScales)) {
    const typography = resolveTypography('system-sans', textSize);
    assert.ok(Number.isFinite(typography.scale));
    assert.ok(typography.scale > 0);
  }
});

test('light and dark variants exist for every color theme', () => {
  assert.deepEqual(Object.keys(appearancePresets), ['forest', 'ocean', 'amber', 'plum']);
  for (const preset of Object.values(appearancePresets)) {
    assert.ok(preset.light);
    assert.ok(preset.dark);
  }
});

test('settings labels resolve in Greek and English', () => {
  assert.equal(getTranslation('el').header.settings, 'Ρυθμίσεις');
  assert.equal(getTranslation('en').header.settings, 'Settings');
  assert.equal(getTranslation('el').settings.readable, 'Υψηλής αναγνωσιμότητας');
  assert.equal(getTranslation('en').settings.readable, 'Highly Readable');
  assert.equal(getTranslation('el').settings.forest, 'Ζεστό Κρεμ');
  assert.equal(getTranslation('en').settings.forest, 'Warm Ivory');
});

test('no raw settings translation key is exposed as translated content', () => {
  for (const [language, content] of Object.entries(translations)) {
    for (const [key, value] of Object.entries(content.settings)) {
      assert.ok(value.trim().length > 0, `${language}.${key} is empty`);
      assert.notEqual(value, key, `${language}.${key} exposes its raw key`);
    }
  }
});
