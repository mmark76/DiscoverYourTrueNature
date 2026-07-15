import { StyleSheet, View } from 'react-native';

import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentQuestion, ScoreMap } from '../types';
import { OptionButton } from './OptionButton';

interface AssessmentScreenProps {
  question: AssessmentQuestion;
  questionNumber: number;
  totalQuestions: number;
  onSelect: (scores: ScoreMap) => void;
}

export function AssessmentScreen({ question, questionNumber, totalQuestions, onSelect }: AssessmentScreenProps) {
  const { colors } = useAppearance();
  const progress = questionNumber / totalQuestions;
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View>
        <AppText style={styles.eyebrow}>ΑΝΑΚΑΛΥΨΕ ΤΟ ΖΩΙΚΟ ΣΟΥ ΑΡΧΕΤΥΠΟ</AppText>
        <AppText style={styles.counter}>Ερώτηση {questionNumber} από {totalQuestions}</AppText>
        <View accessibilityRole="progressbar" style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
      <AppText style={styles.question}>{question.prompt}</AppText>
      <View style={styles.options}>
        {question.options.map((option) => (
          <OptionButton key={option.id} label={option.label} onPress={() => onSelect(option.scores)} />
        ))}
      </View>
      <AppText style={styles.note}>Διάλεξε αυτό που σε εκφράζει περισσότερο, όχι αυτό που θεωρείς ιδανικό.</AppText>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    container: { alignSelf: 'center', flex: 1, gap: theme.spacing.lg, justifyContent: 'space-between', maxWidth: 720, padding: theme.spacing.lg, width: '100%' },
    eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
    counter: { color: colors.mutedText, fontSize: 14, marginTop: theme.spacing.sm },
    progressTrack: { backgroundColor: colors.progressTrack, borderRadius: 999, height: 8, marginTop: theme.spacing.sm, overflow: 'hidden' },
    progressFill: { backgroundColor: colors.primary, height: '100%' },
    question: { color: colors.text, fontSize: 28, fontWeight: '700', lineHeight: 36 },
    options: { gap: theme.spacing.sm },
    note: { color: colors.mutedText, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  });
}
