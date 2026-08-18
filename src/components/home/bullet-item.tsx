import { StyleSheet, Text, View } from 'react-native';

import { Body } from '@/constants/fonts';
import { Brand } from '@/constants/theme';

import { CheckIcon } from './icons';

export function BulletItem({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <CheckIcon color={Brand.spruce} size={20} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: {
    fontFamily: Body.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.black,
    flexShrink: 1,
  },
});
