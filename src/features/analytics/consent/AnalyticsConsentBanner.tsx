import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';
import { AnalyticsConsentControls } from './AnalyticsConsentControls';
import { useAnalyticsConsent } from './AnalyticsConsentProvider';
import { shouldShowAnalyticsConsentBanner } from './analyticsConsentTypes.ts';

const horizontalBannerBreakpoint = 900;

export function AnalyticsConsentBanner() {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const { consentState, choicesOpen } = useAnalyticsConsent();
  const { width } = useWindowDimensions();
  const styles = createStyles(colors);

  if (!shouldShowAnalyticsConsentBanner(consentState, choicesOpen)) return null;

  return (
    <View
      accessibilityLabel={content.analyticsConsent.bannerAccessibilityLabel}
      accessibilityLiveRegion="polite"
      style={styles.banner}
      testID="analytics-consent-banner"
    >
      <PageContent>
        <View style={styles.panel}>
          <AnalyticsConsentControls horizontal={width >= horizontalBannerBreakpoint} />
        </View>
      </PageContent>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    banner: { backgroundColor: colors.backgroundMuted, borderTopColor: colors.border, borderTopWidth: 1, flexShrink: 0, paddingVertical: theme.spacing.xs, width: '100%' },
    panel: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, padding: theme.spacing.md },
  });
}
