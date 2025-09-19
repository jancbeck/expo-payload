import { Slot } from 'expo-router';
import { SplashScreenController } from '@/components/client/SplashScreenController';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function Layout() {
  return (
    <>
      <SplashScreenController />
      <GluestackUIProvider mode="light">
        <Slot />
      </GluestackUIProvider>
    </>
  );
}
