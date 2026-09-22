import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    text: string;
    direction?: 'up' | 'down' | 'neutral';
    isWarning?: boolean;
  };
  metadata?: {
    source?: string;
    timestamp?: string;
  };
  statusColor?: 'cyan' | 'red' | 'orange' | 'amber' | 'emerald' | 'purple';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  trend,
  metadata,
  statusColor = 'cyan',
  icon,
}) => {
  const accentBorders = {
    cyan: 'border-cyan-500/30 hover:border-cyan-500/50',
    red: 'border-red-500/40 hover:border-red-500/60',
    orange: 'border-orange-500/40 hover:border-orange-500/60',
    amber: 'border-amber-500/30 hover:border-amber-500/50',
    emerald: 'border-emerald-500/30 hover:border-emerald-500/50',
    purple: 'border-purple-500/30 hover:border-purple-500/50',
  };

  const accentText = {
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    orange: 'text-orange-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
  };

  return (
    <div
      className={`bg-navy-900/95 border rounded-xl p-3.5 shadow-md flex flex-col justify-between transition-all group ${accentBorders[statusColor]}`}
    >
      {/* Top row: Label + Icon */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold truncate">
          {label}
        </span>
        {icon && (
          <span className={`p-1 rounded bg-navy-950 border border-navy-800 flex-shrink-0 ${accentText[statusColor]}`}>
            {icon}
          </span>
        )}
      </div>

      {/* Center value + unit */}
      <div className="flex items-baseline gap-1.5 my-0.5">
        <span className="text-2xl font-black text-white font-mono tracking-tight group-hover:text-cyan-200 transition-colors">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom metadata row: Trend + Provenance */}
      <div className="pt-2 mt-1 border-t border-navy-800/80 flex items-center justify-between text-[10px] font-mono">
        {trend ? (
          <span
            className={`font-semibold ${
              trend.isWarning
                ? 'text-red-400'
                : trend.direction === 'up'
                ? 'text-orange-400'
                : trend.direction === 'down'
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {trend.text}
          </span>
        ) : (
          <span className="text-slate-500">Nominal telemetry</span>
        )}

        {metadata && (
          <span className="text-slate-400 font-mono text-[9px] truncate max-w-[120px]" title={`${metadata.source || ''} • ${metadata.timestamp || ''}`}>
            {metadata.source && <b className="text-slate-300">{metadata.source}</b>}
            {metadata.timestamp && ` • ${metadata.timestamp}`}
          </span>
        )}
      </div>
    </div>
  );
};
