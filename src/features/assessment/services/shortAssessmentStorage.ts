import {
  isPersonalityTypeId,
} from '../../personalities/data/personalityAnimals.ts';
import { isDimensionId } from '../../personalities/types.ts';
import {
  shortAssessmentQuestionById,
  shortCompletedAssessmentQuestionCount,
  shortFixedAssessmentQuestionCount,
  shortFixedAssessmentQuestions,
  type ShortAssessmentQuestionData,
  type ShortSeparatorAssessmentQuestionId,
} from '../data/shortQuestions.ts';
import type {
  AssessmentAnswer,
  AssessmentResult,
  LockedPrimaryResult,
} from '../types.ts';
import type { AssessmentStorageAdapter } from './assessmentStorage.ts';
import { selectShortSeparatorQuestionIds } from './selectShortSeparatorQuestions.ts';
import {
  createShortAssessmentSession,
  shortAssessmentModelVersion,
  shortAssessmentSchemaVersion,
  type ShortAssessmentSession,
} from './shortAssessmentSession.ts';
import {
  calculateShortFinalAssessmentResult,
  calculateShortLockedPrimaryResult,
  isValidShortAssessmentAnswer,
} from './shortScoreAssessment.ts';

export const shortAssessmentStorageKey = 'animals-within.assessment.short.v1';

export function restoreShortAssessmentSession(
  storage: AssessmentStorageAdapter | null,
): ShortAssessmentSession {
  if (!storage) return createShortAssessmentSession();
  try {
    const storedValue = storage.getItem(shortAssessmentStorageKey);
    if (storedValue === null) return createShortAssessmentSession();
    const normalized = normalizeStoredShortAssessmentSession(JSON.parse(storedValue));
    if (normalized) return normalized;
    storage.removeItem?.(shortAssessmentStorageKey);
  } catch {
    try {
      storage.removeItem?.(shortAssessmentStorageKey);
    } catch {
      // Storage is optional; fall through to a clean in-memory session.
    }
  }
  return createShortAssessmentSession();
}

export function persistShortAssessmentSession(
  storage: AssessmentStorageAdapter | null,
  session: ShortAssessmentSession,
): void {
  try {
    const persisted = {
      schemaVersion: session.schemaVersion,
      modelVersion: session.modelVersion,
      assessmentMode: session.assessmentMode,
      currentQuestionIndex: session.currentQuestionIndex,
      answers: session.answers.map(({ questionId, selectedOptionId }) => ({
        questionId,
        selectedOptionId,
      })),
      separatorQuestionIds: [...session.separatorQuestionIds],
      lockedPrimary: copyLockedPrimary(session.lockedPrimary),
      result: copyResult(session.result),
    } satisfies ShortAssessmentSession;
    storage?.setItem(shortAssessmentStorageKey, JSON.stringify(persisted));
  } catch {
    // Short-questionnaire persistence is optional; the app remains usable in memory.
  }
}

export function normalizeStoredShortAssessmentSession(
  value: unknown,
): ShortAssessmentSession | null {
  try {
    return normalizeStoredShortAssessmentSessionUnsafe(value);
  } catch {
    // Crafted or internally inconsistent data must never escape storage restore.
    return null;
  }
}

function normalizeStoredShortAssessmentSessionUnsafe(
  value: unknown,
): ShortAssessmentSession | null {
  if (!isRecord(value)
    || !hasExactKeys(value, [
      'schemaVersion',
      'modelVersion',
      'assessmentMode',
      'currentQuestionIndex',
      'answers',
      'separatorQuestionIds',
      'lockedPrimary',
      'result',
    ])
    || value.schemaVersion !== shortAssessmentSchemaVersion
    || value.modelVersion !== shortAssessmentModelVersion
    || value.assessmentMode !== 'short'
    || !Number.isInteger(value.currentQuestionIndex)
    || !Array.isArray(value.answers)
    || !Array.isArray(value.separatorQuestionIds)) return null;

  const answers = normalizeAnswers(value.answers);
  if (!answers || new Set(answers.map(({ questionId }) => questionId)).size !== answers.length) {
    return null;
  }
  if (!value.separatorQuestionIds.every((id) => typeof id === 'string')) return null;
  const separatorQuestionIds = [
    ...value.separatorQuestionIds,
  ] as ShortSeparatorAssessmentQuestionId[];
  if (new Set(separatorQuestionIds).size !== separatorQuestionIds.length) return null;

  const fixedPrefixLength = Math.min(answers.length, shortFixedAssessmentQuestionCount);
  for (let index = 0; index < fixedPrefixLength; index += 1) {
    if (answers[index]?.questionId !== shortFixedAssessmentQuestions[index]?.id) return null;
  }

  const fixedAnswers = answers.slice(0, shortFixedAssessmentQuestionCount);
  let lockedPrimary: LockedPrimaryResult | null = null;
  if (fixedAnswers.length < shortFixedAssessmentQuestionCount) {
    if (separatorQuestionIds.length !== 0 || value.lockedPrimary !== null || value.result !== null) {
      return null;
    }
  } else {
    const normalizedLock = normalizeLockedPrimary(value.lockedPrimary);
    if (!normalizedLock) return null;
    const calculatedLock = calculateShortLockedPrimaryResult(fixedAnswers);
    if (!sameLockedPrimary(normalizedLock, calculatedLock)) return null;
    lockedPrimary = normalizedLock;
    const expectedSeparatorIds = selectShortSeparatorQuestionIds(fixedAnswers, calculatedLock);
    if (!sameStrings(separatorQuestionIds, expectedSeparatorIds)) return null;
  }

  const sequence = buildShortQuestionSequence(separatorQuestionIds);
  if (answers.length > shortCompletedAssessmentQuestionCount
    || answers.length > sequence.length
    || answers.some((answer, index) => answer.questionId !== sequence[index]?.id)) return null;

  const currentQuestionIndex = value.currentQuestionIndex as number;
  const maximumCurrentIndex = Math.min(answers.length, sequence.length - 1);
  if (currentQuestionIndex < 0 || currentQuestionIndex > maximumCurrentIndex) return null;

  const candidateSession: ShortAssessmentSession = {
    schemaVersion: shortAssessmentSchemaVersion,
    modelVersion: shortAssessmentModelVersion,
    assessmentMode: 'short',
    currentQuestionIndex,
    answers,
    separatorQuestionIds,
    lockedPrimary,
    result: null,
  };

  const storedResult = normalizeResult(value.result);
  if (value.result !== null && !storedResult) return null;
  if (storedResult) {
    if (!lockedPrimary
      || answers.length !== shortCompletedAssessmentQuestionCount
      || currentQuestionIndex !== shortCompletedAssessmentQuestionCount - 1) return null;
    const calculatedResult = calculateShortFinalAssessmentResult(answers, lockedPrimary);
    if (!sameResults(storedResult, calculatedResult)) return null;
    candidateSession.result = storedResult;
  }
  return candidateSession;
}

