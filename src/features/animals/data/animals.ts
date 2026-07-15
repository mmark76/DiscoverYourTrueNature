export type AnimalAvailability = 'prototype' | 'coming-soon';

export interface ProvisionalAnimal {
  id: string;
  availability: AnimalAvailability;
}

export const provisionalAnimals = [
  { id: 'wolf', availability: 'prototype' },
  { id: 'owl', availability: 'prototype' },
  { id: 'eagle', availability: 'prototype' },
  { id: 'dolphin', availability: 'prototype' },
  { id: 'bear', availability: 'prototype' },
  { id: 'lion', availability: 'coming-soon' },
  { id: 'fox', availability: 'coming-soon' },
  { id: 'panther', availability: 'coming-soon' },
  { id: 'elephant', availability: 'coming-soon' },
  { id: 'horse', availability: 'coming-soon' },
  { id: 'turtle', availability: 'coming-soon' },
  { id: 'octopus', availability: 'coming-soon' },
] as const satisfies readonly ProvisionalAnimal[];

export type AnimalId = (typeof provisionalAnimals)[number]['id'];
export type ProvisionalAnimalData = (typeof provisionalAnimals)[number];
