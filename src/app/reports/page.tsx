'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import { Sparkles, CheckCircle } from 'lucide-react';

export default function ReportsPage() {
  const { summary, transactions, categories } = useFinance();
  const [selectedTab, setSelectedTab] = useState<'monthly' | 'weekly'>('monthly');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.transactionDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const totalExpenseThisMonth = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryExpenses = categories.map((cat) => {
    const total = currentMonthTransactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat.name, total, color: cat.color || '#059669' };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const weeks = [1, 2, 3, 4, 5].map((w) => {
    const weekTxs = currentMonthTransactions.filter((t) => {
      const day = new Date(t.transactionDate).getDate();
      const weekNum = Math.ceil(day / 7);
      return weekNum === w;
    });

    const income = weekTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = weekTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const saving = weekTxs.filter((t) => t.type === 'saving' || t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);

    return { week: `Minggu ${w}`, income, expense, saving };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan &amp; Analisis Finansial</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan naratif bulanan dan perincian ritme kas per minggu (Week 1–5).
          </p>
        </div>

        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
          <button
            onClick={() => setSelectedTab('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'monthly' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laporan Bulanan
          </button>
          <button
            onClick={() => setSelectedTab('weekly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'weekly' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            View Mingguan (5 Weeks)
          </button>
        </div>
      </div>

      {selectedTab === 'monthly' ? (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h2 className="font-bold text-base text-slate-900">Jawaban Naratif: "Bagaimana Kondisi Keuangan Saya Bulan Ini?"</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Apakah Saya Overspend?</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {summary.monthlyActualExpenses > summary.monthlyPlannedExpenses ? (
                    <span className="text-rose-600 font-bold">
                      Ya, pengeluaran aktual ({formatCurrency(summary.monthlyActualExpenses)}) telah melebihi limit planned ({formatCurrency(summary.monthlyPlannedExpenses)}).
                    </span>
                  ) : (
                    <span className="text-emerald-800 font-bold">
                      Tidak, pengeluaran Anda terkontrol baik di bawah limit budget bulanan.
                    </span>
                  )}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Apa Yang Bisa Ditingkatkan?</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Pertahankan kebiasaan menyisihkan minimum investasi di awal bulan sebelum pengeluaran opsional.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-slate-900">Top Pengeluaran Per Kategori</h2>
            <div className="space-y-3">
              {categoryExpenses.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Belum ada transaksi pengeluaran bulan ini.</p>
              ) : (
                categoryExpenses.map((cat) => {
                  const percent = Math.round((cat.total / (totalExpenseThisMonth || 1)) * 100);
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-900">{cat.name}</span>
                        <span className="text-slate-700">{formatCurrency(cat.total)} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-emerald-600"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="px-5 py-3.5">Minggu</th>
                  <th className="px-5 py-3.5 text-right">Income Aktual</th>
                  <th className="px-5 py-3.5 text-right">Pengeluaran</th>
                  <th className="px-5 py-3.5 text-right">Savings &amp; Invest</th>
                  <th className="px-5 py-3.5 text-right">Net Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weeks.map((w) => {
                  const net = w.income - w.expense - w.saving;
                  return (
                    <tr key={w.week} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{w.week}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-emerald-700">{formatCurrency(w.income)}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-rose-600">{formatCurrency(w.expense)}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-amber-700">{formatCurrency(w.saving)}</td>
                      <td className={`px-5 py-3.5 text-right font-extrabold ${net >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {formatCurrency(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
