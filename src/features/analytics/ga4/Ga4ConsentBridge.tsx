import { useEffect } from 'react';

import { useAnalyticsConsent } from '../consent/AnalyticsConsentProvider';
import { browserGa4Client } from './ga4Client.ts';

export function Ga4ConsentBridge() {
  const { consentState } = useAnalyticsConsent();

  useEffect(() => {
    browserGa4Client.syncConsent(consentState);
  }, [consentState]);

  return null;
}
