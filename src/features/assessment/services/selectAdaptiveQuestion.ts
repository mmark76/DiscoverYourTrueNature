import type { ArchetypeProfile } from '../../archetypes/data/archetypes.ts';
import type { DimensionId } from '../../archetypes/types.ts';
import {
  adaptiveQuestionBank,
  type AdaptiveAssessmentQuestionId,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type { AssessmentAnswer } from '../types.ts';
import {
  calculateAssessmentRanking,
  matchingDimensionWeights,
} from './scoreAssessment.ts';

const leadingCandidateCount = 3;

export function selectAdaptiveQuestion(
  answers: readonly AssessmentAnswer[],
  usedQuestionIds: readonly string[],
): AssessmentQuestionData {
  const used = new Set(usedQuestionIds);
  const candidates = calculateAssessmentRanking(answers)
    .matches
    .slice(0, leadingCandidateCount)
    .map(({ archetype }) => archetype);

  const rankedQuestions = adaptiveQuestionBank
    .map((question, bankIndex) => ({
      question,
      bankIndex,
      discrimination: calculateAdaptiveDiscrimination(question, candidates),
    }))
    .filter(({ question }) => !used.has(question.id))
    .sort((left, right) =>
      (right.discrimination - left.discrimination) || (left.bankIndex - right.bankIndex),
    );

  const selected = rankedQuestions[0]?.question;
  if (!selected) throw new Error('No unused adaptive assessment question is available.');
  return selected;
}

export function calculateAdaptiveDiscrimination(
  question: AssessmentQuestionData,
  candidates: readonly ArchetypeProfile[],
): number {
  if (candidates.length < 2) return 0;
  const dimensions = [question.primaryDimension, ...question.secondaryDimensions];

  return dimensions.reduce((total, dimension, index) => {
    const values = candidates.map(({ profile }) => profile[dimension]);
    const spread = Math.max(...values) - Math.min(...values);
    const primaryEmphasis = index === 0 ? 1.25 : 1;
    return total + spread * matchingDimensionWeights[dimension] * primaryEmphasis;
  }, 0);
}

export function isAdaptiveQuestionId(questionId: string): questionId is AdaptiveAssessmentQuestionId {
  return adaptiveQuestionBank.some(({ id }) => id === questionId);
}

export function getAdaptiveQuestionDimensions(
  question: AssessmentQuestionData,
): readonly DimensionId[] {
  return [question.primaryDimension, ...question.secondaryDimensions];
}
