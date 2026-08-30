import type { Metadata } from 'next';
import './globals.css';
import { FinanceProvider } from '@/context/FinanceContext';
import { AppLayoutWrapper } from '@/components/layout/AppLayoutWrapper';

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
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </FinanceProvider>
      </body>
    </html>
  );
}
