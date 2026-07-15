import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFooter } from '../../../shared/components/AppFooter';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';

interface HowItWorksScreenProps {
  onStart: () => void;
}

const steps = [
  {
    number: '01',
    title: 'Απαντάς σε 10 ερωτήσεις',
    description: 'Επιλέγεις κάθε φορά την απάντηση που σε εκφράζει περισσότερο.',
  },
  {
    number: '02',
    title: 'Οι επιλογές προσθέτουν βαθμούς',
    description: 'Το τοπικό scoring είναι σταθερό και ντετερμινιστικό, χωρίς AI ή κρυφή ανάλυση.',
  },
  {
    number: '03',
    title: 'Βλέπεις δύο αρχέτυπα',
    description: 'Οι δύο υψηλότερες βαθμολογίες γίνονται το κύριο και το δευτερεύον αποτέλεσμα.',
  },
] as const;

export function HowItWorksScreen({ onStart }: HowItWorksScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.content}>
        <View style={styles.introduction}>
          <Text style={styles.eyebrow}>ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Ένα απλό, διαφανές prototype
          </Text>
          <Text style={styles.description}>
            Το Animals Within συνδέει τις επιλογές σου με πέντε ενεργά ζωικά αρχέτυπα και
            παρουσιάζει τις δύο υψηλότερες βαθμολογίες.
          </Text>
        </View>

        <View style={styles.steps}>
          {steps.map((step) => (
            <View key={step.number} style={styles.step}>
              <Text style={styles.stepNumber}>{step.number}</Text>
              <Text accessibilityRole="header" style={styles.stepTitle}>
                {step.title}
              </Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.disclosure}>
          <Text accessibilityRole="header" style={styles.disclosureTitle}>
            Σημαντικό να γνωρίζεις
          </Text>
          <Text style={styles.disclosureText}>• Οι σημερινές ερωτήσεις είναι πειραματικές.</Text>
          <Text style={styles.disclosureText}>• Η βαθμολόγηση είναι ντετερμινιστική.</Text>
          <Text style={styles.disclosureText}>• Η εμπειρία είναι ψυχαγωγική και διερευνητική.</Text>
          <Text style={styles.disclosureText}>
            • Δεν αποτελεί επιστημονική ή ψυχολογική αξιολόγηση και δεν παρέχει διάγνωση.
          </Text>
        </View>

        <FocusablePressable
          accessibilityRole="button"
          onPress={onStart}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Ξεκίνα την ανακάλυψη</Text>
        </FocusablePressable>
      </PageContent>
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
    gap: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
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
  steps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  step: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.sm,
    minWidth: 260,
    padding: theme.spacing.lg,
  },
  stepNumber: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: '900',
  },
  stepTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  stepDescription: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  disclosure: {
    backgroundColor: theme.colors.accentMuted,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
  },
  disclosureTitle: {
    color: '#603721',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
  },
  disclosureText: {
    color: '#6E422B',
    fontSize: 15,
    lineHeight: 23,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  buttonPressed: {
    backgroundColor: theme.colors.primaryPressed,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
