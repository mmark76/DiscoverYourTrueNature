import type { ga4MeasurementId } from '../config/analyticsConfig.ts';

export type Ga4MeasurementId = typeof ga4MeasurementId;
export type Ga4ConsentValue = 'denied' | 'granted';

export interface Ga4ConsentConfig {
  analytics_storage: Ga4ConsentValue;
  ad_storage: 'denied';
  ad_user_data: 'denied';
  ad_personalization: 'denied';
}

export interface Ga4Configuration {
  send_page_view: false;
  allow_google_signals: false;
  allow_ad_personalization_signals: false;
}

export interface Ga4PageViewParameters {
  page_location: string;
  page_title: string;
}

export type Ga4Command =
  | ['consent', 'default' | 'update', Ga4ConsentConfig]
  | ['js', Date]
  | ['config', Ga4MeasurementId, Ga4Configuration]
  | ['event', 'page_view', Ga4PageViewParameters];

export type GtagQueueFunction = (...command: Ga4Command) => void;

export interface Ga4BrowserAdapter {
  queue: (command: Ga4Command) => boolean;
  loadScript: (
    url: string,
    elementId: string,
    onReady: () => void,
    onFailure: () => void,
  ) => void;
  setAnalyticsDisabled: (property: `ga-disable-${string}`, disabled: boolean) => void;
  getCurrentPage: () => Ga4PageViewParameters | null;
  getCookieNames: () => string[];
  expireCookie: (name: string) => void;
}

declare global {
  interface Window {
    dataLayer?: Ga4Command[];
    gtag?: GtagQueueFunction;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export {};
