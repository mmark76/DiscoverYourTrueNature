import { StyleSheet, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';
import { useAnalyticsConsent } from './AnalyticsConsentProvider';

interface AnalyticsConsentControlsProps {
  horizontal?: boolean;
}

export function AnalyticsConsentControls({ horizontal = false }: AnalyticsConsentControlsProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const { accept, reject } = useAnalyticsConsent();
  const copy = content.analyticsConsent;
  const styles = createStyles(colors);

  return (
    <View style={[styles.controls, horizontal && styles.controlsHorizontal]}>
      <View style={styles.copy}>
        <AppText accessibilityRole="header" style={styles.title}>{copy.title}</AppText>
        <AppText style={styles.description}>{copy.description}</AppText>
      </View>
      <View style={[styles.actions, horizontal && styles.actionsHorizontal]}>
        <FocusablePressable
          accessibilityRole="button"
          onPress={accept}
          style={({ pressed }) => [styles.choiceButton, pressed && styles.choiceButtonPressed]}
        >
          <AppText style={styles.choiceButtonText}>{copy.accept}</AppText>
        </FocusablePressable>
        <FocusablePressable
          accessibilityRole="button"
          onPress={reject}
          style={({ pressed }) => [styles.choiceButton, pressed && styles.choiceButtonPressed]}
        >
          <AppText style={styles.choiceButtonText}>{copy.reject}</AppText>
        </FocusablePressable>
      </View>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    controls: { gap: theme.spacing.md, minWidth: 0, width: '100%' },
    controlsHorizontal: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' },
    copy: { flex: 1, gap: theme.spacing.xs, minWidth: 220 },
    title: { color: colors.heading, fontSize: 18, fontWeight: '800', lineHeight: 24 },
    description: { color: colors.text, fontSize: 13, lineHeight: 19 },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, minWidth: 0 },
    actionsHorizontal: { flexBasis: 360, flexGrow: 0, flexShrink: 1 },
    choiceButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: theme.radius.sm, flex: 1, justifyContent: 'center', minHeight: 44, minWidth: 150, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
    choiceButtonPressed: { backgroundColor: colors.primaryPressed },
    choiceButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  });
}
