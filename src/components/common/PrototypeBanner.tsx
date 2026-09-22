import React, { useState } from 'react';
import { AlertTriangle, Info, X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PrototypeBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useLanguage();

  if (isDismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs font-mono flex items-center justify-between z-40 relative backdrop-blur-sm">
      <div className="flex items-center gap-2 max-w-5xl overflow-hidden">
        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
        <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 border border-amber-500/40">
          PROTOTYPE SIMULATION
        </span>
        <p className="truncate text-slate-200">
          <strong className="text-amber-300">Notice:</strong> {t('disclaimer')}{' '}
          <span className="text-slate-400 hidden md:inline">
            Values, storm tracks, and vulnerability scores are synthetic demonstration estimates for coastal APAC hackathon evaluation.
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 pl-2">
        <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
          <Info className="w-3 h-3" />
          Explainable Risk Engine v2.4
        </span>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-400/70 hover:text-amber-200 p-0.5 transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
