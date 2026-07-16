import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { getPageHorizontalPadding } from '../layout/responsiveLayout';
import { theme } from '../styles/theme';

interface PageContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function PageContent({ children, style }: PageContentProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = getPageHorizontalPadding(width);

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
    maxWidth: theme.layout.pageMaxWidth,
    width: '100%',
  },
});
