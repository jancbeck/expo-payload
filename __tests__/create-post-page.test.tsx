import { render } from '@testing-library/react-native';

import CreatePostPage from '@/app/(app)/create';

// Mock the PhotoSelector component 
jest.mock('@/components/PhotoSelector', () => ({
  PhotoSelector: ({ setPhoto }: { setPhoto: (uri: string) => void }) => {
    const { View, Text, Pressable } = require('react-native');
    return (
      <View>
        <Text>Add a Photo</Text>
        <Pressable onPress={() => setPhoto('mock-photo')}>
          <Text>Take Photo</Text>
        </Pressable>
        <Pressable onPress={() => setPhoto('mock-gallery-photo')}>
          <Text>Choose from Gallery</Text>
        </Pressable>
      </View>
    );
  },
}));

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