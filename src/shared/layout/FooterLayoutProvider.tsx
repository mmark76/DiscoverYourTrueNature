import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface FooterLayoutContextValue {
  footerHeight: number;
  setFooterHeight: (height: number) => void;
}

const FooterLayoutContext = createContext<FooterLayoutContextValue | null>(null);

export function FooterLayoutProvider({ children }: { children: ReactNode }) {
  const [footerHeight, setFooterHeightState] = useState(0);
  const value = useMemo(
    () => ({
      footerHeight,
      setFooterHeight: (height: number) => {
        const roundedHeight = Math.ceil(height);
        setFooterHeightState((currentHeight) =>
          currentHeight === roundedHeight ? currentHeight : roundedHeight,
        );
      },
    }),
    [footerHeight],
  );

  return <FooterLayoutContext.Provider value={value}>{children}</FooterLayoutContext.Provider>;
}

export function useFooterLayout() {
  const context = useContext(FooterLayoutContext);
  if (!context) {
    throw new Error('useFooterLayout must be used inside FooterLayoutProvider.');
  }
  return context;
}
