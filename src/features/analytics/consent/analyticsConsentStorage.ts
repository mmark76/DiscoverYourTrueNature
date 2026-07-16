import {
  analyticsConsentStates,
  type AnalyticsConsentState,
} from './analyticsConsentTypes.ts';

export const analyticsConsentStorageKey = 'animals-within.analytics-consent.v1';

export interface AnalyticsConsentStorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export function normalizeStoredAnalyticsConsent(value: unknown): AnalyticsConsentState {
  return typeof value === 'string' && analyticsConsentStates.includes(value as AnalyticsConsentState)
    ? value as AnalyticsConsentState
    : 'unknown';
}

export function restoreAnalyticsConsent(
  storage: AnalyticsConsentStorageAdapter | null,
): AnalyticsConsentState {
  if (!storage) return 'unknown';

  try {
    return normalizeStoredAnalyticsConsent(storage.getItem(analyticsConsentStorageKey));
  } catch {
    return 'unknown';
  }
}

export function persistAnalyticsConsent(
  storage: AnalyticsConsentStorageAdapter | null,
  consentState: AnalyticsConsentState,
): boolean {
  if (!storage) return false;

  try {
    storage.setItem(analyticsConsentStorageKey, consentState);
    return true;
  } catch {
    return false;
  }
}

export function getBrowserAnalyticsConsentStorage(): AnalyticsConsentStorageAdapter | null {
  try {
    return (globalThis as { localStorage?: AnalyticsConsentStorageAdapter }).localStorage ?? null;
  } catch {
    return null;
  }
}
