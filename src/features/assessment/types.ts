import type {
  PersonalityTypeId,
  PersonalityAnimalProfile,
} from '../personalities/data/personalityAnimals.ts';
import type {
  DimensionId,
  DimensionProfile,
  PoleId,
  PoleScoreMap,
} from '../personalities/types.ts';

export type {
  DimensionId,
  DimensionProfile,
  PersonalityAnimalProfile,
  PersonalityTypeId,
  PoleId,
  PoleScoreMap,
};

export const assessmentPhases = ['everyday', 'structured', 'adaptive'] as const;
export const assessmentContexts = ['personal', 'professional'] as const;
export const assessmentOptionPositions = ['a', 'b'] as const;

export type AssessmentPhase = (typeof assessmentPhases)[number];
export type AssessmentContext = (typeof assessmentContexts)[number];
export type AssessmentOptionPosition = (typeof assessmentOptionPositions)[number];

export interface AssessmentOption {
  id: string;
  pole: PoleId;
  position: AssessmentOptionPosition;
}

export interface AssessmentQuestion {
  id: string;
  phase: AssessmentPhase;
  context: AssessmentContext;
  scenarioId: string;
  dimension: DimensionId;
  weight: number;
  reverseKeyed: boolean;
  options: readonly [AssessmentOption, AssessmentOption];
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface PersonalityMatch {
  personality: PersonalityAnimalProfile;
  distance: number;
}

export interface LockedPrimaryResult {
  primaryTypeId: PersonalityTypeId;
  balancedDimensionIds: readonly DimensionId[];
  hasCloseMatch: boolean;
}

export interface AssessmentResult extends LockedPrimaryResult {
  secondaryTypeId: PersonalityTypeId;
}

export type ContextProfileDirection = 'first' | 'second' | 'balanced';
export type ContextProfileKind =
  | 'personal-stronger'
  | 'professional-stronger'
  | 'context-dependent';

/**
 * Internal, score-free context insight. The UI must translate this into
 * animal-centred prose and must never expose dimension or pole identifiers.
 */
export interface ContextProfileObservation {
  dimension: DimensionId;
  kind: ContextProfileKind;
  personalDirection: ContextProfileDirection;
  professionalDirection: ContextProfileDirection;
}

export interface AssessmentSession {
  schemaVersion: 3;
  modelVersion: '16-personality-binary-v2-30q';
  currentQuestionIndex: number;
  answers: readonly AssessmentAnswer[];
  adaptiveQuestionIds: readonly string[];
  lockedPrimary: LockedPrimaryResult | null;
  result: AssessmentResult | null;
}
