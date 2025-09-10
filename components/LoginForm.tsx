'use client';

import { useEffect, useState } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useSession, signIn } from '@/lib/auth-client';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, isPending: isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/(app)');
    }
  }, [session, router]);

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  const handleGitHubSignIn = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.social({
        provider: 'github',
        callbackURL: '/', // /(app) results in error "Invalid callbackURL"
      });

      if (result.error) {
        setError(result.error.message || 'Failed to sign in with GitHub');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('GitHub OAuth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign in to Expo Payload</Text>
        <Text style={styles.subtitle}>
          Continue with your GitHub account to get started.
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Pressable
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        disabled={isSubmitting}
        onPress={handleGitHubSignIn}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Signing in...' : 'Continue with GitHub'}
        </Text>
      </Pressable>

      <Text style={styles.helpText}>
        New to the app? We&apos;ll create your account automatically.
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
  button: {
    padding: 16,
    borderRadius: 6,
    backgroundColor: '#24292f',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
