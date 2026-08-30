'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Receipt, Wallet, Target, SlidersHorizontal } from 'lucide-react';

const MOBILE_NAV = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Catat', href: '/transactions', icon: Receipt },
  { label: 'Dompet', href: '/accounts', icon: Wallet },
  { label: 'Target', href: '/goals', icon: Target },
  { label: 'Kelola', href: '/admin', icon: SlidersHorizontal },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {MOBILE_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive ? 'text-emerald-700 font-extrabold bg-emerald-50' : 'text-slate-500 font-semibold hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
