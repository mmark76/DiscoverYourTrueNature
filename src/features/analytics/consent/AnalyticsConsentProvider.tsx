import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  getBrowserAnalyticsConsentStorage,
  persistAnalyticsConsent,
  restoreAnalyticsConsent,
  type AnalyticsConsentStorageAdapter,
} from './analyticsConsentStorage.ts';
import type { AnalyticsConsentState } from './analyticsConsentTypes.ts';

interface AnalyticsConsentContextValue {
  consentState: AnalyticsConsentState;
  choicesOpen: boolean;
  accept: () => void;
  reject: () => void;
  openChoices: () => void;
  closeChoices: () => void;
}

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue | null>(null);

interface AnalyticsConsentProviderProps {
  children: ReactNode;
  storage?: AnalyticsConsentStorageAdapter | null;
}

export function AnalyticsConsentProvider({ children, storage }: AnalyticsConsentProviderProps) {
  const resolvedStorage = useMemo(
    () => storage === undefined ? getBrowserAnalyticsConsentStorage() : storage,
    [storage],
  );
  const [consentState, setConsentState] = useState<AnalyticsConsentState>(() =>
    restoreAnalyticsConsent(resolvedStorage),
  );
  const [choicesOpen, setChoicesOpen] = useState(false);

  const choose = useCallback((nextState: AnalyticsConsentState) => {
    const persisted = persistAnalyticsConsent(resolvedStorage, nextState);
    setConsentState(persisted ? nextState : 'unknown');
    setChoicesOpen(false);
  }, [resolvedStorage]);

  const value = useMemo<AnalyticsConsentContextValue>(() => ({
    consentState,
    choicesOpen,
    accept: () => choose('accepted'),
    reject: () => choose('rejected'),
    openChoices: () => setChoicesOpen(true),
    closeChoices: () => setChoicesOpen(false),
  }), [choicesOpen, choose, consentState]);

  return (
    <AnalyticsConsentContext.Provider value={value}>
      {children}
    </AnalyticsConsentContext.Provider>
  );
}

export function useAnalyticsConsent(): AnalyticsConsentContextValue {
  const value = useContext(AnalyticsConsentContext);

  if (!value) {
    throw new Error('useAnalyticsConsent must be used inside AnalyticsConsentProvider.');
  }

  return value;
}
