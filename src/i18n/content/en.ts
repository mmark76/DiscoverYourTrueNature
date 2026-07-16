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
    ecosystemLink: 'Return to Markellos Ecosystem',
    feedbackAccessibilityLabel: 'Send feedback by email',
  },
  home: {
    heroEyebrow: 'AN ENTERTAINMENT EXPLORATION',
    heroSubtitle: 'Discover your animal archetype.',
    heroDescription:
      'A short entertainment experience that explores how you decide, collaborate, and respond.',
    heroAction: 'Start discovery',
    heroActionHint: 'Starts the twenty-four-question Animals Within assessment',
    motifCaption: 'animal archetypes',
    sectionEyebrow: 'EXPLORE THE EXPERIENCE',
    sectionTitle: 'Choose where you want to begin',
    features: {
      discovery: {
        eyebrow: 'THE EXPERIENCE',
        title: 'Discover the animal within you',
        description:
          'Answer twenty-four short questions to reveal your primary animal, secondary influence, and full profile.',
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
    instruction: 'Choose what reflects you most, not what you consider ideal.',
    questions: englishAssessmentQuestions,
    options: englishAssessmentOptions,
  },
  results: {
    primaryEyebrow: 'YOUR PRIMARY ANIMAL ARCHETYPE',
    matchStrength: 'Match strength',
    matchStrengthAccessibility: '{name}, match strength {score} percent',
    strengths: 'Strengths',
    watchOuts: 'Watch-outs',
    secondaryInfluence: 'Secondary influence',
    fullProfile: 'Your full profile',
    entertainmentModel: 'Entertainment model',
    modelExplanation:
      'Match strength belongs to this provisional entertainment model. It is not a scientific measurement or diagnosis.',
    rankingAccessibility: 'Full profile ranking of twelve animal archetypes',
    restart: 'Take the assessment again',
    restartHint: 'Clears this result and starts again from question one',
    returnHome: 'Return to Home',
    returnHomeHint: 'Returns to the Animals Within home dashboard',
    archetypes: {
      wolf: {
        name: 'Wolf',
        summary: 'Strategic, loyal, and independent.',
        description:
          'You protect the people you trust and work best when your purpose and boundaries are clear.',
        strengths: ['Strategic thinking', 'Loyalty', 'Persistence'],
        watchOuts: ['Closing the trusted circle too quickly', 'Holding too much control under pressure'],
      },
      owl: {
        name: 'Owl',
        summary: 'Observant, analytical, and thoughtful.',
        description:
          'You look for deeper meaning and reliable evidence before reaching a decision.',
        strengths: ['Analysis', 'Observation', 'Self-awareness'],
        watchOuts: ['Staying in analysis too long', 'Waiting for more certainty than needed'],
      },
      eagle: {
        name: 'Eagle',
        summary: 'Visionary, decisive, and goal-oriented.',
        description:
          'You see the bigger picture, set an ambitious direction, and readily take initiative.',
        strengths: ['Vision', 'Leadership', 'Decisiveness'],
        watchOuts: ['Moving faster than others can follow', 'Passing over useful details under pressure'],
      },
      dolphin: {
        name: 'Dolphin',
        summary: 'Social, adaptable, and emotionally aware.',
        description:
          'You create connection, read the room, and help groups work together effectively.',
        strengths: ['Communication', 'Empathy', 'Adaptability'],
        watchOuts: ['Smoothing tension before the issue is clear', 'Looking outward for reassurance under pressure'],
      },
      bear: {
        name: 'Bear',
        summary: 'Steady, protective, and practical.',
        description:
          'You create safety for others and stay grounded when circumstances become difficult.',
        strengths: ['Resilience', 'Protection', 'Stability'],
        watchOuts: ['Holding familiar ground too firmly', 'Taking longer to trust necessary change'],
      },
      lion: {
        name: 'Lion',
        summary: 'Visible, energetic, and ready to lead.',
        description: 'You bring assurance and momentum to shared situations, especially when a clear direction is needed.',
        strengths: ['Visible leadership', 'Courage to act', 'Expressive energy'],
        watchOuts: ['Moving before quieter views emerge', 'Carrying too much responsibility under pressure'],
      },
      fox: {
        name: 'Fox',
        summary: 'Adaptable, resourceful, and experimentally minded.',
        description: 'You notice practical openings, change tactics quickly, and enjoy finding an unexpected route forward.',
        strengths: ['Tactical intelligence', 'Adaptability', 'Resourcefulness'],
        watchOuts: ['Changing direction too often', 'Leaving useful structure behind'],
      },
      panther: {
        name: 'Panther',
        summary: 'Independent, focused, and quietly intense.',
        description: 'You prefer self-directed movement, protect your concentration, and act with measured personal conviction.',
        strengths: ['Focused action', 'Self-direction', 'Composure'],
        watchOuts: ['Sharing intentions too late', 'Withdrawing when collaboration could help'],
      },
      elephant: {
        name: 'Elephant',
        summary: 'Patient, community-minded, and responsible.',
        description: 'You remember what matters to people, value continuity, and help shared commitments endure over time.',
        strengths: ['Collective care', 'Long memory', 'Dependable planning'],
        watchOuts: ['Holding on to familiar patterns', 'Taking on the concerns of too many people'],
      },
      horse: {
        name: 'Horse',
        summary: 'Open, energetic, and drawn to freedom.',
        description: 'You create momentum through movement, exploration, and an optimistic willingness to try a new path.',
        strengths: ['Momentum', 'Openness', 'Exploratory energy'],
        watchOuts: ['Outpacing practical preparation', 'Feeling constrained by necessary routines'],
      },
      turtle: {
        name: 'Turtle',
        summary: 'Patient, consistent, and careful with boundaries.',
        description: 'You protect a sustainable pace, prepare thoroughly, and build trust through steady progress.',
        strengths: ['Patience', 'Consistency', 'Long-term steadiness'],
        watchOuts: ['Waiting after enough is known', 'Protecting boundaries so firmly that options narrow'],
      },
      octopus: {
        name: 'Octopus',
        summary: 'Inventive, analytical, and highly flexible.',
        description: 'You connect patterns across complex situations and can reshape your approach without losing the larger idea.',
        strengths: ['Complex problem-solving', 'Pattern recognition', 'Creative flexibility'],
        watchOuts: ['Exploring too many paths at once', 'Making a simple answer more complex than needed'],
      },
    },
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
        title: 'Answer 24 questions',
        description: 'Choose one response in each situation. Three questions contribute to each of eight editorial dimensions.',
      },
      {
        title: 'Build an eight-dimension profile',
        description:
          'Your local profile is compared equally with twelve provisional animal vectors, with no AI or external scoring service.',
      },
      {
        title: 'See your complete ranking',
        description:
          'The closest match becomes your primary animal, followed by a secondary influence and the full twelve-animal ranking.',
      },
    ],
    disclosureTitle: 'Important to know',
    disclosures: [
      'The questions and archetype vectors are editorial and provisional.',
      'The scoring is deterministic and runs locally on your device.',
      'The experience is an entertainment self-discovery framework.',
      'It is not diagnostic, scientific, or validated testing.',
    ],
    action: 'Start discovery',
    actionHint: 'Starts the twenty-four-question Animals Within assessment',
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
  footer: {
    accessibilityLabel: 'Animals Within information and links',
    compactDisclaimer: 'Entertainment self-discovery — not a psychological diagnosis or scientifically validated assessment.',
    navigationLabel: 'Footer links and build information',
    feedbackLabel: 'Feedback',
    feedbackAccessibilityLabel: 'Send feedback by email',
    ecosystemLabel: 'Markellos Ecosystem',
    ecosystemCompactLabel: 'Ecosystem',
    ecosystemAccessibilityLabel: 'Return to Markellos Ecosystem',
    buildAccessibilityLabel: 'Application build version',
  },
} satisfies TranslationContent;
