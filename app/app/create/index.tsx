import { View } from "react-native";

import { CreatePostForm } from "@/components/CreatePostForm";

export default function CreatePostPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <CreatePostForm />
    </View>
  );
}
