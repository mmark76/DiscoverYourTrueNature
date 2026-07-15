import { ScrollView, StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentQuestionData } from '../data/questions';
import type { ScoreMap } from '../types';
import { OptionButton } from './OptionButton';

interface AssessmentScreenProps {
  question: AssessmentQuestionData;
  questionNumber: number;
  totalQuestions: number;
  onSelect: (scores: ScoreMap) => void;
}

export function AssessmentScreen({ question, questionNumber, totalQuestions, onSelect }: AssessmentScreenProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.assessment;
  const progress = questionNumber / totalQuestions;
  const counter = formatTranslation(copy.counter, { current: questionNumber, total: totalQuestions });
  const progressLabel = formatTranslation(copy.progressLabel, {
    current: questionNumber,
    total: totalQuestions,
  });
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      <View>
        <AppText style={styles.eyebrow}>{copy.eyebrow}</AppText>
        <AppText style={styles.counter}>{counter}</AppText>
        <View
          accessibilityLabel={progressLabel}
          accessibilityRole="progressbar"
          accessibilityValue={{ max: totalQuestions, min: 1, now: questionNumber }}
          style={styles.progressTrack}
        >
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
      <AppText accessibilityRole="header" style={styles.question}>
        {copy.questions[question.id]}
      </AppText>
      <View style={styles.options}>
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            label={copy.options[option.id]}
            onPress={() => onSelect(option.scores)}
          />
        ))}
      </View>
      <AppText style={styles.note}>{copy.instruction}</AppText>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    container: { alignSelf: 'center', flexGrow: 1, gap: theme.spacing.lg, justifyContent: 'space-between', maxWidth: 720, padding: theme.spacing.lg, width: '100%' },
    eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
    counter: { color: colors.mutedText, fontSize: 14, marginTop: theme.spacing.sm },
    progressTrack: { backgroundColor: colors.progressTrack, borderRadius: 999, height: 8, marginTop: theme.spacing.sm, overflow: 'hidden' },
    progressFill: { backgroundColor: colors.primary, height: '100%' },
    question: { color: colors.text, fontSize: 28, fontWeight: '700', lineHeight: 36 },
    options: { gap: theme.spacing.sm },
    note: { color: colors.mutedText, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  });
}
