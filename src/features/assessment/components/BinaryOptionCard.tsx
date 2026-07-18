import { StyleSheet, View } from 'react-native';

import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';

interface BinaryOptionCardProps {
  accessibilityHint: string;
  accessibilityLabel: string;
  label: string;
  letter: string;
  onSelect: () => void;
  selected: boolean;
  selectedLabel: string;
}

export function BinaryOptionCard({
  accessibilityHint,
  accessibilityLabel,
  label,
  letter,
  onSelect,
  selected,
  selectedLabel,
}: BinaryOptionCardProps) {
  const { colors } = useAppearance();
  const styles = createStyles(colors);

  return (
    <FocusablePressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View accessibilityElementsHidden style={[styles.letterBadge, selected && styles.letterBadgeSelected]}>
        <AppText style={[styles.letter, selected && styles.letterSelected]}>{letter}</AppText>
      </View>
      <AppText style={[styles.label, selected && styles.labelSelected]}>{label}</AppText>
      {selected && (
        <View accessibilityElementsHidden style={styles.selectedBadge}>
          <AppText style={styles.selectedMark}>✓</AppText>
          <AppText style={styles.selectedText}>{selectedLabel}</AppText>
        </View>
      )}
    </FocusablePressable>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    card: {
      alignItems: 'flex-start',
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.md,
      borderWidth: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      minHeight: 88,
      minWidth: 0,
      padding: theme.spacing.md,
      width: '100%',
    },
    cardSelected: {
      backgroundColor: colors.selection,
      borderColor: colors.primary,
      borderWidth: 4,
      padding: theme.spacing.md - 2,
    },
    cardPressed: { opacity: 0.72 },
    letterBadge: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.borderStrong,
      borderRadius: 999,
      borderWidth: 2,
      flexShrink: 0,
      justifyContent: 'center',
      minHeight: 52,
      minWidth: 52,
    },
    letterBadgeSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    letter: {
      color: colors.heading,
      fontSize: 20,
      fontWeight: '900',
      lineHeight: 26,
      textAlign: 'center',
    },
    letterSelected: { color: colors.onPrimary },
    label: {
      color: colors.text,
      flex: 1,
      flexBasis: 240,
      flexShrink: 1,
      fontSize: 17,
      lineHeight: 26,
      minWidth: 0,
      paddingVertical: theme.spacing.sm,
    },
    labelSelected: { color: colors.heading, fontWeight: '700' },
    selectedBadge: {
      alignItems: 'center',
      alignSelf: 'center',
      borderColor: colors.primary,
      borderRadius: 999,
      borderWidth: 1,
      flexDirection: 'row',
      flexShrink: 0,
      gap: theme.spacing.xs,
      minHeight: 32,
      paddingHorizontal: theme.spacing.sm,
    },
    selectedMark: { color: colors.primary, fontSize: 16, fontWeight: '900', lineHeight: 20 },
    selectedText: { color: colors.heading, fontSize: 13, fontWeight: '900', lineHeight: 18 },
  });
}
