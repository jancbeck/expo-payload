'use client';

import { Text, View } from 'react-native';

import { signOut } from '@/lib/auth-client';

export function Logout() {
  return (
    <View style={{ flexGrow: 0 }}>
      <Text
        style={{ textAlign: 'center' }}
        onPress={async () => {
          await signOut();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
