import assert from 'node:assert/strict';
import test from 'node:test';

import { canonicalArchetypes } from '../src/features/archetypes/data/archetypes.ts';
import {
  adaptiveQuestionBank,
  allAssessmentQuestions,
  fixedAssessmentQuestions,
} from '../src/features/assessment/data/questions.ts';
import {
  answerCurrentAssessmentQuestion,
  completeAssessmentWithOptionSelector,
  createAssessmentSession,
  getCurrentAssessmentQuestion,
} from '../src/features/assessment/services/assessmentSession.ts';
import { updateAppearanceSettings } from '../src/settings/appearancePresets.ts';
import {
  appearanceStorageKey,
  persistAppearanceSettings,
  restoreAppearanceSettings,
} from '../src/settings/appearanceStorage.ts';
import { getTranslation, translations } from '../src/i18n/translations.ts';

const defaults = {
  language: 'en', mode: 'light', colorTheme: 'amber',
  fontFamily: 'system-sans', textSize: 'large',
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

function answerUntil(answerCount) {
  let session = createAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = getCurrentAssessmentQuestion(session);
    session = answerCurrentAssessmentQuestion(session, question.id, question.options[0].id);
  }
  return session;
}

test('Greek and English dictionaries have identical populated leaf keys', () => {
  assert.deepEqual(leafPaths(translations.el), leafPaths(translations.en));
  assertPopulated(translations.el, 'el');
  assertPopulated(translations.en, 'en');
});

test('neither localization exposes future-feature, confidence, ranking, or hidden trait terminology', () => {
  const copy = stringLeaves(translations).join('\n');
  assert.doesNotMatch(copy, /coming\s+soon|confidence|Προσεχώς/i);
  assert.doesNotMatch(copy, /Big Five|HEXACO|\bDISC\b|neuroticism|conscientiousness|extraversion|agreeableness|emotional stability/i);
});

test('all Home content resolves in both languages and describes the 25-question result accurately', () => {
  for (const language of ['el', 'en']) {
    const home = getTranslation(language).home;
    assertPopulated(home, `${language}.home`);
    assert.equal(Object.keys(home.features).length, 3);
  }
  assert.match(translations.en.home.features.discovery.description, /twenty-five/i);
  assert.match(translations.el.home.features.discovery.description, /είκοσι πέντε/u);
});

test('all 23 fixed and ten adaptive questions resolve with four options in both languages', () => {
  assert.equal(fixedAssessmentQuestions.length, 23);
  assert.equal(adaptiveQuestionBank.length, 10);
  assert.equal(allAssessmentQuestions.length, 33);
  assert.equal(allAssessmentQuestions.flatMap(({ options }) => options).length, 132);

  const expectedQuestionIds = allAssessmentQuestions.map(({ id }) => id);
  const expectedOptionIds = allAssessmentQuestions.flatMap(({ options }) => options.map(({ id }) => id));
  for (const language of ['el', 'en']) {
    const assessment = getTranslation(language).assessment;
    assert.deepEqual(Object.keys(assessment.questions), expectedQuestionIds);
    assert.deepEqual(Object.keys(assessment.options), expectedOptionIds);
    for (const question of allAssessmentQuestions) {
      assert.ok(assessment.questions[question.id]);
      assert.equal(question.options.length, 4);
      for (const option of question.options) assert.ok(assessment.options[option.id]);
    }
  }
});

test('the exact instinctive introduction and minimal result labels resolve in English and Greek', () => {
  assert.equal(
    translations.en.assessment.introduction,
    'Answer instinctively. Choose what fits you best without thinking about it too much.',
  );
  assert.equal(
    translations.el.assessment.introduction,
    'Απάντησε αυθόρμητα. Διάλεξε αυτό που σου ταιριάζει περισσότερο, χωρίς να το σκεφτείς πολύ.',
  );
  assert.deepEqual(translations.en.results, {
    primaryAnimal: 'Primary animal',
    secondaryAnimal: 'Secondary animal',
    restart: 'Take it again',
    restartHint: 'Clears this assessment and starts again from question one',
  });
  assert.deepEqual(translations.el.results, {
    primaryAnimal: 'Πρωτεύον ζώο',
    secondaryAnimal: 'Δευτερεύον ζώο',
    restart: 'Κάνε το ξανά',
    restartHint: 'Διαγράφει αυτή την αξιολόγηση και ξεκινά ξανά από την πρώτη ερώτηση',
  });
});

