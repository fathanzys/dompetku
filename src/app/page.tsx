'use client';

import React, { useState } from 'react';
import {
  Wallet,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CreditCard,
  SlidersHorizontal,
} from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import Link from 'next/link';
import { QuickTransactionModal } from '@/components/modals/QuickTransactionModal';

export default function DashboardPage() {
  const { summary, accounts, transactions, goals } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultModalType, setDefaultModalType] = useState<'income' | 'expense'>('expense');
  const [hideAmount, setHideAmount] = useState(false);

  const recentTransactions = transactions.slice(0, 5);

  const openExpenseModal = () => {
    setDefaultModalType('expense');
    setIsModalOpen(true);
  };

  const openIncomeModal = () => {
    setDefaultModalType('income');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 animate-slideUp max-w-2xl mx-auto">
      {/* 1. Friendly Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Halo, Selamat Datang! 👋</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Berikut ringkasan dompet dan keuangan Anda hari ini.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Status: Keuangan Aman</span>
        </div>
      </div>

      {/* 2. Hero Saldo Utama Card (Friendly Soft Emerald Gradient) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 text-white shadow-lg space-y-4">
        <div className="flex justify-between items-center text-emerald-100 text-xs font-semibold">
          <span className="uppercase tracking-wider font-extrabold text-[11px] text-emerald-200">
            Total Saldo Keuangan Saya
          </span>
          <button
            onClick={() => setHideAmount(!hideAmount)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs transition-all"
          >
            {hideAmount ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hideAmount ? 'Tampilkan' : 'Sembunyikan'}</span>
          </button>
        </div>

        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {hideAmount ? '••••••••' : formatCurrency(summary.totalCash + summary.totalSavings)}
          </h2>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Total akumulasi uang di rekening bank, e-wallet, dan dompet Anda.
          </p>
        </div>

        {/* Income vs Expense Split Pills */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-500/40 text-xs">
          <div className="flex items-center gap-2.5 bg-emerald-800/40 p-3 rounded-2xl border border-emerald-400/20">
            <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-200">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 uppercase font-extrabold block">Pemasukan Bulan Ini</span>
              <p className="font-extrabold text-white text-sm">
                {hideAmount ? '••••' : formatCurrency(summary.monthlyExpectedIncome)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-emerald-800/40 p-3 rounded-2xl border border-emerald-400/20">
            <div className="p-2 rounded-xl bg-rose-500/30 text-rose-200">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 uppercase font-extrabold block">Pengeluaran Bulan Ini</span>
              <p className="font-extrabold text-white text-sm">
                {hideAmount ? '••••' : formatCurrency(summary.monthlyActualExpenses || summary.monthlyPlannedExpenses)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Big Friendly Action Cards (Catat Uang Keluar / Masuk) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={openExpenseModal}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md active:scale-98 transition-all text-left"
        >
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-black text-slate-900">+ Uang Keluar</span>
            <span className="block text-[11px] text-slate-500 font-medium">Jajan, Kost, Makan</span>
          </div>
        </button>

        <button
          onClick={openIncomeModal}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md active:scale-98 transition-all text-left"
        >
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-black text-slate-900">+ Uang Masuk</span>
            <span className="block text-[11px] text-slate-500 font-medium">Gaji, Bonus, Transfer</span>
          </div>
        </button>
      </div>

      {/* 4. Dompet & Rekening Saya */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Dompet &amp; Rekening Saya</span>
          </h3>
          <Link href="/admin" className="text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Kelola Saldo</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {accounts.map((acc) => (
            <div key={acc.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex justify-between items-center hover:border-emerald-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{acc.name}</p>
                  <span className="text-[10px] text-slate-400 font-semibold capitalize">{acc.type.replace('_', ' ')}</span>
                </div>
              </div>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                {hideAmount ? '••••' : formatCurrency(acc.balance)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Target Tabungan Saya */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-amber-600" />
            <span>Target Tabungan Saya</span>
          </h3>
          <Link href="/goals" className="text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
            <span>Lihat Semua Target</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {goals.slice(0, 3).map((goal) => {
            const progress = Math.min(100, Math.round((goal.currentSavedAmount / (goal.targetPrice || 1)) * 100));
            return (
              <div key={goal.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900 font-extrabold">{goal.name}</span>
                  <span className="text-emerald-700 font-extrabold">
                    {hideAmount ? '••••' : formatCurrency(goal.currentSavedAmount)} / {hideAmount ? '••••' : formatCurrency(goal.targetPrice)} ({progress}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Catatan Transaksi Terbaru */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm">Catatan Transaksi Terakhir</h3>
          <Link href="/transactions" className="text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
            <span>Lihat Riwayat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs divide-y divide-slate-100">
          {recentTransactions.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">Belum ada transaksi pencatatan.</p>
          ) : (
            recentTransactions.map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">{tx.description}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{tx.transactionDate}</span>
                  </div>
                </div>
                <span className={`font-extrabold ${tx.type === 'income' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{hideAmount ? '••••' : formatCurrency(tx.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <QuickTransactionModal
          defaultType={defaultModalType}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
