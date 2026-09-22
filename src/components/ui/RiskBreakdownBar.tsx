import React from 'react';

interface RiskBreakdownBarProps {
  label: string;
  score: number; // 0-100
  thresholdWarning?: number;
  unit?: string;
  subtext?: string;
}

export const RiskBreakdownBar: React.FC<RiskBreakdownBarProps> = ({
  label,
  score,
  thresholdWarning = 70,
  unit = '/ 100',
  subtext,
}) => {
  const clamped = Math.max(0, Math.min(100, score));

  // Determine bar color based on score threshold
  const getBarColor = (val: number) => {
    if (val >= 80) return 'bg-red-500';
    if (val >= 60) return 'bg-orange-500';
    if (val >= 35) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTextColor = (val: number) => {
    if (val >= 80) return 'text-red-400';
    if (val >= 60) return 'text-orange-400';
    if (val >= 35) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="space-y-1 text-xs">
      <div className="flex items-center justify-between font-mono">
        <span className="text-slate-300 font-sans font-medium text-[11px] truncate">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <span className={`font-bold font-mono ${getTextColor(clamped)}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-500">{unit}</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-navy-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(clamped)}`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      {subtext && (
        <div className="text-[10px] text-slate-400 font-mono">
          {subtext}
        </div>
      )}
    </div>
  );
};
