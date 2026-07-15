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

test('Forest Dark uses the refined calm semantic palette', () => {
  const dark = appearancePresets.forest.dark;
  assert.deepEqual(
    {
      background: dark.background,
      surface: dark.surface,
      surfaceMuted: dark.surfaceMuted,
      text: dark.text,
      mutedText: dark.mutedText,
      primary: dark.primary,
      selection: dark.selection,
      border: dark.border,
      accent: dark.accent,
      accentMuted: dark.accentMuted,
      focus: dark.focus,
    },
    {
      background: '#0F1713',
      surface: '#18241E',
      surfaceMuted: '#213128',
      text: '#F1F5F2',
      mutedText: '#A8B8B0',
      primary: '#86C9AA',
      selection: '#284A3B',
      border: '#354A40',
      accent: '#D08A5B',
      accentMuted: '#493426',
      focus: '#E0A078',
    },
  );
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
      ['onAccent/accent', colors.onAccent, colors.accent],
      ['text/warningSurface', colors.text, colors.warningSurface],
      ['footerText/footerBackground', colors.footerText, colors.footerBackground],
      ['footerMuted/footerBackground', colors.footerMuted, colors.footerBackground],
      ['heroMuted/primary', colors.heroMuted, colors.primary],
    ];

    for (const [name, foreground, background] of pairs) {
      assert.ok(
        contrastRatio(foreground, background) >= 4.5,
        `forest.${mode} ${name} must meet 4.5:1 contrast`,
      );
    }
  }
});

test('ordinary component text does not consume the orange accent token', () => {
  for (const path of sourceFiles('src')) {
    const source = readFileSync(path, 'utf8');
    assert.doesNotMatch(source, /color:\s*colors\.accent\b/, `${path} uses accent for text`);
  }

  const heroSource = readFileSync('src/features/home/components/HeroSection.tsx', 'utf8');
  assert.match(heroSource, /backgroundColor:\s*colors\.accent\b/);
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
