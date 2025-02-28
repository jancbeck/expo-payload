import { Slot } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import { SessionProvider } from "@/components/Providers";

export default function Layout() {
  return (
    <GluestackUIProvider mode="light">
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </GluestackUIProvider>
  );
}
