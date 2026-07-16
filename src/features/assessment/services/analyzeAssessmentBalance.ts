import {
  canonicalPersonalityAnimals,
  personalityTypeIds,
  type PersonalityTypeId,
} from '../../personalities/data/personalityAnimals.ts';
import {
  createEmptyDimensionProfile,
  dimensionDefinitions,
  dimensionIds,
  type DimensionId,
} from '../../personalities/types.ts';
import {
  adaptiveQuestionBank,
  allAssessmentQuestions,
  fixedAssessmentQuestions,
} from '../data/questions.ts';
import {
  createCanonicalProfile,
  createRepresentativeAssessmentSession,
  createSeededAssessmentSession,
} from './assessmentFixtures.ts';
import {
  calculateAssessmentRanking,
  rankPersonalityTypes,
} from './scoreAssessment.ts';
import { selectAdaptiveQuestionIds } from './selectAdaptiveQuestions.ts';

export interface AssessmentBalanceReport {
  label: 'Engineering balance check — not scientific validation';
  sampleCount: number;
  fixedQuestionCount: number;
  adaptiveBankCount: number;
  fixedQuestionsPerDimension: Record<DimensionId, number>;
  adaptiveQuestionsPerDimension: Record<DimensionId, number>;
  optionStructureValid: boolean;
  uniqueAnimalCount: number;
  uniqueTypeCount: number;
  completeTypeCoverage: boolean;
  deterministicAdaptiveSelection: boolean;
  canonicalScoringSymmetry: boolean;
  exactTieHandlingDeterministic: boolean;
  primarySecondaryAlwaysDistinct: boolean;
  primaryCounts: Record<PersonalityTypeId, number>;
  secondaryCounts: Record<PersonalityTypeId, number>;
  unreachablePrimary: PersonalityTypeId[];
  unreachableSecondary: PersonalityTypeId[];
}

export function analyzeAssessmentBalance(
  seed = 160425,
  simulationCount = 4096,
): AssessmentBalanceReport {
  const primaryCounts = createTypeCounter();
  const secondaryCounts = createTypeCounter();
  let sampleCount = 0;
  let primarySecondaryAlwaysDistinct = true;

  function recordSession(typeId: PersonalityTypeId, secondaryId: PersonalityTypeId): void {
    primaryCounts[typeId] += 1;
    secondaryCounts[secondaryId] += 1;
    primarySecondaryAlwaysDistinct &&= typeId !== secondaryId;
    sampleCount += 1;
  }

  for (const typeId of personalityTypeIds) {
    const session = createRepresentativeAssessmentSession(typeId);
    if (!session.result) throw new Error(`Representative session did not finish for ${typeId}.`);
    recordSession(session.result.primaryTypeId, session.result.secondaryTypeId);
  }

  for (let index = 0; index < simulationCount; index += 1) {
    const session = createSeededAssessmentSession(seed + index);
    if (!session.result) throw new Error(`Seeded session did not finish for sample ${index}.`);
    recordSession(session.result.primaryTypeId, session.result.secondaryTypeId);
  }

  const deterministicFixture = createRepresentativeAssessmentSession('INTJ');
  const fixedAnswers = deterministicFixture.answers.slice(0, fixedAssessmentQuestions.length);
  const firstAdaptiveSelection = selectAdaptiveQuestionIds(fixedAnswers);
  const secondAdaptiveSelection = selectAdaptiveQuestionIds(fixedAnswers);
  const deterministicAdaptiveSelection = sameStrings(
    firstAdaptiveSelection,
    secondAdaptiveSelection,
  ) && firstAdaptiveSelection.length === 5
    && new Set(firstAdaptiveSelection).size === 5;

  const canonicalScoringSymmetry = personalityTypeIds.every((typeId) =>
    rankPersonalityTypes(createCanonicalProfile(typeId))[0]?.personality.id === typeId,
  );
  const firstTieRanking = calculateAssessmentRanking([]);
  const secondTieRanking = calculateAssessmentRanking([]);
  const exactTieHandlingDeterministic =
    firstTieRanking.result.balancedDimensionIds.length === dimensionIds.length
    && sameStrings(
      firstTieRanking.matches.map(({ personality }) => personality.id),
      secondTieRanking.matches.map(({ personality }) => personality.id),
    )
    && firstTieRanking.result.primaryTypeId !== firstTieRanking.result.secondaryTypeId;

  const fixedQuestionsPerDimension = countQuestionsByDimension(fixedAssessmentQuestions);
  const adaptiveQuestionsPerDimension = countQuestionsByDimension(adaptiveQuestionBank);
  const optionStructureValid = allAssessmentQuestions.every((question) => {
    const { firstPole, secondPole } = dimensionDefinitions[question.dimension];
    return question.options.length === 4
      && question.options[0].pole === firstPole
      && question.options[0].intensity === 2
      && question.options[1].pole === firstPole
      && question.options[1].intensity === 1
      && question.options[2].pole === secondPole
      && question.options[2].intensity === 1
      && question.options[3].pole === secondPole
      && question.options[3].intensity === 2;
  });
  const uniqueAnimalCount = new Set(
    canonicalPersonalityAnimals.map(({ animalId }) => animalId),
  ).size;
  const uniqueTypeCount = new Set(canonicalPersonalityAnimals.map(({ id }) => id)).size;

  return {
    label: 'Engineering balance check — not scientific validation',
    sampleCount,
    fixedQuestionCount: fixedAssessmentQuestions.length,
    adaptiveBankCount: adaptiveQuestionBank.length,
    fixedQuestionsPerDimension,
    adaptiveQuestionsPerDimension,
    optionStructureValid,
    uniqueAnimalCount,
    uniqueTypeCount,
    completeTypeCoverage: uniqueTypeCount === 16 && uniqueAnimalCount === 16,
    deterministicAdaptiveSelection,
    canonicalScoringSymmetry,
    exactTieHandlingDeterministic,
    primarySecondaryAlwaysDistinct,
    primaryCounts,
    secondaryCounts,
    unreachablePrimary: personalityTypeIds.filter((id) => primaryCounts[id] === 0),
    unreachableSecondary: personalityTypeIds.filter((id) => secondaryCounts[id] === 0),
  };
}

function countQuestionsByDimension(
  questions: readonly { dimension: DimensionId }[],
): Record<DimensionId, number> {
  return Object.fromEntries(dimensionIds.map((dimension) => [
    dimension,
    questions.filter((question) => question.dimension === dimension).length,
  ])) as Record<DimensionId, number>;
}

function createTypeCounter(): Record<PersonalityTypeId, number> {
  return Object.fromEntries(personalityTypeIds.map((id) => [id, 0])) as Record<
    PersonalityTypeId,
    number
  >;
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

// Retained as an explicit analysis fixture: the origin is equally balanced on all four axes.
export const exactTieProfile = createEmptyDimensionProfile();
