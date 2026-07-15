import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../shared/styles/theme';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.symbols}>🐺  🦉  🦅</Text>
        <Text style={styles.title}>Discover Your True Nature</Text>
        <Text style={styles.subtitle}>Ανακάλυψε το ζωικό σου αρχέτυπο.</Text>
        <Text style={styles.description}>
          Δέκα σύντομες επιλογές θα εξερευνήσουν τον τρόπο που αποφασίζεις,
          συνεργάζεσαι και αντιδράς υπό πίεση.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={onStart}
          style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
        >
          <Text style={styles.startButtonText}>Ξεκίνα την ανακάλυψη</Text>
        </Pressable>
        <Text style={styles.disclaimer}>
          Πρωτότυπη ψυχαγωγική εμπειρία αυτογνωσίας. Δεν αποτελεί ψυχολογική διάγνωση.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  hero: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  symbols: {
    fontSize: 42,
  },
  title: {
    color: theme.colors.text,
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 44,
  },
  subtitle: {
    color: theme.colors.primary,
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 30,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 17,
    lineHeight: 26,
  },
  footer: {
    gap: theme.spacing.md,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
  },
  startButtonPressed: {
    backgroundColor: theme.colors.primaryPressed,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  disclaimer: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
