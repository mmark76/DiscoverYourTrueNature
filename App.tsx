import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView as InsetSafeAreaView } from 'react-native-safe-area-context';

import { AppScreen, NavigableScreen, shouldShowAppChrome } from './src/app/navigation';
import { AnalyticsConsentProvider } from './src/features/analytics/consent/AnalyticsConsentProvider';
import { Ga4ConsentBridge } from './src/features/analytics/ga4/Ga4ConsentBridge';
import { AnimalsScreen } from './src/features/animals/components/AnimalsScreen';
import { AssessmentScreen } from './src/features/assessment/components/AssessmentScreen';
import {
  answerCurrentAssessmentQuestion,
  createAssessmentSession,
  getCurrentAssessmentQuestion,
  restartAssessmentSession,
} from './src/features/assessment/services/assessmentSession';
import { completedAssessmentQuestionCount } from './src/features/assessment/data/questions';
import { HomeScreen } from './src/features/home/components/HomeScreen';
import { HowItWorksScreen } from './src/features/information/components/HowItWorksScreen';
import { ResultScreen } from './src/features/results/components/ResultScreen';
import { AppearanceProvider, useAppearance } from './src/settings/AppearanceProvider';
import { SettingsScreen } from './src/settings/components/SettingsScreen';
import { AppHeader } from './src/shared/components/AppHeader';
import { AppShell } from './src/shared/layout/AppShell';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <AnalyticsConsentProvider>
          <Ga4ConsentBridge />
          <AppContent />
        </AnalyticsConsentProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { colors } = useAppearance();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [settingsReturnScreen, setSettingsReturnScreen] = useState<AppScreen>('home');
  const [assessmentSession, setAssessmentSession] = useState(createAssessmentSession);

  const currentQuestion = useMemo(
    () => getCurrentAssessmentQuestion(assessmentSession),
    [assessmentSession],
  );

  function resetAndStartAssessment() {
    setAssessmentSession(restartAssessmentSession());
    setScreen('assessment');
  }

  function openAssessment() {
    if (assessmentSession.result) {
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

  function selectAnswer(questionId: string, optionId: string) {
    const nextSession = answerCurrentAssessmentQuestion(
      assessmentSession,
      questionId,
      optionId,
    );
    setAssessmentSession(nextSession);

    if (nextSession.result) {
      setScreen('result');
    }
  }

  const showAppChrome = shouldShowAppChrome(screen);

  return (
    <InsetSafeAreaView
      edges={showAppChrome
        ? ['top', 'left', 'right']
        : ['top', 'bottom', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <AppShell
        header={<AppHeader currentScreen={screen} onNavigate={navigate} onOpenSettings={openSettings} />}
        showChrome={showAppChrome}
      >

        {screen === 'home' && <HomeScreen onNavigate={navigate} />}

        {screen === 'assessment' && currentQuestion && (
          <AssessmentScreen
            question={currentQuestion}
            questionNumber={assessmentSession.answers.length + 1}
            totalQuestions={completedAssessmentQuestionCount}
            onSelect={selectAnswer}
          />
        )}

        {screen === 'result' && assessmentSession.result && (
          <ResultScreen
            result={assessmentSession.result}
            onRestart={resetAndStartAssessment}
          />
        )}

        {screen === 'animals' && <AnimalsScreen />}

        {screen === 'how-it-works' && <HowItWorksScreen onStart={openAssessment} />}

        {screen === 'settings' && (
          <SettingsScreen onBack={() => setScreen(settingsReturnScreen)} />
        )}
      </AppShell>
    </InsetSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
