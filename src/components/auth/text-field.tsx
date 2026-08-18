import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { Body } from '@/constants/fonts';
import { Brand } from '@/constants/theme';

const ICON_COLOR = '#1a1a1a';

/** Feather-style eye / eye-off used by the password reveal toggle. */
function EyeIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"
        stroke={ICON_COLOR}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={ICON_COLOR} strokeWidth={2} />
    </Svg>
  );
}

function EyeOffIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        stroke={ICON_COLOR}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1={1} y1={1} x2={23} y2={23} stroke={ICON_COLOR} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

type Props = { label: string } & TextInputProps;

/** Labelled input: grey label + rounded field, focus-darkened border, optional password toggle. */
export function TextField({ label, secureTextEntry, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        <TextInput
          style={[styles.input, Platform.OS === 'web' && webInput]}
          placeholderTextColor={Brand.textMuted}
          secureTextEntry={isPassword && hidden}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {isPassword && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={8}
            onPress={() => setHidden((h) => !h)}>
            {hidden ? <EyeOffIcon /> : <EyeIcon />}
          </Pressable>
        )}
      </View>
    </View>
  );
}

// react-native-web draws a focus ring on the inner input; our border handles focus instead.
// `outlineStyle` is a web-only prop absent from RN's TextStyle, hence the cast.
const webInput = { outlineStyle: 'none' } as unknown as TextStyle;

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontFamily: Body.regular, fontSize: 13, color: Brand.textMuted },
  inputRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Brand.neutral200,
    backgroundColor: Brand.neutral50,
  },
  inputRowFocused: { borderColor: Brand.black, borderWidth: 1.5 },
  input: { flex: 1, fontFamily: Body.regular, fontSize: 16, color: Brand.black, padding: 0 },
});
