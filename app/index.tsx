import { Suspense } from "react";
import { Text, View, Image } from "react-native";
import { getPayload } from "@/lib/payload";
import { Form } from "@/components/Forms";
import { generateURL } from "@/lib/ut";

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
  const { docs } = await payload.find({
    collection: "posts",
  });
  return !!docs.length ? (
    docs.map((post) => (
      <>
        <Text key={post.id}>{post.title ?? "No title"}</Text>
        {post.url && (
          <Image
            source={{ uri: generateURL(post) }}
            style={{ width: 100, height: 100 }}
          />
        )}
      </>
    ))
  ) : (
    <View>
      <Text>No posts yet.</Text>
    </View>
  );
}
