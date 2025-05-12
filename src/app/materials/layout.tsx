import { ReactNode } from 'react';

export const metadata = {
  title: 'Materials | eCom Furniture Admin',
  description: 'Manage your materials.',
};

export default function MaterialsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
