import assert from 'node:assert/strict';
import test from 'node:test';

import { animals } from '../src/features/animals/data/animals.ts';
import {
  adaptiveQuestionBank,
  allAssessmentQuestions,
  fixedAssessmentQuestions,
} from '../src/features/assessment/data/questions.ts';
import {
  allShortAssessmentQuestions,
  shortFixedAssessmentQuestions,
  shortSeparatorQuestionBank,
} from '../src/features/assessment/data/shortQuestions.ts';
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
    const selected = question.options[session.currentQuestionIndex % 2];
    assert.ok(selected);
    session = answerCurrentAssessmentQuestion(session, question.id, selected.id);
  }
  return session;
}

test('Greek and English dictionaries have identical populated leaf keys', () => {
  assert.deepEqual(leafPaths(translations.el), leafPaths(translations.en));
  assertPopulated(translations.el, 'el');
  assertPopulated(translations.en, 'en');
});

test('all 25 base questions and 16 final-question candidates resolve with two options', () => {
  assert.equal(fixedAssessmentQuestions.length, 25);
  assert.equal(fixedAssessmentQuestions.filter(({ phase }) => phase === 'everyday').length, 20);
  assert.equal(fixedAssessmentQuestions.filter(({ phase }) => phase === 'structured').length, 5);
  assert.equal(adaptiveQuestionBank.length, 16);
  assert.equal(allAssessmentQuestions.length, 41);
  assert.equal(allAssessmentQuestions.flatMap(({ options }) => options).length, 82);

  const expectedQuestionIds = allAssessmentQuestions.map(({ id }) => id);
  const expectedOptionIds = allAssessmentQuestions.flatMap(({ options }) => options.map(({ id }) => id));
  for (const language of ['el', 'en']) {
    const assessment = getTranslation(language).assessment;
    assert.deepEqual(Object.keys(assessment.questions), expectedQuestionIds);
    assert.deepEqual(Object.keys(assessment.options), expectedOptionIds);
    for (const question of allAssessmentQuestions) {
      assertPopulated(assessment.questions[question.id], `${language}.${question.id}`);
      assert.deepEqual(question.options.map(({ position }) => position), ['a', 'b']);
      for (const option of question.options) {
        assertPopulated(assessment.options[option.id], `${language}.${option.id}`);
      }
    }
  }
});

test('all Short fixed and separator questions resolve completely in Greek and English', () => {
  assert.equal(shortFixedAssessmentQuestions.length, 12);
  assert.equal(shortSeparatorQuestionBank.length, 8);
  assert.equal(allShortAssessmentQuestions.length, 20);
  assert.equal(allShortAssessmentQuestions.flatMap(({ options }) => options).length, 40);

  const expectedQuestionIds = allShortAssessmentQuestions.map(({ id }) => id);
  const expectedOptionIds = allShortAssessmentQuestions.flatMap(
    ({ options }) => options.map(({ id }) => id),
  );
  for (const language of ['el', 'en']) {
    const assessment = getTranslation(language).shortAssessment;
    assert.deepEqual(Object.keys(assessment.questions), expectedQuestionIds);
    assert.deepEqual(Object.keys(assessment.options), expectedOptionIds);
    for (const question of allShortAssessmentQuestions) {
      assertPopulated(assessment.questions[question.id], `${language}.shortAssessment.${question.id}`);
      assert.deepEqual(question.options.map(({ position }) => position), ['a', 'b']);
      for (const option of question.options) {
        assertPopulated(
          assessment.options[option.id],
          `${language}.shortAssessment.${option.id}`,
        );
      }
    }
  }
});

test('reverse display order is language-neutral and balanced without exposing scoring metadata', () => {
  const reverseKeyedCount = allAssessmentQuestions.filter(({ reverseKeyed }) => reverseKeyed).length;
  assert.ok(reverseKeyedCount >= 18 && reverseKeyedCount <= 23);
  for (const question of allAssessmentQuestions) {
    assert.deepEqual(question.options.map(({ position }) => position), ['a', 'b']);
    assert.ok(translations.en.assessment.options[question.options[0].id]);
    assert.ok(translations.el.assessment.options[question.options[0].id]);
  }
  assert.equal(
    translations.el.assessment.options['q06-social-or-solo-activity-a'],
    'Μια δραστηριότητα που μπορείς να κάνεις μόνος σου και με τον δικό σου ρυθμό.',
  );
  assert.equal(
    translations.el.assessment.options['q06-social-or-solo-activity-b'],
    'Μια δραστηριότητα που περιλαμβάνει επικοινωνία ή συμμετοχή με άλλους.',
  );
});

