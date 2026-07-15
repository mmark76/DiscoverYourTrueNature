import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { provisionalAnimals } from '../src/features/animals/data/animals.ts';
import { archetypes } from '../src/features/assessment/data/archetypes.ts';
import { assessmentQuestions } from '../src/features/assessment/data/questions.ts';
import { updateAppearanceSettings } from '../src/settings/appearancePresets.ts';
import {
  appearanceStorageKey,
  persistAppearanceSettings,
  restoreAppearanceSettings,
} from '../src/settings/appearanceStorage.ts';
import { getTranslation, translations } from '../src/i18n/translations.ts';

const scoringFixture = JSON.parse(
  readFileSync(new URL('./fixtures/scoring-regression.json', import.meta.url), 'utf8'),
);

const defaults = {
  language: 'en',
  mode: 'system',
  colorTheme: 'forest',
  fontFamily: 'system-sans',
  textSize: 'normal',
};

function createMemoryStorage(initialValue) {
  const values = new Map();
  if (initialValue !== undefined) values.set(appearanceStorageKey, initialValue);

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

function leafPaths(value, prefix = '') {
  if (typeof value === 'string') return [prefix];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => leafPaths(item, `${prefix}[${index}]`));
  }

  return Object.entries(value).flatMap(([key, item]) =>
    leafPaths(item, prefix ? `${prefix}.${key}` : key),
  );
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

  for (const [key, item] of Object.entries(value)) {
    assertPopulated(item, `${path}.${key}`);
  }
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

test('all Home content resolves in both languages', () => {
  for (const language of ['el', 'en']) {
    const home = getTranslation(language).home;
    assertPopulated(home, `${language}.home`);
    assert.equal(Object.keys(home.features).length, 6);
    for (const id of ['discovery', 'animals', 'how-it-works']) {
      assert.ok(home.features[id].actionLabel);
    }
  }
});

test('all ten questions and every option resolve in both languages', () => {
  assert.equal(assessmentQuestions.length, 10);
  for (const language of ['el', 'en']) {
    const assessment = getTranslation(language).assessment;
    for (const question of assessmentQuestions) {
      assert.ok(assessment.questions[question.id]);
      for (const option of question.options) assert.ok(assessment.options[option.id]);
    }
  }
});

test('all twelve animal records resolve in both languages', () => {
  assert.equal(provisionalAnimals.length, 12);
  for (const language of ['el', 'en']) {
    const records = getTranslation(language).animals.records;
    for (const animal of provisionalAnimals) assertPopulated(records[animal.id]);
  }
});

test('all five result archetypes resolve in both languages', () => {
  assert.equal(archetypes.length, 5);
  for (const language of ['el', 'en']) {
    const profiles = getTranslation(language).results.archetypes;
    for (const archetype of archetypes) assertPopulated(profiles[archetype.id]);
  }
});

test('How It Works, Settings, header, and footer resolve fully in both languages', () => {
  for (const language of ['el', 'en']) {
    const content = getTranslation(language);
    assertPopulated(content.howItWorks, `${language}.howItWorks`);
    assertPopulated(content.settings, `${language}.settings`);
    assertPopulated(content.header, `${language}.header`);
    assertPopulated(content.footer, `${language}.footer`);
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
    'Markides',
    'Within',
    'availability',
    'current',
    'email',
    'feedback',
    'name',
    'total',
  ]);
  const latinTerms = stringLeaves(translations.el).flatMap((value) => value.match(/[A-Za-z]+/g) ?? []);
  for (const term of latinTerms) {
    assert.ok(allowedGreekModeTerms.has(term), `Unexpected English term in Greek content: ${term}`);
  }
});

test('switching language preserves current question and accumulated scores', () => {
  const scores = { wolf: 4, owl: 1, eagle: 2, dolphin: 0, bear: 2 };
  const assessment = { questionIndex: 3, scores };
  const state = { appearance: defaults, assessment };
  const next = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { language: 'el' }),
  };

  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.scores, scores);
  assert.equal(next.assessment.questionIndex, 3);
});

test('switching language preserves a completed result', () => {
  const result = {
    primary: { id: 'wolf', symbol: '🐺' },
    secondary: { id: 'owl', symbol: '🦉' },
    scores: { wolf: 9, owl: 7, eagle: 3, dolphin: 2, bear: 4 },
  };
  const state = { appearance: defaults, result };
  const next = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { language: 'el' }),
  };

  assert.strictEqual(next.result, result);
  assert.equal(next.result.primary.id, 'wolf');
  assert.equal(next.result.secondary.id, 'owl');
});

test('manual language selection persists and invalid stored language falls back', () => {
  const storage = createMemoryStorage();
  const selected = updateAppearanceSettings(defaults, { language: 'el' });
  persistAppearanceSettings(storage, selected);
  assert.deepEqual(restoreAppearanceSettings(storage, defaults), selected);

  const invalidStorage = createMemoryStorage(JSON.stringify({ ...defaults, language: 'fr' }));
  assert.deepEqual(restoreAppearanceSettings(invalidStorage, defaults), defaults);
});

test('question IDs, option IDs, score maps, and result archetype IDs match the regression fixture', () => {
  const scoringDefinition = assessmentQuestions.map((question) => ({
    id: question.id,
    options: question.options.map((option) => ({ id: option.id, scores: option.scores })),
  }));

  assert.deepEqual(scoringDefinition, scoringFixture.questions);
  assert.deepEqual(archetypes.map(({ id }) => id), scoringFixture.resultArchetypeIds);
});

test('only five animals can score and seven future animals remain informational', () => {
  const scoringIds = new Set(archetypes.map(({ id }) => id));
  const available = provisionalAnimals.filter(({ availability }) => availability === 'prototype');
  const future = provisionalAnimals.filter(({ availability }) => availability === 'coming-soon');

  assert.deepEqual(available.map(({ id }) => id), [...scoringIds]);
  assert.equal(future.length, 7);
  for (const animal of future) assert.equal(scoringIds.has(animal.id), false);
});
