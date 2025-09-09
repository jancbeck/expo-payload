import { Slot } from 'expo-router';
import { SessionProvider } from '@/components/Providers';
import { SplashScreenController } from '@/components/splash';

export default function Layout() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <Slot />
    </SessionProvider>
  );
}
