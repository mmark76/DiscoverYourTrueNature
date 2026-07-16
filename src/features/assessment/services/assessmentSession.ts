import { assessmentModelVersion } from '../../personalities/data/personalityAnimals.ts';
import {
  assessmentQuestionById,
  completedAssessmentQuestionCount,
  fixedAssessmentQuestionCount,
  fixedAssessmentQuestions,
  isFixedAssessmentQuestionId,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type {
  AssessmentAnswer,
  AssessmentSession,
} from '../types.ts';
import {
  createAssessmentAnswer,
  isValidAssessmentAnswer,
  type RankingDraft,
} from './ranking.ts';
import { calculateAssessmentResult } from './scoreAssessment.ts';
import { selectAdaptiveQuestionIds } from './selectAdaptiveQuestions.ts';

export const assessmentSchemaVersion = 2 as const;

export function createAssessmentSession(): AssessmentSession {
  return {
    schemaVersion: assessmentSchemaVersion,
    modelVersion: assessmentModelVersion,
    currentQuestionIndex: 0,
    answers: [],
    adaptiveQuestionIds: [],
    result: null,
  };
}

export function getAssessmentQuestionSequence(
  session: AssessmentSession,
): readonly AssessmentQuestionData[] {
  const adaptiveQuestions = session.adaptiveQuestionIds.map((questionId) => {
    const question = assessmentQuestionById.get(questionId);
    if (!question || question.kind !== 'adaptive') {
      throw new Error(`Invalid adaptive question: ${questionId}.`);
    }
    return question;
  });
  return [...fixedAssessmentQuestions, ...adaptiveQuestions];
}

export function getCurrentAssessmentQuestion(
  session: AssessmentSession,
): AssessmentQuestionData | null {
  if (session.result) return null;
  return getAssessmentQuestionSequence(session)[session.currentQuestionIndex] ?? null;
}

export function getAssessmentAnswer(
  session: AssessmentSession,
  questionId: string,
): AssessmentAnswer | null {
  return session.answers.find((answer) => answer.questionId === questionId) ?? null;
}

export function answerCurrentAssessmentQuestion(
  session: AssessmentSession,
  questionId: string,
  rankings: RankingDraft,
): AssessmentSession {
  const currentQuestion = getCurrentAssessmentQuestion(session);
  if (!currentQuestion || currentQuestion.id !== questionId) {
    throw new Error(`Question ${questionId} is not the current assessment question.`);
  }
  return submitCurrentAssessmentAnswer(
    session,
    createAssessmentAnswer(currentQuestion, rankings),
  );
}

export function submitCurrentAssessmentAnswer(
  session: AssessmentSession,
  answer: AssessmentAnswer,
): AssessmentSession {
  const currentQuestion = getCurrentAssessmentQuestion(session);
  if (!currentQuestion || currentQuestion.id !== answer.questionId) {
    throw new Error(`Question ${answer.questionId} is not the current assessment question.`);
  }
  if (!isValidAssessmentAnswer(currentQuestion, answer)) {
    throw new Error(`Question ${answer.questionId} requires a complete unique ranking.`);
  }

  const previousAnswer = getAssessmentAnswer(session, answer.questionId);
  const answerChanged = !previousAnswer || !areAnswersEqual(previousAnswer, answer);
  let answers = upsertAnswer(session.answers, answer);
  let adaptiveQuestionIds = [...session.adaptiveQuestionIds];

  if (currentQuestion.kind === 'fixed' && answerChanged) {
    const fixedAnswers = fixedAssessmentQuestions
      .map((question) => answers.find((candidate) => candidate.questionId === question.id))
      .filter((candidate): candidate is AssessmentAnswer => candidate !== undefined);

    if (fixedAnswers.length === fixedAssessmentQuestionCount) {
      adaptiveQuestionIds = [...selectAdaptiveQuestionIds(fixedAnswers)];
      // Adaptive answers depend on the complete fixed profile. Even when an adaptive ID happens
      // to exist in both routes, its position may have changed and retaining it can create a
      // non-contiguous persisted history. A changed fixed answer therefore invalidates the whole
      // dependent adaptive phase and lets the user answer the recalculated route from its start.
      answers = answers.filter((candidate) => isFixedAssessmentQuestionId(candidate.questionId));
    } else {
      adaptiveQuestionIds = [];
      answers = answers.filter((candidate) => isFixedAssessmentQuestionId(candidate.questionId));
    }
  }

  const sequence = buildQuestionSequence(adaptiveQuestionIds);
  answers = orderAnswers(answers, sequence);
  const completed = sequence.length === completedAssessmentQuestionCount
    && sequence.every((question) => answers.some((candidate) => candidate.questionId === question.id));
  const result = completed ? calculateAssessmentResult(answers) : null;
  const currentQuestionIndex = result
    ? completedAssessmentQuestionCount - 1
    : Math.min(session.currentQuestionIndex + 1, Math.max(0, sequence.length - 1));

  return {
    ...session,
    currentQuestionIndex,
    answers,
    adaptiveQuestionIds,
    result,
  };
}

export function goToPreviousAssessmentQuestion(session: AssessmentSession): AssessmentSession {
  if (session.result) return session;
  return {
    ...session,
    currentQuestionIndex: Math.max(0, session.currentQuestionIndex - 1),
  };
}

export function goToNextAssessmentQuestion(session: AssessmentSession): AssessmentSession {
  if (session.result) return session;
  const sequence = getAssessmentQuestionSequence(session);
  const currentQuestion = sequence[session.currentQuestionIndex];
  if (!currentQuestion || !getAssessmentAnswer(session, currentQuestion.id)) return session;
  return {
    ...session,
    currentQuestionIndex: Math.min(
      session.currentQuestionIndex + 1,
      Math.max(0, sequence.length - 1),
    ),
  };
}

export function restartAssessmentSession(): AssessmentSession {
  return createAssessmentSession();
}

export function completeAssessmentWithRankingSelector(
  selectRankings: (
    question: AssessmentQuestionData,
    session: AssessmentSession,
  ) => RankingDraft,
): AssessmentSession {
  let session = createAssessmentSession();
  while (!session.result) {
    const question = getCurrentAssessmentQuestion(session);
    if (!question) throw new Error('Assessment ended before a result was produced.');
    session = answerCurrentAssessmentQuestion(
      session,
      question.id,
      selectRankings(question, session),
    );
  }
  return session;
}

function buildQuestionSequence(
  adaptiveQuestionIds: readonly string[],
): readonly AssessmentQuestionData[] {
  const adaptiveQuestions = adaptiveQuestionIds.map((questionId) => {
    const question = assessmentQuestionById.get(questionId);
    if (!question || question.kind !== 'adaptive') {
      throw new Error(`Invalid adaptive question: ${questionId}.`);
    }
    return question;
  });
  return [...fixedAssessmentQuestions, ...adaptiveQuestions];
}

function upsertAnswer(
  answers: readonly AssessmentAnswer[],
  nextAnswer: AssessmentAnswer,
): AssessmentAnswer[] {
  const answerIndex = answers.findIndex(({ questionId }) => questionId === nextAnswer.questionId);
  if (answerIndex < 0) return [...answers, nextAnswer];
  const next = [...answers];
  next[answerIndex] = nextAnswer;
  return next;
}

function orderAnswers(
  answers: readonly AssessmentAnswer[],
  sequence: readonly AssessmentQuestionData[],
): AssessmentAnswer[] {
  const order = new Map<string, number>(sequence.map(({ id }, index) => [id, index]));
  return [...answers]
    .filter(({ questionId }) => order.has(questionId))
    .sort((left, right) =>
      (order.get(left.questionId) ?? Number.MAX_SAFE_INTEGER)
      - (order.get(right.questionId) ?? Number.MAX_SAFE_INTEGER),
    );
}

function areAnswersEqual(left: AssessmentAnswer, right: AssessmentAnswer): boolean {
  if (left.questionId !== right.questionId) return false;
  const leftRanks = new Map(left.rankings.map(({ optionId, rank }) => [optionId, rank]));
  return right.rankings.every(({ optionId, rank }) => leftRanks.get(optionId) === rank);
}
