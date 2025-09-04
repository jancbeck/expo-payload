import { Text, View } from 'react-native';
import { Link } from 'expo-router';

import { SignupForm } from '@/components/SignupForm';

export default function SignUpPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Signup</Text>
      <SignupForm />
      <Link
        href="/"
        style={{
          marginTop: 20,
          width: '100%',
          padding: 10,
          borderRadius: 4,
          backgroundColor: '#f7f7f7',
          textAlign: 'center',
          fontSize: 16,
        }}
      >
        <Text>Return</Text>
      </Link>
    </View>
  );
}
