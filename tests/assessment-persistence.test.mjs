import assert from 'node:assert/strict';
import test from 'node:test';

import {
  fixedAssessmentQuestionCount,
  fixedAssessmentQuestions,
} from '../src/features/assessment/data/questions.ts';
import {
  createRankingDraftFromRanks,
} from '../src/features/assessment/services/assessmentFixtures.ts';
import {
  answerCurrentAssessmentQuestion,
  createAssessmentSession,
  getCurrentAssessmentQuestion,
  goToPreviousAssessmentQuestion,
  restartAssessmentSession,
} from '../src/features/assessment/services/assessmentSession.ts';
import {
  assessmentStorageKey,
  legacyAssessmentStorageKey,
  normalizeStoredAssessmentSession,
  persistAssessmentSession,
  restoreAssessmentSession,
} from '../src/features/assessment/services/assessmentStorage.ts';

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  const removed = [];
  return {
    values,
    removed,
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      removed.push(key);
      values.delete(key);
    },
  };
}

function completeRanking(question, reverse = false) {
  return createRankingDraftFromRanks(question, reverse ? [2, 1, 3, 4] : [4, 3, 1, 2]);
}

function answerUntil(answerCount) {
  let session = createAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = getCurrentAssessmentQuestion(session);
    assert.ok(question);
    session = answerCurrentAssessmentQuestion(
      session,
      question.id,
      completeRanking(question, session.answers.length % 2 === 1),
    );
  }
  return session;
}

test('assessment storage keys, schema, and model version are explicit', () => {
  assert.equal(assessmentStorageKey, 'animals-within.assessment.v2');
  assert.equal(legacyAssessmentStorageKey, 'animals-within.assessment.v1');
  assert.deepEqual(createAssessmentSession(), {
    schemaVersion: 2,
    modelVersion: '16-personality-ranking-v1-25q',
    currentQuestionIndex: 0,
    answers: [],
    adaptiveQuestionIds: [],
    result: null,
  });
});

test('partial assessment rankings and current index round-trip exactly', () => {
  let partial = answerUntil(7);
  partial = goToPreviousAssessmentQuestion(partial);
  assert.equal(partial.currentQuestionIndex, 6);
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, partial);

  const stored = JSON.parse(storage.values.get(assessmentStorageKey));
  assert.equal(stored.schemaVersion, 2);
  assert.equal(stored.modelVersion, '16-personality-ranking-v1-25q');
  assert.equal(stored.currentQuestionIndex, 6);
  assert.equal(stored.answers.length, 7);
  assert.ok(stored.answers.every(({ rankings }) => rankings.length === 4));
  assert.deepEqual(restoreAssessmentSession(storage), partial);
});

test('the fixed-to-adaptive route and selected five IDs round-trip', () => {
  const afterFixed = answerUntil(fixedAssessmentQuestionCount);
  assert.equal(afterFixed.answers.length, 20);
  assert.equal(afterFixed.adaptiveQuestionIds.length, 5);
  assert.equal(new Set(afterFixed.adaptiveQuestionIds).size, 5);
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, afterFixed);
  const restored = restoreAssessmentSession(storage);
  assert.deepEqual(restored, afterFixed);
  assert.equal(getCurrentAssessmentQuestion(restored).id, afterFixed.adaptiveQuestionIds[0]);
});

test('editing a fixed answer after adaptive progress clears dependent answers and still round-trips', () => {
  let session = createAssessmentSession();
  while (session.answers.length < 23) {
    const question = getCurrentAssessmentQuestion(session);
    assert.ok(question);
    session = answerCurrentAssessmentQuestion(session, question.id, completeRanking(question));
  }
  assert.equal(session.answers.length, 23);

  while (session.currentQuestionIndex > 5) {
    session = goToPreviousAssessmentQuestion(session);
  }
  const editedFixedQuestion = getCurrentAssessmentQuestion(session);
  assert.ok(editedFixedQuestion);
  session = answerCurrentAssessmentQuestion(
    session,
    editedFixedQuestion.id,
    completeRanking(editedFixedQuestion, true),
  );

  assert.equal(session.answers.length, fixedAssessmentQuestionCount);
  assert.equal(session.currentQuestionIndex, 6);
  assert.equal(session.adaptiveQuestionIds.length, 5);
  assert.equal(session.result, null);
  assert.deepEqual(normalizeStoredAssessmentSession(structuredClone(session)), session);

  const storage = createMemoryStorage();
  persistAssessmentSession(storage, session);
  assert.deepEqual(restoreAssessmentSession(storage), session);
});

