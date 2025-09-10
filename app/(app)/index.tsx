import { Suspense } from 'react';
import { Text, View } from 'react-native';

import { Logout } from '@/components/client/LogoutForm';
import { Link } from 'expo-router';
import { Posts } from '@/components/client/Posts';

export default function HomePage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View>
        <Suspense fallback={<Text>Loading...</Text>}>
          <Posts />
        </Suspense>
        <Link
          href="/(app)/create"
          style={{
            marginTop: 20,
            marginBottom: 20,
            width: '100%',
            padding: 10,
            borderRadius: 4,
            backgroundColor: '#f7f7f7',
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          <Text>Create Post</Text>
        </Link>
        <Logout />
      </View>
    </View>
  );
}
