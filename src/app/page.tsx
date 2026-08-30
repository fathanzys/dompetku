'use client';

import React, { useState } from 'react';
import {
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  CreditCard,
  Target,
  TrendingUp,
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
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const openExpenseModal = () => { setDefaultModalType('expense'); setIsModalOpen(true); };
  const openIncomeModal = () => { setDefaultModalType('income'); setIsModalOpen(true); };

  const mask = (val: string) => hideAmount ? '••••••' : val;

  return (
    <div className="space-y-5 pb-20 animate-slideUp max-w-2xl mx-auto">

      {/* === HERO BALANCE CARD === */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white space-y-4 shadow-lg shadow-emerald-600/20">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest">Total Saldo Keuangan</p>
            <h2 className="text-3xl font-black mt-1 leading-none tracking-tight">
              {hideAmount ? '•••••••••' : formatCurrency(totalBalance)}
            </h2>
            <p className="text-[11px] text-emerald-200 mt-1">dari {accounts.length} dompet &amp; rekening</p>
          </div>
          <button
            onClick={() => setHideAmount(!hideAmount)}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            {hideAmount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Income vs Expense Pills */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
            <div className="p-1.5 rounded-xl bg-emerald-500/30">
              <ArrowUpRight className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-200 font-bold uppercase">Pemasukan Bulan Ini</p>
              <p className="font-extrabold text-white text-sm">{mask(formatCurrency(summary.monthlyActualIncome || summary.monthlyExpectedIncome))}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
            <div className="p-1.5 rounded-xl bg-rose-500/30">
              <ArrowDownRight className="w-4 h-4 text-rose-200" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-200 font-bold uppercase">Pengeluaran Bulan Ini</p>
              <p className="font-extrabold text-white text-sm">{mask(formatCurrency(summary.monthlyActualExpenses))}</p>
            </div>
          </div>
        </div>
      </div>

      {/* === QUICK ACTION BUTTONS === */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={openExpenseModal}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-rose-100 shadow-xs hover:border-rose-300 hover:shadow-sm active:scale-95 transition-all text-left"
        >
          <div className="p-3 rounded-2xl bg-rose-50 shrink-0">
            <ArrowDownRight className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <span className="block text-xs font-extrabold text-slate-900">Catat Keluar</span>
            <span className="block text-[11px] text-slate-400 font-medium">Jajan, Kost, Makan</span>
          </div>
        </button>

        <button
          onClick={openIncomeModal}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-sm active:scale-95 transition-all text-left"
        >
          <div className="p-3 rounded-2xl bg-emerald-50 shrink-0">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="block text-xs font-extrabold text-slate-900">Catat Masuk</span>
            <span className="block text-[11px] text-slate-400 font-medium">Gaji, Bonus, Transfer</span>
          </div>
        </button>
      </div>

      {/* === ACCOUNTS RECAP === */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Dompet &amp; Rekening
          </h3>
          <Link href="/accounts" className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 hover:underline">
            Kelola <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {accounts.slice(0, 4).map((acc) => (
          <div key={acc.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-xs">{acc.name}</p>
                <p className="text-[10px] text-slate-400 capitalize font-medium">{acc.type.replace('_', ' ')}</p>
              </div>
            </div>
            <span className="font-extrabold text-slate-900 text-xs">{mask(formatCurrency(acc.balance))}</span>
          </div>
        ))}

        {accounts.length > 4 && (
          <Link href="/accounts" className="block text-center text-[11px] text-slate-400 font-medium py-2 hover:text-emerald-600">
            +{accounts.length - 4} akun lainnya →
          </Link>
        )}
      </div>

      {/* === GOALS RECAP === */}
      {goals.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-500" />
              Target Tabungan
            </h3>
            <Link href="/goals" className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 hover:underline">
              Lihat Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {goals.slice(0, 3).map((goal) => {
            const progress = Math.min(100, Math.round((goal.currentSavedAmount / (goal.targetPrice || 1)) * 100));
            return (
              <div key={goal.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex justify-between items-start">
                  <p className="font-extrabold text-slate-900 text-xs flex-1 truncate pr-2">{goal.name}</p>
                  <span className="text-[10px] font-bold text-emerald-700 shrink-0">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>{mask(formatCurrency(goal.currentSavedAmount))} terkumpul</span>
                  <span>Target: {mask(formatCurrency(goal.targetPrice))}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === RECENT TRANSACTIONS === */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-slate-800 text-sm">Transaksi Terakhir</h3>
          <Link href="/transactions" className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 hover:underline">
            Lihat Semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-xs text-slate-400">Belum ada transaksi. Yuk catat yang pertama!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                      {tx.type === 'income'
                        ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                        : <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{tx.description}</p>
                      <p className="text-[10px] text-slate-400">{tx.transactionDate}</p>
                    </div>
                  </div>
                  <span className={`font-extrabold text-xs ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{mask(formatCurrency(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* === ADMIN SHORTCUT === */}
      <Link
        href="/admin"
        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100">
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-xs">Kelola Data (Admin Panel)</p>
            <p className="text-[10px] text-slate-400">Edit income, outcome, dompet, dan target</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </Link>

      {isModalOpen && (
        <QuickTransactionModal
          defaultType={defaultModalType}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
