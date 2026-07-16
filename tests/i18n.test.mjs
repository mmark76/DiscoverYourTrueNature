import assert from 'node:assert/strict';
import test from 'node:test';

import { animals } from '../src/features/animals/data/animals.ts';
import {
  adaptiveQuestionBank,
  allAssessmentQuestions,
  fixedAssessmentQuestions,
} from '../src/features/assessment/data/questions.ts';
import {
  createRankingDraftFromRanks,
} from '../src/features/assessment/services/assessmentFixtures.ts';
import {
  answerCurrentAssessmentQuestion,
  createAssessmentSession,
  getCurrentAssessmentQuestion,
} from '../src/features/assessment/services/assessmentSession.ts';
import { updateAppearanceSettings } from '../src/settings/appearancePresets.ts';
import {
  appearanceStorageKey,
  persistAppearanceSettings,
  restoreAppearanceSettings,
} from '../src/settings/appearanceStorage.ts';
import { formatTranslation, getTranslation, translations } from '../src/i18n/translations.ts';

const defaults = {
  language: 'en', mode: 'light', colorTheme: 'amber',
  fontFamily: 'system-sans', textSize: 'large',
};

const expectedAnimalIds = [
  'raven', 'octopus', 'lion', 'fox',
  'elephant', 'deer', 'dolphin', 'otter',
  'beaver', 'dog', 'wolf', 'penguin',
  'falcon', 'swan', 'cheetah', 'peacock',
];

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
    assert.ok(question);
    session = answerCurrentAssessmentQuestion(
      session,
      question.id,
      createRankingDraftFromRanks(question, [4, 3, 1, 2]),
    );
  }
  return session;
}

test('Greek and English dictionaries have identical populated leaf keys', () => {
  assert.deepEqual(leafPaths(translations.el), leafPaths(translations.en));
  assertPopulated(translations.el, 'el');
  assertPopulated(translations.en, 'en');
});

test('all twenty fixed and sixteen adaptive candidates resolve with four options in both languages', () => {
  assert.equal(fixedAssessmentQuestions.length, 20);
  assert.equal(adaptiveQuestionBank.length, 16);
  assert.equal(allAssessmentQuestions.length, 36);
  assert.equal(allAssessmentQuestions.flatMap(({ options }) => options).length, 144);

  const expectedQuestionIds = allAssessmentQuestions.map(({ id }) => id);
  const expectedOptionIds = allAssessmentQuestions.flatMap(({ options }) => options.map(({ id }) => id));
  for (const language of ['el', 'en']) {
    const assessment = getTranslation(language).assessment;
    assert.deepEqual(Object.keys(assessment.questions), expectedQuestionIds);
    assert.deepEqual(Object.keys(assessment.options), expectedOptionIds);
    for (const question of allAssessmentQuestions) {
      assertPopulated(assessment.questions[question.id], `${language}.${question.id}`);
      assert.equal(question.options.length, 4);
      for (const option of question.options) {
        assertPopulated(assessment.options[option.id], `${language}.${option.id}`);
      }
    }
  }
});

test('ranking guide and interaction feedback are complete and natural in both languages', () => {
  assert.deepEqual(translations.en.assessment.rankingGuide, {
    1: 'Describes me least',
    2: 'Describes me somewhat',
    3: 'Describes me quite well',
    4: 'Describes me most',
  });
  assert.deepEqual(translations.el.assessment.rankingGuide, {
    1: 'Με χαρακτηρίζει λιγότερο',
    2: 'Με χαρακτηρίζει κάπως',
    3: 'Με χαρακτηρίζει αρκετά',
    4: 'Με χαρακτηρίζει περισσότερο',
  });

  for (const language of ['el', 'en']) {
    const copy = translations[language].assessment;
    for (const key of [
      'rankingGuideTitle', 'rankingGroupLabel', 'rankControlLabel', 'rankControlHint',
      'rankAssignedAnnouncement', 'rankMovedAnnouncement', 'rankSwappedAnnouncement',
      'rankingComplete', 'rankingIncomplete', 'incompleteError',
      'back', 'backHint', 'continue', 'continueHint', 'finish', 'finishHint',
    ]) assertPopulated(copy[key], `${language}.assessment.${key}`);
    assert.match(copy.rankControlLabel, /\{rank\}/);
    assert.match(copy.rankControlLabel, /\{meaning\}/);
    assert.match(copy.rankingGroupLabel, /\{statement\}/);
  }
});

