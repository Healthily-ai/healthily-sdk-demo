import { Pressable, StyleSheet, Text } from 'react-native';

import { Display } from '@/constants/fonts';
import { Brand, Radius } from '@/constants/theme';

import { ArrowIcon } from './icons';

type Props = {
  label: string;
  variant: 'primary' | 'secondary';
  /** Stretch to fill the container (stacked mobile layout) vs hug content (row). */
  fullWidth?: boolean;
  disabled?: boolean;
  /** Trailing arrow — on for the Home CTAs, off for the Login button. */
  showArrow?: boolean;
  onPress?: () => void;
};

export function PillButton({
  label,
  variant,
  fullWidth,
  disabled,
  showArrow = true,
  onPress,
}: Props) {
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? Brand.white : Brand.black;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        showArrow ? styles.spaced : styles.centered,
        isPrimary ? styles.primary : styles.secondary,
        fullWidth ? styles.full : styles.auto,
        disabled && (isPrimary ? styles.primaryDisabled : styles.secondaryDisabled),
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
      {showArrow && <ArrowIcon color={fg} size={24} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Radius.pill,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spaced: { justifyContent: 'space-between' },
  centered: { justifyContent: 'center' },
  primary: { backgroundColor: Brand.black },
  secondary: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.neutral200 },
  full: { alignSelf: 'stretch' },
  auto: { alignSelf: 'flex-start' },
  // Design's disabled CTA is a grey fill with crisp white text — not faded black.
  primaryDisabled: { backgroundColor: Brand.neutral300 },
  secondaryDisabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
  label: { fontFamily: Display.semibold, fontSize: 16, lineHeight: 18 },
});
