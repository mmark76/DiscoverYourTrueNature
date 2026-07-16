import { canonicalArchetypes, type ArchetypeId } from '../../archetypes/data/archetypes.ts';
import { dimensionIds, type AnswerValue, type DimensionScoreMap, type DimensionValue } from '../../archetypes/types.ts';
import { assessmentQuestions } from '../data/questions.ts';

const canonicalAnswers: Record<DimensionValue, readonly [AnswerValue, AnswerValue, AnswerValue]> = {
  '-2': [-2, -2, -2],
  '-1': [-1, -1, -1],
  0: [-2, 1, 1],
  1: [1, 1, 1],
  2: [2, 2, 2],
};

export function createCanonicalAnswerValues(archetypeId: ArchetypeId): Record<string, AnswerValue> {
  const archetype = canonicalArchetypes.find(({ id }) => id === archetypeId);
  if (!archetype) throw new Error(`Unknown archetype fixture: ${archetypeId}`);

  const dimensionUseCount = Object.fromEntries(dimensionIds.map((id) => [id, 0])) as Record<keyof DimensionScoreMap, number>;
  return Object.fromEntries(assessmentQuestions.map((question) => {
    const useIndex = dimensionUseCount[question.dimension]++;
    const value = canonicalAnswers[archetype.vector[question.dimension]][useIndex];
    if (value === undefined) throw new Error(`Missing canonical answer for ${question.id}`);
    return [question.id, value];
  }));
}

export function accumulateAnswerValues(answerValues: Record<string, AnswerValue>): DimensionScoreMap {
  const scores = Object.fromEntries(dimensionIds.map((id) => [id, 0])) as DimensionScoreMap;
  for (const question of assessmentQuestions) {
    const value = answerValues[question.id];
    if (value === undefined) throw new Error(`Missing fixture answer for ${question.id}`);
    scores[question.dimension] += value;
  }
  return scores;
}
