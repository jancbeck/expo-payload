'use client';

import { use, createContext, type PropsWithChildren, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'expo-router';

export type Session = typeof authClient.$Infer.Session;

const AuthContext = createContext<{
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  signUp: ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  session?: Session | null;
  isLoading: boolean;
}>({
  login: () => Promise.resolve(),
  logout: () => null,
  signUp: () => Promise.resolve(),
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
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = authClient.useSession();
  const router = useRouter();

  return (
    <AuthContext
      value={{
        login: async ({ email, password }) => {
          setIsLoading(true);
          const { data, error } = await authClient.signIn.email({
            email,
            password,
          });
          setIsLoading(false);
          if (data?.user.id && !error) {
            router.push('/(app)');
          }
          console.log({ data, error });
        },
        logout: async () => {
          setIsLoading(true);
          await authClient.signOut();
          setIsLoading(false);
          router.push('/');
        },
        signUp: async ({ name, email, password }) => {
          setIsLoading(true);
          const { data, error } = await authClient.signUp.email({
            name,
            email,
            password,
          });
          setIsLoading(false);
          if (data?.user.id && !error) {
            router.push('/(app)');
          }
          console.log({ data, error });
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
