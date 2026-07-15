import { StyleSheet, View } from 'react-native';

import { AppText } from '../../shared/components/AppText';
import { FocusablePressable } from '../../shared/components/FocusablePressable';
import { useAppearance } from '../AppearanceProvider';
import type { SemanticColors } from '../appearanceTypes';

interface SettingsOption<T extends string> {
  label: string;
  value: T;
}

interface SettingsOptionGroupProps<T extends string> {
  label: string;
  onSelect: (value: T) => void;
  options: readonly SettingsOption<T>[];
  selectedValue: T;
}

export function SettingsOptionGroup<T extends string>({
  label,
  onSelect,
  options,
  selectedValue,
}: SettingsOptionGroupProps<T>) {
  const { colors } = useAppearance();
  const styles = createStyles(colors);

  return (
    <View accessibilityLabel={label} style={styles.group}>
      <AppText accessibilityRole="header" style={styles.groupLabel}>
        {label}
      </AppText>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option.value === selectedValue;
          return (
            <FocusablePressable
              key={option.value}
              accessibilityLabel={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <AppText style={[styles.optionIndicator, selected && styles.optionIndicatorSelected]}>
                {selected ? '✓' : '○'}
              </AppText>
              <AppText style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {option.label}
              </AppText>
            </FocusablePressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    group: { gap: 10 },
    groupLabel: { color: colors.text, fontSize: 16, fontWeight: '800' },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    option: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 7,
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    optionSelected: { backgroundColor: colors.selection, borderColor: colors.primary, borderWidth: 2 },
    optionPressed: { opacity: 0.72 },
    optionIndicator: { color: colors.mutedText, fontSize: 16, fontWeight: '800' },
    optionIndicatorSelected: { color: colors.primary },
    optionLabel: { color: colors.text, fontSize: 14, fontWeight: '700' },
    optionLabelSelected: { color: colors.primary },
  });
}
