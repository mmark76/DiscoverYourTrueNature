import { StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { theme } from '../../../shared/styles/theme';
import type { AnimalData } from '../data/animals';

interface AnimalCardProps {
  animal: AnimalData;
  isPrimary?: boolean;
  isSecondary?: boolean;
  width: `${number}%`;
}

export function AnimalCard({
  animal,
  isPrimary = false,
  isSecondary = false,
  width,
}: AnimalCardProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.animals.records[animal.id];
  const indicators = [
    isPrimary ? content.animals.primaryIndicator : '',
    isSecondary ? content.animals.secondaryIndicator : '',
  ].filter(Boolean).join('. ');
  const accessibilityLabel = formatTranslation(content.animals.cardAccessibility, {
    name: copy.name,
    description: copy.description,
    indicator: indicators,
  });
  const styles = createStyles(colors);

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[styles.card, { width }]}>
      {(isPrimary || isSecondary) && (
        <View style={styles.indicators}>
          {isPrimary && (
            <View style={[styles.indicator, styles.primaryIndicator]}>
              <AppText accessibilityElementsHidden style={styles.indicatorSymbol}>★</AppText>
              <AppText style={styles.indicatorText}>{content.animals.primaryIndicator}</AppText>
            </View>
          )}
          {isSecondary && (
            <View style={[styles.indicator, styles.secondaryIndicator]}>
              <AppText accessibilityElementsHidden style={styles.indicatorSymbol}>◇</AppText>
              <AppText style={styles.indicatorText}>{content.animals.secondaryIndicator}</AppText>
            </View>
          )}
        </View>
      )}
      <View style={styles.heading}>
        <AppText accessibilityElementsHidden style={styles.symbol}>{animal.symbol}</AppText>
        <AppText accessibilityRole="header" style={styles.name}>{copy.name}</AppText>
      </View>
      <AppText style={styles.tagline}>{copy.tagline}</AppText>
      <AppText style={styles.description}>{copy.description}</AppText>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.sm,
      minHeight: 230,
      minWidth: 0,
      padding: theme.spacing.lg,
    },
    indicators: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
    indicator: {
      alignItems: 'center',
      borderRadius: 999,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 5,
    },
    primaryIndicator: { backgroundColor: colors.successSurface, borderColor: colors.success },
    secondaryIndicator: { backgroundColor: colors.selection, borderColor: colors.borderStrong },
    indicatorSymbol: { color: colors.heading, fontSize: 13, fontWeight: '900' },
    indicatorText: { color: colors.heading, fontSize: 12, fontWeight: '800', lineHeight: 17 },
    heading: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    symbol: { fontSize: 31, lineHeight: 38 },
    name: { color: colors.heading, flexShrink: 1, fontSize: 24, fontWeight: '900', lineHeight: 31 },
    tagline: { color: colors.primary, fontSize: 15, fontWeight: '800', lineHeight: 22 },
    description: { color: colors.text, fontSize: 14, lineHeight: 22 },
  });
}
