import { StyleSheet, View } from 'react-native';

import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { theme } from '../../../shared/styles/theme';
import type { ProvisionalAnimal } from '../data/animals';

interface AnimalCardProps { animal: ProvisionalAnimal; index: number; width: `${number}%`; }

export function AnimalCard({ animal, index, width }: AnimalCardProps) {
  const { colors, translate } = useAppearance();
  const available = animal.availability === 'prototype';
  const styles = createStyles(colors);

  return (
    <View style={[styles.card, { width }, !available && styles.comingSoonCard]}>
      <View style={styles.heading}>
        <View style={[styles.number, available && styles.numberAvailable]}>
          <AppText style={[styles.numberText, available && styles.numberTextAvailable]}>{index + 1}</AppText>
        </View>
        <AppText accessibilityRole="header" style={styles.name}>{animal.name}</AppText>
      </View>
      <AppText style={styles.traits}>{animal.traits}</AppText>
      <StatusBadge
        label={available ? 'Διαθέσιμο στο prototype' : translate('comingSoon')}
        tone={available ? 'available' : 'soon'}
      />
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, gap: theme.spacing.md, minHeight: 190, padding: theme.spacing.lg },
    comingSoonCard: { backgroundColor: colors.surfaceMuted },
    heading: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    number: { alignItems: 'center', backgroundColor: colors.backgroundMuted, borderRadius: 999, height: 38, justifyContent: 'center', width: 38 },
    numberAvailable: { backgroundColor: colors.primary },
    numberText: { color: colors.mutedText, fontSize: 13, fontWeight: '800' },
    numberTextAvailable: { color: colors.onPrimary },
    name: { color: colors.text, flexShrink: 1, fontSize: 22, fontWeight: '800' },
    traits: { color: colors.mutedText, flex: 1, fontSize: 15, lineHeight: 23 },
  });
}
