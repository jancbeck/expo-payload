'use server';

import { Text, View, Image } from 'react-native';

import { getPayload } from '@/lib/payload';
import { generateURL } from '@/lib/ut';
import { getUser } from '@/lib/actions';

export async function renderPosts({ authCookie }: { authCookie: string }) {
  // doesn't seem to work due to issue with expo router unstable_headers function
  // const user = await payload.auth({
  //   headers: new Headers({ Cookie: authCookie }),
  // });

  const user = await getUser(authCookie);

  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'posts',
    // enforce authentication
    user,
    overrideAccess: false,
  });
  return !!docs.length ? (
    docs.map((post) => (
      <View key={post.id}>
        <Text>{post.title || 'No title'}</Text>
        {post.url && (
          <Image
            source={{ uri: generateURL(post) }}
            style={{ width: 100, height: 100 }}
          />
        )}
      </View>
    ))
  ) : (
    <View>
      <Text style={{ textAlign: 'center' }}>No posts yet.</Text>
    </View>
  );
}
