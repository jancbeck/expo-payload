import { View } from 'react-native';

import { CreatePostForm } from '@/components/client/CreatePostForm';

export default function CreatePostPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <CreatePostForm />
    </View>
  );
}
