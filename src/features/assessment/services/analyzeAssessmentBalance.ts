import { canonicalArchetypes, type ArchetypeId } from '../../archetypes/data/archetypes.ts';
import { dimensionIds, type DimensionScoreMap } from '../../archetypes/types.ts';
import { calculateAssessmentResult } from './scoreAssessment.ts';

export interface AssessmentBalanceReport {
  sampleCount: number;
  primaryCounts: Record<ArchetypeId, number>;
  secondaryCounts: Record<ArchetypeId, number>;
  averageMatchScores: Record<ArchetypeId, number>;
  tieCount: number;
  unreachablePrimary: ArchetypeId[];
  unreachableSecondary: ArchetypeId[];
}

export function analyzeAssessmentBalance(seed = 120124): AssessmentBalanceReport {
  const primaryCounts = createArchetypeCounter();
  const secondaryCounts = createArchetypeCounter();
  const scoreTotals = createArchetypeCounter();
  let sampleCount = 0;
  let tieCount = 0;

  function record(rawScores: DimensionScoreMap) {
    const result = calculateAssessmentResult(rawScores);
    primaryCounts[result.primary.archetype.id] += 1;
    secondaryCounts[result.secondary.archetype.id] += 1;
    for (const match of result.matches) scoreTotals[match.archetype.id] += match.exactScore;
    if (Math.abs(result.primary.exactScore - result.secondary.exactScore) < Number.EPSILON * 10) tieCount += 1;
    sampleCount += 1;
  }

  for (const archetype of canonicalArchetypes) {
    record(Object.fromEntries(
      dimensionIds.map((id) => [id, archetype.vector[id] * 3]),
    ) as DimensionScoreMap);
  }

  const random = createSeededRandom(seed);
  for (const archetype of canonicalArchetypes) {
    for (let sample = 0; sample < 200; sample += 1) {
      record(Object.fromEntries(dimensionIds.map((id) => {
        const baseline = archetype.vector[id] * 3;
        const perturbation = Math.floor(random() * 5) - 2;
        return [id, clamp(baseline + perturbation, -6, 6)];
      })) as DimensionScoreMap);
    }
  }

  for (let sample = 0; sample < 10000; sample += 1) {
    record(Object.fromEntries(
      dimensionIds.map((id) => [id, Math.floor(random() * 13) - 6]),
    ) as DimensionScoreMap);
  }

  const averageMatchScores = Object.fromEntries(canonicalArchetypes.map(({ id }) => [
    id,
    Number((scoreTotals[id] / sampleCount).toFixed(4)),
  ])) as Record<ArchetypeId, number>;

  return {
    sampleCount,
    primaryCounts,
    secondaryCounts,
    averageMatchScores,
    tieCount,
    unreachablePrimary: canonicalArchetypes.filter(({ id }) => primaryCounts[id] === 0).map(({ id }) => id),
    unreachableSecondary: canonicalArchetypes.filter(({ id }) => secondaryCounts[id] === 0).map(({ id }) => id),
  };
}

function createArchetypeCounter(): Record<ArchetypeId, number> {
  return Object.fromEntries(canonicalArchetypes.map(({ id }) => [id, 0])) as Record<ArchetypeId, number>;
}

function createSeededRandom(initialSeed: number): () => number {
  let state = initialSeed >>> 0;
  return () => {
    state = ((state * 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
