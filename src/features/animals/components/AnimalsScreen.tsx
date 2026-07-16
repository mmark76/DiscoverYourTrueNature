import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';
import { animals, type AnimalId } from '../data/animals';
import { AnimalCard } from './AnimalCard';

interface AnimalsScreenProps {
  primaryAnimalId?: AnimalId | null;
  secondaryAnimalId?: AnimalId | null;
}

export function AnimalsScreen({
  primaryAnimalId = null,
  secondaryAnimalId = null,
}: AnimalsScreenProps) {
  const { colors, settings } = useAppearance();
  const { content } = useTranslation();
  const copy = content.animals;
  const { width } = useWindowDimensions();
  const cardWidth: `${number}%` = settings.textSize === 'extra-large'
    ? '100%'
    : width >= 1050 ? '32%' : width >= 650 ? '48.7%' : '100%';
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.content}>
        <View style={styles.introduction}>
          <AppText style={styles.eyebrow}>{copy.eyebrow}</AppText>
          <AppText accessibilityRole="header" style={styles.title}>{copy.title}</AppText>
          <AppText style={styles.description}>{copy.introduction}</AppText>
        </View>
        <View style={styles.grid}>
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              isPrimary={animal.id === primaryAnimalId}
              isSecondary={animal.id === secondaryAnimalId}
              width={cardWidth}
            />
          ))}
        </View>
        <AppText style={styles.note}>{copy.catalogNote}</AppText>
      </PageContent>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    scrollContent: { flexGrow: 1 },
    content: { gap: theme.layout.sectionGap, paddingVertical: theme.spacing.lg },
    introduction: { gap: theme.spacing.sm, maxWidth: 800, minWidth: 0 },
    eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
    title: { color: colors.heading, fontSize: 40, fontWeight: '900', lineHeight: 47 },
    description: { color: colors.text, fontSize: 17, lineHeight: 26 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md, minWidth: 0 },
    note: {
      backgroundColor: colors.warningSurface,
      borderColor: colors.warning,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      color: colors.text,
      fontSize: 13,
      lineHeight: 21,
      padding: theme.spacing.md,
    },
  });
}
