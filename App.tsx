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
import { AppearanceProvider, useAppearance } from './src/settings/AppearanceProvider';
import { SettingsScreen } from './src/settings/components/SettingsScreen';
import { AppHeader } from './src/shared/components/AppHeader';

export default function App() {
  return (
    <AppearanceProvider>
      <AppContent />
    </AppearanceProvider>
  );
}

function AppContent() {
  const { colors } = useAppearance();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [settingsReturnScreen, setSettingsReturnScreen] = useState<AppScreen>('home');
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

  function openSettings() {
    if (screen !== 'settings') {
      setSettingsReturnScreen(screen);
      setScreen('settings');
    }
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.appFrame, { backgroundColor: colors.background }]}>
        <AppHeader currentScreen={screen} onNavigate={navigate} onOpenSettings={openSettings} />

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
          <ResultScreen
            result={result}
            onHome={() => setScreen('home')}
            onRestart={resetAndStartAssessment}
          />
        )}

        {screen === 'animals' && <AnimalsScreen />}

        {screen === 'how-it-works' && <HowItWorksScreen onStart={openAssessment} />}

        {screen === 'settings' && (
          <SettingsScreen onBack={() => setScreen(settingsReturnScreen)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  appFrame: {
    flex: 1,
    width: '100%',
  },
});
