import React, { useState, useRef } from 'react';
import {
  Pressable,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

import { createPost } from '@/lib/actions';
import { getCookie } from '@/lib/auth-client';

type PhotoSelectorMode = 'select' | 'camera';

// Camera component inlined
function Camera({ setPhoto }: { setPhoto: (uri: string) => void }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      if (photo?.base64) {
        // photo is already base64 encoded on the web
        setPhoto(photo.base64);
      } else if (photo?.uri) {
        // on native we need to read the file as base64
        // maybe we can keep the uri and convert it only before submitting to the server?
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setPhoto(`data:image/jpeg;base64,${base64}`);
      }
    }
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={cameraStyles.container}>
        <Text style={cameraStyles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={cameraStyles.container}>
      <CameraView style={cameraStyles.camera} facing={facing} ref={cameraRef}>
        <View style={cameraStyles.buttonContainer}>
          <TouchableOpacity
            style={cameraStyles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Text style={cameraStyles.text}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cameraStyles.button} onPress={takePhoto}>
            <Text style={cameraStyles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

// PhotoSelector component inlined
function PhotoSelector({ setPhoto }: { setPhoto: (uri: string) => void }) {
  const [mode, setMode] = useState<PhotoSelectorMode>('select');

  const handleImagePick = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        console.log('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];

        if (asset.base64) {
          // ImagePicker provides base64 directly
          const mimeType = asset.type === 'video' ? 'video/mp4' : 'image/jpeg';
          const base64WithPrefix = `data:${mimeType};base64,${asset.base64}`;
          setPhoto(base64WithPrefix);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  if (mode === 'camera') {
    return (
      <View style={photoSelectorStyles.container}>
        <Pressable
          style={photoSelectorStyles.backButton}
          onPress={() => setMode('select')}
        >
          <Text style={photoSelectorStyles.backButtonText}>
            ← Back to Options
          </Text>
        </Pressable>
        <Camera setPhoto={setPhoto} />
      </View>
    );
  }

  return (
    <View style={photoSelectorStyles.container}>
      <View style={photoSelectorStyles.optionsContainer}>
        <Text style={photoSelectorStyles.title}>Add a Photo</Text>
        <Text style={photoSelectorStyles.subtitle}>
          Choose how you&apos;d like to add an image to your post
        </Text>

        <Pressable
          style={[photoSelectorStyles.option, photoSelectorStyles.cameraOption]}
          onPress={() => setMode('camera')}
        >
          <Text style={photoSelectorStyles.optionIcon}>📷</Text>
          <View style={photoSelectorStyles.optionContent}>
            <Text style={photoSelectorStyles.optionTitle}>Take Photo</Text>
            <Text style={photoSelectorStyles.optionDescription}>
              Use your camera to capture a new image
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[
            photoSelectorStyles.option,
            photoSelectorStyles.galleryOption,
          ]}
          onPress={handleImagePick}
        >
          <Text style={photoSelectorStyles.optionIcon}>🖼️</Text>
          <View style={photoSelectorStyles.optionContent}>
            <Text style={photoSelectorStyles.optionTitle}>
              Choose from Gallery
            </Text>
            <Text style={photoSelectorStyles.optionDescription}>
              Select an existing image from your photo library
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

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

const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
  },
  flipButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

const photoSelectorStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  option: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cameraOption: {
    borderColor: '#4CAF50',
  },
  galleryOption: {
    borderColor: '#2196F3',
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
