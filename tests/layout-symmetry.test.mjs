import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { shouldShowAppChrome } from '../src/app/navigation.ts';
import { translations } from '../src/i18n/translations.ts';
import { theme } from '../src/shared/styles/theme.ts';

const appSource = readFileSync('App.tsx', 'utf8');
const appShellSource = readFileSync('src/shared/layout/AppShell.tsx', 'utf8');
const responsiveLayoutSource = readFileSync('src/shared/layout/responsiveLayout.ts', 'utf8');
const headerSource = readFileSync('src/shared/components/AppHeader.tsx', 'utf8');
const pageContentSource = readFileSync('src/shared/components/PageContent.tsx', 'utf8');
const homeSource = readFileSync('src/features/home/components/HomeScreen.tsx', 'utf8');
const footerSource = readFileSync('src/shared/components/AppFooter.tsx', 'utf8');

const sharedContainerSources = {
  header: headerSource,
  home: homeSource,
  assessment: readFileSync('src/features/assessment/components/AssessmentScreen.tsx', 'utf8'),
  result: readFileSync('src/features/results/components/ResultScreen.tsx', 'utf8'),
  animals: readFileSync('src/features/animals/components/AnimalsScreen.tsx', 'utf8'),
  howItWorks: readFileSync(
    'src/features/information/components/HowItWorksScreen.tsx',
    'utf8',
  ),
  settings: readFileSync('src/settings/components/SettingsScreen.tsx', 'utf8'),
  footer: footerSource,
};

function sourceBetween(source, startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  const end = source.indexOf(endNeedle, start + startNeedle.length);

  assert.ok(start >= 0, `Missing start marker: ${startNeedle}`);
  assert.ok(end > start, `Missing end marker after ${startNeedle}: ${endNeedle}`);
  return source.slice(start, end);
}

test('header brand renders only the Animals Within wording without a decorative dot', () => {
  const brandZone = sourceBetween(
    headerSource,
    'testID="header-brand-zone"',
    'testID="header-navigation-group"',
  );

  assert.match(brandZone, /content\.common\.productName/);
  assert.doesNotMatch(brandZone, /brand(?:Mark|Dot)|styles\.dot|[●•]/i);
});

test('header ecosystem label is shortened in English and Greek', () => {
  assert.equal(translations.en.header.ecosystemLink, 'Markellos Ecosystem');
  assert.equal(translations.el.header.ecosystemLink, 'Markellos Ecosystem');
  assert.doesNotMatch(translations.en.header.ecosystemLink, /return/i);
  assert.doesNotMatch(translations.el.header.ecosystemLink, /επιστροφή/i);
});

test('header keeps navigation, links, and controls in three explicit complete groups', () => {
  const navigationGroup = sourceBetween(
    headerSource,
    'testID="header-navigation-group"',
    'testID="header-right-zone"',
  );
  const linkGroup = sourceBetween(
    headerSource,
    'testID="header-link-group"',
    '</View>',
  );
  const controlGroup = sourceBetween(
    headerSource,
    'testID="header-control-group"',
    '</PageContent>',
  );

  assert.match(navigationGroup, /navigationItems\.map/);
  assert.equal((headerSource.match(/screen: '(?:home|assessment|animals|how-it-works)'/g) ?? []).length, 4);

  assert.match(linkGroup, /content\.header\.feedback/);
  assert.match(linkGroup, /content\.header\.ecosystemLink/);
  assert.doesNotMatch(linkGroup, /languageSelector|content\.header\.settings/);

  assert.match(controlGroup, /styles\.languageSelector/);
  assert.match(controlGroup, /content\.header\.settings/);
  assert.match(headerSource, /role="navigation"/);
  assert.equal((headerSource.match(/role="group"/g) ?? []).length, 2);
  assert.match(headerSource, /role="radiogroup"/);
});

test('Feedback and Markellos Ecosystem share one typography style', () => {
  const linkGroup = sourceBetween(
    headerSource,
    'testID="header-link-group"',
    '</View>',
  );

  assert.equal((linkGroup.match(/textStyle=\{styles\.headerLinkLabel\}/g) ?? []).length, 2);
  assert.doesNotMatch(linkGroup, /ecosystemLabel|fontSize/);
});

