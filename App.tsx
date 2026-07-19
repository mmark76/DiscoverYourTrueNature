import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView as InsetSafeAreaView } from 'react-native-safe-area-context';

import { AppScreen, NavigableScreen, shouldShowAppChrome } from './src/app/navigation';
import { AnalyticsConsentProvider } from './src/features/analytics/consent/AnalyticsConsentProvider';
import { Ga4ConsentBridge } from './src/features/analytics/ga4/Ga4ConsentBridge';
import { AnimalsScreen } from './src/features/animals/components/AnimalsScreen';
import type { AnimalData, AnimalId } from './src/features/animals/data/animals';
import { AssessmentScreen } from './src/features/assessment/components/AssessmentScreen';
import { QuestionnaireSelectionScreen } from './src/features/assessment/components/QuestionnaireSelectionScreen';
import { completedAssessmentQuestionCount } from './src/features/assessment/data/questions';
import { shortCompletedAssessmentQuestionCount } from './src/features/assessment/data/shortQuestions';
import {
  canContinueAssessment,
  continueAssessment,
  getCurrentAssessmentQuestion,
  goToPreviousAssessmentQuestion,
  restartAssessmentSession,
  selectCurrentAssessmentOption,
} from './src/features/assessment/services/assessmentSession';
import {
  persistAssessmentMode,
  restoreAssessmentMode,
} from './src/features/assessment/services/assessmentModeStorage';
import {
  getBrowserAssessmentStorage,
  persistAssessmentSession,
  restoreAssessmentSession,
} from './src/features/assessment/services/assessmentStorage';
import { getContextProfileObservation } from './src/features/assessment/services/scoreAssessment';
import {
  canContinueShortAssessment,
  continueShortAssessment,
  getCurrentShortAssessmentQuestion,
  goToPreviousShortAssessmentQuestion,
  restartShortAssessmentSession,
  selectCurrentShortAssessmentOption,
} from './src/features/assessment/services/shortAssessmentSession';
import {
  persistShortAssessmentSession,
  restoreShortAssessmentSession,
} from './src/features/assessment/services/shortAssessmentStorage';
import type { AssessmentMode } from './src/features/assessment/types';
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
  const [longAssessmentSession, setLongAssessmentSession] = useState(() =>
    restoreAssessmentSession(assessmentStorage),
  );
  const [shortAssessmentSession, setShortAssessmentSession] = useState(() =>
    restoreShortAssessmentSession(assessmentStorage),
  );
  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode | null>(() =>
    restoreAssessmentMode(assessmentStorage)
      ?? inferRestoredAssessmentMode(longAssessmentSession, shortAssessmentSession),
  );
  const activeAssessmentSession = assessmentMode === 'short'
    ? shortAssessmentSession
    : assessmentMode === 'long' ? longAssessmentSession : null;
  const [screen, setScreen] = useState<AppScreen>(() =>
    activeAssessmentSession?.result
      ? 'result'
      : activeAssessmentSession ? 'assessment' : 'home',
  );
  const [settingsReturnScreen, setSettingsReturnScreen] = useState<AppScreen>('home');

  const currentQuestion = useMemo(
    () => assessmentMode === 'short'
      ? getCurrentShortAssessmentQuestion(shortAssessmentSession)
      : assessmentMode === 'long'
        ? getCurrentAssessmentQuestion(longAssessmentSession)
        : null,
    [assessmentMode, longAssessmentSession, shortAssessmentSession],
  );
  const currentAnswer = useMemo(
    () => currentQuestion && activeAssessmentSession
      ? activeAssessmentSession.answers.find(({ questionId }) => questionId === currentQuestion.id)
        ?? null
      : null,
    [activeAssessmentSession, currentQuestion],
  );

  useEffect(() => {
    persistAssessmentSession(assessmentStorage, longAssessmentSession);
  }, [assessmentStorage, longAssessmentSession]);

  useEffect(() => {
    persistShortAssessmentSession(assessmentStorage, shortAssessmentSession);
  }, [assessmentStorage, shortAssessmentSession]);

  useEffect(() => {
    if (assessmentMode) persistAssessmentMode(assessmentStorage, assessmentMode);
  }, [assessmentMode, assessmentStorage]);

  function resetAndStartAssessment() {
    if (assessmentMode === 'short') {
      setShortAssessmentSession(restartShortAssessmentSession());
    } else if (assessmentMode === 'long') {
      setLongAssessmentSession(restartAssessmentSession());
    } else {
      setScreen('questionnaires');
      return;
    }
    setScreen('assessment');
  }

  function selectAssessmentMode(mode: AssessmentMode) {
    setAssessmentMode(mode);
    const selectedSession = mode === 'short' ? shortAssessmentSession : longAssessmentSession;
    setScreen(selectedSession.result ? 'result' : 'assessment');
  }

  function navigate(nextScreen: NavigableScreen) {
    setScreen(nextScreen);
  }

  function openSettings() {
    if (screen !== 'settings') {
      setSettingsReturnScreen(screen);
      setScreen('settings');
    }
  }

  function selectOption(optionId: string) {
    if (assessmentMode === 'short') {
      setShortAssessmentSession((current) =>
        selectCurrentShortAssessmentOption(current, optionId));
    } else if (assessmentMode === 'long') {
      setLongAssessmentSession((current) => selectCurrentAssessmentOption(current, optionId));
    }
  }

  function continueToNextQuestion() {
    if (assessmentMode === 'short') {
      if (!canContinueShortAssessment(shortAssessmentSession)) return;
      const nextSession = continueShortAssessment(shortAssessmentSession);
      setShortAssessmentSession(nextSession);
      if (nextSession.result) setScreen('result');
      return;
    }

    if (assessmentMode === 'long') {
      if (!canContinueAssessment(longAssessmentSession)) return;
      const nextSession = continueAssessment(longAssessmentSession);
      setLongAssessmentSession(nextSession);
      if (nextSession.result) setScreen('result');
    }
  }

  function goBackOneQuestion() {
    if (assessmentMode === 'short') {
      setShortAssessmentSession((current) => goToPreviousShortAssessmentQuestion(current));
    } else if (assessmentMode === 'long') {
      setLongAssessmentSession((current) => goToPreviousAssessmentQuestion(current));
    }
  }

  const assessmentResult = activeAssessmentSession?.result ?? null;
  const primaryAnimal = assessmentResult
    ? toPublicAnimal(assessmentResult.primaryTypeId)
    : null;
  const secondaryAnimal = assessmentResult
    ? toPublicAnimal(assessmentResult.secondaryTypeId)
    : null;
  const contextObservation = assessmentMode === 'long' && assessmentResult
    ? toPublicContextObservation(getContextProfileObservation(longAssessmentSession.answers))
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
        {screen === 'home' && (
          <HomeScreen onNavigate={navigate} onSelectAssessmentMode={selectAssessmentMode} />
        )}

        {screen === 'questionnaires' && (
          <QuestionnaireSelectionScreen onSelectMode={selectAssessmentMode} />
        )}

        {screen === 'assessment' && assessmentMode && activeAssessmentSession && currentQuestion && (
          <AssessmentScreen
            assessmentMode={assessmentMode}
            canGoBack={activeAssessmentSession.currentQuestionIndex > 0}
            onBack={goBackOneQuestion}
            onContinue={continueToNextQuestion}
            onSelectOption={selectOption}
            question={currentQuestion}
            questionNumber={activeAssessmentSession.currentQuestionIndex + 1}
            selectedOptionId={currentAnswer?.selectedOptionId ?? null}
            totalQuestions={assessmentMode === 'short'
              ? shortCompletedAssessmentQuestionCount
              : completedAssessmentQuestionCount}
          />
        )}

        {screen === 'result' && assessmentResult && primaryAnimal && secondaryAnimal && (
          <ResultScreen
            assessmentMode={assessmentResult.assessmentMode}
            contextObservation={contextObservation}
            hasCloseMatch={assessmentResult.hasCloseMatch}
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

        {screen === 'how-it-works' && (
          <HowItWorksScreen onStart={() => setScreen('questionnaires')} />
        )}

        {screen === 'settings' && (
          <SettingsScreen onBack={() => setScreen(settingsReturnScreen)} />
        )}
      </AppShell>
    </InsetSafeAreaView>
  );
}

function inferRestoredAssessmentMode(
  longSession: { answers: readonly unknown[]; result: unknown },
  shortSession: { answers: readonly unknown[]; result: unknown },
): AssessmentMode | null {
  if (longSession.result || longSession.answers.length > 0) return 'long';
  if (shortSession.result || shortSession.answers.length > 0) return 'short';
  return null;
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
