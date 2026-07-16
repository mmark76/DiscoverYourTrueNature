import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

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
import {
  assignRank as assignRankToDraft,
  isCompleteRanking,
  type RankingDraft,
} from '../services/ranking';
import type { AssessmentRank } from '../types';
import { assessmentRankOrder, RankingOptionCard } from './RankingOptionCard';

interface AssessmentScreenProps {
  question: AssessmentQuestionData;
  questionNumber: number;
  totalQuestions: number;
  rankings: RankingDraft;
  canGoBack: boolean;
  onRankingsChange: (rankings: RankingDraft) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function AssessmentScreen({
  question,
  questionNumber,
  totalQuestions,
  rankings,
  canGoBack,
  onRankingsChange,
  onBack,
  onContinue,
}: AssessmentScreenProps) {
  const questionHeadingRef = useRef<View>(null);
  const [showIncompleteError, setShowIncompleteError] = useState(false);
  const [rankAnnouncement, setRankAnnouncement] = useState('');
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.assessment;
  const progress = questionNumber / totalQuestions;
  const counter = formatTranslation(copy.counter, { current: questionNumber, total: totalQuestions });
  const progressLabel = formatTranslation(copy.progressLabel, {
    current: questionNumber,
    total: totalQuestions,
  });
  const rankingByOption = useMemo(() => new Map(Object.entries(rankings)), [rankings]);
  const rankingComplete = isCompleteRanking(question, rankings);
  const isLastQuestion = questionNumber === totalQuestions;
  const styles = createStyles(colors);

  useEffect(() => {
    questionHeadingRef.current?.focus();
    setShowIncompleteError(false);
    setRankAnnouncement('');
  }, [question.id]);

  useEffect(() => {
    if (rankingComplete) {
      setShowIncompleteError(false);
      setRankAnnouncement(copy.rankingComplete);
    }
  }, [copy.rankingComplete, rankingComplete]);

  function assignRank(optionId: AssessmentOptionId, rank: AssessmentRank) {
    const currentRank = rankings[optionId];
    const update = assignRankToDraft(rankings, optionId, rank);

    if (update.behavior === 'swapped') {
      setRankAnnouncement(formatTranslation(copy.rankSwappedAnnouncement, {
        rank,
        previousRank: currentRank ?? rank,
      }));
    } else if (update.behavior === 'moved') {
      setRankAnnouncement(formatTranslation(copy.rankMovedAnnouncement, { rank }));
    } else {
      setRankAnnouncement(formatTranslation(copy.rankAssignedAnnouncement, { rank }));
    }

    onRankingsChange(update.rankings);
  }

  function continueAssessment() {
    if (!rankingComplete) {
      setShowIncompleteError(true);
      setRankAnnouncement(copy.incompleteError);
      return;
    }

    onContinue();
  }

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
            {questionNumber === 1 && (
              <AppText style={styles.introduction}>{copy.introduction}</AppText>
            )}
          </View>

          <View style={styles.guide}>
            <AppText accessibilityRole="header" style={styles.guideTitle}>
              {copy.rankingGuideTitle}
            </AppText>
            <View style={styles.guideItems}>
              {assessmentRankOrder.map((rank) => (
                <View key={rank} style={styles.guideItem}>
                  <AppText style={styles.guideRank}>{rank}</AppText>
                  <AppText style={styles.guideMeaning}>{copy.rankingGuide[rank]}</AppText>
                </View>
              ))}
            </View>
          </View>

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

          <View style={styles.options}>
            {question.options.map((option) => (
              <RankingOptionCard
                key={option.id}
                assignedRank={rankingByOption.get(option.id)}
                label={copy.options[option.id as AssessmentOptionId]}
                rankControlHint={copy.rankControlHint}
                rankControlLabel={copy.rankControlLabel}
                rankLabels={copy.rankingGuide}
                rankingGroupLabel={copy.rankingGroupLabel}
                onAssignRank={(rank) => assignRank(option.id as AssessmentOptionId, rank)}
              />
            ))}
          </View>

          <View
            accessibilityLiveRegion="polite"
            accessibilityRole={showIncompleteError ? 'alert' : undefined}
            style={[
              styles.rankingStatus,
              rankingComplete ? styles.rankingStatusComplete : styles.rankingStatusIncomplete,
            ]}
          >
            <AppText accessibilityElementsHidden style={styles.statusSymbol}>
              {rankingComplete ? '✓' : '!'}
            </AppText>
            <AppText style={styles.statusText}>
              {showIncompleteError
                ? copy.incompleteError
                : rankingComplete ? copy.rankingComplete : copy.rankingIncomplete}
            </AppText>
          </View>
          <AppText accessibilityLiveRegion="polite" style={styles.srAnnouncement}>
            {rankAnnouncement}
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
              onPress={continueAssessment}
              style={({ pressed }) => [styles.continueButton, pressed && styles.primaryButtonPressed]}
            >
              <AppText style={styles.continueButtonText}>
                {isLastQuestion ? copy.finish : copy.continue}
              </AppText>
            </FocusablePressable>
          </View>
        </View>
      </PageContent>
    </ScrollView>
  );
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
    introduction: { color: colors.text, fontSize: 15, lineHeight: 23, marginTop: theme.spacing.md },
    progressTrack: {
      backgroundColor: colors.progressTrack,
      borderRadius: 999,
      height: 8,
      marginTop: theme.spacing.sm,
      overflow: 'hidden',
    },
    progressFill: { backgroundColor: colors.primary, height: '100%' },
    guide: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    guideTitle: { color: colors.heading, fontSize: 16, fontWeight: '800', lineHeight: 22 },
    guideItems: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
    guideItem: {
      alignItems: 'center',
      flexBasis: 155,
      flexDirection: 'row',
      flexGrow: 1,
      gap: theme.spacing.xs,
      minWidth: 0,
    },
    guideRank: {
      color: colors.heading,
      fontSize: 15,
      fontWeight: '900',
      minWidth: 18,
      textAlign: 'center',
    },
    guideMeaning: { color: colors.text, flex: 1, fontSize: 14, lineHeight: 20 },
    question: { color: colors.heading, fontSize: 28, fontWeight: '700', lineHeight: 36 },
    options: { gap: theme.spacing.sm, minWidth: 0, width: '100%' },
    rankingStatus: {
      alignItems: 'flex-start',
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
    },
    rankingStatusComplete: { backgroundColor: colors.successSurface, borderColor: colors.success },
    rankingStatusIncomplete: { backgroundColor: colors.warningSurface, borderColor: colors.warning },
    statusSymbol: { color: colors.heading, fontSize: 16, fontWeight: '900', lineHeight: 22 },
    statusText: { color: colors.text, flex: 1, fontSize: 14, lineHeight: 22 },
    srAnnouncement: { height: 1, opacity: 0, overflow: 'hidden', width: 1 },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    backButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexBasis: 180,
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: 52,
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
      justifyContent: 'center',
      minHeight: 52,
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
