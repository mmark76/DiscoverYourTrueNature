const contentMaxWidth = 1320;

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
    contentMaxWidth,
    headerBalancedBreakpoint: contentMaxWidth,
    footerLayeredBreakpoint: 1100,
    majorGroupGap: 24,
    compactGroupGap: 8,
    sectionSpacing: 32,
    mobileBreakpoint: 680,
    pagePaddingMobile: 16,
    pagePaddingDesktop: 24,
    pagePaddingWide: 32,
    wideBreakpoint: 1200,
  },
} as const;
