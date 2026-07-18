import type {
  AssessmentAnswer,
  AssessmentQuestion,
} from '../types.ts';

export function isAssessmentOptionIdForQuestion(
  question: AssessmentQuestion,
  optionId: unknown,
): optionId is string {
  return typeof optionId === 'string'
    && question.options.some((option) => option.id === optionId);
}

export function createAssessmentAnswer(
  question: AssessmentQuestion,
  selectedOptionId: string,
): AssessmentAnswer {
  if (!isAssessmentOptionIdForQuestion(question, selectedOptionId)) {
    throw new Error(`Question ${question.id} requires one of its two options.`);
  }
  return { questionId: question.id, selectedOptionId };
}

export const selectOption = createAssessmentAnswer;

export function isValidAssessmentAnswer(
  question: AssessmentQuestion,
  answer: unknown,
): answer is AssessmentAnswer {
  if (!answer || typeof answer !== 'object') return false;
  const candidate = answer as Partial<AssessmentAnswer>;
  return candidate.questionId === question.id
    && isAssessmentOptionIdForQuestion(question, candidate.selectedOptionId)
    && Object.keys(candidate).length === 2;
}

export function answerToSelectedOptionId(answer: AssessmentAnswer | null | undefined): string | null {
  return answer?.selectedOptionId ?? null;
}

export function upsertAssessmentAnswer(
  answers: readonly AssessmentAnswer[],
  answer: AssessmentAnswer,
): readonly AssessmentAnswer[] {
  const existingIndex = answers.findIndex(({ questionId }) => questionId === answer.questionId);
  if (existingIndex < 0) return [...answers, answer];
  if (answers[existingIndex]?.selectedOptionId === answer.selectedOptionId) return answers;
  return answers.map((candidate, index) => index === existingIndex ? answer : candidate);
}
