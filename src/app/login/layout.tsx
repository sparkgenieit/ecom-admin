'use client';

import Header from '@/components/Header';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
     
      <main className="flex justify-center items-center min-h-[80vh] p-4">
        {children}
      </main>
    </div>
  );
}
