"use client";

import { Text, View } from "react-native";

import { useSession } from "./Providers";

export function Logout() {
  const { logout } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          logout();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
