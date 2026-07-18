import assert from 'node:assert/strict';
import test from 'node:test';
import {
  allShortAssessmentQuestions,
  shortAssessmentAreaDimensions,
  shortAssessmentAreaIds,
  shortAssessmentPhaseWeights,
  shortCompletedAssessmentQuestionCount,
  shortFixedAssessmentQuestionCount,
  shortFixedAssessmentQuestions,
  shortSeparatorAssessmentQuestionCount,
  shortSeparatorQuestionBank,
} from '../src/features/assessment/data/shortQuestions.ts';
import { completedAssessmentQuestionCount } from '../src/features/assessment/data/questions.ts';
import {
  answerCurrentShortAssessmentQuestion,
  canContinueShortAssessment,
  completeShortAssessmentWithOptionSelector,
  continueShortAssessment,
  createShortAssessmentSession,
  getCurrentShortAssessmentQuestion,
  getShortAssessmentAnswer,
  getShortAssessmentQuestionSequence,
  goToPreviousShortAssessmentQuestion,
  selectCurrentShortAssessmentOption,
  shortAssessmentModelVersion,
  shortAssessmentSchemaVersion,
} from '../src/features/assessment/services/shortAssessmentSession.ts';
import {
  calculateShortAnswerContribution,
  calculateShortFinalAssessmentResult,
  calculateShortLockedPrimaryResult,
  isValidShortAssessmentAnswer,
} from '../src/features/assessment/services/shortScoreAssessment.ts';
import {
  rankShortSeparatorAreas,
  selectShortSeparatorQuestionIds,
  selectShortSeparatorQuestions,
  shortSeparatorClosestCandidateCount,
} from '../src/features/assessment/services/selectShortSeparatorQuestions.ts';
import {
  canonicalPersonalityAnimals,
  getPersonalityAnimal,
  personalityTypeIds,
} from '../src/features/personalities/data/personalityAnimals.ts';
import {
  dimensionDefinitions,
  dimensionIds,
} from '../src/features/personalities/types.ts';

function currentQuestion(session) {
  const question = getCurrentShortAssessmentQuestion(session);
  assert.ok(question);
  return question;
}

function optionForType(question, typeId) {
  const target = getPersonalityAnimal(typeId);
  const desiredPole = target.profile[question.dimension] > 0
    ? dimensionDefinitions[question.dimension].firstPole
    : dimensionDefinitions[question.dimension].secondPole;
  const option = question.options.find(({ pole }) => pole === desiredPole);
  assert.ok(option);
  return option.id;
}

function answerUntil(answerCount, selector = (question) => question.options[0].id) {
  let session = createShortAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = currentQuestion(session);
    session = answerCurrentShortAssessmentQuestion(
      session,
      question.id,
      selector(question, session),
    );
  }
  return session;
}

test('Short metadata defines 12 fixed questions, three separators, and leaves Long at 30', () => {
  assert.equal(shortAssessmentSchemaVersion, 1);
  assert.equal(shortAssessmentModelVersion, 'animals-within-short-binary-v1-15q');
  assert.equal(shortFixedAssessmentQuestionCount, 12);
  assert.equal(shortSeparatorAssessmentQuestionCount, 3);
  assert.equal(shortCompletedAssessmentQuestionCount, 15);
  assert.equal(shortFixedAssessmentQuestions.length, 12);
  assert.equal(shortSeparatorQuestionBank.length, 8);
  assert.equal(allShortAssessmentQuestions.length, 20);
  assert.equal(completedAssessmentQuestionCount, 30);

  for (const area of shortAssessmentAreaIds) {
    const questions = shortFixedAssessmentQuestions.filter((question) => question.area === area);
    assert.equal(questions.length, 3);
    assert.ok(questions.every((question) =>
      question.dimension === shortAssessmentAreaDimensions[area]));
    assert.equal(shortSeparatorQuestionBank.filter((question) => question.area === area).length, 2);
  }
  assert.deepEqual(new Set(Object.values(shortAssessmentAreaDimensions)), new Set(dimensionIds));
});

test('the 12 fixed questions repeat sociability, emotional, creativity, and practicality', () => {
  assert.deepEqual(shortFixedAssessmentQuestions.map(({ area }) => area), [
    'sociability',
    'emotional-intelligence',
    'creativity',
    'practicality',
    'sociability',
    'emotional-intelligence',
    'creativity',
    'practicality',
    'sociability',
    'emotional-intelligence',
    'creativity',
    'practicality',
  ]);
  assert.deepEqual(shortFixedAssessmentQuestions.map(({ id }) => id), [
    'short-q01-social-setting',
    'short-q04-noticing-feelings',
    'short-q07-imagining-possibilities',
    'short-q10-solving-problem',
    'short-q02-group-conversation',
    'short-q05-supporting-someone',
    'short-q08-creative-start',
    'short-q11-making-plan',
    'short-q03-new-people',
    'short-q06-handling-tension',
    'short-q09-story-ideas',
    'short-q12-checking-work',
  ]);
});

