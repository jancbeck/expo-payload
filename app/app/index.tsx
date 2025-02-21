/// <reference types="react/canary" />

import { Suspense } from "react";
import { Text, View, Image } from "react-native";

import { Logout } from "@/components/LogoutForm";
import { getPayload } from "@/lib/payload";
import { generateURL } from "@/lib/ut";
import { Link } from "expo-router";

export default function HomePage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View>
        <Suspense fallback={<Text>Loading...</Text>}>
          <Posts />
        </Suspense>
        <Link
          href="/app/create"
          style={{
            marginTop: 20,
            marginBottom: 20,
            width: "100%",
            padding: 10,
            borderRadius: 4,
            backgroundColor: "#f7f7f7",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          <Text>Create Post</Text>
        </Link>
        <Logout />
      </View>
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
      <View style={{ flexGrow: 1 }}>
        <Text key={post.id}>{post.title ?? "No title"}</Text>
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
