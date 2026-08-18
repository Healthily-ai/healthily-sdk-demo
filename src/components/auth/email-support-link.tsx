import * as Linking from 'expo-linking';
import { type ReactNode } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

import { SUPPORT_MAILTO } from './support-email';

/**
 * Native (iOS/Android) email link. Taps hand the `mailto:` URL to the OS, which
 * opens the default mail app. `openURL` rejects when nothing can handle the URL
 * (e.g. a bare simulator with no mail account), so we swallow that rather than
 * let it surface as an unhandled rejection.
 *
 * Web uses a real anchor instead — see email-support-link.web.tsx.
 */
export function EmailSupportLink({
  style,
  children,
}: {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
}) {
  return (
    <Text
      style={style}
      accessibilityRole="link"
      onPress={() => {
        Linking.openURL(SUPPORT_MAILTO).catch(() => {});
      }}>
      {children}
    </Text>
  );
}
