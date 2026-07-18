import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView as InsetSafeAreaView } from 'react-native-safe-area-context';

import { AppScreen, NavigableScreen, shouldShowAppChrome } from './src/app/navigation';
import { AnalyticsConsentProvider } from './src/features/analytics/consent/AnalyticsConsentProvider';
import { Ga4ConsentBridge } from './src/features/analytics/ga4/Ga4ConsentBridge';
import { AnimalsScreen } from './src/features/animals/components/AnimalsScreen';
import type { AnimalData, AnimalId } from './src/features/animals/data/animals';
import { AssessmentScreen } from './src/features/assessment/components/AssessmentScreen';
import { completedAssessmentQuestionCount } from './src/features/assessment/data/questions';
import {
  canContinueAssessment,
  continueAssessment,
  getAssessmentAnswer,
  getCurrentAssessmentQuestion,
  goToPreviousAssessmentQuestion,
  restartAssessmentSession,
  selectCurrentAssessmentOption,
} from './src/features/assessment/services/assessmentSession';
import {
  getBrowserAssessmentStorage,
  persistAssessmentSession,
  restoreAssessmentSession,
} from './src/features/assessment/services/assessmentStorage';
import { getContextProfileObservation } from './src/features/assessment/services/scoreAssessment';
import { HomeScreen } from './src/features/home/components/HomeScreen';
import { HowItWorksScreen } from './src/features/information/components/HowItWorksScreen';
import {
  getPersonalityAnimal,
  type PersonalityTypeId,
} from './src/features/personalities/data/personalityAnimals';
import {
  ResultScreen,
  type PublicContextObservation,
} from './src/features/results/components/ResultScreen';
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
  const assessmentStorage = useMemo(() => getBrowserAssessmentStorage(), []);
  const [assessmentSession, setAssessmentSession] = useState(() =>
    restoreAssessmentSession(assessmentStorage),
  );
  const [screen, setScreen] = useState<AppScreen>(() =>
    assessmentSession.result
      ? 'result'
      : assessmentSession.answers.length > 0 ? 'assessment' : 'home',
  );
  const [settingsReturnScreen, setSettingsReturnScreen] = useState<AppScreen>('home');

  const currentQuestion = useMemo(
    () => getCurrentAssessmentQuestion(assessmentSession),
    [assessmentSession],
  );
  const currentAnswer = useMemo(
    () => currentQuestion
      ? getAssessmentAnswer(assessmentSession, currentQuestion.id)
      : null,
    [assessmentSession, currentQuestion],
  );

  useEffect(() => {
    persistAssessmentSession(assessmentStorage, assessmentSession);
  }, [assessmentSession, assessmentStorage]);

  function resetAndStartAssessment() {
    setAssessmentSession(restartAssessmentSession());
    setScreen('assessment');
  }

  function openAssessment() {
    setScreen(assessmentSession.result ? 'result' : 'assessment');
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

  function selectOption(optionId: string) {
    const nextSession = selectCurrentAssessmentOption(assessmentSession, optionId);
    setAssessmentSession(nextSession);
  }

  function continueToNextQuestion() {
    if (!canContinueAssessment(assessmentSession)) return;
    const nextSession = continueAssessment(assessmentSession);
    setAssessmentSession(nextSession);

    if (nextSession.result) setScreen('result');
  }

  function goBackOneQuestion() {
    setAssessmentSession((current) => goToPreviousAssessmentQuestion(current));
  }

  const primaryAnimal = assessmentSession.result
    ? toPublicAnimal(assessmentSession.result.primaryTypeId)
    : null;
  const secondaryAnimal = assessmentSession.result
    ? toPublicAnimal(assessmentSession.result.secondaryTypeId)
    : null;
  const contextObservation = assessmentSession.result
    ? toPublicContextObservation(getContextProfileObservation(assessmentSession.answers))
    : null;
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
            canGoBack={assessmentSession.currentQuestionIndex > 0}
            onBack={goBackOneQuestion}
            onContinue={continueToNextQuestion}
            onSelectOption={selectOption}
            question={currentQuestion}
            questionNumber={assessmentSession.currentQuestionIndex + 1}
            selectedOptionId={currentAnswer?.selectedOptionId ?? null}
            totalQuestions={completedAssessmentQuestionCount}
          />
        )}

        {screen === 'result' && assessmentSession.result && primaryAnimal && secondaryAnimal && (
          <ResultScreen
            contextObservation={contextObservation}
            hasCloseMatch={assessmentSession.result.hasCloseMatch}
            onOpenCatalogue={() => setScreen('animals')}
            onRestart={resetAndStartAssessment}
            primaryAnimal={primaryAnimal}
            secondaryAnimal={secondaryAnimal}
          />
        )}

        {screen === 'animals' && (
          <AnimalsScreen
            primaryAnimalId={primaryAnimal?.id ?? null}
            secondaryAnimalId={secondaryAnimal?.id ?? null}
          />
        )}

        {screen === 'how-it-works' && <HowItWorksScreen onStart={openAssessment} />}

        {screen === 'settings' && (
          <SettingsScreen onBack={() => setScreen(settingsReturnScreen)} />
        )}
      </AppShell>
    </InsetSafeAreaView>
  );
}

function toPublicAnimal(typeId: PersonalityTypeId): AnimalData {
  const { animalId, symbol } = getPersonalityAnimal(typeId);
  return { id: animalId as AnimalId, symbol };
}

function toPublicContextObservation(
  observation: ReturnType<typeof getContextProfileObservation>,
): PublicContextObservation | null {
  if (!observation) return null;
  if (observation.kind === 'personal-stronger') return 'personal';
  if (observation.kind === 'professional-stronger') return 'professional';
  return 'context-dependent';
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
