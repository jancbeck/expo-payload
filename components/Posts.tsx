'use client';

import { Suspense, useMemo } from 'react';
import { renderPosts } from './renderPosts';
import { Text } from 'react-native';
import { getCookie } from '@/lib/auth-client';

export function Posts() {
  const authCookie = getCookie();

  // Call the Server Function with token for authentication
  const posts = useMemo(() => renderPosts({ authCookie }), [authCookie]);
  return <Suspense fallback={<Text>Loading...</Text>}>{posts}</Suspense>;
}
