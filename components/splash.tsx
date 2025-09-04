'use client';

import { SplashScreen } from 'expo-router';
import { useSession } from './Providers';

export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
