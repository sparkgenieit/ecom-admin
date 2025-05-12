import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import AuthWrapper from '@/components/AuthWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-col md:flex-row flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <AuthWrapper>{children}</AuthWrapper>
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
