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
  assert.match(footerSource, /https:\/\/markellosecosystem\.com/);
  assert.match(footerSource, /url=\{ecosystemUrl\}/);
  assert.match(footerSource, /\{buildVersion\}/);
  assert.doesNotMatch(footerSource, /colors\.accent/);
});

test('footer renders a dynamic current-year copyright notice', () => {
  assert.match(footerSource, /const currentYear = new Date\(\)\.getFullYear\(\)/);
  assert.match(footerSource, /© \$\{currentYear\} Markellos Markides\. All rights reserved\./);
  assert.match(footerSource, /testID="footer-row-copyright"/);
  assert.doesNotMatch(footerSource, /©\s*2026/);
});

test('footer is fixed, measured, safe-area aware, and reserved by the shell', () => {
  assert.match(footerSource, /'fixed'/);
  assert.match(footerSource, /onLayout=\{measureFooter\}/);
  assert.match(footerSource, /edges=\{\['bottom', 'left', 'right'\]\}/);
  assert.match(shellSource, /paddingBottom:\s*showChrome \? footerHeight : 0/);
  assert.match(shellSource, /FooterLayoutProvider/);
});

test('footer has exactly two semantic rows in accessible content order', () => {
  assert.equal((footerSource.match(/testID="footer-row-/g) ?? []).length, 2);
  const order = [
    'testID="footer-row-copyright"',
    'content.footer.feedbackAccessibilityLabel',
    'content.footer.analyticsChoicesAccessibilityLabel',
    'content.footer.ecosystemAccessibilityLabel',
    'content.footer.buildAccessibilityLabel',
  ].map((needle) => footerSource.indexOf(needle));
  assert.ok(order.every((index) => index >= 0));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
});

test('footer renders no inactive legal placeholders', () => {
  assert.match(footerSource, /content\.footer\.analyticsChoicesLabel/);
  assert.doesNotMatch(footerSource, /privacy|license|copyright protected|coming soon|accessibilityState=\{\{ disabled: true \}\}/i);
  assert.equal('privacyLabel' in translations.en.footer, false);
  assert.equal('privacyLabel' in translations.el.footer, false);
});

test('footer centers the copyright and link group across the full content width', () => {
  assert.match(footerSource, /copyrightRow:[^\n]*alignItems:\s*'center'/);
  assert.match(footerSource, /copyright:[^\n]*textAlign:\s*'center'/);
  assert.match(footerSource, /navigationRow:[\s\S]*justifyContent:\s*'center'[\s\S]*position:\s*'relative'/);
  assert.match(footerSource, /linkGroup:[^\n]*alignSelf:\s*'center'[^\n]*justifyContent:\s*'center'/);
});

test('footer layers the build version at the far right without shifting centered links', () => {
  assert.match(footerSource, /buildVersion:[\s\S]*textAlign:\s*'right'/);
  assert.match(footerSource, /buildVersionLayered:[^\n]*position:\s*'absolute'[^\n]*right:\s*0/);
  assert.doesNotMatch(footerSource, /linkGroup:[^\n]*margin(?:Left|Right)/);
});

test('mobile footer stacks the version without horizontal overflow', () => {
  assert.match(
    footerSource,
    /useStackedNavigation = shouldStackFooterNavigation\(width, settings\.textSize\)/,
  );
  assert.match(footerSource, /navigationRowStacked:[^\n]*alignItems:\s*'stretch'/);
  assert.match(footerSource, /buildVersionStacked:[^\n]*alignSelf:\s*'stretch'/);
  assert.match(footerSource, /linkGroup:[^\n]*flexWrap:\s*'wrap'[^\n]*maxWidth:\s*'100%'/);
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
});
