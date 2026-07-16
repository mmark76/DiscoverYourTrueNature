import { useState } from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useAppearance } from '../../settings/AppearanceProvider';
import type { SemanticColors } from '../../settings/appearanceTypes';
import { useFocusVisible } from '../accessibility/useFocusVisible';
import { AppText } from './AppText';

interface ExternalTextLinkProps {
  label: string;
  url: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function ExternalTextLink({ accessibilityLabel, label, url, style, textStyle }: ExternalTextLinkProps) {
  const { colors } = useAppearance();
  const { focusVisible, hideFocus, showFocus } = useFocusVisible();
  const [hovered, setHovered] = useState(false);
  const underlined = focusVisible || hovered;
  const styles = createStyles(colors);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="link"
      hitSlop={8}
      onBlur={hideFocus}
      onFocus={showFocus}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => Linking.openURL(url)}
      style={({ pressed }) => [style, focusVisible && styles.focused, pressed && styles.pressed]}
    >
      <AppText style={[styles.label, textStyle, underlined && styles.underlined]}>{label}</AppText>
    </Pressable>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    label: { color: colors.primary, fontSize: 13, fontWeight: '700' },
    focused: { outlineColor: colors.focus, outlineOffset: -2, outlineStyle: 'solid', outlineWidth: 2 },
    pressed: { opacity: 0.65 },
    underlined: { textDecorationLine: 'underline' },
  });
}
