import { StyleSheet, Text, View } from 'react-native';

import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <View style={styles.hero}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>ΜΙΑ ΨΥΧΑΓΩΓΙΚΗ ΕΞΕΡΕΥΝΗΣΗ</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Animals Within
        </Text>
        <Text style={styles.subtitle}>Ανακάλυψε το ζωικό σου αρχέτυπο.</Text>
        <Text style={styles.description}>
          Μια σύντομη ψυχαγωγική εμπειρία που εξερευνά τον τρόπο που αποφασίζεις,
          συνεργάζεσαι και αντιδράς.
        </Text>
        <FocusablePressable
          accessibilityRole="button"
          onPress={onStart}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Ξεκίνα την ανακάλυψη</Text>
        </FocusablePressable>
      </View>

      <View accessibilityElementsHidden style={styles.motif}>
        <View style={styles.motifCircleLarge} />
        <View style={styles.motifCircleMedium} />
        <View style={styles.motifCircleSmall} />
        <Text style={styles.motifText}>12</Text>
        <Text style={styles.motifCaption}>ζωικά αρχέτυπα</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    overflow: 'hidden',
    padding: theme.spacing.xl,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.sm,
    minWidth: 220,
    zIndex: 1,
  },
  eyebrow: {
    color: '#C9D9D1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 49,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 29,
  },
  description: {
    color: '#D8E2DD',
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 620,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  buttonPressed: {
    backgroundColor: '#914E2B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  motif: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 190,
    justifyContent: 'center',
    minWidth: 220,
    position: 'relative',
  },
  motifCircleLarge: {
    borderColor: '#6F9185',
    borderRadius: 999,
    borderWidth: 1,
    height: 180,
    position: 'absolute',
    width: 180,
  },
  motifCircleMedium: {
    borderColor: '#8EA99F',
    borderRadius: 999,
    borderWidth: 1,
    height: 132,
    position: 'absolute',
    width: 132,
  },
  motifCircleSmall: {
    backgroundColor: '#3A6A59',
    borderRadius: 999,
    height: 94,
    position: 'absolute',
    width: 94,
  },
  motifText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },
  motifCaption: {
    color: '#C9D9D1',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
