import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { translations } from '../src/i18n/translations.ts';
import { theme } from '../src/shared/styles/theme.ts';

const headerSource = readFileSync('src/shared/components/AppHeader.tsx', 'utf8');
const pageContentSource = readFileSync('src/shared/components/PageContent.tsx', 'utf8');
const homeSource = readFileSync('src/features/home/components/HomeScreen.tsx', 'utf8');
const footerSource = readFileSync('src/shared/components/AppFooter.tsx', 'utf8');

test('header brand renders without the decorative colored dot', () => {
  assert.match(headerSource, /content\.common\.productName/);
  assert.doesNotMatch(headerSource, /brandMark|styles\.brandMark/);
});

test('header ecosystem label is shortened in English and Greek', () => {
  assert.equal(translations.en.header.ecosystemLink, 'Markellos Ecosystem');
  assert.equal(translations.el.header.ecosystemLink, 'Markellos Ecosystem');
  assert.doesNotMatch(translations.en.header.ecosystemLink, /return/i);
  assert.doesNotMatch(translations.el.header.ecosystemLink, /επιστροφή/i);
});

test('header keeps related links and controls in explicit groups', () => {
  const linkGroupStart = headerSource.indexOf('testID="header-link-group"');
  const controlGroupStart = headerSource.indexOf('testID="header-control-group"');
  const linkGroupSource = headerSource.slice(linkGroupStart, controlGroupStart);
  const controlGroupSource = headerSource.slice(controlGroupStart, headerSource.indexOf('</PageContent>'));

  assert.ok(linkGroupStart >= 0 && controlGroupStart > linkGroupStart);
  assert.match(linkGroupSource, /content\.header\.feedback/);
  assert.match(linkGroupSource, /content\.header\.ecosystemLink/);
  assert.doesNotMatch(linkGroupSource, /languageSelector|content\.header\.settings/);
  assert.match(controlGroupSource, /styles\.languageSelector/);
  assert.match(controlGroupSource, /content\.header\.settings/);
});

test('Feedback and Markellos Ecosystem use the same header link typography', () => {
  const linkGroupStart = headerSource.indexOf('testID="header-link-group"');
  const controlGroupStart = headerSource.indexOf('testID="header-control-group"');
  const linkGroupSource = headerSource.slice(linkGroupStart, controlGroupStart);

  assert.equal((linkGroupSource.match(/textStyle=\{styles\.headerLinkLabel\}/g) ?? []).length, 2);
  assert.doesNotMatch(linkGroupSource, /ecosystemLabel|fontSize/);
});

test('header, Home hero and cards, and footer share one page container strategy', () => {
  assert.equal(theme.layout.contentMaxWidth, 1320);
  assert.equal(theme.layout.pagePaddingMobile, 16);
  assert.equal(theme.layout.pagePaddingDesktop, 24);
  assert.equal(theme.layout.pagePaddingWide, 32);
  assert.match(pageContentSource, /maxWidth:\s*theme\.layout\.contentMaxWidth/);
  assert.match(pageContentSource, /marginHorizontal:\s*'auto'/);

  for (const source of [headerSource, homeSource, footerSource]) {
    assert.match(source, /<PageContent/);
  }

  const pageStart = homeSource.indexOf('<PageContent');
  const hero = homeSource.indexOf('<HeroSection');
  const grid = homeSource.indexOf('style={styles.grid}');
  const pageEnd = homeSource.indexOf('</PageContent>');
  assert.ok(pageStart >= 0 && pageStart < hero && hero < grid && grid < pageEnd);
});

test('header zones balance widely and move complete groups into responsive rows', () => {
  const zoneOrder = [
    'testID="header-brand-zone"',
    'testID="header-navigation-group"',
    'testID="header-right-zone"',
  ].map((needle) => headerSource.indexOf(needle));

  assert.ok(zoneOrder.every((index) => index >= 0));
  assert.deepEqual(zoneOrder, [...zoneOrder].sort((a, b) => a - b));
  assert.match(headerSource, /width < theme\.layout\.headerBalancedBreakpoint/);
  assert.match(headerSource, /settings\.textSize === 'extra-large'/);
  assert.match(headerSource, /balancedOuterZone:[^\n]*flexBasis:\s*0[^\n]*flexGrow:\s*1/);
  assert.match(headerSource, /rightZoneCompact:[^\n]*flexWrap:\s*'wrap'[^\n]*justifyContent:\s*'center'/);
  assert.match(headerSource, /headerLinkGroup:[^\n]*flexShrink:\s*0/);
  assert.match(headerSource, /headerControlGroup:[^\n]*flexShrink:\s*0/);
  assert.doesNotMatch(headerSource, /overflowX|horizontal=\{true\}|position:\s*'absolute'/);
});

test('existing centered footer and responsive version layering remain intact', () => {
  assert.match(footerSource, /copyright:[^\n]*textAlign:\s*'center'/);
  assert.match(footerSource, /linkGroup:[^\n]*justifyContent:\s*'center'/);
  assert.match(footerSource, /buildVersionLayered:[^\n]*position:\s*'absolute'[^\n]*right:\s*0/);
  assert.match(footerSource, /buildVersionStacked:[^\n]*alignSelf:\s*'stretch'/);
});
