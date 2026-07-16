import type {
  AnswerValue,
  DimensionId,
  DimensionScoreMap,
} from '../archetypes/types.ts';
import type {
  ArchetypeId,
  ArchetypeProfile,
} from '../archetypes/data/archetypes.ts';

export type { ArchetypeId, ArchetypeProfile, DimensionId, DimensionScoreMap };

export interface AssessmentOption {
  id: string;
  value: AnswerValue;
}

export interface AssessmentQuestion {
  id: string;
  dimension: DimensionId;
  options: readonly AssessmentOption[];
}

export interface ArchetypeMatch {
  archetype: ArchetypeProfile;
  score: number;
  exactScore: number;
}

export interface AssessmentResult {
  primary: ArchetypeMatch;
  secondary: ArchetypeMatch;
  matches: readonly ArchetypeMatch[];
  dimensions: DimensionScoreMap;
}
