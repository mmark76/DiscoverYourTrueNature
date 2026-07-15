import { ScrollView, StyleSheet, View } from 'react-native';

import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentResult } from '../../assessment/types';

interface ResultScreenProps { result: AssessmentResult; onRestart: () => void; }

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const { colors } = useAppearance();
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      <AppText style={styles.eyebrow}>ΤΟ ΚΥΡΙΟ ΖΩΙΚΟ ΣΟΥ ΑΡΧΕΤΥΠΟ</AppText>
      <AppText style={styles.symbol}>{result.primary.symbol}</AppText>
      <AppText style={styles.title}>{result.primary.name}</AppText>
      <AppText style={styles.summary}>{result.primary.summary}</AppText>
      <View style={styles.card}>
        <AppText style={styles.cardTitle}>Δυνατά σημεία</AppText>
        {result.primary.strengths.map((strength) => <AppText key={strength} style={styles.listItem}>• {strength}</AppText>)}
      </View>
      <View style={styles.card}>
        <AppText style={styles.cardTitle}>Σημεία προσοχής</AppText>
        {result.primary.watchOuts.map((watchOut) => <AppText key={watchOut} style={styles.listItem}>• {watchOut}</AppText>)}
      </View>
      <View style={styles.secondaryCard}>
        <AppText style={styles.secondaryLabel}>Δευτερεύον αρχέτυπο</AppText>
        <AppText style={styles.secondaryTitle}>{result.secondary.symbol} {result.secondary.name}</AppText>
        <AppText style={styles.secondarySummary}>{result.secondary.summary}</AppText>
      </View>
      <AppText style={styles.prototypeNote}>Αυτό είναι προσωρινό αποτέλεσμα από το πρώτο scoring model. Οι δικές σου δοκιμές θα καθορίσουν ποιες ερωτήσεις και περιγραφές χρειάζονται αλλαγή.</AppText>
      <FocusablePressable accessibilityRole="button" onPress={onRestart} style={({ pressed }) => [styles.restartButton, pressed && styles.restartButtonPressed]}>
        <AppText style={styles.restartText}>Κάνε ξανά το τεστ</AppText>
      </FocusablePressable>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    container: { alignSelf: 'center', gap: theme.spacing.md, maxWidth: 720, padding: theme.spacing.lg, paddingBottom: theme.spacing.xl, width: '100%' },
    eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center' },
    symbol: { fontSize: 72, textAlign: 'center' },
    title: { color: colors.text, fontSize: 38, fontWeight: '800', textAlign: 'center' },
    summary: { color: colors.mutedText, fontSize: 17, lineHeight: 26, textAlign: 'center' },
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, gap: theme.spacing.xs, padding: theme.spacing.md },
    cardTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
    listItem: { color: colors.mutedText, fontSize: 16, lineHeight: 23 },
    secondaryCard: { backgroundColor: colors.selection, borderRadius: theme.radius.md, gap: theme.spacing.xs, padding: theme.spacing.md },
    secondaryLabel: { color: colors.primary, fontSize: 13, fontWeight: '700' },
    secondaryTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
    secondarySummary: { color: colors.mutedText, fontSize: 15, lineHeight: 22 },
    prototypeNote: { color: colors.mutedText, fontSize: 12, lineHeight: 18, textAlign: 'center' },
    restartButton: { alignItems: 'center', borderColor: colors.primary, borderRadius: theme.radius.md, borderWidth: 1, minHeight: 48, paddingVertical: theme.spacing.md },
    restartButtonPressed: { opacity: 0.7 },
    restartText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  });
}
