import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buildVersion } from '../../config/buildInfo';
import { createFeedbackMailto } from '../../config/feedback';
import { useAnalyticsConsent } from '../../features/analytics/consent/AnalyticsConsentProvider';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppearance } from '../../settings/AppearanceProvider';
import type { SemanticColors } from '../../settings/appearanceTypes';
import { useFooterLayout } from '../layout/FooterLayoutProvider';
import { shouldStackFooterNavigation } from '../layout/responsiveLayout';
import { theme } from '../styles/theme';
import { ActionTextLink } from './ActionTextLink';
import { AppText } from './AppText';
import { ExternalTextLink } from './ExternalTextLink';
import { PageContent } from './PageContent';

const ecosystemUrl = 'https://markellosecosystem.com';

export function AppFooter() {
  const { colors, settings } = useAppearance();
  const { content } = useTranslation();
  const { openChoices } = useAnalyticsConsent();
  const { setFooterHeight } = useFooterLayout();
  const { width } = useWindowDimensions();
  const styles = createStyles(colors);
  const useStackedNavigation = shouldStackFooterNavigation(width, settings.textSize);
  const currentYear = new Date().getFullYear();
  const copyrightNotice = `© ${currentYear} Markellos Markides. All rights reserved.`;
  const feedbackUrl = createFeedbackMailto({
    languageLabel: content.common.selectedLanguageName,
    buildVersion,
  });

  function measureFooter(event: LayoutChangeEvent) {
    setFooterHeight(event.nativeEvent.layout.height);
  }

  return (
    <SafeAreaView
      accessibilityLabel={content.footer.accessibilityLabel}
      edges={['bottom', 'left', 'right']}
      onLayout={measureFooter}
      role="contentinfo"
      style={styles.footer}
    >
      <PageContent style={styles.footerInner}>
        <View testID="footer-row-copyright" style={styles.copyrightRow}>
          <AppText style={styles.copyright}>{copyrightNotice}</AppText>
        </View>

        <View
          accessibilityLabel={content.footer.navigationLabel}
          role="navigation"
          testID="footer-row-navigation"
          style={[styles.navigationRow, useStackedNavigation && styles.navigationRowStacked]}
        >
          <View style={styles.linkGroup}>
            <ExternalTextLink
              accessibilityLabel="Feedback μέσω email"
              label="Feedback"
              url={feedbackUrl}
              style={styles.link}
              textStyle={styles.feedbackLinkLabel}
            />
            <View style={styles.linkPair}>
              <AppText accessibilityElementsHidden style={styles.separator}>·</AppText>
              <ActionTextLink
                accessibilityLabel={content.footer.analyticsChoicesAccessibilityLabel}
                label={content.footer.analyticsChoicesLabel}
                onPress={openChoices}
                style={styles.link}
                textStyle={styles.linkLabel}
              />
            </View>
            <View style={styles.linkPair}>
              <AppText accessibilityElementsHidden style={styles.separator}>·</AppText>
              <ExternalTextLink
                accessibilityLabel={content.footer.ecosystemAccessibilityLabel}
                label={content.footer.ecosystemLabel}
                url={ecosystemUrl}
                style={styles.link}
                textStyle={styles.linkLabel}
              />
            </View>
          </View>
          <AppText
            accessibilityLabel={`${content.footer.buildAccessibilityLabel}: ${buildVersion}`}
            style={[
              styles.buildVersion,
              useStackedNavigation
                ? styles.buildVersionStacked
                : styles.buildVersionLayered,
            ]}
          >
            {buildVersion}
          </AppText>
        </View>
      </PageContent>
    </SafeAreaView>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    footer: {
      backgroundColor: colors.footerBackground,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      bottom: 0,
      left: 0,
      position: Platform.OS === 'web' ? ('fixed' as unknown as ViewStyle['position']) : 'absolute',
      right: 0,
      zIndex: 20,
    },
    footerInner: { gap: 3, paddingBottom: 6, paddingTop: 6 },
    copyrightRow: { alignItems: 'center', minWidth: 0, width: '100%' },
    copyright: { color: colors.footerText, fontSize: 10, lineHeight: 14, textAlign: 'center', width: '100%' },
    navigationRow: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
      position: 'relative',
      rowGap: 2,
      width: '100%',
    },
    navigationRowStacked: { alignItems: 'stretch' },
    linkGroup: { alignItems: 'center', alignSelf: 'center', columnGap: 6, flexDirection: 'row', flexShrink: 1, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%', minWidth: 0, rowGap: 2 },
    linkPair: { alignItems: 'center', flexDirection: 'row', flexShrink: 1, gap: 6, minWidth: 0 },
    link: { flexShrink: 1, justifyContent: 'center' },
    linkLabel: { color: colors.footerText, fontSize: 10, lineHeight: 14, textDecorationLine: 'underline' },
    feedbackLinkLabel: { color: colors.accent, fontSize: 10, fontWeight: '800', lineHeight: 14, textDecorationLine: 'underline' },
    separator: { color: colors.footerMuted, fontSize: 10, lineHeight: 14 },
    buildVersion: {
      color: colors.footerMuted,
      flexShrink: 1,
      fontSize: 9,
      lineHeight: 14,
      maxWidth: '100%',
      textAlign: 'right',
    },
    buildVersionLayered: { position: 'absolute', right: 0, top: 0 },
    buildVersionStacked: { alignSelf: 'stretch', marginTop: 2 },
  });
}
