import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assessmentModelVersion,
  canonicalPersonalityAnimals,
  getPersonalityAnimal,
  personalityTypeIds,
} from '../src/features/personalities/data/personalityAnimals.ts';
import {
  createEmptyDimensionProfile,
  dimensionDefinitions,
  dimensionIds,
  poleIds,
} from '../src/features/personalities/types.ts';
import {
  adaptiveAssessmentQuestionCount,
  adaptiveQuestionBank,
  allAssessmentQuestions,
  assessmentPhaseWeights,
  baseAssessmentQuestionCount,
  completedAssessmentQuestionCount,
  everydayAssessmentQuestionCount,
  fixedAssessmentQuestions,
  structuredAssessmentQuestionCount,
} from '../src/features/assessment/data/questions.ts';
import {
  createRepresentativeAssessmentSession,
  selectFirstPoleOptionId,
  selectOptionIdForPole,
  selectSecondPoleOptionId,
} from '../src/features/assessment/services/assessmentFixtures.ts';
import {
  assessmentSchemaVersion,
  answerCurrentAssessmentQuestion,
  canContinueAssessment,
  continueAssessment,
  createAssessmentSession,
  getAssessmentAnswer,
  getAssessmentQuestionSequence,
  getCurrentAssessmentQuestion,
  goToPreviousAssessmentQuestion,
  restartAssessmentSession,
  selectCurrentAssessmentOption,
} from '../src/features/assessment/services/assessmentSession.ts';
import {
  createAssessmentAnswer,
  isAssessmentOptionIdForQuestion,
  isValidAssessmentAnswer,
} from '../src/features/assessment/services/selection.ts';
import {
  assessmentPhaseWeights as scoringPhaseWeights,
  calculateAnswerContribution,
  calculateAssessmentProfile,
  calculateContextProfiles,
  calculateFinalAssessmentResult,
  calculateLockedPrimaryResult,
  calculateNormalizedDistance,
  calculatePoleTotals,
  calculateSignedDimensionProfile,
  calculateWeightedContribution,
  closeMatchDistanceGapThreshold,
  contextProfileDifferenceThreshold,
  findBalancedDimensions,
  getContextProfileObservation,
  rankPersonalityTypes,
} from '../src/features/assessment/services/scoreAssessment.ts';
import {
  adaptiveClosestCandidateCount,
  adaptiveQuestionSlots,
  countCandidatePairDisagreements,
  getClosestNonPrimaryCandidates,
  orderAdaptiveDimensions,
  rankAdaptiveDimensions,
  selectAdaptiveQuestionIds,
  selectAdaptiveQuestions,
} from '../src/features/assessment/services/selectAdaptiveQuestions.ts';
import {
  analyzeAssessmentBalance,
  exactTieProfile,
} from '../src/features/assessment/services/analyzeAssessmentBalance.ts';

const expectedMappings = [
  ['INTJ', 'raven'],
  ['INTP', 'octopus'],
  ['ENTJ', 'lion'],
  ['ENTP', 'fox'],
  ['INFJ', 'elephant'],
  ['INFP', 'deer'],
  ['ENFJ', 'dolphin'],
  ['ENFP', 'otter'],
  ['ISTJ', 'beaver'],
  ['ISFJ', 'dog'],
  ['ESTJ', 'wolf'],
  ['ESFJ', 'penguin'],
  ['ISTP', 'falcon'],
  ['ISFP', 'swan'],
  ['ESTP', 'cheetah'],
  ['ESFP', 'peacock'],
];

function currentQuestion(session) {
  const question = getCurrentAssessmentQuestion(session);
  assert.ok(question);
  return question;
}

function answerUntil(answerCount, selector = selectFirstPoleOptionId) {
  let session = createAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = currentQuestion(session);
    session = answerCurrentAssessmentQuestion(
      session,
      question.id,
      selector(question, session),
    );
  }
  return session;
}

