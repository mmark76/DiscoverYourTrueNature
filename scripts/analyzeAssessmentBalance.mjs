import { assessmentModelVersion } from '../src/features/personalities/data/personalityAnimals.ts';
import { analyzeAssessmentBalance } from '../src/features/assessment/services/analyzeAssessmentBalance.ts';

const report = analyzeAssessmentBalance();

console.log(report.label);
console.log(`Assessment model: ${assessmentModelVersion}`);
console.log(`Questions: ${report.everydayQuestionCount} everyday + ${report.structuredQuestionCount} structured + 5 adaptive`);
console.log(`Adaptive bank: ${report.adaptiveBankCount}`, report.adaptiveQuestionsPerDimension);
console.log(`Seeded and representative samples: ${report.sampleCount}`);
console.log('Primary distribution:', report.primaryCounts);
console.log('Secondary distribution:', report.secondaryCounts);
console.log('Unreachable primary patterns:', report.unreachablePrimary);
console.log('Unreachable secondary patterns:', report.unreachableSecondary);
console.log('Unreachable adaptive questions:', report.unreachableAdaptiveQuestionIds);
console.log('Checks:', {
  completeTypeCoverage: report.completeTypeCoverage,
  optionStructureValid: report.optionStructureValid,
  phaseAndContextBalanceValid: report.phaseAndContextBalanceValid,
  reverseKeyBalanceValid: report.reverseKeyBalanceValid,
  optionLetterOrderingBalanced: report.optionLetterOrderingBalanced,
  contextProfilesCorrect: report.contextProfilesCorrect,
  deterministicAdaptiveSelection: report.deterministicAdaptiveSelection,
  adaptiveContextQuotaValid: report.adaptiveContextQuotaValid,
  adaptiveDimensionCoverage: report.adaptiveDimensionCoverage,
  canonicalScoringSymmetry: report.canonicalScoringSymmetry,
  exactTieHandlingDeterministic: report.exactTieHandlingDeterministic,
  primarySecondaryAlwaysDistinct: report.primarySecondaryAlwaysDistinct,
});

const failed = report.everydayQuestionCount !== 20
  || report.structuredQuestionCount !== 5
  || report.baseQuestionCount !== 25
  || report.adaptiveBankCount !== 16
  || !report.completeTypeCoverage
  || !report.optionStructureValid
  || !report.phaseAndContextBalanceValid
  || !report.reverseKeyBalanceValid
  || !report.optionLetterOrderingBalanced
  || !report.contextProfilesCorrect
  || !report.deterministicAdaptiveSelection
  || !report.adaptiveContextQuotaValid
  || !report.adaptiveDimensionCoverage
  || !report.canonicalScoringSymmetry
  || !report.exactTieHandlingDeterministic
  || !report.primarySecondaryAlwaysDistinct
  || report.unreachablePrimary.length > 0
  || report.unreachableSecondary.length > 0
  || report.unreachableAdaptiveQuestionIds.length > 0;

if (failed) process.exitCode = 1;
