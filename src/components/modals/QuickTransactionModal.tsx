'use client';

import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, ArrowRightLeft, PiggyBank, TrendingUp, Tag, Calendar, Wallet, FileText } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { TransactionType } from '@/types';
import { formatCurrency } from '@/utils/financialCalculations';

interface Props {
  onClose: () => void;
  defaultType?: TransactionType;
}

function formatNumberInput(val: string): string {
  const numeric = val.replace(/\D/g, '');
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseFormattedNumber(val: string): number {
  return parseFloat(val.replace(/\./g, '')) || 0;
}

export const QuickTransactionModal: React.FC<Props> = ({ onClose, defaultType = 'expense' }) => {
  const { accounts, categories, goals, addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [formattedAmount, setFormattedAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [targetAccountId, setTargetAccountId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [goalId, setGoalId] = useState(goals[0]?.id || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFormattedNumber(formattedAmount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addTransaction({
      type,
      amount: numAmount,
      accountId,
      targetAccountId: type === 'transfer' ? targetAccountId : undefined,
      categoryId: type === 'expense' ? categoryId : undefined,
      goalId: (type === 'saving' || type === 'asset_sale') ? goalId : undefined,
      description: description || (type === 'expense' ? 'Pengeluaran' : type === 'income' ? 'Pemasukan' : 'Transaksi'),
      transactionDate: date,
    });

    onClose();
  };

  const TYPE_BUTTONS = [
    { type: 'expense' as TransactionType, label: 'Pengeluaran', icon: ArrowDownRight, activeStyle: 'border-rose-500 bg-rose-50 text-rose-700 font-extrabold shadow-xs' },
    { type: 'income' as TransactionType, label: 'Pemasukan', icon: ArrowUpRight, activeStyle: 'border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold shadow-xs' },
    { type: 'transfer' as TransactionType, label: 'Transfer', icon: ArrowRightLeft, activeStyle: 'border-blue-500 bg-blue-50 text-blue-800 font-extrabold shadow-xs' },
    { type: 'saving' as TransactionType, label: 'Tabungan', icon: PiggyBank, activeStyle: 'border-amber-500 bg-amber-50 text-amber-800 font-extrabold shadow-xs' },
    { type: 'investment' as TransactionType, label: 'Investasi', icon: TrendingUp, activeStyle: 'border-cyan-500 bg-cyan-50 text-cyan-800 font-extrabold shadow-xs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-800 animate-slideUp">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${
              type === 'income' ? 'bg-emerald-100 text-emerald-700' :
              type === 'expense' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {type === 'income' ? <ArrowUpRight className="w-5 h-5" /> :
               type === 'expense' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowRightLeft className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-none">Catat Transaksi Baru</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pilih tipe &amp; masukkan nominalnya</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Type Selector Pills */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">
              Tipe Transaksi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_BUTTONS.map((btn) => {
                const Icon = btn.icon;
                const isSelected = type === btn.type;
                return (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => setType(btn.type)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all active:scale-95 ${
                      isSelected
                        ? btn.activeStyle
                        : 'border-slate-200/80 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nominal Input with Dot Formatting */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
              Nominal Transaksi (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400 font-extrabold text-lg">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="100.000"
                value={formattedAmount}
                onChange={(e) => setFormattedAmount(formatNumberInput(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 font-black text-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
              />
            </div>
          </div>

          {/* Account & Category/Target Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                <span>{type === 'transfer' ? 'Dari Akun Asal' : 'Dompet / Rekening'}</span>
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({formatCurrency(acc.balance)})
                  </option>
                ))}
              </select>
            </div>

            {type === 'transfer' ? (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-blue-500" />
                  <span>Ke Akun Tujuan</span>
                </label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (type === 'saving' || type === 'asset_sale') ? (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Target Tabungan</label>
                <select
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : type === 'expense' ? (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Kategori Kebutuhan</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {/* Description & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Keterangan / Catatan</span>
              </label>
              <input
                type="text"
                placeholder="misal: Makan Siang, Bensin, Gaji"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Tanggal</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all active:scale-98 ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
              }`}
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
