import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
  language: 'el',
  mode: 'system',
  colorTheme: 'forest',
  fontFamily: 'system-sans',
  textSize: 'normal',
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

test('Forest uses the exact soft sage Light and Dark semantic palettes', () => {
  assert.deepEqual(appearancePresets.forest.light, {
    background: '#F4F2EC', backgroundMuted: '#ECEDE8', surface: '#FAF9F5', surfaceMuted: '#F0F1ED',
    text: '#3D4843', mutedText: '#5F6A64', primary: '#556C60', primaryPressed: '#485F53',
    onPrimary: '#FFFFFF', accent: '#A39482', accentPressed: '#8E806F', onAccent: '#332E28',
    accentMuted: '#EEE8E0', border: '#D8DDD8', borderStrong: '#B8C1BB', focus: '#786B5B',
    disabled: '#D6D9D5', disabledText: '#5F6A64', success: '#526E5F', successSurface: '#E3EAE5',
    warning: '#6F6253', warningSurface: '#EEE8E0', progressTrack: '#E2E6E2', selection: '#E1E8E3',
    footerBackground: '#E8EBE7', footerText: '#3D4843', footerMuted: '#626C67', heroMuted: '#E8EEE9',
    heroDecoration: '#B8C8BF', heroDecorationStrong: '#81998C',
  });
  assert.deepEqual(appearancePresets.forest.dark, {
    background: '#1B211E', backgroundMuted: '#202824', surface: '#262E2A', surfaceMuted: '#2D3732',
    text: '#E5E9E6', mutedText: '#A6AEA9', primary: '#A1B8AC', primaryPressed: '#B5C8BE',
    onPrimary: '#24302A', accent: '#B5A692', accentPressed: '#C5B7A5', onAccent: '#2D2923',
    accentMuted: '#3A342D', border: '#3E4943', borderStrong: '#59655F', focus: '#B9AA96',
    disabled: '#343C38', disabledText: '#929B96', success: '#9DB6A8', successSurface: '#303D36',
    warning: '#B5A692', warningSurface: '#3A342D', progressTrack: '#39433E', selection: '#36443D',
    footerBackground: '#171C1A', footerText: '#E5E9E6', footerMuted: '#A5AEA9', heroMuted: '#DCE5E0',
    heroDecoration: '#667D72', heroDecorationStrong: '#B2C5BB',
  });
});

test('Forest Light and Dark text roles meet WCAG AA contrast', () => {
  for (const mode of ['light', 'dark']) {
    const colors = appearancePresets.forest[mode];
    const pairs = [
      ['text/background', colors.text, colors.background],
      ['text/surface', colors.text, colors.surface],
      ['mutedText/background', colors.mutedText, colors.background],
      ['mutedText/surfaceMuted', colors.mutedText, colors.surfaceMuted],
      ['primary/surface', colors.primary, colors.surface],
      ['primary/selection', colors.primary, colors.selection],
      ['onPrimary/primary', colors.onPrimary, colors.primary],
      ['warning/warningSurface', colors.warning, colors.warningSurface],
      ['success/successSurface', colors.success, colors.successSurface],
      ['footerText/footerBackground', colors.footerText, colors.footerBackground],
      ['footerMuted/footerBackground', colors.footerMuted, colors.footerBackground],
      ['text/selection', colors.text, colors.selection],
      ['mutedText/selection', colors.mutedText, colors.selection],
    ];

    for (const [name, foreground, background] of pairs) {
      assert.ok(
        contrastRatio(foreground, background) >= 4.5,
        `forest.${mode} ${name} must meet 4.5:1 contrast`,
      );
    }
  }
});

test('ordinary text, links, and action backgrounds do not consume accent', () => {
  for (const path of sourceFiles('src')) {
    const source = readFileSync(path, 'utf8');
    assert.doesNotMatch(source, /color:\s*colors\.accent\b/, `${path} uses accent for text`);
  }

  const componentSources = sourceFiles('src')
    .filter((path) => path.endsWith('.tsx'))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
  assert.doesNotMatch(componentSources, /button[^}]*backgroundColor:\s*colors\.accent\b/is);
  assert.doesNotMatch(componentSources, /#[A-Fa-f0-9]{6}/, 'components must not hard-code palette colors');

  for (const path of [
    'src/features/home/components/HeroSection.tsx',
    'src/features/information/components/HowItWorksScreen.tsx',
    'src/features/results/components/ResultScreen.tsx',
  ]) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /backgroundColor:\s*colors\.primary\b/, `${path} must use primary actions`);
    assert.match(source, /color:\s*colors\.onPrimary\b/, `${path} must use onPrimary action text`);
  }

  const externalLink = readFileSync('src/shared/components/ExternalTextLink.tsx', 'utf8');
  const footer = readFileSync('src/shared/components/AppFooter.tsx', 'utf8');
  assert.doesNotMatch(externalLink, /colors\.accent/);
  assert.doesNotMatch(footer, /colors\.accent/);
});

test('Coming Soon and selected states use calm semantic surfaces', () => {
  const badge = readFileSync('src/shared/components/StatusBadge.tsx', 'utf8');
  const optionGroup = readFileSync('src/settings/components/SettingsOptionGroup.tsx', 'utf8');
  const assessment = readFileSync('src/features/assessment/components/OptionButton.tsx', 'utf8');
  assert.match(badge, /backgroundColor:\s*colors\.warningSurface/);
  assert.match(optionGroup, /backgroundColor:\s*colors\.selection/);
  assert.match(assessment, /backgroundColor:\s*colors\.selection/);
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

test('reset defaults match the documented values and device locale', () => {
  assert.deepEqual(createDefaultSettings('el-CY'), documentedDefaults);
  assert.deepEqual(createDefaultSettings('en-US'), { ...documentedDefaults, language: 'en' });
});

test('switching appearance mode and color preserves assessment state', () => {
  const assessmentState = { questionIndex: 4, scores: { wolf: 5, owl: 2 } };
  const state = { appearance: documentedDefaults, assessment: assessmentState };
  const nextState = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { mode: 'dark', colorTheme: 'ocean' }),
  };

  assert.strictEqual(nextState.assessment, assessmentState);
  assert.deepEqual(nextState.assessment, state.assessment);
});

test('switching font and text size preserves accumulated scores', () => {
  const accumulatedScores = { wolf: 7, owl: 3, eagle: 1, dolphin: 2, bear: 4 };
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
});

test('no raw settings translation key is exposed as translated content', () => {
  for (const [language, content] of Object.entries(translations)) {
    for (const [key, value] of Object.entries(content.settings)) {
      assert.ok(value.trim().length > 0, `${language}.${key} is empty`);
      assert.notEqual(value, key, `${language}.${key} exposes its raw key`);
    }
  }
});

test('result calculation implementation remains unchanged', () => {
  const protectedFiles = {
    'src/features/assessment/services/scoreAssessment.ts': '40abbaf3d6296d0a37aca7fb6b0cb02e4c6a3c4505edd5ee458a203957c6a66b',
  };

  for (const [path, expectedHash] of Object.entries(protectedFiles)) {
    const normalizedSource = readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
    const actualHash = createHash('sha256').update(normalizedSource).digest('hex');
    assert.equal(actualHash, expectedHash, `${path} changed unexpectedly`);
  }
});
