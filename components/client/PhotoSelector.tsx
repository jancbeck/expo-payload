'use client';

import { useState } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Camera } from './Camera';

type PhotoSelectorMode = 'select' | 'camera';

interface PhotoSelectorProps {
  setPhoto: (uri: string) => void;
}

export const PhotoSelector = ({ setPhoto }: PhotoSelectorProps) => {
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
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setMode('select')}>
          <Text style={styles.backButtonText}>← Back to Options</Text>
        </Pressable>
        <Camera setPhoto={setPhoto} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <Text style={styles.title}>Add a Photo</Text>
        <Text style={styles.subtitle}>
          Choose how you&apos;d like to add an image to your post
        </Text>

        <Pressable
          style={[styles.option, styles.cameraOption]}
          onPress={() => setMode('camera')}
        >
          <Text style={styles.optionIcon}>📷</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Take Photo</Text>
            <Text style={styles.optionDescription}>
              Use your camera to capture a new image
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.option, styles.galleryOption]}
          onPress={handleImagePick}
        >
          <Text style={styles.optionIcon}>🖼️</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Choose from Gallery</Text>
            <Text style={styles.optionDescription}>
              Select an existing image from your photo library
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
