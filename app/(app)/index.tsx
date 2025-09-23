import { Suspense, useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { Link } from 'expo-router';

import { getCookie, signOut } from '@/lib/auth-client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getPosts } from '@/lib/actions';
import { generateURL } from '@/lib/ut';
import type { Post } from '@/payload-types';

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const authCookie = getCookie();
        const result = await getPosts({ authCookie });

        if (result.isError) {
          setError(result.message || 'Failed to fetch posts');
        } else {
          setPosts(result.posts || []);
        }
      } catch {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading posts..." size="large" />;
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: 'center', color: 'red' }}>
          Error: {error}
        </Text>
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: 'center' }}>No posts yet.</Text>
      </View>
    );
  }

  return (
    <View>
      {posts.map((post) => (
        <View key={post.id} style={{ marginBottom: 20, padding: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            {post.title || 'No title'}
          </Text>
          {post.url && (
            <Image
              source={{ uri: generateURL(post) }}
              style={{ width: 100, height: 100 }}
            />
          )}
        </View>
      ))}
    </View>
  );
}

function Logout() {
  return (
    <View style={{ flexGrow: 0 }}>
      <Text
        style={{ textAlign: 'center' }}
        onPress={async () => {
          await signOut();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}

export default function HomePage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View>
        <Suspense fallback={<Text>Loading...</Text>}>
          <Posts />
        </Suspense>
        <Link
          href="/(app)/create"
          style={{
            marginTop: 20,
            marginBottom: 20,
            width: '100%',
            padding: 10,
            borderRadius: 4,
            backgroundColor: '#f7f7f7',
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          <Text>Create Post</Text>
        </Link>
        <Logout />
      </View>
    </View>
  );
}
