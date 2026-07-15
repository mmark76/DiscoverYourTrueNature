import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppFooter } from '../../../shared/components/AppFooter';
import { theme } from '../../../shared/styles/theme';
import { provisionalAnimals } from '../data/animals';
import { AnimalCard } from './AnimalCard';

export function AnimalsScreen() {
  const { width } = useWindowDimensions();
  const cardWidth: `${number}%` = width >= 1050 ? '32%' : width >= 650 ? '48.7%' : '100%';

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <View style={styles.content}>
        <View style={styles.introduction}>
          <Text style={styles.eyebrow}>ΤΑ ΠΡΟΣΩΡΙΝΑ ΑΡΧΕΤΥΠΑ</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Τα 12 Ζώα
          </Text>
          <Text style={styles.description}>
            Γνώρισε τον υπό διαμόρφωση κόσμο του Animals Within. Τα πρώτα πέντε ζώα
            συμμετέχουν στο σημερινό prototype· τα υπόλοιπα επτά παρουσιάζονται μόνο ως
            μελλοντική κατεύθυνση.
          </Text>
        </View>

        <View style={styles.grid}>
          {provisionalAnimals.map((animal, index) => (
            <AnimalCard key={animal.id} animal={animal} index={index} width={cardWidth} />
          ))}
        </View>

        <Text style={styles.note}>
          Οι περιγραφές είναι προσωρινές και ψυχαγωγικές. Τα ζώα με ένδειξη «Προσεχώς» δεν
          μπορούν να προκύψουν ως αποτέλεσμα της τρέχουσας αξιολόγησης.
        </Text>
      </View>
      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    alignSelf: 'center',
    gap: theme.spacing.xl,
    maxWidth: 1280,
    padding: theme.spacing.lg,
    width: '100%',
  },
  introduction: {
    gap: theme.spacing.sm,
    maxWidth: 760,
  },
  eyebrow: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 47,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 17,
    lineHeight: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  note: {
    backgroundColor: theme.colors.accentMuted,
    borderRadius: theme.radius.md,
    color: '#6E422B',
    fontSize: 13,
    lineHeight: 20,
    padding: theme.spacing.md,
  },
});
