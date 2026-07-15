import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { theme } from '../styles/theme';

interface ExternalTextLinkProps {
  label: string;
  url: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function ExternalTextLink({ label, url, style, textStyle }: ExternalTextLinkProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const underlined = focused || hovered;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="link"
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => Linking.openURL(url)}
      style={({ pressed }) => [style, focused && styles.focused, pressed && styles.pressed]}
    >
      <Text style={[styles.label, textStyle, underlined && styles.underlined]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  focused: {
    outlineColor: theme.colors.accent,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  pressed: {
    opacity: 0.65,
  },
  underlined: {
    textDecorationLine: 'underline',
  },
});
