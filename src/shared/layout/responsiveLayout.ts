import type { TextSizeChoice } from '../../settings/appearanceTypes';
import { theme } from '../styles/theme.ts';

export function getPageHorizontalPadding(viewportWidth: number) {
  if (viewportWidth < theme.layout.tabletBreakpoint) {
    return theme.layout.pagePaddingMobile;
  }

  if (viewportWidth < theme.layout.desktopBreakpoint) {
    return theme.layout.pagePaddingTablet;
  }

  return theme.layout.pagePaddingDesktop;
}

export function shouldUseCompactHeader(
  viewportWidth: number,
  textSize: TextSizeChoice,
) {
  return (
    viewportWidth < theme.layout.headerThreeZoneBreakpoint
    || textSize === 'extra-large'
  );
}

export function shouldStackFooterNavigation(
  viewportWidth: number,
  textSize: TextSizeChoice,
) {
  return (
    viewportWidth < theme.layout.footerLayeredBreakpoint
    || textSize === 'extra-large'
  );
}
