import {
  canonicalArchetypes,
  type ArchetypeProfile,
} from '../../archetypes/data/archetypes.ts';
import {
  complementaryDimensionIds,
  createEmptyTraitMap,
  dimensionIds,
  primaryDimensionIds,
  type DimensionId,
  type SparseTraitVector,
  type TraitScoreMap,
} from '../../archetypes/types.ts';
import {
  assessmentQuestionById,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type {
  ArchetypeMatch,
  AssessmentAnswer,
  AssessmentRanking,
  AssessmentResult,
  AssessmentWeightClass,
} from '../types.ts';

export const questionWeightMultipliers = {
  normal: 1,
  lower: 0.45,
  differentiator: 0.6,
} as const satisfies Record<AssessmentWeightClass, number>;

export const matchingDimensionWeights: TraitScoreMap = {
  openness: 1,
  conscientiousness: 1,
  extraversion: 1,
  agreeableness: 1,
  emotionalStability: 1,
  independence: 0.55,
  initiative: 0.55,
  novelty: 0.55,
  directness: 0.55,
  flexibility: 0.55,
  fairness: 0.45,
};

export function calculateTraitProfile(answers: readonly AssessmentAnswer[]): TraitScoreMap {
  const totals = createEmptyTraitMap();
  const opportunities = createEmptyTraitMap();

  for (const answer of answers) {
    const question = getAssessmentQuestion(answer.questionId);
    const option = question.options.find(({ id }) => id === answer.optionId);
    if (!option) throw new Error(`Unknown option ${answer.optionId} for question ${answer.questionId}.`);
    const weight = questionWeightMultipliers[question.weightClass];

    for (const dimension of dimensionIds) {
      const vector: SparseTraitVector = option.vector;
      const value = vector[dimension] ?? 0;
      const capacity = maximumQuestionCapacity(question, dimension);
      totals[dimension] += value * weight;
      opportunities[dimension] += capacity * weight;
    }
  }

  return Object.fromEntries(dimensionIds.map((dimension) => {
    const opportunity = opportunities[dimension];
    const normalized = opportunity > 0 ? totals[dimension] / opportunity : 0;
    if (!Number.isFinite(normalized)) throw new Error(`Invalid trait score: ${dimension}`);
    return [dimension, clamp(normalized, -1, 1)];
  })) as TraitScoreMap;
}

export function calculateNormalizedDistance(
  profile: TraitScoreMap,
  archetype: ArchetypeProfile,
): number {
  let weightedSquaredDistance = 0;
  let totalWeight = 0;

  for (const dimension of dimensionIds) {
    const value = profile[dimension];
    if (!Number.isFinite(value)) throw new Error(`Invalid trait score: ${dimension}`);
    const weight = matchingDimensionWeights[dimension];
    const difference = value - archetype.profile[dimension];
    weightedSquaredDistance += difference * difference * weight;
    totalWeight += weight;
  }

  return Math.sqrt(weightedSquaredDistance / totalWeight);
}

export function rankArchetypes(profile: TraitScoreMap): readonly ArchetypeMatch[] {
  return canonicalArchetypes
    .map((archetype, canonicalIndex) => ({
      archetype,
      canonicalIndex,
      distance: calculateNormalizedDistance(profile, archetype),
    }))
    .sort((left, right) =>
      (left.distance - right.distance) || (left.canonicalIndex - right.canonicalIndex),
    )
    .map(({ archetype, distance }) => ({ archetype, distance }));
}

export function calculateAssessmentRanking(
  answers: readonly AssessmentAnswer[],
): AssessmentRanking {
  const profile = calculateTraitProfile(answers);
  const matches = rankArchetypes(profile);
  const primary = matches[0];
  const secondary = matches[1];
  if (!primary || !secondary || primary.archetype.id === secondary.archetype.id) {
    throw new Error('The assessment requires two distinct archetype matches.');
  }

  return {
    profile,
    matches,
    result: {
      primaryId: primary.archetype.id,
      secondaryId: secondary.archetype.id,
    },
  };
}

export function calculateAssessmentResult(
  answers: readonly AssessmentAnswer[],
): AssessmentResult {
  return calculateAssessmentRanking(answers).result;
}

export function getAssessmentQuestion(questionId: string): AssessmentQuestionData {
  const question = assessmentQuestionById.get(questionId);
  if (!question) throw new Error(`Unknown assessment question: ${questionId}.`);
  return question;
}

export function isPrimaryDimension(dimension: DimensionId): boolean {
  return (primaryDimensionIds as readonly DimensionId[]).includes(dimension);
}

export function isComplementaryDimension(dimension: DimensionId): boolean {
  return (complementaryDimensionIds as readonly DimensionId[]).includes(dimension);
}

function maximumQuestionCapacity(
  question: AssessmentQuestionData,
  dimension: DimensionId,
): number {
  return Math.max(...question.options.map((option) => {
    const vector: SparseTraitVector = option.vector;
    return Math.abs(vector[dimension] ?? 0);
  }));
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
