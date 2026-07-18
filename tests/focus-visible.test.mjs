import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { isFocusVisible } from '../src/shared/accessibility/focusVisibility.ts';

const hookSource = readFileSync(
  'src/shared/accessibility/useFocusVisible.ts',
  'utf8',
);
const interactiveSources = [
  readFileSync('src/shared/components/FocusablePressable.tsx', 'utf8'),
  readFileSync('src/shared/components/ExternalTextLink.tsx', 'utf8'),
  readFileSync('src/shared/components/ActionTextLink.tsx', 'utf8'),
];
const assessmentSource = readFileSync(
  'src/features/assessment/components/AssessmentScreen.tsx',
  'utf8',
);
const binaryOptionSource = readFileSync(
  'src/features/assessment/components/BinaryOptionCard.tsx',
  'utf8',
);

test('keyboard focus is visible and blurred controls have no focus ring', () => {
  assert.equal(isFocusVisible(true, true, 'keyboard'), true);
  assert.equal(isFocusVisible(false, true, 'keyboard'), false);
  assert.equal(isFocusVisible(false, false, 'pointer'), false);
});

test('pointer focus is hidden on web while native focus remains visible', () => {
  assert.equal(isFocusVisible(true, true, 'pointer'), false);
  assert.equal(isFocusVisible(true, false, 'pointer'), true);
});

test('shared focus policy tracks keyboard and pointer input modalities', () => {
  assert.match(hookSource, /addEventListener\('keydown'/);
  assert.match(hookSource, /addEventListener\('pointerdown'/);
  assert.match(hookSource, /addEventListener\('mousedown'/);
  assert.match(hookSource, /addEventListener\('touchstart'/);
  assert.match(hookSource, /updateInputModality\('keyboard'\)/);
  assert.match(hookSource, /updateInputModality\('pointer'\)/);
});

test('all shared pressable primitives preserve a visible inset keyboard outline', () => {
  for (const source of interactiveSources) {
    assert.match(source, /useFocusVisible/);
    assert.match(source, /focusVisible/);
    assert.match(source, /outlineColor:\s*colors\.focus/);
    assert.match(source, /outlineOffset:\s*-2/);
    assert.match(source, /outlineWidth:\s*2/);
  }
});

test('binary assessment cards use the shared focus treatment and whole-card radio semantics', () => {
  assert.match(binaryOptionSource, /<FocusablePressable/);
  assert.match(binaryOptionSource, /accessibilityRole="radio"/);
  assert.match(binaryOptionSource, /accessibilityState=\{\{ checked: selected \}\}/);
  assert.match(binaryOptionSource, /minHeight:\s*88/);
  assert.match(binaryOptionSource, /minHeight:\s*52/);
  assert.match(binaryOptionSource, /borderWidth:\s*4/);
  assert.match(binaryOptionSource, /selectedBadge/);
  assert.match(assessmentSource, /accessibilityRole="radiogroup"/);
  assert.match(assessmentSource, /questionHeadingRef\.current\?\.focus\(\)/);
  assert.match(assessmentSource, /disabled=\{!hasSelection\}/);
});
