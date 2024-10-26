import { Suspense } from "react";
import { Text, View } from "react-native";
import { getPayload } from "@/lib/payload";
import Form from "@/components/form";

export default function HomePage() {
  return (
    <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>
        Node: {process.version}
      </Text>
      <Suspense fallback={<Text>Loading...</Text>}>
        <Posts />
      </Suspense>
      <Form />
    </View>
  );
}

async function Posts() {
  const payload = await getPayload();
  const posts = await payload.find({
    collection: "posts",
  });
  return posts.docs.map((post) => <Text key={post.id}>{post.title}</Text>);
}
