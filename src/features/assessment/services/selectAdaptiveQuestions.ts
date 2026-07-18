import {
  canonicalPersonalityAnimals,
  type PersonalityAnimalProfile,
} from '../../personalities/data/personalityAnimals.ts';
import {
  dimensionIds,
  type DimensionId,
  type DimensionProfile,
} from '../../personalities/types.ts';
import {
  adaptiveAssessmentQuestionCount,
  adaptiveQuestionBank,
  baseAssessmentQuestionCount,
  fixedAssessmentQuestions,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type {
  AssessmentAnswer,
  AssessmentContext,
  LockedPrimaryResult,
} from '../types.ts';
import { isValidAssessmentAnswer } from './selection.ts';
import {
  calculateAssessmentProfile,
  calculateLockedPrimaryResult,
  rankPersonalityTypes,
} from './scoreAssessment.ts';

export const adaptiveClosestCandidateCount = 4;
export const adaptiveAllocation = [2, 2, 1, 0] as const;
export const adaptiveQuestionSlots = [
  { dimensionRank: 0, context: 'personal' },
  { dimensionRank: 0, context: 'professional' },
  { dimensionRank: 1, context: 'personal' },
  { dimensionRank: 1, context: 'professional' },
  { dimensionRank: 2, context: 'professional' },
] as const satisfies readonly {
  dimensionRank: 0 | 1 | 2;
  context: AssessmentContext;
}[];

export interface AdaptiveDimensionPriority {
  dimension: DimensionId;
  candidatePairDisagreements: number;
  baseMagnitude: number;
}

export function countCandidatePairDisagreements(
  candidates: readonly PersonalityAnimalProfile[],
  dimension: DimensionId,
): number {
  let disagreements = 0;
  for (let left = 0; left < candidates.length; left += 1) {
    for (let right = left + 1; right < candidates.length; right += 1) {
      if (candidates[left]?.profile[dimension] !== candidates[right]?.profile[dimension]) {
        disagreements += 1;
      }
    }
  }
  return disagreements;
}

export function getClosestNonPrimaryCandidates(
  baseProfile: DimensionProfile,
  lockedPrimary: LockedPrimaryResult,
): readonly PersonalityAnimalProfile[] {
  return rankPersonalityTypes(baseProfile, lockedPrimary.primaryTypeId)
    .slice(0, adaptiveClosestCandidateCount)
    .map(({ personality }) => personality);
}

export function rankAdaptiveDimensions(
  baseAnswers: readonly AssessmentAnswer[],
  lockedPrimary: LockedPrimaryResult = calculateLockedPrimaryResult(baseAnswers),
): readonly AdaptiveDimensionPriority[] {
  validateCompleteBaseAnswers(baseAnswers);
  const baseProfile = calculateAssessmentProfile(baseAnswers);
  const candidates = getClosestNonPrimaryCandidates(baseProfile, lockedPrimary);
  return dimensionIds
    .map((dimension, canonicalIndex) => ({
      dimension,
      canonicalIndex,
      candidatePairDisagreements: countCandidatePairDisagreements(candidates, dimension),
      baseMagnitude: Math.abs(baseProfile[dimension]),
    }))
    .sort((left, right) =>
      (right.candidatePairDisagreements - left.candidatePairDisagreements)
      || (left.baseMagnitude - right.baseMagnitude)
      || (left.canonicalIndex - right.canonicalIndex),
    )
    .map(({ dimension, candidatePairDisagreements, baseMagnitude }) => ({
      dimension,
      candidatePairDisagreements,
      baseMagnitude,
    }));
}

export function orderAdaptiveDimensions(
  baseAnswers: readonly AssessmentAnswer[],
  lockedPrimary?: LockedPrimaryResult,
): readonly DimensionId[] {
  return rankAdaptiveDimensions(baseAnswers, lockedPrimary).map(({ dimension }) => dimension);
}

export const orderDimensionsByFixedBalance = orderAdaptiveDimensions;

export function selectAdaptiveQuestions(
  baseAnswers: readonly AssessmentAnswer[],
  lockedPrimary: LockedPrimaryResult = calculateLockedPrimaryResult(baseAnswers),
): readonly AssessmentQuestionData[] {
  validateCompleteBaseAnswers(baseAnswers);
  const orderedDimensions = orderAdaptiveDimensions(baseAnswers, lockedPrimary);
  const primary = canonicalPersonalityAnimals.find(({ id }) => id === lockedPrimary.primaryTypeId);
  if (!primary) throw new Error('Adaptive selection requires a valid locked primary result.');

  const selected = adaptiveQuestionSlots.map(({ dimensionRank, context }) => {
    const dimension = orderedDimensions[dimensionRank];
    if (!dimension) throw new Error('Adaptive selection could not rank enough dimensions.');
    const useReverseVariant = primary.profile[dimension] < 0;
    const question = adaptiveQuestionBank.find((candidate) =>
      candidate.dimension === dimension
      && candidate.context === context
      && candidate.reverseKeyed === useReverseVariant,
    );
    if (!question) throw new Error(`Missing adaptive ${context} question for ${dimension}.`);
    return question;
  });

  if (selected.length !== adaptiveAssessmentQuestionCount
    || new Set(selected.map(({ id }) => id)).size !== adaptiveAssessmentQuestionCount) {
    throw new Error('Adaptive selection must produce exactly five unique questions.');
  }
  if (selected.filter(({ context }) => context === 'personal').length !== 2
    || selected.filter(({ context }) => context === 'professional').length !== 3) {
    throw new Error('Adaptive selection must produce two personal and three professional questions.');
  }
  return selected;
}

export function selectAdaptiveQuestionIds(
  baseAnswers: readonly AssessmentAnswer[],
  lockedPrimary?: LockedPrimaryResult,
): readonly string[] {
  return selectAdaptiveQuestions(baseAnswers, lockedPrimary).map(({ id }) => id);
}

function validateCompleteBaseAnswers(baseAnswers: readonly AssessmentAnswer[]): void {
  if (baseAnswers.length !== baseAssessmentQuestionCount) {
    throw new Error(`Adaptive selection requires all ${baseAssessmentQuestionCount} base answers.`);
  }
  const answersById = new Map(baseAnswers.map((answer) => [answer.questionId, answer]));
  if (answersById.size !== baseAssessmentQuestionCount) {
    throw new Error('Adaptive selection requires distinct base-question answers.');
  }
  for (const question of fixedAssessmentQuestions) {
    const answer = answersById.get(question.id);
    if (!answer || !isValidAssessmentAnswer(question, answer)) {
      throw new Error(`Missing or invalid base answer: ${question.id}.`);
    }
  }
}
