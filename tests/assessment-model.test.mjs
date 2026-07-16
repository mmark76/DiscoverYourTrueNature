import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  assessmentModelVersion,
  canonicalArchetypes,
} from '../src/features/archetypes/data/archetypes.ts';
import {
  complementaryDimensionIds,
  dimensionIds,
  primaryDimensionIds,
} from '../src/features/archetypes/types.ts';
import {
  adaptiveQuestionBank,
  allAssessmentQuestions,
  completedAssessmentQuestionCount,
  fixedAssessmentQuestionCount,
  fixedAssessmentQuestions,
} from '../src/features/assessment/data/questions.ts';
import {
  createCanonicalProfile,
  createRepresentativeAssessmentSession,
  createSecondaryRepresentativeAssessmentSession,
} from '../src/features/assessment/services/assessmentFixtures.ts';
import {
  answerCurrentAssessmentQuestion,
  completeAssessmentWithOptionSelector,
  createAssessmentSession,
  getCurrentAssessmentQuestion,
  restartAssessmentSession,
} from '../src/features/assessment/services/assessmentSession.ts';
import {
  calculateAdaptiveDiscrimination,
  selectAdaptiveQuestion,
} from '../src/features/assessment/services/selectAdaptiveQuestion.ts';
import {
  calculateAssessmentRanking,
  calculateTraitProfile,
  matchingDimensionWeights,
  questionWeightMultipliers,
  rankArchetypes,
} from '../src/features/assessment/services/scoreAssessment.ts';

const expectedAnimalIds = [
  'wolf', 'owl', 'eagle', 'dolphin', 'bear', 'lion',
  'fox', 'panther', 'elephant', 'horse', 'turtle', 'octopus',
];

function completeWithFirstOptions() {
  return completeAssessmentWithOptionSelector((question) => question.options[0].id);
}

function answerUntil(answerCount, chooseOption = (question) => question.options[0].id) {
  let session = createAssessmentSession();
  while (session.answers.length < answerCount) {
    const question = getCurrentAssessmentQuestion(session);
    assert.ok(question);
    session = answerCurrentAssessmentQuestion(session, question.id, chooseOption(question, session));
  }
  return session;
}

