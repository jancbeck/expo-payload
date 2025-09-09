'use client';

import { useEffect, useState } from 'react';
import { Pressable, View, Text, TextInput, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useSession } from '@/components/Providers';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading, session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // redirect to home
      router.replace('/(app)');
    }
  }, [session, router]);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.form}>
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
          await login({ email, password });
          setIsSubmitting(false);
          // if (typeof successOrError === 'object') {
          //   alert(successOrError.message);
          // } else {
          //   router.push('/(app)');
          // }
        }}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Link
        href="/signup"
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 4,
          backgroundColor: '#f7f7f7',
          textAlign: 'center',
          fontSize: 16,
        }}
      >
        <Text>Signup</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flexGrow: 0,
    justifyContent: 'center',
    gap: 20,
  },
  formGroup: { minWidth: '100%' },
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
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
});
