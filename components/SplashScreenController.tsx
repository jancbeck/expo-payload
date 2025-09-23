import * as SplashScreen from 'expo-splash-screen';
import { useSession } from '@/lib/auth-client';

export function SplashScreenController() {
  const { isPending: isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
