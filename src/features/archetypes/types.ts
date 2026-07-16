export const primaryDimensionIds = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'emotionalStability',
] as const;

export const complementaryDimensionIds = [
  'independence',
  'initiative',
  'novelty',
  'directness',
  'flexibility',
  'fairness',
] as const;

export const dimensionIds = [
  ...primaryDimensionIds,
  ...complementaryDimensionIds,
] as const;

export type PrimaryDimensionId = (typeof primaryDimensionIds)[number];
export type ComplementaryDimensionId = (typeof complementaryDimensionIds)[number];
export type DimensionId = (typeof dimensionIds)[number];
export type TraitVector = Record<DimensionId, number>;
export type SparseTraitVector = Partial<TraitVector>;
export type TraitScoreMap = Record<DimensionId, number>;

export function createEmptyTraitMap(): TraitScoreMap {
  return Object.fromEntries(dimensionIds.map((id) => [id, 0])) as TraitScoreMap;
}
