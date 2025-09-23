import { render } from '@testing-library/react-native';

import CreatePostPage from '@/app/(app)/create';

// Mock the auth client and actions
jest.mock('@/lib/auth-client', () => ({
  getCookie: jest.fn(() => 'mock-cookie'),
}));

jest.mock('@/lib/actions', () => ({
  createPost: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

// Mock expo-camera
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: jest.fn(() => [
    { granted: false },
    jest.fn(),
  ]),
}));

// Mock expo-file-system
jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

describe('CreatePostPage', () => {
  test('renders create post page correctly', () => {
    const { getByText, getByPlaceholderText } = render(<CreatePostPage />);

    getByText('Add a Photo');
    getByText('Take Photo');
    getByText('Choose from Gallery');
    getByText('Title *');
    getByPlaceholderText('Enter post title...');
    getByText('Create Post');
  });
});