'use client';

import React, { useState } from 'react';
import { Pressable, View, Text, TextInput, StyleSheet } from 'react-native';

import { useSession } from './Providers';

export const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useSession();

  return (
    <View style={styles.form}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          autoCapitalize="none"
          autoComplete="email"
          inputMode="email"
          submitBehavior="blurAndSubmit"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Content"
          autoComplete="off"
          secureTextEntry
        />
      </View>
      <Pressable
        style={styles.button}
        disabled={isSubmitting}
        onPress={async () => {
          setIsSubmitting(true);
          await signUp({ name, email, password });
          setIsSubmitting(false);
        }}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    minWidth: '100%',
    marginHorizontal: 'auto',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  formGroup: {},
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
