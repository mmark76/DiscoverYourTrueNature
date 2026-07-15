import { StyleSheet, Text, View } from 'react-native';

import { HomeFeature } from '../data/features';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';
import { StatusBadge } from '../../../shared/components/StatusBadge';

interface FeatureCardProps {
  feature: HomeFeature;
  width: `${number}%`;
  onAction: () => void;
}

export function FeatureCard({ feature, width, onAction }: FeatureCardProps) {
  const comingSoon = feature.action === undefined;

  return (
    <View style={[styles.card, { width }, comingSoon && styles.comingSoonCard]}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{feature.eyebrow}</Text>
        <Text accessibilityRole="header" style={styles.title}>
          {feature.title}
        </Text>
        <Text style={styles.description}>{feature.description}</Text>
      </View>

      {feature.action ? (
        <FocusablePressable
          accessibilityLabel={feature.action.label}
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>{feature.action.label}</Text>
          <Text style={styles.arrow}>→</Text>
        </FocusablePressable>
      ) : (
        <StatusBadge label="Προσεχώς" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
    minHeight: 250,
    padding: theme.spacing.lg,
  },
  comingSoonCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderStyle: 'dashed',
  },
  content: {
    gap: theme.spacing.sm,
  },
  eyebrow: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 29,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  buttonPressed: {
    backgroundColor: '#E2EAE5',
  },
  buttonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  arrow: {
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: '700',
  },
});
