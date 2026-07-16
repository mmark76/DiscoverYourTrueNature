import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  assessmentModelVersion,
  canonicalPersonalityAnimals,
  getPersonalityAnimal,
  getPersonalityTypeForAnimal,
  personalityTypeIds,
} from '../src/features/personalities/data/personalityAnimals.ts';
import {
  createEmptyPoleScoreMap,
  dimensionDefinitions,
  dimensionIds,
  poleIds,
} from '../src/features/personalities/types.ts';
import { animals } from '../src/features/animals/data/animals.ts';
import {
  adaptiveAssessmentQuestionCount,
  adaptiveQuestionBank,
  allAssessmentQuestions,
  assessmentOptionSuffixes,
  completedAssessmentQuestionCount,
  fixedAssessmentQuestionCount,
  fixedAssessmentQuestions,
} from '../src/features/assessment/data/questions.ts';
import {
  createCanonicalProfile,
  createRankingDraftForPole,
  createRankingDraftFromRanks,
  createRepresentativeAssessmentSession,
  createSeededAssessmentSession,
} from '../src/features/assessment/services/assessmentFixtures.ts';
import {
  assessmentSchemaVersion,
  answerCurrentAssessmentQuestion,
  completeAssessmentWithRankingSelector,
  createAssessmentSession,
  getAssessmentAnswer,
  getAssessmentQuestionSequence,
  getCurrentAssessmentQuestion,
  goToNextAssessmentQuestion,
  goToPreviousAssessmentQuestion,
  restartAssessmentSession,
} from '../src/features/assessment/services/assessmentSession.ts';
import {
  answerToRankingDraft,
  assignRank,
  createAssessmentAnswer,
  isAssessmentRank,
  isCompleteRanking,
  isValidAssessmentAnswer,
  normalizeRankAssignments,
} from '../src/features/assessment/services/ranking.ts';
import {
  assessmentPhaseWeights,
  calculateAssessmentProfile,
  calculateAssessmentRanking,
  calculateBaseContribution,
  calculateNormalizedDistance,
  calculatePoleTotals,
  calculateSignedDimensionProfile,
  calculateWeightedContribution,
  findBalancedDimensions,
  matchingDimensionWeights,
  rankPersonalityTypes,
} from '../src/features/assessment/services/scoreAssessment.ts';
import {
  adaptiveAllocation,
  orderDimensionsByFixedBalance,
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

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

function firstPoleRanking(question) {
  return createRankingDraftFromRanks(question, [4, 3, 1, 2]);
}

function secondPoleRanking(question) {
  return createRankingDraftFromRanks(question, [2, 1, 3, 4]);
}

function answerUntil(answerCount, selector = firstPoleRanking) {
  let session = createAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = getCurrentAssessmentQuestion(session);
    assert.ok(question);
    session = answerCurrentAssessmentQuestion(
      session,
      question.id,
      selector(question, session),
    );
  }
  return session;
}

