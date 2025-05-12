'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    // If not logged in and not already on /login
    if (!token && pathname !== '/login') {
      router.replace('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
