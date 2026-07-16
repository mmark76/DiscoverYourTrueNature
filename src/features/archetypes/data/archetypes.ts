import type { TraitVector } from '../types.ts';

export const assessmentModelVersion = '12-archetype-v2-25q';

/**
 * Canonical identity, display order, and normalized hidden profiles for all Animals Within animals.
 * Values run from -1 to 1. Opposite values describe different preferences, not better or worse
 * qualities. The animal catalog re-exports this collection so IDs and ordering cannot drift.
 */
export const canonicalArchetypes = [
  { id: 'wolf', symbol: '🐺', profile: { openness: 0.05, conscientiousness: 0.60, extraversion: -0.05, agreeableness: 0.20, emotionalStability: 0.70, independence: 0.55, initiative: 0.45, novelty: -0.20, directness: 0.40, flexibility: -0.25, fairness: 0.35 } },
  { id: 'owl', symbol: '🦉', profile: { openness: 0.65, conscientiousness: 0.65, extraversion: -0.65, agreeableness: 0.05, emotionalStability: 0.50, independence: 0.65, initiative: -0.25, novelty: 0.20, directness: 0.10, flexibility: -0.40, fairness: 0.60 } },
  { id: 'eagle', symbol: '🦅', profile: { openness: 0.65, conscientiousness: 0.45, extraversion: 0.35, agreeableness: -0.05, emotionalStability: 0.75, independence: 0.65, initiative: 0.90, novelty: 0.55, directness: 0.65, flexibility: 0.05, fairness: 0.25 } },
  { id: 'dolphin', symbol: '🐬', profile: { openness: 0.50, conscientiousness: -0.05, extraversion: 0.80, agreeableness: 0.85, emotionalStability: 0.35, independence: -0.65, initiative: 0.05, novelty: 0.55, directness: -0.65, flexibility: 0.70, fairness: 0.45 } },
  { id: 'bear', symbol: '🐻', profile: { openness: -0.50, conscientiousness: 0.65, extraversion: -0.25, agreeableness: 0.55, emotionalStability: 0.75, independence: 0.15, initiative: 0.25, novelty: -0.75, directness: 0.15, flexibility: -0.55, fairness: 0.55 } },
  { id: 'lion', symbol: '🦁', profile: { openness: 0.25, conscientiousness: 0.35, extraversion: 0.85, agreeableness: 0.05, emotionalStability: 0.70, independence: 0.15, initiative: 0.95, novelty: 0.25, directness: 0.75, flexibility: -0.05, fairness: 0.10 } },
  { id: 'fox', symbol: '🦊', profile: { openness: 0.80, conscientiousness: -0.25, extraversion: 0.15, agreeableness: -0.05, emotionalStability: 0.45, independence: 0.65, initiative: 0.35, novelty: 0.85, directness: 0.20, flexibility: 0.90, fairness: 0.05 } },
  { id: 'panther', symbol: '🐆', profile: { openness: 0.25, conscientiousness: 0.35, extraversion: -0.75, agreeableness: -0.10, emotionalStability: 0.85, independence: 0.95, initiative: 0.55, novelty: 0.20, directness: 0.40, flexibility: 0.10, fairness: 0.20 } },
  { id: 'elephant', symbol: '🐘', profile: { openness: -0.10, conscientiousness: 0.90, extraversion: 0.15, agreeableness: 0.85, emotionalStability: 0.65, independence: -0.55, initiative: -0.05, novelty: -0.70, directness: -0.45, flexibility: -0.70, fairness: 0.90 } },
  { id: 'horse', symbol: '🐴', profile: { openness: 0.65, conscientiousness: -0.35, extraversion: 0.65, agreeableness: 0.40, emotionalStability: 0.55, independence: 0.40, initiative: 0.35, novelty: 0.95, directness: 0.05, flexibility: 0.85, fairness: 0.25 } },
  { id: 'turtle', symbol: '🐢', profile: { openness: -0.30, conscientiousness: 0.80, extraversion: -0.50, agreeableness: 0.35, emotionalStability: 0.75, independence: 0.25, initiative: -0.25, novelty: -0.60, directness: -0.30, flexibility: -0.55, fairness: 0.90 } },
  { id: 'octopus', symbol: '🐙', profile: { openness: 0.95, conscientiousness: 0.05, extraversion: -0.25, agreeableness: 0.10, emotionalStability: 0.40, independence: 0.70, initiative: 0.00, novelty: 0.80, directness: -0.05, flexibility: 0.95, fairness: 0.35 } },
] as const satisfies readonly {
  id: string;
  symbol: string;
  profile: TraitVector;
}[];

export type ArchetypeId = (typeof canonicalArchetypes)[number]['id'];
export type AnimalId = ArchetypeId;
export type ArchetypeProfile = (typeof canonicalArchetypes)[number];
