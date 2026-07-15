import type { AppLanguage } from './appearanceTypes';

export type SettingsTranslationKey =
  | 'settings'
  | 'settingsTitle'
  | 'settingsDescription'
  | 'language'
  | 'greek'
  | 'english'
  | 'appearanceMode'
  | 'system'
  | 'light'
  | 'dark'
  | 'colorTheme'
  | 'forest'
  | 'ocean'
  | 'amber'
  | 'plum'
  | 'fontFamily'
  | 'systemSans'
  | 'serif'
  | 'readable'
  | 'textSize'
  | 'small'
  | 'normal'
  | 'large'
  | 'extraLarge'
  | 'preview'
  | 'previewTitle'
  | 'previewBody'
  | 'reset'
  | 'resetPrompt'
  | 'confirmReset'
  | 'cancel'
  | 'back'
  | 'home'
  | 'discover'
  | 'animals'
  | 'howItWorks'
  | 'feedback'
  | 'comingSoon'
  | 'navigationLabel'
  | 'status'
  | 'copyright'
  | 'entertainment'
  | 'notDiagnosis';

export const settingsTranslations: Record<
  AppLanguage,
  Record<SettingsTranslationKey, string>
> = {
  el: {
    settings: 'Ρυθμίσεις', settingsTitle: 'Ρυθμίσεις εμφάνισης',
    settingsDescription: 'Προσάρμοσε τη γλώσσα, τα χρώματα και την ανάγνωση χωρίς να χάσεις την πρόοδό σου.',
    language: 'Γλώσσα', greek: 'Ελληνικά', english: 'English', appearanceMode: 'Εμφάνιση',
    system: 'Σύστημα', light: 'Φωτεινή', dark: 'Σκοτεινή', colorTheme: 'Χρωματικό θέμα',
    forest: 'Δάσος', ocean: 'Ωκεανός', amber: 'Κεχριμπάρι', plum: 'Δαμάσκηνο',
    fontFamily: 'Γραμματοσειρά', systemSans: 'Σύγχρονη', serif: 'Κλασική',
    readable: 'Υψηλής αναγνωσιμότητας', textSize: 'Μέγεθος κειμένου', small: 'Μικρό',
    normal: 'Κανονικό', large: 'Μεγάλο', extraLarge: 'Πολύ μεγάλο', preview: 'Άμεση προεπισκόπηση',
    previewTitle: 'Animals Within', previewBody: 'Ένα καθαρό δείγμα κειμένου με το επιλεγμένο θέμα.',
    reset: 'Επαναφορά προεπιλογών', resetPrompt: 'Να επανέλθουν όλες οι ρυθμίσεις εμφάνισης στις προεπιλογές;',
    confirmReset: 'Ναι, επαναφορά', cancel: 'Ακύρωση', back: 'Επιστροφή', home: 'Αρχική',
    discover: 'Ανακάλυψη', animals: 'Τα 12 Ζώα', howItWorks: 'Πώς Λειτουργεί', feedback: 'Feedback',
    comingSoon: 'Προσεχώς', navigationLabel: 'Κύρια πλοήγηση', status: 'Κατάσταση',
    copyright: '© 2026 Markellos Markides. All rights reserved.',
    entertainment: 'Ψυχαγωγική εμπειρία αυτογνωσίας.',
    notDiagnosis: 'Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονική αξιολόγηση.',
  },
  en: {
    settings: 'Settings', settingsTitle: 'Appearance settings',
    settingsDescription: 'Adjust language, color, and readability without losing your progress.',
    language: 'Language', greek: 'Ελληνικά', english: 'English', appearanceMode: 'Appearance',
    system: 'System', light: 'Light', dark: 'Dark', colorTheme: 'Color theme',
    forest: 'Forest', ocean: 'Ocean', amber: 'Amber', plum: 'Plum', fontFamily: 'Font family',
    systemSans: 'System Sans', serif: 'Serif', readable: 'Highly Readable', textSize: 'Text size',
    small: 'Small', normal: 'Normal', large: 'Large', extraLarge: 'Extra Large',
    preview: 'Live preview', previewTitle: 'Animals Within',
    previewBody: 'A clear text sample using the selected appearance.', reset: 'Reset to defaults',
    resetPrompt: 'Reset every appearance setting to its documented default?', confirmReset: 'Yes, reset',
    cancel: 'Cancel', back: 'Back', home: 'Home', discover: 'Discover', animals: 'The 12 Animals',
    howItWorks: 'How It Works', feedback: 'Feedback', comingSoon: 'Coming soon',
    navigationLabel: 'Primary navigation', status: 'Status', copyright: '© 2026 Markellos Markides. All rights reserved.',
    entertainment: 'An entertainment experience for self-exploration.',
    notDiagnosis: 'Not a psychological diagnosis or scientific assessment.',
  },
};

export function getSettingsLabel(
  language: AppLanguage,
  key: SettingsTranslationKey,
): string {
  return settingsTranslations[language][key];
}
