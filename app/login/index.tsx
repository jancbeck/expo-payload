import { Text, View } from "react-native";
import { Link } from "expo-router";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <LoginForm />
      <Link
        href="/signup"
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
        <Text>Signup</Text>
      </Link>
    </View>
  );
}
