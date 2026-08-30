'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Loader2 } from 'lucide-react';

export const AppLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useFinance();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded) {
      if (!user && pathname !== '/login') {
        router.replace('/login');
      } else if (user && pathname === '/login') {
        router.replace('/');
      }
    }
  }, [user, isLoaded, pathname, router]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-emerald-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium animate-pulse">Menghubungkan ke Cloud...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated and on login page, just render children without Sidebar/Header
  if (!user && pathname === '/login') {
    return (
      <main className="min-h-screen bg-slate-50">
        {children}
      </main>
    );
  }

  // Render full authenticated app layout
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-24 lg:pb-8 bg-slate-50">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
