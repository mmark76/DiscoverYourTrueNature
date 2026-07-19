import type {
  ShortAssessmentOptionId,
  ShortAssessmentQuestionId,
} from '../../features/assessment/data/shortQuestions';

export const greekShortAssessmentQuestions = {
  'short-q01-social-setting':
    'Σε μια παρέα όπου γνωρίζεις λίγα άτομα, τι κάνεις συνήθως;',
  'short-q02-group-conversation':
    'Όταν μιλούν πολλά άτομα μαζί, πώς συμμετέχεις στην κουβέντα;',
  'short-q03-new-people':
    'Όταν συναντάς καινούργια άτομα, πώς ξεκινάς συνήθως;',
  'short-q04-noticing-feelings':
    'Όταν θέλεις να καταλάβεις πώς νιώθει κάποιος, τι προσέχεις περισσότερο;',
  'short-q05-supporting-someone':
    'Ένα κοντινό σου άτομο είναι στενοχωρημένο. Πώς το στηρίζεις συνήθως;',
  'short-q06-handling-tension':
    'Υπάρχει ένταση ανάμεσα σε δύο άτομα. Τι κάνεις πρώτα για να βοηθήσεις;',
  'short-q07-imagining-possibilities':
    'Όταν σκέφτεσαι νέες δυνατότητες για κάτι γνωστό, τι σου έρχεται πιο φυσικά;',
  'short-q08-creative-start':
    'Όταν ξεκινάς κάτι δημιουργικό, από πού προτιμάς να αρχίσεις;',
  'short-q09-story-ideas':
    'Όταν σκέφτεσαι μια ιδέα για ιστορία, τι σου αρέσει περισσότερο;',
  'short-q10-solving-problem':
    'Όταν αντιμετωπίζεις ένα πρακτικό πρόβλημα, πώς ξεκινάς;',
  'short-q11-making-plan':
    'Όταν φτιάχνεις σχέδιο για μια γεμάτη μέρα, τι σε βοηθά περισσότερο;',
  'short-q12-checking-work':
    'Όταν ελέγχεις αν η δουλειά σου έγινε σωστά, τι προτιμάς;',
  'short-separator-sociability-quiet-group':
    'Βρίσκεσαι σε μια μικρή παρέα και η κουβέντα σταματά. Τι κάνεις συνήθως;',
  'short-separator-sociability-shared-idea':
    'Έχεις μια ιδέα ενώ δουλεύεις με άλλα άτομα. Πώς τη μοιράζεσαι συνήθως;',
  'short-separator-emotional-upset-friend':
    'Ένα άτομο που γνωρίζεις καλά φαίνεται στενοχωρημένο, αλλά δεν λέει τον λόγο. Πώς δείχνεις τη στήριξή σου;',
  'short-separator-emotional-fair-choice':
    'Δύο άτομα θέλουν διαφορετικά πράγματα και νιώθουν ότι δεν τα ακούνε. Τι κάνεις πρώτα για να βοηθήσεις;',
  'short-separator-creativity-unfamiliar-object':
    'Σου δίνουν ένα απλό αντικείμενο για μια δημιουργική δραστηριότητα. Τι φαντάζεσαι πρώτα;',
  'short-separator-creativity-new-route':
    'Χρειάζεσαι έναν νέο τρόπο να παρουσιάσεις ένα γνωστό θέμα. Τι δοκιμάζεις πρώτα;',
  'short-separator-practicality-busy-day':
    'Πρέπει να κάνεις πολλές χρήσιμες δουλειές την ίδια μέρα. Πώς διαλέγεις από πού θα αρχίσεις;',
  'short-separator-practicality-unclear-task':
    'Σου δίνουν μια δουλειά χωρίς σαφείς οδηγίες. Πώς βρίσκεις τι πρέπει να κάνεις;',
} satisfies Record<ShortAssessmentQuestionId, string>;

