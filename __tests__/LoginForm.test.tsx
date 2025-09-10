import { render } from '@testing-library/react-native';

import { LoginForm } from '@/components/client/LoginForm';

// Mock the auth client
jest.mock('@/lib/auth-client', () => ({
  useSession: jest.fn(() => ({
    data: null,
    isPending: false,
  })),
  signIn: {
    social: jest.fn(),
  },
}));

describe('<LoginForm />', () => {
  test('Text renders correctly on LoginForm', () => {
    const { getByText } = render(<LoginForm />);

    getByText('Continue with GitHub');
  });
});
