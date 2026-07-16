import type {
  Ga4BrowserAdapter,
  Ga4DataLayerEntry,
  GtagQueueFunction,
} from './ga4Types.ts';

function getBrowserObjects(): { browserWindow: Window; browserDocument: Document } | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  return { browserWindow: window, browserDocument: document };
}

function ensureGtagQueue(browserWindow: Window): GtagQueueFunction {
  browserWindow.dataLayer ??= [];
  browserWindow.gtag ??= function gtag() {
    browserWindow.dataLayer?.push(arguments as unknown as Ga4DataLayerEntry);
  };
  return browserWindow.gtag;
}

function cookieDomainCandidates(hostname: string): string[] {
  if (!hostname || hostname === 'localhost' || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
    return [];
  }

  const labels = hostname.split('.');
  const candidates = new Set<string>();
  for (let index = 0; index <= labels.length - 2; index += 1) {
    candidates.add(labels.slice(index).join('.'));
  }
  return [...candidates];
}

export function createBrowserGa4Adapter(): Ga4BrowserAdapter | null {
  const browser = getBrowserObjects();
  if (!browser) return null;

  const { browserWindow, browserDocument } = browser;

  return {
    queue(command) {
      try {
        ensureGtagQueue(browserWindow)(...command);
        return true;
      } catch {
        return false;
      }
    },
    loadScript(url, elementId, onReady, onFailure) {
      try {
        const existingScript = browserDocument.getElementById(elementId) as HTMLScriptElement | null;
        if (existingScript) {
          if (existingScript.dataset.animalsWithinGa4Loaded === 'true') {
            onReady();
          } else {
            existingScript.addEventListener('load', onReady, { once: true });
            existingScript.addEventListener('error', onFailure, { once: true });
          }
          return;
        }

        const script = browserDocument.createElement('script');
        script.id = elementId;
        script.async = true;
        script.src = url;
        script.addEventListener('load', () => {
          script.dataset.animalsWithinGa4Loaded = 'true';
          onReady();
        }, { once: true });
        script.addEventListener('error', onFailure, { once: true });
        browserDocument.head.appendChild(script);
      } catch {
        onFailure();
      }
    },
    setAnalyticsDisabled(property, disabled) {
      try {
        browserWindow[property] = disabled;
      } catch {
        // Consent remains enforced by the client even when the browser flag is unavailable.
      }
    },
    getCurrentPage() {
      try {
        return {
          page_location: browserWindow.location.href,
          page_title: browserDocument.title,
        };
      } catch {
        return null;
      }
    },
    getCookieNames() {
      try {
        return browserDocument.cookie
          .split(';')
          .map((cookie) => cookie.trim().split('=')[0] ?? '')
          .filter(Boolean);
      } catch {
        return [];
      }
    },
    expireCookie(name) {
      try {
        const baseDeletion = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
        browserDocument.cookie = baseDeletion;
        for (const domain of cookieDomainCandidates(browserWindow.location.hostname)) {
          browserDocument.cookie = `${baseDeletion}; Domain=${domain}`;
          browserDocument.cookie = `${baseDeletion}; Domain=.${domain}`;
        }
      } catch {
        // Cookie cleanup is best effort and never weakens the in-memory disabled state.
      }
    },
  };
}
