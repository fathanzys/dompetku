'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-xl text-slate-800 animate-slideUp text-xs font-bold">
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
