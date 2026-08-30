'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login for frontend demo (ready to hook to supabase.auth.signInWithPassword)
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-slideUp">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl space-y-6 text-slate-800">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl mx-auto shadow-md shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 fill-current text-white" />
          </div>
          <h1 className="font-extrabold text-2xl text-slate-900">
            {isRegister ? 'Buat Akun Baru' : 'Masuk Ke DompetKu'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Personal Finance Operating System (Single-User Auth)
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>{loading ? 'Memproses...' : isRegister ? 'Daftar Akun Baru' : 'Masuk Ke Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>{isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} </span>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-emerald-700 font-bold hover:underline"
          >
            {isRegister ? 'Masuk di sini' : 'Daftar sekarang'}
          </button>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-bold bg-emerald-50 py-2 rounded-xl border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Terproteksi Supabase Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
}
