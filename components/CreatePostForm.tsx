"use client";

import React, { useState } from "react";
import { Pressable, View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

import { createPost } from "@/lib/actions";
import { useSession } from "@/components/Providers";
import { Camera } from "./Camera";

export const CreatePostForm = () => {
  const { session: token } = useSession();
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  return (
    <View style={styles.form}>
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: 300, height: 300, marginHorizontal: "auto" }}
        />
      ) : (
        <Camera setPhoto={setPhoto} />
      )}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
          placeholder="Title"
        />
      </View>
      <Pressable
        style={styles.button}
        disabled={isSubmitting}
        onPress={async () => {
          setIsSubmitting(true);
          await createPost({ title, photo, token });
          setIsSubmitting(false);
          router.push("/app");
        }}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "100%",
    flexGrow: 1,
  },
  formGroup: {},
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#007bff",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
