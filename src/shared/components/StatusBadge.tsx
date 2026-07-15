import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../styles/theme';

interface StatusBadgeProps {
  label: string;
  tone?: 'available' | 'soon';
}

export function StatusBadge({ label, tone = 'soon' }: StatusBadgeProps) {
  return (
    <View
      accessibilityLabel={`Κατάσταση: ${label}`}
      style={[styles.badge, tone === 'available' ? styles.available : styles.soon]}
    >
      <Text style={[styles.label, tone === 'available' ? styles.availableLabel : styles.soonLabel]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
  },
  available: {
    backgroundColor: '#E2EEE7',
  },
  soon: {
    backgroundColor: theme.colors.accentMuted,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  availableLabel: {
    color: theme.colors.primary,
  },
  soonLabel: {
    color: '#7A4528',
  },
});
