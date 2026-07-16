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
  type PoleScoreMap,
} from '../../personalities/types.ts';
import {
  assessmentQuestionById,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type {
  AssessmentAnswer,
  AssessmentOptionIntensity,
  AssessmentQuestionKind,
  AssessmentRank,
  AssessmentRanking,
  AssessmentResult,
  PersonalityMatch,
} from '../types.ts';
import { isValidAssessmentAnswer } from './ranking.ts';

export const assessmentPhaseWeights = {
  fixed: 1,
  adaptive: 0.75,
} as const satisfies Record<AssessmentQuestionKind, number>;

export const matchingDimensionWeights: DimensionProfile = {
  energy: 1,
  information: 1,
  decisions: 1,
  structure: 1,
};

export function calculateBaseContribution(
  rank: AssessmentRank,
  intensity: AssessmentOptionIntensity,
): number {
  return rank * intensity;
}

export function calculateWeightedContribution(
  rank: AssessmentRank,
  intensity: AssessmentOptionIntensity,
  questionKind: AssessmentQuestionKind,
): number {
  return calculateBaseContribution(rank, intensity) * assessmentPhaseWeights[questionKind];
}

export function calculatePoleTotals(answers: readonly AssessmentAnswer[]): PoleScoreMap {
  const totals = createEmptyPoleScoreMap();

  for (const answer of answers) {
    const question = getAssessmentQuestion(answer.questionId);
    if (!isValidAssessmentAnswer(question, answer)) {
      throw new Error(`Invalid ranking answer for question ${answer.questionId}.`);
    }

    for (const assignment of answer.rankings) {
      const option = question.options.find(({ id }) => id === assignment.optionId);
      if (!option) {
        throw new Error(`Unknown option ${assignment.optionId} for question ${answer.questionId}.`);
      }
      totals[option.pole] += calculateWeightedContribution(
        assignment.rank,
        option.intensity,
        question.kind,
      );
    }
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
    const opportunity = firstTotal + secondTotal;
    profile[dimension] = opportunity === 0
      ? 0
      : clamp((firstTotal - secondTotal) / opportunity, -1, 1);
  }

  return profile;
}

export function calculateAssessmentProfile(
  answers: readonly AssessmentAnswer[],
): DimensionProfile {
  return calculateSignedDimensionProfile(calculatePoleTotals(answers));
}

export function findBalancedDimensions(poleTotals: PoleScoreMap): readonly DimensionId[] {
  return dimensionIds.filter((dimension) => {
    const { firstPole, secondPole } = dimensionDefinitions[dimension];
    return poleTotals[firstPole] === poleTotals[secondPole];
  });
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
): readonly PersonalityMatch[] {
  return canonicalPersonalityAnimals
    .map((personality, canonicalIndex) => ({
      personality,
      canonicalIndex,
      distance: calculateNormalizedDistance(profile, personality),
    }))
    .sort((left, right) =>
      (left.distance - right.distance) || (left.canonicalIndex - right.canonicalIndex),
    )
    .map(({ personality, distance }) => ({ personality, distance }));
}

export function calculateAssessmentRanking(
  answers: readonly AssessmentAnswer[],
): AssessmentRanking {
  const poleTotals = calculatePoleTotals(answers);
  const profile = calculateSignedDimensionProfile(poleTotals);
  const matches = rankPersonalityTypes(profile);
  const primary = matches[0];
  const secondary = matches[1];
  if (!primary || !secondary || primary.personality.id === secondary.personality.id) {
    throw new Error('The assessment requires two distinct personality matches.');
  }

  return {
    poleTotals,
    profile,
    matches,
    result: {
      primaryTypeId: primary.personality.id,
      secondaryTypeId: secondary.personality.id,
      balancedDimensionIds: findBalancedDimensions(poleTotals),
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

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