test('authoritative Greek wording remains intact, including deliberately reverse-displayed items', () => {
  const { questions, options } = translations.el.assessment;
  assert.equal(
    questions['q24-professional-closure'],
    'Στην εργασία αισθάνεσαι περισσότερο άνετα όταν:',
  );
  assert.equal(
    options['q16-colleague-mistake-a'],
    'Εξετάζεις πρώτα την αιτία, το πρότυπο που παραβιάστηκε και τη διορθωτική ενέργεια.',
  );
  assert.equal(
    options['q21-social-energy-a'],
    'Συνήθως αισθάνεσαι ενεργοποιημένος και πρόθυμος να συνεχίσεις.',
  );
  assert.equal(
    questions['energy-adaptive-personal-free-evening'],
    'Ένα απρόσμενα ελεύθερο βράδυ εμφανίζεται στο πρόγραμμά σου. Τι σου φαίνεται πιο φυσικό;',
  );
  assert.equal(
    options['q25-developing-ideas-a'],
    'Τις επεξεργάζεσαι πρώτα μόνος σου και τις παρουσιάζεις όταν έχουν ωριμάσει.',
  );
});

test('binary instructions and interaction feedback are complete in both modes and languages', () => {
  assert.equal(translations.en.assessment.optionA, 'A');
  assert.equal(translations.en.assessment.optionB, 'B');
  assert.equal(translations.el.assessment.optionA, 'Α');
  assert.equal(translations.el.assessment.optionB, 'Β');

  for (const language of ['el', 'en']) {
    for (const modeKey of ['assessment', 'shortAssessment']) {
      const copy = translations[language][modeKey];
      for (const key of [
        'personalContext', 'professionalContext', 'introduction', 'answerGroupLabel',
        'optionAccessibilityLabel', 'optionHint', 'selected', 'selectionAnnouncement',
        'selectionRequired', 'selectionComplete', 'back', 'backHint', 'continue',
        'continueHint', 'finish', 'finishHint',
      ]) assertPopulated(copy[key], `${language}.${modeKey}.${key}`);
      assert.match(copy.optionAccessibilityLabel, /\{letter\}/);
      assert.match(copy.optionAccessibilityLabel, /\{statement\}/);
      assert.match(copy.selectionAnnouncement, /\{letter\}/);
    }
  }

  const interactionCopy = [
    translations.en.assessment,
    translations.el.assessment,
    translations.en.shortAssessment,
    translations.el.shortAssessment,
  ]
    .flatMap(({ questions: _questions, options: _options, ...copy }) => stringLeaves(copy))
    .join('\n');
  assert.doesNotMatch(interactionCopy, /rank|ranking|κατάταξ|4\s*,?\s*3\s*,?\s*2\s*,?\s*1/i);
});

test('question and option copy is behavioral, animal-neutral, and free of sensitive topics', () => {
  const assessmentCopy = [
    ...Object.values(translations.en.assessment.questions),
    ...Object.values(translations.en.assessment.options),
    ...Object.values(translations.el.assessment.questions),
    ...Object.values(translations.el.assessment.options),
    ...Object.values(translations.en.shortAssessment.questions),
    ...Object.values(translations.en.shortAssessment.options),
    ...Object.values(translations.el.shortAssessment.questions),
    ...Object.values(translations.el.shortAssessment.options),
  ].join('\n');
  assert.doesNotMatch(
    assessmentCopy,
    /\b(raven|octopus|lion|fox|elephant|deer|dolphin|otter|beaver|dog|wolf|penguin|falcon|swan|cheetah|peacock)\b/i,
  );
  assert.doesNotMatch(
    assessmentCopy,
    /\b(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)\b/,
  );
  assert.doesNotMatch(assessmentCopy, /\b(always|never|nobody)\b/i);
  assert.doesNotMatch(
    assessmentCopy,
    /panic|manipulat|trauma|self-harm|abuse|illegal|medical history|political|religion|sexual|employment suitability/i,
  );
});

