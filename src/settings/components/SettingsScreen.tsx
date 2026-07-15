import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppFooter } from '../../shared/components/AppFooter';
import { AppText } from '../../shared/components/AppText';
import { FocusablePressable } from '../../shared/components/FocusablePressable';
import { PageContent } from '../../shared/components/PageContent';
import { theme } from '../../shared/styles/theme';
import { useAppearance } from '../AppearanceProvider';
import type {
  AppearanceMode,
  ColorTheme,
  FontFamilyChoice,
  SemanticColors,
  TextSizeChoice,
} from '../appearanceTypes';
import { SettingsOptionGroup } from './SettingsOptionGroup';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { colors, resetSettings, settings, translate, updateSettings } = useAppearance();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const styles = createStyles(colors);

  const modeOptions: readonly { label: string; value: AppearanceMode }[] = [
    { label: translate('system'), value: 'system' },
    { label: translate('light'), value: 'light' },
    { label: translate('dark'), value: 'dark' },
  ];
  const colorOptions: readonly { label: string; value: ColorTheme }[] = [
    { label: translate('forest'), value: 'forest' },
    { label: translate('ocean'), value: 'ocean' },
    { label: translate('amber'), value: 'amber' },
    { label: translate('plum'), value: 'plum' },
  ];
  const fontOptions: readonly { label: string; value: FontFamilyChoice }[] = [
    { label: translate('systemSans'), value: 'system-sans' },
    { label: translate('serif'), value: 'serif' },
    { label: translate('readable'), value: 'readable' },
  ];
  const sizeOptions: readonly { label: string; value: TextSizeChoice }[] = [
    { label: translate('small'), value: 'small' },
    { label: translate('normal'), value: 'normal' },
    { label: translate('large'), value: 'large' },
    { label: translate('extraLarge'), value: 'extra-large' },
  ];

  function confirmReset() {
    resetSettings();
    setConfirmingReset(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.content}>
        <View style={styles.introduction}>
          <AppText style={styles.eyebrow}>{translate('settings').toUpperCase()}</AppText>
          <AppText accessibilityRole="header" style={styles.title}>
            {translate('settingsTitle')}
          </AppText>
          <AppText style={styles.description}>{translate('settingsDescription')}</AppText>
        </View>

        <View style={styles.settingsCard}>
          <SettingsOptionGroup
            label={translate('language')}
            onSelect={(language) => updateSettings({ language })}
            options={[
              { label: translate('greek'), value: 'el' },
              { label: translate('english'), value: 'en' },
            ]}
            selectedValue={settings.language}
          />
          <SettingsOptionGroup
            label={translate('appearanceMode')}
            onSelect={(mode) => updateSettings({ mode })}
            options={modeOptions}
            selectedValue={settings.mode}
          />
          <SettingsOptionGroup
            label={translate('colorTheme')}
            onSelect={(colorTheme) => updateSettings({ colorTheme })}
            options={colorOptions}
            selectedValue={settings.colorTheme}
          />
          <SettingsOptionGroup
            label={translate('fontFamily')}
            onSelect={(fontFamily) => updateSettings({ fontFamily })}
            options={fontOptions}
            selectedValue={settings.fontFamily}
          />
          <SettingsOptionGroup
            label={translate('textSize')}
            onSelect={(textSize) => updateSettings({ textSize })}
            options={sizeOptions}
            selectedValue={settings.textSize}
          />
        </View>

        <View style={styles.preview}>
          <AppText style={styles.previewLabel}>{translate('preview')}</AppText>
          <AppText accessibilityRole="header" style={styles.previewTitle}>
            {translate('previewTitle')}
          </AppText>
          <AppText style={styles.previewBody}>{translate('previewBody')}</AppText>
        </View>

        {confirmingReset ? (
          <View accessibilityLiveRegion="polite" style={styles.confirmation}>
            <AppText style={styles.confirmationText}>{translate('resetPrompt')}</AppText>
            <View style={styles.actions}>
              <FocusablePressable
                accessibilityRole="button"
                onPress={confirmReset}
                style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}
              >
                <AppText style={styles.dangerButtonText}>{translate('confirmReset')}</AppText>
              </FocusablePressable>
              <FocusablePressable
                accessibilityRole="button"
                onPress={() => setConfirmingReset(false)}
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              >
                <AppText style={styles.secondaryButtonText}>{translate('cancel')}</AppText>
              </FocusablePressable>
            </View>
          </View>
        ) : (
          <FocusablePressable
            accessibilityRole="button"
            onPress={() => setConfirmingReset(true)}
            style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
          >
            <AppText style={styles.resetButtonText}>{translate('reset')}</AppText>
          </FocusablePressable>
        )}

        <FocusablePressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <AppText style={styles.backButtonText}>← {translate('back')}</AppText>
        </FocusablePressable>
      </PageContent>
      <AppFooter />
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    scrollContent: { flexGrow: 1 },
    content: { gap: theme.spacing.lg, paddingVertical: theme.spacing.lg },
    introduction: { gap: theme.spacing.sm, maxWidth: 780 },
    eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
    title: { color: colors.text, fontSize: 40, fontWeight: '900', lineHeight: 47 },
    description: { color: colors.mutedText, fontSize: 17, lineHeight: 26 },
    settingsCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
    },
    preview: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
    },
    previewLabel: { color: colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    previewTitle: { color: colors.text, fontSize: 25, fontWeight: '800' },
    previewBody: { color: colors.mutedText, fontSize: 16, lineHeight: 24 },
    confirmation: {
      backgroundColor: colors.warningSurface,
      borderColor: colors.warning,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.md,
      padding: theme.spacing.md,
    },
    confirmationText: { color: colors.text, fontSize: 15, lineHeight: 23 },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    dangerButton: {
      backgroundColor: colors.warning,
      borderRadius: theme.radius.sm,
      minHeight: 44,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    dangerButtonText: { color: colors.onAccent, fontSize: 14, fontWeight: '800' },
    secondaryButton: {
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      minHeight: 44,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    secondaryButtonText: { color: colors.text, fontSize: 14, fontWeight: '800' },
    resetButton: { alignSelf: 'flex-start', minHeight: 44, paddingVertical: theme.spacing.sm },
    resetButtonText: { color: colors.warning, fontSize: 14, fontWeight: '800', textDecorationLine: 'underline' },
    backButton: { alignSelf: 'flex-start', minHeight: 44, paddingVertical: theme.spacing.sm },
    backButtonText: { color: colors.primary, fontSize: 15, fontWeight: '800' },
    pressed: { opacity: 0.68 },
  });
}
