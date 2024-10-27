import { View } from "react-native";

import { CreatePostForm } from "@/components/CreatePostForm";

export default function CreatePostPage() {
  return (
    <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
      <CreatePostForm />
    </View>
  );
}
