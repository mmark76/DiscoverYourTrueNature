import type { AnimalId } from '../features/animals/data/animals';
import type {
  AssessmentOptionId,
  AssessmentQuestionId,
} from '../features/assessment/data/questions';
import type { ArchetypeId } from '../features/assessment/types';
import type { HomeFeatureId } from '../features/home/data/features';

export interface HomeFeatureCopy {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
}

export interface ArchetypeCopy {
  name: string;
  summary: string;
  description: string;
  strengths: readonly [string, string, string];
  watchOuts: readonly [string, string];
}

export interface AnimalCopy {
  name: string;
  traits: string;
  description: string;
}

export interface ProcessStepCopy {
  title: string;
  description: string;
}

export interface TranslationContent {
  common: {
    productName: string;
    selectedLanguageName: string;
  };
  header: {
    home: string;
    discover: string;
    animals: string;
    howItWorks: string;
    settings: string;
    feedback: string;
    navigationLabel: string;
    brandHomeLabel: string;
    languageLabel: string;
    greekLanguage: string;
    englishLanguage: string;
    ecosystemLink: string;
    feedbackAccessibilityLabel: string;
  };
  home: {
    heroEyebrow: string;
    heroSubtitle: string;
    heroDescription: string;
    heroAction: string;
    heroActionHint: string;
    motifCaption: string;
    sectionEyebrow: string;
    sectionTitle: string;
    features: Record<HomeFeatureId, HomeFeatureCopy>;
  };
  assessment: {
    eyebrow: string;
    counter: string;
    progressLabel: string;
    instruction: string;
    questions: Record<AssessmentQuestionId, string>;
    options: Record<AssessmentOptionId, string>;
  };
  results: {
    primaryEyebrow: string;
    matchStrength: string;
    matchStrengthAccessibility: string;
    strengths: string;
    watchOuts: string;
    secondaryInfluence: string;
    fullProfile: string;
    entertainmentModel: string;
    modelExplanation: string;
    rankingAccessibility: string;
    restart: string;
    restartHint: string;
    returnHome: string;
    returnHomeHint: string;
    archetypes: Record<ArchetypeId, ArchetypeCopy>;
  };
  animals: {
    eyebrow: string;
    title: string;
    introduction: string;
    catalogNote: string;
    cardAccessibility: string;
    records: Record<AnimalId, AnimalCopy>;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    introduction: string;
    steps: readonly [ProcessStepCopy, ProcessStepCopy, ProcessStepCopy];
    disclosureTitle: string;
    disclosures: readonly [string, string, string, string];
    action: string;
    actionHint: string;
  };
  settings: {
    title: string;
    description: string;
    language: string;
    greek: string;
    english: string;
    appearanceMode: string;
    system: string;
    light: string;
    dark: string;
    colorTheme: string;
    forest: string;
    ocean: string;
    amber: string;
    plum: string;
    fontFamily: string;
    systemSans: string;
    serif: string;
    readable: string;
    textSize: string;
    small: string;
    normal: string;
    large: string;
    extraLarge: string;
    preview: string;
    previewTitle: string;
    previewBody: string;
    reset: string;
    resetPrompt: string;
    confirmReset: string;
    cancel: string;
    back: string;
  };
  analyticsConsent: {
    title: string;
    description: string;
    accept: string;
    reject: string;
    close: string;
    bannerAccessibilityLabel: string;
    dialogAccessibilityLabel: string;
  };
  footer: {
    accessibilityLabel: string;
    navigationLabel: string;
    feedbackLabel: string;
    feedbackAccessibilityLabel: string;
    analyticsChoicesLabel: string;
    analyticsChoicesAccessibilityLabel: string;
    ecosystemLabel: string;
    ecosystemAccessibilityLabel: string;
    buildAccessibilityLabel: string;
  };
}
