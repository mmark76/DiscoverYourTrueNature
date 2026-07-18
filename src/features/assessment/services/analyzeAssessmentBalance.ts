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
  assessmentPhaseWeights,
  baseAssessmentQuestions,
  everydayAssessmentQuestionCount,
  fixedAssessmentQuestions,
  structuredAssessmentQuestionCount,
} from '../data/questions.ts';
import {
  createCanonicalProfile,
  createRepresentativeAssessmentSession,
  createSeededAssessmentSession,
  selectOptionIdForPole,
} from './assessmentFixtures.ts';
import { createAssessmentAnswer } from './selection.ts';
import {
  calculateContextProfiles,
  getContextProfileObservation,
  rankPersonalityTypes,
} from './scoreAssessment.ts';
import { selectAdaptiveQuestions } from './selectAdaptiveQuestions.ts';

export interface AssessmentBalanceReport {
  label: 'Engineering balance check - not scientific validation';
  sampleCount: number;
  everydayQuestionCount: number;
  structuredQuestionCount: number;
  baseQuestionCount: number;
  adaptiveBankCount: number;
  everydayQuestionsPerDimension: Record<DimensionId, number>;
  adaptiveQuestionsPerDimension: Record<DimensionId, number>;
  optionStructureValid: boolean;
  phaseAndContextBalanceValid: boolean;
  reverseKeyBalanceValid: boolean;
  optionLetterOrderingBalanced: boolean;
  contextProfilesCorrect: boolean;
  uniqueAnimalCount: number;
  uniqueTypeCount: number;
  completeTypeCoverage: boolean;
  deterministicAdaptiveSelection: boolean;
  adaptiveContextQuotaValid: boolean;
  adaptiveDimensionCoverage: boolean;
  canonicalScoringSymmetry: boolean;
  exactTieHandlingDeterministic: boolean;
  primarySecondaryAlwaysDistinct: boolean;
  primaryCounts: Record<PersonalityTypeId, number>;
  secondaryCounts: Record<PersonalityTypeId, number>;
  selectedAdaptiveQuestionIds: readonly string[];
  unreachablePrimary: PersonalityTypeId[];
  unreachableSecondary: PersonalityTypeId[];
  unreachableAdaptiveQuestionIds: string[];
}

