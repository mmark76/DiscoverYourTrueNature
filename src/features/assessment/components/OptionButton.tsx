import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../../../shared/styles/theme';

interface OptionButtonProps {
  label: string;
  onPress: () => void;
}

export function OptionButton({ label, onPress }: OptionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  buttonPressed: {
    opacity: 0.72,
  },
  label: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 24,
  },
});
