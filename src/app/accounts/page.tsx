'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/financialCalculations';
import {
  Wallet,
  Plus,
  Edit3,
  Trash2,
  ArrowRightLeft,
  X,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { Account, AccountType } from '@/types';

function formatNumberInput(val: string): string {
  const numeric = val.replace(/\D/g, '');
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseFormattedNumber(val: string): number {
  return parseFloat(val.replace(/\./g, '')) || 0;
}

const TYPE_LABELS: Record<string, string> = {
  bank: 'Bank',
  e_wallet: 'E-Wallet',
  ewallet: 'E-Wallet',
  cash: 'Tunai',
  investment: 'Investasi',
  credit_card: 'Kartu Kredit',
  other: 'Lainnya',
};

export default function AccountsPage() {
  const { accounts, addAccount, updateAccount, deleteAccount, addTransaction } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [editingAccId, setEditingAccId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [institution, setInstitution] = useState('');
  const [balance, setBalance] = useState('');

  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');

  const openAddModal = () => {
    setEditingAccId(null);
    setName('');
    setType('bank');
    setInstitution('');
    setBalance('');
    setIsModalOpen(true);
  };

  const openEditModal = (acc: Account) => {
    setEditingAccId(acc.id);
    setName(acc.name);
    setType(acc.type);
    setInstitution(acc.institution || '');
    setBalance(formatNumberInput(acc.balance.toString()));
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFormattedNumber(balance);
    if (isNaN(bal) || !name) return;

    if (editingAccId) {
      updateAccount(editingAccId, { name, type, institution: institution || name, balance: bal });
    } else {
      addAccount({ name, type, institution: institution || name, balance: bal, currency: 'IDR', isActive: true });
    }
    setIsModalOpen(false);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFormattedNumber(transferAmount);
    if (isNaN(amt) || amt <= 0 || fromAccountId === toAccountId) return;

    addTransaction({
      transactionDate: new Date().toISOString().split('T')[0],
      type: 'transfer',
      amount: amt,
      accountId: fromAccountId,
      targetAccountId: toAccountId,
      description: 'Transfer antar dompet',
    });

    setIsTransferOpen(false);
    setTransferAmount('');
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6 animate-slideUp max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h1 className="text-lg font-extrabold text-slate-900">Dompet &amp; Rekening Saya</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Kelola semua rekening bank, e-wallet, dan dompet fisik Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-600" />
            <span>Transfer</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Tambah</span>
          </button>
        </div>
      </div>

      {/* Total Balance Hero */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Seluruh Saldo</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(totalBalance)}</p>
          <span className="text-[11px] text-slate-500">{accounts.length} akun tergabung</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
          <Wallet className="w-7 h-7 text-emerald-400" />
        </div>
      </div>

      {/* Accounts List — Card style (mobile-friendly, no cramped table) */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-700 px-1">Daftar Akun ({accounts.length})</h3>

        {accounts.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-white border border-slate-200/80">
            <div className="text-3xl mb-2">💳</div>
            <p className="text-xs text-slate-400 font-medium">Belum ada akun. Tambahkan dompet pertama Anda!</p>
          </div>
        )}

        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all gap-3"
          >
            {/* Icon + Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-slate-900 text-sm truncate">{acc.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase">
                    {TYPE_LABELS[acc.type] || acc.type}
                  </span>
                  {acc.institution && (
                    <span className="text-[10px] text-slate-400">{acc.institution}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Balance + Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <p className="font-extrabold text-slate-900 text-sm">{formatCurrency(acc.balance)}</p>
                <p className="text-[10px] text-slate-400">saldo saat ini</p>
              </div>
              <div className="flex flex-col gap-1 ml-1">
                <button
                  onClick={() => openEditModal(acc)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(acc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingAccId ? '✏️ Edit Dompet / Rekening' : '💳 Tambah Dompet Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Nama Rekening / Dompet</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCA Utama, GoPay, Dompet Harian"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Tipe Akun</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="bank">🏦 Bank (BCA, Mandiri, BNI, BSI)</option>
                  <option value="e_wallet">📱 E-Wallet (GoPay, OVO, ShopeePay)</option>
                  <option value="cash">💵 Tunai / Dompet Fisik</option>
                  <option value="investment">📈 Investasi (Bibit, Stockbit)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Saldo Saat Ini (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-bold text-sm">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="3.500.000"
                    value={balance}
                    onChange={(e) => setBalance(formatNumberInput(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Transfer */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">↔️ Transfer Antar Dompet</h3>
              <button onClick={() => setIsTransferOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Dari Akun Asal</label>
                <select
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} — {formatCurrency(a.balance)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Ke Akun Tujuan</label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} — {formatCurrency(a.balance)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-bold">Nominal Transfer (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-bold text-sm">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="500.000"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(formatNumberInput(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 font-bold text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsTransferOpen(false)} className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700">
                  Proses Transfer
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
              <div className="p-3 rounded-2xl bg-rose-50 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Hapus Akun Ini?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Akun <strong>"{accounts.find(a => a.id === deleteConfirmId)?.name}"</strong> akan dihapus permanen beserta riwayat transaksinya.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm">
                Batal
              </button>
              <button
                onClick={() => { deleteAccount(deleteConfirmId); setDeleteConfirmId(null); }}
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
