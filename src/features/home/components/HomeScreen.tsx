import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { NavigableScreen } from '../../../app/navigation';
import { AppFooter } from '../../../shared/components/AppFooter';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';
import { homeFeatures } from '../data/features';
import { FeatureCard } from './FeatureCard';
import { HeroSection } from './HeroSection';

interface HomeScreenProps {
  onNavigate: (screen: NavigableScreen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const cardWidth: `${number}%` = width >= 1080 ? '32%' : width >= 680 ? '48.8%' : '100%';

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.content}>
        <HeroSection onStart={() => onNavigate('assessment')} />

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionEyebrow}>ΕΞΕΡΕΥΝΗΣΕ ΤΗΝ ΕΜΠΕΙΡΙΑ</Text>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Διάλεξε πού θέλεις να ξεκινήσεις
          </Text>
        </View>

        <View style={styles.grid}>
          {homeFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onAction={() => feature.action && onNavigate(feature.action.screen)}
              width={cardWidth}
            />
          ))}
        </View>
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
  sectionHeading: {
    gap: theme.spacing.xs,
  },
  sectionEyebrow: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 35,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
});
