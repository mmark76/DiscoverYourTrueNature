import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
import {
  getSettingsLabel,
  settingsTranslations,
} from '../src/settings/settingsTranslations.ts';

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

test('every appearance preset contains all required semantic tokens', () => {
  for (const preset of Object.values(appearancePresets)) {
    for (const mode of ['light', 'dark']) {
      for (const token of requiredSemanticTokens) {
        assert.match(preset[mode][token], /^#[0-9A-F]{6}$/i);
      }
    }
  }
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
  assert.equal(getSettingsLabel('el', 'settings'), 'Ρυθμίσεις');
  assert.equal(getSettingsLabel('en', 'settings'), 'Settings');
  assert.equal(getSettingsLabel('el', 'readable'), 'Υψηλής αναγνωσιμότητας');
  assert.equal(getSettingsLabel('en', 'readable'), 'Highly Readable');
});

test('no raw settings translation key is exposed as translated content', () => {
  for (const [language, translations] of Object.entries(settingsTranslations)) {
    for (const [key, value] of Object.entries(translations)) {
      assert.ok(value.trim().length > 0, `${language}.${key} is empty`);
      assert.notEqual(value, key, `${language}.${key} exposes its raw key`);
    }
  }
});

test('assessment questions, archetypes, and scoring implementation remain unchanged', () => {
  const protectedFiles = {
    'src/features/assessment/data/questions.ts': 'c7398a989e9ac0bafa663dc6733128eac839901c00bcdb4066f73a561215a71f',
    'src/features/assessment/data/archetypes.ts': 'a63f7130b086b95db06fdc045579684f0c18d5d36ba0dddd382096a8016ad39c',
    'src/features/assessment/services/scoreAssessment.ts': '40abbaf3d6296d0a37aca7fb6b0cb02e4c6a3c4505edd5ee458a203957c6a66b',
  };

  for (const [path, expectedHash] of Object.entries(protectedFiles)) {
    const normalizedSource = readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
    const actualHash = createHash('sha256').update(normalizedSource).digest('hex');
    assert.equal(actualHash, expectedHash, `${path} changed unexpectedly`);
  }
});
