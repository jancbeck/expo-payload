import { render } from '@testing-library/react-native';

import { LoginForm } from '@/components/LoginForm';

// Mock the server actions
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: jest.fn(),
    },
  },
}));

describe('<LoginForm />', () => {
  test('Text renders correctly on LoginForm', () => {
    const { getByText } = render(<LoginForm />);

    getByText('Login');
  });
});
