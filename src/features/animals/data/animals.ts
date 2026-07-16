import {
  canonicalPersonalityAnimals,
  type AnimalId,
} from '../../personalities/data/personalityAnimals.ts';

export type { AnimalId };

/**
 * Public animal catalog data deliberately omits internal personality identifiers and profiles.
 */
export interface AnimalData {
  id: AnimalId;
  symbol: string;
}

export const animals: readonly AnimalData[] = canonicalPersonalityAnimals.map(
  ({ animalId, symbol }) => ({ id: animalId, symbol }),
);