export function analyzeAssessmentBalance(
  seed = 160425,
  simulationCount = 4096,
): AssessmentBalanceReport {
  const primaryCounts = createTypeCounter();
  const secondaryCounts = createTypeCounter();
  const selectedAdaptiveQuestionIds = new Set<string>();
  const selectedAdaptiveDimensions = new Set<DimensionId>();
  let sampleCount = 0;
  let primarySecondaryAlwaysDistinct = true;
  let adaptiveContextQuotaValid = true;

  function recordSession(session: ReturnType<typeof createSeededAssessmentSession>): void {
    if (!session.result || !session.lockedPrimary) {
      throw new Error('Balance analysis received an incomplete assessment session.');
    }
    primaryCounts[session.result.primaryTypeId] += 1;
    secondaryCounts[session.result.secondaryTypeId] += 1;
    primarySecondaryAlwaysDistinct &&=
      session.result.primaryTypeId !== session.result.secondaryTypeId;
    const selected = selectAdaptiveQuestions(
      session.answers.slice(0, fixedAssessmentQuestions.length),
      session.lockedPrimary,
    );
    adaptiveContextQuotaValid &&=
      selected.filter(({ context }) => context === 'personal').length === 2
      && selected.filter(({ context }) => context === 'professional').length === 3;
    for (const question of selected) {
      selectedAdaptiveQuestionIds.add(question.id);
      selectedAdaptiveDimensions.add(question.dimension);
    }
    sampleCount += 1;
  }

  for (const typeId of personalityTypeIds) {
    recordSession(createRepresentativeAssessmentSession(typeId));
  }
  for (let index = 0; index < simulationCount; index += 1) {
    recordSession(createSeededAssessmentSession(seed + index));
  }

  const deterministicFixture = createRepresentativeAssessmentSession('INTJ');
  if (!deterministicFixture.lockedPrimary) throw new Error('Deterministic fixture lacks a lock.');
  const fixedAnswers = deterministicFixture.answers.slice(0, fixedAssessmentQuestions.length);
  const firstAdaptiveSelection = selectAdaptiveQuestions(
    fixedAnswers,
    deterministicFixture.lockedPrimary,
  ).map(({ id }) => id);
  const secondAdaptiveSelection = selectAdaptiveQuestions(
    [...fixedAnswers].reverse(),
    deterministicFixture.lockedPrimary,
  ).map(({ id }) => id);
  const deterministicAdaptiveSelection = sameStrings(
    firstAdaptiveSelection,
    secondAdaptiveSelection,
  ) && firstAdaptiveSelection.length === 5
    && new Set(firstAdaptiveSelection).size === 5;

  const canonicalScoringSymmetry = personalityTypeIds.every((typeId) =>
    rankPersonalityTypes(createCanonicalProfile(typeId))[0]?.personality.id === typeId,
  );
  const firstTieRanking = rankPersonalityTypes(exactTieProfile);
  const secondTieRanking = rankPersonalityTypes(exactTieProfile);
  const exactTieHandlingDeterministic = sameStrings(
    firstTieRanking.map(({ personality }) => personality.id),
    secondTieRanking.map(({ personality }) => personality.id),
  ) && sameStrings(
    firstTieRanking.map(({ personality }) => personality.id),
    personalityTypeIds,
  );

  const everydayQuestions = baseAssessmentQuestions.filter(({ phase }) => phase === 'everyday');
  const structuredQuestions = baseAssessmentQuestions.filter(({ phase }) => phase === 'structured');
  const everydayQuestionsPerDimension = countQuestionsByDimension(everydayQuestions);
  const adaptiveQuestionsPerDimension = countQuestionsByDimension(adaptiveQuestionBank);
  const optionStructureValid = allAssessmentQuestions.every((question) => {
    const { firstPole, secondPole } = dimensionDefinitions[question.dimension];
    const expectedA = question.reverseKeyed ? secondPole : firstPole;
    const expectedB = question.reverseKeyed ? firstPole : secondPole;
    return question.options.length === 2
      && question.options[0].position === 'a'
      && question.options[1].position === 'b'
      && question.options[0].pole === expectedA
      && question.options[1].pole === expectedB
      && question.weight === assessmentPhaseWeights[question.phase];
  });
  const phaseAndContextBalanceValid = everydayQuestions.length === 20
    && structuredQuestions.length === 5
    && everydayQuestions.filter(({ context }) => context === 'personal').length === 10
    && everydayQuestions.filter(({ context }) => context === 'professional').length === 10
    && structuredQuestions.filter(({ context }) => context === 'personal').length === 3
    && structuredQuestions.filter(({ context }) => context === 'professional').length === 2
    && dimensionIds.every((dimension) => everydayQuestionsPerDimension[dimension] === 5)
    && dimensionIds.every((dimension) => adaptiveQuestionsPerDimension[dimension] === 4);
  const reverseKeyBalanceValid = fixedAssessmentQuestions.filter(({ reverseKeyed }) => reverseKeyed).length === 12
    && adaptiveQuestionBank.filter(({ reverseKeyed }) => reverseKeyed).length === 8;
  const optionLetterOrderingBalanced = dimensionIds.every((dimension) => {
    const questions = allAssessmentQuestions.filter((question) => question.dimension === dimension);
    const firstPole = dimensionDefinitions[dimension].firstPole;
    const firstPoleAsA = questions.filter(({ options }) => options[0].pole === firstPole).length;
    return Math.abs(firstPoleAsA - (questions.length - firstPoleAsA)) <= 1;
  });
  const contextFixtureAnswers = fixedAssessmentQuestions.map((question) => {
    const poles = dimensionDefinitions[question.dimension];
    return createAssessmentAnswer(
      question,
      selectOptionIdForPole(
        question,
        question.context === 'personal' ? poles.firstPole : poles.secondPole,
      ),
    );
  });
  const contextProfiles = calculateContextProfiles(contextFixtureAnswers);
  const contextObservation = getContextProfileObservation(contextFixtureAnswers);
  const adaptiveNoise = adaptiveQuestionBank.map((question) =>
    createAssessmentAnswer(question, question.options[0].id));
  const profilesWithAdaptiveNoise = calculateContextProfiles([
    ...contextFixtureAnswers,
    ...adaptiveNoise,
  ]);
  const contextProfilesCorrect = dimensionIds.every((dimension) =>
    contextProfiles.personal[dimension] === 1
    && contextProfiles.professional[dimension] === -1
    && profilesWithAdaptiveNoise.personal[dimension] === contextProfiles.personal[dimension]
    && profilesWithAdaptiveNoise.professional[dimension] === contextProfiles.professional[dimension],
  ) && contextObservation?.kind === 'context-dependent';
  const uniqueAnimalCount = new Set(
    canonicalPersonalityAnimals.map(({ animalId }) => animalId),
  ).size;
  const uniqueTypeCount = new Set(canonicalPersonalityAnimals.map(({ id }) => id)).size;

  return {
    label: 'Engineering balance check - not scientific validation',
    sampleCount,
    everydayQuestionCount: everydayAssessmentQuestionCount,
    structuredQuestionCount: structuredAssessmentQuestionCount,
    baseQuestionCount: baseAssessmentQuestions.length,
    adaptiveBankCount: adaptiveQuestionBank.length,
    everydayQuestionsPerDimension,
    adaptiveQuestionsPerDimension,
    optionStructureValid,
    phaseAndContextBalanceValid,
    reverseKeyBalanceValid,
    optionLetterOrderingBalanced,
    contextProfilesCorrect,
    uniqueAnimalCount,
    uniqueTypeCount,
    completeTypeCoverage: uniqueTypeCount === 16 && uniqueAnimalCount === 16,
    deterministicAdaptiveSelection,
    adaptiveContextQuotaValid,
    adaptiveDimensionCoverage: selectedAdaptiveDimensions.size === dimensionIds.length,
    canonicalScoringSymmetry,
    exactTieHandlingDeterministic,
    primarySecondaryAlwaysDistinct,
    primaryCounts,
    secondaryCounts,
    selectedAdaptiveQuestionIds: [...selectedAdaptiveQuestionIds].sort(),
    unreachablePrimary: personalityTypeIds.filter((id) => primaryCounts[id] === 0),
    unreachableSecondary: personalityTypeIds.filter((id) => secondaryCounts[id] === 0),
    unreachableAdaptiveQuestionIds: adaptiveQuestionBank
      .map(({ id }) => id)
      .filter((id) => !selectedAdaptiveQuestionIds.has(id)),
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

export const exactTieProfile = createEmptyDimensionProfile();
