import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { magicLinkClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// NOTE: Better Auth for Expo doesn't actually use this https://github.com/better-auth/better-auth/blob/abfc48d2aaf1f186621c33f07bc37add1fd10e86/packages/expo/src/client.ts#L235C10-L240
const createWebCompatibleStorage = () => {
  if (Platform.OS === 'web') {
    return {
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.error('Local storage is unavailable:', e);
        }
      },
      getItem: (key: string): string | null => {
        try {
          return typeof localStorage !== 'undefined'
            ? localStorage.getItem(key)
            : null;
        } catch (e) {
          console.error('Local storage is unavailable:', e);
          return null;
        }
      },
    };
  } else {
    return SecureStore;
  }
};

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    expoClient({
      storage: createWebCompatibleStorage(),
    }),
    magicLinkClient(),
  ],
});

export const { useSession, signIn, signOut, getCookie } = authClient;
