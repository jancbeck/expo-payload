import { Text, View } from "react-native";
import { Link } from "expo-router";

import { VerifyEmailForm } from "@/components/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>
        Enter email token
      </Text>
      <VerifyEmailForm />
      <Link
        href="/"
        style={{
          marginTop: 20,
          width: "100%",
          padding: 10,
          borderRadius: 4,
          backgroundColor: "#f7f7f7",
          textAlign: "center",
          fontSize: 16,
        }}
      >
        <Text>Return</Text>
      </Link>
    </View>
  );
}
