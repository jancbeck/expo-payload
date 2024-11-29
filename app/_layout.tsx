import "expo-dev-client";
import { Slot } from "expo-router";

import { SessionProvider } from "@/components/Providers";

export default function Layout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
