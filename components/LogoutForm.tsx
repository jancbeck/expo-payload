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
          logout();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
