'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import { TrendingUp, Layers, Award, Sparkles } from 'lucide-react';

export default function InvestmentsPage() {
  const { summary, accounts, minInvestmentTarget, setMinInvestmentTarget } = useFinance();

  const investmentAccounts = accounts.filter((a) => a.type === 'investment');

  // Tier Targets
  const targetMonthly = minInvestmentTarget * 2;
  const aggressiveMonthly = minInvestmentTarget * 3.5;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Portfolio Investasi &amp; Target 3-Tier</h1>
        <p className="text-xs text-slate-500 mt-1">
          Investasi sebagai batas MINIMUM. Lacak kontribusi kekayaan jangka panjang Anda.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Portfolio Investasi</span>
          <p className="text-2xl font-extrabold text-cyan-800">{formatCurrency(summary.totalInvestments)}</p>
          <span className="text-[11px] text-slate-500 font-medium">Stockbit, Reksadana, Crypto</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Investment Rate</span>
          <p className="text-2xl font-extrabold text-emerald-800">{summary.investmentRate}%</p>
          <span className="text-[11px] text-slate-500 font-medium">Persentase dari expected income</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Wealth Contribution</span>
          <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(summary.totalWealthContribution)}</p>
          <span className="text-[11px] text-slate-500 font-medium">Savings + Investments bulan ini</span>
        </div>
      </div>

      {/* 3-Tier Investment System */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">3-Tier Investment Framework (Custom Editable)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1: Minimum */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-amber-700 uppercase tracking-wider">Tier 1 — Minimum Target</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-extrabold text-slate-900">{formatCurrency(minInvestmentTarget)}</p>
            <p className="text-[11px] text-slate-500 font-medium">Target wajib disisihkan di awal bulan.</p>
            <div className="pt-2">
              <label className="block text-[10px] text-slate-600 mb-1 font-semibold">Edit Target Minimum (Rp):</label>
              <input
                type="number"
                value={minInvestmentTarget}
                onChange={(e) => setMinInvestmentTarget(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Tier 2: Target */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider">Tier 2 — Target Ideal</span>
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-xl font-extrabold text-emerald-900">{formatCurrency(targetMonthly)}</p>
            <p className="text-[11px] text-slate-600 font-medium">Target ideal saat income stabil / ada bonus side gig.</p>
          </div>

          {/* Tier 3: Aggressive */}
          <div className="p-5 rounded-2xl bg-emerald-100/60 border border-emerald-300 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-emerald-900 uppercase tracking-wider">Tier 3 — Aggressive</span>
              <Sparkles className="w-4 h-4 text-emerald-800" />
            </div>
            <p className="text-xl font-extrabold text-emerald-950">{formatCurrency(aggressiveMonthly)}</p>
            <p className="text-[11px] text-slate-700 font-medium">Percepatan kebebasan finansial saat surplus tinggi.</p>
          </div>
        </div>
      </div>

      {/* Investment Accounts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Akun Portofolio Investasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {investmentAccounts.map((acc) => (
            <div key={acc.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 text-sm">{acc.name}</p>
                <span className="text-xs text-slate-500 font-medium">{acc.institution || 'Investment Platform'}</span>
              </div>
              <span className="font-extrabold text-emerald-800 text-base">{formatCurrency(acc.balance)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
