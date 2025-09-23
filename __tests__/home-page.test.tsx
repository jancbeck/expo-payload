import { render, waitFor } from '@testing-library/react-native';

import HomePage from '@/app/(app)/index';

// Mock the LoadingSpinner component
jest.mock('@/components/LoadingSpinner', () => ({
  LoadingSpinner: ({ message }: { message: string }) => `LoadingSpinner: ${message}`,
}));

// Mock the auth client and actions
jest.mock('@/lib/auth-client', () => ({
  getCookie: jest.fn(() => 'mock-cookie'),
  signOut: jest.fn(),
}));

jest.mock('@/lib/actions', () => ({
  getPosts: jest.fn(),
}));

jest.mock('@/lib/ut', () => ({
  generateURL: jest.fn((post) => `https://example.com/${post.id}`),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  Link: ({ children, ...props }: any) => children,
}));

describe('HomePage', () => {
  test('renders home page correctly', async () => {
    const { getPosts } = require('@/lib/actions');
    getPosts.mockResolvedValue({ posts: [] });

    const { getByText } = render(<HomePage />);

    getByText('Create Post');
    getByText('Sign Out');

    // Wait for async operations to complete
    await waitFor(() => {
      getByText('No posts yet.');
    });
  });
});