import type { NavigableScreen } from '../../../app/navigation';

export interface HomeFeature {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    label: string;
    screen: NavigableScreen;
  };
}

export const homeFeatures: readonly HomeFeature[] = [
  {
    id: 'discovery',
    eyebrow: 'Η ΕΜΠΕΙΡΙΑ',
    title: 'Ανακάλυψε το ζώο μέσα σου',
    description:
      'Απάντησε σε σύντομες ερωτήσεις και δες το κύριο και το δευτερεύον ζωικό σου αρχέτυπο.',
    action: { label: 'Ξεκίνα τώρα', screen: 'assessment' },
  },
  {
    id: 'animals',
    eyebrow: 'ΤΑ ΑΡΧΕΤΥΠΑ',
    title: 'Γνώρισε τα 12 ζώα',
    description:
      'Δες τα ζώα που αποτελούν τον κόσμο του Animals Within και τι συμβολίζει προσωρινά το καθένα.',
    action: { label: 'Δες τα 12 ζώα', screen: 'animals' },
  },
  {
    id: 'how-it-works',
    eyebrow: 'ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ',
    title: 'Πώς προκύπτει το αποτέλεσμα',
    description:
      'Μάθε πώς οι επιλογές σου συνδέονται με τα ζωικά αρχέτυπα της ψυχαγωγικής εμπειρίας.',
    action: { label: 'Μάθε περισσότερα', screen: 'how-it-works' },
  },
  {
    id: 'compare',
    eyebrow: 'ΣΥΓΚΡΙΣΗ',
    title: 'Σύγκρινε δύο αποτελέσματα',
    description: 'Μια μελλοντική εμπειρία για φίλους, ζευγάρια και οικογένειες.',
  },
  {
    id: 'share',
    eyebrow: 'ΚΟΙΝΟΠΟΙΗΣΗ',
    title: 'Μοιράσου το ζώο σου',
    description: 'Δημιούργησε μια εικόνα αποτελέσματος που θα μπορείς να μοιραστείς.',
  },
  {
    id: 'feedback',
    eyebrow: 'ΒΟΗΘΗΣΕ ΤΗ ΔΟΚΙΜΗ',
    title: 'Στείλε feedback',
    description:
      'Πες μας αν το αποτέλεσμα σε εξέφρασε, ποιες ερωτήσεις σε δυσκόλεψαν και αν θα το έστελνες σε φίλο.',
  },
];
