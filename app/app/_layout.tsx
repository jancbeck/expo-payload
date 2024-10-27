import { Slot } from "expo-router";

import { LoggedIn } from "@/components/LoggedIn";

export default function AppLayout() {
  return (
    <LoggedIn>
      <Slot />
    </LoggedIn>
  );
}
