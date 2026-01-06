'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState<boolean>(false);

  useEffect(() => {
    const pathParts = pathname.split('/');
    if (pathname !== '/login' && pathParts[1] !== user?.role) {
      setUser(null);
      router.replace('/login');
    } else {
      setIsUserValid(true)
    }
  }, [pathname, user]);

  return isUserValid ? children : null;
}