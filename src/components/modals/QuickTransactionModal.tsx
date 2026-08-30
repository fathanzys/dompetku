'use client';

import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, ArrowRightLeft, PiggyBank, TrendingUp, Tag } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { TransactionType } from '@/types';

interface Props {
  onClose: () => void;
  defaultType?: TransactionType;
}

export const QuickTransactionModal: React.FC<Props> = ({ onClose, defaultType = 'expense' }) => {
  const { accounts, categories, goals, addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [targetAccountId, setTargetAccountId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [goalId, setGoalId] = useState(goals[0]?.id || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addTransaction({
      type,
      amount: numAmount,
      accountId,
      targetAccountId: type === 'transfer' ? targetAccountId : undefined,
      categoryId: type === 'expense' ? categoryId : undefined,
      goalId: (type === 'saving' || type === 'asset_sale') ? goalId : undefined,
      description: description || `${type.toUpperCase()} entry`,
      transactionDate: date,
    });

    onClose();
  };

  const TYPE_BUTTONS = [
    { type: 'expense' as TransactionType, label: 'Expense', icon: ArrowDownRight, activeStyle: 'border-rose-600 bg-rose-50 text-rose-700 font-bold' },
    { type: 'income' as TransactionType, label: 'Income', icon: ArrowUpRight, activeStyle: 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' },
    { type: 'transfer' as TransactionType, label: 'Transfer', icon: ArrowRightLeft, activeStyle: 'border-blue-600 bg-blue-50 text-blue-800 font-bold' },
    { type: 'saving' as TransactionType, label: 'Goal Save', icon: PiggyBank, activeStyle: 'border-amber-600 bg-amber-50 text-amber-800 font-bold' },
    { type: 'investment' as TransactionType, label: 'Investment', icon: TrendingUp, activeStyle: 'border-cyan-600 bg-cyan-50 text-cyan-800 font-bold' },
    { type: 'asset_sale' as TransactionType, label: 'Asset Sale', icon: Tag, activeStyle: 'border-purple-600 bg-purple-50 text-purple-800 font-bold' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-extrabold text-base text-slate-900">Catat Transaksi Finansial</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selector Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Tipe Transaksi</label>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_BUTTONS.map((btn) => {
                const Icon = btn.icon;
                const isSelected = type === btn.type;
                return (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => setType(btn.type)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? btn.activeStyle
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nominal Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Nominal Transaksi (Rp)</label>
            <input
              type="number"
              required
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-extrabold text-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Account & Target/Category Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {type === 'transfer' ? 'Dari Akun' : 'Akun Sumber'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (Rp {acc.balance.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            {type === 'transfer' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ke Akun Tujuan</label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (type === 'saving' || type === 'asset_sale') ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Goal Fund Tujuan</label>
                <select
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Expense</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi / Keterangan</label>
              <input
                type="text"
                placeholder="misal: Makan Siang"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Transaksi</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 shadow-sm transition-all"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
