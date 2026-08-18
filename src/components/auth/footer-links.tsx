import { Fragment } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Body } from '@/constants/fonts';
import { Brand } from '@/constants/theme';

const ITEMS = ['Terms', 'Privacy Policy', 'Safe Use', 'About'] as const;

/** Bottom-pinned legal links, middot-separated. No-op for now (no target screens yet). */
export function FooterLinks({
  showAboutLink,
  style,
}: {
  showAboutLink: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const items = showAboutLink ? ITEMS : ITEMS.filter((item) => item !== 'About');

  return (
    <View style={[styles.row, style]}>
      {items.map((item, i) => (
        <Fragment key={item}>
          {i > 0 && <Text style={styles.dot}>·</Text>}
          <Pressable
            accessibilityRole="link"
            hitSlop={6}
            onPress={() => {
              // TODO: navigate to the relevant legal page once it exists.
            }}>
            <Text style={styles.link}>{item}</Text>
          </Pressable>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  link: { fontFamily: Body.regular, fontSize: 14, color: Brand.textMuted },
  dot: { fontFamily: Body.regular, fontSize: 14, color: Brand.textMuted },
});
