'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, calculateMonthlyIncomeEquivalent } from '@/utils/financialCalculations';
import { Coins, Plus, Edit3, Trash2, ArrowUpRight, Check, X } from 'lucide-react';
import { IncomeSource, RecurringFrequency } from '@/types';

export default function IncomePage() {
  const { incomeSources, accounts, addIncomeSource, updateIncomeSource, deleteIncomeSource } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [expectedAmount, setExpectedAmount] = useState('');
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [destinationAccountId, setDestinationAccountId] = useState(accounts[0]?.id || '');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setExpectedAmount('');
    setFrequency('monthly');
    setDestinationAccountId(accounts[0]?.id || '');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (inc: IncomeSource) => {
    setEditingId(inc.id);
    setName(inc.name);
    setExpectedAmount(inc.expectedAmount.toString());
    setFrequency(inc.frequency);
    setDestinationAccountId(inc.destinationAccountId || accounts[0]?.id || '');
    setNotes(inc.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expectedAmount);
    if (isNaN(amt) || !name) return;

    if (editingId) {
      updateIncomeSource(editingId, {
        name,
        expectedAmount: amt,
        frequency,
        destinationAccountId: destinationAccountId || undefined,
        notes,
      });
    } else {
      addIncomeSource({
        name,
        expectedAmount: amt,
        frequency,
        destinationAccountId: destinationAccountId || undefined,
        isActive: true,
        notes,
      });
    }

    setIsModalOpen(false);
  };

  const totalMonthlyEquivalent = calculateMonthlyIncomeEquivalent(incomeSources);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Sumber Income &amp; Pemasukan</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola semua sumber pemasukan (Gaji, Internship, Support Mingguan, Side Gig) dan alokasikan ke akun bank/e-wallet.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Tambah Sumber Income</span>
        </button>
      </div>

      {/* Income Summary Metric Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Estimasi Monthly Income</span>
            <p className="text-2xl font-extrabold text-emerald-800">{formatCurrency(totalMonthlyEquivalent)}</p>
          </div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="font-semibold text-slate-700">Catatan Frekuensi:</span> Income mingguan dikonversi otomatis ke estimasi bulanan (× 4.33).
        </div>
      </div>

      {/* Income Sources Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nama Sumber Income</th>
                <th className="px-5 py-3.5">Frekuensi</th>
                <th className="px-5 py-3.5">Akun Tujuan Alokasi</th>
                <th className="px-5 py-3.5 text-right">Nominal Sesuai Frekuensi</th>
                <th className="px-5 py-3.5 text-right">Setara Bulanan</th>
                <th className="px-5 py-3.5 text-center">Aksi (Edit / Hapus)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomeSources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 font-medium">
                    Belum ada sumber income yang ditambahkan. Klik tombol "+ Tambah Sumber Income" di atas.
                  </td>
                </tr>
              ) : (
                incomeSources.map((inc) => {
                  const destAccount = accounts.find((a) => a.id === inc.destinationAccountId)?.name || 'Belum Dialokasikan';
                  const monthlyVal = inc.frequency === 'weekly' ? inc.expectedAmount * 4.33 : inc.expectedAmount;

                  return (
                    <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 text-sm">
                        {inc.name}
                        {inc.notes && <p className="text-[11px] font-normal text-slate-500">{inc.notes}</p>}
                      </td>
                      <td className="px-5 py-3.5 capitalize font-semibold text-slate-600">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                          {inc.frequency}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{destAccount}</td>
                      <td className="px-5 py-3.5 text-right font-extrabold text-slate-900">{formatCurrency(inc.expectedAmount)}</td>
                      <td className="px-5 py-3.5 text-right font-extrabold text-emerald-700">{formatCurrency(monthlyVal)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(inc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                            title="Edit Income"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteIncomeSource(inc.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                            title="Hapus Income"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Income */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingId ? 'Edit Sumber Income' : 'Tambah Sumber Income Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nama Sumber Income</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaji Internship / Uang Saku Ortu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4500000"
                  value={expectedAmount}
                  onChange={(e) => setExpectedAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Frekuensi Transaksi</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option value="monthly">Bulanan (Monthly)</option>
                  <option value="weekly">Mingguan (Weekly)</option>
                  <option value="biweekly">2 Mingguan (Bi-weekly)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Alokasi ke Akun Tujuan</label>
                <select
                  value={destinationAccountId}
                  onChange={(e) => setDestinationAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Catatan Opsional</label>
                <input
                  type="text"
                  placeholder="Catatan tambahan"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 shadow-sm"
                >
                  Simpan Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