test('question and option copy is behavioral, animal-neutral, and free of prohibited sensitive topics', () => {
  const assessmentCopy = [
    ...Object.values(translations.en.assessment.questions),
    ...Object.values(translations.en.assessment.options),
    ...Object.values(translations.el.assessment.questions),
    ...Object.values(translations.el.assessment.options),
  ].join('\n');
  assert.doesNotMatch(
    assessmentCopy,
    /\b(raven|octopus|lion|fox|elephant|deer|dolphin|otter|beaver|dog|wolf|penguin|falcon|swan|cheetah|peacock)\b/i,
  );
  assert.doesNotMatch(
    assessmentCopy,
    /\b(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)\b/,
  );
  assert.doesNotMatch(assessmentCopy, /\b(always|never|everyone|nobody)\b/i);
  assert.doesNotMatch(
    assessmentCopy,
    /panic|manipulat|trauma|self-harm|abuse|illegal|medical history|political|religion|sexual|employment suitability/i,
  );
});

test('English and Greek share the same language-neutral ranking route and result', () => {
  function completeUsing(language) {
    let session = createAssessmentSession();
    while (!session.result) {
      const question = getCurrentAssessmentQuestion(session);
      assert.ok(translations[language].assessment.questions[question.id]);
      for (const option of question.options) {
        assert.ok(translations[language].assessment.options[option.id]);
      }
      session = answerCurrentAssessmentQuestion(
        session,
        question.id,
        createRankingDraftFromRanks(question, [2, 4, 3, 1]),
      );
    }
    return session;
  }
  assert.deepEqual(completeUsing('el'), completeUsing('en'));
});

test('all sixteen localized animal records contain the complete animal-first public shape', () => {
  const expectedKeys = [
    'blindSpots', 'decisions', 'description', 'information', 'interaction',
    'metaphor', 'name', 'organization', 'strengths', 'tagline',
  ];
  assert.deepEqual(animals.map(({ id }) => id), expectedAnimalIds);
  for (const language of ['el', 'en']) {
    const content = getTranslation(language);
    assert.deepEqual(Object.keys(content.animals.records), expectedAnimalIds);
    for (const animal of animals) {
      const record = content.animals.records[animal.id];
      assert.deepEqual(Object.keys(record).sort(), expectedKeys);
      assertPopulated(record, `${language}.animals.records.${animal.id}`);
      assert.ok(record.strengths.length >= 2);
      assert.ok(record.blindSpots.length >= 2);
      assert.equal('code' in record, false);
      assert.equal('title' in record, false);
      assert.equal('personalityType' in record, false);
    }
  }
});

test('Home accurately summarizes 20 fixed plus 5 adaptive ranked questions and sixteen animals', () => {
  for (const language of ['el', 'en']) {
    const home = getTranslation(language).home;
    assertPopulated(home, `${language}.home`);
    assert.equal(Object.keys(home.features).length, 3);
    assert.equal(home.highlights.length, 4);
    const text = stringLeaves(home).join(' ');
    assert.match(text, /25|twenty-five|είκοσι πέντε/i);
    assert.match(text, /20|twenty|είκοσι/i);
    assert.match(text, /5|five|πέντε/i);
    assert.match(text, /16|sixteen|δεκαέξι/i);
  }
});

test('How It Works explains ranking, first twenty, final five, local calculation, and symbolic limits', () => {
  const english = stringLeaves(translations.en.howItWorks).join(' ');
  const greek = stringLeaves(translations.el.howItWorks).join(' ');
  assert.match(english, /four statements/i);
  assert.match(english, /rank/i);
  assert.match(english, /20|twenty/i);
  assert.match(english, /final (?:five|5)|5 adaptive/i);
  assert.match(english, /primary/i);
  assert.match(english, /secondary/i);
  assert.match(english, /local|device/i);
  assert.match(english, /symbol|metaphor/i);
  assert.match(english, /not a psychological diagnosis|not.*scientifically validated/i);
  assert.match(greek, /τέσσερις|4/u);
  assert.match(greek, /κατάταξ|βαθμολόγ/u);
  assert.match(greek, /20|είκοσι/u);
  assert.match(greek, /5|πέντε/u);
  assert.match(greek, /πρωτεύον|κύριο/u);
  assert.match(greek, /δευτερεύον/u);
  assert.match(greek, /τοπικά|συσκευή/u);
  assert.match(greek, /συμβολ|μεταφορ/u);
  assert.doesNotMatch(`${english}\n${greek}`, /0\.75|root-mean-square|euclidean|pole total|distance table/i);
});

