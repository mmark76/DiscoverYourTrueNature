import { StyleSheet, View } from 'react-native';

import { useTranslation } from '../../i18n/useTranslation';
import { useAppearance } from '../../settings/AppearanceProvider';
import type { SemanticColors } from '../../settings/appearanceTypes';
import { AppText } from './AppText';
import { theme } from '../styles/theme';

interface StatusBadgeProps {
  label: string;
  tone?: 'available' | 'soon';
}

export function StatusBadge({ label, tone = 'soon' }: StatusBadgeProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const styles = createStyles(colors);

  return (
    <View
      accessibilityLabel={`${content.common.status}: ${label}`}
      style={[styles.badge, tone === 'available' ? styles.available : styles.soon]}
    >
      <AppText style={[styles.label, tone === 'available' ? styles.availableLabel : styles.soonLabel]}>
        {label}
      </AppText>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: theme.spacing.sm, paddingVertical: 6 },
    available: { backgroundColor: colors.successSurface },
    soon: { backgroundColor: colors.warningSurface },
    label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
    availableLabel: { color: colors.success },
    soonLabel: { color: colors.text },
  });
}