function normalizeAnswers(values: readonly unknown[]): AssessmentAnswer[] | null {
  const answers: AssessmentAnswer[] = [];
  for (const value of values) {
    if (!isRecord(value)
      || !hasExactKeys(value, ['questionId', 'selectedOptionId'])
      || typeof value.questionId !== 'string'
      || typeof value.selectedOptionId !== 'string') return null;
    const question = shortAssessmentQuestionById.get(value.questionId);
    if (!question) return null;
    const answer: AssessmentAnswer = {
      questionId: value.questionId,
      selectedOptionId: value.selectedOptionId,
    };
    if (!isValidShortAssessmentAnswer(question, answer)) return null;
    answers.push(answer);
  }
  return answers;
}

function normalizeLockedPrimary(value: unknown): LockedPrimaryResult | null {
  if (!isRecord(value)
    || !hasExactKeys(value, ['primaryTypeId', 'balancedDimensionIds', 'hasCloseMatch'])
    || !isPersonalityTypeId(value.primaryTypeId)
    || !Array.isArray(value.balancedDimensionIds)
    || !value.balancedDimensionIds.every(isDimensionId)
    || new Set(value.balancedDimensionIds).size !== value.balancedDimensionIds.length
    || typeof value.hasCloseMatch !== 'boolean') return null;
  return {
    primaryTypeId: value.primaryTypeId,
    balancedDimensionIds: value.balancedDimensionIds,
    hasCloseMatch: value.hasCloseMatch,
  };
}

function normalizeResult(value: unknown): AssessmentResult | null {
  if (!isRecord(value)
    || !hasExactKeys(value, [
      'primaryTypeId',
      'secondaryTypeId',
      'balancedDimensionIds',
      'hasCloseMatch',
      'assessmentMode',
    ])
    || value.assessmentMode !== 'short'
    || !isPersonalityTypeId(value.primaryTypeId)
    || !isPersonalityTypeId(value.secondaryTypeId)
    || value.primaryTypeId === value.secondaryTypeId
    || !Array.isArray(value.balancedDimensionIds)
    || !value.balancedDimensionIds.every(isDimensionId)
    || new Set(value.balancedDimensionIds).size !== value.balancedDimensionIds.length
    || typeof value.hasCloseMatch !== 'boolean') return null;
  return {
    primaryTypeId: value.primaryTypeId,
    secondaryTypeId: value.secondaryTypeId,
    balancedDimensionIds: value.balancedDimensionIds,
    hasCloseMatch: value.hasCloseMatch,
    assessmentMode: 'short',
  };
}

function buildShortQuestionSequence(
  separatorQuestionIds: readonly string[],
): readonly ShortAssessmentQuestionData[] {
  const separatorQuestions = separatorQuestionIds.map((questionId) => {
    const question = shortAssessmentQuestionById.get(questionId);
    if (!question || question.phase !== 'separator') {
      throw new Error(`Invalid Short separator question: ${questionId}.`);
    }
    return question;
  });
  return [...shortFixedAssessmentQuestions, ...separatorQuestions];
}

function copyLockedPrimary(result: LockedPrimaryResult | null): LockedPrimaryResult | null {
  return result ? {
    primaryTypeId: result.primaryTypeId,
    balancedDimensionIds: [...result.balancedDimensionIds],
    hasCloseMatch: result.hasCloseMatch,
  } : null;
}

function copyResult(result: AssessmentResult | null): AssessmentResult | null {
  return result ? {
    primaryTypeId: result.primaryTypeId,
    secondaryTypeId: result.secondaryTypeId,
    balancedDimensionIds: [...result.balancedDimensionIds],
    hasCloseMatch: result.hasCloseMatch,
    assessmentMode: 'short',
  } : null;
}

function sameLockedPrimary(left: LockedPrimaryResult, right: LockedPrimaryResult): boolean {
  return left.primaryTypeId === right.primaryTypeId
    && left.hasCloseMatch === right.hasCloseMatch
    && sameStrings(left.balancedDimensionIds, right.balancedDimensionIds);
}

function sameResults(left: AssessmentResult, right: AssessmentResult): boolean {
  return sameLockedPrimary(left, right)
    && left.secondaryTypeId === right.secondaryTypeId
    && left.assessmentMode === right.assessmentMode;
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return sameStrings(Object.keys(value).sort(), [...keys].sort());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
