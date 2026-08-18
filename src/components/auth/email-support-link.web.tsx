import { type ComponentType, type ReactNode } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { SUPPORT_MAILTO } from './support-email';

// react-native-web renders a `Text` with an `href` as a real <a> element, but
// `href` isn't part of the react-native type defs — declare it locally.
type AnchorTextProps = TextProps & { href?: string };
const AnchorText = Text as ComponentType<AnchorTextProps>;

/**
 * Web email link. Renders a real <a href="mailto:…"> so the browser handles the
 * mailto with the user's configured mail/webmail handler and supports
 * right-click / cmd-click. This is more reliable than expo-linking's web path,
 * which assigns `window.location` and silently does nothing without a handler.
 *
 * Native (iOS/Android) uses expo-linking instead — see email-support-link.tsx.
 */
export function EmailSupportLink({
  style,
  children,
}: {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
}) {
  return (
    <AnchorText href={SUPPORT_MAILTO} style={style} accessibilityRole="link">
      {children}
    </AnchorText>
  );
}
