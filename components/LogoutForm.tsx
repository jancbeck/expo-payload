'use client';

import { Text, View } from 'react-native';

import { signOut } from '@/lib/auth-client';
import { useRouter } from 'expo-router';

export function Logout() {
  const router = useRouter();
  return (
    <View style={{ flexGrow: 0 }}>
      <Text
        style={{ textAlign: 'center' }}
        onPress={async () => {
          await signOut();
          router.push('/');
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
