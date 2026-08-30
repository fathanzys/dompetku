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
} from 'lucide-react';
import { Account, AccountType } from '@/types';

export default function AccountsPage() {
  const { accounts, addAccount, updateAccount, deleteAccount, addTransaction } = useFinance();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [editingAccId, setEditingAccId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [institution, setInstitution] = useState('');
  const [balance, setBalance] = useState('');

  // Transfer State
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
    setBalance(acc.balance.toString());
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(balance);
    if (isNaN(bal) || !name) return;

    if (editingAccId) {
      updateAccount(editingAccId, {
        name,
        type,
        institution: institution || name,
        balance: bal,
      });
    } else {
      addAccount({
        name,
        type,
        institution: institution || name,
        balance: bal,
        currency: 'IDR',
        isActive: true,
      });
    }
    setIsModalOpen(false);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
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
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-16">
      {/* Header Admin Panel Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Kelola Dompet &amp; Rekening (Admin CRUD)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tambah rekening baru, ubah saldo fisik saat ini, transfer dana, atau hapus akun.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-600" />
            <span>Transfer Dana</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Tambah Dompet</span>
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Saldo Tergabung</span>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="p-3 rounded-2xl bg-slate-800 text-emerald-400">
          <Wallet className="w-6 h-6" />
        </div>
      </div>

      {/* Admin Table of Accounts */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-900 text-sm">Daftar Dompet &amp; Saldo Akun</h3>
          <span className="text-xs text-slate-500 font-medium">Total: {accounts.length} Akun</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Nama Rekening / Dompet</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-right">Saldo Saat Ini</th>
                <th className="px-4 py-3 text-center">Aksi Edit / Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-extrabold text-slate-900 text-sm">{acc.name}</p>
                    <span className="text-[10px] text-slate-400">{acc.institution || 'Fisik'}</span>
                  </td>
                  <td className="px-4 py-3.5 capitalize text-slate-600 font-semibold">{acc.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3.5 text-right font-black text-slate-900 text-sm">
                    {formatCurrency(acc.balance)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(acc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Edit Saldo / Nama"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAccount(acc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingAccId ? 'Edit Saldo / Nama Dompet' : 'Tambah Dompet / Rekening Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nama Rekening / Dompet</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank BCA Utama / GoPay"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Tipe Akun</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                >
                  <option value="bank">Bank (BCA, Mandiri, BNI)</option>
                  <option value="ewallet">E-Wallet (GoPay, OVO, ShopeePay)</option>
                  <option value="cash">Tunai / Dompet Fisik</option>
                  <option value="investment">Investasi (Stockbit, Bibit)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Saldo Saat Ini (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 3500000"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
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
                  Simpan Dompet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Transfer Funds */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Transfer Uang Antar Dompet</h3>
              <button onClick={() => setIsTransferOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Dari Akun Asal</label>
                <select
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Ke Akun Tujuan</label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Nominal Transfer (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs"
                >
                  Proses Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
