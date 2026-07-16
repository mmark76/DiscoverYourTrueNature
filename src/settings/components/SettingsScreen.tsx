import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTranslation } from '../../i18n/useTranslation';
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
  const { colors, resetSettings, settings, updateSettings } = useAppearance();
  const { content } = useTranslation();
  const copy = content.settings;
  const [confirmingReset, setConfirmingReset] = useState(false);
  const styles = createStyles(colors);

  const modeOptions: readonly { label: string; value: AppearanceMode }[] = [
    { label: copy.system, value: 'system' },
    { label: copy.light, value: 'light' },
    { label: copy.dark, value: 'dark' },
  ];
  const colorOptions: readonly { label: string; value: ColorTheme }[] = [
    { label: copy.forest, value: 'forest' },
    { label: copy.ocean, value: 'ocean' },
    { label: copy.amber, value: 'amber' },
    { label: copy.plum, value: 'plum' },
  ];
  const fontOptions: readonly { label: string; value: FontFamilyChoice }[] = [
    { label: copy.systemSans, value: 'system-sans' },
    { label: copy.serif, value: 'serif' },
    { label: copy.readable, value: 'readable' },
  ];
  const sizeOptions: readonly { label: string; value: TextSizeChoice }[] = [
    { label: copy.small, value: 'small' },
    { label: copy.normal, value: 'normal' },
    { label: copy.large, value: 'large' },
    { label: copy.extraLarge, value: 'extra-large' },
  ];

  function confirmReset() {
    resetSettings();
    setConfirmingReset(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
      <PageContent style={styles.content}>
        <View style={styles.introduction}>
          <AppText style={styles.eyebrow}>{content.header.settings.toUpperCase()}</AppText>
          <AppText accessibilityRole="header" style={styles.title}>
            {copy.title}
          </AppText>
          <AppText style={styles.description}>{copy.description}</AppText>
        </View>

        <View style={styles.settingsCard}>
          <SettingsOptionGroup
            label={copy.language}
            onSelect={(language) => updateSettings({ language })}
            options={[
              { label: copy.greek, value: 'el' },
              { label: copy.english, value: 'en' },
            ]}
            selectedValue={settings.language}
          />
          <SettingsOptionGroup
            label={copy.appearanceMode}
            onSelect={(mode) => updateSettings({ mode })}
            options={modeOptions}
            selectedValue={settings.mode}
          />
          <SettingsOptionGroup
            label={copy.colorTheme}
            onSelect={(colorTheme) => updateSettings({ colorTheme })}
            options={colorOptions}
            selectedValue={settings.colorTheme}
          />
          <SettingsOptionGroup
            label={copy.fontFamily}
            onSelect={(fontFamily) => updateSettings({ fontFamily })}
            options={fontOptions}
            selectedValue={settings.fontFamily}
          />
          <SettingsOptionGroup
            label={copy.textSize}
            onSelect={(textSize) => updateSettings({ textSize })}
            options={sizeOptions}
            selectedValue={settings.textSize}
          />
        </View>

        <View style={styles.preview}>
          <AppText style={styles.previewLabel}>{copy.preview}</AppText>
          <AppText accessibilityRole="header" style={styles.previewTitle}>
            {copy.previewTitle}
          </AppText>
          <AppText style={styles.previewBody}>{copy.previewBody}</AppText>
        </View>

        {confirmingReset ? (
          <View accessibilityLiveRegion="polite" style={styles.confirmation}>
            <AppText style={styles.confirmationText}>{copy.resetPrompt}</AppText>
            <View style={styles.actions}>
              <FocusablePressable
                accessibilityRole="button"
                onPress={confirmReset}
                style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}
              >
                <AppText style={styles.dangerButtonText}>{copy.confirmReset}</AppText>
              </FocusablePressable>
              <FocusablePressable
                accessibilityRole="button"
                onPress={() => setConfirmingReset(false)}
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              >
                <AppText style={styles.secondaryButtonText}>{copy.cancel}</AppText>
              </FocusablePressable>
            </View>
          </View>
        ) : (
          <FocusablePressable
            accessibilityRole="button"
            onPress={() => setConfirmingReset(true)}
            style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
          >
            <AppText style={styles.resetButtonText}>{copy.reset}</AppText>
          </FocusablePressable>
        )}

        <FocusablePressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <AppText style={styles.backButtonText}>← {copy.back}</AppText>
        </FocusablePressable>
      </PageContent>
    </ScrollView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scrollView: { backgroundColor: colors.background, flex: 1 },
    scrollContent: { flexGrow: 1 },
    content: { gap: theme.spacing.lg, paddingVertical: theme.spacing.lg },
    introduction: { gap: theme.spacing.sm, maxWidth: 780 },
    eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
    title: { color: colors.heading, fontSize: 40, fontWeight: '900', lineHeight: 47 },
    description: { color: colors.text, fontSize: 17, lineHeight: 26 },
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
    previewLabel: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    previewTitle: { color: colors.heading, fontSize: 25, fontWeight: '800' },
    previewBody: { color: colors.text, fontSize: 16, lineHeight: 24 },
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
      backgroundColor: colors.warningSurface,
      borderColor: colors.warning,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      minHeight: 44,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    dangerButtonText: { color: colors.warning, fontSize: 14, fontWeight: '800' },
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
