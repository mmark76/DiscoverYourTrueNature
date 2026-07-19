import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { completedAssessmentQuestionCount } from '../src/features/assessment/data/questions.ts';
import { shortCompletedAssessmentQuestionCount } from '../src/features/assessment/data/shortQuestions.ts';
import {
  completeAssessmentWithOptionSelector,
  createAssessmentSession,
} from '../src/features/assessment/services/assessmentSession.ts';
import {
  completeShortAssessmentWithOptionSelector,
  createShortAssessmentSession,
} from '../src/features/assessment/services/shortAssessmentSession.ts';
import { translations } from '../src/i18n/translations.ts';

const appSource = readFileSync('App.tsx', 'utf8');
const chooserSource = readFileSync(
  'src/features/assessment/components/AssessmentModeChooser.tsx',
  'utf8',
);
const selectionSource = readFileSync(
  'src/features/assessment/components/QuestionnaireSelectionScreen.tsx',
  'utf8',
);
const assessmentScreenSource = readFileSync(
  'src/features/assessment/components/AssessmentScreen.tsx',
  'utf8',
);
const heroSource = readFileSync('src/features/home/components/HeroSection.tsx', 'utf8');
const resultSource = readFileSync('src/features/results/components/ResultScreen.tsx', 'utf8');

test('Home and Discover expose the same two accessible Short and Long choices', () => {
  assert.match(heroSource, /<AssessmentModeChooser onSelectMode=\{onSelectMode\}/);
  assert.match(selectionSource, /<AssessmentModeChooser onSelectMode=\{onSelectMode\}/);
  assert.equal((chooserSource.match(/<ModeCard/g) ?? []).length, 2);
  assert.match(chooserSource, /onPress=\{\(\) => onSelectMode\('short'\)\}/);
  assert.match(chooserSource, /onPress=\{\(\) => onSelectMode\('long'\)\}/);
  assert.match(chooserSource, /accessibilityRole="button"/);
  assert.match(chooserSource, /accessibilityHint=\{hint\}/);
  assert.match(chooserSource, /accessibilityLabel=\{`\$\{title\}\. \$\{meta\}\. \$\{description\}\. \$\{action\}`\}/);
  assert.match(chooserSource, /role="group"/);
  assert.match(chooserSource, /flexWrap: 'wrap'/);

  for (const content of Object.values(translations)) {
    assert.match(content.questionnaires.shortMeta, /15/);
    assert.match(content.questionnaires.shortMeta, /3/);
    assert.match(content.questionnaires.longMeta, /30/);
    assert.match(content.questionnaires.longMeta, /6/);
  }
});

test('the app owns, restores, and persists independent Short and Long sessions', () => {
  assert.match(appSource, /restoreAssessmentSession\(assessmentStorage\)/);
  assert.match(appSource, /restoreShortAssessmentSession\(assessmentStorage\)/);
  assert.match(appSource, /persistAssessmentSession\(assessmentStorage, longAssessmentSession\)/);
  assert.match(appSource, /persistShortAssessmentSession\(assessmentStorage, shortAssessmentSession\)/);
  assert.match(appSource, /persistAssessmentMode\(assessmentStorage, assessmentMode\)/);
  assert.match(appSource, /mode === 'short' \? shortAssessmentSession : longAssessmentSession/);
  assert.match(appSource, /assessmentMode === 'short'[\s\S]*selectCurrentShortAssessmentOption/);
  assert.match(appSource, /assessmentMode === 'long'[\s\S]*selectCurrentAssessmentOption/);
  assert.match(appSource, /assessmentMode === 'short'[\s\S]*continueShortAssessment/);
  assert.match(appSource, /assessmentMode === 'long'[\s\S]*continueAssessment/);
  assert.equal(createShortAssessmentSession().assessmentMode, 'short');
  assert.equal(createAssessmentSession().assessmentMode, 'long');
});

test('shared assessment UI receives the correct 15- or 30-question mode contract', () => {
  assert.equal(shortCompletedAssessmentQuestionCount, 15);
  assert.equal(completedAssessmentQuestionCount, 30);
  assert.match(
    appSource,
    /totalQuestions=\{assessmentMode === 'short'[\s\S]*shortCompletedAssessmentQuestionCount[\s\S]*completedAssessmentQuestionCount\}/,
  );
  assert.match(assessmentScreenSource, /assessmentMode: AssessmentMode/);
  assert.match(
    assessmentScreenSource,
    /assessmentMode === 'short' \? content\.shortAssessment : content\.assessment/,
  );
  assert.match(appSource, /onBack=\{goBackOneQuestion\}/);
  assert.match(assessmentScreenSource, /onPress=\{onBack\}/);
  assert.match(assessmentScreenSource, /accessibilityRole="radiogroup"/);
  assert.match(assessmentScreenSource, /accessibilityRole="progressbar"/);
});

test('both completed modes record their origin and the shared result renders that origin', () => {
  const short = completeShortAssessmentWithOptionSelector((question) => question.options[0].id);
  const long = completeAssessmentWithOptionSelector((question) => question.options[0].id);

  assert.equal(short.result?.assessmentMode, 'short');
  assert.equal(long.result?.assessmentMode, 'long');
  assert.match(appSource, /assessmentMode=\{assessmentResult\.assessmentMode\}/);
  assert.match(resultSource, /assessmentMode: AssessmentMode/);
  assert.match(resultSource, /assessmentMode === 'short'/);
  assert.match(resultSource, /copy\.shortQuestionnaireResult/);
  assert.match(resultSource, /copy\.longQuestionnaireResult/);
  assert.match(resultSource, /<AppText style=\{styles\.modeLabel\}>\{modeLabel\}<\/AppText>/);
});
