import { ScrollView, StyleSheet, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentResult } from '../../assessment/types';

interface ResultScreenProps {
  result: AssessmentResult;
  onHome: () => void;
  onRestart: () => void;
}

export function ResultScreen({ result, onHome, onRestart }: ResultScreenProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.results;
  const primary = copy.archetypes[result.primary.id];
  const secondary = copy.archetypes[result.secondary.id];
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      <AppText style={styles.eyebrow}>{copy.primaryEyebrow}</AppText>
      <AppText style={styles.symbol}>{result.primary.symbol}</AppText>
      <AppText accessibilityRole="header" style={styles.title}>{primary.name}</AppText>
      <AppText style={styles.summary}>{primary.summary}</AppText>
      <AppText style={styles.description}>{primary.description}</AppText>
      <View style={styles.card}>
        <AppText style={styles.cardTitle}>{copy.strengths}</AppText>
        {primary.strengths.map((strength) => <AppText key={strength} style={styles.listItem}>• {strength}</AppText>)}
      </View>
      <View style={styles.card}>
        <AppText style={styles.cardTitle}>{copy.watchOuts}</AppText>
        {primary.watchOuts.map((watchOut) => <AppText key={watchOut} style={styles.listItem}>• {watchOut}</AppText>)}
      </View>
      <View style={styles.secondaryCard}>
        <AppText style={styles.secondaryLabel}>{copy.secondaryArchetype}</AppText>
        <AppText style={styles.secondaryTitle}>{result.secondary.symbol} {secondary.name}</AppText>
        <AppText style={styles.secondarySummary}>{secondary.summary} {secondary.description}</AppText>
      </View>
      <AppText style={styles.prototypeNote}>{copy.prototypeNote}</AppText>
      <View style={styles.actions}>
        <FocusablePressable
          accessibilityHint={copy.restartHint}
          accessibilityRole="button"
          onPress={onRestart}
          style={({ pressed }) => [styles.restartButton, pressed && styles.restartButtonPressed]}
        >
          <AppText style={styles.restartText}>{copy.restart}</AppText>
        </FocusablePressable>
        <FocusablePressable
          accessibilityHint={copy.returnHomeHint}
          accessibilityRole="button"
          onPress={onHome}
          style={({ pressed }) => [styles.homeButton, pressed && styles.restartButtonPressed]}
        >
          <AppText style={styles.homeText}>{copy.returnHome}</AppText>
        </FocusablePressable>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    container: { alignSelf: 'center', gap: theme.spacing.md, maxWidth: 720, padding: theme.spacing.lg, paddingBottom: theme.spacing.xl, width: '100%' },
    eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center' },
    symbol: { fontSize: 72, textAlign: 'center' },
    title: { color: colors.heading, fontSize: 38, fontWeight: '800', textAlign: 'center' },
    summary: { color: colors.mutedText, fontSize: 17, lineHeight: 26, textAlign: 'center' },
    description: { color: colors.text, fontSize: 16, lineHeight: 24, textAlign: 'center' },
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, gap: theme.spacing.xs, padding: theme.spacing.md },
    cardTitle: { color: colors.heading, fontSize: 18, fontWeight: '700' },
    listItem: { color: colors.mutedText, fontSize: 16, lineHeight: 23 },
    secondaryCard: { backgroundColor: colors.selection, borderRadius: theme.radius.md, gap: theme.spacing.xs, padding: theme.spacing.md },
    secondaryLabel: { color: colors.primary, fontSize: 13, fontWeight: '700' },
    secondaryTitle: { color: colors.heading, fontSize: 22, fontWeight: '800' },
    secondarySummary: { color: colors.mutedText, fontSize: 15, lineHeight: 22 },
    prototypeNote: { color: colors.mutedText, fontSize: 12, lineHeight: 18, textAlign: 'center' },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    restartButton: { alignItems: 'center', borderColor: colors.primary, borderRadius: theme.radius.md, borderWidth: 1, flex: 1, minHeight: 48, minWidth: 240, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
    restartButtonPressed: { opacity: 0.7 },
    restartText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
    homeButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: theme.radius.md, flex: 1, minHeight: 48, minWidth: 180, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
    homeText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  });
}
