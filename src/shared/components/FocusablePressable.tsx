import { useState } from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

import { theme } from '../styles/theme';

export function FocusablePressable({ onBlur, onFocus, style, ...props }: PressableProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      {...props}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        focused && styles.focused,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  focused: {
    outlineColor: theme.colors.accent,
    outlineStyle: 'solid',
    outlineWidth: 3,
  },
});
