import {
  assessmentModelVersion,
  isPersonalityTypeId,
} from '../../personalities/data/personalityAnimals.ts';
import { isDimensionId } from '../../personalities/types.ts';
import {
  assessmentQuestionById,
  completedAssessmentQuestionCount,
  fixedAssessmentQuestionCount,
  fixedAssessmentQuestions,
} from '../data/questions.ts';
import type {
  AssessmentAnswer,
  AssessmentRankingAssignments,
  AssessmentResult,
  AssessmentSession,
} from '../types.ts';
import {
  assessmentSchemaVersion,
  createAssessmentSession,
  getAssessmentQuestionSequence,
} from './assessmentSession.ts';
import {
  isValidAssessmentAnswer,
  normalizeRankAssignments,
} from './ranking.ts';
import { calculateAssessmentResult } from './scoreAssessment.ts';
import { selectAdaptiveQuestionIds } from './selectAdaptiveQuestions.ts';

export const assessmentStorageKey = 'animals-within.assessment.v2';
export const legacyAssessmentStorageKey = 'animals-within.assessment.v1';

export interface AssessmentStorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem?: (key: string) => void;
}

export function restoreAssessmentSession(
  storage: AssessmentStorageAdapter | null,
): AssessmentSession {
  if (!storage) return createAssessmentSession();

  try {
    const storedValue = storage.getItem(assessmentStorageKey);
    if (storedValue) {
      const normalized = normalizeStoredAssessmentSession(JSON.parse(storedValue));
      if (normalized) {
        if (storage.getItem(legacyAssessmentStorageKey) !== null) {
          storage.removeItem?.(legacyAssessmentStorageKey);
        }
        return normalized;
      }
      storage.removeItem?.(assessmentStorageKey);
    }

    if (storage.getItem(legacyAssessmentStorageKey) !== null) {
      storage.removeItem?.(legacyAssessmentStorageKey);
    }
  } catch {
    return createAssessmentSession();
  }

  return createAssessmentSession();
}

export function persistAssessmentSession(
  storage: AssessmentStorageAdapter | null,
  session: AssessmentSession,
): void {
  try {
    storage?.setItem(assessmentStorageKey, JSON.stringify(session));
  } catch {
    // Assessment persistence is optional; the application remains usable in memory.
  }
}

export function normalizeStoredAssessmentSession(value: unknown): AssessmentSession | null {
  if (!isRecord(value)) return null;
  if (value.schemaVersion !== assessmentSchemaVersion) return null;
  if (value.modelVersion !== assessmentModelVersion) return null;
  if (!Number.isInteger(value.currentQuestionIndex)) return null;
  if (!Array.isArray(value.answers) || !Array.isArray(value.adaptiveQuestionIds)) return null;

  const answers = normalizeAnswers(value.answers);
  if (!answers) return null;
  if (!value.adaptiveQuestionIds.every((id) => typeof id === 'string')) return null;
  const adaptiveQuestionIds = value.adaptiveQuestionIds as string[];
  if (new Set(adaptiveQuestionIds).size !== adaptiveQuestionIds.length) return null;

  const fixedAnswers = fixedAssessmentQuestions
    .map((question) => answers.find((answer) => answer.questionId === question.id))
    .filter((answer): answer is AssessmentAnswer => answer !== undefined);

  if (fixedAnswers.length < fixedAssessmentQuestionCount) {
    if (adaptiveQuestionIds.length !== 0) return null;
    if (answers.some((answer) => !fixedAssessmentQuestions.some(({ id }) => id === answer.questionId))) {
      return null;
    }
  } else {
    const expectedAdaptiveIds = selectAdaptiveQuestionIds(fixedAnswers);
    if (!sameStrings(adaptiveQuestionIds, expectedAdaptiveIds)) return null;
  }

  const candidateSession: AssessmentSession = {
    schemaVersion: assessmentSchemaVersion,
    modelVersion: assessmentModelVersion,
    currentQuestionIndex: value.currentQuestionIndex as number,
    answers,
    adaptiveQuestionIds,
    result: null,
  };
  const sequence = getAssessmentQuestionSequence(candidateSession);
  const sequenceIds = new Set(sequence.map(({ id }) => id));
  if (answers.some(({ questionId }) => !sequenceIds.has(questionId))) return null;
  if (new Set(answers.map(({ questionId }) => questionId)).size !== answers.length) return null;
  const orderedAnswers = orderAnswers(answers, sequence.map(({ id }) => id));
  if (orderedAnswers.some((answer, index) => answer.questionId !== sequence[index]?.id)) return null;
  const maximumCurrentIndex = Math.min(orderedAnswers.length, sequence.length - 1);
  if (candidateSession.currentQuestionIndex < 0
    || candidateSession.currentQuestionIndex > maximumCurrentIndex) return null;

  const completed = sequence.length === completedAssessmentQuestionCount
    && sequence.every((question) => answers.some(({ questionId }) => questionId === question.id));
  const storedResult = normalizeResult(value.result);
  if (completed) {
    if (!storedResult) return null;
    const calculatedResult = calculateAssessmentResult(orderedAnswers);
    if (!sameResults(storedResult, calculatedResult)) return null;
    candidateSession.result = storedResult;
  } else if (value.result !== null) {
    return null;
  }

  candidateSession.answers = orderedAnswers;
  return candidateSession;
}

export function getBrowserAssessmentStorage(): AssessmentStorageAdapter | null {
  try {
    return (globalThis as { localStorage?: AssessmentStorageAdapter }).localStorage ?? null;
  } catch {
    return null;
  }
}

function normalizeAnswers(values: readonly unknown[]): AssessmentAnswer[] | null {
  const answers: AssessmentAnswer[] = [];
  for (const value of values) {
    if (!isRecord(value) || typeof value.questionId !== 'string') return null;
    const question = assessmentQuestionById.get(value.questionId);
    if (!question) return null;
    const rankings = normalizeRankAssignments(value.rankings);
    if (!rankings) return null;
    const answer: AssessmentAnswer = {
      questionId: value.questionId,
      rankings: rankings as AssessmentRankingAssignments,
    };
    if (!isValidAssessmentAnswer(question, answer)) return null;
    answers.push(answer);
  }
  return answers;
}

function normalizeResult(value: unknown): AssessmentResult | null {
  if (!isRecord(value)
    || !isPersonalityTypeId(value.primaryTypeId)
    || !isPersonalityTypeId(value.secondaryTypeId)
    || value.primaryTypeId === value.secondaryTypeId
    || !Array.isArray(value.balancedDimensionIds)
    || !value.balancedDimensionIds.every(isDimensionId)
    || new Set(value.balancedDimensionIds).size !== value.balancedDimensionIds.length) return null;

  return {
    primaryTypeId: value.primaryTypeId,
    secondaryTypeId: value.secondaryTypeId,
    balancedDimensionIds: value.balancedDimensionIds,
  };
}

function orderAnswers(
  answers: readonly AssessmentAnswer[],
  questionIds: readonly string[],
): AssessmentAnswer[] {
  const order = new Map(questionIds.map((id, index) => [id, index]));
  return [...answers].sort((left, right) =>
    (order.get(left.questionId) ?? Number.MAX_SAFE_INTEGER)
    - (order.get(right.questionId) ?? Number.MAX_SAFE_INTEGER),
  );
}

function sameResults(left: AssessmentResult, right: AssessmentResult): boolean {
  return left.primaryTypeId === right.primaryTypeId
    && left.secondaryTypeId === right.secondaryTypeId
    && sameStrings(left.balancedDimensionIds, right.balancedDimensionIds);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
