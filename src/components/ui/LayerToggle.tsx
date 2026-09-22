import React from 'react';

interface LayerToggleProps {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
  colorDot?: string;
  badge?: string;
}

export const LayerToggle: React.FC<LayerToggleProps> = ({
  label,
  sublabel,
  checked,
  onChange,
  icon,
  colorDot,
  badge,
}) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-sans text-left transition-all border ${
        checked
          ? 'bg-navy-850 text-white border-cyan-500/40 shadow-sm'
          : 'bg-navy-950/60 text-slate-400 hover:text-slate-200 border-navy-800/80 hover:bg-navy-900'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 truncate">
        {colorDot ? (
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: colorDot }}
            aria-hidden="true"
          />
        ) : icon ? (
          <span className={`flex-shrink-0 ${checked ? 'text-cyan-400' : 'text-slate-500'}`}>
            {icon}
          </span>
        ) : null}

        <div className="truncate">
          <div className="font-semibold truncate text-[11px] leading-tight">
            {label}
          </div>
          {sublabel && (
            <div className="text-[9px] font-mono text-slate-500 truncate">
              {sublabel}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
        {badge && (
          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-navy-900 border border-navy-750 text-slate-400">
            {badge}
          </span>
        )}
        <span
          className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] font-mono font-bold transition-colors ${
            checked
              ? 'bg-cyan-500 text-navy-950 border-cyan-400'
              : 'border-slate-600 bg-navy-900 text-transparent'
          }`}
        >
          ✓
        </span>
      </div>
    </button>
  );
};
