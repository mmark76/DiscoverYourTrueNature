import { ScrollView, StyleSheet, View } from 'react-native';

import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppFooter } from '../../../shared/components/AppFooter';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';

interface HowItWorksScreenProps { onStart: () => void; }

const steps = [
  { number: '01', title: 'Απαντάς σε 10 ερωτήσεις', description: 'Επιλέγεις κάθε φορά την απάντηση που σε εκφράζει περισσότερο.' },
  { number: '02', title: 'Οι επιλογές προσθέτουν βαθμούς', description: 'Το τοπικό scoring είναι σταθερό και ντετερμινιστικό, χωρίς AI ή κρυφή ανάλυση.' },
  { number: '03', title: 'Βλέπεις δύο αρχέτυπα', description: 'Οι δύο υψηλότερες βαθμολογίες γίνονται το κύριο και το δευτερεύον αποτέλεσμα.' },
] as const;

export function HowItWorksScreen({ onStart }: HowItWorksScreenProps) {
  const { colors } = useAppearance();
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.content}>
        <View style={styles.introduction}>
          <AppText style={styles.eyebrow}>ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ</AppText>
          <AppText accessibilityRole="header" style={styles.title}>Ένα απλό, διαφανές prototype</AppText>
          <AppText style={styles.description}>Το Animals Within συνδέει τις επιλογές σου με πέντε ενεργά ζωικά αρχέτυπα και παρουσιάζει τις δύο υψηλότερες βαθμολογίες.</AppText>
        </View>
        <View style={styles.steps}>
          {steps.map((step) => (
            <View key={step.number} style={styles.step}>
              <AppText style={styles.stepNumber}>{step.number}</AppText>
              <AppText accessibilityRole="header" style={styles.stepTitle}>{step.title}</AppText>
              <AppText style={styles.stepDescription}>{step.description}</AppText>
            </View>
          ))}
        </View>
        <View style={styles.disclosure}>
          <AppText accessibilityRole="header" style={styles.disclosureTitle}>Σημαντικό να γνωρίζεις</AppText>
          <AppText style={styles.disclosureText}>• Οι σημερινές ερωτήσεις είναι πειραματικές.</AppText>
          <AppText style={styles.disclosureText}>• Η βαθμολόγηση είναι ντετερμινιστική.</AppText>
          <AppText style={styles.disclosureText}>• Η εμπειρία είναι ψυχαγωγική και διερευνητική.</AppText>
          <AppText style={styles.disclosureText}>• Δεν αποτελεί επιστημονική ή ψυχολογική αξιολόγηση και δεν παρέχει διάγνωση.</AppText>
        </View>
        <FocusablePressable accessibilityRole="button" onPress={onStart} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <AppText style={styles.buttonText}>Ξεκίνα την ανακάλυψη</AppText>
        </FocusablePressable>
      </PageContent>
      <AppFooter />
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    scrollContent: { flexGrow: 1 },
    content: { gap: theme.spacing.xl, paddingVertical: theme.spacing.lg },
    introduction: { gap: theme.spacing.sm, maxWidth: 760 },
    eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
    title: { color: colors.text, fontSize: 40, fontWeight: '900', lineHeight: 47 },
    description: { color: colors.mutedText, fontSize: 17, lineHeight: 26 },
    steps: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    step: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, flex: 1, gap: theme.spacing.sm, minWidth: 250, padding: theme.spacing.lg },
    stepNumber: { color: colors.accent, fontSize: 13, fontWeight: '900' },
    stepTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
    stepDescription: { color: colors.mutedText, fontSize: 15, lineHeight: 23 },
    disclosure: { backgroundColor: colors.warningSurface, borderRadius: theme.radius.md, gap: theme.spacing.xs, padding: theme.spacing.lg },
    disclosureTitle: { color: colors.warning, fontSize: 20, fontWeight: '800', marginBottom: theme.spacing.xs },
    disclosureText: { color: colors.text, fontSize: 15, lineHeight: 23 },
    button: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: theme.radius.sm, minHeight: 44, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm },
    buttonPressed: { backgroundColor: colors.primaryPressed },
    buttonText: { color: colors.onPrimary, fontSize: 15, fontWeight: '800' },
  });
}
