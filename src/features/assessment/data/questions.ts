import { dimensionDefinitions } from '../../personalities/types.ts';
import type { DimensionId } from '../../personalities/types.ts';
import type { AssessmentOption, AssessmentQuestion } from '../types.ts';

interface AssessmentQuestionDefinition {
  id: string;
  kind: 'fixed' | 'adaptive';
  scenarioId: string;
  dimension: DimensionId;
}

export const fixedQuestionDefinitions = [
  { id: 'energy-fixed-01-demanding-week', kind: 'fixed', scenarioId: 'recovering-after-demanding-week', dimension: 'energy' },
  { id: 'energy-fixed-02-unfamiliar-group', kind: 'fixed', scenarioId: 'entering-group-of-unfamiliar-people', dimension: 'energy' },
  { id: 'energy-fixed-03-difficult-problem', kind: 'fixed', scenarioId: 'processing-difficult-problem', dimension: 'energy' },
  { id: 'energy-fixed-04-social-event', kind: 'fixed', scenarioId: 'behaviour-at-social-event', dimension: 'energy' },
  { id: 'energy-fixed-05-extended-collaboration', kind: 'fixed', scenarioId: 'working-closely-with-people', dimension: 'energy' },
  { id: 'information-fixed-01-learning', kind: 'fixed', scenarioId: 'learning-something-new', dimension: 'information' },
  { id: 'information-fixed-02-observing', kind: 'fixed', scenarioId: 'observing-a-situation', dimension: 'information' },
  { id: 'information-fixed-03-task', kind: 'fixed', scenarioId: 'carrying-out-a-task', dimension: 'information' },
  { id: 'information-fixed-04-realism-possibilities', kind: 'fixed', scenarioId: 'practical-realism-and-possibilities', dimension: 'information' },
  { id: 'information-fixed-05-new-idea', kind: 'fixed', scenarioId: 'responding-to-a-new-idea', dimension: 'information' },
  { id: 'decisions-fixed-01-difficult-decision', kind: 'fixed', scenarioId: 'making-a-difficult-decision', dimension: 'decisions' },
  { id: 'decisions-fixed-02-disagreement', kind: 'fixed', scenarioId: 'handling-a-serious-disagreement', dimension: 'decisions' },
  { id: 'decisions-fixed-03-serious-mistake', kind: 'fixed', scenarioId: 'responding-to-a-serious-mistake', dimension: 'decisions' },
  { id: 'decisions-fixed-04-personal-qualities', kind: 'fixed', scenarioId: 'preferred-personal-qualities', dimension: 'decisions' },
  { id: 'decisions-fixed-05-corrective-feedback', kind: 'fixed', scenarioId: 'giving-corrective-feedback', dimension: 'decisions' },
  { id: 'structure-fixed-01-trip', kind: 'fixed', scenarioId: 'planning-a-trip', dimension: 'structure' },
  { id: 'structure-fixed-02-deadlines', kind: 'fixed', scenarioId: 'handling-deadlines', dimension: 'structure' },
  { id: 'structure-fixed-03-work-environment', kind: 'fixed', scenarioId: 'preferred-working-environment', dimension: 'structure' },
  { id: 'structure-fixed-04-closing-options', kind: 'fixed', scenarioId: 'closing-decisions-or-keeping-options-open', dimension: 'structure' },
  { id: 'structure-fixed-05-plan-change', kind: 'fixed', scenarioId: 'agreed-plan-changes', dimension: 'structure' },
] as const satisfies readonly AssessmentQuestionDefinition[];

