import {
  getPersonalityAnimal,
  type PersonalityTypeId,
} from '../../personalities/data/personalityAnimals.ts';
import { dimensionDefinitions } from '../../personalities/types.ts';
import type { DimensionProfile, PoleId } from '../../personalities/types.ts';
import type { AssessmentQuestionData } from '../data/questions.ts';
import type { AssessmentRank, AssessmentSession } from '../types.ts';
import {
  completeAssessmentWithRankingSelector,
} from './assessmentSession.ts';
import type { RankingDraft } from './ranking.ts';

const representativeSessionCache = new Map<PersonalityTypeId, AssessmentSession>();

export function createRepresentativeAssessmentSession(
  typeId: PersonalityTypeId,
): AssessmentSession {
  const cached = representativeSessionCache.get(typeId);
  if (cached) return cached;
  const target = getPersonalityAnimal(typeId);
  const session = completeAssessmentWithRankingSelector((question) => {
    const { firstPole } = dimensionDefinitions[question.dimension];
    return createRankingDraftForPole(
      question,
      target.profile[question.dimension] > 0
        ? firstPole
        : dimensionDefinitions[question.dimension].secondPole,
    );
  });
  representativeSessionCache.set(typeId, session);
  return session;
}

export function createSeededAssessmentSession(seed: number): AssessmentSession {
  const random = createSeededRandom(seed);
  return completeAssessmentWithRankingSelector((question) => {
    const ranks: AssessmentRank[] = [1, 2, 3, 4];
    for (let index = ranks.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      const temporary = ranks[index];
      ranks[index] = ranks[swapIndex] as AssessmentRank;
      ranks[swapIndex] = temporary as AssessmentRank;
    }
    return createRankingDraftFromRanks(question, ranks);
  });
}

export function createRankingDraftForPole(
  question: AssessmentQuestionData,
  preferredPole: PoleId,
): RankingDraft {
  const { firstPole, secondPole } = dimensionDefinitions[question.dimension];
  if (preferredPole !== firstPole && preferredPole !== secondPole) {
    throw new Error(`Pole ${preferredPole} does not belong to ${question.dimension}.`);
  }

  return createRankingDraftFromRanks(
    question,
    preferredPole === firstPole ? [4, 3, 1, 2] : [2, 1, 3, 4],
  );
}

export function createRankingDraftFromRanks(
  question: AssessmentQuestionData,
  ranks: readonly AssessmentRank[],
): RankingDraft {
  if (ranks.length !== question.options.length || new Set(ranks).size !== 4) {
    throw new Error('A ranking fixture requires ranks 1, 2, 3, and 4 exactly once.');
  }
  return Object.fromEntries(
    question.options.map(({ id }, index) => [id, ranks[index]]),
  );
}

export function createCanonicalProfile(typeId: PersonalityTypeId): DimensionProfile {
  return { ...getPersonalityAnimal(typeId).profile };
}

function createSeededRandom(initialSeed: number): () => number {
  let state = initialSeed >>> 0;
  return () => {
    state = ((state * 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
