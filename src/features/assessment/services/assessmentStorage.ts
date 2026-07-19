import {
  assessmentModelVersion,
  isPersonalityTypeId,
} from '../../personalities/data/personalityAnimals.ts';
import { isDimensionId } from '../../personalities/types.ts';
import {
  assessmentQuestionById,
  baseAssessmentQuestionCount,
  completedAssessmentQuestionCount,
  fixedAssessmentQuestions,
} from '../data/questions.ts';
import type {
  AssessmentAnswer,
  AssessmentResult,
  AssessmentSession,
  LockedPrimaryResult,
} from '../types.ts';
import {
  assessmentSchemaVersion,
  createAssessmentSession,
  getAssessmentQuestionSequence,
} from './assessmentSession.ts';
import { isValidAssessmentAnswer } from './selection.ts';
import {
  calculateFinalAssessmentResult,
  calculateLockedPrimaryResult,
} from './scoreAssessment.ts';
import { selectAdaptiveQuestionIds } from './selectAdaptiveQuestions.ts';

export const assessmentStorageKey = 'animals-within.assessment.v3';
export const legacyRankingAssessmentStorageKey = 'animals-within.assessment.v2';
export const legacyAssessmentStorageKey = 'animals-within.assessment.v1';
export const legacyAssessmentStorageKeys = [
  legacyAssessmentStorageKey,
  legacyRankingAssessmentStorageKey,
] as const;

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
    if (storedValue !== null) {
      let normalized: AssessmentSession | null = null;
      try {
        normalized = normalizeStoredAssessmentSession(JSON.parse(storedValue));
      } catch {
        // Malformed current assessment data is discarded below.
      }
      if (normalized) {
        removeLegacyAssessmentState(storage);
        return normalized;
      }
      storage.removeItem?.(assessmentStorageKey);
    }
    removeLegacyAssessmentState(storage);
  } catch {
    // Storage is optional; fall back to a clean in-memory session.
  }
  return createAssessmentSession();
}

export function persistAssessmentSession(
  storage: AssessmentStorageAdapter | null,
  session: AssessmentSession,
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
      adaptiveQuestionIds: [...session.adaptiveQuestionIds],
      lockedPrimary: copyLockedPrimary(session.lockedPrimary),
      result: copyResult(session.result),
    } satisfies AssessmentSession;
    storage?.setItem(assessmentStorageKey, JSON.stringify(persisted));
  } catch {
    // Assessment persistence is optional; the application remains usable in memory.
  }
}

