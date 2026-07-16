import { Modal, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';
import { AnalyticsConsentControls } from './AnalyticsConsentControls';
import { useAnalyticsConsent } from './AnalyticsConsentProvider';

export function AnalyticsConsentDialog() {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const { choicesOpen, closeChoices } = useAnalyticsConsent();
  const copy = content.analyticsConsent;
  const styles = createStyles(colors);

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeChoices}
      transparent
      visible={choicesOpen}
    >
      <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
        <View
          accessibilityLabel={copy.dialogAccessibilityLabel}
          accessibilityViewIsModal
          style={styles.dialog}
        >
          <FocusablePressable
            accessibilityRole="button"
            onPress={closeChoices}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
          >
            <AppText style={styles.closeButtonText}>{copy.close}</AppText>
          </FocusablePressable>
          <AnalyticsConsentControls />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    safeArea: { alignItems: 'center', backgroundColor: colors.backgroundMuted, flex: 1, justifyContent: 'center', padding: theme.spacing.md },
    dialog: { backgroundColor: colors.surface, borderColor: colors.borderStrong, borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.md, maxWidth: 640, padding: theme.spacing.lg, width: '100%' },
    closeButton: { alignSelf: 'flex-end', borderRadius: theme.radius.sm, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
    closeButtonPressed: { backgroundColor: colors.selection },
    closeButtonText: { color: colors.primary, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
  });
}
