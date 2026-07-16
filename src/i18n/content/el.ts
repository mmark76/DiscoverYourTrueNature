import type { TranslationContent } from '../translationTypes';
import { greekAssessmentOptions, greekAssessmentQuestions } from './assessment.el.ts';

export const greekContent = {
  common: {
    productName: 'Animals Within',
    selectedLanguageName: 'Ελληνικά',
  },
  header: {
    home: 'Αρχική',
    discover: 'Ανακάλυψη',
    animals: 'Τα 12 Ζώα',
    howItWorks: 'Πώς Λειτουργεί',
    settings: 'Ρυθμίσεις',
    feedback: 'Feedback',
    navigationLabel: 'Κύρια πλοήγηση',
    brandHomeLabel: 'Animals Within, μετάβαση στην Αρχική',
    languageLabel: 'Επιλογή γλώσσας',
    greekLanguage: 'Ελληνικά',
    englishLanguage: 'Αγγλικά',
    ecosystemLink: 'Markellos Ecosystem',
    feedbackAccessibilityLabel: 'Αποστολή σχολίων μέσω email',
  },
  home: {
    heroEyebrow: 'ΜΙΑ ΨΥΧΑΓΩΓΙΚΗ ΕΞΕΡΕΥΝΗΣΗ',
    heroSubtitle: 'Ανακάλυψε το ζωικό σου αρχέτυπο.',
    heroDescription:
      'Μια σύντομη ψυχαγωγική εμπειρία που εξερευνά τον τρόπο που αποφασίζεις, συνεργάζεσαι και αντιδράς.',
    heroAction: 'Ξεκίνα την ανακάλυψη',
    heroActionHint: 'Ξεκινά την αξιολόγηση είκοσι πέντε ερωτήσεων του Animals Within',
    motifCaption: 'ζωικά αρχέτυπα',
    sectionEyebrow: 'ΕΞΕΡΕΥΝΗΣΕ ΤΗΝ ΕΜΠΕΙΡΙΑ',
    sectionTitle: 'Διάλεξε πού θέλεις να ξεκινήσεις',
    features: {
      discovery: {
        eyebrow: 'Η ΕΜΠΕΙΡΙΑ',
        title: 'Ανακάλυψε το ζώο μέσα σου',
        description:
          'Απάντησε σε είκοσι πέντε σύντομες ερωτήσεις και ανακάλυψε το πρωτεύον και το δευτερεύον ζώο σου.',
        actionLabel: 'Ξεκίνα τώρα',
      },
      animals: {
        eyebrow: 'ΤΑ ΑΡΧΕΤΥΠΑ',
        title: 'Γνώρισε τα 12 ζώα',
        description:
          'Εξερεύνησε τα ζώα του κόσμου του Animals Within και τις ποιότητες που αντιπροσωπεύει το καθένα.',
        actionLabel: 'Δες τα 12 ζώα',
      },
      'how-it-works': {
        eyebrow: 'ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ',
        title: 'Δες πώς προκύπτει το αποτέλεσμα',
        description:
          'Μάθε πώς οι επιλογές σου συνδέονται με τα ζωικά αρχέτυπα αυτής της ψυχαγωγικής εμπειρίας.',
        actionLabel: 'Μάθε περισσότερα',
      },
    },
  },
  assessment: {
    eyebrow: 'ΑΝΑΚΑΛΥΨΕ ΤΟ ΖΩΙΚΟ ΣΟΥ ΑΡΧΕΤΥΠΟ',
    counter: 'Ερώτηση {current} από {total}',
    progressLabel: 'Πρόοδος αξιολόγησης: ερώτηση {current} από {total}',
    introduction: 'Απάντησε αυθόρμητα. Διάλεξε αυτό που σου ταιριάζει περισσότερο, χωρίς να το σκεφτείς πολύ.',
    questions: greekAssessmentQuestions,
    options: greekAssessmentOptions,
  },
  results: {
    primaryAnimal: 'Πρωτεύον ζώο',
    secondaryAnimal: 'Δευτερεύον ζώο',
    restart: 'Κάνε το ξανά',
    restartHint: 'Διαγράφει αυτή την αξιολόγηση και ξεκινά ξανά από την πρώτη ερώτηση',
  },
  animals: {
    eyebrow: 'ΤΑ ΔΩΔΕΚΑ ΑΡΧΕΤΥΠΑ',
    title: 'Τα 12 Ζώα',
    introduction:
      'Γνώρισε τα δώδεκα ζωικά αρχέτυπα που χρησιμοποιεί η αξιολόγηση Animals Within.',
    catalogNote:
      'Οι περιγραφές και τα προφίλ είναι προσωρινά, μόνο για ψυχαγωγία και όχι για διάγνωση.',
    cardAccessibility: '{name}, ζωικό αρχέτυπο',
    records: {
      wolf: {
        name: 'Λύκος',
        traits: 'αφοσίωση και στρατηγική',
        description: 'Κινείται με σκοπό, προστατεύει τους δεσμούς εμπιστοσύνης και εκτιμά την ανεξαρτησία.',
      },
      owl: {
        name: 'Κουκουβάγια',
        traits: 'ανάλυση και παρατήρηση',
        description: 'Κοιτάζει κάτω από την επιφάνεια και προτιμά προσεκτικές επιλογές που βασίζονται σε δεδομένα.',
      },
      eagle: {
        name: 'Αετός',
        traits: 'φιλοδοξία και αποφασιστικότητα',
        description: 'Βλέπει τον ευρύτερο ορίζοντα, παίρνει πρωτοβουλία και στοχεύει ψηλά.',
      },
      dolphin: {
        name: 'Δελφίνι',
        traits: 'επικοινωνία και σύνδεση',
        description: 'Χτίζει γρήγορα σχέσεις και φέρνει ενσυναίσθηση, ενέργεια και συνεργασία.',
      },
      bear: {
        name: 'Αρκούδα',
        traits: 'προστασία και σταθερότητα',
        description: 'Δημιουργεί ασφάλεια, παραμένει γειωμένη και προσφέρει σταθερή πρακτική στήριξη.',
      },
      lion: {
        name: 'Λιοντάρι',
        traits: 'ηγεσία και αυτοπεποίθηση',
        description: 'Αντιπροσωπεύει το ορατό θάρρος, την παρουσία και την ευθύνη για την ομάδα.',
      },
      fox: {
        name: 'Αλεπού',
        traits: 'προσαρμοστικότητα και ευστροφία',
        description: 'Βρίσκει έξυπνες διαδρομές μέσα στην αλλαγή και ανταποκρίνεται με ευέλικτη σκέψη.',
      },
      panther: {
        name: 'Πάνθηρας',
        traits: 'ανεξαρτησία και εσωτερική δύναμη',
        description: 'Αντιπροσωπεύει την ήρεμη αυτοπεποίθηση, την αυτονομία και τη μελετημένη δράση.',
      },
      elephant: {
        name: 'Ελέφαντας',
        traits: 'μνήμη, ενσυναίσθηση και υπευθυνότητα',
        description: 'Εκτιμά τους σταθερούς δεσμούς, την κοινή ιστορία και τη φροντίδα της ευρύτερης κοινότητας.',
      },
      horse: {
        name: 'Άλογο',
        traits: 'ελευθερία και ενέργεια',
        description: 'Αντιπροσωπεύει την ορμή, την ανοιχτή διάθεση και την ανάγκη εξερεύνησης νέου εδάφους.',
      },
      turtle: {
        name: 'Χελώνα',
        traits: 'υπομονή και επιμονή',
        description: 'Κινείται με βιώσιμο ρυθμό και εμπιστεύεται τη σταθερή πρόοδο αντί για τη βιασύνη.',
      },
      octopus: {
        name: 'Χταπόδι',
        traits: 'δημιουργικότητα και πολυπλευρότητα',
        description: 'Προσεγγίζει σύνθετες καταστάσεις από πολλές πλευρές και επινοεί νέες επιλογές.',
      },
    },
  },
  howItWorks: {
    eyebrow: 'ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ',
    title: 'Ένα τοπικό, διαφανές ψυχαγωγικό μοντέλο',
    introduction:
      'Το Animals Within συγκρίνει τις απαντήσεις σου με δώδεκα προσωρινά ζωικά αρχέτυπα, χρησιμοποιώντας ένα ντετερμινιστικό μοντέλο που λειτουργεί στη συσκευή σου.',
    steps: [
      {
        title: 'Απάντησε σε γρήγορες ερωτήσεις',
        description: 'Διάλεξε μία αυθόρμητη απάντηση σε ποικίλες καθημερινές καταστάσεις και πιο ανάλαφρες προτιμήσεις.',
      },
      {
        title: 'Ολοκλήρωσε και τις 25 επιλογές',
        description:
          'Οι επιλογές σου μένουν στη συσκευή σου, ενώ το τοπικό μοντέλο τις συνδυάζει σε ένα ενιαίο μοτίβο αντιστοίχισης.',
      },
      {
        title: 'Δες τα δύο ζώα σου',
        description:
          'Η κοντινότερη αντιστοίχιση γίνεται το πρωτεύον ζώο και η επόμενη διαφορετική αντιστοίχιση γίνεται το δευτερεύον.',
      },
    ],
    disclosureTitle: 'Σημαντικό να γνωρίζεις',
    disclosures: [
      'Οι ερωτήσεις και τα ζωικά προφίλ είναι πρωτότυπα, συντακτικά και προσωρινά.',
      'Η βαθμολόγηση είναι ντετερμινιστική και λειτουργεί τοπικά στη συσκευή σου.',
      'Η εμπειρία είναι ένα ψυχαγωγικό πλαίσιο αυτογνωσίας.',
      'Δεν αποτελεί διαγνωστικό, επιστημονικό ή επικυρωμένο τεστ.',
    ],
    action: 'Ξεκίνα την ανακάλυψη',
    actionHint: 'Ξεκινά την αξιολόγηση είκοσι πέντε ερωτήσεων του Animals Within',
  },
  settings: {
    title: 'Ρυθμίσεις εμφάνισης',
    description: 'Προσάρμοσε τη γλώσσα, τα χρώματα και την ανάγνωση χωρίς να χάσεις την πρόοδό σου.',
    language: 'Γλώσσα',
    greek: 'Ελληνικά',
    english: 'Αγγλικά',
    appearanceMode: 'Εμφάνιση',
    system: 'Σύστημα',
    light: 'Φωτεινή',
    dark: 'Σκοτεινή',
    colorTheme: 'Χρωματικό θέμα',
    forest: 'Ζεστό Κρεμ',
    ocean: 'Ωκεανός',
    amber: 'Κεχριμπάρι',
    plum: 'Δαμάσκηνο',
    fontFamily: 'Γραμματοσειρά',
    systemSans: 'Σύγχρονη',
    serif: 'Κλασική',
    readable: 'Υψηλής αναγνωσιμότητας',
    textSize: 'Μέγεθος κειμένου',
    small: 'Μικρό',
    normal: 'Κανονικό',
    large: 'Μεγάλο',
    extraLarge: 'Πολύ μεγάλο',
    preview: 'Άμεση προεπισκόπηση',
    previewTitle: 'Animals Within',
    previewBody: 'Ένα καθαρό δείγμα κειμένου με την επιλεγμένη γλώσσα και εμφάνιση.',
    reset: 'Επαναφορά προεπιλογών',
    resetPrompt: 'Να επανέλθουν όλες οι ρυθμίσεις εμφάνισης στις προεπιλογές;',
    confirmReset: 'Ναι, επαναφορά',
    cancel: 'Ακύρωση',
    back: 'Επιστροφή',
  },
  analyticsConsent: {
    title: 'Επιλογές analytics',
    description:
      'Βοήθησέ μας να κατανοήσουμε πώς χρησιμοποιείται η εφαρμογή. Τα analytics θα ενεργοποιηθούν μόνο με την άδειά σου. Οι απαντήσεις και τα αποτελέσματα του τεστ δεν θα αποστέλλονται ποτέ.',
    accept: 'Αποδοχή analytics',
    reject: 'Απόρριψη analytics',
    close: 'Κλείσιμο επιλογών analytics',
    bannerAccessibilityLabel: 'Επιλογές συγκατάθεσης analytics',
    dialogAccessibilityLabel: 'Αλλαγή επιλογών συγκατάθεσης analytics',
  },
  footer: {
    accessibilityLabel: 'Πληροφορίες και σύνδεσμοι του Animals Within',
    navigationLabel: 'Σύνδεσμοι υποσέλιδου και πληροφορίες έκδοσης',
    feedbackLabel: 'Feedback',
    feedbackAccessibilityLabel: 'Αποστολή σχολίων μέσω email',
    analyticsChoicesLabel: 'Επιλογές analytics',
    analyticsChoicesAccessibilityLabel: 'Άνοιγμα επιλογών συγκατάθεσης analytics',
    ecosystemLabel: 'Markellos Ecosystem',
    ecosystemAccessibilityLabel: 'Επιστροφή στο Markellos Ecosystem',
    buildAccessibilityLabel: 'Έκδοση κατασκευής εφαρμογής',
  },
} satisfies TranslationContent;
