import { AssessmentQuestion } from '../types';

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'crisis-response',
    prompt: 'Μια ξαφνική κρίση βρίσκει την ομάδα απροετοίμαστη. Ποια είναι η πρώτη σου αντίδραση;',
    options: [
      {
        id: 'take-command',
        label: 'Αναλαμβάνω αμέσως την κατεύθυνση και μοιράζω ρόλους.',
        scores: { eagle: 2, wolf: 1 },
      },
      {
        id: 'observe-first',
        label: 'Παρατηρώ προσεκτικά και εντοπίζω την πραγματική αιτία.',
        scores: { owl: 2, bear: 1 },
      },
      {
        id: 'steady-people',
        label: 'Ηρεμώ τους ανθρώπους και δημιουργώ συνεργασία.',
        scores: { dolphin: 2, bear: 1 },
      },
    ],
  },
  {
    id: 'decision-style',
    prompt: 'Όταν πρέπει να πάρεις σημαντική απόφαση, τι εμπιστεύεσαι περισσότερο;',
    options: [
      {
        id: 'evidence',
        label: 'Τα δεδομένα, τις λεπτομέρειες και τη λογική ανάλυση.',
        scores: { owl: 2, bear: 1 },
      },
      {
        id: 'instinct',
        label: 'Το ένστικτο και την ικανότητά μου να κινηθώ γρήγορα.',
        scores: { eagle: 2, wolf: 1 },
      },
      {
        id: 'perspectives',
        label: 'Τις απόψεις των ανθρώπων που επηρεάζονται.',
        scores: { dolphin: 2, bear: 1 },
      },
    ],
  },
  {
    id: 'trust-circle',
    prompt: 'Πώς χτίζεις συνήθως σχέσεις εμπιστοσύνης;',
    options: [
      {
        id: 'small-circle',
        label: 'Με λίγους ανθρώπους, αλλά με μεγάλη αφοσίωση.',
        scores: { wolf: 2, bear: 1 },
      },
      {
        id: 'wide-network',
        label: 'Συνδέομαι εύκολα με διαφορετικούς ανθρώπους.',
        scores: { dolphin: 2, eagle: 1 },
      },
      {
        id: 'earned-respect',
        label: 'Η εμπιστοσύνη κερδίζεται μέσα από συνέπεια και ικανότητα.',
        scores: { owl: 1, eagle: 1, bear: 1 },
      },
    ],
  },
  {
    id: 'conflict',
    prompt: 'Όταν προκύπτει σοβαρή σύγκρουση, πώς αντιδράς;',
    options: [
      {
        id: 'direct',
        label: 'Αντιμετωπίζω το θέμα άμεσα και ξεκάθαρα.',
        scores: { eagle: 2, wolf: 1 },
      },
      {
        id: 'common-ground',
        label: 'Αναζητώ κοινό έδαφος και λύση που διατηρεί τις σχέσεις.',
        scores: { dolphin: 2, bear: 1 },
      },
      {
        id: 'analyze',
        label: 'Κάνω ένα βήμα πίσω για να καταλάβω όλες τις πλευρές.',
        scores: { owl: 2, wolf: 1 },
      },
    ],
  },
  {
    id: 'motivation',
    prompt: 'Ποιο είδος στόχου σε κινητοποιεί περισσότερο;',
    options: [
      {
        id: 'ambitious-goal',
        label: 'Ένας δύσκολος στόχος που απαιτεί τόλμη και υπέρβαση.',
        scores: { eagle: 2, wolf: 1 },
      },
      {
        id: 'mastery',
        label: 'Η βαθιά κατανόηση και η κατάκτηση μιας σύνθετης δεξιότητας.',
        scores: { owl: 2, wolf: 1 },
      },
      {
        id: 'protect-contribute',
        label: 'Η δημιουργία ασφάλειας και ουσιαστικής προσφοράς στους άλλους.',
        scores: { bear: 2, dolphin: 1 },
      },
    ],
  },
  {
    id: 'change',
    prompt: 'Πώς αντιμετωπίζεις μια μεγάλη και απρόβλεπτη αλλαγή;',
    options: [
      {
        id: 'explore',
        label: 'Τη βλέπω ως ευκαιρία και δοκιμάζω γρήγορα νέες κατευθύνσεις.',
        scores: { eagle: 2, dolphin: 1 },
      },
      {
        id: 'plan',
        label: 'Δημιουργώ σχέδιο, αξιολογώ κινδύνους και προχωρώ ελεγχόμενα.',
        scores: { wolf: 2, owl: 1 },
      },
      {
        id: 'stabilize',
        label: 'Διατηρώ ό,τι λειτουργεί και προστατεύω τη σταθερότητα.',
        scores: { bear: 2, owl: 1 },
      },
      {
        id: 'adapt-with-people',
        label: 'Προσαρμόζομαι μέσα από επικοινωνία και συνεργασία.',
        scores: { dolphin: 2, bear: 1 },
      },
    ],
  },
  {
    id: 'pressure',
    prompt: 'Όταν η πίεση αυξάνεται, ποια πλευρά σου εμφανίζεται εντονότερα;',
    options: [
      {
        id: 'command',
        label: 'Γίνομαι πιο αποφασιστικός και παίρνω τον έλεγχο.',
        scores: { eagle: 2, wolf: 1 },
      },
      {
        id: 'calm-analysis',
        label: 'Κλείνω τον θόρυβο και αναλύω ψύχραιμα το πρόβλημα.',
        scores: { owl: 2, bear: 1 },
      },
      {
        id: 'protect-team',
        label: 'Εστιάζω στους ανθρώπους και προσπαθώ να τους κρατήσω ενωμένους.',
        scores: { dolphin: 2, bear: 1 },
      },
    ],
  },
  {
    id: 'working-style',
    prompt: 'Σε ποιο περιβάλλον αποδίδεις καλύτερα;',
    options: [
      {
        id: 'deep-focus',
        label: 'Μόνος, με χρόνο για βαθιά συγκέντρωση.',
        scores: { owl: 2, wolf: 1 },
      },
      {
        id: 'trusted-team',
        label: 'Σε μικρή ομάδα ανθρώπων που εμπιστεύομαι.',
        scores: { wolf: 2, bear: 1 },
      },
      {
        id: 'dynamic-group',
        label: 'Σε δυναμικό περιβάλλον με ανταλλαγή ιδεών και ανθρώπινη επαφή.',
        scores: { dolphin: 2, eagle: 1 },
      },
    ],
  },
  {
    id: 'risk',
    prompt: 'Πώς σχετίζεσαι με τον κίνδυνο;',
    options: [
      {
        id: 'calculated-risk',
        label: 'Τον αποδέχομαι όταν η πιθανή ανταμοιβή αξίζει.',
        scores: { eagle: 2, wolf: 1 },
      },
      {
        id: 'evidence-first',
        label: 'Προχωρώ μόνο όταν έχω επαρκείς ενδείξεις και εναλλακτικό σχέδιο.',
        scores: { owl: 2, bear: 1 },
      },
      {
        id: 'human-impact',
        label: 'Εξαρτάται κυρίως από το πώς θα επηρεάσει τους ανθρώπους γύρω μου.',
        scores: { dolphin: 2, bear: 1 },
      },
    ],
  },
  {
    id: 'core-value',
    prompt: 'Ποια αξία αισθάνεσαι πιο κοντά στον πυρήνα σου;',
    options: [
      {
        id: 'freedom',
        label: 'Ελευθερία και ανεξαρτησία.',
        scores: { wolf: 2, eagle: 1 },
      },
      {
        id: 'truth',
        label: 'Αλήθεια και βαθιά κατανόηση.',
        scores: { owl: 2, eagle: 1 },
      },
      {
        id: 'connection',
        label: 'Σύνδεση και ουσιαστική προσφορά.',
        scores: { dolphin: 2, bear: 1 },
      },
      {
        id: 'security',
        label: 'Ασφάλεια και σταθερότητα.',
        scores: { bear: 2, wolf: 1 },
      },
    ],
  },
];