export function normalizeStoredAssessmentSession(value: unknown): AssessmentSession | null {
  if (!isRecord(value)) return null;
  const currentKeys = [
      'schemaVersion',
      'modelVersion',
      'assessmentMode',
      'currentQuestionIndex',
      'answers',
      'adaptiveQuestionIds',
      'lockedPrimary',
      'result',
  ] as const;
  const legacyKeys = currentKeys.filter((key) => key !== 'assessmentMode');
  const isLegacySchemaThreePayload = hasExactKeys(value, legacyKeys);
  if (!hasExactKeys(value, currentKeys) && !isLegacySchemaThreePayload) return null;
  if (value.schemaVersion !== assessmentSchemaVersion
    || value.modelVersion !== assessmentModelVersion
    || (!isLegacySchemaThreePayload && value.assessmentMode !== 'long')
    || !Number.isInteger(value.currentQuestionIndex)
    || !Array.isArray(value.answers)
    || !Array.isArray(value.adaptiveQuestionIds)) return null;

  const answers = normalizeAnswers(value.answers);
  if (!answers || new Set(answers.map(({ questionId }) => questionId)).size !== answers.length) {
    return null;
  }
  if (!value.adaptiveQuestionIds.every((id) => typeof id === 'string')) return null;
  const adaptiveQuestionIds = [...value.adaptiveQuestionIds] as string[];
  if (new Set(adaptiveQuestionIds).size !== adaptiveQuestionIds.length) return null;

  const basePrefixLength = Math.min(answers.length, baseAssessmentQuestionCount);
  for (let index = 0; index < basePrefixLength; index += 1) {
    if (answers[index]?.questionId !== fixedAssessmentQuestions[index]?.id) return null;
  }

  const baseAnswers = answers.slice(0, baseAssessmentQuestionCount);
  let lockedPrimary: LockedPrimaryResult | null = null;
  if (baseAnswers.length < baseAssessmentQuestionCount) {
    if (adaptiveQuestionIds.length !== 0 || value.lockedPrimary !== null || value.result !== null) {
      return null;
    }
  } else {
    const normalizedLock = normalizeLockedPrimary(value.lockedPrimary);
    if (!normalizedLock) return null;
    const calculatedLock = calculateLockedPrimaryResult(baseAnswers);
    if (!sameLockedPrimary(normalizedLock, calculatedLock)) return null;
    lockedPrimary = normalizedLock;
    const expectedAdaptiveIds = selectAdaptiveQuestionIds(baseAnswers, calculatedLock);
    if (!sameStrings(adaptiveQuestionIds, expectedAdaptiveIds)) return null;
  }

  const candidateSession: AssessmentSession = {
    schemaVersion: assessmentSchemaVersion,
    modelVersion: assessmentModelVersion,
    assessmentMode: 'long',
    currentQuestionIndex: value.currentQuestionIndex as number,
    answers,
    adaptiveQuestionIds,
    lockedPrimary,
    result: null,
  };
  const sequence = getAssessmentQuestionSequence(candidateSession);
  if (answers.length > sequence.length) return null;
  if (answers.some((answer, index) => answer.questionId !== sequence[index]?.id)) return null;

  const maximumCurrentIndex = Math.min(answers.length, sequence.length - 1);
  if (candidateSession.currentQuestionIndex < 0
    || candidateSession.currentQuestionIndex > maximumCurrentIndex) return null;

  const storedResult = normalizeResult(value.result, isLegacySchemaThreePayload);
  if (value.result !== null && !storedResult) return null;
  if (storedResult) {
    if (!lockedPrimary || answers.length !== completedAssessmentQuestionCount
      || candidateSession.currentQuestionIndex !== completedAssessmentQuestionCount - 1) return null;
    const calculatedResult = calculateFinalAssessmentResult(answers, lockedPrimary);
    if (!sameResults(storedResult, calculatedResult)) return null;
    candidateSession.result = storedResult;
  }
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
    if (!isRecord(value)
      || !hasExactKeys(value, ['questionId', 'selectedOptionId'])
      || typeof value.questionId !== 'string'
      || typeof value.selectedOptionId !== 'string') return null;
    const question = assessmentQuestionById.get(value.questionId);
    if (!question) return null;
    const answer: AssessmentAnswer = {
      questionId: value.questionId,
      selectedOptionId: value.selectedOptionId,
    };
    if (!isValidAssessmentAnswer(question, answer)) return null;
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

function normalizeResult(
  value: unknown,
  allowLegacyMode: boolean,
): AssessmentResult | null {
  if (!isRecord(value)) return null;
  const currentKeys = [
      'primaryTypeId',
      'secondaryTypeId',
      'balancedDimensionIds',
      'hasCloseMatch',
      'assessmentMode',
  ] as const;
  const expectedKeys = allowLegacyMode
    ? currentKeys.filter((key) => key !== 'assessmentMode')
    : currentKeys;
  if (!hasExactKeys(value, expectedKeys)
    || (!allowLegacyMode && value.assessmentMode !== 'long')
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
    assessmentMode: 'long',
  };
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
    assessmentMode: 'long',
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

function removeLegacyAssessmentState(storage: AssessmentStorageAdapter): void {
  for (const key of legacyAssessmentStorageKeys) {
    if (storage.getItem(key) !== null) storage.removeItem?.(key);
  }
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return sameStrings(actual, expected);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
