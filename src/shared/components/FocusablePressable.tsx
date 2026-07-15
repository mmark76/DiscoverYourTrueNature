import { useState } from 'react';
import { Pressable, PressableProps } from 'react-native';

import { useAppearance } from '../../settings/AppearanceProvider';

export function FocusablePressable({ onBlur, onFocus, style, ...props }: PressableProps) {
  const { colors } = useAppearance();
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
        focused && {
          outlineColor: colors.focus,
          outlineStyle: 'solid',
          outlineWidth: 3,
        },
      ]}
    />
  );
}
