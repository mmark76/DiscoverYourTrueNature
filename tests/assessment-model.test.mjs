import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { assessmentModelVersion, canonicalArchetypes } from '../src/features/archetypes/data/archetypes.ts';
import { dimensionIds } from '../src/features/archetypes/types.ts';
import { assessmentQuestions } from '../src/features/assessment/data/questions.ts';
import { analyzeAssessmentBalance } from '../src/features/assessment/services/analyzeAssessmentBalance.ts';
import { accumulateAnswerValues, createCanonicalAnswerValues } from '../src/features/assessment/services/assessmentFixtures.ts';
import {
  addDimensionScore,
  calculateAssessmentResult,
  calculateExactMatchScore,
  calculateNormalizedDistance,
  createEmptyDimensionScores,
  normalizeArchetypeVector,
  normalizeDimensionScores,
} from '../src/features/assessment/services/scoreAssessment.ts';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/scoring-12-archetype-v1.json', import.meta.url), 'utf8'));
const expectedIds = ['wolf', 'owl', 'eagle', 'dolphin', 'bear', 'lion', 'fox', 'panther', 'elephant', 'horse', 'turtle', 'octopus'];
const expectedDimensions = ['affiliation', 'reasoning', 'tempo', 'structure', 'influence', 'exploration', 'expression', 'perspective'];

test('canonical domain contains twelve ordered unique archetypes and eight dimensions', () => {
  assert.equal(assessmentModelVersion, '12-archetype-v1');
  assert.equal(fixture.modelVersion, assessmentModelVersion);
  assert.deepEqual(canonicalArchetypes.map(({ id }) => id), expectedIds);
  assert.deepEqual(dimensionIds, expectedDimensions);
  assert.equal(new Set(canonicalArchetypes.map(({ id }) => id)).size, 12);
});

test('every archetype vector is complete, bounded, integral, and unique', () => {
  const serializedVectors = canonicalArchetypes.map(({ vector }) => JSON.stringify(vector));
  assert.equal(new Set(serializedVectors).size, 12);
  for (const { vector } of canonicalArchetypes) {
    assert.deepEqual(Object.keys(vector), expectedDimensions);
    for (const value of Object.values(vector)) {
      assert.equal(Number.isInteger(value), true);
      assert.ok(value >= -2 && value <= 2);
    }
  }
});

test('assessment has 24 stable questions with three per dimension and four balanced values', () => {
  assert.equal(assessmentQuestions.length, 24);
  assert.equal(new Set(assessmentQuestions.map(({ id }) => id)).size, 24);
  const optionIds = assessmentQuestions.flatMap(({ options }) => options.map(({ id }) => id));
  assert.equal(optionIds.length, 96);
  assert.equal(new Set(optionIds).size, 96);

  for (const dimension of dimensionIds) {
    assert.equal(assessmentQuestions.filter((question) => question.dimension === dimension).length, 3);
  }
  for (const question of assessmentQuestions) {
    assert.equal(question.options.length, 4);
    assert.deepEqual([...question.options.map(({ value }) => value)].sort((a, b) => a - b), [-2, -1, 1, 2]);
    assert.deepEqual(Object.keys(question), ['id', 'dimension', 'options']);
    assert.ok(question.options.every((option) => Object.keys(option).join(',') === 'id,value'));
  }
});

test('question data contains no animal IDs or localized user-facing copy', () => {
  const source = readFileSync('src/features/assessment/data/questions.ts', 'utf8');
  for (const id of expectedIds) assert.doesNotMatch(source, new RegExp(`['\"]${id}['\"]`, 'i'));
  assert.doesNotMatch(source, /[Α-Ωα-ω]/u);
  assert.doesNotMatch(source, /scores\s*:/);
});

test('raw dimension accumulation and normalization follow the documented model', () => {
  const empty = createEmptyDimensionScores();
  assert.deepEqual(Object.values(empty), Array(8).fill(0));
  const updated = addDimensionScore(addDimensionScore(empty, 'affiliation', 2), 'affiliation', -1);
  assert.equal(updated.affiliation, 1);
  assert.equal(empty.affiliation, 0);

  const normalized = normalizeDimensionScores({ ...empty, affiliation: 6, reasoning: -6, tempo: 3 });
  assert.equal(normalized.affiliation, 1);
  assert.equal(normalized.reasoning, -1);
  assert.equal(normalized.tempo, 0.5);
  assert.ok(Object.values(normalized).every((value) => value >= -1 && value <= 1));
});

test('archetype normalization, distance, and match scores remain finite and bounded', () => {
  const user = normalizeDimensionScores(fixture.balanced.raw);
  for (const archetype of canonicalArchetypes) {
    const normalized = normalizeArchetypeVector(archetype);
    assert.ok(Object.values(normalized).every((value) => value >= -1 && value <= 1));
    const distance = calculateNormalizedDistance(user, archetype);
    const score = calculateExactMatchScore(user, archetype);
    assert.ok(Number.isFinite(distance));
    assert.ok(Number.isFinite(score));
    assert.ok(score >= 0 && score <= 100);
  }
  assert.throws(
    () => calculateAssessmentResult({ ...createEmptyDimensionScores(), affiliation: Number.NaN }),
    /Invalid dimension score/,
  );
});

