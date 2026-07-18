import assert from 'node:assert/strict';
import test from 'node:test';

import {
  completedAssessmentQuestionCount,
} from '../src/features/assessment/data/questions.ts';
import {
  shortCompletedAssessmentQuestionCount,
  shortFixedAssessmentQuestionCount,
  shortFixedAssessmentQuestions,
  shortSeparatorAssessmentQuestionCount,
} from '../src/features/assessment/data/shortQuestions.ts';
import {
  assessmentModeStorageKey,
  persistAssessmentMode,
  restoreAssessmentMode,
} from '../src/features/assessment/services/assessmentModeStorage.ts';
import {
  answerCurrentAssessmentQuestion,
  createAssessmentSession,
  getCurrentAssessmentQuestion,
  restartAssessmentSession,
} from '../src/features/assessment/services/assessmentSession.ts';
import {
  assessmentStorageKey,
  persistAssessmentSession,
  restoreAssessmentSession,
} from '../src/features/assessment/services/assessmentStorage.ts';
import {
  answerCurrentShortAssessmentQuestion,
  continueShortAssessment,
  createShortAssessmentSession,
  getCurrentShortAssessmentQuestion,
  goToPreviousShortAssessmentQuestion,
  restartShortAssessmentSession,
  selectCurrentShortAssessmentOption,
  shortAssessmentModelVersion,
  shortAssessmentSchemaVersion,
} from '../src/features/assessment/services/shortAssessmentSession.ts';
import {
  normalizeStoredShortAssessmentSession,
  persistShortAssessmentSession,
  restoreShortAssessmentSession,
  shortAssessmentStorageKey,
} from '../src/features/assessment/services/shortAssessmentStorage.ts';

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

function currentShortQuestion(session) {
  const question = getCurrentShortAssessmentQuestion(session);
  assert.ok(question);
  return question;
}

function answerShortUntil(answerCount) {
  let session = createShortAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = currentShortQuestion(session);
    const selectedOption = question.options[session.answers.length % 2];
    assert.ok(selectedOption);
    session = answerCurrentShortAssessmentQuestion(
      session,
      question.id,
      selectedOption.id,
    );
  }
  return session;
}

function answerLongUntil(answerCount) {
  let session = createAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = getCurrentAssessmentQuestion(session);
    assert.ok(question);
    const selectedOption = question.options[session.answers.length % 2];
    assert.ok(selectedOption);
    session = answerCurrentAssessmentQuestion(session, question.id, selectedOption.id);
  }
  return session;
}

test('Short persistence has a separate stable key and explicit 15-question identity', () => {
  assert.equal(shortAssessmentStorageKey, 'animals-within.assessment.short.v1');
  assert.notEqual(shortAssessmentStorageKey, assessmentStorageKey);
  assert.equal(shortAssessmentSchemaVersion, 1);
  assert.equal(shortAssessmentModelVersion, 'animals-within-short-binary-v1-15q');
  assert.equal(shortFixedAssessmentQuestionCount, 12);
  assert.equal(shortSeparatorAssessmentQuestionCount, 3);
  assert.equal(shortCompletedAssessmentQuestionCount, 15);
  assert.equal(completedAssessmentQuestionCount, 30);
  assert.equal(createShortAssessmentSession().assessmentMode, 'short');
  assert.equal(createAssessmentSession().assessmentMode, 'long');
});

test('an immediate Short choice round-trips without advancing or writing Long progress', () => {
  const initial = createShortAssessmentSession();
  const question = currentShortQuestion(initial);
  const selected = selectCurrentShortAssessmentOption(initial, question.options[0].id);
  assert.equal(selected.currentQuestionIndex, 0);
  assert.equal(selected.answers.length, 1);

  const storage = createMemoryStorage();
  persistShortAssessmentSession(storage, selected);
  assert.deepEqual(restoreShortAssessmentSession(storage), selected);
  assert.equal(storage.values.has(assessmentStorageKey), false);
  assert.deepEqual(JSON.parse(storage.values.get(shortAssessmentStorageKey)).answers, [{
    questionId: question.id,
    selectedOptionId: question.options[0].id,
  }]);
});

test('Short Back state, navigation index, and selected choices restore after refresh', () => {
  let session = answerShortUntil(7);
  session = goToPreviousShortAssessmentQuestion(session);
  assert.equal(session.currentQuestionIndex, 6);

  const storage = createMemoryStorage();
  persistShortAssessmentSession(storage, session);
  assert.deepEqual(restoreShortAssessmentSession(storage), session);
});

