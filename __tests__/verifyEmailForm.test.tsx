import { render } from '@testing-library/react-native';

import { VerifyEmailForm } from '@/components/VerifyEmailForm';

// Mock the server actions
jest.mock('@/lib/actions', () => ({
  verifyEmail: jest.fn(),
}));

describe('<VerifyEmailForm />', () => {
  test('Text renders correctly on VerifyEmailForm', () => {
    const { getByText } = render(<VerifyEmailForm />);

    getByText('Verify');
  });
});
