import type { DimensionProfile } from '../types.ts';

export const assessmentModelVersion = '16-personality-binary-v2-30q' as const;

export const personalityTypeIds = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
] as const;

export type PersonalityTypeId = (typeof personalityTypeIds)[number];

const personalityAnimalDefinitions = [
  { id: 'INTJ', animalId: 'raven', symbol: '🐦‍⬛' },
  { id: 'INTP', animalId: 'octopus', symbol: '🐙' },
  { id: 'ENTJ', animalId: 'lion', symbol: '🦁' },
  { id: 'ENTP', animalId: 'fox', symbol: '🦊' },
  { id: 'INFJ', animalId: 'elephant', symbol: '🐘' },
  { id: 'INFP', animalId: 'deer', symbol: '🦌' },
  { id: 'ENFJ', animalId: 'dolphin', symbol: '🐬' },
  { id: 'ENFP', animalId: 'otter', symbol: '🦦' },
  { id: 'ISTJ', animalId: 'beaver', symbol: '🦫' },
  { id: 'ISFJ', animalId: 'dog', symbol: '🐕' },
  { id: 'ESTJ', animalId: 'wolf', symbol: '🐺' },
  { id: 'ESFJ', animalId: 'penguin', symbol: '🐧' },
  { id: 'ISTP', animalId: 'falcon', symbol: '🦅' },
  { id: 'ISFP', animalId: 'swan', symbol: '🦢' },
  { id: 'ESTP', animalId: 'cheetah', symbol: '🐆' },
  { id: 'ESFP', animalId: 'peacock', symbol: '🦚' },
] as const satisfies readonly {
  id: PersonalityTypeId;
  animalId: string;
  symbol: string;
}[];

export type AnimalId = (typeof personalityAnimalDefinitions)[number]['animalId'];

export interface PersonalityAnimalProfile {
  id: PersonalityTypeId;
  animalId: AnimalId;
  symbol: string;
  profile: DimensionProfile;
}

function createCanonicalProfile(id: PersonalityTypeId): DimensionProfile {
  return {
    energy: id[0] === 'E' ? 1 : -1,
    information: id[1] === 'S' ? 1 : -1,
    decisions: id[2] === 'T' ? 1 : -1,
    structure: id[3] === 'J' ? 1 : -1,
  };
}

export const canonicalPersonalityAnimals: readonly PersonalityAnimalProfile[] =
  personalityAnimalDefinitions.map(({ id, animalId, symbol }) => ({
    id,
    animalId,
    symbol,
    profile: createCanonicalProfile(id),
  }));

export function getPersonalityAnimal(typeId: PersonalityTypeId): PersonalityAnimalProfile {
  const profile = canonicalPersonalityAnimals.find(({ id }) => id === typeId);
  if (!profile) throw new Error(`Unknown personality type: ${typeId}.`);
  return profile;
}

export function getPersonalityTypeForAnimal(animalId: AnimalId): PersonalityTypeId {
  const profile = canonicalPersonalityAnimals.find((candidate) => candidate.animalId === animalId);
  if (!profile) throw new Error(`Unknown animal: ${animalId}.`);
  return profile.id;
}

export function isPersonalityTypeId(value: unknown): value is PersonalityTypeId {
  return typeof value === 'string'
    && (personalityTypeIds as readonly string[]).includes(value);
}

export function isAnimalId(value: unknown): value is AnimalId {
  return typeof value === 'string'
    && canonicalPersonalityAnimals.some(({ animalId }) => animalId === value);
}
