import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useAppearance } from '../../settings/AppearanceProvider';
import type { SemanticColors } from '../../settings/appearanceTypes';
import { AppText } from './AppText';

interface ActionTextLinkProps {
  accessibilityLabel?: string;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function ActionTextLink({ accessibilityLabel, label, onPress, style, textStyle }: ActionTextLinkProps) {
  const { colors } = useAppearance();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const styles = createStyles(colors);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="link"
      hitSlop={8}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [style, focused && styles.focused, pressed && styles.pressed]}
    >
      <AppText style={[styles.label, textStyle, (focused || hovered) && styles.underlined]}>
        {label}
      </AppText>
    </Pressable>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    label: { color: colors.primary, fontSize: 13, fontWeight: '700' },
    focused: { outlineColor: colors.focus, outlineStyle: 'solid', outlineWidth: 2 },
    pressed: { opacity: 0.65 },
    underlined: { textDecorationLine: 'underline' },
  });
}
