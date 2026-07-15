import { ScrollView, StyleSheet, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppFooter } from '../../../shared/components/AppFooter';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';

interface HowItWorksScreenProps { onStart: () => void; }

export function HowItWorksScreen({ onStart }: HowItWorksScreenProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.howItWorks;
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.content}>
        <View style={styles.introduction}>
          <AppText style={styles.eyebrow}>{copy.eyebrow}</AppText>
          <AppText accessibilityRole="header" style={styles.title}>{copy.title}</AppText>
          <AppText style={styles.description}>{copy.introduction}</AppText>
        </View>
        <View style={styles.steps}>
          {copy.steps.map((step, index) => (
            <View key={step.title} style={styles.step}>
              <AppText style={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</AppText>
              <AppText accessibilityRole="header" style={styles.stepTitle}>{step.title}</AppText>
              <AppText style={styles.stepDescription}>{step.description}</AppText>
            </View>
          ))}
        </View>
        <View style={styles.disclosure}>
          <AppText accessibilityRole="header" style={styles.disclosureTitle}>{copy.disclosureTitle}</AppText>
          {copy.disclosures.map((disclosure) => (
            <AppText key={disclosure} style={styles.disclosureText}>• {disclosure}</AppText>
          ))}
        </View>
        <FocusablePressable
          accessibilityHint={copy.actionHint}
          accessibilityRole="button"
          onPress={onStart}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <AppText style={styles.buttonText}>{copy.action}</AppText>
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