test('question 12 selection round-trips the locked primary and deterministic separator route', () => {
  let session = answerShortUntil(11);
  const question12 = currentShortQuestion(session);
  assert.equal(question12.id, shortFixedAssessmentQuestions[11].id);
  session = selectCurrentShortAssessmentOption(session, question12.options[0].id);

  assert.equal(session.answers.length, 12);
  assert.equal(session.currentQuestionIndex, 11);
  assert.ok(session.lockedPrimary);
  assert.equal(session.separatorQuestionIds.length, 3);

  const storage = createMemoryStorage();
  persistShortAssessmentSession(storage, session);
  const restored = restoreShortAssessmentSession(storage);
  assert.deepEqual(restored, session);
  assert.deepEqual(
    normalizeStoredShortAssessmentSession(structuredClone(session)),
    session,
  );
  assert.equal(continueShortAssessment(restored).currentQuestionIndex, 12);
});

test('question 15 selection restores before Continue computes a distinct Short result', () => {
  let session = answerShortUntil(14);
  const lockedPrimaryId = session.lockedPrimary?.primaryTypeId;
  assert.ok(lockedPrimaryId);
  const question15 = currentShortQuestion(session);
  session = selectCurrentShortAssessmentOption(session, question15.options[0].id);
  assert.equal(session.answers.length, 15);
  assert.equal(session.currentQuestionIndex, 14);
  assert.equal(session.result, null);
  assert.equal(session.lockedPrimary?.primaryTypeId, lockedPrimaryId);

  const storage = createMemoryStorage();
  persistShortAssessmentSession(storage, session);
  const restored = restoreShortAssessmentSession(storage);
  assert.deepEqual(restored, session);

  const completed = continueShortAssessment(restored);
  assert.equal(completed.result?.assessmentMode, 'short');
  assert.equal(completed.result?.primaryTypeId, lockedPrimaryId);
  assert.notEqual(completed.result?.secondaryTypeId, lockedPrimaryId);
});

test('a completed Short result and its mode round-trip exactly', () => {
  const completed = answerShortUntil(15);
  assert.ok(completed.result);
  assert.equal(completed.result.assessmentMode, 'short');
  const storage = createMemoryStorage();
  persistShortAssessmentSession(storage, completed);
  assert.deepEqual(restoreShortAssessmentSession(storage), completed);
  assert.equal(getCurrentShortAssessmentQuestion(restoreShortAssessmentSession(storage)), null);
});

test('Short normalization rejects extra data, invalid modes, IDs, routes, locks, and results', () => {
  const partial = answerShortUntil(4);
  assert.equal(normalizeStoredShortAssessmentSession({ ...partial, debug: true }), null);
  assert.equal(normalizeStoredShortAssessmentSession({
    ...partial,
    assessmentMode: 'long',
  }), null);

  const badAnswer = structuredClone(partial);
  badAnswer.answers[0].selectedOptionId = 'unknown-option';
  assert.equal(normalizeStoredShortAssessmentSession(badAnswer), null);

  const duplicate = structuredClone(partial);
  duplicate.answers.push(structuredClone(duplicate.answers[0]));
  assert.equal(normalizeStoredShortAssessmentSession(duplicate), null);

  const answerWithExtraField = structuredClone(partial);
  answerWithExtraField.answers[0].score = 1;
  assert.equal(normalizeStoredShortAssessmentSession(answerWithExtraField), null);

  const afterLock = answerShortUntil(12);
  const wrongRoute = structuredClone(afterLock);
  wrongRoute.separatorQuestionIds.reverse();
  assert.equal(normalizeStoredShortAssessmentSession(wrongRoute), null);

  const wrongLock = structuredClone(afterLock);
  wrongLock.lockedPrimary.primaryTypeId = wrongLock.lockedPrimary.primaryTypeId === 'INTJ'
    ? 'ENFP'
    : 'INTJ';
  assert.equal(normalizeStoredShortAssessmentSession(wrongLock), null);

  const craftedPrefix = structuredClone(afterLock);
  const separatorId = craftedPrefix.separatorQuestionIds[0];
  craftedPrefix.answers[0] = {
    questionId: separatorId,
    selectedOptionId: `${separatorId}-a`,
  };
  assert.doesNotThrow(() => normalizeStoredShortAssessmentSession(craftedPrefix));
  assert.equal(normalizeStoredShortAssessmentSession(craftedPrefix), null);

  const completed = answerShortUntil(15);
  const sameAnimal = structuredClone(completed);
  sameAnimal.result.secondaryTypeId = sameAnimal.result.primaryTypeId;
  assert.equal(normalizeStoredShortAssessmentSession(sameAnimal), null);

  const wrongResultMode = structuredClone(completed);
  wrongResultMode.result.assessmentMode = 'long';
  assert.equal(normalizeStoredShortAssessmentSession(wrongResultMode), null);
});

