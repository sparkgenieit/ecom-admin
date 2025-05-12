import '../styles/globals.css';
import AuthWrapper from '@/components/AuthWrapper';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-white">
            <AuthWrapper>{children}</AuthWrapper>
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
