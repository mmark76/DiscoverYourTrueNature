import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  analyticsConsentStorageKey,
  persistAnalyticsConsent,
  restoreAnalyticsConsent,
} from '../src/features/analytics/consent/analyticsConsentStorage.ts';
import {
  analyticsConsentStates,
  shouldShowAnalyticsConsentBanner,
} from '../src/features/analytics/consent/analyticsConsentTypes.ts';
import { translations } from '../src/i18n/translations.ts';

const providerSource = readFileSync('src/features/analytics/consent/AnalyticsConsentProvider.tsx', 'utf8');
const bannerSource = readFileSync('src/features/analytics/consent/AnalyticsConsentBanner.tsx', 'utf8');
const dialogSource = readFileSync('src/features/analytics/consent/AnalyticsConsentDialog.tsx', 'utf8');
const controlsSource = readFileSync('src/features/analytics/consent/AnalyticsConsentControls.tsx', 'utf8');
const footerSource = readFileSync('src/shared/components/AppFooter.tsx', 'utf8');
const shellSource = readFileSync('src/shared/layout/AppShell.tsx', 'utf8');

function createMemoryStorage(initialValue) {
  const values = new Map();
  if (initialValue !== undefined) values.set(analyticsConsentStorageKey, initialValue);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

test('analytics consent has exactly three states and defaults to unknown', () => {
  assert.deepEqual(analyticsConsentStates, ['unknown', 'accepted', 'rejected']);
  assert.equal(analyticsConsentStorageKey, 'animals-within.analytics-consent.v1');
  assert.equal(restoreAnalyticsConsent(createMemoryStorage()), 'unknown');
  assert.equal(restoreAnalyticsConsent(null), 'unknown');
});

test('accepted and rejected analytics choices persist locally', () => {
  for (const consentState of ['accepted', 'rejected']) {
    const storage = createMemoryStorage();
    assert.equal(persistAnalyticsConsent(storage, consentState), true);
    assert.equal(restoreAnalyticsConsent(storage), consentState);
  }
});

test('malformed or unavailable analytics storage fails closed to unknown', () => {
  assert.equal(restoreAnalyticsConsent(createMemoryStorage('granted')), 'unknown');
  assert.equal(restoreAnalyticsConsent(createMemoryStorage('{invalid-json')), 'unknown');
  assert.equal(restoreAnalyticsConsent({
    getItem: () => { throw new Error('blocked'); },
    setItem: () => undefined,
  }), 'unknown');
  assert.equal(persistAnalyticsConsent(null, 'accepted'), false);
  assert.equal(persistAnalyticsConsent({
    getItem: () => null,
    setItem: () => { throw new Error('blocked'); },
  }, 'accepted'), false);
  assert.match(providerSource, /setConsentState\(persisted \? nextState : 'unknown'\)/);
});

test('first visit displays the banner and either stored choice hides it', () => {
  assert.equal(shouldShowAnalyticsConsentBanner('unknown', false), true);
  assert.equal(shouldShowAnalyticsConsentBanner('unknown', true), false);
  assert.equal(shouldShowAnalyticsConsentBanner('accepted', false), false);
  assert.equal(shouldShowAnalyticsConsentBanner('rejected', false), false);
  assert.match(bannerSource, /testID="analytics-consent-banner"/);
  assert.match(shellSource, /<AnalyticsConsentBanner \/>/);
});

test('Accept and Reject are equally prominent explicit actions', () => {
  assert.match(controlsSource, /onPress=\{accept\}/);
  assert.match(controlsSource, /onPress=\{reject\}/);
  assert.equal((controlsSource.match(/styles\.choiceButton,/g) ?? []).length, 2);
  assert.equal((controlsSource.match(/accessibilityRole="button"/g) ?? []).length, 2);
  assert.doesNotMatch(controlsSource, /countdown|automatic|preselected|defaultChecked/i);
});

test('footer Analytics choices reopens controls without changing consent', () => {
  assert.match(footerSource, /useAnalyticsConsent\(\)/);
  assert.match(footerSource, /onPress=\{openChoices\}/);
  assert.match(footerSource, /content\.footer\.analyticsChoicesLabel/);
  assert.match(dialogSource, /visible=\{choicesOpen\}/);
  assert.match(dialogSource, /onPress=\{closeChoices\}/);
  assert.match(providerSource, /openChoices:\s*\(\) => setChoicesOpen\(true\)/);
  assert.match(providerSource, /closeChoices:\s*\(\) => setChoicesOpen\(false\)/);
});

test('analytics consent copy resolves exactly in Greek and English', () => {
  assert.deepEqual(translations.en.analyticsConsent, {
    title: 'Analytics choices',
    description: 'Help us understand how the application is used. Analytics will only be enabled with your permission. Assessment answers and animal results will never be sent.',
    accept: 'Accept analytics',
    reject: 'Reject analytics',
    close: 'Close analytics choices',
    bannerAccessibilityLabel: 'Analytics consent choices',
    dialogAccessibilityLabel: 'Change analytics consent choices',
  });
  assert.deepEqual(translations.el.analyticsConsent, {
    title: 'Επιλογές analytics',
    description: 'Βοήθησέ μας να κατανοήσουμε πώς χρησιμοποιείται η εφαρμογή. Τα analytics θα ενεργοποιηθούν μόνο με την άδειά σου. Οι απαντήσεις και τα αποτελέσματα του τεστ δεν θα αποστέλλονται ποτέ.',
    accept: 'Αποδοχή analytics',
    reject: 'Απόρριψη analytics',
    close: 'Κλείσιμο επιλογών analytics',
    bannerAccessibilityLabel: 'Επιλογές συγκατάθεσης analytics',
    dialogAccessibilityLabel: 'Αλλαγή επιλογών συγκατάθεσης analytics',
  });
  assert.equal(translations.en.footer.analyticsChoicesLabel, 'Analytics choices');
  assert.equal(translations.el.footer.analyticsChoicesLabel, 'Επιλογές analytics');
});

test('consent controls support safe areas, focus, screen readers, and non-overlay banner flow', () => {
  assert.match(dialogSource, /edges=\{\['top', 'bottom', 'left', 'right'\]\}/);
  assert.match(dialogSource, /accessibilityViewIsModal/);
  assert.match(bannerSource, /accessibilityLiveRegion="polite"/);
  assert.match(controlsSource, /FocusablePressable/g);
  assert.match(shellSource, /screenContent[\s\S]*<AnalyticsConsentBanner \/>[\s\S]*<AnalyticsConsentDialog \/>/);
  assert.doesNotMatch(bannerSource, /position:\s*['"](?:absolute|fixed)['"]/);
});

test('consent UI and storage remain isolated from analytics transport and assessment data', () => {
  const consentFeatureSource = sourceFiles('src/features/analytics/consent')
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');

  assert.doesNotMatch(consentFeatureSource, /googletagmanager|google-analytics|\bgtag\b|fetch\s*\(|XMLHttpRequest|sendBeacon|document\.cookie|<script|https?:\/\//i);
  assert.doesNotMatch(consentFeatureSource, /assessmentQuestions|DimensionScoreMap|AssessmentResult|feedbackRecipient/i);
});
