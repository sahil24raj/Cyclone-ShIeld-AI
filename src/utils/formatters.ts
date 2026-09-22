import { RiskLevel, PriorityLevel } from '../types';

export function formatIndianNumber(num: number): string {
  if (num >= 100000) {
    const lakhs = (num / 100000).toFixed(2);
    return `${lakhs} Lakh`;
  }
  return num.toLocaleString('en-IN');
}

export function getRiskBadgeClasses(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  ring: string;
} {
  switch (level) {
    case 'critical':
      return {
        bg: 'bg-red-500/15',
        text: 'text-red-400',
        border: 'border-red-500/30',
        ring: 'ring-red-500/40',
      };
    case 'high':
      return {
        bg: 'bg-orange-500/15',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        ring: 'ring-orange-500/40',
      };
    case 'moderate':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        ring: 'ring-amber-500/40',
      };
    case 'low':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        ring: 'ring-emerald-500/40',
      };
  }
}

export function getPriorityBadgeClasses(priority: PriorityLevel): {
  bg: string;
  text: string;
  label: string;
} {
  switch (priority) {
    case 'P0':
      return {
        bg: 'bg-red-600 text-white font-bold',
        text: 'text-white',
        label: 'P0: Immediate Evacuation',
      };
    case 'P1':
      return {
        bg: 'bg-orange-600 text-white font-semibold',
        text: 'text-white',
        label: 'P1: Evacuate < 6h',
      };
    case 'P2':
      return {
        bg: 'bg-amber-600 text-white font-medium',
        text: 'text-white',
        label: 'P2: Prepare & Monitor',
      };
    case 'P3':
      return {
        bg: 'bg-emerald-700 text-white',
        text: 'text-white',
        label: 'P3: Shelter in Place',
      };
  }
}