test('malformed Short storage fails closed and removes only the Short key', () => {
  const longSession = answerLongUntil(5);
  const longText = JSON.stringify(longSession);
  const storage = createMemoryStorage({
    [shortAssessmentStorageKey]: '{bad-json',
    [assessmentStorageKey]: longText,
    [assessmentModeStorageKey]: 'long',
    'animals-within.appearance.v1': 'appearance',
    unrelated: 'keep',
  });

  assert.deepEqual(restoreShortAssessmentSession(storage), createShortAssessmentSession());
  assert.deepEqual(storage.removed, [shortAssessmentStorageKey]);
  assert.equal(storage.values.get(assessmentStorageKey), longText);
  assert.equal(storage.values.get(assessmentModeStorageKey), 'long');
  assert.equal(storage.values.get('animals-within.appearance.v1'), 'appearance');
  assert.equal(storage.values.get('unrelated'), 'keep');
});

test('Short and Long sessions coexist, restore, and restart independently', () => {
  const storage = createMemoryStorage();
  const longProgress = answerLongUntil(9);
  const shortProgress = answerShortUntil(6);
  persistAssessmentSession(storage, longProgress);
  persistShortAssessmentSession(storage, shortProgress);
  const originalLongText = storage.values.get(assessmentStorageKey);
  const originalShortText = storage.values.get(shortAssessmentStorageKey);

  assert.deepEqual(restoreAssessmentSession(storage), longProgress);
  assert.deepEqual(restoreShortAssessmentSession(storage), shortProgress);

  persistShortAssessmentSession(storage, restartShortAssessmentSession());
  assert.deepEqual(restoreShortAssessmentSession(storage), createShortAssessmentSession());
  assert.equal(storage.values.get(assessmentStorageKey), originalLongText);
  assert.deepEqual(restoreAssessmentSession(storage), longProgress);

  persistShortAssessmentSession(storage, shortProgress);
  persistAssessmentSession(storage, restartAssessmentSession());
  assert.deepEqual(restoreAssessmentSession(storage), createAssessmentSession());
  assert.equal(storage.values.get(shortAssessmentStorageKey), originalShortText);
  assert.deepEqual(restoreShortAssessmentSession(storage), shortProgress);
});

test('active questionnaire mode persists only valid literals without touching either session', () => {
  const storage = createMemoryStorage();
  persistAssessmentSession(storage, answerLongUntil(3));
  persistShortAssessmentSession(storage, answerShortUntil(3));
  const longText = storage.values.get(assessmentStorageKey);
  const shortText = storage.values.get(shortAssessmentStorageKey);

  assert.equal(restoreAssessmentMode(storage), null);
  persistAssessmentMode(storage, 'short');
  assert.equal(storage.values.get(assessmentModeStorageKey), 'short');
  assert.equal(restoreAssessmentMode(storage), 'short');
  persistAssessmentMode(storage, 'long');
  assert.equal(restoreAssessmentMode(storage), 'long');
  assert.equal(storage.values.get(assessmentStorageKey), longText);
  assert.equal(storage.values.get(shortAssessmentStorageKey), shortText);

  storage.values.set(assessmentModeStorageKey, 'SHORT');
  assert.equal(restoreAssessmentMode(storage), null);
  assert.equal(storage.values.has(assessmentModeStorageKey), false);
  assert.equal(storage.values.get(assessmentStorageKey), longText);
  assert.equal(storage.values.get(shortAssessmentStorageKey), shortText);
});

test('Short persistence uses exact score-free allowlists', () => {
  const storage = createMemoryStorage();
  persistShortAssessmentSession(storage, answerShortUntil(15));
  const storedText = storage.values.get(shortAssessmentStorageKey);
  const stored = JSON.parse(storedText);
  assert.deepEqual(Object.keys(stored).sort(), [
    'answers',
    'assessmentMode',
    'currentQuestionIndex',
    'lockedPrimary',
    'modelVersion',
    'result',
    'schemaVersion',
    'separatorQuestionIds',
  ]);
  assert.deepEqual(Object.keys(stored.result).sort(), [
    'assessmentMode',
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

test('unavailable or throwing storage is safe for Short sessions and active mode', () => {
  const throwingStorage = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
    removeItem() {
      throw new Error('blocked');
    },
  };
  assert.deepEqual(restoreShortAssessmentSession(null), createShortAssessmentSession());
  assert.deepEqual(
    restoreShortAssessmentSession(throwingStorage),
    createShortAssessmentSession(),
  );
  assert.equal(restoreAssessmentMode(null), null);
  assert.equal(restoreAssessmentMode(throwingStorage), null);
  assert.doesNotThrow(() => persistShortAssessmentSession(null, answerShortUntil(2)));
  assert.doesNotThrow(() => persistShortAssessmentSession(
    throwingStorage,
    answerShortUntil(2),
  ));
  assert.doesNotThrow(() => persistAssessmentMode(throwingStorage, 'short'));
});
