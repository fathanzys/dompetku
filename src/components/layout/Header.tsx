'use client';

import React, { useState } from 'react';
import { Plus, Sparkles, SlidersHorizontal } from 'lucide-react';
import { QuickTransactionModal } from '../modals/QuickTransactionModal';
import Link from 'next/link';

export const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          <Sparkles className="w-4 h-4 fill-current text-white" />
        </div>
        <div>
          <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-none block">DompetKu</span>
          <span className="text-[10px] text-emerald-700 font-bold block">Pencatatan Keuangan Praktis</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Kelola Data (Admin)"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Kelola Data</span>
        </Link>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Catat Transaksi</span>
        </button>
      </div>

      {isModalOpen && <QuickTransactionModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
};