test('completed primary, secondary, and balanced metadata round-trip without recalculation drift', () => {
  const completed = answerUntil(25);
  assert.ok(completed.result);
  assert.notEqual(completed.result.primaryTypeId, completed.result.secondaryTypeId);
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, completed);
  const restored = restoreAssessmentSession(storage);
  assert.deepEqual(restored, completed);
  assert.deepEqual(restored.result, completed.result);
  assert.equal(getCurrentAssessmentQuestion(restored), null);
});

test('normalization rejects unknown schema or model without mutating its input', () => {
  const session = answerUntil(3);
  const wrongSchema = { ...session, schemaVersion: 1 };
  const wrongModel = { ...session, modelVersion: '12-archetype-v2-25q' };
  assert.equal(normalizeStoredAssessmentSession(wrongSchema), null);
  assert.equal(normalizeStoredAssessmentSession(wrongModel), null);
  assert.equal(wrongSchema.schemaVersion, 1);
  assert.equal(wrongModel.modelVersion, '12-archetype-v2-25q');
});

test('normalization rejects malformed rankings, unknown IDs, duplicate answers, and illegal adaptive routes', () => {
  const partial = answerUntil(3);
  const duplicateRankings = structuredClone(partial);
  duplicateRankings.answers[0].rankings[3].rank = duplicateRankings.answers[0].rankings[0].rank;
  assert.equal(normalizeStoredAssessmentSession(duplicateRankings), null);

  const unknownQuestion = structuredClone(partial);
  unknownQuestion.answers[0].questionId = 'not-a-question';
  assert.equal(normalizeStoredAssessmentSession(unknownQuestion), null);

  const unknownOption = structuredClone(partial);
  unknownOption.answers[0].rankings[0].optionId = 'not-an-option';
  assert.equal(normalizeStoredAssessmentSession(unknownOption), null);

  const duplicateAnswer = structuredClone(partial);
  duplicateAnswer.answers.push(structuredClone(duplicateAnswer.answers[0]));
  assert.equal(normalizeStoredAssessmentSession(duplicateAnswer), null);

  const illegalAdaptive = structuredClone(partial);
  illegalAdaptive.adaptiveQuestionIds = ['energy-adaptive-01-shared-journey'];
  assert.equal(normalizeStoredAssessmentSession(illegalAdaptive), null);

  const afterFixed = answerUntil(20);
  const wrongRoute = structuredClone(afterFixed);
  wrongRoute.adaptiveQuestionIds = [...wrongRoute.adaptiveQuestionIds].reverse();
  assert.equal(normalizeStoredAssessmentSession(wrongRoute), null);
});

test('normalization rejects missing, premature, or inconsistent completed results', () => {
  const completed = answerUntil(25);
  const missingResult = { ...completed, result: null };
  assert.equal(normalizeStoredAssessmentSession(missingResult), null);

  const premature = answerUntil(4);
  premature.result = completed.result;
  assert.equal(normalizeStoredAssessmentSession(premature), null);

  const inconsistent = structuredClone(completed);
  [inconsistent.result.primaryTypeId, inconsistent.result.secondaryTypeId] = [
    inconsistent.result.secondaryTypeId,
    inconsistent.result.primaryTypeId,
  ];
  assert.equal(normalizeStoredAssessmentSession(inconsistent), null);
});

test('legacy migration discards only obsolete assessment state', () => {
  const appearanceKey = 'animals-within.appearance.v1';
  const consentKey = 'animals-within.analytics-consent.v1';
  const unrelatedKey = 'unrelated.preference';
  const storage = createMemoryStorage({
    [legacyAssessmentStorageKey]: JSON.stringify({
      modelVersion: '12-archetype-v2-25q',
      answers: [{ questionId: 'b01-new-group', optionId: 'b01-a' }],
      adaptiveQuestionIds: ['a01-short-notice', 'a02-change-structure'],
      result: { primaryId: 'wolf', secondaryId: 'owl' },
    }),
    [appearanceKey]: JSON.stringify({ language: 'el', mode: 'dark' }),
    [consentKey]: 'rejected',
    [unrelatedKey]: 'keep-me',
  });

  assert.deepEqual(restoreAssessmentSession(storage), createAssessmentSession());
  assert.equal(storage.values.has(legacyAssessmentStorageKey), false);
  assert.deepEqual(storage.removed, [legacyAssessmentStorageKey]);
  assert.equal(storage.values.get(appearanceKey), JSON.stringify({ language: 'el', mode: 'dark' }));
  assert.equal(storage.values.get(consentKey), 'rejected');
  assert.equal(storage.values.get(unrelatedKey), 'keep-me');
});

