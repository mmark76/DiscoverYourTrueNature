import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
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
const compactFooterBreakpoint = 520;

export function AppFooter() {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const { setFooterHeight } = useFooterLayout();
  const { width } = useWindowDimensions();
  const compact = width < compactFooterBreakpoint;
  const styles = createStyles(colors);
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
        <View testID="footer-row-disclaimer" style={styles.disclaimerRow}>
          <AppText style={styles.disclaimer}>{content.footer.compactDisclaimer}</AppText>
        </View>

        <View
          accessibilityLabel={content.footer.navigationLabel}
          testID="footer-row-navigation"
          style={[styles.navigationRow, compact && styles.navigationRowCompact]}
        >
          <ExternalTextLink
            accessibilityLabel={content.footer.feedbackAccessibilityLabel}
            label={content.footer.feedbackLabel}
            url={feedbackUrl}
            style={styles.link}
            textStyle={[styles.linkLabel, compact && styles.compactLinkLabel]}
          />
          <ExternalTextLink
            accessibilityLabel={content.footer.ecosystemAccessibilityLabel}
            label={compact ? content.footer.ecosystemCompactLabel : content.footer.ecosystemLabel}
            url={ecosystemUrl}
            style={styles.link}
            textStyle={[styles.linkLabel, compact && styles.compactLinkLabel]}
          />
          <AppText
            accessibilityLabel={`${content.footer.buildAccessibilityLabel}: ${buildVersion}`}
            style={[styles.buildVersion, compact && styles.buildVersionCompact]}
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
    footerInner: { gap: 2, paddingBottom: 5, paddingTop: 5 },
    disclaimerRow: { minWidth: 0, width: '100%' },
    disclaimer: { color: colors.footerMuted, fontSize: 10, lineHeight: 14 },
    navigationRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      minWidth: 0,
      width: '100%',
    },
    navigationRowCompact: { columnGap: 6 },
    link: { flexShrink: 1, justifyContent: 'center' },
    linkLabel: { color: colors.primary, fontSize: 10, lineHeight: 14 },
    compactLinkLabel: { fontSize: 8.5, lineHeight: 12 },
    buildVersion: {
      color: colors.footerMuted,
      flexShrink: 0,
      fontSize: 9,
      lineHeight: 14,
      marginLeft: 'auto',
      textAlign: 'right',
    },
    buildVersionCompact: { fontSize: 7.5, lineHeight: 12 },
  });
}
