'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import { Target, Plus, Edit3, Trash2, X, CheckCircle2 } from 'lucide-react';
import { Goal } from '@/types';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [currentSaved, setCurrentSaved] = useState('0');

  const openAddModal = () => {
    setEditingGoalId(null);
    setName('');
    setTargetPrice('');
    setCurrentSaved('0');
    setIsModalOpen(true);
  };

  const openEditModal = (g: Goal) => {
    setEditingGoalId(g.id);
    setName(g.name);
    setTargetPrice(g.targetPrice.toString());
    setCurrentSaved(g.currentSavedAmount.toString());
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0 || !name) return;

    if (editingGoalId) {
      updateGoal(editingGoalId, {
        name,
        targetPrice: price,
        currentSavedAmount: parseFloat(currentSaved) || 0,
      });
    } else {
      addGoal({
        name,
        targetPrice: price,
        resaleValueExpected: 0,
        currentSavedAmount: parseFloat(currentSaved) || 0,
        targetDate: '2027-12-31',
        priority: 1,
        isEmergencyFund: false,
        status: 'active',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-16">
      {/* Header Admin Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Kelola Target Tabungan (Admin CRUD)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tambah target impian baru, update nominal yang sudah terkumpul, atau hapus target.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Buat Target Baru</span>
        </button>
      </div>

      {/* Target Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentSavedAmount / (goal.targetPrice || 1)) * 100));

          return (
            <div key={goal.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{goal.name}</h3>
                  <span className="text-xs text-emerald-700 font-bold">{progress}% Terkumpul! 🎉</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(goal)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100"
                    title="Edit Target / Tabungan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                    title="Hapus Target"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-900 font-extrabold">{formatCurrency(goal.currentSavedAmount)}</span>
                  <span className="text-slate-500">Target: {formatCurrency(goal.targetPrice)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Goal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingGoalId ? 'Edit Target / Tabungan' : 'Tambah Target Tabungan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nama Target Impian</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beli Laptop Baru / Liburan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Target Harga Total (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10000000"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Jumlah Terkumpul Saat Ini (Rp)</label>
                <input
                  type="number"
                  placeholder="e.g. 2500000"
                  value={currentSaved}
                  onChange={(e) => setCurrentSaved(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
