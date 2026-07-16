import type { AnimalId } from '../features/animals/data/animals';
import type {
  AssessmentOptionId,
  AssessmentQuestionId,
} from '../features/assessment/data/questions';
import type { AssessmentRank } from '../features/assessment/types';
import type { HomeFeatureId } from '../features/home/data/features';

export interface HomeFeatureCopy {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
}

/**
 * Public animal copy deliberately contains no personality code or classification title.
 * Internal personality identifiers must be resolved to an AnimalId before reaching the UI.
 */
export interface AnimalCopy {
  name: string;
  tagline: string;
  description: string;
  strengths: readonly string[];
  blindSpots: readonly string[];
  interaction: string;
  information: string;
  decisions: string;
  organization: string;
  metaphor: string;
}

export interface ProcessStepCopy {
  title: string;
  description: string;
}

export type AssessmentRankCopy = Record<AssessmentRank, string>;

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
    highlights: readonly [string, string, string, string];
    sectionEyebrow: string;
    sectionTitle: string;
    features: Record<HomeFeatureId, HomeFeatureCopy>;
  };
  assessment: {
    eyebrow: string;
    counter: string;
    progressLabel: string;
    introduction: string;
    rankingGuideTitle: string;
    rankingGuide: AssessmentRankCopy;
    rankingGroupLabel: string;
    rankControlLabel: string;
    rankControlHint: string;
    rankAssignedAnnouncement: string;
    rankMovedAnnouncement: string;
    rankSwappedAnnouncement: string;
    rankingComplete: string;
    rankingIncomplete: string;
    incompleteError: string;
    back: string;
    backHint: string;
    continue: string;
    continueHint: string;
    finish: string;
    finishHint: string;
    questions: Record<AssessmentQuestionId, string>;
    options: Record<AssessmentOptionId, string>;
  };
  results: {
    eyebrow: string;
    title: string;
    primaryAnimal: string;
    secondaryAnimal: string;
    typicalStrengths: string;
    possibleBlindSpots: string;
    behaviouralTendencies: string;
    interactionStyle: string;
    informationStyle: string;
    decisionStyle: string;
    organizationStyle: string;
    animalMetaphor: string;
    relationship: string;
    relationshipDescription: string;
    closePatterns: string;
    catalogue: string;
    catalogueHint: string;
    restart: string;
    restartHint: string;
    disclaimer: string;
    revealAccessibilityLabel: string;
  };
  animals: {
    eyebrow: string;
    title: string;
    introduction: string;
    catalogNote: string;
    cardAccessibility: string;
    primaryIndicator: string;
    secondaryIndicator: string;
    records: Record<AnimalId, AnimalCopy>;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    introduction: string;
    steps: readonly ProcessStepCopy[];
    disclosureTitle: string;
    disclosures: readonly string[];
    disclaimer: string;
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
