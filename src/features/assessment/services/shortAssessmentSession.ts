import {
  shortAssessmentQuestionById,
  shortCompletedAssessmentQuestionCount,
  shortFixedAssessmentQuestionCount,
  shortFixedAssessmentQuestions,
  shortSeparatorAssessmentQuestionCount,
  isShortFixedAssessmentQuestionId,
  type ShortAssessmentOptionId,
  type ShortAssessmentQuestionData,
  type ShortSeparatorAssessmentQuestionId,
} from '../data/shortQuestions.ts';
import type {
  AssessmentAnswer,
  AssessmentResult,
  LockedPrimaryResult,
} from '../types.ts';
import {
  calculateShortFinalAssessmentResult,
  calculateShortLockedPrimaryResult,
  isValidShortAssessmentAnswer,
} from './shortScoreAssessment.ts';
import { selectShortSeparatorQuestionIds } from './selectShortSeparatorQuestions.ts';

export const shortAssessmentSchemaVersion = 1 as const;
export const shortAssessmentModelVersion = 'animals-within-short-binary-v1-15q' as const;

export interface ShortAssessmentSession {
  schemaVersion: typeof shortAssessmentSchemaVersion;
  modelVersion: typeof shortAssessmentModelVersion;
  assessmentMode: 'short';
  currentQuestionIndex: number;
  answers: readonly AssessmentAnswer[];
  separatorQuestionIds: readonly ShortSeparatorAssessmentQuestionId[];
  lockedPrimary: LockedPrimaryResult | null;
  result: AssessmentResult | null;
}

export function createShortAssessmentSession(): ShortAssessmentSession {
  return {
    schemaVersion: shortAssessmentSchemaVersion,
    modelVersion: shortAssessmentModelVersion,
    assessmentMode: 'short',
    currentQuestionIndex: 0,
    answers: [],
    separatorQuestionIds: [],
    lockedPrimary: null,
    result: null,
  };
}

export function getShortAssessmentQuestionSequence(
  session: ShortAssessmentSession,
): readonly ShortAssessmentQuestionData[] {
  return buildShortQuestionSequence(session.separatorQuestionIds);
}

export function getCurrentShortAssessmentQuestion(
  session: ShortAssessmentSession,
): ShortAssessmentQuestionData | null {
  if (session.result) return null;
  return getShortAssessmentQuestionSequence(session)[session.currentQuestionIndex] ?? null;
}

export function getShortAssessmentAnswer(
  session: ShortAssessmentSession,
  questionId: string,
): AssessmentAnswer | null {
  return session.answers.find((answer) => answer.questionId === questionId) ?? null;
}

export function createShortAssessmentAnswer(
  question: ShortAssessmentQuestionData,
  selectedOptionId: string,
): AssessmentAnswer {
  if (!question.options.some(({ id }) => id === selectedOptionId)) {
    throw new Error(`Short question ${question.id} requires one of its two options.`);
  }
  return { questionId: question.id, selectedOptionId };
}

/** Records the current choice immediately without navigating. */
export function selectCurrentShortAssessmentOption(
  session: ShortAssessmentSession,
  selectedOptionId: string,
): ShortAssessmentSession {
  const question = getCurrentShortAssessmentQuestion(session);
  if (!question) throw new Error('There is no current Short questionnaire question.');
  return selectShortAssessmentOption(session, question.id, selectedOptionId);
}

export function selectShortAssessmentOption(
  session: ShortAssessmentSession,
  questionId: string,
  selectedOptionId: string,
): ShortAssessmentSession {
  const currentQuestion = getCurrentShortAssessmentQuestion(session);
  if (!currentQuestion || currentQuestion.id !== questionId) {
    throw new Error(`Short question ${questionId} is not the current question.`);
  }
  const nextAnswer = createShortAssessmentAnswer(currentQuestion, selectedOptionId);
  const previousAnswer = getShortAssessmentAnswer(session, questionId);
  if (previousAnswer?.selectedOptionId === selectedOptionId) return session;

  let answers = upsertShortAssessmentAnswer(session.answers, nextAnswer);
  let separatorQuestionIds = session.separatorQuestionIds;
  let lockedPrimary = session.lockedPrimary;
  let result = session.result;

  if (isShortFixedAssessmentQuestionId(questionId)) {
    answers = answers.filter(({ questionId: candidateId }) =>
      isShortFixedAssessmentQuestionId(candidateId));
    separatorQuestionIds = [];
    lockedPrimary = null;
    result = null;

    const fixedAnswers = answersInShortQuestionOrder(answers, shortFixedAssessmentQuestions);
    if (fixedAnswers.length === shortFixedAssessmentQuestionCount) {
      lockedPrimary = calculateShortLockedPrimaryResult(fixedAnswers);
      separatorQuestionIds = selectShortSeparatorQuestionIds(
        fixedAnswers,
        lockedPrimary,
      );
    }
  }

  return {
    ...session,
    answers: answersInShortQuestionOrder(
      answers,
      buildShortQuestionSequence(separatorQuestionIds),
    ),
    separatorQuestionIds,
    lockedPrimary,
    result,
  };
}

