import assert from 'node:assert/strict';
import test from 'node:test';

import {
  fixedAssessmentQuestions,
} from '../src/features/assessment/data/questions.ts';
import {
  selectFirstPoleOptionId,
  selectSecondPoleOptionId,
} from '../src/features/assessment/services/assessmentFixtures.ts';
import {
  answerCurrentAssessmentQuestion,
  continueAssessment,
  createAssessmentSession,
  getAssessmentAnswer,
  getCurrentAssessmentQuestion,
  goToPreviousAssessmentQuestion,
  restartAssessmentSession,
  selectCurrentAssessmentOption,
} from '../src/features/assessment/services/assessmentSession.ts';
import {
  assessmentStorageKey,
  legacyAssessmentStorageKey,
  legacyAssessmentStorageKeys,
  legacyRankingAssessmentStorageKey,
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

function currentQuestion(session) {
  const question = getCurrentAssessmentQuestion(session);
  assert.ok(question);
  return question;
}

function answerUntil(answerCount) {
  let session = createAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = currentQuestion(session);
    const optionId = session.answers.length % 2 === 0
      ? selectFirstPoleOptionId(question)
      : selectSecondPoleOptionId(question);
    session = answerCurrentAssessmentQuestion(session, question.id, optionId);
  }
  return session;
}

test('storage keys, schema, and model version mark the incompatible binary boundary', () => {
  assert.equal(assessmentStorageKey, 'animals-within.assessment.v3');
  assert.equal(legacyAssessmentStorageKey, 'animals-within.assessment.v1');
  assert.equal(legacyRankingAssessmentStorageKey, 'animals-within.assessment.v2');
  assert.deepEqual(legacyAssessmentStorageKeys, [
    'animals-within.assessment.v1',
    'animals-within.assessment.v2',
  ]);
  assert.deepEqual(createAssessmentSession(), {
    schemaVersion: 3,
    modelVersion: '16-personality-binary-v2-30q',
    currentQuestionIndex: 0,
    answers: [],
    adaptiveQuestionIds: [],
    lockedPrimary: null,
    result: null,
  });
});

test('an immediate binary selection round-trips without advancing', () => {
  const initial = createAssessmentSession();
  const question = currentQuestion(initial);
  const selected = selectCurrentAssessmentOption(initial, question.options[0].id);
  assert.equal(selected.currentQuestionIndex, 0);
  assert.equal(selected.answers.length, 1);
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, selected);
  assert.deepEqual(restoreAssessmentSession(storage), selected);

  const stored = JSON.parse(storage.values.get(assessmentStorageKey));
  assert.deepEqual(stored.answers, [{
    questionId: question.id,
    selectedOptionId: question.options[0].id,
  }]);
  assert.equal('rankings' in stored.answers[0], false);
});

test('partial answers, current navigation index, and prior selections round-trip exactly', () => {
  let partial = answerUntil(8);
  partial = goToPreviousAssessmentQuestion(partial);
  assert.equal(partial.currentQuestionIndex, 7);
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, partial);
  const restored = restoreAssessmentSession(storage);
  assert.deepEqual(restored, partial);
  assert.deepEqual(
    getAssessmentAnswer(restored, partial.answers[7].questionId),
    partial.answers[7],
  );
});

test('question 25 selection persists its locked primary and deterministic adaptive route before Continue', () => {
  let session = answerUntil(24);
  const question25 = currentQuestion(session);
  session = selectCurrentAssessmentOption(session, selectFirstPoleOptionId(question25));
  assert.equal(session.currentQuestionIndex, 24);
  assert.equal(session.answers.length, 25);
  assert.ok(session.lockedPrimary);
  assert.equal(session.adaptiveQuestionIds.length, 5);
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, session);
  assert.deepEqual(restoreAssessmentSession(storage), session);

  const advanced = continueAssessment(restoreAssessmentSession(storage));
  assert.equal(advanced.currentQuestionIndex, 25);
  assert.equal(currentQuestion(advanced).id, session.adaptiveQuestionIds[0]);
});

test('question 30 selection can restore before Continue computes the final result', () => {
  let session = answerUntil(29);
  const question30 = currentQuestion(session);
  session = selectCurrentAssessmentOption(session, question30.options[0].id);
  assert.equal(session.answers.length, 30);
  assert.equal(session.currentQuestionIndex, 29);
  assert.equal(session.result, null);

  const storage = createMemoryStorage();
  persistAssessmentSession(storage, session);
  const restored = restoreAssessmentSession(storage);
  assert.deepEqual(restored, session);
  const completed = continueAssessment(restored);
  assert.ok(completed.result);
  assert.equal(completed.result.primaryTypeId, completed.lockedPrimary.primaryTypeId);
  assert.notEqual(completed.result.primaryTypeId, completed.result.secondaryTypeId);
});

