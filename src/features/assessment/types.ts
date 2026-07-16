import type {
  DimensionId,
  SparseTraitVector,
  TraitScoreMap,
} from '../archetypes/types.ts';
import type {
  ArchetypeId,
  ArchetypeProfile,
} from '../archetypes/data/archetypes.ts';

export type { ArchetypeId, ArchetypeProfile, DimensionId, TraitScoreMap };

export const assessmentQuestionCategories = ['behavior', 'preference', 'adaptive'] as const;
export const assessmentWeightClasses = ['normal', 'lower', 'differentiator'] as const;

export type AssessmentQuestionCategory = (typeof assessmentQuestionCategories)[number];
export type AssessmentWeightClass = (typeof assessmentWeightClasses)[number];

export interface AssessmentOption {
  id: string;
  vector: SparseTraitVector;
}

export interface AssessmentQuestion {
  id: string;
  category: AssessmentQuestionCategory;
  scenarioId: string;
  primaryDimension: DimensionId;
  secondaryDimensions: readonly DimensionId[];
  weightClass: AssessmentWeightClass;
  adaptiveEligible: boolean;
  options: readonly [AssessmentOption, AssessmentOption, AssessmentOption, AssessmentOption];
}

export interface AssessmentAnswer {
  questionId: string;
  optionId: string;
}

export interface ArchetypeMatch {
  archetype: ArchetypeProfile;
  distance: number;
}

export interface AssessmentResult {
  primaryId: ArchetypeId;
  secondaryId: ArchetypeId;
}

export interface AssessmentRanking {
  profile: TraitScoreMap;
  matches: readonly ArchetypeMatch[];
  result: AssessmentResult;
}

export interface AssessmentSession {
  answers: readonly AssessmentAnswer[];
  adaptiveQuestionIds: readonly string[];
  result: AssessmentResult | null;
}
