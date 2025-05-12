// src/app/categories/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Categories | eCom Furniture Admin',
  description: 'Manage your product categories.',
};

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
