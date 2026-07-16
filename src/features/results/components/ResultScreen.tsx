import { ScrollView, StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentResult } from '../../assessment/types';
import { ResultRanking } from './ResultRanking';

interface ResultScreenProps {
  result: AssessmentResult;
  onHome: () => void;
  onRestart: () => void;
}
export function ResultScreen({ result, onHome, onRestart }: ResultScreenProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.results;
  const primary = copy.archetypes[result.primary.archetype.id];
  const secondary = copy.archetypes[result.secondary.archetype.id];
  const primaryMatchLabel = formatTranslation(copy.matchStrengthAccessibility, {
    name: primary.name,
    score: result.primary.score,
  });
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      <AppText style={styles.eyebrow}>{copy.primaryEyebrow}</AppText>
      <AppText accessibilityElementsHidden style={styles.symbol}>{result.primary.archetype.symbol}</AppText>
      <AppText accessibilityRole="header" style={styles.title}>{primary.name}</AppText>
      <View accessibilityLabel={primaryMatchLabel} style={styles.matchStrength}>
        <AppText style={styles.matchLabel}>{copy.matchStrength}</AppText>
        <AppText style={styles.matchScore}>{result.primary.score}%</AppText>
      </View>
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
        <AppText style={styles.secondaryLabel}>{copy.secondaryInfluence}</AppText>
        <AppText style={styles.secondaryTitle}>{result.secondary.archetype.symbol} {secondary.name} · {result.secondary.score}%</AppText>
        <AppText style={styles.secondarySummary}>{secondary.summary} {secondary.description}</AppText>
      </View>
      <ResultRanking matches={result.matches} />
      <View style={styles.modelNote}>
        <AppText accessibilityRole="header" style={styles.modelTitle}>{copy.entertainmentModel}</AppText>
        <AppText style={styles.modelText}>{copy.modelExplanation}</AppText>
      </View>
      <View style={styles.actions}>
        <FocusablePressable accessibilityHint={copy.restartHint} accessibilityRole="button" onPress={onRestart} style={({ pressed }) => [styles.restartButton, pressed && styles.buttonPressed]}>
          <AppText style={styles.restartText}>{copy.restart}</AppText>
        </FocusablePressable>
        <FocusablePressable accessibilityHint={copy.returnHomeHint} accessibilityRole="button" onPress={onHome} style={({ pressed }) => [styles.homeButton, pressed && styles.buttonPressed]}>
          <AppText style={styles.homeText}>{copy.returnHome}</AppText>
        </FocusablePressable>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    container: { alignSelf: 'center', gap: theme.spacing.md, maxWidth: 760, padding: theme.spacing.lg, paddingBottom: theme.spacing.xl, width: '100%' },
    eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center' },
    symbol: { fontSize: 72, textAlign: 'center' },
    title: { color: colors.heading, fontSize: 38, fontWeight: '800', textAlign: 'center' },
    matchStrength: { alignItems: 'baseline', alignSelf: 'center', flexDirection: 'row', gap: theme.spacing.xs },
    matchLabel: { color: colors.mutedText, fontSize: 14, fontWeight: '700' },
    matchScore: { color: colors.primary, fontSize: 22, fontWeight: '900' },
    summary: { color: colors.mutedText, fontSize: 17, lineHeight: 26, textAlign: 'center' },
    description: { color: colors.text, fontSize: 16, lineHeight: 24, textAlign: 'center' },
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, gap: theme.spacing.xs, padding: theme.spacing.md },
    cardTitle: { color: colors.heading, fontSize: 18, fontWeight: '700' },
    listItem: { color: colors.text, fontSize: 16, lineHeight: 23 },
    secondaryCard: { backgroundColor: colors.selection, borderRadius: theme.radius.md, gap: theme.spacing.xs, padding: theme.spacing.md },
    secondaryLabel: { color: colors.primary, fontSize: 13, fontWeight: '700' },
    secondaryTitle: { color: colors.heading, fontSize: 22, fontWeight: '800' },
    secondarySummary: { color: colors.text, fontSize: 15, lineHeight: 22 },
    modelNote: { backgroundColor: colors.warningSurface, borderRadius: theme.radius.md, gap: theme.spacing.xs, padding: theme.spacing.md },
    modelTitle: { color: colors.heading, fontSize: 16, fontWeight: '800' },
    modelText: { color: colors.text, fontSize: 13, lineHeight: 20 },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    restartButton: { alignItems: 'center', borderColor: colors.primary, borderRadius: theme.radius.md, borderWidth: 1, flex: 1, minHeight: 48, minWidth: 240, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
    buttonPressed: { opacity: 0.7 },
    restartText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
    homeButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: theme.radius.md, flex: 1, minHeight: 48, minWidth: 180, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
    homeText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  });
}
