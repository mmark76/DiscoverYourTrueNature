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

export const assessmentQuestionKinds = ['fixed', 'adaptive'] as const;
export const assessmentRanks = [1, 2, 3, 4] as const;
export const assessmentOptionIntensities = [1, 2] as const;

export type AssessmentQuestionKind = (typeof assessmentQuestionKinds)[number];
export type AssessmentRank = (typeof assessmentRanks)[number];
export type AssessmentOptionIntensity = (typeof assessmentOptionIntensities)[number];

export interface AssessmentOption {
  id: string;
  pole: PoleId;
  intensity: AssessmentOptionIntensity;
}

export interface AssessmentQuestion {
  id: string;
  kind: AssessmentQuestionKind;
  scenarioId: string;
  dimension: DimensionId;
  options: readonly [AssessmentOption, AssessmentOption, AssessmentOption, AssessmentOption];
}

export interface AssessmentRankAssignment {
  optionId: string;
  rank: AssessmentRank;
}

export type AssessmentRankingAssignments = readonly [
  AssessmentRankAssignment,
  AssessmentRankAssignment,
  AssessmentRankAssignment,
  AssessmentRankAssignment,
];

export interface AssessmentAnswer {
  questionId: string;
  rankings: AssessmentRankingAssignments;
}

export interface PersonalityMatch {
  personality: PersonalityAnimalProfile;
  distance: number;
}

export interface AssessmentResult {
  primaryTypeId: PersonalityTypeId;
  secondaryTypeId: PersonalityTypeId;
  balancedDimensionIds: readonly DimensionId[];
}

export interface AssessmentRanking {
  poleTotals: PoleScoreMap;
  profile: DimensionProfile;
  matches: readonly PersonalityMatch[];
  result: AssessmentResult;
}

export interface AssessmentSession {
  schemaVersion: 2;
  modelVersion: '16-personality-ranking-v1-25q';
  currentQuestionIndex: number;
  answers: readonly AssessmentAnswer[];
  adaptiveQuestionIds: readonly string[];
  result: AssessmentResult | null;
}
