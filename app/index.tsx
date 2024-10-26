import { Text, View } from "react-native";
import { Form } from "@/components/Forms";

export default function HomePage() {
  return (
    <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>
        Node: {process.version}
      </Text>
      <Form />
    </View>
  );
}