test('English and Greek share the same language-neutral question route and result', () => {
  function completeUsing(language) {
    let session = createAssessmentSession();
    while (!session.result) {
      const question = getCurrentAssessmentQuestion(session);
      assert.ok(question);
      assert.ok(translations[language].assessment.questions[question.id]);
      for (const option of question.options) {
        assert.ok(translations[language].assessment.options[option.id]);
      }
      session = answerCurrentAssessmentQuestion(session, question.id, question.options[0].id);
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

test('Home accurately summarizes both questionnaire lengths and the animal-first experience', () => {
  for (const language of ['el', 'en']) {
    const home = getTranslation(language).home;
    assertPopulated(home, `${language}.home`);
    assert.equal(Object.keys(home.features).length, 3);
    assert.equal(home.highlights.length, 4);
    const text = stringLeaves(home).join(' ');
    assert.match(text, /15|fifteen|δεκαπέντε/i);
    assert.match(text, /30|thirty|τριάντα/i);
    assert.match(text, /16|sixteen|δεκαέξι/i);
    assert.doesNotMatch(text, /rank|ranking|κατάταξ|differentiator|adaptive|structured|psychometric/i);
    assert.doesNotMatch(text, /first 25|25 choices|πρώτες 25|πρώτες είκοσι πέντε/i);
  }
});

test('questionnaire choice copy is bilingual, complete, timed, and explicit about separate saving', () => {
  for (const language of ['el', 'en']) {
    const copy = getTranslation(language).questionnaires;
    assertPopulated(copy, `${language}.questionnaires`);
    const text = stringLeaves(copy).join(' ');
    assert.match(text, /15|fifteen|δεκαπέντε/i);
    assert.match(text, /30|thirty|τριάντα/i);
    assert.match(text, /3|three|τρία/i);
    assert.match(text, /6|six|έξι/i);
    assert.match(text, /A\/B|Α\/Β/u);
    assert.match(text, /separately|ξεχωριστά/iu);
  }
});

test('How It Works explains both timed paths, A/B choices, local calculation, and symbolic limits', () => {
  const english = stringLeaves(translations.en.howItWorks).join(' ');
  const greek = stringLeaves(translations.el.howItWorks).join(' ');
  assert.match(english, /two behaviours|A\/B/i);
  assert.match(english, /15|fifteen/i);
  assert.match(english, /30|thirty/i);
  assert.match(english, /3|three/i);
  assert.match(english, /6|six/i);
  assert.match(english, /primary/i);
  assert.match(english, /secondary/i);
  assert.match(english, /local|device/i);
  assert.match(english, /symbol|metaphor/i);
  assert.match(english, /not a psychological diagnosis|not.*scientifically validated/i);
  assert.match(greek, /δύο συμπεριφορές|Α\/Β/u);
  assert.match(greek, /15|δεκαπέντε/u);
  assert.match(greek, /30|τριάντα/u);
  assert.match(greek, /3|τρία/u);
  assert.match(greek, /6|έξι/u);
  assert.match(greek, /πρωτεύον|κύριο/u);
  assert.match(greek, /δευτερεύον/u);
  assert.match(greek, /συσκευή/u);
  assert.match(greek, /συμβολ|μεταφορ/u);
  assert.doesNotMatch(
    `${english}\n${greek}`,
    /rank|ranking|κατάταξ|differentiator|adaptive|structured|psychometric|0\.75|distance table/i,
  );
  assert.doesNotMatch(
    `${english}\n${greek}`,
    /first 25|five final|without changing your primary|πρώτες 25|πέντε τελικές|χωρίς να αλλάζει το πρωτεύον/iu,
  );
});

test('result, catalogue, settings, header, footer, and analytics copy resolve fully', () => {
  const expectedResultKeys = [
    'behaviouralTendencies', 'catalogue', 'catalogueHint', 'closePatterns',
    'contextDependentObservation', 'contextObservationTitle', 'decisionStyle',
    'disclaimer', 'eyebrow', 'informationStyle', 'interactionStyle',
    'longQuestionnaireResult', 'organizationStyle', 'personalContextObservation', 'possibleBlindSpots',
    'primaryAnimal', 'professionalContextObservation', 'relationship',
    'relationshipDescription', 'restart', 'restartHint', 'revealAccessibilityLabel',
    'secondaryAnimal', 'shortQuestionnaireResult', 'title',
    'typicalStrengths',
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
    'analytics', 'current', 'description', 'email', 'indicator', 'letter', 'name',
    'primary', 'primaryStrength', 'secondary', 'secondaryStrength', 'statement', 'total',
  ]);
  const latinTerms = stringLeaves(translations.el).flatMap((value) => value.match(/[A-Za-z]+/g) ?? []);
  for (const term of latinTerms) {
    assert.ok(allowedGreekModeTerms.has(term), `Unexpected English term in Greek content: ${term}`);
  }
});

test('switching language preserves answers, position, final-question route, and unfinished state', () => {
  const assessment = answerUntil(27);
  const state = { appearance: defaults, assessment };
  const next = {
    ...state,
    appearance: updateAppearanceSettings(state.appearance, { language: 'el' }),
  };
  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.answers, assessment.answers);
  assert.strictEqual(next.assessment.adaptiveQuestionIds, assessment.adaptiveQuestionIds);
  assert.equal(next.assessment.answers.length, 27);
  assert.equal(next.assessment.result, null);
});

test('switching language preserves a completed primary and secondary result', () => {
  const assessment = answerUntil(30);
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
