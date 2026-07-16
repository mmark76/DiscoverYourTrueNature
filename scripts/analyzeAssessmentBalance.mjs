import { assessmentModelVersion } from '../src/features/personalities/data/personalityAnimals.ts';
import { analyzeAssessmentBalance } from '../src/features/assessment/services/analyzeAssessmentBalance.ts';

const report = analyzeAssessmentBalance();

console.log(report.label);
console.log(`Assessment model: ${assessmentModelVersion}`);
console.log(`Fixed questions: ${report.fixedQuestionCount}`, report.fixedQuestionsPerDimension);
console.log(`Adaptive bank: ${report.adaptiveBankCount}`, report.adaptiveQuestionsPerDimension);
console.log(`Seeded and representative samples: ${report.sampleCount}`);
console.log('Primary distribution:', report.primaryCounts);
console.log('Secondary distribution:', report.secondaryCounts);
console.log('Unreachable primary patterns:', report.unreachablePrimary);
console.log('Unreachable secondary patterns:', report.unreachableSecondary);
console.log('Checks:', {
  completeTypeCoverage: report.completeTypeCoverage,
  optionStructureValid: report.optionStructureValid,
  deterministicAdaptiveSelection: report.deterministicAdaptiveSelection,
  canonicalScoringSymmetry: report.canonicalScoringSymmetry,
  exactTieHandlingDeterministic: report.exactTieHandlingDeterministic,
  primarySecondaryAlwaysDistinct: report.primarySecondaryAlwaysDistinct,
});

const failed = report.fixedQuestionCount !== 20
  || Object.values(report.fixedQuestionsPerDimension).some((count) => count !== 5)
  || report.adaptiveBankCount < 16
  || Object.values(report.adaptiveQuestionsPerDimension).some((count) => count < 4)
  || !report.completeTypeCoverage
  || !report.optionStructureValid
  || !report.deterministicAdaptiveSelection
  || !report.canonicalScoringSymmetry
  || !report.exactTieHandlingDeterministic
  || !report.primarySecondaryAlwaysDistinct
  || report.unreachablePrimary.length > 0
  || report.unreachableSecondary.length > 0;

if (failed) process.exitCode = 1;
