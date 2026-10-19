import { useEffect } from 'react';
import { Platform } from 'react-native';

const scriptId = 'animals-within-cookieless-analytics';
const scriptUrl = 'https://analytics.markellosecosystem.com/v1/script.js';
const productionHostname = 'animalswithin.markellosecosystem.com';

export function CookieLessAnalytics() {
  useEffect(() => {
    if (
      Platform.OS !== 'web'
      || typeof window === 'undefined'
      || typeof document === 'undefined'
      || typeof window.location === 'undefined'
      || window.location.protocol !== 'https:'
      || window.location.hostname.toLowerCase() !== productionHostname
      || document.getElementById(scriptId)
    ) return;

    const script = document.createElement('script');
    script.async = true;
    script.id = scriptId;
    script.src = scriptUrl;
    document.head.append(script);
  }, []);

  return null;
}