test('all primary surfaces use the centralized responsive page container', () => {
  assert.ok(theme.layout.pageMaxWidth > 0);
  assert.ok(theme.layout.pagePaddingMobile <= theme.layout.pagePaddingTablet);
  assert.ok(theme.layout.pagePaddingTablet <= theme.layout.pagePaddingDesktop);
  assert.ok(theme.layout.tabletBreakpoint < theme.layout.desktopBreakpoint);

  assert.match(pageContentSource, /maxWidth:\s*theme\.layout\.pageMaxWidth/);
  assert.match(pageContentSource, /marginHorizontal:\s*'auto'/);
  assert.match(pageContentSource, /getPageHorizontalPadding\(width\)/);
  assert.match(responsiveLayoutSource, /theme\.layout\.pagePaddingMobile/);
  assert.match(responsiveLayoutSource, /theme\.layout\.pagePaddingTablet/);
  assert.match(responsiveLayoutSource, /theme\.layout\.pagePaddingDesktop/);

  for (const [surface, source] of Object.entries(sharedContainerSources)) {
    assert.match(source, /<PageContent/, `${surface} must use PageContent`);
  }

  const homeContainer = sourceBetween(homeSource, '<PageContent', '</PageContent>');
  assert.match(homeContainer, /<HeroSection/);
  assert.match(homeContainer, /style=\{styles\.sectionHeading\}/);
  assert.match(homeContainer, /style=\{styles\.grid\}/);
});

test('wide header balances three zones and compact layouts wrap only complete groups', () => {
  const zoneOrder = [
    'testID="header-brand-zone"',
    'testID="header-navigation-group"',
    'testID="header-right-zone"',
  ].map((needle) => headerSource.indexOf(needle));

  assert.ok(zoneOrder.every((index) => index >= 0));
  assert.deepEqual(zoneOrder, [...zoneOrder].sort((a, b) => a - b));
  assert.match(headerSource, /shouldUseCompactHeader\(width, settings\.textSize\)/);
  assert.match(responsiveLayoutSource, /viewportWidth < theme\.layout\.headerThreeZoneBreakpoint/);
  assert.match(responsiveLayoutSource, /textSize === 'extra-large'/);
  assert.match(headerSource, /balancedOuterZone:[^\n]*flexBasis:\s*0[^\n]*flexGrow:\s*1/);
  assert.match(headerSource, /rightZone:[^\n]*flexDirection:\s*'row'[^\n]*flexWrap:\s*'wrap'[^\n]*justifyContent:\s*'flex-end'/);
  assert.match(headerSource, /rightZoneCompact:[^\n]*justifyContent:\s*'center'/);
  assert.match(headerSource, /headerLinkGroup:[^\n]*flexShrink:\s*0/);
  assert.match(headerSource, /headerControlGroup:[^\n]*flexShrink:\s*0/);
  assert.doesNotMatch(headerSource, /overflowX|horizontal=\{true\}|position:\s*'absolute'/);
});

test('footer centers copyright and links independently from its secondary build version', () => {
  assert.match(footerSource, /copyright:[^\n]*textAlign:\s*'center'/);
  assert.match(footerSource, /linkGroup:[^\n]*justifyContent:\s*'center'/);
  assert.match(footerSource, /buildVersionLayered:[^\n]*position:\s*'absolute'[^\n]*right:\s*0/);
  assert.match(footerSource, /buildVersionStacked:[^\n]*alignSelf:\s*'stretch'/);
  assert.match(footerSource, /shouldStackFooterNavigation\(width, settings\.textSize\)/);
  assert.match(footerSource, /linkLabel:[^\n]*color:\s*colors\.footerText/);
  assert.match(footerSource, /buildVersion:[\s\S]*?color:\s*colors\.footerMuted/);
  assert.match(footerSource, /role="contentinfo"/);

  const linkFontSize = Number(footerSource.match(/linkLabel:[^\n]*fontSize:\s*(\d+)/)?.[1]);
  const versionFontSize = Number(
    footerSource.match(/buildVersion:\s*\{[\s\S]*?fontSize:\s*(\d+)/)?.[1],
  );
  assert.ok(versionFontSize < linkFontSize);

  assert.equal((footerSource.match(/style=\{styles\.linkPair\}/g) ?? []).length, 2);
});

test('result hides normal app chrome while keeping the consent layer in the shell', () => {
  assert.equal(shouldShowAppChrome('result'), false);
  for (const screen of ['home', 'assessment', 'animals', 'how-it-works', 'settings']) {
    assert.equal(shouldShowAppChrome(screen), true);
  }

  assert.match(appSource, /const showAppChrome = shouldShowAppChrome\(screen\)/);
  assert.match(appSource, /showChrome=\{showAppChrome\}/);
  assert.match(
    appSource,
    /showAppChrome[\s\S]*?\['top', 'left', 'right'\][\s\S]*?\['top', 'bottom', 'left', 'right'\]/,
  );
  assert.match(appShellSource, /\{showChrome && header\}/);
  assert.match(appShellSource, /\{showChrome && <AppFooter \/>\}/);
  assert.match(appShellSource, /<AnalyticsConsentBanner \/>/);
  assert.match(appShellSource, /<AnalyticsConsentDialog \/>/);
});
