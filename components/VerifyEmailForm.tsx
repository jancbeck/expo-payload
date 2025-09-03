"use client";

import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { verifyEmail } from "@/lib/actions";

export const VerifyEmailForm = () => {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  return (
    <View style={styles.form}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Token</Text>
        <TextInput
          style={styles.input}
          value={token}
          onChangeText={(text) => setToken(text)}
          autoComplete="off"
        />
      </View>
      <Pressable
        style={styles.button}
        disabled={isSubmitting}
        onPress={async () => {
          setIsSubmitting(true);
          const result = await verifyEmail(token);
          setIsSubmitting(false);
          if (result.isError) {
            console.error(result.message);
          } else {
            router.push("/");
          }
        }}
      >
        <Text style={styles.buttonText}>Verify</Text>
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
