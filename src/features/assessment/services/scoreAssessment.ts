import {
  canonicalPersonalityAnimals,
  type PersonalityAnimalProfile,
} from '../../personalities/data/personalityAnimals.ts';
import {
  createEmptyDimensionProfile,
  createEmptyPoleScoreMap,
  dimensionDefinitions,
  dimensionIds,
  type DimensionId,
  type DimensionProfile,
  type PoleId,
  type PoleScoreMap,
} from '../../personalities/types.ts';
import {
  assessmentPhaseWeights,
  assessmentQuestionById,
  baseAssessmentQuestionCount,
  isFixedAssessmentQuestionId,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type {
  AssessmentAnswer,
  AssessmentContext,
  AssessmentPhase,
  AssessmentResult,
  ContextProfileDirection,
  ContextProfileObservation,
  LockedPrimaryResult,
  PersonalityMatch,
} from '../types.ts';
import { isValidAssessmentAnswer } from './selection.ts';

export { assessmentPhaseWeights };

/** Product-design thresholds, not validated psychometric coefficients. */
export const closeMatchDistanceGapThreshold = 0.08;
export const contextProfileDifferenceThreshold = 0.4;

export const matchingDimensionWeights: DimensionProfile = {
  energy: 1,
  information: 1,
  decisions: 1,
  structure: 1,
};

export function calculateWeightedContribution(
  direction: 1 | -1,
  phaseOrWeight: AssessmentPhase | number,
): number {
  const weight = typeof phaseOrWeight === 'number'
    ? phaseOrWeight
    : assessmentPhaseWeights[phaseOrWeight];
  return direction * weight;
}

export function calculateAnswerContribution(
  question: AssessmentQuestionData,
  selectedOptionId: string,
): number {
  const option = question.options.find(({ id }) => id === selectedOptionId);
  if (!option) throw new Error(`Unknown option ${selectedOptionId} for question ${question.id}.`);
  const { firstPole } = dimensionDefinitions[question.dimension];
  return calculateWeightedContribution(option.pole === firstPole ? 1 : -1, question.weight);
}

export function calculatePoleTotals(answers: readonly AssessmentAnswer[]): PoleScoreMap {
  const totals = createEmptyPoleScoreMap();
  for (const answer of answers) {
    const questionId = answer.questionId;
    const question = getAssessmentQuestion(questionId);
    if (!isValidAssessmentAnswer(question, answer)) {
      throw new Error(`Invalid binary answer for question ${questionId}.`);
    }
    const option = question.options.find(({ id }) => id === answer.selectedOptionId);
    if (!option) throw new Error(`Unknown option for question ${answer.questionId}.`);
    totals[option.pole] += question.weight;
  }
  return totals;
}

export function calculateSignedDimensionProfile(
  poleTotals: PoleScoreMap,
): DimensionProfile {
  const profile = createEmptyDimensionProfile();
  for (const dimension of dimensionIds) {
    const { firstPole, secondPole } = dimensionDefinitions[dimension];
    const firstTotal = poleTotals[firstPole];
    const secondTotal = poleTotals[secondPole];
    const answeredWeight = firstTotal + secondTotal;
    profile[dimension] = answeredWeight === 0
      ? 0
      : clamp((firstTotal - secondTotal) / answeredWeight, -1, 1);
  }
  return profile;
}

export function calculateAssessmentProfile(
  answers: readonly AssessmentAnswer[],
): DimensionProfile {
  return calculateSignedDimensionProfile(calculatePoleTotals(answers));
}

export function findBalancedDimensions(
  profile: DimensionProfile,
): readonly DimensionId[] {
  return dimensionIds.filter((dimension) => profile[dimension] === 0);
}

export function calculateNormalizedDistance(
  profile: DimensionProfile,
  personality: PersonalityAnimalProfile,
): number {
  let weightedSquaredDistance = 0;
  let totalWeight = 0;
  for (const dimension of dimensionIds) {
    const value = profile[dimension];
    if (!Number.isFinite(value)) throw new Error(`Invalid dimension score: ${dimension}.`);
    const weight = matchingDimensionWeights[dimension];
    const difference = value - personality.profile[dimension];
    weightedSquaredDistance += difference * difference * weight;
    totalWeight += weight;
  }
  return Math.sqrt(weightedSquaredDistance / totalWeight);
}

export function rankPersonalityTypes(
  profile: DimensionProfile,
  excludedTypeId?: LockedPrimaryResult['primaryTypeId'],
): readonly PersonalityMatch[] {
  return canonicalPersonalityAnimals
    .map((personality, canonicalIndex) => ({
      personality,
      canonicalIndex,
      distance: calculateNormalizedDistance(profile, personality),
    }))
    .filter(({ personality }) => personality.id !== excludedTypeId)
    .sort((left, right) =>
      (left.distance - right.distance) || (left.canonicalIndex - right.canonicalIndex),
    )
    .map(({ personality, distance }) => ({ personality, distance }));
}

export function calculateLockedPrimaryResult(
  baseAnswers: readonly AssessmentAnswer[],
): LockedPrimaryResult {
  assertCompleteBaseAnswers(baseAnswers);
  const profile = calculateAssessmentProfile(baseAnswers);
  const matches = rankPersonalityTypes(profile);
  const primary = matches[0];
  const runnerUp = matches[1];
  if (!primary || !runnerUp) throw new Error('The assessment requires at least two matches.');
  return {
    primaryTypeId: primary.personality.id,
    balancedDimensionIds: findBalancedDimensions(profile),
    hasCloseMatch: runnerUp.distance - primary.distance <= closeMatchDistanceGapThreshold,
  };
}

export const lockPrimaryAssessmentResult = calculateLockedPrimaryResult;

export function calculateFinalAssessmentResult(
  answers: readonly AssessmentAnswer[],
  lockedPrimary: LockedPrimaryResult,
): AssessmentResult {
  if (answers.length !== baseAssessmentQuestionCount + 5) {
    throw new Error('Final assessment scoring requires all 30 answers.');
  }
  const profile = calculateAssessmentProfile(answers);
  const secondary = rankPersonalityTypes(profile, lockedPrimary.primaryTypeId)[0];
  if (!secondary) throw new Error('The assessment requires a distinct secondary match.');
  return {
    ...lockedPrimary,
    assessmentMode: 'long',
    secondaryTypeId: secondary.personality.id,
  };
}

export const calculateAssessmentResult = calculateFinalAssessmentResult;

export function calculateContextProfiles(
  answers: readonly AssessmentAnswer[],
): Readonly<Record<AssessmentContext, DimensionProfile>> {
  const baseAnswers = answers.filter(({ questionId }) => isFixedAssessmentQuestionId(questionId));
  return {
    personal: calculateAssessmentProfile(baseAnswers.filter(({ questionId }) =>
      getAssessmentQuestion(questionId).context === 'personal')),
    professional: calculateAssessmentProfile(baseAnswers.filter(({ questionId }) =>
      getAssessmentQuestion(questionId).context === 'professional')),
  };
}

export function getContextProfileObservation(
  answers: readonly AssessmentAnswer[],
): ContextProfileObservation | null {
  const profiles = calculateContextProfiles(answers);
  const differences = dimensionIds
    .map((dimension, index) => ({
      dimension,
      index,
      difference: profiles.personal[dimension] - profiles.professional[dimension],
    }))
    .sort((left, right) =>
      (Math.abs(right.difference) - Math.abs(left.difference)) || (left.index - right.index),
    );
  const strongest = differences[0];
  if (!strongest || Math.abs(strongest.difference) < contextProfileDifferenceThreshold) {
    return null;
  }
  return {
    dimension: strongest.dimension,
    kind: contextProfileKind(
      profiles.personal[strongest.dimension],
      profiles.professional[strongest.dimension],
    ),
    personalDirection: profileDirection(profiles.personal[strongest.dimension]),
    professionalDirection: profileDirection(profiles.professional[strongest.dimension]),
  };
}

export function getAssessmentQuestion(questionId: string): AssessmentQuestionData {
  const question = assessmentQuestionById.get(questionId);
  if (!question) throw new Error(`Unknown assessment question: ${questionId}.`);
  return question;
}

function assertCompleteBaseAnswers(baseAnswers: readonly AssessmentAnswer[]): void {
  if (baseAnswers.length !== baseAssessmentQuestionCount) {
    throw new Error('Primary scoring requires all 25 base answers.');
  }
  const expectedIds = new Set<string>(
    [...assessmentQuestionById.values()]
      .filter(({ phase }) => phase !== 'adaptive')
      .map(({ id }) => id),
  );
  if (new Set(baseAnswers.map(({ questionId }) => questionId)).size !== baseAssessmentQuestionCount
    || baseAnswers.some(({ questionId }) => !expectedIds.has(questionId))) {
    throw new Error('Primary scoring requires 25 distinct base-question answers.');
  }
}

function profileDirection(value: number): ContextProfileDirection {
  if (value > 0) return 'first';
  if (value < 0) return 'second';
  return 'balanced';
}

function contextProfileKind(
  personalValue: number,
  professionalValue: number,
): ContextProfileObservation['kind'] {
  if (personalValue !== 0 && professionalValue !== 0
    && Math.sign(personalValue) !== Math.sign(professionalValue)) {
    return 'context-dependent';
  }
  return Math.abs(personalValue) >= Math.abs(professionalValue)
    ? 'personal-stronger'
    : 'professional-stronger';
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
