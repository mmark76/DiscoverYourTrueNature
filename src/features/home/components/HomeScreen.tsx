import { Linking, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import type { NavigableScreen } from '../../../app/navigation';
import { buildVersion } from '../../../config/buildInfo';
import { createFeedbackMailto } from '../../../config/feedback';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';
import { homeFeatures } from '../data/features';
import { FeatureCard } from './FeatureCard';
import { HeroSection } from './HeroSection';

interface HomeScreenProps { onNavigate: (screen: NavigableScreen) => void; }

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const { width } = useWindowDimensions();
  const cardWidth: `${number}%` = width >= 1080 ? '32%' : width >= 680 ? '48.8%' : '100%';
  const styles = createStyles(colors);
  const feedbackUrl = createFeedbackMailto({
    languageLabel: content.common.selectedLanguageName,
    buildVersion,
  });

  function handleFeatureAction(feature: (typeof homeFeatures)[number]) {
    if (feature.action?.type === 'navigate') {
      onNavigate(feature.action.screen);
    } else if (feature.action?.type === 'feedback') {
      void Linking.openURL(feedbackUrl);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.content}>
        <HeroSection onStart={() => onNavigate('assessment')} />
        <View style={styles.sectionHeading}>
          <AppText style={styles.sectionEyebrow}>{content.home.sectionEyebrow}</AppText>
          <AppText accessibilityRole="header" style={styles.sectionTitle}>
            {content.home.sectionTitle}
          </AppText>
        </View>
        <View style={styles.grid}>
          {homeFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} onAction={() => handleFeatureAction(feature)} width={cardWidth} />
          ))}
        </View>
      </PageContent>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    scrollContent: { flexGrow: 1 },
    content: { gap: theme.spacing.xl, paddingVertical: theme.spacing.lg },
    sectionHeading: { gap: theme.spacing.xs },
    sectionEyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
    sectionTitle: { color: colors.text, fontSize: 28, fontWeight: '800', lineHeight: 35 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  });
}