test('every Short question is binary, single-area, weighted, and direction-balanced', () => {
  assert.deepEqual(shortAssessmentPhaseWeights, { fixed: 1, separator: 1.5 });
  assert.equal(shortFixedAssessmentQuestions.filter(({ reverseKeyed }) => reverseKeyed).length, 6);
  assert.equal(shortSeparatorQuestionBank.filter(({ reverseKeyed }) => reverseKeyed).length, 4);
  const ids = allShortAssessmentQuestions.map(({ id }) => id);
  const optionIds = allShortAssessmentQuestions.flatMap(({ options }) =>
    options.map(({ id }) => id));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(optionIds).size, optionIds.length);

  for (const question of allShortAssessmentQuestions) {
    const poles = dimensionDefinitions[question.dimension];
    assert.equal(question.dimension, shortAssessmentAreaDimensions[question.area]);
    assert.equal(question.options.length, 2);
    assert.deepEqual(question.options.map(({ position }) => position), ['a', 'b']);
    assert.deepEqual(new Set(question.options.map(({ pole }) => pole)),
      new Set([poles.firstPole, poles.secondPole]));
    assert.equal(question.options[0].pole,
      question.reverseKeyed ? poles.secondPole : poles.firstPole);
    assert.equal(question.options[1].pole,
      question.reverseKeyed ? poles.firstPole : poles.secondPole);
    assert.equal(question.weight, shortAssessmentPhaseWeights[question.phase]);
    assert.equal(calculateShortAnswerContribution(
      question,
      question.options.find(({ pole }) => pole === poles.firstPole).id,
    ), question.weight);
  }
});

test('selection persists immediately and Continue alone advances', () => {
  const initial = createShortAssessmentSession();
  assert.equal(initial.assessmentMode, 'short');
  assert.equal(canContinueShortAssessment(initial), false);
  assert.strictEqual(continueShortAssessment(initial), initial);

  const question = currentQuestion(initial);
  const selected = selectCurrentShortAssessmentOption(initial, question.options[0].id);
  assert.equal(selected.currentQuestionIndex, 0);
  assert.equal(selected.answers.length, 1);
  assert.equal(canContinueShortAssessment(selected), true);
  assert.deepEqual(getShortAssessmentAnswer(selected, question.id), {
    questionId: question.id,
    selectedOptionId: question.options[0].id,
  });

  const advanced = continueShortAssessment(selected);
  assert.equal(advanced.currentQuestionIndex, 1);
  const returned = goToPreviousShortAssessmentQuestion(advanced);
  assert.equal(returned.currentQuestionIndex, 0);
  assert.deepEqual(getShortAssessmentAnswer(returned, question.id),
    getShortAssessmentAnswer(selected, question.id));
});

test('Short answer validation rejects cross-question and enriched answer payloads', () => {
  const first = shortFixedAssessmentQuestions[0];
  const second = shortFixedAssessmentQuestions[1];
  assert.ok(first && second);
  const answer = { questionId: first.id, selectedOptionId: first.options[0].id };
  assert.equal(isValidShortAssessmentAnswer(first, answer), true);
  assert.equal(isValidShortAssessmentAnswer(first, { ...answer, score: 1 }), false);
  assert.equal(isValidShortAssessmentAnswer(first, {
    questionId: first.id,
    selectedOptionId: second.options[0].id,
  }), false);
});

test('question 12 locks the primary and deterministically creates a three-question route', () => {
  let session = answerUntil(11, (question) => optionForType(question, 'ENFP'));
  assert.equal(session.currentQuestionIndex, 11);
  assert.equal(session.lockedPrimary, null);
  assert.deepEqual(session.separatorQuestionIds, []);
  const question12 = currentQuestion(session);
  session = selectCurrentShortAssessmentOption(session, optionForType(question12, 'ENFP'));

  assert.equal(session.currentQuestionIndex, 11);
  assert.equal(session.answers.length, 12);
  assert.equal(session.lockedPrimary?.primaryTypeId, 'ENFP');
  assert.equal(session.separatorQuestionIds.length, 3);
  assert.equal(new Set(session.separatorQuestionIds).size, 3);
  assert.equal(getShortAssessmentQuestionSequence(session).length, 15);
  assert.deepEqual(
    session.separatorQuestionIds,
    selectShortSeparatorQuestionIds(session.answers, session.lockedPrimary),
  );
});

test('separator selection uses close-candidate disagreement and base balance deterministically', () => {
  const session = answerUntil(12, (question) => optionForType(question, 'ISTJ'));
  assert.ok(session.lockedPrimary);
  const fixedAnswers = session.answers.slice(0, 12);
  const priorities = rankShortSeparatorAreas(fixedAnswers, session.lockedPrimary);
  assert.equal(shortSeparatorClosestCandidateCount, 4);
  assert.equal(priorities.length, 4);
  for (let index = 1; index < priorities.length; index += 1) {
    const previous = priorities[index - 1];
    const current = priorities[index];
    assert.ok(previous.candidatePairDisagreements > current.candidatePairDisagreements
      || (previous.candidatePairDisagreements === current.candidatePairDisagreements
        && previous.baseMagnitude <= current.baseMagnitude));
  }
  const selected = selectShortSeparatorQuestions(fixedAnswers, session.lockedPrimary);
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected.map(({ area }) => area)).size, 3);
  assert.deepEqual(
    selectShortSeparatorQuestionIds([...fixedAnswers].reverse(), session.lockedPrimary),
    session.separatorQuestionIds,
  );
});

