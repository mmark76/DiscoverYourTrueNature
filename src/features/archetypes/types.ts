export const dimensionIds = [
  'affiliation',
  'reasoning',
  'tempo',
  'structure',
  'influence',
  'exploration',
  'expression',
  'perspective',
] as const;

export type DimensionId = (typeof dimensionIds)[number];
export type DimensionValue = -2 | -1 | 0 | 1 | 2;
export type AnswerValue = Exclude<DimensionValue, 0>;
export type DimensionVector = Record<DimensionId, DimensionValue>;
export type DimensionScoreMap = Record<DimensionId, number>;