test('result, catalogue, settings, header, footer, and analytics copy resolve fully', () => {
  const expectedResultKeys = [
    'animalMetaphor', 'behaviouralTendencies', 'catalogue', 'catalogueHint',
    'closePatterns', 'decisionStyle', 'disclaimer', 'eyebrow', 'informationStyle',
    'interactionStyle', 'organizationStyle', 'possibleBlindSpots', 'primaryAnimal',
    'relationship', 'relationshipDescription', 'restart', 'restartHint',
    'revealAccessibilityLabel', 'secondaryAnimal', 'title', 'typicalStrengths',
  ];
  for (const language of ['el', 'en']) {
    const content = getTranslation(language);
    assertPopulated(content.results);
    assertPopulated(content.animals);
    assertPopulated(content.settings);
    assertPopulated(content.header);
    assertPopulated(content.footer);
    assertPopulated(content.analyticsConsent);
    assert.deepEqual(Object.keys(content.results).sort(), expectedResultKeys);
  }
});

test('the result relates each specific primary and secondary animal through their qualities', () => {
  for (const language of ['el', 'en']) {
    const template = translations[language].results.relationshipDescription;
    assert.deepEqual(
      [...template.matchAll(/\{([a-zA-Z]+)\}/g)].map((match) => match[1]).sort(),
      ['primary', 'primaryStrength', 'secondary', 'secondaryStrength'],
    );
    const rendered = formatTranslation(template, {
      primary: 'PRIMARY_ANIMAL',
      primaryStrength: 'PRIMARY_QUALITY',
      secondary: 'SECONDARY_ANIMAL',
      secondaryStrength: 'SECONDARY_QUALITY',
    });
    assert.match(rendered, /PRIMARY_ANIMAL/);
    assert.match(rendered, /PRIMARY_QUALITY/);
    assert.match(rendered, /SECONDARY_ANIMAL/);
    assert.match(rendered, /SECONDARY_QUALITY/);
    assert.doesNotMatch(rendered, /\{[a-zA-Z]+\}/);
  }
});

test('the exact entertainment disclaimer resolves in English and Greek', () => {
  const english = 'An entertainment self-discovery experience. The animals are used symbolically. This is not a psychological diagnosis or a scientifically validated assessment.';
  const greek = 'Ψυχαγωγική εμπειρία αυτογνωσίας. Τα ζώα χρησιμοποιούνται συμβολικά. Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονικά σταθμισμένη αξιολόγηση.';
  assert.equal(translations.en.results.disclaimer, english);
  assert.equal(translations.en.howItWorks.disclaimer, english);
  assert.equal(translations.el.results.disclaimer, greek);
  assert.equal(translations.el.howItWorks.disclaimer, greek);
});

test('valid content never falls back to a raw translation key', () => {
  assert.throws(() => getTranslation('fr'), /Missing application translations/);
  for (const content of Object.values(translations)) assertPopulated(content);
});

test('language content contains only documented cross-language exceptions', () => {
  const englishGreekStrings = stringLeaves(translations.en).filter((value) => /[Α-Ωα-ω]/u.test(value));
  assert.deepEqual([...new Set(englishGreekStrings)], ['Ελληνικά']);

  const allowedGreekModeTerms = new Set([
    'Animals', 'Ecosystem', 'English', 'Feedback', 'Markellos', 'Within',
    'analytics', 'current', 'description', 'email', 'indicator', 'meaning', 'name',
    'previousRank', 'primary', 'primaryStrength', 'rank', 'secondary', 'secondaryStrength',
    'statement', 'total',
  ]);
  const latinTerms = stringLeaves(translations.el).flatMap((value) => value.match(/[A-Za-z]+/g) ?? []);
  for (const term of latinTerms) {
    assert.ok(allowedGreekModeTerms.has(term), `Unexpected English term in Greek content: ${term}`);
  }
});

test('switching language preserves rankings, position, adaptive selection, and unfinished state', () => {
  const assessment = answerUntil(22);
  const state = { appearance: defaults, assessment };
  const next = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { language: 'el' }),
  };
  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.answers, assessment.answers);
  assert.strictEqual(next.assessment.adaptiveQuestionIds, assessment.adaptiveQuestionIds);
  assert.equal(next.assessment.answers.length, 22);
  assert.equal(next.assessment.result, null);
});

test('switching language preserves a completed primary and secondary result', () => {
  const assessment = answerUntil(25);
  const state = { appearance: defaults, assessment };
  const next = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { language: 'el' }),
  };
  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.result, assessment.result);
  assert.notEqual(next.assessment.result.primaryTypeId, next.assessment.result.secondaryTypeId);
});

test('manual language selection persists and invalid stored language falls back', () => {
  const storage = createMemoryStorage();
  const selected = updateAppearanceSettings(defaults, { language: 'el' });
  persistAppearanceSettings(storage, selected);
  assert.deepEqual(restoreAppearanceSettings(storage, defaults), selected);
  const invalidStorage = createMemoryStorage(JSON.stringify({ ...defaults, language: 'fr' }));
  assert.deepEqual(restoreAppearanceSettings(invalidStorage, defaults), defaults);
});
