import { render, fireEvent, waitFor } from '@testing-library/react-native';

import { PhotoSelector } from '@/components/PhotoSelector';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

// Mock Camera component
jest.mock('@/components/Camera', () => ({
  Camera: ({ setPhoto }: { setPhoto: (uri: string) => void }) => {
    const { View, Text, Pressable } = require('react-native');
    return (
      <View>
        <Text>Camera View</Text>
        <Pressable onPress={() => setPhoto('mock-camera-photo')}>
          <Text>Take Picture</Text>
        </Pressable>
      </View>
    );
  },
}));

describe('PhotoSelector', () => {
  const mockSetPhoto = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders photo selection options by default', () => {
    const { getByText } = render(<PhotoSelector setPhoto={mockSetPhoto} />);

    getByText('Add a Photo');
    getByText('Choose how you\'d like to add an image to your post');
    getByText('Take Photo');
    getByText('Use your camera to capture a new image');
    getByText('Choose from Gallery');
    getByText('Select an existing image from your photo library');
  });

  test('switches to camera mode when camera option is pressed', () => {
    const { getByText } = render(<PhotoSelector setPhoto={mockSetPhoto} />);

    const cameraOption = getByText('Take Photo');
    fireEvent.press(cameraOption);

    getByText('← Back to Options');
  });

  test('returns to selection mode when back button is pressed', () => {
    const { getByText } = render(<PhotoSelector setPhoto={mockSetPhoto} />);

    // Switch to camera mode
    const cameraOption = getByText('Take Photo');
    fireEvent.press(cameraOption);

    // Go back to options
    const backButton = getByText('← Back to Options');
    fireEvent.press(backButton);

    // Should be back to selection screen
    getByText('Add a Photo');
    getByText('Take Photo');
    getByText('Choose from Gallery');
  });

  test('launches image picker when gallery option is pressed', async () => {
    const { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } = require('expo-image-picker');
    
    requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{
        base64: 'mockbase64data',
        type: 'image',
      }],
    });

    const { getByText } = render(<PhotoSelector setPhoto={mockSetPhoto} />);

    const galleryOption = getByText('Choose from Gallery');
    fireEvent.press(galleryOption);

    await waitFor(() => {
      expect(requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      expect(mockSetPhoto).toHaveBeenCalledWith('data:image/jpeg;base64,mockbase64data');
    });
  });

  test('handles permission denied for image picker', async () => {
    const { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } = require('expo-image-picker');
    
    requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const { getByText } = render(<PhotoSelector setPhoto={mockSetPhoto} />);

    const galleryOption = getByText('Choose from Gallery');
    fireEvent.press(galleryOption);

    await waitFor(() => {
      expect(requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(launchImageLibraryAsync).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Permission to access camera roll is required!');
      expect(mockSetPhoto).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test('handles canceled image picker', async () => {
    const { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } = require('expo-image-picker');
    
    requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    launchImageLibraryAsync.mockResolvedValue({
      canceled: true,
    });

    const { getByText } = render(<PhotoSelector setPhoto={mockSetPhoto} />);

    const galleryOption = getByText('Choose from Gallery');
    fireEvent.press(galleryOption);

    await waitFor(() => {
      expect(requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(launchImageLibraryAsync).toHaveBeenCalled();
      expect(mockSetPhoto).not.toHaveBeenCalled();
    });
  });

  test('handles video file type correctly', async () => {
    const { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } = require('expo-image-picker');
    
    requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{
        base64: 'mockvideobase64',
        type: 'video',
      }],
    });

    const { getByText } = render(<PhotoSelector setPhoto={mockSetPhoto} />);

    const galleryOption = getByText('Choose from Gallery');
    fireEvent.press(galleryOption);

    await waitFor(() => {
      expect(mockSetPhoto).toHaveBeenCalledWith('data:video/mp4;base64,mockvideobase64');
    });
  });

  test('handles image picker error gracefully', async () => {
    const { requestMediaLibraryPermissionsAsync } = require('expo-image-picker');
    
    requestMediaLibraryPermissionsAsync.mockRejectedValue(new Error('Permission error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByText } = render(<PhotoSelector setPhoto={mockSetPhoto} />);

    const galleryOption = getByText('Choose from Gallery');
    fireEvent.press(galleryOption);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Image picker error:', expect.any(Error));
      expect(mockSetPhoto).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});