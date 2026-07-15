import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../shared/styles/theme';
import { AssessmentQuestion, ScoreMap } from '../types';
import { OptionButton } from './OptionButton';

interface AssessmentScreenProps {
  question: AssessmentQuestion;
  questionNumber: number;
  totalQuestions: number;
  onSelect: (scores: ScoreMap) => void;
}

export function AssessmentScreen({
  question,
  questionNumber,
  totalQuestions,
  onSelect,
}: AssessmentScreenProps) {
  const progress = questionNumber / totalQuestions;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>ΑΝΑΚΑΛΥΨΕ ΤΟ ΖΩΙΚΟ ΣΟΥ ΑΡΧΕΤΥΠΟ</Text>
        <Text style={styles.counter}>
          Ερώτηση {questionNumber} από {totalQuestions}
        </Text>
        <View accessibilityRole="progressbar" style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <Text style={styles.question}>{question.prompt}</Text>

      <View style={styles.options}>
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            onPress={() => onSelect(option.scores)}
          />
        ))}
      </View>

      <Text style={styles.note}>Διάλεξε αυτό που σε εκφράζει περισσότερο, όχι αυτό που θεωρείς ιδανικό.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  counter: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: theme.spacing.sm,
  },
  progressTrack: {
    backgroundColor: theme.colors.progressTrack,
    borderRadius: 999,
    height: 8,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: theme.colors.primary,
    height: '100%',
  },
  question: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  options: {
    gap: theme.spacing.sm,
  },
  note: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