test('completed primary, secondary, close, and balanced metadata round-trip exactly', () => {
  const completed = answerUntil(30);
  assert.ok(completed.result);
  assert.ok(completed.lockedPrimary);
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, completed);
  const restored = restoreAssessmentSession(storage);
  assert.deepEqual(restored, completed);
  assert.deepEqual(restored.result, completed.result);
  assert.equal(getCurrentAssessmentQuestion(restored), null);
});

test('editing a fixed answer after adaptive progress clears dependent answers and round-trips', () => {
  let session = answerUntil(28);
  while (session.currentQuestionIndex > 6) session = goToPreviousAssessmentQuestion(session);
  const fixed = currentQuestion(session);
  const existing = getAssessmentAnswer(session, fixed.id);
  assert.ok(existing);
  const replacement = fixed.options.find(({ id }) => id !== existing.selectedOptionId);
  assert.ok(replacement);
  session = selectCurrentAssessmentOption(session, replacement.id);
  assert.equal(session.answers.length, 25);
  assert.equal(session.adaptiveQuestionIds.length, 5);
  assert.ok(session.lockedPrimary);
  assert.equal(session.result, null);
  assert.deepEqual(normalizeStoredAssessmentSession(structuredClone(session)), session);

  const storage = createMemoryStorage();
  persistAssessmentSession(storage, session);
  assert.deepEqual(restoreAssessmentSession(storage), session);
});

test('normalization rejects unknown schema or model without mutating input', () => {
  const session = answerUntil(3);
  const wrongSchema = { ...structuredClone(session), schemaVersion: 2 };
  const wrongModel = { ...structuredClone(session), modelVersion: '16-personality-ranking-v1-25q' };
  const snapshots = [structuredClone(wrongSchema), structuredClone(wrongModel)];
  assert.equal(normalizeStoredAssessmentSession(wrongSchema), null);
  assert.equal(normalizeStoredAssessmentSession(wrongModel), null);
  assert.deepEqual(wrongSchema, snapshots[0]);
  assert.deepEqual(wrongModel, snapshots[1]);
});

test('normalization rejects malformed binary answers, duplicates, extra fields, and unknown IDs', () => {
  const partial = answerUntil(3);

  const unknownQuestion = structuredClone(partial);
  unknownQuestion.answers[0].questionId = 'not-a-question';
  assert.equal(normalizeStoredAssessmentSession(unknownQuestion), null);

  const unknownOption = structuredClone(partial);
  unknownOption.answers[0].selectedOptionId = 'not-an-option';
  assert.equal(normalizeStoredAssessmentSession(unknownOption), null);

  const duplicate = structuredClone(partial);
  duplicate.answers.push(structuredClone(duplicate.answers[0]));
  assert.equal(normalizeStoredAssessmentSession(duplicate), null);

  const answerWithScore = structuredClone(partial);
  answerWithScore.answers[0].score = 1;
  assert.equal(normalizeStoredAssessmentSession(answerWithScore), null);

  const topLevelDebug = { ...structuredClone(partial), profile: { energy: 1 } };
  assert.equal(normalizeStoredAssessmentSession(topLevelDebug), null);
});

test('crafted adaptive answers in the base prefix fail closed instead of throwing', () => {
  const session = answerUntil(25);
  const crafted = structuredClone(session);
  crafted.answers[0] = {
    questionId: session.adaptiveQuestionIds[0],
    selectedOptionId: `${session.adaptiveQuestionIds[0]}-a`,
  };
  assert.doesNotThrow(() => normalizeStoredAssessmentSession(crafted));
  assert.equal(normalizeStoredAssessmentSession(crafted), null);
  assert.equal(fixedAssessmentQuestions.some(({ id }) => id === crafted.answers[0].questionId), false);
});

test('normalization rejects illegal routes and missing or inconsistent locked-primary data', () => {
  const afterBase = answerUntil(25);

  const wrongRoute = structuredClone(afterBase);
  wrongRoute.adaptiveQuestionIds.reverse();
  assert.equal(normalizeStoredAssessmentSession(wrongRoute), null);

  const missingLock = { ...structuredClone(afterBase), lockedPrimary: null };
  assert.equal(normalizeStoredAssessmentSession(missingLock), null);

  const wrongLock = structuredClone(afterBase);
  wrongLock.lockedPrimary.primaryTypeId = wrongLock.lockedPrimary.primaryTypeId === 'INTJ'
    ? 'ENFP'
    : 'INTJ';
  assert.equal(normalizeStoredAssessmentSession(wrongLock), null);

  const premature = answerUntil(4);
  premature.lockedPrimary = afterBase.lockedPrimary;
  assert.equal(normalizeStoredAssessmentSession(premature), null);
});

