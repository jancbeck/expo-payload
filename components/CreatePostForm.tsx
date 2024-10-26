import React, { useState } from "react";
import { Pressable, View, Text, TextInput, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { createPost } from "@/app/actions";
import { Camera } from "./Camera";
import { useRouter } from "expo-router";

export const CreatePostForm = ({ token }: { token: string }) => {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  return (
    <View style={styles.form}>
      {photo ? (
        <Image source={{ uri: photo }} style={{ width: 100, height: 100 }} />
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
          router.reload();
        }}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    minWidth: "100%",
    marginHorizontal: "auto",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  formGroup: {},
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 16,
  },
  textarea: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 16,
    minHeight: 100,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
