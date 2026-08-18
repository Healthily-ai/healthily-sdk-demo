import { Chat } from '@yourmd/yourmd-react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { DemoBanner } from '@/components/demo-banner';
import { YourMdProvider } from '@/components/yourmd/yourmd-provider';
import { useAuthStore } from '@/store/auth-store';

export default function ChatScreen() {
  const router = useRouter();
  const resetSession = useAuthStore((s) => s.resetSession);

  // The SDK session is scoped to this single visit: drop the ephemeral SDK
  // credentials when the screen unmounts (user exits back to "/") so the next
  // visit re-runs /healthily-login (resetting the flow). The saved /login token
  // is kept, so that re-entry can skip the form while it's still valid. Resetting
  // on unmount (rather than on home focus) avoids clearing them while
  // YourMdProvider is still mounted, which would redirect it to /login mid-exit.
  useEffect(() => () => resetSession(), [resetSession]);

  return (
    <View style={styles.screen}>
      <DemoBanner />
      <YourMdProvider>
        <Chat onExit={() => router.back()} />
      </YourMdProvider>
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
