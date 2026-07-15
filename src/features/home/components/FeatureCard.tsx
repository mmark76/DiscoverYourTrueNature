import { StyleSheet, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { useAppearance } from '../../../settings/AppearanceProvider';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { theme } from '../../../shared/styles/theme';
import type { HomeFeatureData } from '../data/features';

interface FeatureCardProps {
  feature: HomeFeatureData;
  width: `${number}%`;
  onAction: () => void;
}

export function FeatureCard({ feature, width, onAction }: FeatureCardProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.home.features[feature.id];
  const comingSoon = feature.action === undefined;
  const styles = createStyles(colors);

  return (
    <View style={[styles.card, { width }, comingSoon && styles.comingSoonCard]}>
      <View style={styles.content}>
        <AppText style={styles.eyebrow}>{copy.eyebrow}</AppText>
        <AppText accessibilityRole="header" style={styles.title}>{copy.title}</AppText>
        <AppText style={styles.description}>{copy.description}</AppText>
      </View>

      {feature.action ? (
        <FocusablePressable
          accessibilityLabel={copy.actionLabel}
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <AppText style={styles.buttonText}>{copy.actionLabel}</AppText>
          <AppText style={styles.arrow}>→</AppText>
        </FocusablePressable>
      ) : (
        <StatusBadge label={content.common.comingSoon} />
      )}
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, gap: theme.spacing.lg, justifyContent: 'space-between', minHeight: 250, padding: theme.spacing.lg },
    comingSoonCard: { backgroundColor: colors.surfaceMuted, borderStyle: 'dashed' },
    content: { gap: theme.spacing.sm },
    eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
    title: { color: colors.text, fontSize: 23, fontWeight: '800', lineHeight: 29 },
    description: { color: colors.mutedText, fontSize: 15, lineHeight: 23 },
    button: { alignItems: 'center', alignSelf: 'flex-start', borderColor: colors.primary, borderRadius: theme.radius.sm, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs, minHeight: 44, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
    buttonPressed: { backgroundColor: colors.selection },
    buttonText: { color: colors.primary, fontSize: 14, fontWeight: '800' },
    arrow: { color: colors.primary, fontSize: 17, fontWeight: '700' },
  });
}
