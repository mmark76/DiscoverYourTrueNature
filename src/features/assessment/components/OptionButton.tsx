import { StyleSheet } from 'react-native';

import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';

interface OptionButtonProps { label: string; onPress: () => void; }

export function OptionButton({ label, onPress }: OptionButtonProps) {
  const { colors } = useAppearance();
  const styles = createStyles(colors);

  return (
    <FocusablePressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <AppText style={styles.label}>{label}</AppText>
    </FocusablePressable>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    button: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, minHeight: 52, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
    buttonPressed: { opacity: 0.72 },
    label: { color: colors.text, fontSize: 17, lineHeight: 24 },
  });
}
