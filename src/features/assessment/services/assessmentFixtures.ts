import {
  canonicalArchetypes,
  type ArchetypeId,
} from '../../archetypes/data/archetypes.ts';
import {
  dimensionIds,
  type SparseTraitVector,
  type TraitScoreMap,
} from '../../archetypes/types.ts';
import {
  completedAssessmentQuestionCount,
  type AssessmentQuestionData,
} from '../data/questions.ts';
import type { AssessmentSession } from '../types.ts';
import {
  answerCurrentAssessmentQuestion,
  completeAssessmentWithOptionSelector,
  createAssessmentSession,
  getCurrentAssessmentQuestion,
} from './assessmentSession.ts';
import {
  calculateNormalizedDistance,
  calculateTraitProfile,
  matchingDimensionWeights,
} from './scoreAssessment.ts';

const representativeSessionCache = new Map<ArchetypeId, AssessmentSession>();
const secondaryRepresentativeSessionCache = new Map<ArchetypeId, AssessmentSession>();
const representativeBeamWidth = 64;
const secondaryFixtureSeed = 0x25a11;
const secondaryFixtureSampleLimit = 50000;

export function createRepresentativeAssessmentSession(
  archetypeId: ArchetypeId,
): AssessmentSession {
  const cached = representativeSessionCache.get(archetypeId);
  if (cached) return cached;
  const archetype = getArchetype(archetypeId);
  let candidates: { session: AssessmentSession; distance: number }[] = [
    { session: createAssessmentSession(), distance: 0 },
  ];

  for (
    let questionNumber = 0;
    questionNumber < completedAssessmentQuestionCount;
    questionNumber += 1
  ) {
    const expanded: { session: AssessmentSession; distance: number }[] = [];
    for (const candidate of candidates) {
      const question = getCurrentAssessmentQuestion(candidate.session);
      if (!question) {
        throw new Error(
          `Representative run ended before question ${completedAssessmentQuestionCount}.`,
        );
      }
      for (const option of question.options) {
        const session = answerCurrentAssessmentQuestion(candidate.session, question.id, option.id);
        const profile = calculateTraitProfile(session.answers);
        expanded.push({
          session,
          distance: calculateNormalizedDistance(profile, archetype),
        });
      }
    }
    expanded.sort((left, right) => left.distance - right.distance);
    candidates = expanded.slice(0, representativeBeamWidth);
  }

  const selected = candidates.find(({ session }) => session.result?.primaryId === archetypeId)
    ?? candidates[0];
  if (!selected?.session.result) {
    throw new Error(`No complete representative assessment found for ${archetypeId}.`);
  }
  representativeSessionCache.set(archetypeId, selected.session);
  return selected.session;
}

/**
 * Builds deterministic, legal 25-answer fixtures for secondary reachability. The seeded selector
 * is test/developer tooling only: assessment matching and adaptive selection remain non-random.
 * Each cached session has traversed the production session state machine, including both adaptive
 * selections, so it proves reachability through answer options rather than an arbitrary profile.
 */
export function createSecondaryRepresentativeAssessmentSession(
  archetypeId: ArchetypeId,
): AssessmentSession {
  if (secondaryRepresentativeSessionCache.size < canonicalArchetypes.length) {
    buildSecondaryRepresentativeSessions();
  }

  const session = secondaryRepresentativeSessionCache.get(archetypeId);
  if (!session) throw new Error(`No complete secondary assessment fixture found for ${archetypeId}.`);
  return session;
}

export function selectClosestOptionId(
  question: AssessmentQuestionData,
  targetProfile: TraitScoreMap,
): string {
  const dimensions = [question.primaryDimension, ...question.secondaryDimensions];
  const rankedOptions = question.options
    .map((option, optionIndex) => ({
      id: option.id,
      optionIndex,
      distance: dimensions.reduce((total, dimension, index) => {
        const vector: SparseTraitVector = option.vector;
        const difference = (vector[dimension] ?? 0) - targetProfile[dimension];
        const primaryEmphasis = index === 0 ? 1.25 : 1;
        return total + difference * difference * matchingDimensionWeights[dimension] * primaryEmphasis;
      }, 0),
    }))
    .sort((left, right) =>
      (left.distance - right.distance) || (left.optionIndex - right.optionIndex),
    );

  const selected = rankedOptions[0];
  if (!selected) throw new Error(`Question ${question.id} has no representative option.`);
  return selected.id;
}

export function createCanonicalProfile(archetypeId: ArchetypeId): TraitScoreMap {
  const archetype = getArchetype(archetypeId);
  return Object.fromEntries(
    dimensionIds.map((dimension) => [dimension, archetype.profile[dimension]]),
  ) as TraitScoreMap;
}

function getArchetype(archetypeId: ArchetypeId) {
  const archetype = canonicalArchetypes.find(({ id }) => id === archetypeId);
  if (!archetype) throw new Error(`Unknown archetype: ${archetypeId}.`);
  return archetype;
}

function buildSecondaryRepresentativeSessions(): void {
  secondaryRepresentativeSessionCache.clear();
  const random = createSeededRandom(secondaryFixtureSeed);

  for (
    let sample = 0;
    sample < secondaryFixtureSampleLimit
      && secondaryRepresentativeSessionCache.size < canonicalArchetypes.length;
    sample += 1
  ) {
    const session = completeAssessmentWithOptionSelector((question) => {
      const optionIndex = Math.floor(random() * question.options.length);
      const option = question.options[optionIndex];
      if (!option) throw new Error(`Missing seeded fixture option for ${question.id}.`);
      return option.id;
    });
    const secondaryId = session.result?.secondaryId;
    if (secondaryId && !secondaryRepresentativeSessionCache.has(secondaryId)) {
      secondaryRepresentativeSessionCache.set(secondaryId, session);
    }
  }

  const missing = canonicalArchetypes
    .filter(({ id }) => !secondaryRepresentativeSessionCache.has(id))
    .map(({ id }) => id);
  if (missing.length > 0) {
    throw new Error(`Secondary assessment fixtures are unreachable: ${missing.join(', ')}.`);
  }
}

function createSeededRandom(initialSeed: number): () => number {
  let state = initialSeed >>> 0;
  return () => {
    state = ((state * 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
