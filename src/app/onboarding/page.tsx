'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { Sparkles, Wallet, DollarSign, Target, ArrowRight, Check } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { addAccount, addIncomeSource, addGoal } = useFinance();
  const [step, setStep] = useState(1);

  const [accountName, setAccountName] = useState('BCA Utama');
  const [accountBalance, setAccountBalance] = useState('3500000');

  const [incomeName, setIncomeName] = useState('Uang Saku Internship');
  const [incomeAmount, setIncomeAmount] = useState('4500000');

  const [goalName, setGoalName] = useState('Dana Darurat / Goal Utama');
  const [goalTarget, setGoalTarget] = useState('10000000');

  const handleFinishOnboarding = () => {
    if (accountName && accountBalance) {
      addAccount({
        name: accountName,
        type: 'bank',
        institution: 'Bank Utama',
        balance: parseFloat(accountBalance) || 0,
        currency: 'IDR',
        isActive: true,
      });
    }

    if (incomeName && incomeAmount) {
      addIncomeSource({
        name: incomeName,
        expectedAmount: parseFloat(incomeAmount) || 0,
        frequency: 'monthly',
        isActive: true,
      });
    }

    if (goalName && goalTarget) {
      addGoal({
        name: goalName,
        targetPrice: parseFloat(goalTarget) || 0,
        resaleValueExpected: 0,
        currentSavedAmount: 0,
        targetDate: '2027-12-31',
        priority: 1,
        isEmergencyFund: true,
        status: 'active',
      });
    }

    router.push('/');
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 animate-fadeIn">
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6 text-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900">Selamat Datang di FinCommand!</h1>
            <p className="text-xs text-emerald-700 font-bold">Wizard Setup Keuangan Classic 4 Langkah</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold text-slate-400">
          <span className={step >= 1 ? 'text-emerald-700' : ''}>1. Akun</span>
          <span className={step >= 2 ? 'text-emerald-700' : ''}>2. Income</span>
          <span className={step >= 3 ? 'text-emerald-700' : ''}>3. Goal</span>
          <span className={step >= 4 ? 'text-emerald-700' : ''}>4. Selesai</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Wallet className="w-5 h-5 text-emerald-700" />
              <h2>Langkah 1: Saldo Akun Bank / E-Wallet Utama</h2>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nama Akun Utama</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Saldo Saat Ini (Rp)</label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Lanjut ke Income</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              <h2>Langkah 2: Sumber Pemasukan Utama</h2>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nama Sumber Income</label>
                <input
                  type="text"
                  value={incomeName}
                  onChange={(e) => setIncomeName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Estimasi Nominal Bulanan (Rp)</label>
                <input
                  type="number"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold text-sm"
              >
                Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Lanjut ke Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Target className="w-5 h-5 text-amber-600" />
              <h2>Langkah 3: Target Tabungan Pertama</h2>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nama Target / Goal</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Target Price (Rp)</label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold text-sm"
              >
                Kembali
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Tinjau Selesai</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Siap Membuka Financial Command Center!</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Seluruh data awal Anda telah disiapkan. Anda dapat mengedit, menambah, dan mengosongkan data kapan saja.
            </p>
            <button
              onClick={handleFinishOnboarding}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm"
            >
              Buka Dashboard Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
