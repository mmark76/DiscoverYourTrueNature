import { archetypeById } from '../data/archetypes';
import { ArchetypeId, AssessmentResult, ScoreMap } from '../types';

const archetypeIds: ArchetypeId[] = ['wolf', 'owl', 'eagle', 'dolphin', 'bear'];

export function createEmptyScores(): Record<ArchetypeId, number> {
  return {
    wolf: 0,
    owl: 0,
    eagle: 0,
    dolphin: 0,
    bear: 0,
  };
}

export function addScores(
  currentScores: Record<ArchetypeId, number>,
  answerScores: ScoreMap,
): Record<ArchetypeId, number> {
  const nextScores = { ...currentScores };

  for (const archetypeId of archetypeIds) {
    nextScores[archetypeId] += answerScores[archetypeId] ?? 0;
  }

  return nextScores;
}

export function calculateAssessmentResult(
  scores: Record<ArchetypeId, number>,
): AssessmentResult {
  const rankedScores = archetypeIds
    .map((archetypeId) => [archetypeId, scores[archetypeId]] as const)
    .sort((left, right) => right[1] - left[1]);

  const primaryEntry = rankedScores[0];
  const secondaryEntry = rankedScores[1];

  if (!primaryEntry || !secondaryEntry) {
    throw new Error('At least two archetypes are required to calculate a result.');
  }

  const totalScore = Math.max(
    1,
    rankedScores.reduce((total, entry) => total + entry[1], 0),
  );

  return {
    primary: archetypeById[primaryEntry[0]],
    secondary: archetypeById[secondaryEntry[0]],
    confidence: Math.round((primaryEntry[1] / totalScore) * 100),
    scores,
  };
}
