import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentQuestionData } from '../data/questions';
import { OptionButton } from './OptionButton';

interface AssessmentScreenProps {
  question: AssessmentQuestionData;
  questionNumber: number;
  totalQuestions: number;
  onSelect: (questionId: string, optionId: string) => void;
}

export function AssessmentScreen({ question, questionNumber, totalQuestions, onSelect }: AssessmentScreenProps) {
  const questionHeadingRef = useRef<View>(null);
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

  useEffect(() => {
    questionHeadingRef.current?.focus();
  }, [question.id]);

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      <View>
        <AppText style={styles.eyebrow}>{copy.eyebrow}</AppText>
        <AppText accessibilityLiveRegion="polite" style={styles.counter}>{counter}</AppText>
        <View
          accessibilityLabel={progressLabel}
          accessibilityRole="progressbar"
          accessibilityValue={{ max: totalQuestions, min: 1, now: questionNumber }}
          style={styles.progressTrack}
        >
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        {questionNumber === 1 && (
          <AppText style={styles.introduction}>{copy.introduction}</AppText>
        )}
      </View>
      <View
        accessible
        accessibilityLabel={copy.questions[question.id]}
        accessibilityLiveRegion="polite"
        accessibilityRole="header"
        ref={questionHeadingRef}
        tabIndex={-1}
      >
        <AppText style={styles.question}>{copy.questions[question.id]}</AppText>
      </View>
      <View style={styles.options}>
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            label={copy.options[option.id]}
            onPress={() => onSelect(question.id, option.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    container: { alignSelf: 'center', flexGrow: 1, gap: theme.spacing.lg, justifyContent: 'space-between', maxWidth: 720, padding: theme.spacing.lg, width: '100%' },
    eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
    counter: { color: colors.mutedText, fontSize: 14, marginTop: theme.spacing.sm },
    introduction: { color: colors.text, fontSize: 15, lineHeight: 23, marginTop: theme.spacing.md },
    progressTrack: { backgroundColor: colors.progressTrack, borderRadius: 999, height: 8, marginTop: theme.spacing.sm, overflow: 'hidden' },
    progressFill: { backgroundColor: colors.primary, height: '100%' },
    question: { color: colors.heading, fontSize: 28, fontWeight: '700', lineHeight: 36 },
    options: { gap: theme.spacing.sm },
  });
}
