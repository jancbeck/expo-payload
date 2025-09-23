import React, { useState } from 'react';
import { Pressable, View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { createPost } from '@/lib/actions';
import { getCookie } from '@/lib/auth-client';
import { PhotoSelector } from '@/components/PhotoSelector';

export default function CreatePostPage() {
  const authCookie = getCookie();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.trim().length > 200) {
      setError('Title must be less than 200 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createPost({
        title: title.trim(),
        photo,
        authCookie,
      });

      if (result.isError) {
        setError(result.message || 'Failed to create post');
        return;
      }

      setSuccess(true);
      setTitle('');
      setPhoto(undefined);

      // Navigate after a brief success message
      setTimeout(() => {
        router.push('/(app)');
      }, 1000);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Create post error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View style={styles.form}>
        {photo ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <Pressable
              style={styles.removePhotoButton}
              onPress={() => setPhoto(undefined)}
              disabled={isSubmitting}
            >
              <Text style={styles.removePhotoText}>Remove Photo</Text>
            </Pressable>
          </View>
        ) : (
          <PhotoSelector setPhoto={setPhoto} />
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (error) setError(null); // Clear error when user starts typing
            }}
            placeholder="Enter post title..."
            editable={!isSubmitting}
            maxLength={200}
          />
          <Text style={styles.characterCount}>
            {title.length}/200 characters
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Post created successfully!</Text>
          </View>
        )}

        <Pressable
          style={[
            styles.button,
            (isSubmitting || !title.trim()) && styles.buttonDisabled,
          ]}
          disabled={isSubmitting || !title.trim()}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Creating Post...' : 'Create Post'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    flexGrow: 1,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  removePhotoButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 4,
  },
  removePhotoText: {
    color: 'white',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    marginBottom: 5,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  successText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    padding: 15,
    borderRadius: 4,
    backgroundColor: '#007bff',
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
