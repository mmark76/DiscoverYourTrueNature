import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentResult } from '../../assessment/types';

interface ResultScreenProps {
  result: AssessmentResult;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const revealHeadingRef = useRef<View>(null);
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.results;
  const primaryName = content.animals.records[result.primaryId].name;
  const secondaryName = content.animals.records[result.secondaryId].name;
  const styles = createStyles(colors);

  useEffect(() => {
    revealHeadingRef.current?.focus();
  }, [result.primaryId, result.secondaryId]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.page}>
        <View style={styles.reveal}>
          <View
            accessible
            accessibilityLabel={`${copy.primaryAnimal}: ${primaryName}. ${copy.secondaryAnimal}: ${secondaryName}`}
            accessibilityLiveRegion="polite"
            accessibilityRole="header"
            ref={revealHeadingRef}
            style={styles.animalResult}
            tabIndex={-1}
          >
            <AppText style={styles.label}>{copy.primaryAnimal}</AppText>
            <AppText style={styles.name}>{primaryName}</AppText>
          </View>
          <View style={styles.animalResult}>
            <AppText style={styles.label}>{copy.secondaryAnimal}</AppText>
            <AppText accessibilityRole="header" style={styles.name}>{secondaryName}</AppText>
          </View>
          <FocusablePressable
            accessibilityHint={copy.restartHint}
            accessibilityRole="button"
            onPress={onRestart}
            style={({ pressed }) => [styles.restartButton, pressed && styles.buttonPressed]}
          >
            <AppText style={styles.restartText}>{copy.restart}</AppText>
          </FocusablePressable>
        </View>
      </PageContent>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    scrollContent: { flexGrow: 1 },
    page: { alignItems: 'center', flexGrow: 1, justifyContent: 'center', paddingVertical: theme.spacing.lg },
    reveal: { alignItems: 'stretch', gap: theme.spacing.xl, maxWidth: 560, width: '100%' },
    animalResult: { alignItems: 'center', gap: theme.spacing.sm },
    label: { color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center' },
    name: { color: colors.heading, fontSize: 38, fontWeight: '800', lineHeight: 46, textAlign: 'center' },
    restartButton: { alignItems: 'center', alignSelf: 'center', backgroundColor: colors.primary, borderRadius: theme.radius.md, minHeight: 52, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, width: '100%' },
    buttonPressed: { opacity: 0.72 },
    restartText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  });
}