export const greekShortAssessmentOptions = {
  'short-q01-social-setting-a':
    'Πιάνεις κουβέντα με διάφορα άτομα.',
  'short-q01-social-setting-b':
    'Μιλάς περισσότερο με ένα ή δύο άτομα που ήδη γνωρίζεις.',
  'short-q02-group-conversation-a':
    'Ακούς πρώτα πώς προχωρά η κουβέντα και μιλάς την κατάλληλη στιγμή.',
  'short-q02-group-conversation-b':
    'Λες τη σκέψη σου νωρίς και την ξεκαθαρίζεις μέσα από την κουβέντα.',
  'short-q03-new-people-a':
    'Κάνεις ερωτήσεις και μοιράζεσαι κάτι για σένα.',
  'short-q03-new-people-b':
    'Παρατηρείς πρώτα το κλίμα και μπαίνεις σιγά σιγά στην κουβέντα.',
  'short-q04-noticing-feelings-a':
    'Τον τόνο της φωνής, τις εκφράσεις του προσώπου και τη συμπεριφορά.',
  'short-q04-noticing-feelings-b':
    'Τα λόγια και τις απαντήσεις σε ήρεμες, άμεσες ερωτήσεις.',
  'short-q05-supporting-someone-a':
    'Κάνεις ήρεμες ερωτήσεις για να βοηθήσεις το άτομο να πει τι νιώθει και τι χρειάζεται.',
  'short-q05-supporting-someone-b':
    'Ακούς με προσοχή και του δίνεις χρόνο να πει τα συναισθήματά του με τον δικό του τρόπο.',
  'short-q06-handling-tension-a':
    'Προσπαθείς να καταλάβεις τι νιώθει και τι χρειάζεται κάθε άτομο.',
  'short-q06-handling-tension-b':
    'Βοηθάς τα δύο άτομα να ηρεμήσουν και να μιλήσουν με τη σειρά, χωρίς να διακόπτουν.',
  'short-q07-imagining-possibilities-a':
    'Βρίσκεις πολλές απρόσμενες ιδέες.',
  'short-q07-imagining-possibilities-b':
    'Αναπτύσσεις μία καλή ιδέα με πολλές λεπτομέρειες.',
  'short-q08-creative-start-a':
    'Αρχίζεις από ένα αληθινό παράδειγμα ή γνωστό υλικό και του δίνεις νέα μορφή.',
  'short-q08-creative-start-b':
    'Αρχίζεις από μια εικόνα ή ένα συναίσθημα και βλέπεις πού θα σε πάει.',
  'short-q09-story-ideas-a':
    'Φτιάχνεις έναν κόσμο ή ένα γεγονός που δεν μοιάζει με όσα έχεις δει.',
  'short-q09-story-ideas-b':
    'Μετατρέπεις κάτι που έχεις δει ή ζήσει σε κάτι καινούργιο.',
  'short-q10-solving-problem-a':
    'Μαζεύεις τα στοιχεία και συγκρίνεις τις πιθανές αιτίες πριν δράσεις.',
  'short-q10-solving-problem-b':
    'Δοκιμάζεις γρήγορα μια λογική λύση και την αλλάζεις ανάλογα με το αποτέλεσμα.',
  'short-q11-making-plan-a':
    'Ορίζεις τον βασικό στόχο και τις προτεραιότητες και αλλάζεις σειρά όταν χρειάζεται.',
  'short-q11-making-plan-b':
    'Βάζεις όλες τις δουλειές σε συγκεκριμένη σειρά από πριν.',
  'short-q12-checking-work-a':
    'Χρησιμοποιείς μια λίστα και ελέγχεις κάθε μέρος ένα ένα.',
  'short-q12-checking-work-b':
    'Δοκιμάζεις όλο το αποτέλεσμα όπως θα χρησιμοποιηθεί στην πράξη και διορθώνεις ό,τι δεν δουλεύει.',

  'short-separator-sociability-quiet-group-a':
    'Ανοίγεις ένα νέο θέμα και καλείς όλους να πάρουν μέρος.',
  'short-separator-sociability-quiet-group-b':
    'Παρατηρείς την παρέα και συνεχίζεις όταν έρθει η κατάλληλη στιγμή.',
  'short-separator-sociability-shared-idea-a':
    'Τη σκέφτεσαι πρώτα και μετά την εξηγείς καθαρά στην ομάδα.',
  'short-separator-sociability-shared-idea-b':
    'Τη μοιράζεσαι από την αρχή και την αναπτύσσεις μαζί με τους άλλους μέσα από την κουβέντα.',
  'short-separator-emotional-upset-friend-a':
    'Το ρωτάς ήρεμα αν θέλει να μιλήσει και ακούς χωρίς να το πιέζεις.',
  'short-separator-emotional-upset-friend-b':
    'Μένεις κοντά του ή κάνετε κάτι ήρεμο μαζί, μέχρι να θελήσει να μιλήσει.',
  'short-separator-emotional-fair-choice-a':
    'Ακούς το κάθε άτομο χωριστά, ώστε και τα δύο να πουν πώς νιώθουν για την κατάσταση.',
  'short-separator-emotional-fair-choice-b':
    'Τα βοηθάς να μιλήσουν μαζί και να καταλάβουν πώς νιώθει και τι χρειάζεται το άλλο άτομο.',
  'short-separator-creativity-unfamiliar-object-a':
    'Πολλούς τελείως διαφορετικούς τρόπους να χρησιμοποιηθεί το αντικείμενο.',
  'short-separator-creativity-unfamiliar-object-b':
    'Έναν ρόλο βγαλμένο από τη φαντασία, με πολλές ζωντανές λεπτομέρειες.',
  'short-separator-creativity-new-route-a':
    'Συνδυάζεις γνωστά παραδείγματα με έναν νέο και απρόσμενο τρόπο.',
  'short-separator-creativity-new-route-b':
    'Χρησιμοποιείς μια απρόσμενη ιστορία ή εικόνα για να δείξεις τη βασική ιδέα.',
  'short-separator-practicality-busy-day-a':
    'Συγκρίνεις τη σημασία και τον διαθέσιμο χρόνο και μετά βάζεις τις δουλειές σε σειρά.',
  'short-separator-practicality-busy-day-b':
    'Αρχίζεις με τη δουλειά που βοηθά περισσότερο τώρα και μετά ξαναβλέπεις τι ακολουθεί.',
  'short-separator-practicality-unclear-task-a':
    'Φτιάχνεις γρήγορα ένα πρώτο δείγμα και χρησιμοποιείς το αποτέλεσμα για το επόμενο βήμα.',
  'short-separator-practicality-unclear-task-b':
    'Τη χωρίζεις σε μικρά βήματα και ελέγχεις κάθε βήμα καθώς προχωράς.',
} satisfies Record<ShortAssessmentOptionId, string>;
