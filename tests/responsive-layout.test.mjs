import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPageHorizontalPadding,
  shouldStackFooterNavigation,
  shouldUseCompactHeader,
} from '../src/shared/layout/responsiveLayout.ts';
import { theme } from '../src/shared/styles/theme.ts';

const reviewWidths = {
  desktop: 1440,
  laptop: 1280,
  tablet: 768,
  mobile: 390,
  desktopAtTwoHundredPercentZoom: 1440 / 2,
};

test('required review widths resolve to the semantic page-padding tiers', () => {
  assert.equal(
    getPageHorizontalPadding(reviewWidths.desktop),
    theme.layout.pagePaddingDesktop,
  );
  assert.equal(
    getPageHorizontalPadding(reviewWidths.laptop),
    theme.layout.pagePaddingDesktop,
  );
  assert.equal(
    getPageHorizontalPadding(reviewWidths.tablet),
    theme.layout.pagePaddingTablet,
  );
  assert.equal(
    getPageHorizontalPadding(reviewWidths.mobile),
    theme.layout.pagePaddingMobile,
  );
  assert.equal(
    getPageHorizontalPadding(reviewWidths.desktopAtTwoHundredPercentZoom),
    theme.layout.pagePaddingTablet,
  );
});

test('desktop and laptop use three zones while tablet, mobile, and zoom use compact rows', () => {
  assert.equal(shouldUseCompactHeader(reviewWidths.desktop, 'small'), false);
  assert.equal(shouldUseCompactHeader(reviewWidths.laptop, 'small'), false);
  assert.equal(shouldUseCompactHeader(reviewWidths.tablet, 'small'), true);
  assert.equal(shouldUseCompactHeader(reviewWidths.mobile, 'small'), true);
  assert.equal(
    shouldUseCompactHeader(reviewWidths.desktopAtTwoHundredPercentZoom, 'small'),
    true,
  );
});

test('Extra Large text always uses compact header rows and a stacked footer version', () => {
  for (const viewportWidth of Object.values(reviewWidths)) {
    assert.equal(shouldUseCompactHeader(viewportWidth, 'extra-large'), true);
    assert.equal(shouldStackFooterNavigation(viewportWidth, 'extra-large'), true);
  }
});

test('footer version layering is limited to wide non-Extra-Large layouts', () => {
  assert.equal(shouldStackFooterNavigation(reviewWidths.desktop, 'small'), false);
  assert.equal(shouldStackFooterNavigation(reviewWidths.laptop, 'small'), false);
  assert.equal(shouldStackFooterNavigation(reviewWidths.tablet, 'small'), true);
  assert.equal(shouldStackFooterNavigation(reviewWidths.mobile, 'small'), true);
  assert.equal(
    shouldStackFooterNavigation(reviewWidths.desktopAtTwoHundredPercentZoom, 'small'),
    true,
  );
});
