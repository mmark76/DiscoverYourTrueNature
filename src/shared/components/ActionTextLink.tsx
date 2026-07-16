import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useAppearance } from '../../settings/AppearanceProvider';
import type { SemanticColors } from '../../settings/appearanceTypes';
import { useFocusVisible } from '../accessibility/useFocusVisible';
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
  const { focusVisible, hideFocus, showFocus } = useFocusVisible();
  const [hovered, setHovered] = useState(false);
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
      onPress={onPress}
      style={({ pressed }) => [style, focusVisible && styles.focused, pressed && styles.pressed]}
    >
      <AppText style={[styles.label, textStyle, (focusVisible || hovered) && styles.underlined]}>
        {label}
      </AppText>
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
