import '../styles/globals.css';
import Layout from '@/components/Layout';

export const metadata = {
  title: ' eCom Furniture Admin',
  description: 'Admin Panel for Furniture Store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
