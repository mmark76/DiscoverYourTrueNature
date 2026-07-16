import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppFooter } from '../components/AppFooter';
import { FooterLayoutProvider, useFooterLayout } from './FooterLayoutProvider';

interface AppShellProps {
  header: ReactNode;
  children: ReactNode;
}

export function AppShell(props: AppShellProps) {
  return (
    <FooterLayoutProvider>
      <MeasuredAppShell {...props} />
    </FooterLayoutProvider>
  );
}

function MeasuredAppShell({ header, children }: AppShellProps) {
  const { footerHeight } = useFooterLayout();

  return (
    <View style={styles.shell}>
      {header}
      <View style={[styles.screen, { paddingBottom: footerHeight }]}>{children}</View>
      <AppFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, width: '100%' },
  screen: { flex: 1, width: '100%' },
});
