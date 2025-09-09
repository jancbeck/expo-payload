'use client';

import { useEffect, useState } from 'react';
import { Pressable, View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useSession, signIn } from '@/lib/auth-client';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session, isPending: isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // redirect to home
      router.replace('/(app)');
    }
  }, [session, router]);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }
  const handleSendMagicLink = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await signIn.magicLink({
        email: email.trim(),
        callbackURL: '/(app)',
      });

      if (result.error) {
        setError(result.error.message || 'Failed to send magic link');
      } else {
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Magic link error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <View style={styles.form}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Check your email!</Text>
          <Text style={styles.successText}>
            We&apos;ve sent a magic link to {email || 'your email address'}.
            Click the link in the email to sign in.
          </Text>
          <Text style={styles.successSubtext}>
            The link will expire in 5 minutes.
          </Text>
        </View>
        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            setSuccess(false);
            setEmail('');
          }}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Send another link
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign in with Magic Link</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we&apos;ll send you a link to sign in.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
          placeholder="Enter your email address"
          autoCapitalize="none"
          autoComplete="email"
          inputMode="email"
          keyboardType="email-address"
          editable={!isSubmitting}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Pressable
        style={[
          styles.button,
          (isSubmitting || !email.trim()) && styles.buttonDisabled,
        ]}
        disabled={isSubmitting || !email.trim()}
        onPress={handleSendMagicLink}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Sending Magic Link...' : 'Send Magic Link'}
        </Text>
      </Pressable>

      <Text style={styles.helpText}>
        New to the app? The magic link will create your account automatically.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flexGrow: 0,
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formGroup: {
    minWidth: '100%',
    marginBottom: 4,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: '#155724',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  successSubtext: {
    fontSize: 14,
    color: '#0f5132',
    textAlign: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 6,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007bff',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
