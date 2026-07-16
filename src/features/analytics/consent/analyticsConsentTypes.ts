export const analyticsConsentStates = ['unknown', 'accepted', 'rejected'] as const;

export type AnalyticsConsentState = (typeof analyticsConsentStates)[number];

export function shouldShowAnalyticsConsentBanner(
  consentState: AnalyticsConsentState,
  choicesOpen: boolean,
): boolean {
  return consentState === 'unknown' && !choicesOpen;
}
