export type AnimalAvailability = 'prototype' | 'informational';

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
  { id: 'lion', availability: 'informational' },
  { id: 'fox', availability: 'informational' },
  { id: 'panther', availability: 'informational' },
  { id: 'elephant', availability: 'informational' },
  { id: 'horse', availability: 'informational' },
  { id: 'turtle', availability: 'informational' },
  { id: 'octopus', availability: 'informational' },
] as const satisfies readonly ProvisionalAnimal[];

export type AnimalId = (typeof provisionalAnimals)[number]['id'];
export type ProvisionalAnimalData = (typeof provisionalAnimals)[number];
