import { dimensionDefinitions } from '../../personalities/types.ts';
import type { DimensionId } from '../../personalities/types.ts';
import type {
  AssessmentContext,
  AssessmentOption,
  AssessmentPhase,
  AssessmentQuestion,
} from '../types.ts';

export const assessmentPhaseWeights = {
  everyday: 1,
  structured: 1.25,
  adaptive: 1.5,
} as const satisfies Record<AssessmentPhase, number>;

interface AssessmentQuestionDefinition {
  id: string;
  phase: AssessmentPhase;
  context: AssessmentContext;
  scenarioId: string;
  dimension: DimensionId;
  reverseKeyed: boolean;
}

export const fixedQuestionDefinitions = [
  { id: 'q01-free-afternoon', phase: 'everyday', context: 'personal', scenarioId: 'free-afternoon', dimension: 'energy', reverseKeyed: false },
  { id: 'q02-personal-plan-change', phase: 'everyday', context: 'personal', scenarioId: 'personal-plan-change', dimension: 'structure', reverseKeyed: false },
  { id: 'q03-new-place', phase: 'everyday', context: 'personal', scenarioId: 'new-place', dimension: 'information', reverseKeyed: false },
  { id: 'q04-personal-advice', phase: 'everyday', context: 'personal', scenarioId: 'personal-advice', dimension: 'decisions', reverseKeyed: false },
  { id: 'q05-conflicting-commitments', phase: 'everyday', context: 'personal', scenarioId: 'conflicting-commitments', dimension: 'decisions', reverseKeyed: true },
  { id: 'q06-social-or-solo-activity', phase: 'everyday', context: 'personal', scenarioId: 'social-or-solo-activity', dimension: 'energy', reverseKeyed: true },
  { id: 'q07-stories-interpretation', phase: 'everyday', context: 'personal', scenarioId: 'stories-interpretation', dimension: 'information', reverseKeyed: true },
  { id: 'q08-hobby-practice', phase: 'everyday', context: 'personal', scenarioId: 'hobby-practice', dimension: 'structure', reverseKeyed: true },
  { id: 'q09-creative-project', phase: 'everyday', context: 'personal', scenarioId: 'creative-project', dimension: 'decisions', reverseKeyed: false },
  { id: 'q10-new-hobby-difficulty', phase: 'everyday', context: 'personal', scenarioId: 'new-hobby-difficulty', dimension: 'energy', reverseKeyed: false },
  { id: 'q11-new-task', phase: 'everyday', context: 'professional', scenarioId: 'new-task', dimension: 'structure', reverseKeyed: false },
  { id: 'q12-professional-meeting', phase: 'everyday', context: 'professional', scenarioId: 'professional-meeting', dimension: 'energy', reverseKeyed: true },
  { id: 'q13-ambiguous-instruction', phase: 'everyday', context: 'professional', scenarioId: 'ambiguous-instruction', dimension: 'information', reverseKeyed: false },
  { id: 'q14-team-decision', phase: 'everyday', context: 'professional', scenarioId: 'team-decision', dimension: 'decisions', reverseKeyed: true },
  { id: 'q15-important-deadline', phase: 'everyday', context: 'professional', scenarioId: 'important-deadline', dimension: 'structure', reverseKeyed: true },
  { id: 'q16-colleague-mistake', phase: 'everyday', context: 'professional', scenarioId: 'colleague-mistake', dimension: 'decisions', reverseKeyed: false },
  { id: 'q17-professional-idea', phase: 'everyday', context: 'professional', scenarioId: 'professional-idea', dimension: 'information', reverseKeyed: true },
  { id: 'q18-team-project', phase: 'everyday', context: 'professional', scenarioId: 'team-project', dimension: 'energy', reverseKeyed: false },
  { id: 'q19-changing-priorities', phase: 'everyday', context: 'professional', scenarioId: 'changing-priorities', dimension: 'structure', reverseKeyed: false },
  { id: 'q20-complex-problem', phase: 'everyday', context: 'professional', scenarioId: 'complex-problem', dimension: 'information', reverseKeyed: false },
  { id: 'q21-social-energy', phase: 'structured', context: 'personal', scenarioId: 'social-energy', dimension: 'energy', reverseKeyed: false },
  { id: 'q22-trusting-information', phase: 'structured', context: 'personal', scenarioId: 'trusting-information', dimension: 'information', reverseKeyed: true },
  { id: 'q23-fair-personal-decision', phase: 'structured', context: 'personal', scenarioId: 'fair-personal-decision', dimension: 'decisions', reverseKeyed: true },
  { id: 'q24-professional-closure', phase: 'structured', context: 'professional', scenarioId: 'professional-closure', dimension: 'structure', reverseKeyed: true },
  { id: 'q25-developing-ideas', phase: 'structured', context: 'professional', scenarioId: 'developing-ideas', dimension: 'energy', reverseKeyed: true },
] as const satisfies readonly AssessmentQuestionDefinition[];

