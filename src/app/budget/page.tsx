'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import { PieChart, Clock, CheckCircle2, SkipForward, AlertCircle, Edit3, Plus, Trash2, X } from 'lucide-react';
import { RecurringStatus, CategoryType } from '@/types';

export default function BudgetPage() {
  const { budgets, categories, transactions, recurringTransactions, updateBudget, addCategory, deleteCategory, updateRecurringStatus } = useFinance();
  
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [newPlannedAmount, setNewPlannedAmount] = useState('');
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);

  // New Category Form
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<CategoryType>('variable');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthExpenses = transactions.filter((t) => {
    const d = new Date(t.transactionDate);
    return t.type === 'expense' && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const handleSaveBudget = (id: string) => {
    const val = parseFloat(newPlannedAmount);
    if (!isNaN(val) && val >= 0) {
      updateBudget(id, val);
    }
    setEditingBudgetId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    addCategory({
      name: catName,
      type: catType,
      isEssential: catType !== 'lifestyle',
      color: '#059669',
    });

    setCatName('');
    setIsAddCatModalOpen(false);
  };

  const getStatusBadge = (status: RecurringStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'skipped':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'due':
        return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
      case 'upcoming':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alokasi Budget &amp; Category Envelopes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Atur limit bulanan per kategori dan pantau alokasi pengeluaran secara langsung.
          </p>
        </div>

        <button
          onClick={() => setIsAddCatModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Tambah Kategori Envelope</span>
        </button>
      </div>

      {/* Envelope Budgets Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">Envelope Limit Per Kategori</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const cat = categories.find((c) => c.id === b.categoryId);
            const actual = currentMonthExpenses
              .filter((t) => t.categoryId === b.categoryId)
              .reduce((sum, t) => sum + t.amount, 0);

            const percentage = Math.min(100, Math.round((actual / (b.plannedAmount || 1)) * 100));
            const isOver = actual > b.plannedAmount;

            return (
              <div key={b.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{cat?.name || 'Kategori'}</span>
                  <div className="flex items-center gap-1">
                    {editingBudgetId === b.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={newPlannedAmount}
                          onChange={(e) => setNewPlannedAmount(e.target.value)}
                          className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-bold"
                          placeholder="Limit baru"
                        />
                        <button
                          onClick={() => handleSaveBudget(b.id)}
                          className="px-2.5 py-1 bg-emerald-700 text-white font-bold rounded-lg text-xs"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingBudgetId(b.id);
                          setNewPlannedAmount(b.plannedAmount.toString());
                        }}
                        className="p-1 text-slate-400 hover:text-emerald-700"
                        title="Edit Limit Envelope"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {cat && (
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Terpakai: {formatCurrency(actual)}</span>
                    <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                      Limit: {formatCurrency(b.plannedAmount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? 'bg-rose-600' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {isOver && (
                  <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Over-budget sebesar {formatCurrency(actual - b.plannedAmount)}!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recurring Transactions Lifecycle Engine */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-slate-900">Siklus Transaksi Rutin (Recurring Engine)</h2>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="px-5 py-3.5">Deskripsi</th>
                  <th className="px-5 py-3.5">Frekuensi</th>
                  <th className="px-5 py-3.5">Next Due Date</th>
                  <th className="px-5 py-3.5 text-right">Nominal</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-center">Transisi Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recurringTransactions.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 text-sm">{rec.description}</td>
                    <td className="px-5 py-3.5 capitalize text-slate-600 font-medium">{rec.frequency}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-semibold">{rec.nextDueDate}</td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-slate-900">{formatCurrency(rec.amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold capitalize ${getStatusBadge(rec.status)}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => updateRecurringStatus(rec.id, 'paid')}
                          title="Tandai Paid"
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                        </button>
                        <button
                          onClick={() => updateRecurringStatus(rec.id, 'skipped')}
                          title="Skip Bulan Ini"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 text-[11px] font-bold flex items-center gap-1"
                        >
                          <SkipForward className="w-3.5 h-3.5" /> Skip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Tambah Kategori Envelope Baru</h3>
              <button onClick={() => setIsAddCatModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pet Care / Belanja Buku"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Tipe Kategori</label>
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as CategoryType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option value="fixed_recurring">Fixed / Recurring</option>
                  <option value="variable">Variable Spending</option>
                  <option value="lifestyle">Lifestyle &amp; Leisure</option>
                  <option value="family">Keluarga</option>
                  <option value="emergency">Emergency / Unexpected</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 shadow-sm"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
