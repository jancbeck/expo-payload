'use client';

import { Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useSession } from '@/components/Providers';
import { useEffect } from 'react';

export function LoggedIn({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useSession();
  const router = useRouter();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  useEffect(() => {
    if (!session) {
      // On web, static rendering will stop here as the user is not authenticated
      // in the headless Node process that the pages are rendered in.
      return router.push('/');
    }
  });

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // This layout can be deferred because it's not the root layout.
  return children;
}
