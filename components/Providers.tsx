"use client";

import { useContext, createContext, type PropsWithChildren } from "react";

import { useStorageState } from "@/lib/useStorageState";
import { loginUser } from "@/lib/actions";

const AuthContext = createContext<{
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<boolean | { message: string }>;
  logout: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  login: async () => false,
  logout: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        login: async ({ email, password }) => {
          const successOrError = await loginUser({ email, password });
          if (typeof successOrError === "string") {
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
    </AuthContext.Provider>
  );
}
