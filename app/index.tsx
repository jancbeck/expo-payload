import { Text, View } from "react-native";
import { getPayload } from "payload";
import config from "@payload-config";

export default async function HomePage() {
  const payload = await getPayload({ config });
  await payload.create({
    collection: "posts",
    data: {
      title: `Hello world ${new Date().toISOString()}`,
      content: "Welcome to my homepage!",
    },
  });
  const posts = await payload.find({
    collection: "posts",
  });
  return (
    <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>
        Node: {process.version}
      </Text>
      {posts.docs.map((post) => (
        <Text key={post.id}>{post.title}</Text>
      ))}
    </View>
  );
}
