'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { exportTransactionsToCSV } from '@/utils/exportUtils';
import { Download, RefreshCw, ShieldCheck, FileSpreadsheet, Code, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { transactions, accounts, categories, goals, resetToSeedData, clearAllData, exportDataJSON } = useFinance();

  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions, accounts, categories, goals);
  };

  const handleExportJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings &amp; Data Backup</h1>
        <p className="text-xs text-slate-500 mt-1">
          Export data keuangan ke CSV / JSON, atau kelola ulang seluruh dataset Anda.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Download className="w-5 h-5 text-emerald-700" />
          <h2 className="font-bold text-base text-slate-900">Export &amp; Backup Data Finansial</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Riwayat Transaksi (CSV)</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Download file CSV yang kompatibel dengan Excel dan Google Sheets.
            </p>
            <button
              onClick={handleExportCSV}
              className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              Download CSV
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
              <Code className="w-4 h-4" />
              <span>Backup Seluruh Database (JSON)</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Export snapshot lengkap seluruh akun, budget, goals, dan transaksi dalam format JSON.
            </p>
            <button
              onClick={handleExportJSON}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              Download Full JSON Backup
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <RefreshCw className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-base text-slate-900">Kelola Uang Data (Reset &amp; Start Fresh)</h2>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Anda memiliki kontrol 100% penuh atas data. Anda dapat memilih untuk mengosongkan semua data dan mulai dari awal (0), atau mengembalikan ke contoh seed demo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={clearAllData}
            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Mulai dari Kosong (Clear All Data)</span>
          </button>

          <button
            onClick={resetToSeedData}
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset ke Seed Data Demo</span>
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Vercel &amp; Supabase Integration Status</span>
        </div>
        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
          Sistem dirancang untuk Vercel Serverless + Supabase Auth &amp; PostgreSQL. Pada tahap frontend ini, state disimpan di browser LocalStorage. Saat dihubungkan ke Supabase, RLS (Row Level Security) memproteksi data per user ID.
        </p>
      </div>
    </div>
  );
}
