import { StyleSheet, Text, View } from 'react-native';

import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';

interface OptionButtonProps {
  label: string;
  onPress: () => void;
  selectionRank?: 1 | 2;
}

export function OptionButton({ label, onPress, selectionRank }: OptionButtonProps) {
  const isSelected = selectionRank !== undefined;

  return (
    <FocusablePressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSelected && styles.buttonSelected,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
        {selectionRank && (
          <Text style={styles.rankLabel}>
            {selectionRank === 1 ? 'Κύρια επιλογή' : 'Δευτερεύουσα'}
          </Text>
        )}
      </View>
    </FocusablePressable>
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
  buttonSelected: {
    backgroundColor: '#E4EEE9',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  content: {
    gap: theme.spacing.xs,
  },
  label: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 24,
  },
  labelSelected: {
    fontWeight: '700',
  },
  rankLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
