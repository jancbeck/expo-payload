"use client";

import React, { useState } from "react";
import { createPost } from "@/app/actions";
import { Pressable, View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const Form = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.form}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
          placeholder="Title"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={styles.textarea}
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholder="Content"
          multiline
        />
      </View>
      <Pressable
        style={styles.button}
        disabled={isSubmitting}
        onPress={async () => {
          setIsSubmitting(true);
          await createPost({ title, content });
          setIsSubmitting(false);
          router.push("/");
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

export default Form;