test('canonical answer-by-value profiles make every archetype a deterministic primary', () => {
  assert.deepEqual(fixture.canonicalProfiles, expectedIds);
  for (const target of fixture.canonicalProfiles) {
    const answers = createCanonicalAnswerValues(target);
    for (const question of assessmentQuestions) {
      assert.ok(question.options.some(({ value }) => value === answers[question.id]));
    }
    const result = calculateAssessmentResult(accumulateAnswerValues(answers));
    assert.equal(result.primary.archetype.id, target);
    assert.equal(result.matches.length, 12);
  }
});

test('every archetype is reachable as secondary in a deterministic fixture', () => {
  assert.deepEqual(Object.keys(fixture.secondaryProfiles), expectedIds);
  for (const target of expectedIds) {
    const result = calculateAssessmentResult(fixture.secondaryProfiles[target]);
    assert.equal(result.secondary.archetype.id, target);
  }
});

test('balanced, tie, all-negative, and all-positive fixtures are stable', () => {
  for (const key of ['balanced', 'exactTie', 'allNegative', 'allPositive']) {
    const profile = fixture[key];
    const result = calculateAssessmentResult(profile.raw);
    assert.equal(result.primary.archetype.id, profile.primary);
    assert.equal(result.secondary.archetype.id, profile.secondary);
  }
  const tie = calculateAssessmentResult(fixture.exactTie.raw);
  assert.equal(tie.primary.exactScore, tie.secondary.exactScore);
  assert.equal(tie.primary.archetype.id, 'wolf');
  assert.equal(tie.secondary.archetype.id, 'owl');
});

test('ranking uses exact scores and rounds only display values', () => {
  const raw = { affiliation: -3, reasoning: -1, tempo: -6, structure: -4, influence: -2, exploration: 1, expression: -2, perspective: -2 };
  const result = calculateAssessmentResult(raw);
  const equalRoundedPairIndex = result.matches.findIndex((match, index) => {
    const next = result.matches[index + 1];
    return next && match.score === next.score && match.exactScore !== next.exactScore;
  });
  assert.ok(equalRoundedPairIndex >= 0);
  assert.ok(result.matches[equalRoundedPairIndex].exactScore > result.matches[equalRoundedPairIndex + 1].exactScore);
  assert.ok(result.matches.every((match) => Number.isInteger(match.score)));
});

test('results contain every archetype once with primary and secondary at positions zero and one', () => {
  const first = calculateAssessmentResult(fixture.balanced.raw);
  const second = calculateAssessmentResult(fixture.balanced.raw);
  assert.deepEqual(first, second);
  assert.equal(first.matches.length, 12);
  assert.equal(new Set(first.matches.map(({ archetype }) => archetype.id)).size, 12);
  assert.strictEqual(first.primary, first.matches[0]);
  assert.strictEqual(first.secondary, first.matches[1]);
  for (const match of first.matches) {
    assert.ok(Number.isFinite(match.exactScore));
    assert.ok(Number.isFinite(match.score));
  }
});

test('balance analysis reaches every archetype as primary and secondary', () => {
  const report = analyzeAssessmentBalance();
  assert.deepEqual(report.unreachablePrimary, []);
  assert.deepEqual(report.unreachableSecondary, []);
  assert.ok(Object.values(report.primaryCounts).every((count) => count > 0));
  assert.ok(Object.values(report.secondaryCounts).every((count) => count > 0));
});

test('result UI renders a compact twelve-row profile without confidence wording', () => {
  const screen = readFileSync('src/features/results/components/ResultScreen.tsx', 'utf8');
  const ranking = readFileSync('src/features/results/components/ResultRanking.tsx', 'utf8');
  assert.match(screen, /ResultRanking matches=\{result\.matches\}/);
  assert.match(ranking, /matches\.map/);
  assert.match(ranking, /accessibilityRole="progressbar"/);
  assert.doesNotMatch(`${screen}\n${ranking}`, /confidence/i);
});

test('restart, Settings, and language changes preserve the intended assessment state boundaries', () => {
  const app = readFileSync('App.tsx', 'utf8');
  assert.match(app, /resetAndStartAssessment[\s\S]*setQuestionIndex\(0\)[\s\S]*setScores\(createEmptyDimensionScores\(\)\)[\s\S]*setResult\(null\)/);
  assert.match(app, /openSettings[\s\S]*setSettingsReturnScreen\(screen\)[\s\S]*setScreen\('settings'\)/);
  assert.doesNotMatch(app.match(/function openSettings\(\)[\s\S]*?\n  \}/)?.[0] ?? '', /setScores|setResult|setQuestionIndex/);
  assert.match(app, /onBack=\{\(\) => setScreen\(settingsReturnScreen\)\}/);
});