function maximumQuestionCapacity(question, dimension) {
  return Math.max(...question.options.map(({ vector }) => Math.abs(vector[dimension] ?? 0)));
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

test('model v2 retains the twelve canonical identities and defines five primary plus six complementary dimensions', () => {
  assert.equal(assessmentModelVersion, '12-archetype-v2-25q');
  assert.deepEqual(canonicalArchetypes.map(({ id }) => id), expectedAnimalIds);
  assert.deepEqual(primaryDimensionIds, [
    'openness', 'conscientiousness', 'extraversion', 'agreeableness', 'emotionalStability',
  ]);
  assert.deepEqual(complementaryDimensionIds, [
    'independence', 'initiative', 'novelty', 'directness', 'flexibility', 'fairness',
  ]);
  assert.equal(dimensionIds.length, 11);
});

test('all twelve animal profiles are complete, bounded, finite, and meaningfully distinct', () => {
  const serializedProfiles = canonicalArchetypes.map(({ profile }) => JSON.stringify(profile));
  assert.equal(new Set(serializedProfiles).size, 12);
  for (const { profile } of canonicalArchetypes) {
    assert.deepEqual(Object.keys(profile), [...dimensionIds]);
    for (const value of Object.values(profile)) {
      assert.equal(Number.isFinite(value), true);
      assert.ok(value >= -1 && value <= 1);
    }
  }
  for (let left = 0; left < canonicalArchetypes.length; left += 1) {
    for (let right = left + 1; right < canonicalArchetypes.length; right += 1) {
      const distance = rankArchetypes(createCanonicalProfile(canonicalArchetypes[left].id))
        .find(({ archetype }) => archetype.id === canonicalArchetypes[right].id)?.distance;
      assert.ok(distance > 0.15);
    }
  }
});

test('metadata defines exactly 18 behavior and 5 preference questions before a ten-question adaptive bank', () => {
  assert.equal(fixedAssessmentQuestionCount, 23);
  assert.equal(completedAssessmentQuestionCount, 25);
  assert.equal(fixedAssessmentQuestions.filter(({ category }) => category === 'behavior').length, 18);
  assert.equal(fixedAssessmentQuestions.filter(({ category }) => category === 'preference').length, 5);
  assert.equal(adaptiveQuestionBank.length, 10);
  assert.ok(fixedAssessmentQuestions.every(({ adaptiveEligible }) => !adaptiveEligible));
  assert.ok(adaptiveQuestionBank.every(({ category, adaptiveEligible }) => category === 'adaptive' && adaptiveEligible));
});

test('behavior primary-dimension coverage is balanced across the five hidden primary dimensions', () => {
  const behaviorQuestions = fixedAssessmentQuestions.filter(({ category }) => category === 'behavior');
  const counts = primaryDimensionIds.map((dimension) =>
    behaviorQuestions.filter(({ primaryDimension }) => primaryDimension === dimension).length);
  assert.ok(counts.every((count) => count >= 3));
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
});

test('every question has four unique options, valid vectors, stable metadata, and no duplicate ID', () => {
  const questionIds = allAssessmentQuestions.map(({ id }) => id);
  const optionIds = allAssessmentQuestions.flatMap(({ options }) => options.map(({ id }) => id));
  assert.equal(new Set(questionIds).size, questionIds.length);
  assert.equal(new Set(optionIds).size, optionIds.length);
  assert.equal(optionIds.length, allAssessmentQuestions.length * 4);

  for (const question of allAssessmentQuestions) {
    assert.equal(question.options.length, 4);
    assert.ok(dimensionIds.includes(question.primaryDimension));
    assert.ok(question.secondaryDimensions.every((dimension) => dimensionIds.includes(dimension)));
    assert.ok(!question.secondaryDimensions.includes(question.primaryDimension));
    assert.equal(new Set(question.secondaryDimensions).size, question.secondaryDimensions.length);
    assert.ok(question.scenarioId.length > 0);
    const declaredDimensions = [question.primaryDimension, ...question.secondaryDimensions].sort();
    const scoredDimensions = [...new Set(question.options.flatMap(({ vector }) => Object.keys(vector)))].sort();
    assert.deepEqual(scoredDimensions, declaredDimensions);
    for (const option of question.options) {
      assert.ok(Object.keys(option.vector).length > 0);
      for (const [dimension, value] of Object.entries(option.vector)) {
        assert.ok(dimensionIds.includes(dimension));
        assert.equal(Number.isFinite(value), true);
        assert.ok(value >= -1 && value <= 1);
      }
    }
  }
});

test('the 23 fixed questions use distinct scenario identifiers and clearly ordered categories', () => {
  const scenarios = fixedAssessmentQuestions.map(({ scenarioId }) => scenarioId);
  assert.equal(new Set(scenarios).size, 23);
  assert.ok(fixedAssessmentQuestions.slice(0, 18).every(({ category }) => category === 'behavior'));
  assert.ok(fixedAssessmentQuestions.slice(18).every(({ category }) => category === 'preference'));
});

test('question scoring data is language-neutral, original, and contains no animal assignment branches', () => {
  const source = readFileSync('src/features/assessment/data/questions.ts', 'utf8');
  for (const id of expectedAnimalIds) assert.doesNotMatch(source, new RegExp(`\\b${id}\\b`, 'i'));
  assert.doesNotMatch(source, /[Α-Ωα-ω]/u);
  assert.doesNotMatch(source, /MBTI|DISC|HEXACO|MMPI|Hogan|EQ-i/i);
  assert.doesNotMatch(source, /primaryAnimal|secondaryAnimal|candidateAnimal/i);
});

test('behavior, preference, and adaptive weights have the documented controlled hierarchy', () => {
  assert.equal(questionWeightMultipliers.normal, 1);
  assert.equal(questionWeightMultipliers.lower, 0.45);
  assert.equal(questionWeightMultipliers.differentiator, 0.6);
  assert.ok(fixedAssessmentQuestions.slice(0, 18).every(({ weightClass }) => weightClass === 'normal'));
  assert.ok(fixedAssessmentQuestions.slice(18).every(({ weightClass }) => weightClass === 'lower'));
  assert.ok(adaptiveQuestionBank.every(({ weightClass }) => weightClass === 'differentiator'));

  for (const dimension of dimensionIds) {
    const fixedOpportunity = fixedAssessmentQuestions.reduce((total, question) =>
      total + (maximumQuestionCapacity(question, dimension)
        * questionWeightMultipliers[question.weightClass]), 0);
    const maximumAdaptiveOpportunity = adaptiveQuestionBank
      .map((question) => maximumQuestionCapacity(question, dimension)
        * questionWeightMultipliers[question.weightClass])
      .sort((left, right) => right - left)
      .slice(0, 2)
      .reduce((total, opportunity) => total + opportunity, 0);
    const adaptiveOpportunityShare = maximumAdaptiveOpportunity
      / (fixedOpportunity + maximumAdaptiveOpportunity);

    assert.ok(maximumAdaptiveOpportunity < fixedOpportunity, dimension);
    assert.ok(adaptiveOpportunityShare <= 0.4, dimension);
  }
});

test('all legal adaptive-answer combinations keep representative fixed profiles in control', () => {
  const maximumWeightedProfileDisplacement = 0.2;
  const totalMatchingWeight = Object.values(matchingDimensionWeights)
    .reduce((total, weight) => total + weight, 0);

  for (const archetype of canonicalArchetypes) {
    const representative = createRepresentativeAssessmentSession(archetype.id);
    let afterFixed = createAssessmentSession();
    for (const answer of representative.answers.slice(0, 23)) {
      afterFixed = answerCurrentAssessmentQuestion(afterFixed, answer.questionId, answer.optionId);
    }
    const fixedProfile = calculateTraitProfile(afterFixed.answers);
    const question24 = getCurrentAssessmentQuestion(afterFixed);
    assert.ok(question24);

    for (const option24 of question24.options) {
      const after24 = answerCurrentAssessmentQuestion(afterFixed, question24.id, option24.id);
      const question25 = getCurrentAssessmentQuestion(after24);
      assert.ok(question25);
      for (const option25 of question25.options) {
        const completed = answerCurrentAssessmentQuestion(after24, question25.id, option25.id);
        const finalProfile = calculateTraitProfile(completed.answers);
        const weightedSquaredDisplacement = dimensionIds.reduce((total, dimension) => {
          const difference = finalProfile[dimension] - fixedProfile[dimension];
          return total + (difference * difference * matchingDimensionWeights[dimension]);
        }, 0);
        const displacement = Math.sqrt(weightedSquaredDisplacement / totalMatchingWeight);
        assert.ok(
          displacement <= maximumWeightedProfileDisplacement,
          `${archetype.id} adaptive displacement ${displacement}`,
        );
      }
    }
  }
});

test('opportunity normalization produces finite bounded profiles across partial and complete answers', () => {
  for (const count of [0, 1, 10, 23, 24, 25]) {
    const session = answerUntil(count);
    const profile = calculateTraitProfile(session.answers);
    assert.deepEqual(Object.keys(profile), [...dimensionIds]);
    assert.ok(Object.values(profile).every((value) => Number.isFinite(value) && value >= -1 && value <= 1));
  }
});

test('a completed run contains exactly 23 fixed answers followed by two distinct adaptive answers', () => {
  const session = completeWithFirstOptions();
  assert.equal(session.answers.length, 25);
  assert.ok(session.result);
  assert.deepEqual(
    session.answers.slice(0, 23).map(({ questionId }) => questionId),
    fixedAssessmentQuestions.map(({ id }) => id),
  );
  assert.deepEqual(
    session.answers.slice(23).map(({ questionId }) => questionId),
    session.adaptiveQuestionIds,
  );
  assert.equal(session.adaptiveQuestionIds.length, 2);
  assert.equal(new Set(session.adaptiveQuestionIds).size, 2);
  assert.ok(session.adaptiveQuestionIds.every((id) => adaptiveQuestionBank.some((question) => question.id === id)));
  assert.equal(new Set(session.answers.map(({ questionId }) => questionId)).size, 25);
});

test('the first adaptive question is selected only after answer 23 and the second only after answer 24', () => {
  const beforeAdaptive = answerUntil(22);
  assert.deepEqual(beforeAdaptive.adaptiveQuestionIds, []);
  const question23 = getCurrentAssessmentQuestion(beforeAdaptive);
  assert.ok(question23);
  const after23 = answerCurrentAssessmentQuestion(beforeAdaptive, question23.id, question23.options[0].id);
  assert.equal(after23.answers.length, 23);
  assert.equal(after23.adaptiveQuestionIds.length, 1);
  const question24 = getCurrentAssessmentQuestion(after23);
  assert.equal(question24.id, after23.adaptiveQuestionIds[0]);
  const after24 = answerCurrentAssessmentQuestion(after23, question24.id, question24.options[0].id);
  assert.equal(after24.adaptiveQuestionIds.length, 2);
  assert.notEqual(after24.adaptiveQuestionIds[0], after24.adaptiveQuestionIds[1]);
});

test('adaptive selection maximizes declared candidate-profile spread and recomputes after question 24', () => {
  const after23 = answerUntil(23);
  const ranking23 = calculateAssessmentRanking(after23.answers);
  const leaders23 = ranking23.matches.slice(0, 3).map(({ archetype }) => archetype);
  const selected23 = selectAdaptiveQuestion(after23.answers, []);
  const best23 = Math.max(...adaptiveQuestionBank.map((question) =>
    calculateAdaptiveDiscrimination(question, leaders23)));
  assert.equal(calculateAdaptiveDiscrimination(selected23, leaders23), best23);

  const question24 = getCurrentAssessmentQuestion(after23);
  const after24 = answerCurrentAssessmentQuestion(after23, question24.id, question24.options[2].id);
  const selected24 = selectAdaptiveQuestion(after24.answers, after24.adaptiveQuestionIds.slice(0, 1));
  assert.equal(after24.adaptiveQuestionIds[1], selected24.id);
  assert.notEqual(after24.adaptiveQuestionIds[0], after24.adaptiveQuestionIds[1]);
});

test('identical answers produce identical adaptive questions, profiles, and results', () => {
  const first = completeWithFirstOptions();
  const second = completeWithFirstOptions();
  assert.deepEqual(first, second);
  assert.deepEqual(calculateAssessmentRanking(first.answers), calculateAssessmentRanking(second.answers));
});

test('primary and secondary results are always distinct across representative and seeded response patterns', () => {
  for (const archetype of canonicalArchetypes) {
    const session = createRepresentativeAssessmentSession(archetype.id);
    assert.ok(session.result);
    assert.notEqual(session.result.primaryId, session.result.secondaryId);
  }
  for (let offset = 0; offset < 4; offset += 1) {
    const session = completeAssessmentWithOptionSelector((question, current) =>
      question.options[(current.answers.length + offset) % 4].id);
    assert.notEqual(session.result.primaryId, session.result.secondaryId);
  }
});

test('every canonical animal is reachable as primary through a complete plausible 25-answer run', () => {
  const results = canonicalArchetypes.map(({ id }) => createRepresentativeAssessmentSession(id));
  assert.deepEqual(results.map(({ result }) => result.primaryId), expectedAnimalIds);
  for (const session of results) {
    assert.equal(session.answers.length, 25);
    assert.equal(session.adaptiveQuestionIds.length, 2);
    assert.equal(new Set(session.answers.map(({ questionId }) => questionId)).size, 25);
  }
});

test('every canonical animal is reachable as secondary through a legal complete 25-answer run', () => {
  const sessions = canonicalArchetypes.map(({ id }) =>
    createSecondaryRepresentativeAssessmentSession(id));
  assert.deepEqual(sessions.map(({ result }) => result.secondaryId), expectedAnimalIds);
  for (const session of sessions) {
    assert.equal(session.answers.length, 25);
    assert.equal(session.adaptiveQuestionIds.length, 2);
    assert.equal(new Set(session.adaptiveQuestionIds).size, 2);
    assert.equal(new Set(session.answers.map(({ questionId }) => questionId)).size, 25);
    assert.notEqual(session.result.primaryId, session.result.secondaryId);
  }
});

test('all twelve canonical profiles remain direct primaries, including animals beyond the original first five', () => {
  const primaryIds = canonicalArchetypes.map(({ id }) =>
    rankArchetypes(createCanonicalProfile(id))[0].archetype.id);
  assert.deepEqual(primaryIds, expectedAnimalIds);
  assert.deepEqual(primaryIds.slice(5), expectedAnimalIds.slice(5));
});

test('adaptive routes vary across representative profiles instead of always using one pair', () => {
  const pairs = canonicalArchetypes.map(({ id }) =>
    createRepresentativeAssessmentSession(id).adaptiveQuestionIds.join('+'));
  assert.ok(new Set(pairs).size >= 3);
});

test('exact-distance ties use canonical order independent of profile property order', () => {
  const [wolf, owl] = canonicalArchetypes;
  const midpointEntries = dimensionIds.map((dimension) => [
    dimension,
    (wolf.profile[dimension] + owl.profile[dimension]) / 2,
  ]);
  const forward = Object.fromEntries(midpointEntries);
  const reversed = Object.fromEntries([...midpointEntries].reverse());
  const firstRanking = rankArchetypes(forward);
  const secondRanking = rankArchetypes(reversed);
  assert.equal(firstRanking[0].distance, firstRanking[1].distance);
  assert.deepEqual(firstRanking.map(({ archetype }) => archetype.id), secondRanking.map(({ archetype }) => archetype.id));
  assert.deepEqual(firstRanking.slice(0, 2).map(({ archetype }) => archetype.id), ['wolf', 'owl']);
});

test('invalid, stale, or repeated answer activation cannot skip the current question', () => {
  const session = createAssessmentSession();
  const question = getCurrentAssessmentQuestion(session);
  assert.ok(question);
  assert.throws(
    () => answerCurrentAssessmentQuestion(session, fixedAssessmentQuestions[1].id, fixedAssessmentQuestions[1].options[0].id),
    /not the current assessment question/,
  );
  assert.throws(
    () => answerCurrentAssessmentQuestion(session, question.id, 'not-an-option'),
    /does not belong/,
  );
  const advanced = answerCurrentAssessmentQuestion(session, question.id, question.options[0].id);
  assert.throws(
    () => answerCurrentAssessmentQuestion(advanced, question.id, question.options[0].id),
    /not the current assessment question/,
  );
});

test('restart clears all answers, adaptive choices, and result', () => {
  const completed = completeWithFirstOptions();
  assert.ok(completed.result);
  assert.deepEqual(restartAssessmentSession(), {
    answers: [], adaptiveQuestionIds: [], result: null,
  });
  assert.equal(getCurrentAssessmentQuestion(restartAssessmentSession()).id, fixedAssessmentQuestions[0].id);
});

test('restart replaces only assessment state and preserves language, appearance, and analytics consent', () => {
  const appearance = { language: 'el', mode: 'dark', colorTheme: 'plum', fontFamily: 'serif', textSize: 'extra-large' };
  const analyticsConsent = { consentState: 'rejected' };
  const state = { appearance, analyticsConsent, assessment: completeWithFirstOptions() };
  const next = { ...state, assessment: restartAssessmentSession() };
  assert.strictEqual(next.appearance, appearance);
  assert.strictEqual(next.analyticsConsent, analyticsConsent);
  assert.deepEqual(next.assessment, { answers: [], adaptiveQuestionIds: [], result: null });
});

test('the developer report audits every question and documents normalization, adaptivity, and tie-breaking', () => {
  const report = readFileSync('docs/assessment/TWELVE_ARCHETYPE_MODEL.md', 'utf8');
  for (const question of allAssessmentQuestions) {
    const row = [
      question.id,
      question.category,
      question.scenarioId,
      question.primaryDimension,
      question.secondaryDimensions.join(', '),
      question.weightClass,
    ];
    for (const value of row) assert.ok(report.includes(value), `Missing audit value: ${value}`);
  }
  assert.match(report, /opportunity normalization/i);
  assert.match(report, /leading three animal\s+profiles/i);
  assert.match(report, /canonical catalog order/i);
  assert.match(report, /not a scientific\s+personality diagnosis/i);
});

test('visible result content is limited to two localized animal names and one restart action', () => {
  const source = readFileSync('src/features/results/components/ResultScreen.tsx', 'utf8');
  assert.match(source, /copy\.primaryAnimal/);
  assert.match(source, /primaryName/);
  assert.match(source, /copy\.secondaryAnimal/);
  assert.match(source, /secondaryName/);
  assert.match(source, /copy\.restart/);
  assert.match(source, /revealHeadingRef\.current\?\.focus\(\)/);
  assert.match(source, /tabIndex=\{-1\}/);
  assert.match(source, /accessibilityLiveRegion="polite"/);
  assert.equal((source.match(/<FocusablePressable/g) ?? []).length, 1);
  assert.doesNotMatch(source, /matchStrength|confidence|ResultRanking|\branking\b|\bchart\b|strengths|watchOuts|copy\.description|traitLabel|dimensionScore|onHome|sharePrompt|score\s*\}%/i);
  assert.equal(existsSync('src/features/results/components/ResultRanking.tsx'), false);
});

