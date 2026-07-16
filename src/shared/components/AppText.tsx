import { StyleSheet, Text } from 'react-native';
import type { TextProps, TextStyle } from 'react-native';

import { useAppearance } from '../../settings/AppearanceProvider';

export function AppText({ style, ...props }: TextProps) {
  const { typography } = useAppearance();
  const flattenedStyle = StyleSheet.flatten(style) ?? {};
  const scaledStyle: TextStyle = {
    fontFamily: typography.fontFamily,
  };

  if (typeof flattenedStyle.fontSize === 'number') {
    scaledStyle.fontSize = flattenedStyle.fontSize * typography.scale;
  }

  if (typeof flattenedStyle.lineHeight === 'number') {
    scaledStyle.lineHeight = flattenedStyle.lineHeight * typography.scale;
  }

  const currentLetterSpacing =
    typeof flattenedStyle.letterSpacing === 'number' ? flattenedStyle.letterSpacing : 0;
  if (currentLetterSpacing !== 0 || typography.letterSpacing !== 0) {
    scaledStyle.letterSpacing = currentLetterSpacing + typography.letterSpacing;
  }

  return <Text {...props} style={[style, scaledStyle]} />;
}
