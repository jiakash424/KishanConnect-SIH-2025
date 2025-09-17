"use client";

import { createContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

// This is a mock AuthProvider.
// In a real app, you would use Firebase Auth to get the user.
export const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Mock a user object for components that might use it
    useEffect(() => {
        setUser({
            email: "farmer@example.com",
            displayName: "Default Farmer",
        } as User)
    }, [])

  return (
    <AuthContext.Provider value={{ user, loading: false }}>
        {children}
    </AuthContext.Provider>
  );
}
