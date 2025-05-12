import { ReactNode } from 'react';

export const metadata = {
  title: 'Product Status | eCom Furniture Admin',
  description: 'Manage your product status.',
};

export default function ProductStatusLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
