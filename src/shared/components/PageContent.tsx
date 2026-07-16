import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { theme } from '../styles/theme';

interface PageContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function PageContent({ children, style }: PageContentProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding =
    width < theme.layout.mobileBreakpoint
      ? theme.layout.pagePaddingMobile
      : width >= theme.layout.wideBreakpoint
        ? theme.layout.pagePaddingWide
        : theme.layout.pagePaddingDesktop;

  return (
    <View style={[styles.container, { paddingHorizontal: horizontalPadding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginHorizontal: 'auto',
    maxWidth: theme.layout.contentMaxWidth,
    width: '100%',
  },
});
