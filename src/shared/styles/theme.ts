const pageMaxWidth = 1320;

export const theme = {
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 22,
  },
  layout: {
    pageMaxWidth,
    pagePaddingMobile: 16,
    pagePaddingTablet: 24,
    pagePaddingDesktop: 32,
    tabletBreakpoint: 680,
    desktopBreakpoint: 1200,
    headerThreeZoneBreakpoint: 1180,
    footerLayeredBreakpoint: 1100,
    sectionGap: 32,
    groupGap: 24,
    controlGap: 8,
    inlineGap: 4,
  },
} as const;
