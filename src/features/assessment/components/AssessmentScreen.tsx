import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { assessmentGuidance } from '../../../i18n/content/assessmentGuidance';
import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';
import type {
  AssessmentOptionId,
  AssessmentQuestionId,
  AssessmentQuestionData,
} from '../data/questions';
import type { AssessmentOptionPosition } from '../types';
import { BinaryOptionCard } from './BinaryOptionCard';

interface AssessmentScreenProps {
  question: AssessmentQuestionData;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  canGoBack: boolean;
  onSelectOption: (optionId: AssessmentOptionId) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function AssessmentScreen({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  canGoBack,
  onSelectOption,
  onBack,
  onContinue,
}: AssessmentScreenProps) {
  const questionHeadingRef = useRef<View>(null);
  const { colors } = useAppearance();
  const { content, language } = useTranslation();
  const copy = content.assessment;
  const progress = questionNumber / totalQuestions;
  const counter = formatTranslation(copy.counter, { current: questionNumber, total: totalQuestions });
  const progressLabel = formatTranslation(copy.progressLabel, {
    current: questionNumber,
    total: totalQuestions,
  });
  const selectedOption = question.options.find(({ id }) => id === selectedOptionId) ?? null;
  const hasSelection = selectedOption !== null;
  const selectedLetter = selectedOption ? getOptionLetter(selectedOption.position, copy) : null;
  const isLastQuestion = questionNumber === totalQuestions;
  const contextLabel = question.context === 'personal'
    ? copy.personalContext
    : copy.professionalContext;
  const styles = createStyles(colors);

  useEffect(() => {
    questionHeadingRef.current?.focus();
  }, [question.id]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.page}>
        <View style={styles.assessment}>
          <View style={styles.progressSection}>
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
          </View>

          <View style={styles.questionSection}>
            <AppText style={styles.contextLabel}>{contextLabel}</AppText>
            <View
              accessible
              accessibilityLabel={copy.questions[question.id as AssessmentQuestionId]}
              accessibilityLiveRegion="polite"
              accessibilityRole="header"
              ref={questionHeadingRef}
              tabIndex={-1}
            >
              <AppText style={styles.question}>
                {copy.questions[question.id as AssessmentQuestionId]}
              </AppText>
            </View>
          </View>

          <AppText style={styles.guidance}>{assessmentGuidance[language]}</AppText>

          <View
            accessibilityLabel={copy.answerGroupLabel}
            accessibilityRole="radiogroup"
            style={styles.options}
          >
            {question.options.map((option) => {
              const letter = getOptionLetter(option.position, copy);
              const label = copy.options[option.id as AssessmentOptionId];
              return (
                <BinaryOptionCard
                  accessibilityHint={copy.optionHint}
                  accessibilityLabel={formatTranslation(copy.optionAccessibilityLabel, {
                    letter,
                    statement: label,
                  })}
                  key={option.id}
                  label={label}
                  letter={letter}
                  onSelect={() => onSelectOption(option.id as AssessmentOptionId)}
                  selected={option.id === selectedOptionId}
                  selectedLabel={copy.selected}
                />
              );
            })}
          </View>

          <View
            accessibilityLiveRegion="polite"
            style={[
              styles.selectionStatus,
              hasSelection ? styles.selectionStatusComplete : styles.selectionStatusRequired,
            ]}
          >
            <AppText accessibilityElementsHidden style={styles.statusSymbol}>
              {hasSelection ? '✓' : '!'}
            </AppText>
            <AppText style={styles.statusText}>
              {hasSelection ? copy.selectionComplete : copy.selectionRequired}
            </AppText>
          </View>
          <AppText accessibilityLiveRegion="polite" style={styles.srAnnouncement}>
            {selectedLetter
              ? formatTranslation(copy.selectionAnnouncement, { letter: selectedLetter })
              : copy.selectionRequired}
          </AppText>

          <View style={styles.actions}>
            <FocusablePressable
              accessibilityHint={copy.backHint}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canGoBack }}
              disabled={!canGoBack}
              onPress={onBack}
              style={({ pressed }) => [
                styles.backButton,
                !canGoBack && styles.buttonDisabled,
                pressed && canGoBack && styles.secondaryButtonPressed,
              ]}
            >
              <AppText style={[styles.backButtonText, !canGoBack && styles.buttonTextDisabled]}>
                {copy.back}
              </AppText>
            </FocusablePressable>
            <FocusablePressable
              accessibilityHint={isLastQuestion ? copy.finishHint : copy.continueHint}
              accessibilityRole="button"
              accessibilityState={{ disabled: !hasSelection }}
              disabled={!hasSelection}
              onPress={onContinue}
              style={({ pressed }) => [
                styles.continueButton,
                !hasSelection && styles.buttonDisabled,
                pressed && hasSelection && styles.primaryButtonPressed,
              ]}
            >
              <AppText style={[
                styles.continueButtonText,
                !hasSelection && styles.buttonTextDisabled,
              ]}>
                {isLastQuestion ? copy.finish : copy.continue}
              </AppText>
            </FocusablePressable>
          </View>
        </View>
      </PageContent>
    </ScrollView>
  );
}

