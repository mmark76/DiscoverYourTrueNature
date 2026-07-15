import { StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '../../../shared/components/StatusBadge';
import { theme } from '../../../shared/styles/theme';
import { ProvisionalAnimal } from '../data/animals';

interface AnimalCardProps {
  animal: ProvisionalAnimal;
  index: number;
  width: `${number}%`;
}

export function AnimalCard({ animal, index, width }: AnimalCardProps) {
  const available = animal.availability === 'prototype';

  return (
    <View style={[styles.card, { width }, !available && styles.comingSoonCard]}>
      <View style={styles.heading}>
        <View style={[styles.number, available && styles.numberAvailable]}>
          <Text style={[styles.numberText, available && styles.numberTextAvailable]}>{index + 1}</Text>
        </View>
        <Text accessibilityRole="header" style={styles.name}>
          {animal.name}
        </Text>
      </View>
      <Text style={styles.traits}>{animal.traits}</Text>
      <StatusBadge
        label={available ? 'Διαθέσιμο στο prototype' : 'Προσεχώς'}
        tone={available ? 'available' : 'soon'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    minHeight: 190,
    padding: theme.spacing.lg,
  },
  comingSoonCard: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  number: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundMuted,
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  numberAvailable: {
    backgroundColor: theme.colors.primary,
  },
  numberText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  numberTextAvailable: {
    color: '#FFFFFF',
  },
  name: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  traits: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
  },
});
