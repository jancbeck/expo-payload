import { Text, View } from "react-native";
import { Link } from "expo-router";
import { VerifyEmailForm } from "@/components/VerifyEmailForm";

export default function VerifyEmail() {
  return (
    <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>
        Enter email token
      </Text>
      <VerifyEmailForm />
      <Link href="/">
        <Text>Return</Text>
      </Link>
    </View>
  );
}
