import { Slot } from 'expo-router';
import { SplashScreenController } from '@/components/SplashScreenController';

export default function Layout() {
  return (
    <>
      <SplashScreenController />
      <Slot />
    </>
  );
}
