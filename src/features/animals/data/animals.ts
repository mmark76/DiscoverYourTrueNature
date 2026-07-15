export type AnimalAvailability = 'prototype' | 'coming-soon';

export interface ProvisionalAnimal {
  id: string;
  name: string;
  traits: string;
  availability: AnimalAvailability;
}

export const provisionalAnimals: readonly ProvisionalAnimal[] = [
  { id: 'wolf', name: 'Λύκος', traits: 'αφοσίωση και στρατηγική', availability: 'prototype' },
  { id: 'owl', name: 'Κουκουβάγια', traits: 'ανάλυση και παρατήρηση', availability: 'prototype' },
  { id: 'eagle', name: 'Αετός', traits: 'φιλοδοξία και αποφασιστικότητα', availability: 'prototype' },
  { id: 'dolphin', name: 'Δελφίνι', traits: 'επικοινωνία και κοινωνικότητα', availability: 'prototype' },
  { id: 'bear', name: 'Αρκούδα', traits: 'προστασία και σταθερότητα', availability: 'prototype' },
  { id: 'lion', name: 'Λιοντάρι', traits: 'ηγεσία και αυτοπεποίθηση', availability: 'coming-soon' },
  { id: 'fox', name: 'Αλεπού', traits: 'προσαρμοστικότητα και ευστροφία', availability: 'coming-soon' },
  { id: 'panther', name: 'Πάνθηρας', traits: 'ανεξαρτησία και εσωτερική δύναμη', availability: 'coming-soon' },
  {
    id: 'elephant',
    name: 'Ελέφαντας',
    traits: 'μνήμη, ενσυναίσθηση και υπευθυνότητα',
    availability: 'coming-soon',
  },
  { id: 'horse', name: 'Άλογο', traits: 'ελευθερία και ενέργεια', availability: 'coming-soon' },
  { id: 'turtle', name: 'Χελώνα', traits: 'υπομονή και επιμονή', availability: 'coming-soon' },
  {
    id: 'octopus',
    name: 'Χταπόδι',
    traits: 'δημιουργικότητα και πολυπλευρότητα',
    availability: 'coming-soon',
  },
];
