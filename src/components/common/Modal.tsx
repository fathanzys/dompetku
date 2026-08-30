'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidthClass = 'max-w-md',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
    return () => {
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const content = (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
      className="animate-fadeInOverlay"
    >
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.65)' }}
        className="backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Scroll + centering wrapper */}
      <div
        style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          {/* Modal card */}
          <div
            style={{ position: 'relative', width: '100%', maxHeight: '88vh' }}
            className={`${maxWidthClass} bg-white rounded-3xl shadow-2xl border border-slate-200 text-slate-800 animate-modalPop flex flex-col overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
                    {icon}
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="shrink overflow-y-auto p-5 sm:p-6 space-y-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
