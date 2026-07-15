import { StyleSheet, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';

interface HeroSectionProps { onStart: () => void; }

export function HeroSection({ onStart }: HeroSectionProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.home;
  const styles = createStyles(colors);

  return (
    <View style={styles.hero}>
      <View style={styles.copy}>
        <AppText style={styles.eyebrow}>{copy.heroEyebrow}</AppText>
        <AppText accessibilityRole="header" style={styles.title}>{content.common.productName}</AppText>
        <AppText style={styles.subtitle}>{copy.heroSubtitle}</AppText>
        <AppText style={styles.description}>{copy.heroDescription}</AppText>
        <FocusablePressable
          accessibilityHint={copy.heroActionHint}
          accessibilityRole="button"
          onPress={onStart}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <AppText style={styles.buttonText}>{copy.heroAction}</AppText>
        </FocusablePressable>
      </View>

      <View accessibilityElementsHidden style={styles.motif}>
        <View style={styles.motifCircleLarge} />
        <View style={styles.motifCircleMedium} />
        <View style={styles.motifCircleSmall} />
        <AppText style={styles.motifText}>12</AppText>
        <AppText style={styles.motifCaption}>{copy.motifCaption}</AppText>
      </View>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    hero: { backgroundColor: colors.primary, borderRadius: theme.radius.lg, flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg, overflow: 'hidden', padding: theme.spacing.xl },
    copy: { flex: 1, gap: theme.spacing.sm, minWidth: 220, zIndex: 1 },
    eyebrow: { color: colors.heroMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
    title: { color: colors.onPrimary, fontSize: 44, fontWeight: '900', letterSpacing: -1, lineHeight: 49 },
    subtitle: { color: colors.onPrimary, fontSize: 21, fontWeight: '700', lineHeight: 29 },
    description: { color: colors.heroMuted, fontSize: 16, lineHeight: 25, maxWidth: 620 },
    button: { alignSelf: 'flex-start', backgroundColor: colors.accent, borderRadius: theme.radius.sm, marginTop: theme.spacing.xs, minHeight: 44, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm },
    buttonPressed: { backgroundColor: colors.accentPressed },
    buttonText: { color: colors.onAccent, fontSize: 15, fontWeight: '800' },
    motif: { alignItems: 'center', alignSelf: 'center', height: 190, justifyContent: 'center', minWidth: 220, position: 'relative' },
    motifCircleLarge: { borderColor: colors.heroDecoration, borderRadius: 999, borderWidth: 1, height: 180, position: 'absolute', width: 180 },
    motifCircleMedium: { borderColor: colors.heroMuted, borderRadius: 999, borderWidth: 1, height: 132, opacity: 0.65, position: 'absolute', width: 132 },
    motifCircleSmall: { backgroundColor: colors.heroDecorationStrong, borderRadius: 999, height: 94, position: 'absolute', width: 94 },
    motifText: { color: colors.onPrimary, fontSize: 34, fontWeight: '900' },
    motifCaption: { color: colors.heroMuted, fontSize: 12, fontWeight: '700', marginTop: 2 },
  });
}
