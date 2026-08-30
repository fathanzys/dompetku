'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';

function fmtInput(val: string): string {
  return val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function parseFmt(val: string): number {
  return parseFloat(val.replace(/\./g, '')) || 0;
}
import {
  Coins,
  ArrowDownRight,
  Wallet,
  Target,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { IncomeSource, Account, Category, Goal, RecurringFrequency, AccountType, CategoryType } from '@/types';

export default function AdminPanelPage() {
  const {
    incomeSources,
    accounts,
    categories,
    budgets,
    goals,
    addIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
    addAccount,
    updateAccount,
    deleteAccount,
    addCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    addGoal,
    updateGoal,
    deleteGoal,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'income' | 'outcome' | 'accounts' | 'goals'>('income');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Income Form
  const [incName, setIncName] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incFreq, setIncFreq] = useState<RecurringFrequency>('monthly');
  const [incAccount, setIncAccount] = useState(accounts[0]?.id || '');

  // Outcome/Category Form
  const [catName, setCatName] = useState('');
  const [catPlanned, setCatPlanned] = useState('');
  const [catType, setCatType] = useState<CategoryType>('variable');

  // Account Form
  const [accName, setAccName] = useState('');
  const [accType, setAccType] = useState<AccountType>('bank');
  const [accBalance, setAccBalance] = useState('');

  // Goal Form
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalSaved, setGoalSaved] = useState('0');

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setIncName('');
    setIncAmount('');
    setCatName('');
    setCatPlanned('');
    setAccName('');
    setAccBalance('');
    setGoalName('');
    setGoalTarget('');
    setGoalSaved('0');
    setIsModalOpen(true);
  };

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFmt(incAmount);
    if (!amt || !incName) return;
    if (editingId) {
      updateIncomeSource(editingId, { name: incName, expectedAmount: amt, frequency: incFreq, destinationAccountId: incAccount || undefined });
    } else {
      addIncomeSource({ name: incName, expectedAmount: amt, frequency: incFreq, destinationAccountId: incAccount || undefined, isActive: true });
    }
    setIsModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFmt(catPlanned);
    if (!catName) return;
    addCategory({ name: catName, type: catType, isEssential: catType !== 'lifestyle', color: '#059669' });
    if (amt > 0) addBudget({ categoryId: `cat-${Date.now()}`, periodYear: 2026, periodMonth: 9, plannedAmount: amt });
    setIsModalOpen(false);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFmt(accBalance);
    if (!accName) return;
    if (editingId) {
      updateAccount(editingId, { name: accName, type: accType, balance: bal });
    } else {
      addAccount({ name: accName, type: accType, institution: accName, balance: bal, currency: 'IDR', isActive: true });
    }
    setIsModalOpen(false);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFmt(goalTarget);
    if (!target || !goalName) return;
    if (editingId) {
      updateGoal(editingId, { name: goalName, targetPrice: target, currentSavedAmount: parseFmt(goalSaved) });
    } else {
      addGoal({ name: goalName, targetPrice: target, resaleValueExpected: 0, currentSavedAmount: parseFmt(goalSaved), targetDate: '2027-12-31', priority: 1, isEmergencyFund: false, status: 'active' });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-16">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Admin Panel Control Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pusat kontrol tempat Anda memasukkan dan mengedit informasi Pemasukan (Income), Pengeluaran (Outcome), Dompet, dan Target.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Tambah Data Baru</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xs gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('income')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>1. Income (Pemasukan)</span>
        </button>

        <button
          onClick={() => setActiveTab('outcome')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'outcome' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          <span>2. Outcome (Pengeluaran)</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'accounts' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>3. Dompet &amp; Rekening</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'goals' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>4. Target Tabungan</span>
        </button>
      </div>

      {/* TAB 1: INCOME SOURCES */}
      {activeTab === 'income' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Daftar Sumber Pemasukan (Income)</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {incomeSources.length} Item</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">Nama Income</th>
                  <th className="px-4 py-3">Frekuensi</th>
                  <th className="px-4 py-3 text-right">Nominal</th>
                  <th className="px-4 py-3 text-center">Aksi Edit / Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incomeSources.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      Belum ada sumber income. Klik tombol "+ Tambah Data Baru".
                    </td>
                  </tr>
                ) : (
                  incomeSources.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{inc.name}</td>
                      <td className="px-4 py-3 capitalize text-slate-600">{inc.frequency}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-emerald-700">
                        {formatCurrency(inc.expectedAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteIncomeSource(inc.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: OUTCOME / CATEGORIES */}
      {activeTab === 'outcome' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Daftar Kategori Pengeluaran (Outcome)</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {categories.length} Kategori</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">Nama Kategori</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3 text-right">Limit Bulanan</th>
                  <th className="px-4 py-3 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => {
                  const b = budgets.find((b) => b.categoryId === cat.id);
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{cat.name}</td>
                      <td className="px-4 py-3 capitalize text-slate-600">{cat.type.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-slate-900">
                        {b ? formatCurrency(b.plannedAmount) : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Daftar Dompet &amp; Rekening Bank</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {accounts.length} Akun</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">Nama Akun</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3 text-right">Saldo Saat Ini</th>
                  <th className="px-4 py-3 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{acc.name}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{acc.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-emerald-700">
                      {formatCurrency(acc.balance)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteAccount(acc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GOALS */}
      {activeTab === 'goals' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Daftar Target Tabungan (Goals)</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {goals.length} Target</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">Nama Target</th>
                  <th className="px-4 py-3 text-right">Terkumpul</th>
                  <th className="px-4 py-3 text-right">Target Harga</th>
                  <th className="px-4 py-3 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {goals.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{g.name}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-emerald-700">
                      {formatCurrency(g.currentSavedAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-slate-900">
                      {formatCurrency(g.targetPrice)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteGoal(g.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Admin Input */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Tambah Data {activeTab.toUpperCase()}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Income Form */}
            {activeTab === 'income' && (
              <form onSubmit={handleSaveIncome} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Nama Sumber Income</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gaji Utama / Side Job"
                    value={incName}
                    onChange={(e) => setIncName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Nominal Pemasukan (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="5.000.000"
                      value={incAmount}
                      onChange={(e) => setIncAmount(fmtInput(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs">
                  Simpan Income
                </button>
              </form>
            )}

            {/* Outcome Form */}
            {activeTab === 'outcome' && (
              <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Nama Kategori Pengeluaran</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Makan &amp; Jajan"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Limit Budget Bulanan (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1.500.000"
                      value={catPlanned}
                      onChange={(e) => setCatPlanned(fmtInput(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs">
                  Simpan Kategori Outcome
                </button>
              </form>
            )}

            {/* Account Form */}
            {activeTab === 'accounts' && (
              <form onSubmit={handleSaveAccount} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Nama Akun / Rekening</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bank BCA / GoPay"
                    value={accName}
                    onChange={(e) => setAccName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Saldo Saat Ini (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="2.500.000"
                      value={accBalance}
                      onChange={(e) => setAccBalance(fmtInput(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs">
                  Simpan Dompet/Akun
                </button>
              </form>
            )}

            {/* Goal Form */}
            {activeTab === 'goals' && (
              <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Nama Target Tabungan</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Beli Laptop Baru"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Target Harga Total (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="12.000.000"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(fmtInput(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs">
                  Simpan Target
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
