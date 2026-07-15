import { Linking, StyleSheet, Text, View } from 'react-native';

import { FocusablePressable } from './FocusablePressable';
import { theme } from '../styles/theme';

const ecosystemUrl = 'https://markellosecosystem.com';

export function AppFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.copy}>
        <Text style={styles.copyright}>© 2026 Markellos Markides. All rights reserved.</Text>
        <Text style={styles.disclaimer}>Ψυχαγωγική εμπειρία αυτογνωσίας.</Text>
        <Text style={styles.disclaimer}>
          Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονική αξιολόγηση.
        </Text>
      </View>

      <View style={styles.links}>
        <Text accessibilityState={{ disabled: true }} style={styles.placeholder}>
          Privacy — Προσεχώς
        </Text>
        <Text accessibilityState={{ disabled: true }} style={styles.placeholder}>
          Feedback — Προσεχώς
        </Text>
        <FocusablePressable
          accessibilityLabel="Επιστροφή στο Markellos Ecosystem"
          accessibilityRole="link"
          onPress={() => Linking.openURL(ecosystemUrl)}
          style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
        >
          <Text style={styles.link}>Επιστροφή στο Markellos Ecosystem</Text>
        </FocusablePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: theme.colors.text,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  copy: {
    flex: 1,
    gap: 4,
    minWidth: 260,
  },
  copyright: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  disclaimer: {
    color: '#C8D1CD',
    fontSize: 12,
    lineHeight: 18,
  },
  links: {
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
    minWidth: 250,
  },
  placeholder: {
    color: '#9DA9A4',
    fontSize: 12,
  },
  linkButton: {
    borderRadius: theme.radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  linkButtonPressed: {
    backgroundColor: '#35443F',
  },
  link: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