function optionForType(question, typeId) {
  const target = getPersonalityAnimal(typeId);
  const poles = dimensionDefinitions[question.dimension];
  return selectOptionIdForPole(
    question,
    target.profile[question.dimension] > 0 ? poles.firstPole : poles.secondPole,
  );
}

test('the model, schema, dimensions, and canonical animal mappings remain explicit', () => {
  assert.equal(assessmentModelVersion, '16-personality-binary-v2-30q');
  assert.equal(assessmentSchemaVersion, 3);
  assert.deepEqual(dimensionIds, ['energy', 'information', 'decisions', 'structure']);
  assert.deepEqual(poleIds, ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']);
  assert.deepEqual(personalityTypeIds, expectedMappings.map(([typeId]) => typeId));
  assert.deepEqual(
    canonicalPersonalityAnimals.map(({ id, animalId }) => [id, animalId]),
    expectedMappings,
  );
  assert.equal(new Set(canonicalPersonalityAnimals.map(({ animalId }) => animalId)).size, 16);
});

test('metadata defines exactly 20 everyday, 5 structured, and a selected 5 adaptive questions', () => {
  assert.equal(everydayAssessmentQuestionCount, 20);
  assert.equal(structuredAssessmentQuestionCount, 5);
  assert.equal(baseAssessmentQuestionCount, 25);
  assert.equal(adaptiveAssessmentQuestionCount, 5);
  assert.equal(completedAssessmentQuestionCount, 30);
  assert.equal(fixedAssessmentQuestions.length, 25);
  assert.equal(adaptiveQuestionBank.length, 16);
  assert.equal(allAssessmentQuestions.length, 41);

  const everyday = fixedAssessmentQuestions.filter(({ phase }) => phase === 'everyday');
  const structured = fixedAssessmentQuestions.filter(({ phase }) => phase === 'structured');
  assert.equal(everyday.length, 20);
  assert.equal(structured.length, 5);
  assert.equal(everyday.filter(({ context }) => context === 'personal').length, 10);
  assert.equal(everyday.filter(({ context }) => context === 'professional').length, 10);
  assert.equal(structured.filter(({ context }) => context === 'personal').length, 3);
  assert.equal(structured.filter(({ context }) => context === 'professional').length, 2);
  for (const dimension of dimensionIds) {
    assert.equal(everyday.filter((question) => question.dimension === dimension).length, 5);
    assert.equal(adaptiveQuestionBank.filter((question) => question.dimension === dimension).length, 4);
    assert.equal(adaptiveQuestionBank.filter((question) =>
      question.dimension === dimension && question.context === 'personal').length, 2);
    assert.equal(adaptiveQuestionBank.filter((question) =>
      question.dimension === dimension && question.context === 'professional').length, 2);
  }
});

test('every question has two stable unique options and language-neutral scoring metadata', () => {
  const questionIds = allAssessmentQuestions.map(({ id }) => id);
  const optionIds = allAssessmentQuestions.flatMap(({ options }) => options.map(({ id }) => id));
  assert.equal(new Set(questionIds).size, questionIds.length);
  assert.equal(new Set(optionIds).size, optionIds.length);
  assert.equal(optionIds.length, 82);
  assert.deepEqual(assessmentPhaseWeights, { everyday: 1, structured: 1.25, adaptive: 1.5 });

  for (const question of allAssessmentQuestions) {
    const poles = dimensionDefinitions[question.dimension];
    assert.equal(question.options.length, 2);
    assert.equal(question.options[0].id, `${question.id}-a`);
    assert.equal(question.options[1].id, `${question.id}-b`);
    assert.deepEqual(question.options.map(({ position }) => position), ['a', 'b']);
    assert.deepEqual(new Set(question.options.map(({ pole }) => pole)),
      new Set([poles.firstPole, poles.secondPole]));
    assert.equal(question.options[0].pole,
      question.reverseKeyed ? poles.secondPole : poles.firstPole);
    assert.equal(question.options[1].pole,
      question.reverseKeyed ? poles.firstPole : poles.secondPole);
    assert.equal(question.weight, assessmentPhaseWeights[question.phase]);
  }
  assert.equal(fixedAssessmentQuestions.filter(({ reverseKeyed }) => reverseKeyed).length, 12);
  assert.equal(adaptiveQuestionBank.filter(({ reverseKeyed }) => reverseKeyed).length, 8);
});

test('binary answers accept exactly one option belonging to their question', () => {
  const [question, otherQuestion] = fixedAssessmentQuestions;
  assert.ok(question && otherQuestion);
  const answer = createAssessmentAnswer(question, question.options[0].id);
  assert.deepEqual(answer, { questionId: question.id, selectedOptionId: question.options[0].id });
  assert.equal(isValidAssessmentAnswer(question, answer), true);
  assert.equal(isAssessmentOptionIdForQuestion(question, question.options[1].id), true);
  assert.equal(isAssessmentOptionIdForQuestion(question, otherQuestion.options[0].id), false);
  assert.equal(isValidAssessmentAnswer(question, { ...answer, debugScore: 1 }), false);
  assert.equal(isValidAssessmentAnswer(question, {
    questionId: question.id,
    selectedOptionId: otherQuestion.options[0].id,
  }), false);
  assert.throws(() => createAssessmentAnswer(question, 'unknown'), /requires one of its two options/);
});

test('signed contributions apply configurable phase weights and reverse keys only affect display order', () => {
  const everyday = fixedAssessmentQuestions[0];
  const structured = fixedAssessmentQuestions[20];
  const adaptive = adaptiveQuestionBank[0];
  assert.ok(everyday && structured && adaptive);
  assert.strictEqual(scoringPhaseWeights, assessmentPhaseWeights);
  assert.equal(calculateWeightedContribution(1, 'everyday'), 1);
  assert.equal(calculateWeightedContribution(-1, 'structured'), -1.25);
  assert.equal(calculateWeightedContribution(1, 'adaptive'), 1.5);
  assert.equal(calculateAnswerContribution(everyday, selectFirstPoleOptionId(everyday)), 1);
  assert.equal(calculateAnswerContribution(everyday, selectSecondPoleOptionId(everyday)), -1);

  const reverse = fixedAssessmentQuestions.find(({ reverseKeyed }) => reverseKeyed);
  assert.ok(reverse);
  assert.equal(calculateAnswerContribution(reverse, selectFirstPoleOptionId(reverse)), reverse.weight);
  assert.equal(calculateAnswerContribution(reverse, selectSecondPoleOptionId(reverse)), -reverse.weight);
});

test('dimension scoring normalizes independently by answered weight', () => {
  const energyQuestions = fixedAssessmentQuestions.filter(({ dimension }) => dimension === 'energy');
  const first = energyQuestions[0];
  const second = energyQuestions.find((question) => question.weight === 1 && question.id !== first?.id);
  assert.ok(first && second);
  const balancedAnswers = [
    createAssessmentAnswer(first, selectFirstPoleOptionId(first)),
    createAssessmentAnswer(second, selectSecondPoleOptionId(second)),
  ];
  const totals = calculatePoleTotals(balancedAnswers);
  const profile = calculateSignedDimensionProfile(totals);
  assert.equal(profile.energy, 0);
  assert.equal(profile.information, 0);
  assert.deepEqual(findBalancedDimensions(profile), dimensionIds);

  const positive = calculateAssessmentProfile([
    createAssessmentAnswer(first, selectFirstPoleOptionId(first)),
    createAssessmentAnswer(second, selectFirstPoleOptionId(second)),
  ]);
  assert.equal(positive.energy, 1);
  assert.equal(positive.information, 0);
});

test('canonical distance remains symmetric and ties use canonical order', () => {
  for (const typeId of personalityTypeIds) {
    const personality = getPersonalityAnimal(typeId);
    assert.equal(calculateNormalizedDistance(personality.profile, personality), 0);
    assert.equal(rankPersonalityTypes(personality.profile)[0]?.personality.id, typeId);
  }
  assert.deepEqual(exactTieProfile, createEmptyDimensionProfile());
  const first = rankPersonalityTypes(exactTieProfile);
  const second = rankPersonalityTypes(exactTieProfile);
  assert.deepEqual(first, second);
  assert.deepEqual(first.map(({ personality }) => personality.id), personalityTypeIds);
  assert.ok(first.every(({ distance }) => distance === 1));
});

test('selection persists immediately and Continue is the only operation that advances', () => {
  const initial = createAssessmentSession();
  const question = currentQuestion(initial);
  assert.equal(canContinueAssessment(initial), false);
  assert.strictEqual(continueAssessment(initial), initial);

  const selected = selectCurrentAssessmentOption(initial, question.options[0].id);
  assert.equal(selected.currentQuestionIndex, 0);
  assert.equal(selected.answers.length, 1);
  assert.deepEqual(getAssessmentAnswer(selected, question.id), {
    questionId: question.id,
    selectedOptionId: question.options[0].id,
  });
  assert.equal(canContinueAssessment(selected), true);

  const advanced = continueAssessment(selected);
  assert.equal(advanced.currentQuestionIndex, 1);
  assert.equal(advanced.answers.length, 1);
});

test('question 25 computes a locked primary and route before Continue advances', () => {
  let session = answerUntil(24, (question) => optionForType(question, 'INTJ'));
  assert.equal(session.currentQuestionIndex, 24);
  assert.equal(session.lockedPrimary, null);
  assert.deepEqual(session.adaptiveQuestionIds, []);
  const question25 = currentQuestion(session);
  session = selectCurrentAssessmentOption(session, optionForType(question25, 'INTJ'));
  assert.equal(session.currentQuestionIndex, 24);
  assert.equal(session.answers.length, 25);
  assert.equal(session.lockedPrimary?.primaryTypeId, 'INTJ');
  assert.equal(session.adaptiveQuestionIds.length, 5);
  assert.equal(getAssessmentQuestionSequence(session).length, 30);
  const locked = session.lockedPrimary;

  session = continueAssessment(session);
  assert.equal(session.currentQuestionIndex, 25);
  assert.strictEqual(session.lockedPrimary, locked);
  assert.equal(currentQuestion(session).id, session.adaptiveQuestionIds[0]);
});

test('adaptive selection ranks close-candidate disagreement, base balance, and canonical order deterministically', () => {
  const representative = createRepresentativeAssessmentSession('INTJ');
  assert.ok(representative.lockedPrimary);
  const baseAnswers = representative.answers.slice(0, 25);
  const profile = calculateAssessmentProfile(baseAnswers);
  const candidates = getClosestNonPrimaryCandidates(profile, representative.lockedPrimary);
  assert.equal(candidates.length, adaptiveClosestCandidateCount);
  assert.deepEqual(candidates.map(({ id }) => id), ['INTP', 'ENTJ', 'INFJ', 'ISTJ']);
  for (const dimension of dimensionIds) {
    assert.equal(countCandidatePairDisagreements(candidates, dimension), 3);
  }
  assert.deepEqual(orderAdaptiveDimensions(baseAnswers, representative.lockedPrimary), dimensionIds);
  assert.deepEqual(
    rankAdaptiveDimensions(baseAnswers, representative.lockedPrimary)
      .map(({ candidatePairDisagreements, baseMagnitude }) =>
        [candidatePairDisagreements, baseMagnitude]),
    Array(4).fill([3, 1]),
  );

  const selected = selectAdaptiveQuestions(baseAnswers, representative.lockedPrimary);
  assert.deepEqual(selected.map(({ context }) => context),
    adaptiveQuestionSlots.map(({ context }) => context));
  assert.deepEqual(selected.map(({ dimension }) => dimension),
    ['energy', 'energy', 'information', 'information', 'decisions']);
  assert.equal(new Set(selected.map(({ id }) => id)).size, 5);
  assert.deepEqual(
    selectAdaptiveQuestionIds([...baseAnswers].reverse(), representative.lockedPrimary),
    selected.map(({ id }) => id),
  );
});

test('adaptive answers determine a distinct secondary without ever recalculating the primary', () => {
  let session = answerUntil(25, (question) => optionForType(question, 'ENFP'));
  const locked = session.lockedPrimary;
  assert.ok(locked);
  assert.equal(locked.primaryTypeId, 'ENFP');
  while (!session.result) {
    const question = currentQuestion(session);
    session = answerCurrentAssessmentQuestion(
      session,
      question.id,
      selectSecondPoleOptionId(question),
    );
    assert.strictEqual(session.lockedPrimary, locked);
  }
  assert.equal(session.result.primaryTypeId, locked.primaryTypeId);
  assert.notEqual(session.result.secondaryTypeId, session.result.primaryTypeId);
  assert.deepEqual(
    session.result,
    calculateFinalAssessmentResult(session.answers, locked),
  );
});

test('changing a base answer clears all dependent adaptive state and recomputes the route', () => {
  let session = answerUntil(28);
  assert.equal(session.answers.length, 28);
  const oldLock = session.lockedPrimary;
  const oldRoute = session.adaptiveQuestionIds;
  while (session.currentQuestionIndex > 5) session = goToPreviousAssessmentQuestion(session);
  const fixed = currentQuestion(session);
  const oldAnswer = getAssessmentAnswer(session, fixed.id);
  assert.ok(oldAnswer);
  const replacement = fixed.options.find(({ id }) => id !== oldAnswer.selectedOptionId);
  assert.ok(replacement);
  session = selectCurrentAssessmentOption(session, replacement.id);
  assert.equal(session.currentQuestionIndex, 5);
  assert.equal(session.answers.length, 25);
  assert.equal(session.answers.some(({ questionId }) => oldRoute.includes(questionId)), false);
  assert.ok(session.lockedPrimary);
  assert.notStrictEqual(session.lockedPrimary, oldLock);
  assert.deepEqual(
    session.adaptiveQuestionIds,
    selectAdaptiveQuestionIds(session.answers, session.lockedPrimary),
  );
  assert.equal(session.result, null);
});

test('reselecting the same base answer preserves dependent progress', () => {
  let session = answerUntil(27);
  while (session.currentQuestionIndex > 4) session = goToPreviousAssessmentQuestion(session);
  const fixed = currentQuestion(session);
  const existing = getAssessmentAnswer(session, fixed.id);
  assert.ok(existing);
  const same = selectCurrentAssessmentOption(session, existing.selectedOptionId);
  assert.strictEqual(same, session);
  assert.equal(same.answers.length, 27);
});

test('back and forward navigation preserves selected binary answers', () => {
  let session = answerUntil(4);
  const fourth = session.answers[3];
  assert.ok(fourth);
  session = goToPreviousAssessmentQuestion(session);
  assert.equal(session.currentQuestionIndex, 3);
  assert.deepEqual(getAssessmentAnswer(session, fourth.questionId), fourth);
  session = continueAssessment(session);
  assert.equal(session.currentQuestionIndex, 4);
  assert.deepEqual(getAssessmentAnswer(session, fourth.questionId), fourth);
});

test('all sixteen representative legal runs retain their intended primary animal', () => {
  for (const [typeId, animalId] of expectedMappings) {
    const session = createRepresentativeAssessmentSession(typeId);
    assert.ok(session.result);
    assert.ok(session.lockedPrimary);
    assert.equal(session.answers.length, 30);
    assert.equal(session.result.primaryTypeId, typeId);
    assert.equal(getPersonalityAnimal(session.result.primaryTypeId).animalId, animalId);
    assert.notEqual(session.result.primaryTypeId, session.result.secondaryTypeId);
  }
});

test('personal and professional profiles use base questions only and expose a cautious discrete observation', () => {
  const baseAnswers = fixedAssessmentQuestions.map((question) => {
    const poles = dimensionDefinitions[question.dimension];
    return createAssessmentAnswer(
      question,
      selectOptionIdForPole(
        question,
        question.context === 'personal' ? poles.firstPole : poles.secondPole,
      ),
    );
  });
  const profiles = calculateContextProfiles(baseAnswers);
  assert.ok(dimensionIds.every((dimension) => profiles.personal[dimension] === 1));
  assert.ok(dimensionIds.every((dimension) => profiles.professional[dimension] === -1));
  assert.equal(contextProfileDifferenceThreshold, 0.4);
  assert.deepEqual(getContextProfileObservation(baseAnswers), {
    dimension: 'energy',
    kind: 'context-dependent',
    personalDirection: 'first',
    professionalDirection: 'second',
  });

  const adaptiveNoise = adaptiveQuestionBank.map((question) =>
    createAssessmentAnswer(question, question.options[0].id));
  assert.deepEqual(calculateContextProfiles([...baseAnswers, ...adaptiveNoise]), profiles);
  assert.deepEqual(getContextProfileObservation([...baseAnswers, ...adaptiveNoise]),
    getContextProfileObservation(baseAnswers));
  const uniform = createRepresentativeAssessmentSession('ISTJ').answers.slice(0, 25);
  assert.equal(getContextProfileObservation(uniform), null);
});

test('close-match metadata is boolean-only and uses a documented internal gap', () => {
  const representative = createRepresentativeAssessmentSession('ISTJ');
  assert.ok(representative.lockedPrimary);
  assert.equal(typeof representative.lockedPrimary.hasCloseMatch, 'boolean');
  assert.equal(closeMatchDistanceGapThreshold, 0.08);
  assert.deepEqual(Object.keys(representative.lockedPrimary).sort(), [
    'balancedDimensionIds',
    'hasCloseMatch',
    'primaryTypeId',
  ]);
});

test('restart returns the exact clean schema-three session', () => {
  assert.deepEqual(restartAssessmentSession(), {
    schemaVersion: 3,
    modelVersion: '16-personality-binary-v2-30q',
    assessmentMode: 'long',
    currentQuestionIndex: 0,
    answers: [],
    adaptiveQuestionIds: [],
    lockedPrimary: null,
    result: null,
  });
});

test('engineering analysis checks reachability, letter order, contexts, routes, symmetry, and ties', () => {
  const report = analyzeAssessmentBalance(160425, 1024);
  assert.match(report.label, /Engineering balance check/i);
  assert.equal(report.everydayQuestionCount, 20);
  assert.equal(report.structuredQuestionCount, 5);
  assert.equal(report.baseQuestionCount, 25);
  assert.equal(report.adaptiveBankCount, 16);
  assert.equal(report.optionStructureValid, true);
  assert.equal(report.phaseAndContextBalanceValid, true);
  assert.equal(report.reverseKeyBalanceValid, true);
  assert.equal(report.optionLetterOrderingBalanced, true);
  assert.equal(report.contextProfilesCorrect, true);
  assert.equal(report.completeTypeCoverage, true);
  assert.equal(report.deterministicAdaptiveSelection, true);
  assert.equal(report.adaptiveContextQuotaValid, true);
  assert.equal(report.adaptiveDimensionCoverage, true);
  assert.equal(report.canonicalScoringSymmetry, true);
  assert.equal(report.exactTieHandlingDeterministic, true);
  assert.equal(report.primarySecondaryAlwaysDistinct, true);
  assert.deepEqual(report.unreachablePrimary, []);
  assert.deepEqual(report.unreachableSecondary, []);
  assert.deepEqual(report.unreachableAdaptiveQuestionIds, []);
});
