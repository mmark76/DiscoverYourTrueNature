import { dimensionDefinitions } from '../../personalities/types.ts';
import type { DimensionId } from '../../personalities/types.ts';
import type {
  AssessmentOption,
  AssessmentOptionPosition,
} from '../types.ts';

export const shortAssessmentAreaIds = [
  'sociability',
  'emotional-intelligence',
  'creativity',
  'practicality',
] as const;

export type ShortAssessmentAreaId = (typeof shortAssessmentAreaIds)[number];
export type ShortAssessmentPhase = 'fixed' | 'separator';

/**
 * Internal-only bridge from the four Short questionnaire areas to the
 * canonical scoring dimensions. These identifiers must never be rendered.
 */
export const shortAssessmentAreaDimensions = {
  sociability: 'energy',
  'emotional-intelligence': 'decisions',
  creativity: 'information',
  practicality: 'structure',
} as const satisfies Record<ShortAssessmentAreaId, DimensionId>;

/** Product-design weights, not validated psychometric coefficients. */
export const shortAssessmentPhaseWeights = {
  fixed: 1,
  separator: 1.5,
} as const satisfies Record<ShortAssessmentPhase, number>;

interface ShortAssessmentQuestionDefinition {
  id: string;
  phase: ShortAssessmentPhase;
  scenarioId: string;
  area: ShortAssessmentAreaId;
  dimension: DimensionId;
  reverseKeyed: boolean;
}

export const shortFixedQuestionDefinitions = [
  { id: 'short-q01-social-setting', phase: 'fixed', scenarioId: 'social-setting', area: 'sociability', dimension: 'energy', reverseKeyed: false },
  { id: 'short-q02-group-conversation', phase: 'fixed', scenarioId: 'group-conversation', area: 'sociability', dimension: 'energy', reverseKeyed: true },
  { id: 'short-q03-new-people', phase: 'fixed', scenarioId: 'new-people', area: 'sociability', dimension: 'energy', reverseKeyed: false },
  { id: 'short-q04-noticing-feelings', phase: 'fixed', scenarioId: 'noticing-feelings', area: 'emotional-intelligence', dimension: 'decisions', reverseKeyed: true },
  { id: 'short-q05-supporting-someone', phase: 'fixed', scenarioId: 'supporting-someone', area: 'emotional-intelligence', dimension: 'decisions', reverseKeyed: false },
  { id: 'short-q06-handling-tension', phase: 'fixed', scenarioId: 'handling-tension', area: 'emotional-intelligence', dimension: 'decisions', reverseKeyed: true },
  { id: 'short-q07-imagining-possibilities', phase: 'fixed', scenarioId: 'imagining-possibilities', area: 'creativity', dimension: 'information', reverseKeyed: true },
  { id: 'short-q08-creative-start', phase: 'fixed', scenarioId: 'creative-start', area: 'creativity', dimension: 'information', reverseKeyed: false },
  { id: 'short-q09-story-ideas', phase: 'fixed', scenarioId: 'story-ideas', area: 'creativity', dimension: 'information', reverseKeyed: true },
  { id: 'short-q10-solving-problem', phase: 'fixed', scenarioId: 'solving-problem', area: 'practicality', dimension: 'structure', reverseKeyed: false },
  { id: 'short-q11-making-plan', phase: 'fixed', scenarioId: 'making-plan', area: 'practicality', dimension: 'structure', reverseKeyed: true },
  { id: 'short-q12-checking-work', phase: 'fixed', scenarioId: 'checking-work', area: 'practicality', dimension: 'structure', reverseKeyed: false },
] as const satisfies readonly ShortAssessmentQuestionDefinition[];

