import { Platform, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buildVersion } from '../../config/buildInfo';
import { createFeedbackMailto } from '../../config/feedback';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppearance } from '../../settings/AppearanceProvider';
import type { SemanticColors } from '../../settings/appearanceTypes';
import { useFooterLayout } from '../layout/FooterLayoutProvider';
import { theme } from '../styles/theme';
import { AppText } from './AppText';
import { ExternalTextLink } from './ExternalTextLink';
import { PageContent } from './PageContent';

const ecosystemUrl = 'https://markellosecosystem.com';

export function AppFooter() {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const { setFooterHeight } = useFooterLayout();
  const styles = createStyles(colors);
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
      style={styles.footer}
    >
      <PageContent style={styles.footerInner}>
        <View testID="footer-row-copyright" style={styles.copyrightRow}>
          <AppText style={styles.copyright}>{copyrightNotice}</AppText>
        </View>

        <View
          accessibilityLabel={content.footer.navigationLabel}
          testID="footer-row-navigation"
          style={styles.navigationRow}
        >
          <View style={styles.linkGroup}>
            <ExternalTextLink
              accessibilityLabel={content.footer.feedbackAccessibilityLabel}
              label={content.footer.feedbackLabel}
              url={feedbackUrl}
              style={styles.link}
              textStyle={styles.linkLabel}
            />
            <AppText accessibilityElementsHidden style={styles.separator}>·</AppText>
            <ExternalTextLink
              accessibilityLabel={content.footer.ecosystemAccessibilityLabel}
              label={content.footer.ecosystemLabel}
              url={ecosystemUrl}
              style={styles.link}
              textStyle={styles.linkLabel}
            />
          </View>
          <AppText
            accessibilityLabel={`${content.footer.buildAccessibilityLabel}: ${buildVersion}`}
            style={styles.buildVersion}
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
    copyrightRow: { minWidth: 0, width: '100%' },
    copyright: { color: colors.footerText, fontSize: 10, lineHeight: 14 },
    navigationRow: {
      alignItems: 'center',
      columnGap: theme.spacing.sm,
      flexDirection: 'row',
      flexWrap: 'wrap',
      minWidth: 0,
      rowGap: 2,
      width: '100%',
    },
    linkGroup: { alignItems: 'center', columnGap: 6, flexDirection: 'row', flexShrink: 1, flexWrap: 'wrap', minWidth: 0, rowGap: 2 },
    link: { flexShrink: 1, justifyContent: 'center' },
    linkLabel: { color: colors.footerText, fontSize: 10, lineHeight: 14, textDecorationLine: 'underline' },
    separator: { color: colors.footerMuted, fontSize: 10, lineHeight: 14 },
    buildVersion: {
      color: colors.footerMuted,
      flexShrink: 1,
      fontSize: 9,
      lineHeight: 14,
      marginLeft: 'auto',
      maxWidth: '100%',
      textAlign: 'right',
    },
  });
}