export function canContinueShortAssessment(session: ShortAssessmentSession): boolean {
  const question = getCurrentShortAssessmentQuestion(session);
  const answer = question ? getShortAssessmentAnswer(session, question.id) : null;
  return Boolean(question && answer && isValidShortAssessmentAnswer(question, answer));
}

/** Advances only after the current choice has already been recorded. */
export function continueShortAssessment(
  session: ShortAssessmentSession,
): ShortAssessmentSession {
  const currentQuestion = getCurrentShortAssessmentQuestion(session);
  if (!currentQuestion) return session;
  const currentAnswer = getShortAssessmentAnswer(session, currentQuestion.id);
  if (!currentAnswer || !isValidShortAssessmentAnswer(currentQuestion, currentAnswer)) {
    return session;
  }

  const sequence = getShortAssessmentQuestionSequence(session);
  const isFinalQuestion = session.currentQuestionIndex
    === shortCompletedAssessmentQuestionCount - 1;
  if (isFinalQuestion) {
    if (!session.lockedPrimary
      || sequence.length !== shortCompletedAssessmentQuestionCount
      || session.answers.length !== shortCompletedAssessmentQuestionCount
      || session.separatorQuestionIds.length !== shortSeparatorAssessmentQuestionCount) {
      throw new Error('The Short questionnaire cannot finish without all 15 answers.');
    }
    return {
      ...session,
      result: calculateShortFinalAssessmentResult(session.answers, session.lockedPrimary),
    };
  }

  return {
    ...session,
    currentQuestionIndex: Math.min(
      session.currentQuestionIndex + 1,
      Math.max(0, sequence.length - 1),
    ),
  };
}

export const goToNextShortAssessmentQuestion = continueShortAssessment;

export function answerCurrentShortAssessmentQuestion(
  session: ShortAssessmentSession,
  questionId: string,
  selectedOptionId: string,
): ShortAssessmentSession {
  return continueShortAssessment(
    selectShortAssessmentOption(session, questionId, selectedOptionId),
  );
}

export function goToPreviousShortAssessmentQuestion(
  session: ShortAssessmentSession,
): ShortAssessmentSession {
  if (session.result) return session;
  return {
    ...session,
    currentQuestionIndex: Math.max(0, session.currentQuestionIndex - 1),
  };
}

export function restartShortAssessmentSession(): ShortAssessmentSession {
  return createShortAssessmentSession();
}

export function completeShortAssessmentWithOptionSelector(
  selectOptionId: (
    question: ShortAssessmentQuestionData,
    session: ShortAssessmentSession,
  ) => ShortAssessmentOptionId,
): ShortAssessmentSession {
  let session = createShortAssessmentSession();
  while (!session.result) {
    const question = getCurrentShortAssessmentQuestion(session);
    if (!question) throw new Error('Short questionnaire ended before producing a result.');
    session = answerCurrentShortAssessmentQuestion(
      session,
      question.id,
      selectOptionId(question, session),
    );
  }
  return session;
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

function upsertShortAssessmentAnswer(
  answers: readonly AssessmentAnswer[],
  answer: AssessmentAnswer,
): readonly AssessmentAnswer[] {
  const existingIndex = answers.findIndex(({ questionId }) => questionId === answer.questionId);
  if (existingIndex < 0) return [...answers, answer];
  if (answers[existingIndex]?.selectedOptionId === answer.selectedOptionId) return answers;
  return answers.map((candidate, index) => index === existingIndex ? answer : candidate);
}

function answersInShortQuestionOrder(
  answers: readonly AssessmentAnswer[],
  sequence: readonly ShortAssessmentQuestionData[],
): readonly AssessmentAnswer[] {
  const answersById = new Map(answers.map((answer) => [answer.questionId, answer]));
  return sequence.flatMap((question) => {
    const answer = answersById.get(question.id);
    return answer ? [answer] : [];
  });
}