test('model and persisted schema use the explicit sixteen-personality version', () => {
  assert.equal(assessmentModelVersion, '16-personality-ranking-v1-25q');
  assert.equal(assessmentSchemaVersion, 2);
  assert.deepEqual(dimensionIds, ['energy', 'information', 'decisions', 'structure']);
  assert.deepEqual(poleIds, ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']);
  assert.deepEqual(dimensionDefinitions, {
    energy: { firstPole: 'E', secondPole: 'I' },
    information: { firstPole: 'S', secondPole: 'N' },
    decisions: { firstPole: 'T', secondPole: 'F' },
    structure: { firstPole: 'J', secondPole: 'P' },
  });
});

test('all sixteen internal personality combinations map one-to-one to unique animals', () => {
  assert.deepEqual(personalityTypeIds, expectedMappings.map(([typeId]) => typeId));
  assert.deepEqual(
    canonicalPersonalityAnimals.map(({ id, animalId }) => [id, animalId]),
    expectedMappings,
  );
  assert.equal(canonicalPersonalityAnimals.length, 16);
  assert.equal(new Set(canonicalPersonalityAnimals.map(({ id }) => id)).size, 16);
  assert.equal(new Set(canonicalPersonalityAnimals.map(({ animalId }) => animalId)).size, 16);

  for (const [typeId, animalId] of expectedMappings) {
    assert.equal(getPersonalityAnimal(typeId).animalId, animalId);
    assert.equal(getPersonalityTypeForAnimal(animalId), typeId);
  }
});

test('public animal catalogue data contains all sixteen animals without internal profiles or codes', () => {
  assert.equal(animals.length, 16);
  assert.deepEqual(animals.map(({ id }) => id), expectedMappings.map(([, animalId]) => animalId));
  for (const animal of animals) {
    assert.deepEqual(Object.keys(animal).sort(), ['id', 'symbol']);
    assert.ok(animal.symbol.length > 0);
    assert.equal(personalityTypeIds.includes(animal.id), false);
    assert.equal('profile' in animal, false);
  }
});

test('metadata defines exactly twenty fixed questions and at least four adaptive candidates per dimension', () => {
  assert.equal(fixedAssessmentQuestionCount, 20);
  assert.equal(adaptiveAssessmentQuestionCount, 5);
  assert.equal(completedAssessmentQuestionCount, 25);
  assert.equal(fixedAssessmentQuestions.length, 20);
  assert.equal(adaptiveQuestionBank.length, 16);
  assert.equal(allAssessmentQuestions.length, 36);

  for (const dimension of dimensionIds) {
    assert.equal(
      fixedAssessmentQuestions.filter((question) => question.dimension === dimension).length,
      5,
    );
    assert.ok(
      adaptiveQuestionBank.filter((question) => question.dimension === dimension).length >= 4,
    );
  }
  assert.ok(fixedAssessmentQuestions.every(({ kind }) => kind === 'fixed'));
  assert.ok(adaptiveQuestionBank.every(({ kind }) => kind === 'adaptive'));
});

test('every question has stable unique IDs and the exact strong/moderate pole structure', () => {
  const questionIds = allAssessmentQuestions.map(({ id }) => id);
  const optionIds = allAssessmentQuestions.flatMap(({ options }) => options.map(({ id }) => id));
  assert.equal(new Set(questionIds).size, questionIds.length);
  assert.equal(new Set(optionIds).size, optionIds.length);
  assert.equal(optionIds.length, 144);

  for (const question of allAssessmentQuestions) {
    assert.equal(question.options.length, 4);
    assert.ok(dimensionIds.includes(question.dimension));
    assert.ok(question.scenarioId.length > 0);
    const { firstPole, secondPole } = dimensionDefinitions[question.dimension];
    assert.deepEqual(
      question.options.map(({ pole, intensity }) => ({ pole, intensity })),
      [
        { pole: firstPole, intensity: 2 },
        { pole: firstPole, intensity: 1 },
        { pole: secondPole, intensity: 1 },
        { pole: secondPole, intensity: 2 },
      ],
    );
    assert.deepEqual(
      question.options.map(({ id }) => id.replace(`${question.id}-`, '')),
      assessmentOptionSuffixes,
    );
    for (const option of question.options) {
      assert.ok(poleIds.includes(option.pole));
      assert.ok([1, 2].includes(option.intensity));
      assert.equal(Object.keys(option).sort().join(','), 'id,intensity,pole');
    }
  }
});

test('question metadata is language-neutral and contains no animal or personality assignment branches', () => {
  const source = readFileSync('src/features/assessment/data/questions.ts', 'utf8');
  const animalPattern = new RegExp(`\\b(?:${expectedMappings.map(([, id]) => id).join('|')})\\b`, 'i');
  const typePattern = new RegExp(`\\b(?:${personalityTypeIds.join('|')})\\b`);
  assert.doesNotMatch(source, animalPattern);
  assert.doesNotMatch(source, typePattern);
  assert.doesNotMatch(source, /[Α-Ωα-ω]/u);
  assert.doesNotMatch(source, /primaryAnimal|secondaryAnimal|candidateAnimal|personalityTitle/i);
});

test('ranking accepts only 1 through 4 exactly once', () => {
  const question = fixedAssessmentQuestions[0];
  const complete = firstPoleRanking(question);
  assert.equal(isCompleteRanking(question, complete), true);
  const answer = createAssessmentAnswer(question, complete);
  assert.equal(isValidAssessmentAnswer(question, answer), true);
  assert.deepEqual(answerToRankingDraft(answer), complete);
  assert.deepEqual(answer.rankings.map(({ rank }) => rank).sort(), [1, 2, 3, 4]);

  assert.equal(isCompleteRanking(question, { ...complete, [question.options[3].id]: 3 }), false);
  assert.equal(isCompleteRanking(question, { ...complete, [question.options[3].id]: undefined }), false);
  assert.equal(isCompleteRanking(question, { ...complete, unknown: 1 }), false);
  assert.throws(() => createAssessmentAnswer(question, {}), /requires each rank/);
  assert.deepEqual([1, 2, 3, 4].map(isAssessmentRank), [true, true, true, true]);
  assert.equal(isAssessmentRank(0), false);
  assert.equal(isAssessmentRank(5), false);
});

test('rank collisions swap ranked options and move from an owner to an unranked target', () => {
  const [first, second, third] = fixedAssessmentQuestions[0].options;
  const initial = { [first.id]: 4, [second.id]: 3 };
  const swapped = assignRank(initial, second.id, 4);
  assert.equal(swapped.behavior, 'swapped');
  assert.equal(swapped.displacedOptionId, first.id);
  assert.deepEqual(swapped.rankings, { [first.id]: 3, [second.id]: 4 });

  const moved = assignRank(initial, third.id, 4);
  assert.equal(moved.behavior, 'moved');
  assert.equal(moved.displacedOptionId, first.id);
  assert.deepEqual(moved.rankings, { [second.id]: 3, [third.id]: 4 });

  const assigned = assignRank(initial, third.id, 2);
  assert.equal(assigned.behavior, 'assigned');
  assert.deepEqual(assigned.rankings, { ...initial, [third.id]: 2 });

  const unchanged = assignRank(initial, first.id, 4);
  assert.equal(unchanged.behavior, 'unchanged');
  assert.strictEqual(unchanged.rankings, initial);
});

test('rank assignment normalization rejects malformed persisted permutations', () => {
  const question = fixedAssessmentQuestions[0];
  const answer = createAssessmentAnswer(question, firstPoleRanking(question));
  assert.deepEqual(normalizeRankAssignments(answer.rankings), answer.rankings);
  assert.equal(normalizeRankAssignments(answer.rankings.slice(0, 3)), null);
  assert.equal(normalizeRankAssignments([
    ...answer.rankings.slice(0, 3),
    { optionId: answer.rankings[3].optionId, rank: 9 },
  ]), null);
  assert.equal(normalizeRankAssignments('not-an-array'), null);
});

test('rank by intensity and phase weight calculations accumulate into the declared poles', () => {
  assert.equal(calculateBaseContribution(4, 2), 8);
  assert.equal(calculateBaseContribution(3, 1), 3);
  assert.equal(assessmentPhaseWeights.fixed, 1);
  assert.equal(assessmentPhaseWeights.adaptive, 0.75);
  assert.equal(calculateWeightedContribution(4, 2, 'fixed'), 8);
  assert.equal(calculateWeightedContribution(4, 2, 'adaptive'), 6);

  const fixedQuestion = fixedAssessmentQuestions.find(({ dimension }) => dimension === 'energy');
  const adaptiveQuestion = adaptiveQuestionBank.find(({ dimension }) => dimension === 'energy');
  assert.ok(fixedQuestion);
  assert.ok(adaptiveQuestion);
  const fixedAnswer = createAssessmentAnswer(fixedQuestion, firstPoleRanking(fixedQuestion));
  const adaptiveAnswer = createAssessmentAnswer(adaptiveQuestion, firstPoleRanking(adaptiveQuestion));
  const totals = calculatePoleTotals([fixedAnswer, adaptiveAnswer]);
  assert.deepEqual(totals, {
    ...createEmptyPoleScoreMap(),
    E: 19.25,
    I: 8.75,
  });
});

test('signed dimension normalization is finite, symmetric, and preserves exact balance', () => {
  const totals = createEmptyPoleScoreMap();
  totals.E = 11;
  totals.I = 5;
  const profile = calculateSignedDimensionProfile(totals);
  assert.equal(profile.energy, 0.375);
  assert.equal(profile.information, 0);
  assert.equal(profile.decisions, 0);
  assert.equal(profile.structure, 0);
  assert.deepEqual(findBalancedDimensions(totals), ['information', 'decisions', 'structure']);

  const reversed = createEmptyPoleScoreMap();
  reversed.E = 5;
  reversed.I = 11;
  assert.equal(calculateSignedDimensionProfile(reversed).energy, -0.375);
  assert.ok(Object.values(calculateAssessmentProfile([])).every((value) => value === 0));
});

test('adaptive dimensions are ordered deterministically and allocated exactly 2, 2, and 1', () => {
  const representative = createRepresentativeAssessmentSession('INTJ');
  const fixedAnswers = representative.answers.slice(0, fixedAssessmentQuestionCount);
  const orderedDimensions = orderDimensionsByFixedBalance(fixedAnswers);
  const selected = selectAdaptiveQuestions(fixedAnswers);
  const selectedAgain = selectAdaptiveQuestions(fixedAnswers);
  assert.deepEqual(adaptiveAllocation, [2, 2, 1, 0]);
  assert.deepEqual(selectedAgain, selected);
  assert.equal(selected.length, 5);
  assert.equal(new Set(selected.map(({ id }) => id)).size, 5);

  const counts = Object.fromEntries(dimensionIds.map((dimension) => [
    dimension,
    selected.filter((question) => question.dimension === dimension).length,
  ]));
  assert.equal(counts[orderedDimensions[0]], 2);
  assert.equal(counts[orderedDimensions[1]], 2);
  assert.equal(counts[orderedDimensions[2]], 1);
  assert.equal(counts[orderedDimensions[3]], 0);

  for (const dimension of dimensionIds) {
    const ids = selected.filter((question) => question.dimension === dimension).map(({ id }) => id);
    assert.deepEqual(ids, [...ids].sort());
  }
});

test('equal fixed balances use the declared dimension order and stable question IDs', () => {
  const fixedAnswers = fixedAssessmentQuestions.map((question, index) => {
    const preferredPole = index % 2 === 0
      ? dimensionDefinitions[question.dimension].firstPole
      : dimensionDefinitions[question.dimension].secondPole;
    return createAssessmentAnswer(question, createRankingDraftForPole(question, preferredPole));
  });
  const first = selectAdaptiveQuestionIds(fixedAnswers);
  const second = selectAdaptiveQuestionIds([...fixedAnswers].reverse());
  assert.deepEqual(first, second);
  assert.equal(first.length, 5);
  assert.equal(new Set(first).size, 5);
});

test('adaptive selection requires all twenty distinct complete fixed answers', () => {
  const fixedAnswers = createRepresentativeAssessmentSession('INTJ').answers.slice(0, 20);
  assert.throws(() => selectAdaptiveQuestionIds(fixedAnswers.slice(0, 19)), /requires all 20/);
  assert.throws(
    () => selectAdaptiveQuestionIds([...fixedAnswers.slice(0, 19), fixedAnswers[0]]),
    /distinct fixed-question answers/,
  );
});

test('session selects five adaptive questions only after fixed answer twenty', () => {
  const before = answerUntil(19);
  assert.equal(before.answers.length, 19);
  assert.deepEqual(before.adaptiveQuestionIds, []);
  assert.equal(getAssessmentQuestionSequence(before).length, 20);

  const question20 = getCurrentAssessmentQuestion(before);
  assert.ok(question20);
  const after = answerCurrentAssessmentQuestion(before, question20.id, firstPoleRanking(question20));
  assert.equal(after.answers.length, 20);
  assert.equal(after.adaptiveQuestionIds.length, 5);
  assert.equal(new Set(after.adaptiveQuestionIds).size, 5);
  assert.equal(getAssessmentQuestionSequence(after).length, 25);
  assert.equal(getCurrentAssessmentQuestion(after).id, after.adaptiveQuestionIds[0]);
  assert.deepEqual(after.adaptiveQuestionIds, selectAdaptiveQuestionIds(after.answers.slice(0, 20)));
});

test('a completed run contains exactly twenty fixed and five unique adaptive ranking answers', () => {
  const session = completeAssessmentWithRankingSelector(firstPoleRanking);
  assert.ok(session.result);
  assert.equal(session.answers.length, 25);
  assert.equal(session.currentQuestionIndex, 24);
  assert.equal(getCurrentAssessmentQuestion(session), null);
  assert.deepEqual(
    session.answers.slice(0, 20).map(({ questionId }) => questionId),
    fixedAssessmentQuestions.map(({ id }) => id),
  );
  assert.deepEqual(
    session.answers.slice(20).map(({ questionId }) => questionId),
    session.adaptiveQuestionIds,
  );
  assert.equal(session.adaptiveQuestionIds.length, 5);
  assert.equal(new Set(session.adaptiveQuestionIds).size, 5);
  assert.equal(new Set(session.answers.map(({ questionId }) => questionId)).size, 25);
  assert.ok(session.answers.every((answer) => answer.rankings.length === 4));
});

test('backward and forward navigation preserves rankings and fixed edits recalculate dependent state', () => {
  let session = answerUntil(3);
  const thirdAnswer = session.answers[2];
  session = goToPreviousAssessmentQuestion(session);
  assert.equal(session.currentQuestionIndex, 2);
  assert.deepEqual(getAssessmentAnswer(session, thirdAnswer.questionId), thirdAnswer);
  session = goToNextAssessmentQuestion(session);
  assert.equal(session.currentQuestionIndex, 3);
  assert.deepEqual(getAssessmentAnswer(session, thirdAnswer.questionId), thirdAnswer);

  session = answerUntil(20);
  const originalAdaptiveIds = session.adaptiveQuestionIds;
  session = goToPreviousAssessmentQuestion(session);
  const fixedQuestion20 = getCurrentAssessmentQuestion(session);
  assert.ok(fixedQuestion20);
  session = answerCurrentAssessmentQuestion(
    session,
    fixedQuestion20.id,
    secondPoleRanking(fixedQuestion20),
  );
  assert.equal(session.answers.length, 20);
  assert.equal(session.answers.some(({ questionId }) => originalAdaptiveIds.includes(questionId)), false);
  assert.deepEqual(session.adaptiveQuestionIds, selectAdaptiveQuestionIds(session.answers.slice(0, 20)));
});

test('incomplete, stale, unknown, and replayed answer actions cannot advance', () => {
  const session = createAssessmentSession();
  const question = getCurrentAssessmentQuestion(session);
  assert.ok(question);
  assert.throws(
    () => answerCurrentAssessmentQuestion(session, question.id, {}),
    /requires each rank/,
  );
  assert.throws(
    () => answerCurrentAssessmentQuestion(session, fixedAssessmentQuestions[1].id, firstPoleRanking(question)),
    /not the current assessment question/,
  );
  const advanced = answerCurrentAssessmentQuestion(session, question.id, firstPoleRanking(question));
  assert.throws(
    () => answerCurrentAssessmentQuestion(advanced, question.id, firstPoleRanking(question)),
    /not the current assessment question/,
  );
  assert.equal(advanced.answers.length, 1);
  assert.equal(goToNextAssessmentQuestion(createAssessmentSession()).currentQuestionIndex, 0);
});

test('all sixteen representative legal runs return their intended primary animals', () => {
  for (const [typeId, animalId] of expectedMappings) {
    const session = createRepresentativeAssessmentSession(typeId);
    assert.ok(session.result);
    assert.equal(session.answers.length, 25);
    assert.equal(session.adaptiveQuestionIds.length, 5);
    assert.equal(session.result.primaryTypeId, typeId);
    assert.equal(getPersonalityAnimal(session.result.primaryTypeId).animalId, animalId);
    assert.notEqual(session.result.primaryTypeId, session.result.secondaryTypeId);
  }
});

test('clear Raven, Otter, and Beaver fixtures stay deterministic', () => {
  for (const [typeId, animalId] of [
    ['INTJ', 'raven'],
    ['ENFP', 'otter'],
    ['ISTJ', 'beaver'],
  ]) {
    const first = createRepresentativeAssessmentSession(typeId);
    const second = createRepresentativeAssessmentSession(typeId);
    assert.strictEqual(second, first);
    assert.equal(first.result.primaryTypeId, typeId);
    assert.equal(getPersonalityAnimal(first.result.primaryTypeId).animalId, animalId);
  }
});

test('seeded complete runs are reproducible and always return distinct results', () => {
  for (const seed of [1, 17, 160425, 999999]) {
    const first = createSeededAssessmentSession(seed);
    const second = createSeededAssessmentSession(seed);
    assert.deepEqual(second, first);
    assert.equal(first.answers.length, 25);
    assert.equal(first.adaptiveQuestionIds.length, 5);
    assert.notEqual(first.result.primaryTypeId, first.result.secondaryTypeId);
  }
});

test('whole-profile distance evaluates all sixteen candidates and returns a true distinct runner-up', () => {
  const closeProfile = {
    energy: -1,
    information: -1,
    decisions: 1,
    structure: 0.1,
  };
  const matches = rankPersonalityTypes(closeProfile);
  assert.equal(matches.length, 16);
  assert.deepEqual(matches.slice(0, 2).map(({ personality }) => personality.id), ['INTJ', 'INTP']);
  assert.ok(matches.every((match, index) => index === 0 || match.distance >= matches[index - 1].distance));
  assert.equal(new Set(matches.map(({ personality }) => personality.id)).size, 16);
  assert.equal(calculateNormalizedDistance(closeProfile, matches[0].personality), matches[0].distance);
});

test('a one-dimension balanced close pair uses whole-profile support and deterministic order', () => {
  const balancedEnergyProfile = {
    energy: 0,
    information: -1,
    decisions: 1,
    structure: 1,
  };
  const matches = rankPersonalityTypes(balancedEnergyProfile);
  assert.equal(matches[0].distance, matches[1].distance);
  assert.deepEqual(matches.slice(0, 2).map(({ personality }) => personality.id), ['INTJ', 'ENTJ']);
});

test('exact ties retain balanced markers and never use randomness', () => {
  assert.deepEqual(exactTieProfile, {
    energy: 0,
    information: 0,
    decisions: 0,
    structure: 0,
  });
  const first = calculateAssessmentRanking([]);
  const second = calculateAssessmentRanking([]);
  assert.deepEqual(first, second);
  assert.deepEqual(first.result.balancedDimensionIds, dimensionIds);
  assert.deepEqual(first.matches.map(({ personality }) => personality.id), personalityTypeIds);
  assert.deepEqual(first.matches.map(({ distance }) => distance), Array(16).fill(1));
  assert.equal(first.result.primaryTypeId, 'INTJ');
  assert.equal(first.result.secondaryTypeId, 'INTP');
});

test('every canonical corner is its own zero-distance primary', () => {
  assert.ok(Object.values(matchingDimensionWeights).every((weight) => weight === 1));
  for (const typeId of personalityTypeIds) {
    const profile = createCanonicalProfile(typeId);
    const matches = rankPersonalityTypes(profile);
    assert.equal(matches[0].personality.id, typeId);
    assert.equal(matches[0].distance, 0);
    assert.equal(new Set(matches.map(({ personality }) => personality.id)).size, 16);
  }
});

test('restart clears only versioned assessment state', () => {
  const completed = completeAssessmentWithRankingSelector(firstPoleRanking);
  assert.ok(completed.result);
  assert.deepEqual(restartAssessmentSession(), {
    schemaVersion: 2,
    modelVersion: '16-personality-ranking-v1-25q',
    currentQuestionIndex: 0,
    answers: [],
    adaptiveQuestionIds: [],
    result: null,
  });

  const appearance = { language: 'el', mode: 'dark', colorTheme: 'plum' };
  const analyticsConsent = { consentState: 'rejected' };
  const state = { appearance, analyticsConsent, assessment: completed };
  const next = { ...state, assessment: restartAssessmentSession() };
  assert.strictEqual(next.appearance, appearance);
  assert.strictEqual(next.analyticsConsent, analyticsConsent);
});

test('engineering balance report checks structure, determinism, symmetry, reachability, and ties', () => {
  const report = analyzeAssessmentBalance(160425, 1024);
  assert.match(report.label, /Engineering balance check/i);
  assert.equal(report.fixedQuestionCount, 20);
  assert.equal(report.adaptiveBankCount, 16);
  assert.deepEqual(Object.values(report.fixedQuestionsPerDimension), [5, 5, 5, 5]);
  assert.deepEqual(Object.values(report.adaptiveQuestionsPerDimension), [4, 4, 4, 4]);
  assert.equal(report.optionStructureValid, true);
  assert.equal(report.uniqueAnimalCount, 16);
  assert.equal(report.uniqueTypeCount, 16);
  assert.equal(report.completeTypeCoverage, true);
  assert.equal(report.deterministicAdaptiveSelection, true);
  assert.equal(report.canonicalScoringSymmetry, true);
  assert.equal(report.exactTieHandlingDeterministic, true);
  assert.equal(report.primarySecondaryAlwaysDistinct, true);
  assert.deepEqual(report.unreachablePrimary, []);
  assert.deepEqual(report.unreachableSecondary, []);
});

test('technical assessment documentation matches the implemented formula and public boundary', () => {
  const path = 'docs/assessment/SIXTEEN_PERSONALITY_ANIMAL_MODEL.md';
  assert.equal(existsSync(path), true);
  assert.equal(existsSync('docs/assessment/TWELVE_ARCHETYPE_MODEL.md'), false);
  const report = readFileSync(path, 'utf8');
  assert.match(report, /16-personality-ranking-v1-25q/);
  assert.match(report, /20 fixed questions/i);
  assert.match(report, /five deterministic adaptive/i);
  assert.match(report, /2, 2, and 1/);
  assert.match(report, /assigned rank × option intensity × phase weight/i);
  assert.match(report, /adaptive \| `0\.75`/i);
  assert.match(report, /root-mean-square\s+distance/i);
  assert.match(report, /all 16/i);
  assert.match(report, /never public labels/i);
  for (const [typeId, animalId] of expectedMappings) {
    assert.match(report, new RegExp(`\\| ${'`'}${typeId}${'`'} \\| ${animalId}`, 'i'));
  }
});

test('ranked assessment UI exposes guide, live state, keyboard focus, and minimum target sizes', () => {
  const screen = readFileSync('src/features/assessment/components/AssessmentScreen.tsx', 'utf8');
  const card = readFileSync('src/features/assessment/components/RankingOptionCard.tsx', 'utf8');
  assert.match(screen, /accessibilityRole="progressbar"/);
  assert.match(screen, /accessibilityValue=\{\{ max: totalQuestions, min: 1, now: questionNumber \}\}/);
  assert.match(screen, /copy\.rankingGuideTitle/);
  assert.match(screen, /assessmentRankOrder\.map/);
  assert.match(screen, /isCompleteRanking/);
  assert.match(screen, /copy\.incompleteError/);
  assert.match(screen, /accessibilityRole=\{showIncompleteError \? 'alert' : undefined\}/);
  assert.match(screen, /rankSwappedAnnouncement/);
  assert.match(screen, /rankMovedAnnouncement/);
  assert.match(screen, /questionHeadingRef\.current\?\.focus\(\)/);
  assert.match(screen, /tabIndex=\{-1\}/);
  assert.match(screen, /canGoBack/);
  assert.doesNotMatch(screen, /horizontal=\{true\}|drag|drop/i);

  assert.match(card, /role="radiogroup"/);
  assert.match(card, /accessibilityRole="radio"/);
  assert.match(card, /accessibilityState=\{\{ checked: selected \}\}/);
  assert.match(card, /assessmentRankOrder = \[4, 3, 2, 1\]/);
  assert.match(card, /selectedMark/);
  assert.match(card, /flexWrap: 'wrap'/);
  assert.match(card, /minHeight: 52/);
  assert.match(card, /minWidth: 52/);
  assert.doesNotMatch(card, /numberOfLines|horizontal=\{true\}/);
});

test('analytics modules remain isolated from rankings, personality IDs, and animal results', () => {
  const sources = sourceFiles('src/features/analytics')
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
  assert.doesNotMatch(
    sources,
    /features\/(?:assessment|personalities|animals)|AssessmentAnswer|AssessmentResult|RankingDraft|adaptiveQuestion|primaryTypeId|secondaryTypeId|balancedDimension/i,
  );
  assert.doesNotMatch(
    sources,
    /assessment_start|assessment_complete|personality_result|animal_result|rank_assignment|dimension_score/i,
  );
});
