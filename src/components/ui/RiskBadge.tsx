import React from 'react';
import { RiskLevel, PriorityLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  size = 'md',
  showIcon = true,
}) => {
  const configs: Record<
    RiskLevel,
    { label: string; bg: string; text: string; border: string; icon: string }
  > = {
    low: {
      label: 'LOW',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      icon: '●',
    },
    moderate: {
      label: 'MODERATE',
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      icon: '■',
    },
    high: {
      label: 'HIGH',
      bg: 'bg-orange-500/15',
      text: 'text-orange-400',
      border: 'border-orange-500/40',
      icon: '◆',
    },
    critical: {
      label: 'CRITICAL',
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/50',
      icon: '▲',
    },
  };

  const config = configs[level] || configs.moderate;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
    lg: 'text-sm px-2.5 py-1 gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase rounded border tracking-wide select-none ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {showIcon && <span className="text-[9px] leading-none" aria-hidden="true">{config.icon}</span>}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-90 font-mono">
          {score}/100
        </span>
      )}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const map: Record<PriorityLevel, { bg: string; text: string; border: string; desc: string }> = {
    P0: { bg: 'bg-red-500/25', text: 'text-red-300', border: 'border-red-500/60', desc: 'Immediate Mandatory' },
    P1: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/50', desc: 'Pre-Landfall Priority' },
    P2: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40', desc: 'Standby / Stage 2' },
    P3: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', desc: 'Shelter in Place' },
  };

  const c = map[priority] || map.P2;
  const padding = size === 'sm' ? 'px-1.5 py-0.2 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center font-mono font-extrabold uppercase rounded border ${padding} ${c.bg} ${c.text} ${c.border}`}
      title={c.desc}
    >
      {priority}
    </span>
  );
};
