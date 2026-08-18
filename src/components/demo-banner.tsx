import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Body } from '@/constants/fonts';
import { Brand } from '@/constants/theme';

/**
 * Thin "for demonstration purposes only" strip shown across the top of the SDK
 * (Assessment/Chat) screens. Spec (Figma node 9935-31340): a 34px strip with a
 * #f5f6f8 (Brand.neutral50) background and black, uppercase, centered caption
 * text — 8px padding top and bottom around an 18px line (8 + 18 + 8 = 34).
 *
 * On notched devices the background also fills the top safe-area inset so the
 * strip text is never hidden under the status bar; on web (no inset) the strip is
 * exactly 34px. The design's caption is Libre Franklin 12/18 — we use the loaded
 * regular weight (the Light weight isn't bundled).
 */
export function DemoBanner() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.strip}>
        <Text style={styles.text}>For demonstration purposes only</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: Brand.neutral50 },
  strip: { paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  text: {
    fontFamily: Body.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Brand.black,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
