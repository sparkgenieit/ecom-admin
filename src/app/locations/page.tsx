'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationsMainContent from './LocationsMainContent';

export default function LocationsPage() {
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

  return <LocationsMainContent />;
}
