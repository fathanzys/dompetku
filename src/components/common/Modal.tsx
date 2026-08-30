'use client';

import React, { useEffect } from 'react';
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
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Backdrop — scrollable wrapper, not a flex centering container
    <div
      className="fixed inset-0 z-[200] overflow-y-auto bg-slate-950/60 backdrop-blur-sm animate-fadeInOverlay"
      onClick={onClose}
    >
      {/*
        Inner wrapper uses flex + min-h-full so the dialog is truly
        centred even when the sheet is taller than the viewport.
        padding keeps content away from screen edges.
      */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        {/* Modal Dialog Card — stop click propagation so backdrop click doesn't bubble */}
        <div
          className={`relative w-full ${maxWidthClass} bg-white rounded-3xl shadow-2xl border border-slate-200/80 text-slate-800 animate-modalPop flex flex-col max-h-[88vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/90">
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
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
