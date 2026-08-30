'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import { Target, Plus, Edit3, Trash2, X, AlertTriangle } from 'lucide-react';
import { Goal } from '@/types';

function formatNumberInput(val: string): string {
  const numeric = val.replace(/\D/g, '');
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseFormattedNumber(val: string): number {
  return parseFloat(val.replace(/\./g, '')) || 0;
}

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state (formatted display values)
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
    setTargetPrice(formatNumberInput(g.targetPrice.toString()));
    setCurrentSaved(formatNumberInput(g.currentSavedAmount.toString()));
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFormattedNumber(targetPrice);
    if (isNaN(price) || price <= 0 || !name) return;

    if (editingGoalId) {
      updateGoal(editingGoalId, {
        name,
        targetPrice: price,
        currentSavedAmount: parseFormattedNumber(currentSaved),
      });
    } else {
      addGoal({
        name,
        targetPrice: price,
        resaleValueExpected: 0,
        currentSavedAmount: parseFormattedNumber(currentSaved),
        targetDate: '2027-12-31',
        priority: 1,
        isEmergencyFund: false,
        status: 'active',
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (deleteConfirmId) {
      deleteGoal(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6 animate-slideUp max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-extrabold text-slate-900">Target Tabungan Saya</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Tambah, edit, atau hapus target tabungan impian Anda.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Target Baru</span>
        </button>
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-16 px-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-extrabold text-slate-900 mb-1">Belum Ada Target Tabungan</h3>
          <p className="text-xs text-slate-400 mb-4">Yuk buat target impian pertama Anda!</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4" />
            Buat Target Pertama
          </button>
        </div>
      )}

      {/* Goal Cards */}
      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentSavedAmount / (goal.targetPrice || 1)) * 100));
          const remaining = Math.max(0, goal.targetPrice - goal.currentSavedAmount);

          return (
            <div key={goal.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-200 transition-all">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-base text-slate-900 truncate">{goal.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      progress >= 100
                        ? 'bg-emerald-100 text-emerald-700'
                        : progress >= 50
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {progress >= 100 ? '🎉 Selesai!' : `${progress}% Terkumpul`}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(goal)}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Edit Target"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(goal.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Target"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      progress >= 100 ? 'bg-emerald-500' : progress >= 50 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Terkumpul</span>
                  <span className="text-xs font-extrabold text-emerald-700">{formatCurrency(goal.currentSavedAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Target Total</span>
                  <span className="text-xs font-extrabold text-slate-900">{formatCurrency(goal.targetPrice)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Sisa Kekurangan</span>
                  <span className="text-xs font-extrabold text-rose-600">{formatCurrency(remaining)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Goal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingGoalId ? '✏️ Edit Target Tabungan' : '🎯 Tambah Target Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Nama Target Impian</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beli Laptop, Liburan, Motor Baru"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Target Harga Total (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-bold text-sm">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="10.000.000"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(formatNumberInput(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Jumlah Yang Sudah Terkumpul (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-bold text-sm">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="2.500.000"
                    value={currentSaved}
                    onChange={(e) => setCurrentSaved(formatNumberInput(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-sm"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 shadow-xl text-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Hapus Target Ini?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target <strong>"{goals.find(g => g.id === deleteConfirmId)?.name}"</strong> akan dihapus permanen dan tidak bisa dikembalikan.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700"
              >
                Ya, Hapus!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
