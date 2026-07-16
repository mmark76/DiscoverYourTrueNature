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
        <View style={styles.highlights}>
          {copy.highlights.map((highlight) => (
            <View key={highlight} style={styles.highlight}>
              <AppText accessibilityElementsHidden style={styles.highlightMark}>✓</AppText>
              <AppText style={styles.highlightText}>{highlight}</AppText>
            </View>
          ))}
        </View>
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
        <View style={styles.motifOuterCircle} />
        <View style={styles.motifContent}>
          <View style={styles.motifNumberArea}>
            <AppText style={styles.motifText}>16</AppText>
          </View>
          <View style={styles.motifCaptionArea}>
            <AppText style={styles.motifCaption}>{copy.motifCaption}</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    hero: { backgroundColor: colors.selection, borderColor: colors.border, borderRadius: theme.radius.lg, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg, overflow: 'hidden', padding: theme.spacing.xl },
    copy: { flex: 1, gap: theme.spacing.sm, minWidth: 220, zIndex: 1 },
    eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
    title: { color: colors.heading, fontSize: 44, fontWeight: '900', letterSpacing: -1, lineHeight: 49 },
    subtitle: { color: colors.heading, fontSize: 21, fontWeight: '700', lineHeight: 29 },
    description: { color: colors.text, fontSize: 16, lineHeight: 25, maxWidth: 620 },
    highlights: { gap: theme.spacing.xs, marginTop: theme.spacing.xs },
    highlight: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.xs, minWidth: 0 },
    highlightMark: { color: colors.primary, fontSize: 14, fontWeight: '900', lineHeight: 21 },
    highlightText: { color: colors.text, flex: 1, fontSize: 14, lineHeight: 21 },
    button: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: theme.radius.sm, marginTop: theme.spacing.xs, minHeight: 44, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm },
    buttonPressed: { backgroundColor: colors.primaryPressed },
    buttonText: { color: colors.onPrimary, fontSize: 15, fontWeight: '800' },
    motif: { alignItems: 'center', alignSelf: 'center', aspectRatio: 1, flexBasis: 180, flexGrow: 0, flexShrink: 1, justifyContent: 'center', maxWidth: 180, minWidth: 0, position: 'relative', width: '100%' },
    motifOuterCircle: { borderColor: colors.heroDecoration, borderRadius: 999, borderWidth: 1, height: '100%', opacity: 0.55, position: 'absolute', width: '100%' },
    motifContent: { alignItems: 'center', gap: theme.spacing.sm, justifyContent: 'center', paddingHorizontal: theme.spacing.md, width: '100%' },
    motifNumberArea: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderColor: colors.heroDecoration, borderRadius: 999, borderWidth: 1, height: 72, justifyContent: 'center', width: 72 },
    motifText: { color: colors.heading, fontSize: 34, fontWeight: '900' },
    motifCaptionArea: { alignItems: 'center', justifyContent: 'flex-start', maxWidth: 142, minHeight: 38, width: '100%' },
    motifCaption: { color: colors.text, fontSize: 14, fontWeight: '700', lineHeight: 19, textAlign: 'center' },
  });
}
