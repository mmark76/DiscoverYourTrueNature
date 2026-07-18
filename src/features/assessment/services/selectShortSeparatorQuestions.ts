import {
  canonicalPersonalityAnimals,
  type PersonalityAnimalProfile,
} from '../../personalities/data/personalityAnimals.ts';
import type {
  DimensionProfile,
} from '../../personalities/types.ts';
import {
  shortAssessmentAreaDimensions,
  shortAssessmentAreaIds,
  shortFixedAssessmentQuestionCount,
  shortSeparatorAssessmentQuestionCount,
  shortSeparatorQuestionBank,
  type ShortAssessmentAreaId,
  type ShortAssessmentQuestionData,
  type ShortSeparatorAssessmentQuestionId,
} from '../data/shortQuestions.ts';
import type {
  AssessmentAnswer,
  LockedPrimaryResult,
} from '../types.ts';
import {
  calculateShortAssessmentProfile,
  calculateShortLockedPrimaryResult,
} from './shortScoreAssessment.ts';
import { rankPersonalityTypes } from './scoreAssessment.ts';

export const shortSeparatorClosestCandidateCount = 4;

export interface ShortSeparatorAreaPriority {
  area: ShortAssessmentAreaId;
  candidatePairDisagreements: number;
  baseMagnitude: number;
}

export function countShortCandidatePairDisagreements(
  candidates: readonly PersonalityAnimalProfile[],
  area: ShortAssessmentAreaId,
): number {
  const dimension = shortAssessmentAreaDimensions[area];
  let disagreements = 0;
  for (let left = 0; left < candidates.length; left += 1) {
    for (let right = left + 1; right < candidates.length; right += 1) {
      if (candidates[left]?.profile[dimension] !== candidates[right]?.profile[dimension]) {
        disagreements += 1;
      }
    }
  }
  return disagreements;
}

export function getShortClosestNonPrimaryCandidates(
  fixedProfile: DimensionProfile,
  lockedPrimary: LockedPrimaryResult,
): readonly PersonalityAnimalProfile[] {
  return rankPersonalityTypes(fixedProfile, lockedPrimary.primaryTypeId)
    .slice(0, shortSeparatorClosestCandidateCount)
    .map(({ personality }) => personality);
}

export function rankShortSeparatorAreas(
  fixedAnswers: readonly AssessmentAnswer[],
  lockedPrimary: LockedPrimaryResult = calculateShortLockedPrimaryResult(fixedAnswers),
): readonly ShortSeparatorAreaPriority[] {
  const calculatedLock = calculateShortLockedPrimaryResult(fixedAnswers);
  if (lockedPrimary.primaryTypeId !== calculatedLock.primaryTypeId) {
    throw new Error('Separator selection requires the primary locked from these 12 answers.');
  }
  if (fixedAnswers.length !== shortFixedAssessmentQuestionCount) {
    throw new Error('Separator selection requires all 12 fixed answers.');
  }
  const fixedProfile = calculateShortAssessmentProfile(fixedAnswers);
  const candidates = getShortClosestNonPrimaryCandidates(fixedProfile, lockedPrimary);
  return shortAssessmentAreaIds
    .map((area, canonicalIndex) => {
      const dimension = shortAssessmentAreaDimensions[area];
      return {
        area,
        canonicalIndex,
        candidatePairDisagreements: countShortCandidatePairDisagreements(candidates, area),
        baseMagnitude: Math.abs(fixedProfile[dimension]),
      };
    })
    .sort((left, right) =>
      (right.candidatePairDisagreements - left.candidatePairDisagreements)
      || (left.baseMagnitude - right.baseMagnitude)
      || (left.canonicalIndex - right.canonicalIndex),
    )
    .map(({ area, candidatePairDisagreements, baseMagnitude }) => ({
      area,
      candidatePairDisagreements,
      baseMagnitude,
    }));
}

export function selectShortSeparatorQuestions(
  fixedAnswers: readonly AssessmentAnswer[],
  lockedPrimary: LockedPrimaryResult = calculateShortLockedPrimaryResult(fixedAnswers),
): readonly ShortAssessmentQuestionData[] {
  const rankedAreas = rankShortSeparatorAreas(fixedAnswers, lockedPrimary);
  const primary = canonicalPersonalityAnimals.find(({ id }) => id === lockedPrimary.primaryTypeId);
  if (!primary) throw new Error('Separator selection requires a valid locked primary result.');
  const primaryIndex = canonicalPersonalityAnimals.indexOf(primary);

  const selected = rankedAreas.slice(0, shortSeparatorAssessmentQuestionCount).map(({ area }) => {
    const variants = shortSeparatorQuestionBank.filter((candidate) => candidate.area === area);
    const areaIndex = shortAssessmentAreaIds.indexOf(area);
    const variantIndex = (primaryIndex + areaIndex) % 2;
    const question = variants[variantIndex];
    if (!question) throw new Error(`Missing separator question for ${area}.`);
    return question;
  });

  if (selected.length !== shortSeparatorAssessmentQuestionCount
    || new Set(selected.map(({ id }) => id)).size !== shortSeparatorAssessmentQuestionCount
    || new Set(selected.map(({ area }) => area)).size !== shortSeparatorAssessmentQuestionCount) {
    throw new Error('Separator selection must produce three unique questions from three areas.');
  }
  return selected;
}

export function selectShortSeparatorQuestionIds(
  fixedAnswers: readonly AssessmentAnswer[],
  lockedPrimary?: LockedPrimaryResult,
): readonly ShortSeparatorAssessmentQuestionId[] {
  return selectShortSeparatorQuestions(fixedAnswers, lockedPrimary)
    .map(({ id }) => id as ShortSeparatorAssessmentQuestionId);
}
