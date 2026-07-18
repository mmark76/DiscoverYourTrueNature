import {
  createEmptyPoleScoreMap,
  dimensionDefinitions,
  type DimensionProfile,
  type PoleScoreMap,
} from '../../personalities/types.ts';
import {
  shortAssessmentQuestionById,
  shortCompletedAssessmentQuestionCount,
  shortFixedAssessmentQuestionCount,
  shortFixedAssessmentQuestions,
  shortSeparatorAssessmentQuestionCount,
  type ShortAssessmentQuestionData,
} from '../data/shortQuestions.ts';
import type {
  AssessmentAnswer,
  AssessmentResult,
  LockedPrimaryResult,
} from '../types.ts';
import {
  calculateSignedDimensionProfile,
  closeMatchDistanceGapThreshold,
  findBalancedDimensions,
  rankPersonalityTypes,
} from './scoreAssessment.ts';

export function isValidShortAssessmentAnswer(
  question: ShortAssessmentQuestionData,
  answer: unknown,
): answer is AssessmentAnswer {
  if (!answer || typeof answer !== 'object') return false;
  const candidate = answer as Partial<AssessmentAnswer>;
  return candidate.questionId === question.id
    && question.options.some(({ id }) => id === candidate.selectedOptionId)
    && Object.keys(candidate).length === 2;
}

export function calculateShortAnswerContribution(
  question: ShortAssessmentQuestionData,
  selectedOptionId: string,
): number {
  const option = question.options.find(({ id }) => id === selectedOptionId);
  if (!option) throw new Error(`Unknown option ${selectedOptionId} for question ${question.id}.`);
  return option.pole === dimensionDefinitions[question.dimension].firstPole
    ? question.weight
    : -question.weight;
}

export function calculateShortPoleTotals(
  answers: readonly AssessmentAnswer[],
): PoleScoreMap {
  const totals = createEmptyPoleScoreMap();
  for (const answer of answers) {
    const questionId = answer.questionId;
    const question = getShortAssessmentQuestion(questionId);
    if (!isValidShortAssessmentAnswer(question, answer)) {
      throw new Error(`Invalid Short questionnaire answer for ${questionId}.`);
    }
    const option = question.options.find(({ id }) => id === answer.selectedOptionId);
    if (!option) throw new Error(`Unknown option for question ${answer.questionId}.`);
    totals[option.pole] += question.weight;
  }
  return totals;
}

export function calculateShortAssessmentProfile(
  answers: readonly AssessmentAnswer[],
): DimensionProfile {
  return calculateSignedDimensionProfile(calculateShortPoleTotals(answers));
}

export function calculateShortLockedPrimaryResult(
  fixedAnswers: readonly AssessmentAnswer[],
): LockedPrimaryResult {
  assertCompleteShortFixedAnswers(fixedAnswers);
  const profile = calculateShortAssessmentProfile(fixedAnswers);
  const matches = rankPersonalityTypes(profile);
  const primary = matches[0];
  const runnerUp = matches[1];
  if (!primary || !runnerUp) {
    throw new Error('The Short questionnaire requires at least two animal matches.');
  }
  return {
    primaryTypeId: primary.personality.id,
    balancedDimensionIds: findBalancedDimensions(profile),
    hasCloseMatch: runnerUp.distance - primary.distance <= closeMatchDistanceGapThreshold,
  };
}

export function calculateShortFinalAssessmentResult(
  answers: readonly AssessmentAnswer[],
  lockedPrimary: LockedPrimaryResult,
): AssessmentResult {
  assertCompleteShortAnswers(answers);
  const profile = calculateShortAssessmentProfile(answers);
  const secondary = rankPersonalityTypes(profile, lockedPrimary.primaryTypeId)[0];
  if (!secondary) {
    throw new Error('The Short questionnaire requires a distinct secondary animal match.');
  }
  return {
    ...lockedPrimary,
    assessmentMode: 'short',
    secondaryTypeId: secondary.personality.id,
  };
}

export function getShortAssessmentQuestion(
  questionId: string,
): ShortAssessmentQuestionData {
  const question = shortAssessmentQuestionById.get(questionId);
  if (!question) throw new Error(`Unknown Short questionnaire question: ${questionId}.`);
  return question;
}

function assertCompleteShortFixedAnswers(
  fixedAnswers: readonly AssessmentAnswer[],
): void {
  if (fixedAnswers.length !== shortFixedAssessmentQuestionCount) {
    throw new Error(`Primary scoring requires all ${shortFixedAssessmentQuestionCount} Short questions.`);
  }
  const answersById = new Map(fixedAnswers.map((answer) => [answer.questionId, answer]));
  if (answersById.size !== shortFixedAssessmentQuestionCount) {
    throw new Error('Primary scoring requires distinct Short-question answers.');
  }
  for (const question of shortFixedAssessmentQuestions) {
    const answer = answersById.get(question.id);
    if (!answer || !isValidShortAssessmentAnswer(question, answer)) {
      throw new Error(`Missing or invalid Short fixed answer: ${question.id}.`);
    }
  }
}

function assertCompleteShortAnswers(answers: readonly AssessmentAnswer[]): void {
  if (answers.length !== shortCompletedAssessmentQuestionCount) {
    throw new Error(`Final Short scoring requires all ${shortCompletedAssessmentQuestionCount} answers.`);
  }
  const answersById = new Map(answers.map((answer) => [answer.questionId, answer]));
  if (answersById.size !== shortCompletedAssessmentQuestionCount) {
    throw new Error('Final Short scoring requires distinct answers.');
  }
  let separatorCount = 0;
  for (const answer of answers) {
    const question = shortAssessmentQuestionById.get(answer.questionId);
    if (!question || !isValidShortAssessmentAnswer(question, answer)) {
      throw new Error(`Missing or invalid final Short answer: ${answer.questionId}.`);
    }
    if (question.phase === 'separator') separatorCount += 1;
  }
  if (separatorCount !== shortSeparatorAssessmentQuestionCount) {
    throw new Error('Final Short scoring requires exactly three separator answers.');
  }
  assertCompleteShortFixedAnswers(answers.filter(({ questionId }) =>
    shortFixedAssessmentQuestions.some(({ id }) => id === questionId)));
}
