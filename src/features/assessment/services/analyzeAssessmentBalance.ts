import {
  canonicalArchetypes,
  type ArchetypeId,
} from '../../archetypes/data/archetypes.ts';
import {
  dimensionIds,
  type TraitScoreMap,
} from '../../archetypes/types.ts';
import {
  createCanonicalProfile,
  createRepresentativeAssessmentSession,
  createSecondaryRepresentativeAssessmentSession,
} from './assessmentFixtures.ts';
import {
  calculateAssessmentRanking,
  rankArchetypes,
} from './scoreAssessment.ts';

export interface ReachabilityResult {
  primaryId: ArchetypeId;
  secondaryId: ArchetypeId;
}

export interface RepresentativeRunResult extends ReachabilityResult {
  questionCount: number;
  adaptiveQuestionIds: readonly string[];
}

export interface AssessmentBalanceReport {
  sampleCount: number;
  primaryCounts: Record<ArchetypeId, number>;
  secondaryCounts: Record<ArchetypeId, number>;
  averageDistances: Record<ArchetypeId, number>;
  tieCount: number;
  directProfileResults: Record<ArchetypeId, ReachabilityResult>;
  secondaryFixtureResults: Record<ArchetypeId, RepresentativeRunResult>;
  representativeRunResults: Record<ArchetypeId, RepresentativeRunResult>;
  adaptivePairCounts: Record<string, number>;
  unreachablePrimary: ArchetypeId[];
  unreachableSecondary: ArchetypeId[];
}

export function analyzeAssessmentBalance(seed = 250712): AssessmentBalanceReport {
  const primaryCounts = createArchetypeCounter();
  const secondaryCounts = createArchetypeCounter();
  const distanceTotals = createArchetypeCounter();
  const directProfileResults = {} as Record<ArchetypeId, ReachabilityResult>;
  const secondaryFixtureResults = {} as Record<ArchetypeId, RepresentativeRunResult>;
  const representativeRunResults = {} as Record<ArchetypeId, RepresentativeRunResult>;
  const adaptivePairCounts: Record<string, number> = {};
  let sampleCount = 0;
  let tieCount = 0;

  function record(profile: TraitScoreMap): ReachabilityResult {
    const matches = rankArchetypes(profile);
    const primary = matches[0];
    const secondary = matches[1];
    if (!primary || !secondary) throw new Error('Balance analysis requires two matches.');
    primaryCounts[primary.archetype.id] += 1;
    secondaryCounts[secondary.archetype.id] += 1;
    for (const match of matches) distanceTotals[match.archetype.id] += match.distance;
    if (Math.abs(primary.distance - secondary.distance) < Number.EPSILON * 10) tieCount += 1;
    sampleCount += 1;
    return { primaryId: primary.archetype.id, secondaryId: secondary.archetype.id };
  }

  for (const archetype of canonicalArchetypes) {
    directProfileResults[archetype.id] = record(createCanonicalProfile(archetype.id));
    const secondarySession = createSecondaryRepresentativeAssessmentSession(archetype.id);
    const secondaryRanking = calculateAssessmentRanking(secondarySession.answers);
    secondaryFixtureResults[archetype.id] = {
      ...secondaryRanking.result,
      questionCount: secondarySession.answers.length,
      adaptiveQuestionIds: secondarySession.adaptiveQuestionIds,
    };
    record(secondaryRanking.profile);

    const session = createRepresentativeAssessmentSession(archetype.id);
    const ranking = calculateAssessmentRanking(session.answers);
    const pairKey = session.adaptiveQuestionIds.join(' + ');
    adaptivePairCounts[pairKey] = (adaptivePairCounts[pairKey] ?? 0) + 1;
    representativeRunResults[archetype.id] = {
      ...ranking.result,
      questionCount: session.answers.length,
      adaptiveQuestionIds: session.adaptiveQuestionIds,
    };
    record(ranking.profile);
  }

  const random = createSeededRandom(seed);
  for (const archetype of canonicalArchetypes) {
    for (let sample = 0; sample < 200; sample += 1) {
      const profile = Object.fromEntries(dimensionIds.map((dimension) => [
        dimension,
        clamp(archetype.profile[dimension] + ((random() - 0.5) * 0.5), -1, 1),
      ])) as TraitScoreMap;
      record(profile);
    }
  }

  for (let sample = 0; sample < 10000; sample += 1) {
    record(Object.fromEntries(
      dimensionIds.map((dimension) => [dimension, (random() * 2) - 1]),
    ) as TraitScoreMap);
  }

  const averageDistances = Object.fromEntries(canonicalArchetypes.map(({ id }) => [
    id,
    Number((distanceTotals[id] / sampleCount).toFixed(4)),
  ])) as Record<ArchetypeId, number>;

  return {
    sampleCount,
    primaryCounts,
    secondaryCounts,
    averageDistances,
    tieCount,
    directProfileResults,
    secondaryFixtureResults,
    representativeRunResults,
    adaptivePairCounts,
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
