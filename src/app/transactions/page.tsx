'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import { QuickTransactionModal } from '@/components/modals/QuickTransactionModal';
import { Plus, Trash2, ArrowDownRight, ArrowUpRight, ArrowRightLeft, PiggyBank, TrendingUp, Tag, Search } from 'lucide-react';
import { TransactionType } from '@/types';

export default function TransactionsPage() {
  const { transactions, accounts, categories, goals, deleteTransaction } = useFinance();
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      (t.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.notes || '').toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getBadgeStyle = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'expense':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'transfer':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'saving':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'investment':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'asset_sale':
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return ArrowUpRight;
      case 'expense':
        return ArrowDownRight;
      case 'transfer':
        return ArrowRightLeft;
      case 'saving':
        return PiggyBank;
      case 'investment':
        return TrendingUp;
      case 'asset_sale':
        return Tag;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Transaksi Finansial</h1>
          <p className="text-xs text-slate-500 mt-1">
            Catat semua pemasukan, pengeluaran, transfer, alokasi dana, dan penjualan aset.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Catat Transaksi Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari deskripsi transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'income', 'expense', 'transfer', 'saving', 'investment', 'asset_sale'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                filterType === t
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Tanggal &amp; Deskripsi</th>
                <th className="px-5 py-3.5">Tipe</th>
                <th className="px-5 py-3.5">Sumber &amp; Alokasi</th>
                <th className="px-5 py-3.5 text-right">Nominal</th>
                <th className="px-5 py-3.5 text-center">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400 font-medium">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const Icon = getTypeIcon(tx.type);
                  const sourceAcc = accounts.find((a) => a.id === tx.accountId)?.name || tx.accountId;
                  const targetAcc = tx.targetAccountId ? accounts.find((a) => a.id === tx.targetAccountId)?.name : null;
                  const goalName = tx.goalId ? goals.find((g) => g.id === tx.goalId)?.name : null;
                  const categoryName = tx.categoryId ? categories.find((c) => c.id === tx.categoryId)?.name : null;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900 text-sm">{tx.description}</p>
                        <span className="text-slate-400 text-[11px] font-medium">{tx.transactionDate}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold capitalize ${getBadgeStyle(tx.type)}`}>
                          <Icon className="w-3 h-3" />
                          <span>{tx.type.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        <p className="font-bold text-slate-900">{sourceAcc}</p>
                        <p className="text-slate-500 text-[11px] font-medium">
                          {targetAcc ? `→ ${targetAcc}` : goalName ? `→ ${goalName}` : categoryName || '-'}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-right font-extrabold text-sm text-slate-900">
                        {tx.type === 'expense' ? (
                          <span className="text-rose-600">-{formatCurrency(tx.amount)}</span>
                        ) : tx.type === 'income' || tx.type === 'asset_sale' ? (
                          <span className="text-emerald-700">+{formatCurrency(tx.amount)}</span>
                        ) : (
                          <span>{formatCurrency(tx.amount)}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <QuickTransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
