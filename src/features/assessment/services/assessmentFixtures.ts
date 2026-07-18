import {
  getPersonalityAnimal,
  type PersonalityTypeId,
} from '../../personalities/data/personalityAnimals.ts';
import { dimensionDefinitions } from '../../personalities/types.ts';
import type { DimensionProfile, PoleId } from '../../personalities/types.ts';
import type { AssessmentQuestionData } from '../data/questions.ts';
import type { AssessmentSession } from '../types.ts';
import { completeAssessmentWithOptionSelector } from './assessmentSession.ts';

const representativeSessionCache = new Map<PersonalityTypeId, AssessmentSession>();

export function createRepresentativeAssessmentSession(
  typeId: PersonalityTypeId,
): AssessmentSession {
  const cached = representativeSessionCache.get(typeId);
  if (cached) return cached;
  const target = getPersonalityAnimal(typeId);
  const session = completeAssessmentWithOptionSelector((question) => {
    const { firstPole, secondPole } = dimensionDefinitions[question.dimension];
    return selectOptionIdForPole(
      question,
      target.profile[question.dimension] > 0 ? firstPole : secondPole,
    );
  });
  representativeSessionCache.set(typeId, session);
  return session;
}

export function createSeededAssessmentSession(seed: number): AssessmentSession {
  const random = createSeededRandom(seed);
  return completeAssessmentWithOptionSelector((question) =>
    question.options[random() < 0.5 ? 0 : 1].id);
}

export function selectOptionIdForPole(
  question: AssessmentQuestionData,
  preferredPole: PoleId,
): string {
  const option = question.options.find(({ pole }) => pole === preferredPole);
  if (!option) throw new Error(`Pole ${preferredPole} does not belong to ${question.dimension}.`);
  return option.id;
}

export function selectFirstPoleOptionId(question: AssessmentQuestionData): string {
  return selectOptionIdForPole(
    question,
    dimensionDefinitions[question.dimension].firstPole,
  );
}

export function selectSecondPoleOptionId(question: AssessmentQuestionData): string {
  return selectOptionIdForPole(
    question,
    dimensionDefinitions[question.dimension].secondPole,
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