function getOptionLetter(
  position: AssessmentOptionPosition,
  copy: { optionA: string; optionB: string },
): string {
  return position === 'a' ? copy.optionA : copy.optionB;
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    scrollContent: { flexGrow: 1 },
    page: { flexGrow: 1, paddingVertical: theme.spacing.lg },
    assessment: {
      alignSelf: 'center',
      flex: 1,
      gap: theme.spacing.lg,
      maxWidth: 760,
      minWidth: 0,
      width: '100%',
    },
    progressSection: { minWidth: 0 },
    eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
    counter: { color: colors.mutedText, fontSize: 14, marginTop: theme.spacing.sm },
    guidance: { color: colors.text, fontSize: 15, lineHeight: 23 },
    progressTrack: {
      backgroundColor: colors.progressTrack,
      borderRadius: 999,
      height: 8,
      marginTop: theme.spacing.sm,
      overflow: 'hidden',
    },
    progressFill: { backgroundColor: colors.primary, height: '100%' },
    questionSection: { gap: theme.spacing.sm, minWidth: 0 },
    contextLabel: {
      alignSelf: 'flex-start',
      backgroundColor: colors.accentMuted,
      borderColor: colors.borderStrong,
      borderRadius: 999,
      borderWidth: 1,
      color: colors.heading,
      fontSize: 13,
      fontWeight: '800',
      lineHeight: 19,
      overflow: 'hidden',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    question: { color: colors.heading, fontSize: 28, fontWeight: '700', lineHeight: 38 },
    options: { gap: theme.spacing.md, minWidth: 0, width: '100%' },
    selectionStatus: {
      alignItems: 'flex-start',
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      minWidth: 0,
      padding: theme.spacing.sm,
    },
    selectionStatusComplete: { backgroundColor: colors.successSurface, borderColor: colors.success },
    selectionStatusRequired: { backgroundColor: colors.warningSurface, borderColor: colors.warning },
    statusSymbol: { color: colors.heading, fontSize: 16, fontWeight: '900', lineHeight: 22 },
    statusText: { color: colors.text, flex: 1, fontSize: 14, lineHeight: 22, minWidth: 0 },
    srAnnouncement: { height: 1, opacity: 0, overflow: 'hidden', width: 1 },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, minWidth: 0 },
    backButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexBasis: 180,
      flexGrow: 1,
      flexShrink: 1,
      justifyContent: 'center',
      minHeight: 52,
      minWidth: 0,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    continueButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexBasis: 180,
      flexGrow: 1,
      flexShrink: 1,
      justifyContent: 'center',
      minHeight: 52,
      minWidth: 0,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    secondaryButtonPressed: { backgroundColor: colors.surfaceMuted },
    primaryButtonPressed: { backgroundColor: colors.primaryPressed, borderColor: colors.primaryPressed },
    buttonDisabled: { backgroundColor: colors.disabled, borderColor: colors.disabled },
    backButtonText: { color: colors.heading, fontSize: 16, fontWeight: '800', textAlign: 'center' },
    continueButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '800', textAlign: 'center' },
    buttonTextDisabled: { color: colors.disabledText },
  });
}
