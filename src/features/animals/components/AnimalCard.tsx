import { StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { theme } from '../../../shared/styles/theme';
import type { ProvisionalAnimalData } from '../data/animals';

interface AnimalCardProps { animal: ProvisionalAnimalData; index: number; width: `${number}%`; }

export function AnimalCard({ animal, index, width }: AnimalCardProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const available = animal.availability === 'prototype';
  const copy = content.animals.records[animal.id];
  const availability = available
    ? content.common.availablePrototype
    : content.common.informationalOnly;
  const accessibilityLabel = formatTranslation(content.animals.cardAccessibility, {
    availability,
    name: copy.name,
  });
  const styles = createStyles(colors);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, { width }, !available && styles.informationalCard]}
    >
      <View style={styles.heading}>
        <View style={[styles.number, available && styles.numberAvailable]}>
          <AppText style={[styles.numberText, available && styles.numberTextAvailable]}>{index + 1}</AppText>
        </View>
        <AppText accessibilityRole="header" style={styles.name}>{copy.name}</AppText>
      </View>
      <AppText style={styles.traits}>{copy.traits}</AppText>
      <AppText style={styles.description}>{copy.description}</AppText>
      <StatusBadge
        label={availability}
        tone={available ? 'available' : 'informational'}
      />
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, gap: theme.spacing.md, minHeight: 190, padding: theme.spacing.lg },
    informationalCard: { backgroundColor: colors.surfaceMuted },
    heading: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    number: { alignItems: 'center', backgroundColor: colors.backgroundMuted, borderRadius: 999, height: 38, justifyContent: 'center', width: 38 },
    numberAvailable: { backgroundColor: colors.primary },
    numberText: { color: colors.mutedText, fontSize: 13, fontWeight: '800' },
    numberTextAvailable: { color: colors.onPrimary },
    name: { color: colors.heading, flexShrink: 1, fontSize: 22, fontWeight: '800' },
    traits: { color: colors.mutedText, flex: 1, fontSize: 15, lineHeight: 23 },
    description: { color: colors.text, fontSize: 14, lineHeight: 21 },
  });
}
