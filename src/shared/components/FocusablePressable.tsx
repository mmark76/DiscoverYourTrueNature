import { Pressable, PressableProps } from 'react-native';

import { useAppearance } from '../../settings/AppearanceProvider';
import { useFocusVisible } from '../accessibility/useFocusVisible';

export function FocusablePressable({ onBlur, onFocus, style, ...props }: PressableProps) {
  const { colors } = useAppearance();
  const { focusVisible, hideFocus, showFocus } = useFocusVisible();

  return (
    <Pressable
      {...props}
      onBlur={(event) => {
        hideFocus();
        onBlur?.(event);
      }}
      onFocus={(event) => {
        showFocus();
        onFocus?.(event);
      }}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        focusVisible && {
          outlineColor: colors.focus,
          outlineOffset: -2,
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      ]}
    />
  );
}