test('malformed current storage fails clean and preserves appearance, consent, and unrelated preferences', () => {
  const appearanceKey = 'animals-within.appearance.v1';
  const consentKey = 'animals-within.analytics-consent.v1';
  const unrelatedKey = 'unrelated.preference';
  const storage = createMemoryStorage({
    [assessmentStorageKey]: '{not-json',
    [appearanceKey]: 'appearance',
    [consentKey]: 'accepted',
    [unrelatedKey]: 'keep-me',
  });
  assert.deepEqual(restoreAssessmentSession(storage), createAssessmentSession());
  assert.equal(storage.values.get(appearanceKey), 'appearance');
  assert.equal(storage.values.get(consentKey), 'accepted');
  assert.equal(storage.values.get(unrelatedKey), 'keep-me');
});

test('unavailable or throwing storage remains optional and fails safely to memory', () => {
  const throwingStorage = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
  };
  assert.deepEqual(restoreAssessmentSession(null), createAssessmentSession());
  assert.deepEqual(restoreAssessmentSession(throwingStorage), createAssessmentSession());
  assert.doesNotThrow(() => persistAssessmentSession(null, answerUntil(2)));
  assert.doesNotThrow(() => persistAssessmentSession(throwingStorage, answerUntil(2)));
});

test('restart and persistence touch only the assessment key', () => {
  const storage = createMemoryStorage({
    'animals-within.appearance.v1': 'appearance',
    'animals-within.analytics-consent.v1': 'accepted',
    unrelated: 'keep',
  });
  persistAssessmentSession(storage, answerUntil(6));
  persistAssessmentSession(storage, restartAssessmentSession());
  assert.deepEqual(restoreAssessmentSession(storage), createAssessmentSession());
  assert.equal(storage.values.get('animals-within.appearance.v1'), 'appearance');
  assert.equal(storage.values.get('animals-within.analytics-consent.v1'), 'accepted');
  assert.equal(storage.values.get('unrelated'), 'keep');
  assert.deepEqual([...storage.values.keys()].sort(), [
    assessmentStorageKey,
    'animals-within.analytics-consent.v1',
    'animals-within.appearance.v1',
    'unrelated',
  ].sort());
});

test('persisted assessment has an explicit allowlist and no debug or public-copy fields', () => {
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, answerUntil(25));
  const storedText = storage.values.get(assessmentStorageKey);
  const stored = JSON.parse(storedText);
  assert.deepEqual(Object.keys(stored).sort(), [
    'adaptiveQuestionIds',
    'answers',
    'currentQuestionIndex',
    'modelVersion',
    'result',
    'schemaVersion',
  ]);
  assert.deepEqual(Object.keys(stored.result).sort(), [
    'balancedDimensionIds',
    'primaryTypeId',
    'secondaryTypeId',
  ]);
  assert.doesNotMatch(
    storedText,
    /poleTotals|profile|matches|distance|score|percentage|confidence|translated|description|strength|blindSpot|title/i,
  );
});

test('language and appearance changes retain the exact persisted assessment object', () => {
  const assessment = answerUntil(22);
  const state = {
    appearance: {
      language: 'en',
      mode: 'light',
      colorTheme: 'amber',
      fontFamily: 'system-sans',
      textSize: 'large',
    },
    assessment,
  };
  const next = {
    ...state,
    appearance: {
      ...state.appearance,
      language: 'el',
      mode: 'dark',
      colorTheme: 'plum',
      textSize: 'extra-large',
    },
  };
  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.answers, assessment.answers);
  assert.strictEqual(next.assessment.adaptiveQuestionIds, assessment.adaptiveQuestionIds);
});

test('pre-adaptive persistence rejects adaptive answers disguised as fixed progress', () => {
  const partial = answerUntil(2);
  const firstAdaptiveQuestionId = 'energy-adaptive-01-shared-journey';
  const poisoned = structuredClone(partial);
  poisoned.answers[0].questionId = firstAdaptiveQuestionId;
  assert.equal(normalizeStoredAssessmentSession(poisoned), null);
  assert.equal(fixedAssessmentQuestions.some(({ id }) => id === firstAdaptiveQuestionId), false);
});
