import { assessmentModelVersion } from '../src/features/archetypes/data/archetypes.ts';
import { analyzeAssessmentBalance } from '../src/features/assessment/services/analyzeAssessmentBalance.ts';

const report = analyzeAssessmentBalance();

console.log(`Assessment model: ${assessmentModelVersion}`);
console.log(`Samples: ${report.sampleCount}`);
console.log('Primary counts:', report.primaryCounts);
console.log('Secondary counts:', report.secondaryCounts);
console.log('Average normalized distances:', report.averageDistances);
console.log(`Top-rank ties: ${report.tieCount}`);
console.log('Direct-profile reachability:', report.directProfileResults);
console.log('Secondary 25-answer fixture reachability:', report.secondaryFixtureResults);
console.log('Representative 25-answer runs:', report.representativeRunResults);
console.log('Adaptive question pairs:', report.adaptivePairCounts);
console.log('Unreachable primary:', report.unreachablePrimary);
console.log('Unreachable secondary:', report.unreachableSecondary);

if (report.unreachablePrimary.length > 0 || report.unreachableSecondary.length > 0) {
  process.exitCode = 1;
}