test('assessment UI keeps accessible progress, live updates, responsive text, and minimum target sizes', () => {
  const screen = readFileSync('src/features/assessment/components/AssessmentScreen.tsx', 'utf8');
  const option = readFileSync('src/features/assessment/components/OptionButton.tsx', 'utf8');
  assert.match(screen, /accessibilityRole="progressbar"/);
  assert.match(screen, /accessibilityValue=\{\{ max: totalQuestions, min: 1, now: questionNumber \}\}/);
  assert.match(screen, /accessibilityLiveRegion="polite"/);
  assert.match(screen, /questionHeadingRef\.current\?\.focus\(\)/);
  assert.match(screen, /tabIndex=\{-1\}/);
  assert.match(screen, /questionNumber === 1/);
  assert.match(option, /minHeight: 52/);
  assert.doesNotMatch(`${screen}\n${option}`, /numberOfLines|horizontal=\{true\}|height:\s*\d+.*label/);
});

test('App keeps assessment state separate from language, appearance, consent, routing, and shared shell', () => {
  const app = readFileSync('App.tsx', 'utf8');
  assert.match(app, /useState\(createAssessmentSession\)/);
  assert.match(app, /setAssessmentSession\(restartAssessmentSession\(\)\)/);
  assert.match(app, /AppearanceProvider>[\s\S]*AnalyticsConsentProvider>[\s\S]*Ga4ConsentBridge/);
  assert.match(app, /<AppShell/);
  assert.doesNotMatch(app.match(/function openSettings\(\)[\s\S]*?\n  \}/)?.[0] ?? '', /setAssessmentSession/);
});

test('analytics modules import no assessment state and expose no answer, trait, adaptive, or animal-result payload', () => {
  const sources = sourceFiles('src/features/analytics').map((path) => readFileSync(path, 'utf8')).join('\n');
  assert.doesNotMatch(sources, /features\/assessment|features\/archetypes|AssessmentAnswer|TraitScoreMap|adaptiveQuestion|primaryId|secondaryId|candidateAnimal/i);
  assert.doesNotMatch(sources, /assessment_start|assessment_complete|animal_result|trait_score|question_answer/i);
});

test('matching dimension weights emphasize the five primary dimensions without ignoring complementary signals', () => {
  assert.ok(primaryDimensionIds.every((dimension) => matchingDimensionWeights[dimension] === 1));
  assert.ok(complementaryDimensionIds.every((dimension) =>
    matchingDimensionWeights[dimension] > 0 && matchingDimensionWeights[dimension] < 1));
});
