import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppScreen, NavigableScreen } from '../../app/navigation';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppearance } from '../../settings/AppearanceProvider';
import type { AppLanguage, SemanticColors } from '../../settings/appearanceTypes';
import { AppText } from './AppText';
import { ExternalTextLink } from './ExternalTextLink';
import { FocusablePressable } from './FocusablePressable';
import { PageContent } from './PageContent';
import { theme } from '../styles/theme';

interface AppHeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: NavigableScreen) => void;
  onOpenSettings: () => void;
}

const ecosystemUrl = 'https://markellosecosystem.com';
const navigationItems = [
  { labelKey: 'home', screen: 'home' },
  { labelKey: 'discover', screen: 'assessment' },
  { labelKey: 'animals', screen: 'animals' },
  { labelKey: 'howItWorks', screen: 'how-it-works' },
] as const satisfies ReadonlyArray<{
  labelKey: 'home' | 'discover' | 'animals' | 'howItWorks';
  screen: NavigableScreen;
}>;

export function AppHeader({ currentScreen, onNavigate, onOpenSettings }: AppHeaderProps) {
  const { colors, settings, updateSettings } = useAppearance();
  const { content } = useTranslation();
  const { width } = useWindowDimensions();
  const compact = width < 920;
  const styles = createStyles(colors);
  const languageLabels: Record<AppLanguage, string> = {
    el: content.header.greekLanguage,
    en: content.header.englishLanguage,
  };

  function setLanguage(language: AppLanguage) {
    updateSettings({ language });
  }

  return (
    <View style={styles.header}>
      <PageContent style={[styles.headerInner, compact && styles.headerInnerCompact]}>
        <FocusablePressable
          accessibilityLabel={content.header.brandHomeLabel}
          accessibilityRole="button"
          onPress={() => onNavigate('home')}
          style={({ pressed }) => [styles.brandButton, pressed && styles.pressed]}
        >
          <View style={styles.brandMark} />
          <AppText style={styles.brand}>{content.common.productName}</AppText>
        </FocusablePressable>

        <View
          accessibilityLabel={content.header.navigationLabel}
          style={[styles.navigation, compact && styles.navigationCompact]}
        >
          {navigationItems.map((item) => {
            const selected = currentScreen === item.screen;
            return (
              <FocusablePressable
                key={item.screen}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => onNavigate(item.screen)}
                style={({ pressed }) => [
                  styles.navButton,
                  selected && styles.navButtonSelected,
                  pressed && styles.pressed,
                ]}
              >
                <AppText style={[styles.navLabel, selected && styles.navLabelSelected]}>
                  {content.header[item.labelKey]}
                </AppText>
              </FocusablePressable>
            );
          })}

          <View accessibilityState={{ disabled: true }} style={styles.feedbackPlaceholder}>
            <AppText style={styles.feedbackLabel}>{content.header.feedback}</AppText>
            <AppText style={styles.soonLabel}>{content.common.comingSoon}</AppText>
          </View>

          <View accessibilityLabel={content.header.languageLabel} style={styles.languageSelector}>
            {(['el', 'en'] as const).map((language) => {
              const selected = settings.language === language;
              return (
                <FocusablePressable
                  key={language}
                  accessibilityLabel={languageLabels[language]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => setLanguage(language)}
                  style={({ pressed }) => [
                    styles.languageOption,
                    selected && styles.languageOptionSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText style={[styles.languageLabel, selected && styles.languageLabelSelected]}>
                    {language.toUpperCase()}
                  </AppText>
                </FocusablePressable>
              );
            })}
          </View>

          <FocusablePressable
            accessibilityLabel={content.header.settings}
            accessibilityRole="button"
            accessibilityState={{ selected: currentScreen === 'settings' }}
            onPress={onOpenSettings}
            style={({ pressed }) => [
              styles.settingsControl,
              currentScreen === 'settings' && styles.navButtonSelected,
              pressed && styles.pressed,
            ]}
          >
            <AppText accessibilityElementsHidden style={styles.settingsIcon}>⚙</AppText>
            <AppText style={styles.navLabel}>{content.header.settings}</AppText>
          </FocusablePressable>

          <ExternalTextLink
            label={content.header.ecosystemLink}
            url={ecosystemUrl}
            style={styles.ecosystemLink}
            textStyle={styles.ecosystemLabel}
          />
        </View>
      </PageContent>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    header: { backgroundColor: colors.surfaceMuted, borderBottomColor: colors.border, borderBottomWidth: 1 },
    headerInner: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.lg, justifyContent: 'space-between', paddingVertical: theme.spacing.sm },
    headerInnerCompact: { alignItems: 'flex-start', flexDirection: 'column', gap: theme.spacing.sm },
    brandButton: { alignItems: 'center', borderRadius: theme.radius.sm, flexDirection: 'row', gap: theme.spacing.xs, minHeight: 44 },
    brandMark: { backgroundColor: colors.accent, borderRadius: 999, height: 12, width: 12 },
    brand: { color: colors.text, fontSize: 20, fontWeight: '800' },
    navigation: { alignItems: 'center', flexDirection: 'row', flexShrink: 1, flexWrap: 'wrap', gap: 4, justifyContent: 'flex-end' },
    navigationCompact: { justifyContent: 'flex-start', width: '100%' },
    navButton: { borderRadius: theme.radius.sm, minHeight: 44, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
    navButtonSelected: { backgroundColor: colors.selection },
    navLabel: { color: colors.mutedText, fontSize: 13, fontWeight: '700' },
    navLabelSelected: { color: colors.primary },
    feedbackPlaceholder: { alignItems: 'center', minHeight: 44, paddingHorizontal: theme.spacing.sm, justifyContent: 'center' },
    feedbackLabel: { color: colors.disabledText, fontSize: 13, fontWeight: '700' },
    soonLabel: { color: colors.mutedText, fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
    languageSelector: { borderColor: colors.border, borderRadius: theme.radius.sm, borderWidth: 1, flexDirection: 'row', overflow: 'hidden' },
    languageOption: { alignItems: 'center', justifyContent: 'center', minHeight: 42, minWidth: 42 },
    languageOptionSelected: { backgroundColor: colors.selection },
    languageLabel: { color: colors.mutedText, fontSize: 11, fontWeight: '800' },
    languageLabelSelected: { color: colors.primary },
    settingsControl: { alignItems: 'center', borderRadius: theme.radius.sm, flexDirection: 'row', gap: 5, minHeight: 44, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
    settingsIcon: { color: colors.primary, fontSize: 16, fontWeight: '800' },
    ecosystemLink: { marginLeft: 'auto', maxWidth: '100%', minHeight: 44, justifyContent: 'center' },
    ecosystemLabel: { textAlign: 'right' },
    pressed: { opacity: 0.65 },
  });
}
