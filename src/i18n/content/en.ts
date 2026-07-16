import type { TranslationContent } from '../translationTypes';
import { englishAssessmentOptions, englishAssessmentQuestions } from './assessment.en.ts';

export const englishContent = {
  common: {
    productName: 'Animals Within',
    selectedLanguageName: 'English',
  },
  header: {
    home: 'Home',
    discover: 'Discover',
    animals: 'The 12 Animals',
    howItWorks: 'How It Works',
    settings: 'Settings',
    feedback: 'Feedback',
    navigationLabel: 'Primary navigation',
    brandHomeLabel: 'Animals Within, go to Home',
    languageLabel: 'Language selection',
    greekLanguage: 'Greek',
    englishLanguage: 'English',
    ecosystemLink: 'Markellos Ecosystem',
    feedbackAccessibilityLabel: 'Send feedback by email',
  },
  home: {
    heroEyebrow: 'AN ENTERTAINMENT EXPLORATION',
    heroSubtitle: 'Discover your animal archetype.',
    heroDescription:
      'A short entertainment experience that explores how you decide, collaborate, and respond.',
    heroAction: 'Start discovery',
    heroActionHint: 'Starts the twenty-five-question Animals Within assessment',
    motifCaption: 'animal archetypes',
    sectionEyebrow: 'EXPLORE THE EXPERIENCE',
    sectionTitle: 'Choose where you want to begin',
    features: {
      discovery: {
        eyebrow: 'THE EXPERIENCE',
        title: 'Discover the animal within you',
        description:
          'Answer twenty-five short questions to discover your primary and secondary animals.',
        actionLabel: 'Start now',
      },
      animals: {
        eyebrow: 'THE ARCHETYPES',
        title: 'Meet the 12 animals',
        description:
          'Explore the animals in the Animals Within world and the qualities each one represents.',
        actionLabel: 'View the 12 animals',
      },
      'how-it-works': {
        eyebrow: 'HOW IT WORKS',
        title: 'See how your result is calculated',
        description:
          'Learn how your choices connect to the animal archetypes in this entertainment experience.',
        actionLabel: 'Learn more',
      },
    },
  },
  assessment: {
    eyebrow: 'DISCOVER YOUR ANIMAL ARCHETYPE',
    counter: 'Question {current} of {total}',
    progressLabel: 'Assessment progress: question {current} of {total}',
    introduction: 'Answer instinctively. Choose what fits you best without thinking about it too much.',
    questions: englishAssessmentQuestions,
    options: englishAssessmentOptions,
  },
  results: {
    primaryAnimal: 'Primary animal',
    secondaryAnimal: 'Secondary animal',
    restart: 'Take it again',
    restartHint: 'Clears this assessment and starts again from question one',
  },
  animals: {
    eyebrow: 'THE TWELVE ARCHETYPES',
    title: 'The 12 Animals',
    introduction:
      'Explore the twelve animal archetypes used by the Animals Within assessment.',
    catalogNote:
      'These descriptions and archetype profiles are provisional, entertainment-only, and not diagnostic.',
    cardAccessibility: '{name}, animal archetype',
    records: {
      wolf: {
        name: 'Wolf',
        traits: 'loyalty and strategy',
        description: 'Moves with purpose, protects trusted bonds, and values independence.',
      },
      owl: {
        name: 'Owl',
        traits: 'analysis and observation',
        description: 'Looks beneath the surface and prefers thoughtful, evidence-led choices.',
      },
      eagle: {
        name: 'Eagle',
        traits: 'ambition and decisiveness',
        description: 'Sees the wider horizon, takes initiative, and aims high.',
      },
      dolphin: {
        name: 'Dolphin',
        traits: 'communication and connection',
        description: 'Builds rapport quickly and brings energy, empathy, and cooperation.',
      },
      bear: {
        name: 'Bear',
        traits: 'protection and stability',
        description: 'Creates safety, stays grounded, and offers steady practical support.',
      },
      lion: {
        name: 'Lion',
        traits: 'leadership and assurance',
        description: 'Represents visible courage, presence, and responsibility for the group.',
      },
      fox: {
        name: 'Fox',
        traits: 'adaptability and ingenuity',
        description: 'Finds clever routes through change and responds with flexible thinking.',
      },
      panther: {
        name: 'Panther',
        traits: 'independence and inner strength',
        description: 'Represents quiet assurance, self-reliance, and deliberate action.',
      },
      elephant: {
        name: 'Elephant',
        traits: 'memory, empathy, and responsibility',
        description: 'Values lasting bonds, shared history, and care for the wider community.',
      },
      horse: {
        name: 'Horse',
        traits: 'freedom and energy',
        description: 'Represents momentum, openness, and the drive to explore new ground.',
      },
      turtle: {
        name: 'Turtle',
        traits: 'patience and perseverance',
        description: 'Moves at a sustainable pace and trusts steady progress over haste.',
      },
      octopus: {
        name: 'Octopus',
        traits: 'creativity and versatility',
        description: 'Approaches complex situations from several angles and invents new options.',
      },
    },
  },
  howItWorks: {
    eyebrow: 'HOW IT WORKS',
    title: 'A local, transparent entertainment model',
    introduction:
      'Animals Within compares your answers with twelve provisional animal archetypes using a deterministic model that runs on your device.',
    steps: [
      {
        title: 'Answer quick questions',
        description: 'Choose one instinctive response to varied everyday situations and lighter preferences.',
      },
      {
        title: 'Complete all 25 choices',
        description:
          'Your choices stay on your device while the local model combines them into one consistent matching pattern.',
      },
      {
        title: 'See your two animals',
        description:
          'The closest match becomes your primary animal and the next distinct match becomes your secondary animal.',
      },
    ],
    disclosureTitle: 'Important to know',
    disclosures: [
      'The questions and animal profiles are original, editorial, and provisional.',
      'The scoring is deterministic and runs locally on your device.',
      'The experience is an entertainment self-discovery framework.',
      'It is not diagnostic, scientific, or validated testing.',
    ],
    action: 'Start discovery',
    actionHint: 'Starts the twenty-five-question Animals Within assessment',
  },
  settings: {
    title: 'Appearance settings',
    description: 'Adjust language, color, and readability without losing your progress.',
    language: 'Language',
    greek: 'Ελληνικά',
    english: 'English',
    appearanceMode: 'Appearance',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    colorTheme: 'Color theme',
    forest: 'Warm Ivory',
    ocean: 'Ocean',
    amber: 'Amber',
    plum: 'Plum',
    fontFamily: 'Font family',
    systemSans: 'System Sans',
    serif: 'Serif',
    readable: 'Highly Readable',
    textSize: 'Text size',
    small: 'Small',
    normal: 'Normal',
    large: 'Large',
    extraLarge: 'Extra Large',
    preview: 'Live preview',
    previewTitle: 'Animals Within',
    previewBody: 'A clear text sample using the selected language and appearance.',
    reset: 'Reset to defaults',
    resetPrompt: 'Reset every appearance setting to its documented default?',
    confirmReset: 'Yes, reset',
    cancel: 'Cancel',
    back: 'Back',
  },
  analyticsConsent: {
    title: 'Analytics choices',
    description:
      'Help us understand how the application is used. Analytics will only be enabled with your permission. Assessment answers and animal results will never be sent.',
    accept: 'Accept analytics',
    reject: 'Reject analytics',
    close: 'Close analytics choices',
    bannerAccessibilityLabel: 'Analytics consent choices',
    dialogAccessibilityLabel: 'Change analytics consent choices',
  },
  footer: {
    accessibilityLabel: 'Animals Within information and links',
    navigationLabel: 'Footer links and build information',
    feedbackLabel: 'Feedback',
    feedbackAccessibilityLabel: 'Send feedback by email',
    analyticsChoicesLabel: 'Analytics choices',
    analyticsChoicesAccessibilityLabel: 'Open analytics consent choices',
    ecosystemLabel: 'Markellos Ecosystem',
    ecosystemAccessibilityLabel: 'Return to Markellos Ecosystem',
    buildAccessibilityLabel: 'Application build version',
  },
} satisfies TranslationContent;
