import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AssessmentResult } from '../../assessment/types';
import { theme } from '../../../shared/styles/theme';

interface ResultScreenProps {
  result: AssessmentResult;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>ΤΟ ΚΥΡΙΟ ΖΩΙΚΟ ΣΟΥ ΑΡΧΕΤΥΠΟ</Text>
      <Text style={styles.symbol}>{result.primary.symbol}</Text>
      <Text style={styles.title}>{result.primary.name}</Text>
      <Text style={styles.summary}>{result.primary.summary}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Δυνατά σημεία</Text>
        {result.primary.strengths.map((strength) => (
          <Text key={strength} style={styles.listItem}>• {strength}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Σημεία προσοχής</Text>
        {result.primary.watchOuts.map((watchOut) => (
          <Text key={watchOut} style={styles.listItem}>• {watchOut}</Text>
        ))}
      </View>

      <View style={styles.secondaryCard}>
        <Text style={styles.secondaryLabel}>Δευτερεύον αρχέτυπο</Text>
        <Text style={styles.secondaryTitle}>
          {result.secondary.symbol} {result.secondary.name}
        </Text>
        <Text style={styles.secondarySummary}>{result.secondary.summary}</Text>
      </View>

      <Text style={styles.prototypeNote}>
        Αυτό είναι προσωρινό αποτέλεσμα από το πρώτο scoring model. Οι δικές σου δοκιμές θα
        καθορίσουν ποιες ερωτήσεις και περιγραφές χρειάζονται αλλαγή.
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={onRestart}
        style={({ pressed }) => [styles.restartButton, pressed && styles.restartButtonPressed]}
      >
        <Text style={styles.restartText}>Κάνε ξανά το τεστ</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  symbol: {
    fontSize: 72,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'center',
  },
  summary: {
    color: theme.colors.muted,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  listItem: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  secondaryCard: {
    backgroundColor: '#E6EEE9',
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  secondaryLabel: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  secondarySummary: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  prototypeNote: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  restartButton: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.md,
  },
  restartButtonPressed: {
    opacity: 0.7,
  },
  restartText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
