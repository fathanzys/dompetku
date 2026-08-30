'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import { Sliders, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SimulatorPage() {
  const { summary, goals } = useFinance();

  const [incomeChangePercent, setIncomeChangePercent] = useState<number>(0);
  const [extraUnexpectedExpense, setExtraUnexpectedExpense] = useState<number>(0);
  const [goalPriceIncrease, setGoalPriceIncrease] = useState<number>(0);
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || '');
  const [extraInvestmentMonthly, setExtraInvestmentMonthly] = useState<number>(0);

  const simulatedIncome = Math.max(0, summary.monthlyExpectedIncome * (1 + incomeChangePercent / 100));
  const simulatedNetCashFlow = simulatedIncome - summary.monthlyPlannedExpenses - extraUnexpectedExpense - extraInvestmentMonthly;

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);
  const simGoalTargetPrice = (selectedGoal?.targetPrice || 0) + goalPriceIncrease;
  const simGoalRemaining = Math.max(0, simGoalTargetPrice - (selectedGoal?.resaleValueExpected || 0) - (selectedGoal?.currentSavedAmount || 0));

  const simMonthlyGoalSaving = Math.max(1, (simGoalRemaining / 6));
  const simTotalCommitment = summary.monthlyPlannedExpenses + simMonthlyGoalSaving + extraInvestmentMonthly + extraUnexpectedExpense;
  const simOverAllocated = simTotalCommitment > simulatedIncome;

  const handleResetSimulator = () => {
    setIncomeChangePercent(0);
    setExtraUnexpectedExpense(0);
    setGoalPriceIncrease(0);
    setExtraInvestmentMonthly(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">What-If Financial Stress Simulator</h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulasikan skenario finansial secara real-time tanpa merusak data asli.
          </p>
        </div>

        <button
          onClick={handleResetSimulator}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Skenario</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <h2 className="font-bold text-base text-slate-900">Parameter Skenario What-If</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Perubahan Income ({incomeChangePercent}%)</span>
              <span className={incomeChangePercent < 0 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                Simulated Income: {formatCurrency(simulatedIncome)}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={incomeChangePercent}
              onChange={(e) => setIncomeChangePercent(parseFloat(e.target.value))}
              className="w-full accent-emerald-700 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Geser kiri jika stipend magang / uang saku turun.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Pengeluaran Tak Terduga Bulan Ini (Rp)
            </label>
            <input
              type="number"
              placeholder="e.g. 500000 (Servis HP / Medis)"
              value={extraUnexpectedExpense || ''}
              onChange={(e) => setExtraUnexpectedExpense(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Pilih Goal &amp; Kenaikan Harga Target</label>
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (Harga Saat Ini: {formatCurrency(g.targetPrice)})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Kenaikan harga target (e.g. 1500000)"
              value={goalPriceIncrease || ''}
              onChange={(e) => setGoalPriceIncrease(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-slate-900">Proyeksi Hasil Simulasi</h2>
            <p className="text-xs text-slate-500">Dihitung otomatis tanpa mengubah database</p>
          </div>

          {simOverAllocated ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-rose-900">Skenario Ini Menyebabkan Over-Allocated!</p>
                <p className="text-rose-700 mt-0.5">
                  Total komitmen (Rp {simTotalCommitment.toLocaleString('id-ID')}) melebihi estimasi income (Rp {simulatedIncome.toLocaleString('id-ID')}).
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Skenario Aman &amp; Surplus Cash Flow!</p>
                <p className="text-emerald-700 mt-0.5">
                  Surplus cash flow yang diproyeksikan: {formatCurrency(simulatedIncome - simTotalCommitment)}.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Simulated Net Cash Flow:</span>
              <span className={`font-bold ${simulatedNetCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {formatCurrency(simulatedNetCashFlow)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Simulated Target Price ({selectedGoal?.name}):</span>
              <span className="font-bold text-slate-900">{formatCurrency(simGoalTargetPrice)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Required Goal Saving / Bulan:</span>
              <span className="font-bold text-amber-700">{formatCurrency(simMonthlyGoalSaving)}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-600 font-medium">Proyeksi Emergency Runway:</span>
              <span className="font-bold text-emerald-800">{summary.emergencyRunwayMonths} Bulan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