test('normalization rejects premature, malformed, or inconsistent final results', () => {
  const completed = answerUntil(30);
  const premature = answerUntil(4);
  premature.result = completed.result;
  assert.equal(normalizeStoredAssessmentSession(premature), null);

  const inconsistent = structuredClone(completed);
  inconsistent.result.secondaryTypeId = inconsistent.result.primaryTypeId;
  assert.equal(normalizeStoredAssessmentSession(inconsistent), null);

  const wrongSecondary = structuredClone(completed);
  wrongSecondary.result.secondaryTypeId = wrongSecondary.result.secondaryTypeId === 'INTJ'
    ? 'ENFP'
    : 'INTJ';
  if (wrongSecondary.result.secondaryTypeId === wrongSecondary.result.primaryTypeId) {
    wrongSecondary.result.secondaryTypeId = 'ESFP';
  }
  assert.equal(normalizeStoredAssessmentSession(wrongSecondary), null);

  const numericLeak = structuredClone(completed);
  numericLeak.result.distance = 0.1;
  assert.equal(normalizeStoredAssessmentSession(numericLeak), null);
});

test('migration removes only obsolete v1 and v2 assessment state', () => {
  const appearanceKey = 'animals-within.appearance.v1';
  const consentKey = 'animals-within.analytics-consent.v1';
  const unrelatedKey = 'unrelated.preference';
  const storage = createMemoryStorage({
    [legacyAssessmentStorageKey]: JSON.stringify({ answers: [{ optionId: 'old' }] }),
    [legacyRankingAssessmentStorageKey]: JSON.stringify({ rankings: [1, 2, 3, 4] }),
    [appearanceKey]: JSON.stringify({ language: 'el', mode: 'dark' }),
    [consentKey]: 'rejected',
    [unrelatedKey]: 'keep-me',
  });

  assert.deepEqual(restoreAssessmentSession(storage), createAssessmentSession());
  assert.deepEqual(storage.removed, [legacyAssessmentStorageKey, legacyRankingAssessmentStorageKey]);
  assert.equal(storage.values.has(legacyAssessmentStorageKey), false);
  assert.equal(storage.values.has(legacyRankingAssessmentStorageKey), false);
  assert.equal(storage.values.get(appearanceKey), JSON.stringify({ language: 'el', mode: 'dark' }));
  assert.equal(storage.values.get(consentKey), 'rejected');
  assert.equal(storage.values.get(unrelatedKey), 'keep-me');
});

test('malformed current storage fails clean and preserves non-assessment preferences', () => {
  const storage = createMemoryStorage({
    [assessmentStorageKey]: '{not-json',
    'animals-within.appearance.v1': 'appearance',
    'animals-within.analytics-consent.v1': 'accepted',
    unrelated: 'keep',
  });
  assert.deepEqual(restoreAssessmentSession(storage), createAssessmentSession());
  assert.deepEqual(storage.removed, [assessmentStorageKey]);
  assert.equal(storage.values.get('animals-within.appearance.v1'), 'appearance');
  assert.equal(storage.values.get('animals-within.analytics-consent.v1'), 'accepted');
  assert.equal(storage.values.get('unrelated'), 'keep');
});

test('unavailable or throwing storage remains optional and safe', () => {
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

test('persisted assessment uses an explicit allowlist with no scores or public copy', () => {
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, answerUntil(30));
  const storedText = storage.values.get(assessmentStorageKey);
  const stored = JSON.parse(storedText);
  assert.deepEqual(Object.keys(stored).sort(), [
    'adaptiveQuestionIds',
    'answers',
    'currentQuestionIndex',
    'lockedPrimary',
    'modelVersion',
    'result',
    'schemaVersion',
  ]);
  assert.deepEqual(Object.keys(stored.lockedPrimary).sort(), [
    'balancedDimensionIds',
    'hasCloseMatch',
    'primaryTypeId',
  ]);
  assert.deepEqual(Object.keys(stored.result).sort(), [
    'balancedDimensionIds',
    'hasCloseMatch',
    'primaryTypeId',
    'secondaryTypeId',
  ]);
  assert.ok(stored.answers.every((answer) =>
    Object.keys(answer).sort().join(',') === 'questionId,selectedOptionId'));
  assert.doesNotMatch(
    storedText,
    /poleTotals|contextProfile|matches|distance|score|percentage|confidence|translated|description|strength|blindSpot|title/i,
  );
});

test('language and appearance changes retain the exact assessment object', () => {
  const assessment = answerUntil(27);
  const state = {
    appearance: { language: 'en', mode: 'light', colorTheme: 'amber' },
    assessment,
  };
  const next = {
    ...state,
    appearance: { ...state.appearance, language: 'el', mode: 'dark', colorTheme: 'plum' },
  };
  assert.strictEqual(next.assessment, assessment);
  assert.strictEqual(next.assessment.answers, assessment.answers);
  assert.strictEqual(next.assessment.adaptiveQuestionIds, assessment.adaptiveQuestionIds);
  assert.strictEqual(next.assessment.lockedPrimary, assessment.lockedPrimary);
});

test('restart persistence touches only the current assessment key', () => {
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
});
