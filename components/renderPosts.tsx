"use server";
import "server-only";

import { Text, View, Image } from "react-native";

import { getPayload } from "@/lib/payload";
import { generateURL } from "@/lib/ut";

export async function renderPosts() {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: "posts",
  });
  return !!docs.length ? (
    docs.map((post) => (
      <View key={post.id}>
        <Text>{post.title || "No title"}</Text>
        {post.url && (
          <Image
            source={{ uri: generateURL(post) }}
            style={{ width: 100, height: 100 }}
          />
        )}
      </View>
    ))
  ) : (
    <View>
      <Text style={{ textAlign: "center" }}>No posts yet.</Text>
    </View>
  );
}
