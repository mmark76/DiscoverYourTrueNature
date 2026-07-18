import { assessmentModelVersion } from '../../personalities/data/personalityAnimals.ts';
import {
  assessmentQuestionById,
  baseAssessmentQuestionCount,
  completedAssessmentQuestionCount,
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
  upsertAssessmentAnswer,
} from './selection.ts';
import {
  calculateFinalAssessmentResult,
  calculateLockedPrimaryResult,
} from './scoreAssessment.ts';
import { selectAdaptiveQuestionIds } from './selectAdaptiveQuestions.ts';

export const assessmentSchemaVersion = 3 as const;

export function createAssessmentSession(): AssessmentSession {
  return {
    schemaVersion: assessmentSchemaVersion,
    modelVersion: assessmentModelVersion,
    assessmentMode: 'long',
    currentQuestionIndex: 0,
    answers: [],
    adaptiveQuestionIds: [],
    lockedPrimary: null,
    result: null,
  };
}

export function getAssessmentQuestionSequence(
  session: AssessmentSession,
): readonly AssessmentQuestionData[] {
  return buildQuestionSequence(session.adaptiveQuestionIds);
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

/**
 * Records the current binary selection immediately without navigating. This is
 * intentionally separate from Continue so persistence can run on every choice.
 */
export function selectCurrentAssessmentOption(
  session: AssessmentSession,
  selectedOptionId: string,
): AssessmentSession {
  const question = getCurrentAssessmentQuestion(session);
  if (!question) throw new Error('There is no current assessment question.');
  return selectAssessmentOption(session, question.id, selectedOptionId);
}

export function selectAssessmentOption(
  session: AssessmentSession,
  questionId: string,
  selectedOptionId: string,
): AssessmentSession {
  const currentQuestion = getCurrentAssessmentQuestion(session);
  if (!currentQuestion || currentQuestion.id !== questionId) {
    throw new Error(`Question ${questionId} is not the current assessment question.`);
  }
  const nextAnswer = createAssessmentAnswer(currentQuestion, selectedOptionId);
  const previousAnswer = getAssessmentAnswer(session, questionId);
  if (previousAnswer?.selectedOptionId === selectedOptionId) return session;

  let answers = upsertAssessmentAnswer(session.answers, nextAnswer);
  let adaptiveQuestionIds = session.adaptiveQuestionIds;
  let lockedPrimary = session.lockedPrimary;
  let result = session.result;

  if (isFixedAssessmentQuestionId(questionId)) {
    // Every adaptive choice depends on the complete base profile. Any changed
    // base answer invalidates that whole dependent phase, even if an ID happens
    // to appear in both routes.
    answers = answers.filter(({ questionId: candidateId }) =>
      isFixedAssessmentQuestionId(candidateId));
    adaptiveQuestionIds = [];
    lockedPrimary = null;
    result = null;

    const baseAnswers = answersInQuestionOrder(answers, fixedAssessmentQuestions);
    if (baseAnswers.length === baseAssessmentQuestionCount) {
      lockedPrimary = calculateLockedPrimaryResult(baseAnswers);
      adaptiveQuestionIds = selectAdaptiveQuestionIds(baseAnswers, lockedPrimary);
    }
  }

  return {
    ...session,
    answers: answersInQuestionOrder(
      answers,
      buildQuestionSequence(adaptiveQuestionIds),
    ),
    adaptiveQuestionIds,
    lockedPrimary,
    result,
  };
}

export function canContinueAssessment(session: AssessmentSession): boolean {
  const question = getCurrentAssessmentQuestion(session);
  const answer = question ? getAssessmentAnswer(session, question.id) : null;
  return Boolean(question && answer && isValidAssessmentAnswer(question, answer));
}

/** Advances only after the current selection has already been recorded. */
export function continueAssessment(session: AssessmentSession): AssessmentSession {
  const currentQuestion = getCurrentAssessmentQuestion(session);
  if (!currentQuestion) return session;
  const currentAnswer = getAssessmentAnswer(session, currentQuestion.id);
  if (!currentAnswer || !isValidAssessmentAnswer(currentQuestion, currentAnswer)) return session;

  const sequence = getAssessmentQuestionSequence(session);
  const isFinalQuestion = session.currentQuestionIndex === completedAssessmentQuestionCount - 1;
  if (isFinalQuestion) {
    if (!session.lockedPrimary || sequence.length !== completedAssessmentQuestionCount
      || session.answers.length !== completedAssessmentQuestionCount) {
      throw new Error('The assessment cannot finish without a locked primary and all 30 answers.');
    }
    return {
      ...session,
      result: calculateFinalAssessmentResult(session.answers, session.lockedPrimary),
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

export const goToNextAssessmentQuestion = continueAssessment;

export function answerCurrentAssessmentQuestion(
  session: AssessmentSession,
  questionId: string,
  selectedOptionId: string,
): AssessmentSession {
  return continueAssessment(selectAssessmentOption(session, questionId, selectedOptionId));
}

export function submitCurrentAssessmentAnswer(
  session: AssessmentSession,
  answer: AssessmentAnswer,
): AssessmentSession {
  return selectAssessmentOption(session, answer.questionId, answer.selectedOptionId);
}

export function goToPreviousAssessmentQuestion(session: AssessmentSession): AssessmentSession {
  if (session.result) return session;
  return {
    ...session,
    currentQuestionIndex: Math.max(0, session.currentQuestionIndex - 1),
  };
}

export function restartAssessmentSession(): AssessmentSession {
  return createAssessmentSession();
}

export function completeAssessmentWithOptionSelector(
  selectOptionId: (
    question: AssessmentQuestionData,
    session: AssessmentSession,
  ) => string,
): AssessmentSession {
  let session = createAssessmentSession();
  while (!session.result) {
    const question = getCurrentAssessmentQuestion(session);
    if (!question) throw new Error('Assessment ended before a result was produced.');
    session = answerCurrentAssessmentQuestion(
      session,
      question.id,
      selectOptionId(question, session),
    );
  }
  return session;
}

function buildQuestionSequence(
  adaptiveQuestionIds: readonly string[],
): readonly AssessmentQuestionData[] {
  const adaptiveQuestions = adaptiveQuestionIds.map((questionId) => {
    const question = assessmentQuestionById.get(questionId);
    if (!question || question.phase !== 'adaptive') {
      throw new Error(`Invalid adaptive question: ${questionId}.`);
    }
    return question;
  });
  return [...fixedAssessmentQuestions, ...adaptiveQuestions];
}

function answersInQuestionOrder(
  answers: readonly AssessmentAnswer[],
  sequence: readonly AssessmentQuestionData[],
): readonly AssessmentAnswer[] {
  const answersById = new Map(answers.map((answer) => [answer.questionId, answer]));
  return sequence.flatMap((question) => {
    const answer = answersById.get(question.id);
    return answer ? [answer] : [];
  });
}