export const adaptiveQuestionDefinitions = [
  { id: 'energy-adaptive-personal-free-evening', phase: 'adaptive', context: 'personal', scenarioId: 'free-evening', dimension: 'energy', reverseKeyed: false },
  { id: 'energy-adaptive-personal-community-event', phase: 'adaptive', context: 'personal', scenarioId: 'community-event', dimension: 'energy', reverseKeyed: true },
  { id: 'energy-adaptive-professional-idea-workshop', phase: 'adaptive', context: 'professional', scenarioId: 'idea-workshop', dimension: 'energy', reverseKeyed: false },
  { id: 'energy-adaptive-professional-colleague-journey', phase: 'adaptive', context: 'professional', scenarioId: 'colleague-journey', dimension: 'energy', reverseKeyed: true },
  { id: 'information-adaptive-personal-unfamiliar-place', phase: 'adaptive', context: 'personal', scenarioId: 'unfamiliar-place', dimension: 'information', reverseKeyed: false },
  { id: 'information-adaptive-personal-unfamiliar-activity', phase: 'adaptive', context: 'personal', scenarioId: 'unfamiliar-activity', dimension: 'information', reverseKeyed: true },
  { id: 'information-adaptive-professional-ambiguous-brief', phase: 'adaptive', context: 'professional', scenarioId: 'ambiguous-brief', dimension: 'information', reverseKeyed: false },
  { id: 'information-adaptive-professional-early-prototype', phase: 'adaptive', context: 'professional', scenarioId: 'early-prototype', dimension: 'information', reverseKeyed: true },
  { id: 'decisions-adaptive-personal-significant-request', phase: 'adaptive', context: 'personal', scenarioId: 'significant-request', dimension: 'decisions', reverseKeyed: false },
  { id: 'decisions-adaptive-personal-close-disagreement', phase: 'adaptive', context: 'personal', scenarioId: 'close-disagreement', dimension: 'decisions', reverseKeyed: true },
  { id: 'decisions-adaptive-professional-team-tension', phase: 'adaptive', context: 'professional', scenarioId: 'team-tension', dimension: 'decisions', reverseKeyed: false },
  { id: 'decisions-adaptive-professional-unpopular-decision', phase: 'adaptive', context: 'professional', scenarioId: 'unpopular-decision', dimension: 'decisions', reverseKeyed: true },
  { id: 'structure-adaptive-personal-open-weekend', phase: 'adaptive', context: 'personal', scenarioId: 'open-weekend', dimension: 'structure', reverseKeyed: false },
  { id: 'structure-adaptive-personal-sudden-opportunity', phase: 'adaptive', context: 'personal', scenarioId: 'sudden-opportunity', dimension: 'structure', reverseKeyed: true },
  { id: 'structure-adaptive-professional-moving-parts', phase: 'adaptive', context: 'professional', scenarioId: 'moving-parts', dimension: 'structure', reverseKeyed: false },
  { id: 'structure-adaptive-professional-finishing-project', phase: 'adaptive', context: 'professional', scenarioId: 'finishing-project', dimension: 'structure', reverseKeyed: true },
] as const satisfies readonly AssessmentQuestionDefinition[];

export type FixedAssessmentQuestionId = (typeof fixedQuestionDefinitions)[number]['id'];
export type AdaptiveAssessmentQuestionId = (typeof adaptiveQuestionDefinitions)[number]['id'];
export type AssessmentQuestionId = FixedAssessmentQuestionId | AdaptiveAssessmentQuestionId;
export type AssessmentOptionId = `${AssessmentQuestionId}-${'a' | 'b'}`;

export type AssessmentOptionData = Omit<AssessmentOption, 'id'> & {
  id: AssessmentOptionId;
};

export type AssessmentQuestionData = Omit<AssessmentQuestion, 'id' | 'options'> & {
  id: AssessmentQuestionId;
  options: readonly [AssessmentOptionData, AssessmentOptionData];
};

function createAssessmentQuestion(
  definition: AssessmentQuestionDefinition,
): AssessmentQuestionData {
  const poles = dimensionDefinitions[definition.dimension];
  const firstOptionPole = definition.reverseKeyed ? poles.secondPole : poles.firstPole;
  const secondOptionPole = definition.reverseKeyed ? poles.firstPole : poles.secondPole;
  return {
    ...definition,
    id: definition.id as AssessmentQuestionId,
    weight: assessmentPhaseWeights[definition.phase],
    options: [
      { id: `${definition.id}-a` as AssessmentOptionId, pole: firstOptionPole, position: 'a' },
      { id: `${definition.id}-b` as AssessmentOptionId, pole: secondOptionPole, position: 'b' },
    ],
  };
}

export const fixedAssessmentQuestions = fixedQuestionDefinitions.map(createAssessmentQuestion);
export const baseAssessmentQuestions = fixedAssessmentQuestions;
export const adaptiveQuestionBank = adaptiveQuestionDefinitions.map(createAssessmentQuestion);
export const allAssessmentQuestions = [
  ...fixedAssessmentQuestions,
  ...adaptiveQuestionBank,
] as const;

export const everydayAssessmentQuestionCount = 20;
export const structuredAssessmentQuestionCount = 5;
export const baseAssessmentQuestionCount = 25;
export const fixedAssessmentQuestionCount = baseAssessmentQuestionCount;
export const adaptiveAssessmentQuestionCount = 5;
export const completedAssessmentQuestionCount = 30;

export const assessmentQuestionById: ReadonlyMap<string, AssessmentQuestionData> = new Map(
  allAssessmentQuestions.map((question) => [question.id, question]),
);

export function isFixedAssessmentQuestionId(
  questionId: string,
): questionId is FixedAssessmentQuestionId {
  return fixedAssessmentQuestions.some(({ id }) => id === questionId);
}

export function isAdaptiveAssessmentQuestionId(
  questionId: string,
): questionId is AdaptiveAssessmentQuestionId {
  return adaptiveQuestionBank.some(({ id }) => id === questionId);
}
