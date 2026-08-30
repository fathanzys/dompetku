'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Receipt,
  Wallet,
  Target,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

const FRIENDLY_NAV = [
  { label: 'Beranda', href: '/', icon: Home, badge: 'Utama' },
  { label: 'Pencatatan Transaksi', href: '/transactions', icon: Receipt },
  { label: 'Dompet & Rekening', href: '/accounts', icon: Wallet },
  { label: 'Target Tabungan', href: '/goals', icon: Target },
  { label: 'Kelola Data (Admin)', href: '/admin', icon: SlidersHorizontal, badge: 'Edit' },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white h-screen sticky top-0 z-30 p-5 text-slate-800 shadow-xs">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/20">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 className="font-extrabold text-slate-900 text-base leading-tight">DompetKu</h1>
          <p className="text-[11px] text-emerald-700 font-bold">Catatan Keuangan Simpel</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5 flex-1">
        {FRIENDLY_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Friendly Footer Card */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-950 text-xs space-y-1">
        <p className="font-extrabold flex items-center gap-1 text-emerald-800">
          <span>✨ Tips Hari Ini</span>
        </p>
        <p className="text-[11px] text-emerald-900/80 leading-relaxed font-medium">
          Sisihkan 10% uang masuk langsung ke target tabungan sebelum belanja!
        </p>
      </div>
    </aside>
  );
};
