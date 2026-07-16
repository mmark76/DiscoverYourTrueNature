export const dimensionIds = [
  'energy',
  'information',
  'decisions',
  'structure',
] as const;

export type DimensionId = (typeof dimensionIds)[number];

export const poleIds = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'] as const;

export type PoleId = (typeof poleIds)[number];

export const dimensionDefinitions = {
  energy: { firstPole: 'E', secondPole: 'I' },
  information: { firstPole: 'S', secondPole: 'N' },
  decisions: { firstPole: 'T', secondPole: 'F' },
  structure: { firstPole: 'J', secondPole: 'P' },
} as const satisfies Record<DimensionId, {
  firstPole: PoleId;
  secondPole: PoleId;
}>;

export type DimensionProfile = Record<DimensionId, number>;
export type PoleScoreMap = Record<PoleId, number>;

export function createEmptyPoleScoreMap(): PoleScoreMap {
  return Object.fromEntries(poleIds.map((pole) => [pole, 0])) as PoleScoreMap;
}

export function createEmptyDimensionProfile(): DimensionProfile {
  return Object.fromEntries(dimensionIds.map((dimension) => [dimension, 0])) as DimensionProfile;
}

export function isDimensionId(value: unknown): value is DimensionId {
  return typeof value === 'string' && (dimensionIds as readonly string[]).includes(value);
}

export function isPoleId(value: unknown): value is PoleId {
  return typeof value === 'string' && (poleIds as readonly string[]).includes(value);
}

export function isPoleForDimension(pole: PoleId, dimension: DimensionId): boolean {
  const definition = dimensionDefinitions[dimension];
  return pole === definition.firstPole || pole === definition.secondPole;
}
