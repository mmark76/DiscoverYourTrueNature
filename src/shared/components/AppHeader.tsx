import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppScreen, NavigableScreen } from '../../app/navigation';
import { buildVersion } from '../../config/buildInfo';
import { createFeedbackMailto } from '../../config/feedback';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppearance } from '../../settings/AppearanceProvider';
import type { AppLanguage, SemanticColors } from '../../settings/appearanceTypes';
import { shouldUseCompactHeader } from '../layout/responsiveLayout';
import { theme } from '../styles/theme';
import { AppText } from './AppText';
import { ExternalTextLink } from './ExternalTextLink';
import { FocusablePressable } from './FocusablePressable';
import { PageContent } from './PageContent';

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
  const compact = shouldUseCompactHeader(width, settings.textSize);
  const styles = createStyles(colors);
  const feedbackUrl = createFeedbackMailto({
    languageLabel: content.common.selectedLanguageName,
    buildVersion,
  });
  const languageLabels: Record<AppLanguage, string> = {
    el: content.header.greekLanguage,
    en: content.header.englishLanguage,
  };

  function setLanguage(language: AppLanguage) {
    updateSettings({ language });
  }

  return (
    <View role="banner" style={styles.header}>
      <PageContent style={[styles.headerInner, compact && styles.headerInnerCompact]}>
        <View
          style={[styles.brandZone, !compact && styles.balancedOuterZone]}
          testID="header-brand-zone"
        >
          <FocusablePressable
            accessibilityLabel={content.header.brandHomeLabel}
            accessibilityRole="button"
            onPress={() => onNavigate('home')}
            style={({ pressed }) => [
              styles.brandButton,
              compact && styles.brandButtonCompact,
              pressed && styles.pressed,
            ]}
          >
            <AppText style={styles.brand}>{content.common.productName}</AppText>
          </FocusablePressable>
        </View>

        <View
          accessibilityLabel={content.header.navigationLabel}
          role="navigation"
          style={[styles.navigation, compact && styles.navigationCompact]}
          testID="header-navigation-group"
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
        </View>

        <View
          style={[
            styles.rightZone,
            compact ? styles.rightZoneCompact : styles.balancedOuterZone,
          ]}
          testID="header-right-zone"
        >
          <View
            accessibilityLabel={`${content.header.feedback}, ${content.header.ecosystemLink}`}
            role="group"
            style={styles.headerLinkGroup}
            testID="header-link-group"
          >
            <ExternalTextLink
              accessibilityLabel={content.header.feedbackAccessibilityLabel}
              label={content.header.feedback}
              url={feedbackUrl}
              style={styles.headerTextLink}
              textStyle={styles.headerLinkLabel}
            />
            <ExternalTextLink
              label={content.header.ecosystemLink}
              url={ecosystemUrl}
              style={styles.headerTextLink}
              textStyle={styles.headerLinkLabel}
            />
          </View>

          <View
            accessibilityLabel={`${content.header.languageLabel}, ${content.header.settings}`}
            role="group"
            style={styles.headerControlGroup}
            testID="header-control-group"
          >
            <View
              accessibilityLabel={content.header.languageLabel}
              role="radiogroup"
              style={styles.languageSelector}
            >
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
              <AppText
                style={[
                  styles.navLabel,
                  currentScreen === 'settings' && styles.navLabelSelected,
                ]}
              >
                {content.header.settings}
              </AppText>
            </FocusablePressable>
          </View>
        </View>
      </PageContent>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    header: { backgroundColor: colors.surfaceMuted, borderBottomColor: colors.border, borderBottomWidth: 1 },
    headerInner: { alignItems: 'center', flexDirection: 'row', gap: theme.layout.groupGap, justifyContent: 'space-between', paddingVertical: theme.spacing.sm },
    headerInnerCompact: { alignItems: 'stretch', flexDirection: 'column', gap: theme.layout.controlGap },
    balancedOuterZone: { flexBasis: 0, flexGrow: 1, minWidth: 0 },
    brandZone: { minWidth: 0 },
    brandButton: { alignItems: 'center', alignSelf: 'flex-start', borderRadius: theme.radius.sm, flexDirection: 'row', minHeight: 44 },
    brandButtonCompact: { alignSelf: 'center' },
    brand: { color: colors.heading, fontSize: 20, fontWeight: '800' },
    navigation: { alignItems: 'center', flexDirection: 'row', flexShrink: 0, flexWrap: 'wrap', gap: theme.layout.inlineGap, justifyContent: 'center' },
    navigationCompact: { alignSelf: 'center', maxWidth: '100%', width: '100%' },
    navButton: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.sm, borderWidth: 1, minHeight: 44, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
    navButtonSelected: { backgroundColor: colors.selection, borderColor: colors.primary },
    navLabel: { color: colors.text, fontSize: 13, fontWeight: '700' },
    navLabelSelected: { color: colors.accent },
    rightZone: { alignContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.layout.controlGap, justifyContent: 'flex-end', minWidth: 0 },
    rightZoneCompact: { alignSelf: 'stretch', justifyContent: 'center' },
    headerLinkGroup: { alignItems: 'center', flexDirection: 'row', flexShrink: 0, gap: theme.layout.controlGap },
    headerControlGroup: { alignItems: 'center', flexDirection: 'row', flexShrink: 0, gap: theme.layout.controlGap },
    headerTextLink: { justifyContent: 'center', minHeight: 44 },
    headerLinkLabel: { color: colors.text, fontSize: 13, fontWeight: '700' },
    languageSelector: { borderColor: colors.border, borderRadius: theme.radius.sm, borderWidth: 1, flexDirection: 'row', overflow: 'hidden' },
    languageOption: { alignItems: 'center', justifyContent: 'center', minHeight: 42, minWidth: 42 },
    languageOptionSelected: { backgroundColor: colors.selection },
    languageLabel: { color: colors.mutedText, fontSize: 11, fontWeight: '800' },
    languageLabelSelected: { color: colors.primary },
    settingsControl: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.sm, borderWidth: 1, flexDirection: 'row', gap: 5, minHeight: 44, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
    settingsIcon: { color: colors.primary, fontSize: 16, fontWeight: '800' },
    pressed: { opacity: 0.65 },
  });
}