export const adaptiveQuestionDefinitions = [
  { id: 'energy-adaptive-01-shared-journey', kind: 'adaptive', scenarioId: 'long-shared-journey', dimension: 'energy' },
  { id: 'energy-adaptive-02-community-event', kind: 'adaptive', scenarioId: 'unexpected-community-event', dimension: 'energy' },
  { id: 'energy-adaptive-03-idea-workshop', kind: 'adaptive', scenarioId: 'open-idea-workshop', dimension: 'energy' },
  { id: 'energy-adaptive-04-free-evening', kind: 'adaptive', scenarioId: 'choosing-how-to-use-a-free-evening', dimension: 'energy' },
  { id: 'information-adaptive-01-ambiguous-brief', kind: 'adaptive', scenarioId: 'interpreting-an-ambiguous-brief', dimension: 'information' },
  { id: 'information-adaptive-02-unfamiliar-place', kind: 'adaptive', scenarioId: 'navigating-an-unfamiliar-place', dimension: 'information' },
  { id: 'information-adaptive-03-complex-explanation', kind: 'adaptive', scenarioId: 'explaining-a-complex-topic', dimension: 'information' },
  { id: 'information-adaptive-04-early-prototype', kind: 'adaptive', scenarioId: 'reviewing-an-early-prototype', dimension: 'information' },
  { id: 'decisions-adaptive-01-limited-resource', kind: 'adaptive', scenarioId: 'allocating-a-limited-resource', dimension: 'decisions' },
  { id: 'decisions-adaptive-02-team-tension', kind: 'adaptive', scenarioId: 'responding-to-team-tension', dimension: 'decisions' },
  { id: 'decisions-adaptive-03-unpopular-call', kind: 'adaptive', scenarioId: 'making-an-unpopular-call', dimension: 'decisions' },
  { id: 'decisions-adaptive-04-personal-request', kind: 'adaptive', scenarioId: 'weighing-a-personal-request', dimension: 'decisions' },
  { id: 'structure-adaptive-01-open-weekend', kind: 'adaptive', scenarioId: 'organizing-an-open-weekend', dimension: 'structure' },
  { id: 'structure-adaptive-02-moving-parts', kind: 'adaptive', scenarioId: 'coordinating-moving-parts', dimension: 'structure' },
  { id: 'structure-adaptive-03-sudden-opportunity', kind: 'adaptive', scenarioId: 'responding-to-a-sudden-opportunity', dimension: 'structure' },
  { id: 'structure-adaptive-04-finishing-project', kind: 'adaptive', scenarioId: 'finishing-a-personal-project', dimension: 'structure' },
] as const satisfies readonly AssessmentQuestionDefinition[];

export type FixedAssessmentQuestionId = (typeof fixedQuestionDefinitions)[number]['id'];
export type AdaptiveAssessmentQuestionId = (typeof adaptiveQuestionDefinitions)[number]['id'];
export type AssessmentQuestionId = FixedAssessmentQuestionId | AdaptiveAssessmentQuestionId;

export const assessmentOptionSuffixes = [
  'strong-first',
  'moderate-first',
  'moderate-second',
  'strong-second',
] as const;

export type AssessmentOptionSuffix = (typeof assessmentOptionSuffixes)[number];
export type AssessmentOptionId = `${AssessmentQuestionId}-${AssessmentOptionSuffix}`;

export type AssessmentOptionData = Omit<AssessmentOption, 'id'> & {
  id: AssessmentOptionId;
};

export type AssessmentQuestionData = Omit<AssessmentQuestion, 'id' | 'options'> & {
  id: AssessmentQuestionId;
  options: readonly [
    AssessmentOptionData,
    AssessmentOptionData,
    AssessmentOptionData,
    AssessmentOptionData,
  ];
};

function createAssessmentQuestion(
  definition: AssessmentQuestionDefinition,
): AssessmentQuestionData {
  const poles = dimensionDefinitions[definition.dimension];
  return {
    ...definition,
    options: [
      { id: `${definition.id}-strong-first`, pole: poles.firstPole, intensity: 2 },
      { id: `${definition.id}-moderate-first`, pole: poles.firstPole, intensity: 1 },
      { id: `${definition.id}-moderate-second`, pole: poles.secondPole, intensity: 1 },
      { id: `${definition.id}-strong-second`, pole: poles.secondPole, intensity: 2 },
    ],
  } as AssessmentQuestionData;
}

export const fixedAssessmentQuestions = fixedQuestionDefinitions.map(createAssessmentQuestion);
export const adaptiveQuestionBank = adaptiveQuestionDefinitions.map(createAssessmentQuestion);
export const allAssessmentQuestions = [
  ...fixedAssessmentQuestions,
  ...adaptiveQuestionBank,
] as const;

export const fixedAssessmentQuestionCount = 20;
export const adaptiveAssessmentQuestionCount = 5;
export const completedAssessmentQuestionCount = 25;

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
