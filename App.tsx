import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { AssessmentScreen } from './src/features/assessment/components/AssessmentScreen';
import { assessmentQuestions } from './src/features/assessment/data/questions';
import {
  addScores,
  calculateAssessmentResult,
  createEmptyScores,
} from './src/features/assessment/services/scoreAssessment';
import { AssessmentResult, ScoreMap } from './src/features/assessment/types';
import { WelcomeScreen } from './src/features/onboarding/components/WelcomeScreen';
import { ResultScreen } from './src/features/results/components/ResultScreen';
import { theme } from './src/shared/styles/theme';

type AppScreen = 'welcome' | 'assessment' | 'result';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState(createEmptyScores);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const currentQuestion = useMemo(
    () => assessmentQuestions[questionIndex],
    [questionIndex],
  );

  function startAssessment() {
    setQuestionIndex(0);
    setScores(createEmptyScores());
    setResult(null);
    setScreen('assessment');
  }

  function selectAnswer(answerScores: ScoreMap) {
    const nextScores = addScores(scores, answerScores);
    const isLastQuestion = questionIndex === assessmentQuestions.length - 1;

    setScores(nextScores);

    if (isLastQuestion) {
      setResult(calculateAssessmentResult(nextScores));
      setScreen('result');
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appFrame}>
        {screen === 'welcome' && <WelcomeScreen onStart={startAssessment} />}

        {screen === 'assessment' && currentQuestion && (
          <AssessmentScreen
            question={currentQuestion}
            questionNumber={questionIndex + 1}
            totalQuestions={assessmentQuestions.length}
            onSelect={selectAnswer}
          />
        )}

        {screen === 'result' && result && (
          <ResultScreen result={result} onRestart={startAssessment} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  appFrame: {
    alignSelf: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    maxWidth: 720,
    width: '100%',
  },
});
