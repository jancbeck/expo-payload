import { View } from 'react-native';
import { LoginForm } from '@/components/client/LoginForm';

export default function LoginPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <LoginForm />
    </View>
  );
}
