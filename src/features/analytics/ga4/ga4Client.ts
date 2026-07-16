import type { AnalyticsConsentState } from '../consent/analyticsConsentTypes.ts';
import {
  ga4Configuration,
  ga4DisabledConsentConfig,
  ga4DisableProperty,
  ga4EnabledConsentConfig,
  ga4MeasurementId,
  ga4ScriptElementId,
  ga4ScriptUrl,
} from '../config/analyticsConfig.ts';
import { createBrowserGa4Adapter } from './ga4BrowserAdapter.ts';
import type { Ga4BrowserAdapter } from './ga4Types.ts';

export interface Ga4Client {
  syncConsent: (consentState: AnalyticsConsentState) => void;
}

export function createGa4Client(adapter: Ga4BrowserAdapter | null): Ga4Client {
  let currentConsent: AnalyticsConsentState = 'unknown';
  let hasSyncedConsent = false;
  let defaultConsentQueued = false;
  let scriptLoadRequested = false;
  let scriptReady = false;
  let initialized = false;
  let initialPageViewSent = false;

  function queueDefaultDeniedConsent(): boolean {
    if (defaultConsentQueued) return true;
    if (!adapter?.queue(['consent', 'default', ga4DisabledConsentConfig])) return false;
    defaultConsentQueued = true;
    return true;
  }

  function initializeAfterScriptLoad() {
    if (!adapter || currentConsent !== 'accepted' || initialized) return;

    const tagInitialized = adapter.queue(['js', new Date()]);
    const configured = tagInitialized
      && adapter.queue(['config', ga4MeasurementId, ga4Configuration]);
    if (!configured) return;
    initialized = true;

    const currentPage = adapter.getCurrentPage();
    if (currentPage && !initialPageViewSent) {
      initialPageViewSent = adapter.queue(['event', 'page_view', currentPage]);
    }
  }

  function loadGoogleTagOnce() {
    if (!adapter || scriptLoadRequested) return;
    scriptLoadRequested = true;
    adapter.loadScript(
      ga4ScriptUrl,
      ga4ScriptElementId,
      () => {
        scriptReady = true;
        initializeAfterScriptLoad();
      },
      () => {
        scriptLoadRequested = false;
      },
    );
  }

  function clearGaCookies() {
    if (!adapter) return;
    const gaCookieNames = new Set(adapter.getCookieNames().filter((name) => name.startsWith('_ga')));
    for (const cookieName of gaCookieNames) adapter.expireCookie(cookieName);
  }

  function acceptAnalytics() {
    if (!adapter || !queueDefaultDeniedConsent()) return;
    currentConsent = 'accepted';
    adapter.queue(['consent', 'update', ga4EnabledConsentConfig]);
    adapter.setAnalyticsDisabled(ga4DisableProperty, false);

    if (scriptReady) {
      initializeAfterScriptLoad();
    } else {
      loadGoogleTagOnce();
    }
  }

  function denyAnalytics(consentState: Exclude<AnalyticsConsentState, 'accepted'>) {
    if (!adapter || !queueDefaultDeniedConsent()) return;
    const wasAcceptedOrLoading = currentConsent === 'accepted' || scriptLoadRequested || initialized;
    currentConsent = consentState;

    if (wasAcceptedOrLoading) {
      adapter.queue(['consent', 'update', ga4DisabledConsentConfig]);
    }

    if (consentState === 'rejected') {
      adapter.setAnalyticsDisabled(ga4DisableProperty, true);
      clearGaCookies();
    }
  }

  return {
    syncConsent(consentState) {
      try {
        if (hasSyncedConsent && consentState === currentConsent) return;
        hasSyncedConsent = true;
        if (consentState === 'accepted') {
          acceptAnalytics();
        } else {
          denyAnalytics(consentState);
        }
      } catch {
        currentConsent = 'unknown';
      }
    },
  };
}

export const browserGa4Client = createGa4Client(createBrowserGa4Adapter());
