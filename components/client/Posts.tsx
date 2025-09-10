'use client';

import { Suspense, useMemo } from 'react';
import { renderPosts } from '../server/renderPosts';
import { getCookie } from '@/lib/auth-client';
import { LoadingSpinner } from './LoadingSpinner';

export function Posts() {
  const authCookie = getCookie();

  // Call the Server Function with token for authentication
  // Causes > ERROR  Cannot update a component (`%s`) while rendering a different component (`%s`).
  const posts = useMemo(() => renderPosts({ authCookie }), [authCookie]);

  return (
    <Suspense
      fallback={<LoadingSpinner message="Loading posts..." size="large" />}
    >
      {posts}
    </Suspense>
  );
}
