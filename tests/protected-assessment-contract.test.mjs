import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import { canonicalArchetypes } from '../src/features/archetypes/data/archetypes.ts';
import { allAssessmentQuestions } from '../src/features/assessment/data/questions.ts';
import {
  matchingDimensionWeights,
  questionWeightMultipliers,
} from '../src/features/assessment/services/scoreAssessment.ts';
import { translations } from '../src/i18n/translations.ts';

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])]),
    );
  }

  return value;
}

function stableSha256(value) {
  return createHash('sha256')
    .update(JSON.stringify(stableValue(value)))
    .digest('hex');
}

test('assessment question IDs, option IDs, weights, and scoring vectors stay unchanged', () => {
  assert.equal(
    stableSha256(allAssessmentQuestions),
    '00fd1302f5583ee227e2fa27ec59f4a9163c2b982e8ebc2cc753705231153df9',
  );
});

test('all twelve animal profiles stay unchanged', () => {
  assert.equal(
    stableSha256(canonicalArchetypes),
    '9cddb3c7b96161495fe0d3652b3fb91a26fca95b657acb1ddf4d95e7ed1904aa',
  );
});

test('scoring dimension and question weights stay unchanged', () => {
  assert.equal(
    stableSha256({ matchingDimensionWeights, questionWeightMultipliers }),
    '6455c6e836a1a9888ee5ce7194f0e88805334a79c3cc194fb355a502197ebcc2',
  );
});

test('English and Greek assessment wording stays unchanged', () => {
  assert.equal(
    stableSha256({ en: translations.en.assessment, el: translations.el.assessment }),
    '26369fa32e3b3a97ce36487d7462b9eddad9134c1c3641351080f079d346823a',
  );
});