test('assessment copy avoids animal coding, absolute answers, and prohibited sensitive topics', () => {
  const assessmentCopy = [
    ...Object.values(translations.en.assessment.questions),
    ...Object.values(translations.en.assessment.options),
    ...Object.values(translations.el.assessment.questions),
    ...Object.values(translations.el.assessment.options),
  ].join('\n');
  assert.doesNotMatch(assessmentCopy, /\b(wolf|owl|eagle|dolphin|bear|lion|fox|panther|elephant|horse|turtle|octopus)\b/i);
  assert.doesNotMatch(assessmentCopy, /\b(always|never|everyone|nobody)\b/i);
  assert.doesNotMatch(assessmentCopy, /panic|manipulat|trauma|self-harm|abuse|illegal|medical history|political|religion|sexual|employment suitability/i);
});

test('English and Greek use identical language-neutral question and option IDs for scoring', () => {
  const englishRun = completeAssessmentWithOptionSelector((question) => {
    assert.ok(translations.en.assessment.questions[question.id]);
    const option = question.options[1];
    assert.ok(translations.en.assessment.options[option.id]);
    return option.id;
  });
  const greekRun = completeAssessmentWithOptionSelector((question) => {
    assert.ok(translations.el.assessment.questions[question.id]);
    const option = question.options[1];
    assert.ok(translations.el.assessment.options[option.id]);
    return option.id;
  });
  assert.deepEqual(greekRun, englishRun);
});

test('all twelve localized catalog names remain available for minimal results', () => {
  for (const language of ['el', 'en']) {
    const content = getTranslation(language);
    for (const archetype of canonicalArchetypes) {
      assertPopulated(content.animals.records[archetype.id]);
      assert.ok(content.animals.records[archetype.id].name.length > 0);
    }
  }
});

test('How It Works, Settings, header, footer, and minimal result copy resolve fully', () => {
  for (const language of ['el', 'en']) {
    const content = getTranslation(language);
    assertPopulated(content.howItWorks);
    assertPopulated(content.settings);
    assertPopulated(content.header);
    assertPopulated(content.footer);
    assert.deepEqual(Object.keys(content.results), [
      'primaryAnimal', 'secondaryAnimal', 'restart', 'restartHint',
    ]);
  }
});

test('user-facing guidance does not reveal which questions use adaptive selection', () => {
  const englishHowItWorks = JSON.stringify(translations.en.howItWorks);
  const greekHowItWorks = JSON.stringify(translations.el.howItWorks);
  assert.doesNotMatch(englishHowItWorks, /adaptive|tailored|final two|closest (animal )?profiles/i);
  assert.doesNotMatch(greekHowItWorks, /προσαρμοσμέν|τελευταίες δύο|επιλέγονται|κοντινότερα ζωικά προφίλ/i);
});

test('valid content never falls back to a raw translation key', () => {
  assert.throws(() => getTranslation('fr'), /Missing application translations/);
  for (const content of Object.values(translations)) assertPopulated(content);
});

test('language content contains only documented cross-language exceptions', () => {
  const englishGreekStrings = stringLeaves(translations.en).filter((value) => /[Α-Ωα-ω]/u.test(value));
  assert.deepEqual(englishGreekStrings, ['Ελληνικά']);

  const allowedGreekModeTerms = new Set([
    'AI', 'Animals', 'Ecosystem', 'Feedback', 'Markellos', 'Within',
    'analytics', 'current', 'email', 'name', 'total',
  ]);
  const latinTerms = stringLeaves(translations.el).flatMap((value) => value.match(/[A-Za-z]+/g) ?? []);
  for (const term of latinTerms) {
    assert.ok(allowedGreekModeTerms.has(term), `Unexpected English term in Greek content: ${term}`);
  }
});

test('switching language preserves answers, position, adaptive selection, and unfinished scoring state', () => {
  const assessment = answerUntil(24);
  const state = { appearance: defaults, assessment };
  const next = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { language: 'el' }),
  };
  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.answers, assessment.answers);
  assert.strictEqual(next.assessment.adaptiveQuestionIds, assessment.adaptiveQuestionIds);
  assert.equal(next.assessment.answers.length, 24);
  assert.equal(next.assessment.result, null);
});

test('switching language preserves a completed primary and secondary result', () => {
  const assessment = completeAssessmentWithOptionSelector((question) => question.options[2].id);
  const state = { appearance: defaults, assessment };
  const next = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { language: 'el' }),
  };
  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.result, assessment.result);
  assert.notEqual(next.assessment.result.primaryId, next.assessment.result.secondaryId);
});

test('manual language selection persists and invalid stored language falls back', () => {
  const storage = createMemoryStorage();
  const selected = updateAppearanceSettings(defaults, { language: 'el' });
  persistAppearanceSettings(storage, selected);
  assert.deepEqual(restoreAppearanceSettings(storage, defaults), selected);
  const invalidStorage = createMemoryStorage(JSON.stringify({ ...defaults, language: 'fr' }));
  assert.deepEqual(restoreAppearanceSettings(invalidStorage, defaults), defaults);
});