test('separator answers cannot alter the locked primary and final secondary is distinct', () => {
  let session = answerUntil(12, (question) => optionForType(question, 'INFP'));
  const locked = session.lockedPrimary;
  assert.ok(locked);
  while (!session.result) {
    const question = currentQuestion(session);
    session = answerCurrentShortAssessmentQuestion(
      session,
      question.id,
      question.options[1].id,
    );
    assert.strictEqual(session.lockedPrimary, locked);
  }
  assert.equal(session.answers.length, 15);
  assert.equal(session.result.assessmentMode, 'short');
  assert.equal(session.result.primaryTypeId, locked.primaryTypeId);
  assert.notEqual(session.result.secondaryTypeId, session.result.primaryTypeId);
  assert.deepEqual(session.result,
    calculateShortFinalAssessmentResult(session.answers, locked));
});

test('changing a fixed answer clears separator answers and recomputes dependent state', () => {
  let session = answerUntil(14);
  assert.equal(session.answers.length, 14);
  const oldRoute = session.separatorQuestionIds;
  while (session.currentQuestionIndex > 4) {
    session = goToPreviousShortAssessmentQuestion(session);
  }
  const question = currentQuestion(session);
  const answer = getShortAssessmentAnswer(session, question.id);
  assert.ok(answer);
  const replacement = question.options.find(({ id }) => id !== answer.selectedOptionId);
  assert.ok(replacement);
  session = selectCurrentShortAssessmentOption(session, replacement.id);
  assert.equal(session.currentQuestionIndex, 4);
  assert.equal(session.answers.length, 12);
  assert.ok(session.lockedPrimary);
  assert.equal(session.answers.some(({ questionId }) => oldRoute.includes(questionId)), false);
  assert.deepEqual(session.separatorQuestionIds,
    selectShortSeparatorQuestionIds(session.answers, session.lockedPrimary));
  assert.equal(session.result, null);
});

test('all canonical primary patterns produce deterministic animal-only pairs internally', () => {
  for (const typeId of personalityTypeIds) {
    const first = completeShortAssessmentWithOptionSelector((question) =>
      optionForType(question, typeId));
    const second = completeShortAssessmentWithOptionSelector((question) =>
      optionForType(question, typeId));
    assert.deepEqual(first, second);
    assert.equal(first.answers.length, 15);
    assert.equal(first.result?.assessmentMode, 'short');
    assert.equal(first.result?.primaryTypeId, typeId);
    assert.notEqual(first.result?.secondaryTypeId, typeId);
    assert.ok(canonicalPersonalityAnimals.some(({ id }) => id === first.result?.secondaryTypeId));
    assert.deepEqual(
      calculateShortLockedPrimaryResult(first.answers.slice(0, 12)),
      first.lockedPrimary,
    );
  }
});

test('all 32,768 Short answer paths preserve the lock and produce distinct animals', () => {
  const reachedPrimary = new Set();
  const reachedSecondary = new Set();
  let completionCount = 0;

  for (let fixedPattern = 0; fixedPattern < 2 ** 12; fixedPattern += 1) {
    let lockedSession = createShortAssessmentSession();
    for (let questionIndex = 0; questionIndex < 12; questionIndex += 1) {
      const question = currentQuestion(lockedSession);
      const optionIndex = (fixedPattern >> questionIndex) & 1;
      lockedSession = answerCurrentShortAssessmentQuestion(
        lockedSession,
        question.id,
        question.options[optionIndex].id,
      );
    }

    const locked = lockedSession.lockedPrimary;
    assert.ok(locked);
    reachedPrimary.add(locked.primaryTypeId);

    for (let separatorPattern = 0; separatorPattern < 2 ** 3; separatorPattern += 1) {
      let completedSession = lockedSession;
      for (let questionIndex = 0; questionIndex < 3; questionIndex += 1) {
        const question = currentQuestion(completedSession);
        const optionIndex = (separatorPattern >> questionIndex) & 1;
        completedSession = answerCurrentShortAssessmentQuestion(
          completedSession,
          question.id,
          question.options[optionIndex].id,
        );
        assert.strictEqual(completedSession.lockedPrimary, locked);
      }

      assert.equal(completedSession.answers.length, 15);
      assert.equal(completedSession.result?.primaryTypeId, locked.primaryTypeId);
      assert.notEqual(
        completedSession.result?.secondaryTypeId,
        completedSession.result?.primaryTypeId,
      );
      reachedSecondary.add(completedSession.result?.secondaryTypeId);
      completionCount += 1;
    }
  }

  assert.equal(completionCount, 32_768);
  assert.deepEqual(reachedPrimary, new Set(personalityTypeIds));
  assert.deepEqual(reachedSecondary, new Set(personalityTypeIds));
});
