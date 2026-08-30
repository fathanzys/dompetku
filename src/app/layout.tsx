import type { Metadata } from 'next';
import './globals.css';
import { FinanceProvider } from '@/context/FinanceContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'Catatan Keuangan — Simpel & Praktis',
  description: 'Aplikasi pencatatan keuangan pribadi harian yang simpel, praktis, dan mudah digunakan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <FinanceProvider>
          <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
              <Header />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-24 lg:pb-8 bg-slate-50">
                {children}
              </main>
            </div>
          </div>
          <MobileNav />
        </FinanceProvider>
      </body>
    </html>
  );
}
