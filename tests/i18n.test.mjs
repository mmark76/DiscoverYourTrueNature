import assert from 'node:assert/strict';
import test from 'node:test';

import { canonicalArchetypes } from '../src/features/archetypes/data/archetypes.ts';
import { createEmptyDimensionScores } from '../src/features/assessment/services/scoreAssessment.ts';
import { assessmentQuestions } from '../src/features/assessment/data/questions.ts';
import { updateAppearanceSettings } from '../src/settings/appearancePresets.ts';
import { appearanceStorageKey, persistAppearanceSettings, restoreAppearanceSettings } from '../src/settings/appearanceStorage.ts';
import { getTranslation, translations } from '../src/i18n/translations.ts';

const defaults = { language: 'en', mode: 'light', colorTheme: 'amber', fontFamily: 'system-sans', textSize: 'large' };

function createMemoryStorage(initialValue) {
  const values = new Map();
  if (initialValue !== undefined) values.set(appearanceStorageKey, initialValue);
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

function leafPaths(value, prefix = '') {
  if (typeof value === 'string') return [prefix];
  if (Array.isArray(value)) return value.flatMap((item, index) => leafPaths(item, `${prefix}[${index}]`));
  return Object.entries(value).flatMap(([key, item]) => leafPaths(item, prefix ? `${prefix}.${key}` : key));
}

function assertPopulated(value, path = 'content') {
  if (typeof value === 'string') {
    assert.ok(value.trim().length > 0, `${path} is empty`);
    return;
  }
  if (Array.isArray(value)) {
    assert.ok(value.length > 0, `${path} is empty`);
    value.forEach((item, index) => assertPopulated(item, `${path}[${index}]`));
    return;
  }
  for (const [key, item] of Object.entries(value)) assertPopulated(item, `${path}.${key}`);
}

function stringLeaves(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringLeaves);
  return Object.values(value).flatMap(stringLeaves);
}

test('Greek and English dictionaries have identical populated leaf keys', () => {
  assert.deepEqual(leafPaths(translations.el), leafPaths(translations.en));
  assertPopulated(translations.el, 'el');
  assertPopulated(translations.en, 'en');
});
test('neither localization exposes future-feature or confidence copy', () => {
  const copy = stringLeaves(translations).join('\n');
  assert.doesNotMatch(copy, /coming\s+soon|confidence/i);
  assert.doesNotMatch(copy, /Προσεχώς/u);
});

test('all Home content resolves in both languages', () => {
  for (const language of ['el', 'en']) {
    const home = getTranslation(language).home;
    assertPopulated(home, `${language}.home`);
    assert.equal(Object.keys(home.features).length, 3);
  }
});

test('all 24 questions and 96 options resolve in both languages', () => {
  assert.equal(assessmentQuestions.length, 24);
  assert.equal(assessmentQuestions.flatMap(({ options }) => options).length, 96);
  for (const language of ['el', 'en']) {
    const assessment = getTranslation(language).assessment;
    for (const question of assessmentQuestions) {
      assert.ok(assessment.questions[question.id]);
      for (const option of question.options) assert.ok(assessment.options[option.id]);
    }
  }
});

test('all twelve catalog and complete result profiles resolve in both languages', () => {
  for (const language of ['el', 'en']) {
    const content = getTranslation(language);
    for (const archetype of canonicalArchetypes) {
      assertPopulated(content.animals.records[archetype.id]);
      const profile = content.results.archetypes[archetype.id];
      assertPopulated(profile);
      assert.equal(profile.strengths.length, 3);
      assert.equal(profile.watchOuts.length, 2);
    }
  }
});

test('How It Works, Settings, header, footer, and result ranking resolve fully', () => {
  for (const language of ['el', 'en']) {
    const content = getTranslation(language);
    assertPopulated(content.howItWorks);
    assertPopulated(content.settings);
    assertPopulated(content.header);
    assertPopulated(content.footer);
    assertPopulated(content.results.fullProfile);
    assertPopulated(content.results.matchStrength);
    assertPopulated(content.results.modelExplanation);
  }
});

test('valid content never falls back to a raw translation key', () => {
  assert.throws(() => getTranslation('fr'), /Missing application translations/);
  for (const content of Object.values(translations)) assertPopulated(content);
});

test('language content contains only the documented cross-language exceptions', () => {
  const englishGreekStrings = stringLeaves(translations.en).filter((value) => /[Α-Ωα-ω]/u.test(value));
  assert.deepEqual(englishGreekStrings, ['Ελληνικά']);

  const allowedGreekModeTerms = new Set([
    'AI',
    'Animals',
    'Ecosystem',
    'Feedback',
    'Markellos',
    'Within',
    'current',
    'email',
    'name',
    'score',
    'total',
  ]);
  const latinTerms = stringLeaves(translations.el).flatMap((value) => value.match(/[A-Za-z]+/g) ?? []);
  for (const term of latinTerms) {
    assert.ok(allowedGreekModeTerms.has(term), `Unexpected English term in Greek content: ${term}`);
  }
});

test('switching language preserves current question and dimension scores', () => {
  const scores = { ...createEmptyDimensionScores(), affiliation: 3, reasoning: -2 };
  const assessment = { questionIndex: 11, scores };
  const state = { appearance: defaults, assessment };
  const next = { ...state, appearance: updateAppearanceSettings(state.appearance, { language: 'el' }) };
  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.scores, scores);
  assert.equal(next.assessment.questionIndex, 11);
});

test('switching language preserves a complete twelve-match result', () => {
  const result = { primary: 'wolf', secondary: 'bear', matches: canonicalArchetypes.map(({ id }) => id) };
  const state = { appearance: defaults, result };
  const next = { ...state, appearance: updateAppearanceSettings(state.appearance, { language: 'el' }) };
  assert.strictEqual(next.result, result);
  assert.equal(next.result.matches.length, 12);
});

test('manual language selection persists and invalid stored language falls back', () => {
  const storage = createMemoryStorage();
  const selected = updateAppearanceSettings(defaults, { language: 'el' });
  persistAppearanceSettings(storage, selected);
  assert.deepEqual(restoreAppearanceSettings(storage, defaults), selected);
  const invalidStorage = createMemoryStorage(JSON.stringify({ ...defaults, language: 'fr' }));
  assert.deepEqual(restoreAppearanceSettings(invalidStorage, defaults), defaults);
});
