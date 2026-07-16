import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';
import type { AnimalData } from '../../animals/data/animals';

interface ResultScreenProps {
  primaryAnimal: AnimalData;
  secondaryAnimal: AnimalData;
  hasBalancedDimensions: boolean;
  onOpenCatalogue: () => void;
  onRestart: () => void;
}

export function ResultScreen({
  primaryAnimal,
  secondaryAnimal,
  hasBalancedDimensions,
  onOpenCatalogue,
  onRestart,
}: ResultScreenProps) {
  const revealHeadingRef = useRef<View>(null);
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.results;
  const primaryCopy = content.animals.records[primaryAnimal.id];
  const secondaryCopy = content.animals.records[secondaryAnimal.id];
  const revealAccessibilityLabel = formatTranslation(copy.revealAccessibilityLabel, {
    primary: primaryCopy.name,
    secondary: secondaryCopy.name,
  });
  const relationshipDescription = formatTranslation(copy.relationshipDescription, {
    primary: primaryCopy.name,
    secondary: secondaryCopy.name,
    secondaryDescription: secondaryCopy.description,
  });
  const styles = createStyles(colors);

  useEffect(() => {
    revealHeadingRef.current?.focus();
  }, [primaryAnimal.id, secondaryAnimal.id]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.page}>
        <View style={styles.result}>
          <View
            accessible
            accessibilityLabel={revealAccessibilityLabel}
            accessibilityLiveRegion="polite"
            accessibilityRole="header"
            ref={revealHeadingRef}
            style={styles.introduction}
            tabIndex={-1}
          >
            <AppText style={styles.eyebrow}>{copy.eyebrow}</AppText>
            <AppText style={styles.pageTitle}>{copy.title}</AppText>
          </View>

          <View style={styles.primaryHero}>
            <AppText style={styles.sectionLabel}>{copy.primaryAnimal}</AppText>
            <View style={styles.animalHeading}>
              <AppText accessibilityElementsHidden style={styles.primarySymbol}>
                {primaryAnimal.symbol}
              </AppText>
              <AppText accessibilityRole="header" style={styles.primaryName}>
                {primaryCopy.name}
              </AppText>
            </View>
            <AppText style={styles.tagline}>{primaryCopy.tagline}</AppText>
            <AppText style={styles.description}>{primaryCopy.description}</AppText>
          </View>

          <View style={styles.twoColumnGrid}>
            <View style={styles.detailCard}>
              <AppText accessibilityRole="header" style={styles.detailTitle}>
                {copy.typicalStrengths}
              </AppText>
              {primaryCopy.strengths.map((strength) => (
                <View key={strength} style={styles.bulletRow}>
                  <AppText accessibilityElementsHidden style={styles.bullet}>•</AppText>
                  <AppText style={styles.bulletText}>{strength}</AppText>
                </View>
              ))}
            </View>
            <View style={styles.detailCard}>
              <AppText accessibilityRole="header" style={styles.detailTitle}>
                {copy.possibleBlindSpots}
              </AppText>
              {primaryCopy.blindSpots.map((blindSpot) => (
                <View key={blindSpot} style={styles.bulletRow}>
                  <AppText accessibilityElementsHidden style={styles.bullet}>•</AppText>
                  <AppText style={styles.bulletText}>{blindSpot}</AppText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <AppText accessibilityRole="header" style={styles.sectionTitle}>
              {copy.behaviouralTendencies}
            </AppText>
            <View style={styles.tendencyGrid}>
              <TendencyCard label={copy.interactionStyle} text={primaryCopy.interaction} styles={styles} />
              <TendencyCard label={copy.informationStyle} text={primaryCopy.information} styles={styles} />
              <TendencyCard label={copy.decisionStyle} text={primaryCopy.decisions} styles={styles} />
              <TendencyCard label={copy.organizationStyle} text={primaryCopy.organization} styles={styles} />
            </View>
          </View>

          <View style={styles.metaphorCard}>
            <AppText accessibilityRole="header" style={styles.detailTitle}>
              {copy.animalMetaphor}
            </AppText>
            <AppText style={styles.bodyText}>{primaryCopy.metaphor}</AppText>
          </View>

          <View style={styles.secondaryCard}>
            <AppText style={styles.sectionLabel}>{copy.secondaryAnimal}</AppText>
            <View style={styles.animalHeading}>
              <AppText accessibilityElementsHidden style={styles.secondarySymbol}>
                {secondaryAnimal.symbol}
              </AppText>
              <AppText accessibilityRole="header" style={styles.secondaryName}>
                {secondaryCopy.name}
              </AppText>
            </View>
            <AppText style={styles.secondaryTagline}>{secondaryCopy.tagline}</AppText>
            <AppText style={styles.bodyText}>{secondaryCopy.description}</AppText>
          </View>

          <View style={styles.relationshipCard}>
            <AppText accessibilityRole="header" style={styles.detailTitle}>{copy.relationship}</AppText>
            <AppText style={styles.bodyText}>{relationshipDescription}</AppText>
            {hasBalancedDimensions && (
              <AppText style={styles.closePatternNote}>{copy.closePatterns}</AppText>
            )}
          </View>

          <AppText style={styles.disclaimer}>{copy.disclaimer}</AppText>

          <View style={styles.actions}>
            <FocusablePressable
              accessibilityHint={copy.catalogueHint}
              accessibilityRole="button"
              onPress={onOpenCatalogue}
              style={({ pressed }) => [styles.catalogueButton, pressed && styles.secondaryButtonPressed]}
            >
              <AppText style={styles.catalogueButtonText}>{copy.catalogue}</AppText>
            </FocusablePressable>
            <FocusablePressable
              accessibilityHint={copy.restartHint}
              accessibilityRole="button"
              onPress={onRestart}
              style={({ pressed }) => [styles.restartButton, pressed && styles.primaryButtonPressed]}
            >
              <AppText style={styles.restartButtonText}>{copy.restart}</AppText>
            </FocusablePressable>
          </View>
        </View>
      </PageContent>
    </ScrollView>
  );
}

interface TendencyCardProps {
  label: string;
  text: string;
  styles: ReturnType<typeof createStyles>;
}

function TendencyCard({ label, text, styles }: TendencyCardProps) {
  return (
    <View style={styles.tendencyCard}>
      <AppText style={styles.tendencyLabel}>{label}</AppText>
      <AppText style={styles.bodyText}>{text}</AppText>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    scrollContent: { flexGrow: 1 },
    page: { flexGrow: 1, paddingVertical: theme.spacing.xl },
    result: {
      alignSelf: 'center',
      gap: theme.layout.sectionGap,
      maxWidth: 900,
      minWidth: 0,
      width: '100%',
    },
    introduction: { alignItems: 'center', gap: theme.spacing.xs },
    eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
    pageTitle: { color: colors.heading, fontSize: 30, fontWeight: '900', lineHeight: 38, textAlign: 'center' },
    primaryHero: {
      alignItems: 'center',
      backgroundColor: colors.selection,
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      gap: theme.spacing.md,
      padding: theme.spacing.xl,
    },
    sectionLabel: { color: colors.primary, fontSize: 13, fontWeight: '900', letterSpacing: 1 },
    animalHeading: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      justifyContent: 'center',
    },
    primarySymbol: { fontSize: 58, lineHeight: 70 },
    primaryName: { color: colors.heading, fontSize: 48, fontWeight: '900', lineHeight: 58, textAlign: 'center' },
    tagline: { color: colors.heading, fontSize: 21, fontWeight: '800', lineHeight: 30, maxWidth: 700, textAlign: 'center' },
    description: { color: colors.text, fontSize: 17, lineHeight: 27, maxWidth: 760, textAlign: 'center' },
    twoColumnGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    detailCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      flexBasis: 300,
      flexGrow: 1,
      gap: theme.spacing.sm,
      minWidth: 0,
      padding: theme.spacing.lg,
    },
    detailTitle: { color: colors.heading, fontSize: 20, fontWeight: '900', lineHeight: 27 },
    bulletRow: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.xs },
    bullet: { color: colors.primary, fontSize: 16, fontWeight: '900', lineHeight: 23 },
    bulletText: { color: colors.text, flex: 1, fontSize: 15, lineHeight: 23 },
    section: { gap: theme.spacing.md },
    sectionTitle: { color: colors.heading, fontSize: 25, fontWeight: '900', lineHeight: 33 },
    tendencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    tendencyCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      flexBasis: 280,
      flexGrow: 1,
      gap: theme.spacing.xs,
      minWidth: 0,
      padding: theme.spacing.md,
    },
    tendencyLabel: { color: colors.primary, fontSize: 14, fontWeight: '900', lineHeight: 20 },
    bodyText: { color: colors.text, fontSize: 15, lineHeight: 24 },
    metaphorCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    secondaryCard: {
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.xl,
    },
    secondarySymbol: { fontSize: 38, lineHeight: 48 },
    secondaryName: { color: colors.heading, fontSize: 34, fontWeight: '900', lineHeight: 43, textAlign: 'center' },
    secondaryTagline: { color: colors.heading, fontSize: 18, fontWeight: '800', lineHeight: 26 },
    relationshipCard: {
      backgroundColor: colors.successSurface,
      borderColor: colors.success,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    closePatternNote: { color: colors.heading, fontSize: 15, fontWeight: '800', lineHeight: 23 },
    disclaimer: {
      backgroundColor: colors.warningSurface,
      borderColor: colors.warning,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      color: colors.text,
      fontSize: 14,
      lineHeight: 22,
      padding: theme.spacing.md,
    },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    catalogueButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexBasis: 220,
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: 52,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    restartButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexBasis: 220,
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: 52,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    secondaryButtonPressed: { backgroundColor: colors.surfaceMuted },
    primaryButtonPressed: { backgroundColor: colors.primaryPressed, borderColor: colors.primaryPressed },
    catalogueButtonText: { color: colors.heading, fontSize: 16, fontWeight: '800', textAlign: 'center' },
    restartButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  });
}
