import { Slot } from 'expo-router';

import { LoggedIn } from '@/components/client/LoggedIn';

export default function AppLayout() {
  return (
    <LoggedIn>
      <Slot />
    </LoggedIn>
  );
}
