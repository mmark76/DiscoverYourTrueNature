import {
  dimensionIds,
  type DimensionId,
} from '../../personalities/types.ts';
import {
  adaptiveAssessmentQuestionCount,
  adaptiveQuestionBank,
  fixedAssessmentQuestionCount,
  fixedAssessmentQuestions,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type { AssessmentAnswer } from '../types.ts';
import { isValidAssessmentAnswer } from './ranking.ts';
import { calculateAssessmentProfile } from './scoreAssessment.ts';

export const adaptiveAllocation = [2, 2, 1, 0] as const;

export function orderDimensionsByFixedBalance(
  fixedAnswers: readonly AssessmentAnswer[],
): readonly DimensionId[] {
  validateCompleteFixedAnswers(fixedAnswers);
  const profile = calculateAssessmentProfile(fixedAnswers);

  return [...dimensionIds].sort((left, right) => {
    const balanceDifference = Math.abs(profile[left]) - Math.abs(profile[right]);
    return balanceDifference || dimensionIds.indexOf(left) - dimensionIds.indexOf(right);
  });
}

export function selectAdaptiveQuestions(
  fixedAnswers: readonly AssessmentAnswer[],
): readonly AssessmentQuestionData[] {
  const orderedDimensions = orderDimensionsByFixedBalance(fixedAnswers);
  const selected = orderedDimensions.flatMap((dimension, dimensionIndex) => {
    const count = adaptiveAllocation[dimensionIndex] ?? 0;
    return adaptiveQuestionBank
      .filter((question) => question.dimension === dimension)
      .sort((left, right) => compareStableIds(left.id, right.id))
      .slice(0, count);
  });

  if (selected.length !== adaptiveAssessmentQuestionCount) {
    throw new Error(`Adaptive selection requires exactly ${adaptiveAssessmentQuestionCount} questions.`);
  }
  if (new Set(selected.map(({ id }) => id)).size !== selected.length) {
    throw new Error('Adaptive selection produced a duplicate question.');
  }
  return selected;
}

export function selectAdaptiveQuestionIds(
  fixedAnswers: readonly AssessmentAnswer[],
): readonly string[] {
  return selectAdaptiveQuestions(fixedAnswers).map(({ id }) => id);
}

function validateCompleteFixedAnswers(fixedAnswers: readonly AssessmentAnswer[]): void {
  if (fixedAnswers.length !== fixedAssessmentQuestionCount) {
    throw new Error(`Adaptive selection requires all ${fixedAssessmentQuestionCount} fixed answers.`);
  }
  const answersById = new Map(fixedAnswers.map((answer) => [answer.questionId, answer]));
  if (answersById.size !== fixedAssessmentQuestionCount) {
    throw new Error('Adaptive selection requires distinct fixed-question answers.');
  }
  for (const question of fixedAssessmentQuestions) {
    const answer = answersById.get(question.id);
    if (!answer || !isValidAssessmentAnswer(question, answer)) {
      throw new Error(`Missing or invalid fixed answer: ${question.id}.`);
    }
  }
}

function compareStableIds(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}
