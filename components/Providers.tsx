'use client';

import { use, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/lib/useStorageState';
import { loginUser } from '@/lib/actions';

const AuthContext = createContext<{
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<true | { message: string }>;
  logout: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  login: () => Promise.resolve({ message: 'N/A' }),
  logout: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext
      value={{
        login: async ({ email, password }) => {
          const successOrError = await loginUser({ email, password });
          if (typeof successOrError === 'string') {
            setSession(successOrError);
            return true;
          } else {
            return successOrError;
          }
        },
        logout: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
