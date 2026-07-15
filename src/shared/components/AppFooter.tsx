import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { useTranslation } from '../../i18n/useTranslation';
import { useAppearance } from '../../settings/AppearanceProvider';
import type { SemanticColors } from '../../settings/appearanceTypes';
import { AppText } from './AppText';
import { ExternalTextLink } from './ExternalTextLink';
import { PageContent } from './PageContent';
import { theme } from '../styles/theme';

const ecosystemUrl = 'https://markellosecosystem.com';

export function AppFooter() {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const { width } = useWindowDimensions();
  const stacked = width < theme.layout.mobileBreakpoint;
  const styles = createStyles(colors);

  return (
    <View accessibilityLabel={content.footer.accessibilityLabel} style={styles.footer}>
      <PageContent style={[styles.footerInner, stacked && styles.footerInnerStacked]}>
        <View style={[styles.copy, stacked && styles.stackedCopy]}>
          <AppText style={styles.copyright}>{content.footer.copyright}</AppText>
          <AppText style={styles.disclaimer}>{content.footer.entertainment}</AppText>
          <AppText style={styles.disclaimer}>{content.footer.notDiagnosis}</AppText>
        </View>

        <View style={[styles.links, stacked && styles.stackedLinks]}>
          <AppText accessibilityState={{ disabled: true }} style={styles.placeholder}>
            {content.footer.privacyComingSoon}
          </AppText>
          <AppText accessibilityState={{ disabled: true }} style={styles.placeholder}>
            {content.footer.feedbackComingSoon}
          </AppText>
          <ExternalTextLink
            label={content.footer.ecosystemLink}
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
    footer: { backgroundColor: colors.footerBackground },
    footerInner: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg, justifyContent: 'space-between', paddingVertical: theme.spacing.xl },
    footerInnerStacked: { flexDirection: 'column' },
    copy: { flex: 1, gap: 4, minWidth: 260 },
    copyright: { color: colors.footerText, fontSize: 13, fontWeight: '700' },
    disclaimer: { color: colors.footerMuted, fontSize: 12, lineHeight: 18 },
    links: { alignItems: 'flex-end', gap: theme.spacing.xs, minWidth: 250 },
    stackedCopy: { alignItems: 'flex-start', minWidth: 0, width: '100%' },
    stackedLinks: { alignItems: 'flex-end', minWidth: 0, width: '100%' },
    placeholder: { color: colors.disabledText, fontSize: 12, textAlign: 'right' },
    ecosystemLink: { maxWidth: '100%', minHeight: 44, justifyContent: 'center' },
    ecosystemLabel: { color: colors.footerText, fontSize: 12, textAlign: 'right' },
  });
}
