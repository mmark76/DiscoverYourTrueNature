import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  createFeedbackMailto,
  feedbackRecipient,
  feedbackSubject,
} from '../src/config/feedback.ts';
import { translations } from '../src/i18n/translations.ts';

const footerSource = readFileSync('src/shared/components/AppFooter.tsx', 'utf8');
const headerSource = readFileSync('src/shared/components/AppHeader.tsx', 'utf8');
const shellSource = readFileSync('src/shared/layout/AppShell.tsx', 'utf8');

test('feedback helper creates the exact encoded mailto draft', () => {
  const buildVersion = 'version_20260715_1834_2ed6b36';
  const mailto = createFeedbackMailto({ languageLabel: 'Ελληνικά', buildVersion });
  const parsed = new URL(mailto);

  assert.equal(feedbackRecipient, 'markellos.markides@gmail.com');
  assert.equal(feedbackSubject, 'Animals Within Feedback');
  assert.equal(parsed.protocol, 'mailto:');
  assert.equal(parsed.pathname, feedbackRecipient);
  assert.equal(parsed.searchParams.get('subject'), feedbackSubject);
  assert.equal(
    parsed.searchParams.get('body'),
    `Language: Ελληνικά\nBuild: ${buildVersion}\n\nFeedback:\n`,
  );
  assert.match(mailto, /Animals%20Within%20Feedback/);
  assert.match(mailto, /%0A/);
});

test('header and footer share the active centralized Feedback builder', () => {
  for (const source of [headerSource, footerSource]) {
    assert.match(source, /createFeedbackMailto/);
    assert.doesNotMatch(source, /feedbackComingSoon|feedbackPlaceholder/);
  }
  assert.match(headerSource, /url=\{feedbackUrl\}/);
  assert.match(footerSource, /url=\{feedbackUrl\}/);
  assert.doesNotMatch(footerSource, /colors\.accent/);
});

test('footer is fixed, measured, safe-area aware, and reserved by the shell', () => {
  assert.match(footerSource, /'fixed'/);
  assert.match(footerSource, /onLayout=\{measureFooter\}/);
  assert.match(footerSource, /edges=\{\['bottom', 'left', 'right'\]\}/);
  assert.match(shellSource, /paddingBottom:\s*footerHeight/);
  assert.match(shellSource, /FooterLayoutProvider/);
});

test('footer has exactly two semantic rows in accessible content order', () => {
  assert.equal((footerSource.match(/testID="footer-row-/g) ?? []).length, 2);
  const order = [
    'content.footer.compactDisclaimer',
    'content.footer.feedbackAccessibilityLabel',
    'content.footer.ecosystemAccessibilityLabel',
    'content.footer.buildAccessibilityLabel',
  ].map((needle) => footerSource.indexOf(needle));
  assert.ok(order.every((index) => index >= 0));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
});

test('footer does not render a placeholder Privacy item', () => {
  assert.doesNotMatch(footerSource, /privacy|accessibilityState=\{\{ disabled: true \}\}/i);
  assert.equal('privacyLabel' in translations.en.footer, false);
  assert.equal('privacyLabel' in translations.el.footer, false);
});

test('footer keeps links and build in one responsive row without horizontal scrolling', () => {
  assert.match(footerSource, /navigationRow:[\s\S]*flexWrap:\s*'wrap'/);
  assert.match(footerSource, /buildVersion:[\s\S]*marginLeft:\s*'auto'/);
  assert.match(footerSource, /flexShrink:\s*1/);
  assert.doesNotMatch(footerSource, /overflowX|horizontal=\{true\}/);
});

test('new footer and Feedback accessibility copy resolves in both languages', () => {
  assert.equal(translations.en.footer.feedbackAccessibilityLabel, 'Send feedback by email');
  assert.equal(translations.el.footer.feedbackAccessibilityLabel, 'Αποστολή σχολίων μέσω email');
  assert.equal(translations.en.footer.buildAccessibilityLabel, 'Application build version');
  assert.equal(translations.el.footer.buildAccessibilityLabel, 'Έκδοση κατασκευής εφαρμογής');
  assert.equal(translations.en.common.selectedLanguageName, 'English');
  assert.equal(translations.el.common.selectedLanguageName, 'Ελληνικά');
  assert.match(translations.en.footer.compactDisclaimer, /not a psychological diagnosis/);
  assert.match(translations.el.footer.compactDisclaimer, /όχι ψυχολογική διάγνωση/);
});
