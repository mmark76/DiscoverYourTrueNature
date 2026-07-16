import {
  assessmentQuestionById,
  completedAssessmentQuestionCount,
  fixedAssessmentQuestionCount,
  fixedAssessmentQuestions,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type {
  AssessmentAnswer,
  AssessmentSession,
} from '../types.ts';
import { calculateAssessmentResult } from './scoreAssessment.ts';
import { selectAdaptiveQuestion } from './selectAdaptiveQuestion.ts';

export function createAssessmentSession(): AssessmentSession {
  return { answers: [], adaptiveQuestionIds: [], result: null };
}

export function getCurrentAssessmentQuestion(
  session: AssessmentSession,
): AssessmentQuestionData | null {
  if (session.result || session.answers.length >= completedAssessmentQuestionCount) return null;

  if (session.answers.length < fixedAssessmentQuestionCount) {
    return fixedAssessmentQuestions[session.answers.length] ?? null;
  }

  const adaptiveIndex = session.answers.length - fixedAssessmentQuestionCount;
  const questionId = session.adaptiveQuestionIds[adaptiveIndex];
  if (!questionId) throw new Error(`Missing adaptive question ${adaptiveIndex + 1}.`);
  const question = assessmentQuestionById.get(questionId);
  if (!question || !question.adaptiveEligible) {
    throw new Error(`Invalid adaptive question: ${questionId}.`);
  }
  return question;
}

export function answerCurrentAssessmentQuestion(
  session: AssessmentSession,
  questionId: string,
  optionId: string,
): AssessmentSession {
  const currentQuestion = getCurrentAssessmentQuestion(session);
  if (!currentQuestion || currentQuestion.id !== questionId) {
    throw new Error(`Question ${questionId} is not the current assessment question.`);
  }
  if (!currentQuestion.options.some(({ id }) => id === optionId)) {
    throw new Error(`Option ${optionId} does not belong to question ${questionId}.`);
  }

  const answer: AssessmentAnswer = { questionId, optionId };
  const answers = [...session.answers, answer];
  let adaptiveQuestionIds = [...session.adaptiveQuestionIds];

  if (answers.length === fixedAssessmentQuestionCount) {
    adaptiveQuestionIds = [selectAdaptiveQuestion(answers, []).id];
  } else if (answers.length === fixedAssessmentQuestionCount + 1) {
    adaptiveQuestionIds = [
      ...adaptiveQuestionIds,
      selectAdaptiveQuestion(answers, adaptiveQuestionIds).id,
    ];
  }

  const result = answers.length === completedAssessmentQuestionCount
    ? calculateAssessmentResult(answers)
    : null;

  return { answers, adaptiveQuestionIds, result };
}

export function restartAssessmentSession(): AssessmentSession {
  return createAssessmentSession();
}

export function completeAssessmentWithOptionSelector(
  selectOptionId: (question: AssessmentQuestionData, session: AssessmentSession) => string,
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
