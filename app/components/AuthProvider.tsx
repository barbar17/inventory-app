'use client';

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../type/User';

type AuthContextValue = {
  user: User | null,
  setUser: Dispatch<SetStateAction<User | null>>,
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("this page is not within AuthProvider")
  }
  return ctx
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname !== '/login') {
      setUser(null);
      router.replace('/login');
      return;
    }
  }, [pathname]);

  const logout = () => {
    setUser(null);
    router.replace('/login')
  };

  const checkUserToken = async () => {
    try {
      const res = await fetch("/api/user/whoami", {
        credentials: "include",
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const payload = await res.json()
      if (!res.ok) {
        alert(payload.error)
        return
      }

      const user: User = {
        username: payload.username,
        role: payload.role,
        isAuth: true
      }
      setUser(user)
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    checkUserToken()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};