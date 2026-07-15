import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { AppScreen, NavigableScreen } from './src/app/navigation';
import { AnimalsScreen } from './src/features/animals/components/AnimalsScreen';
import { AssessmentScreen } from './src/features/assessment/components/AssessmentScreen';
import { assessmentQuestions } from './src/features/assessment/data/questions';
import {
  addScores,
  calculateAssessmentResult,
  createEmptyScores,
} from './src/features/assessment/services/scoreAssessment';
import { AssessmentResult, ScoreMap } from './src/features/assessment/types';
import { HomeScreen } from './src/features/home/components/HomeScreen';
import { HowItWorksScreen } from './src/features/information/components/HowItWorksScreen';
import { ResultScreen } from './src/features/results/components/ResultScreen';
import { AppHeader } from './src/shared/components/AppHeader';
import { theme } from './src/shared/styles/theme';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState(createEmptyScores);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  const currentQuestion = useMemo(
    () => assessmentQuestions[questionIndex],
    [questionIndex],
  );

  function resetAndStartAssessment() {
    setQuestionIndex(0);
    setScores(createEmptyScores());
    setResult(null);
    setAssessmentStarted(true);
    setScreen('assessment');
  }

  function openAssessment() {
    if (!assessmentStarted || result) {
      resetAndStartAssessment();
      return;
    }

    setScreen('assessment');
  }

  function navigate(nextScreen: NavigableScreen) {
    if (nextScreen === 'assessment') {
      openAssessment();
      return;
    }

    setScreen(nextScreen);
  }

  function selectAnswer(answerScores: ScoreMap) {
    const nextScores = addScores(scores, answerScores);
    const isLastQuestion = questionIndex === assessmentQuestions.length - 1;

    setScores(nextScores);

    if (isLastQuestion) {
      setResult(calculateAssessmentResult(nextScores));
      setAssessmentStarted(false);
      setScreen('result');
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appFrame}>
        <AppHeader currentScreen={screen} onNavigate={navigate} />

        {screen === 'home' && <HomeScreen onNavigate={navigate} />}

        {screen === 'assessment' && currentQuestion && (
          <AssessmentScreen
            question={currentQuestion}
            questionNumber={questionIndex + 1}
            totalQuestions={assessmentQuestions.length}
            onSelect={selectAnswer}
          />
        )}

        {screen === 'result' && result && (
          <ResultScreen result={result} onRestart={resetAndStartAssessment} />
        )}

        {screen === 'animals' && <AnimalsScreen />}

        {screen === 'how-it-works' && <HowItWorksScreen onStart={openAssessment} />}
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
    backgroundColor: theme.colors.background,
    flex: 1,
    width: '100%',
  },
});
