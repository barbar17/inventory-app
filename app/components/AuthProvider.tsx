'use client';
import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, useMemo, useEffectEvent, useCallback, use } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserCtx } from '../types/User';
import { Container, Spinner } from 'react-bootstrap';
import Header from './Header';
import { toast } from 'react-toastify';

type AuthContextValue = {
  user: UserCtx | null,
  setUser: Dispatch<SetStateAction<UserCtx | null>>,
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const Loader = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }}
    >
      <div className="text-center">
        <Spinner animation="border" />
        <p className="mt-2">Loading</p>
      </div>
    </div>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("this page is not within AuthProvider")
  }
  return ctx
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserCtx | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCheckAuth, setIsCheckAuth] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    setLoading(true);
    setUser(null);
    router.replace('/login');
  }, [])

  useEffect(() => {
    if (!user && pathname !== '/login' && isCheckAuth === false) {
      setUser(null);
      router.replace('/login');
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/login') {
      const refreshContext = async () => {
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
            toast.error(payload.error)
            logout();
            return;
          }

          const user: UserCtx = {
            username: payload.username,
            role: payload.role,
            isAuth: true
          }
          setUser(user)
          setLoading(false)
        } catch (error) {
          alert(error)
          logout();
        }
      }

      refreshContext()
      setIsCheckAuth(false)
    }
  }, [])

  const ctxValue = useMemo(() => ({ user, setUser, logout, loading, setLoading }), [user, loading]);

  return (
    <>
      {loading && <Loader />}
      <AuthContext.Provider value={ctxValue}>
        <Header/>
        <Container className="mt-4">
          {children}
        </Container>
      </AuthContext.Provider>
    </>
  );
};