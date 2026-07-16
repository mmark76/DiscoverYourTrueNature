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
  answerCurrentAssessmentQuestion,
  createAssessmentSession,
  getAssessmentAnswer,
  getCurrentAssessmentQuestion,
  goToPreviousAssessmentQuestion,
  restartAssessmentSession,
} from './src/features/assessment/services/assessmentSession';
import {
  getBrowserAssessmentStorage,
  persistAssessmentSession,
  restoreAssessmentSession,
} from './src/features/assessment/services/assessmentStorage';
import {
  answerToRankingDraft,
  type RankingDraft,
} from './src/features/assessment/services/ranking';
import { HomeScreen } from './src/features/home/components/HomeScreen';
import { HowItWorksScreen } from './src/features/information/components/HowItWorksScreen';
import {
  getPersonalityAnimal,
  type PersonalityTypeId,
} from './src/features/personalities/data/personalityAnimals';
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
  const [rankingDraft, setRankingDraft] = useState<RankingDraft>(() =>
    answerToRankingDraft(currentAnswer),
  );

  useEffect(() => {
    persistAssessmentSession(assessmentStorage, assessmentSession);
  }, [assessmentSession, assessmentStorage]);

  useEffect(() => {
    setRankingDraft(answerToRankingDraft(currentAnswer));
  }, [currentAnswer, currentQuestion?.id]);

  function resetAndStartAssessment() {
    setAssessmentSession(restartAssessmentSession());
    setRankingDraft({});
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

  function submitQuestionRanking() {
    if (!currentQuestion) return;
    const nextSession = answerCurrentAssessmentQuestion(
      assessmentSession,
      currentQuestion.id,
      rankingDraft,
    );
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
            onContinue={submitQuestionRanking}
            onRankingsChange={setRankingDraft}
            question={currentQuestion}
            questionNumber={assessmentSession.currentQuestionIndex + 1}
            rankings={rankingDraft}
            totalQuestions={completedAssessmentQuestionCount}
          />
        )}

        {screen === 'result' && assessmentSession.result && primaryAnimal && secondaryAnimal && (
          <ResultScreen
            hasBalancedDimensions={assessmentSession.result.balancedDimensionIds.length > 0}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
