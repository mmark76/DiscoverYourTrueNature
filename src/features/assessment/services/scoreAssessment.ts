import {
  canonicalArchetypes,
  type ArchetypeProfile,
} from '../../archetypes/data/archetypes.ts';
import {
  dimensionIds,
  type AnswerValue,
  type DimensionId,
  type DimensionScoreMap,
} from '../../archetypes/types.ts';
import type { ArchetypeMatch, AssessmentResult } from '../types.ts';

const questionsPerDimension = 3;
const maximumRawDimensionTotal = questionsPerDimension * 2;
const maximumNormalizedDistance = 2;

export function createEmptyDimensionScores(): DimensionScoreMap {
  return Object.fromEntries(dimensionIds.map((id) => [id, 0])) as DimensionScoreMap;
}

export function addDimensionScore(
  currentScores: DimensionScoreMap,
  dimension: DimensionId,
  value: AnswerValue,
): DimensionScoreMap {
  return { ...currentScores, [dimension]: currentScores[dimension] + value };
}

export function normalizeDimensionScores(rawScores: DimensionScoreMap): DimensionScoreMap {
  return Object.fromEntries(
    dimensionIds.map((id) => {
      const rawValue = rawScores[id];
      if (!Number.isFinite(rawValue)) throw new Error(`Invalid dimension score: ${id}`);
      return [id, clamp(rawValue / maximumRawDimensionTotal, -1, 1)];
    }),
  ) as DimensionScoreMap;
}

export function normalizeArchetypeVector(archetype: ArchetypeProfile): DimensionScoreMap {
  return Object.fromEntries(
    dimensionIds.map((id) => [id, archetype.vector[id] / 2]),
  ) as DimensionScoreMap;
}

export function calculateNormalizedDistance(
  userDimensions: DimensionScoreMap,
  archetype: ArchetypeProfile,
): number {
  const archetypeDimensions = normalizeArchetypeVector(archetype);
  const meanSquaredDistance = dimensionIds.reduce((total, id) => {
    const difference = userDimensions[id] - archetypeDimensions[id];
    return total + (difference * difference);
  }, 0) / dimensionIds.length;

  return Math.sqrt(meanSquaredDistance);
}

export function calculateExactMatchScore(
  userDimensions: DimensionScoreMap,
  archetype: ArchetypeProfile,
): number {
  const distance = calculateNormalizedDistance(userDimensions, archetype);
  return clamp(1 - (distance / maximumNormalizedDistance), 0, 1) * 100;
}

export function calculateAssessmentResult(rawScores: DimensionScoreMap): AssessmentResult {
  const dimensions = normalizeDimensionScores(rawScores);
  const matches: ArchetypeMatch[] = canonicalArchetypes
    .map((archetype, canonicalIndex) => ({
      archetype,
      canonicalIndex,
      exactScore: calculateExactMatchScore(dimensions, archetype),
    }))
    .sort((left, right) =>
      (right.exactScore - left.exactScore) || (left.canonicalIndex - right.canonicalIndex),
    )
    .map(({ archetype, exactScore }) => ({
      archetype,
      exactScore,
      score: Math.round(exactScore),
    }));

  const primary = matches[0];
  const secondary = matches[1];
  if (!primary || !secondary || matches.length !== canonicalArchetypes.length) {
    throw new Error('The assessment result requires a complete twelve-archetype ranking.');
  }

  return { primary, secondary, matches, dimensions };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
