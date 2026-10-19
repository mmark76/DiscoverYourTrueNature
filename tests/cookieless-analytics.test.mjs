import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import { translations } from '../src/i18n/translations.ts';

const loaderSource = readFileSync('src/features/analytics/CookieLessAnalytics.tsx', 'utf8');
const appSource = readFileSync('App.tsx', 'utf8');
const footerSource = readFileSync('src/shared/components/AppFooter.tsx', 'utf8');
const shellSource = readFileSync('src/shared/layout/AppShell.tsx', 'utf8');

test('cookie-less analytics loads only the central collector on the exact production hostname', () => {
  assert.match(loaderSource, /https:\/\/analytics\.markellosecosystem\.com\/v1\/script\.js/);
  assert.match(loaderSource, /animalswithin\.markellosecosystem\.com/);
  assert.match(loaderSource, /Platform\.OS !== 'web'/);
  assert.match(loaderSource, /typeof document === 'undefined'/);
  assert.match(loaderSource, /typeof window\.location === 'undefined'/);
  assert.match(loaderSource, /window\.location\.protocol !== 'https:'/);
  assert.match(loaderSource, /window\.location\.hostname\.toLowerCase\(\) !== productionHostname/);
  assert.match(loaderSource, /document\.getElementById\(scriptId\)/);
  assert.match(loaderSource, /script\.async = true/);
  assert.match(appSource, /<CookieLessAnalytics \/>/);
});

test('the app has no GA4 implementation, analytics consent UI, or analytics storage', () => {
  const retiredPaths = [
    'src/features/analytics/config/analyticsConfig.ts',
    'src/features/analytics/consent/AnalyticsConsentProvider.tsx',
    'src/features/analytics/ga4/ga4Client.ts',
  ];
  for (const path of retiredPaths) assert.equal(existsSync(path), false, `${path} must be removed`);

  const activeSources = [loaderSource, footerSource, shellSource].join('\n');
  assert.doesNotMatch(activeSources, /googletagmanager|google-analytics|\bgtag\b|GA4|AnalyticsConsent|localStorage|document\.cookie/i);
  assert.doesNotMatch(activeSources, /features\/(?:assessment|personalities|animals|results)|selectedOptionId|primaryTypeId|secondaryTypeId/i);
});

test('the public footer describes the limited aggregate collection in both languages', () => {
  for (const content of [translations.en.footer.analyticsInformation, translations.el.footer.analyticsInformation]) {
    assert.match(content, /cookies/i);
    assert.match(content, /UTC/);
    assert.match(content, /domain/i);
    assert.match(content, /country|χώρα/i);
  }
  assert.match(translations.en.footer.analyticsInformation, /no visitor identifiers, paths, referrers, device details or events/i);
  assert.match(translations.el.footer.analyticsInformation, /αναγνωριστικά επισκεπτών, διαδρομές, παραπομπές, στοιχεία συσκευής ή συμβάντα/i);
});
