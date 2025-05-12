'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StylesMainContent from './StylesMainContent';

export default function StylesPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login');
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) return null;

  return <StylesMainContent />;
}
