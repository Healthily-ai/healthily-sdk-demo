import { Pressable, StyleSheet, View } from 'react-native';

import { ArrowIcon } from '@/components/home/icons';
import { Brand, Radius } from '@/constants/theme';

/** Circular outlined back button (mirrors the shared ArrowIcon to point left). */
export function BackButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={styles.flip}>
        <ArrowIcon color={Brand.black} size={22} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Brand.neutral200,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flip: { transform: [{ scaleX: -1 }] },
  pressed: { opacity: 0.6 },
});
