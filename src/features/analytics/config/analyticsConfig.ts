export const ga4MeasurementId = 'G-QBR3YHHMWS' as const;

export const ga4ScriptUrl =
  `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}` as const;

export const ga4ScriptElementId = 'animals-within-ga4-script' as const;
export const ga4DisableProperty = `ga-disable-${ga4MeasurementId}` as const;

export const ga4DisabledConsentConfig = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

export const ga4EnabledConsentConfig = {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

export const ga4Configuration = {
  send_page_view: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
} as const;
