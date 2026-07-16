import type { AssessmentQuestionData } from '../data/questions.ts';
import {
  assessmentRanks,
  type AssessmentAnswer,
  type AssessmentRank,
  type AssessmentRankAssignment,
  type AssessmentRankingAssignments,
} from '../types.ts';

export type RankingDraft = Readonly<Record<string, AssessmentRank | undefined>>;

export interface RankAssignmentUpdate {
  rankings: RankingDraft;
  displacedOptionId: string | null;
  behavior: 'assigned' | 'moved' | 'swapped' | 'unchanged';
}

export function isAssessmentRank(value: unknown): value is AssessmentRank {
  return typeof value === 'number'
    && (assessmentRanks as readonly number[]).includes(value);
}

/**
 * Assigns a rank without ever leaving duplicate values behind.
 *
 * When both options already have ranks, their ranks are swapped. When the target is unranked, the
 * selected rank moves to it and the previous owner is cleared. This keeps the interaction useful
 * while a question is incomplete and deterministic after all four ranks have been assigned.
 */
export function assignRank(
  current: RankingDraft,
  targetOptionId: string,
  selectedRank: AssessmentRank,
): RankAssignmentUpdate {
  const currentRank = current[targetOptionId];
  if (currentRank === selectedRank) {
    return {
      rankings: current,
      displacedOptionId: null,
      behavior: 'unchanged',
    };
  }

  const previousOwner = Object.entries(current)
    .find(([optionId, rank]) => optionId !== targetOptionId && rank === selectedRank)?.[0] ?? null;
  const next: Record<string, AssessmentRank | undefined> = { ...current };

  if (previousOwner) {
    if (currentRank === undefined) {
      delete next[previousOwner];
    } else {
      next[previousOwner] = currentRank;
    }
  }
  next[targetOptionId] = selectedRank;

  return {
    rankings: next,
    displacedOptionId: previousOwner,
    behavior: previousOwner
      ? (currentRank === undefined ? 'moved' : 'swapped')
      : 'assigned',
  };
}

export function isCompleteRanking(
  question: AssessmentQuestionData,
  rankings: RankingDraft,
): boolean {
  const optionIds = question.options.map(({ id }) => id);
  const assignedOptionIds = Object.keys(rankings).filter(
    (optionId) => rankings[optionId] !== undefined,
  );
  if (assignedOptionIds.length !== optionIds.length) return false;
  if (assignedOptionIds.some((optionId) => !optionIds.includes(optionId))) return false;

  const assignedRanks = optionIds.map((optionId) => rankings[optionId]);
  return assignedRanks.every(isAssessmentRank)
    && new Set(assignedRanks).size === assessmentRanks.length
    && assessmentRanks.every((rank) => assignedRanks.includes(rank));
}

export function createAssessmentAnswer(
  question: AssessmentQuestionData,
  rankings: RankingDraft,
): AssessmentAnswer {
  if (!isCompleteRanking(question, rankings)) {
    throw new Error(`Question ${question.id} requires each rank from 1 to 4 exactly once.`);
  }

  const assignments = question.options.map(({ id }) => ({
    optionId: id,
    rank: rankings[id] as AssessmentRank,
  })) as unknown as AssessmentRankingAssignments;

  return { questionId: question.id, rankings: assignments };
}

export function isValidAssessmentAnswer(
  question: AssessmentQuestionData,
  answer: AssessmentAnswer,
): boolean {
  if (answer.questionId !== question.id || answer.rankings.length !== 4) return false;
  const optionIds = question.options.map(({ id }) => id);
  const answerOptionIds = answer.rankings.map(({ optionId }) => optionId);
  const ranks = answer.rankings.map(({ rank }) => rank);

  return new Set(answerOptionIds).size === 4
    && optionIds.every((optionId) => answerOptionIds.includes(optionId))
    && ranks.every(isAssessmentRank)
    && new Set(ranks).size === 4
    && assessmentRanks.every((rank) => ranks.includes(rank));
}

export function answerToRankingDraft(answer: AssessmentAnswer | null): RankingDraft {
  if (!answer) return {};
  return Object.fromEntries(
    answer.rankings.map(({ optionId, rank }) => [optionId, rank]),
  );
}

export function normalizeRankAssignments(
  value: unknown,
): readonly AssessmentRankAssignment[] | null {
  if (!Array.isArray(value) || value.length !== 4) return null;
  const assignments: AssessmentRankAssignment[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== 'object') return null;
    const { optionId, rank } = candidate as Partial<AssessmentRankAssignment>;
    if (typeof optionId !== 'string' || !isAssessmentRank(rank)) return null;
    assignments.push({ optionId, rank });
  }
  return assignments;
}
