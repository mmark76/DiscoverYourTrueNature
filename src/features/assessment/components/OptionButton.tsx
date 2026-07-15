import { StyleSheet, View } from 'react-native';

import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';

interface OptionButtonProps { label: string; onPress: () => void; selectionRank?: 1 | 2; }

export function OptionButton({ label, onPress, selectionRank }: OptionButtonProps) {
  const { colors } = useAppearance();
  const isSelected = selectionRank !== undefined;
  const styles = createStyles(colors);

  return (
    <FocusablePressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [styles.button, isSelected && styles.buttonSelected, pressed && styles.buttonPressed]}
    >
      <View style={styles.content}>
        <AppText style={[styles.label, isSelected && styles.labelSelected]}>{label}</AppText>
        {selectionRank && (
          <AppText style={styles.rankLabel}>{selectionRank === 1 ? 'Κύρια επιλογή' : 'Δευτερεύουσα'}</AppText>
        )}
      </View>
    </FocusablePressable>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    button: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, minHeight: 52, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
    buttonPressed: { opacity: 0.72 },
    buttonSelected: { backgroundColor: colors.selection, borderColor: colors.primary, borderWidth: 2 },
    content: { gap: theme.spacing.xs },
    label: { color: colors.text, fontSize: 17, lineHeight: 24 },
    labelSelected: { fontWeight: '700' },
    rankLabel: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  });
}