export const shortSeparatorQuestionDefinitions = [
  { id: 'short-separator-sociability-quiet-group', phase: 'separator', scenarioId: 'quiet-group', area: 'sociability', dimension: 'energy', reverseKeyed: false },
  { id: 'short-separator-sociability-shared-idea', phase: 'separator', scenarioId: 'shared-idea', area: 'sociability', dimension: 'energy', reverseKeyed: true },
  { id: 'short-separator-emotional-upset-friend', phase: 'separator', scenarioId: 'upset-friend', area: 'emotional-intelligence', dimension: 'decisions', reverseKeyed: true },
  { id: 'short-separator-emotional-fair-choice', phase: 'separator', scenarioId: 'fair-choice', area: 'emotional-intelligence', dimension: 'decisions', reverseKeyed: false },
  { id: 'short-separator-creativity-unfamiliar-object', phase: 'separator', scenarioId: 'unfamiliar-object', area: 'creativity', dimension: 'information', reverseKeyed: true },
  { id: 'short-separator-creativity-new-route', phase: 'separator', scenarioId: 'new-route', area: 'creativity', dimension: 'information', reverseKeyed: false },
  { id: 'short-separator-practicality-busy-day', phase: 'separator', scenarioId: 'busy-day', area: 'practicality', dimension: 'structure', reverseKeyed: false },
  { id: 'short-separator-practicality-unclear-task', phase: 'separator', scenarioId: 'unclear-task', area: 'practicality', dimension: 'structure', reverseKeyed: true },
] as const satisfies readonly ShortAssessmentQuestionDefinition[];

export type ShortFixedAssessmentQuestionId =
  (typeof shortFixedQuestionDefinitions)[number]['id'];
export type ShortSeparatorAssessmentQuestionId =
  (typeof shortSeparatorQuestionDefinitions)[number]['id'];
export type ShortAssessmentQuestionId =
  | ShortFixedAssessmentQuestionId
  | ShortSeparatorAssessmentQuestionId;
export type ShortAssessmentOptionId = `${ShortAssessmentQuestionId}-${AssessmentOptionPosition}`;

export type ShortAssessmentOptionData = Omit<AssessmentOption, 'id'> & {
  id: ShortAssessmentOptionId;
};

export interface ShortAssessmentQuestionData {
  id: ShortAssessmentQuestionId;
  phase: ShortAssessmentPhase;
  scenarioId: string;
  area: ShortAssessmentAreaId;
  dimension: DimensionId;
  weight: number;
  reverseKeyed: boolean;
  options: readonly [ShortAssessmentOptionData, ShortAssessmentOptionData];
}

function createShortAssessmentQuestion(
  definition: ShortAssessmentQuestionDefinition,
): ShortAssessmentQuestionData {
  const poles = dimensionDefinitions[definition.dimension];
  const firstOptionPole = definition.reverseKeyed ? poles.secondPole : poles.firstPole;
  const secondOptionPole = definition.reverseKeyed ? poles.firstPole : poles.secondPole;
  return {
    ...definition,
    id: definition.id as ShortAssessmentQuestionId,
    weight: shortAssessmentPhaseWeights[definition.phase],
    options: [
      {
        id: `${definition.id}-a` as ShortAssessmentOptionId,
        pole: firstOptionPole,
        position: 'a',
      },
      {
        id: `${definition.id}-b` as ShortAssessmentOptionId,
        pole: secondOptionPole,
        position: 'b',
      },
    ],
  };
}

export const shortFixedAssessmentQuestions =
  shortFixedQuestionDefinitions.map(createShortAssessmentQuestion);
export const shortSeparatorQuestionBank =
  shortSeparatorQuestionDefinitions.map(createShortAssessmentQuestion);
export const allShortAssessmentQuestions = [
  ...shortFixedAssessmentQuestions,
  ...shortSeparatorQuestionBank,
] as const;

export const shortFixedAssessmentQuestionCount = 12;
export const shortSeparatorAssessmentQuestionCount = 3;
export const shortCompletedAssessmentQuestionCount = 15;

export const shortAssessmentQuestionById:
ReadonlyMap<string, ShortAssessmentQuestionData> = new Map(
  allShortAssessmentQuestions.map((question) => [question.id, question]),
);

export function isShortFixedAssessmentQuestionId(
  questionId: string,
): questionId is ShortFixedAssessmentQuestionId {
  return shortFixedAssessmentQuestions.some(({ id }) => id === questionId);
}

export function isShortSeparatorAssessmentQuestionId(
  questionId: string,
): questionId is ShortSeparatorAssessmentQuestionId {
  return shortSeparatorQuestionBank.some(({ id }) => id === questionId);
}

export function isShortAssessmentOptionIdForQuestion(
  question: ShortAssessmentQuestionData,
  optionId: unknown,
): optionId is ShortAssessmentOptionId {
  return typeof optionId === 'string'
    && question.options.some((option) => option.id === optionId);
}
