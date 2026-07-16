import { StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { theme } from '../../../shared/styles/theme';
import type { AnimalData } from '../data/animals';

interface AnimalCardProps { animal: AnimalData; index: number; width: `${number}%`; }

export function AnimalCard({ animal, index, width }: AnimalCardProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.animals.records[animal.id];
  const accessibilityLabel = formatTranslation(content.animals.cardAccessibility, {
    name: copy.name,
  });
  const styles = createStyles(colors);

  return (
    <View accessibilityLabel={accessibilityLabel} style={[styles.card, { width }]}>
      <View style={styles.heading}>
        <View style={styles.number}>
          <AppText style={styles.numberText}>{index + 1}</AppText>
        </View>
        <AppText accessibilityElementsHidden style={styles.symbol}>{animal.symbol}</AppText>
        <AppText accessibilityRole="header" style={styles.name}>{copy.name}</AppText>
      </View>
      <AppText style={styles.traits}>{copy.traits}</AppText>
      <AppText style={styles.description}>{copy.description}</AppText>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, gap: theme.spacing.md, minHeight: 190, padding: theme.spacing.lg },
    heading: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    number: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 999, height: 38, justifyContent: 'center', width: 38 },
    numberText: { color: colors.onPrimary, fontSize: 13, fontWeight: '800' },
    symbol: { fontSize: 25 },
    name: { color: colors.heading, flexShrink: 1, fontSize: 22, fontWeight: '800' },
    traits: { color: colors.mutedText, flex: 1, fontSize: 15, lineHeight: 23 },
    description: { color: colors.text, fontSize: 14, lineHeight: 21 },
  });
}
