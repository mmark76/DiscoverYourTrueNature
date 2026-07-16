import type { DimensionVector } from '../types.ts';

export const assessmentModelVersion = '12-archetype-v1';

export const canonicalArchetypes = [
  { id: 'wolf', symbol: '🐺', vector: { affiliation: 1, reasoning: 0, tempo: 1, structure: 1, influence: 1, exploration: 0, expression: -1, perspective: 0 } },
  { id: 'owl', symbol: '🦉', vector: { affiliation: -1, reasoning: 2, tempo: -1, structure: 1, influence: -1, exploration: 0, expression: -2, perspective: -1 } },
  { id: 'eagle', symbol: '🦅', vector: { affiliation: -1, reasoning: 0, tempo: 2, structure: 0, influence: 2, exploration: 2, expression: 0, perspective: 2 } },
  { id: 'dolphin', symbol: '🐬', vector: { affiliation: 2, reasoning: -1, tempo: 1, structure: -1, influence: -1, exploration: 1, expression: 2, perspective: 0 } },
  { id: 'bear', symbol: '🐻', vector: { affiliation: 1, reasoning: 0, tempo: -1, structure: 1, influence: 1, exploration: -2, expression: -1, perspective: -1 } },
  { id: 'lion', symbol: '🦁', vector: { affiliation: 1, reasoning: -1, tempo: 2, structure: 0, influence: 2, exploration: 1, expression: 2, perspective: 1 } },
  { id: 'fox', symbol: '🦊', vector: { affiliation: -1, reasoning: 1, tempo: 1, structure: -2, influence: 0, exploration: 2, expression: 0, perspective: -1 } },
  { id: 'panther', symbol: '🐆', vector: { affiliation: -2, reasoning: -1, tempo: 1, structure: 0, influence: 1, exploration: 1, expression: -2, perspective: 1 } },
  { id: 'elephant', symbol: '🐘', vector: { affiliation: 2, reasoning: 1, tempo: -1, structure: 2, influence: -1, exploration: -1, expression: 1, perspective: -1 } },
  { id: 'horse', symbol: '🐴', vector: { affiliation: 1, reasoning: -1, tempo: 2, structure: -2, influence: 0, exploration: 2, expression: 1, perspective: 1 } },
  { id: 'turtle', symbol: '🐢', vector: { affiliation: -1, reasoning: 1, tempo: -2, structure: 2, influence: -2, exploration: -2, expression: -2, perspective: -1 } },
  { id: 'octopus', symbol: '🐙', vector: { affiliation: -1, reasoning: 2, tempo: 0, structure: -2, influence: -1, exploration: 2, expression: 0, perspective: 2 } },
] as const satisfies readonly {
  id: string;
  symbol: string;
  vector: DimensionVector;
}[];

export type ArchetypeId = (typeof canonicalArchetypes)[number]['id'];
export type AnimalId = ArchetypeId;
export type ArchetypeProfile = (typeof canonicalArchetypes)[number];
