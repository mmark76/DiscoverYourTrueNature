import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnalyticsConsentBanner } from '../../features/analytics/consent/AnalyticsConsentBanner';
import { AnalyticsConsentDialog } from '../../features/analytics/consent/AnalyticsConsentDialog';
import { AppFooter } from '../components/AppFooter';
import { FooterLayoutProvider, useFooterLayout } from './FooterLayoutProvider';

interface AppShellProps {
  header: ReactNode;
  children: ReactNode;
  showChrome?: boolean;
}

export function AppShell(props: AppShellProps) {
  return (
    <FooterLayoutProvider>
      <MeasuredAppShell {...props} />
    </FooterLayoutProvider>
  );
}

function MeasuredAppShell({ header, children, showChrome = true }: AppShellProps) {
  const { footerHeight } = useFooterLayout();

  return (
    <View style={styles.shell}>
      {showChrome && header}
      <View style={[styles.screen, { paddingBottom: showChrome ? footerHeight : 0 }]}>
        <View style={styles.screenContent}>{children}</View>
        <AnalyticsConsentBanner />
      </View>
      <AnalyticsConsentDialog />
      {showChrome && <AppFooter />}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, width: '100%' },
  screen: { flex: 1, width: '100%' },
  screenContent: { flex: 1, minHeight: 0, width: '100%' },
});
