'use client';

import { Text, View } from 'react-native';

import { useSession } from './Providers';

export function Logout() {
  const { logout } = useSession();
  return (
    <View style={{ flexGrow: 0 }}>
      <Text
        style={{ textAlign: 'center' }}
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          logout();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
