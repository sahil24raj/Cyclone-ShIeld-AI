import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Zap,
  Truck,
  AlertTriangle,
  Phone,
  Droplet,
  Anchor,
  Building2,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertOctagon,
  ShieldAlert
} from 'lucide-react';
import { CriticalAsset, AssetType } from '../../types';
import { ResolvedAssetNode } from './useMatrixCollisionLayout';

interface AssetMarkerItemProps {
  node: ResolvedAssetNode;
  onSelectAsset: (assetId: string) => void;
  onToggleCluster?: (clusterId: string) => void;
  isClusterExpanded?: boolean;
  zoom: number;
}

export const getAssetIcon = (type: AssetType | string, sizeClass = 'w-3.5 h-3.5') => {
  switch (type) {
    case 'hospital':
      return <Activity className={`${sizeClass} text-rose-400`} />;
    case 'power_substation':
      return <Zap className={`${sizeClass} text-amber-400`} />;
    case 'bridge':
      return <Truck className={`${sizeClass} text-blue-400`} />;
    case 'road':
      return <AlertTriangle className={`${sizeClass} text-red-400`} />;
    case 'telecom':
      return <Phone className={`${sizeClass} text-cyan-400`} />;
    case 'water_treatment':
      return <Droplet className={`${sizeClass} text-sky-400`} />;
    case 'port':
      return <Anchor className={`${sizeClass} text-purple-400`} />;
    default:
      return <Building2 className={`${sizeClass} text-slate-400`} />;
  }
};

export const getRiskSeverityClass = (score: number) => {
  if (score >= 80) {
    return {
      dot: 'bg-red-500 shadow-red-500/60',
      badge: 'bg-red-950/90 text-red-300 border-red-600/80',
      border: 'border-red-500/70',
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]',
      text: 'text-red-400',
      label: 'CRITICAL',
    };
  }
  if (score >= 60) {
    return {
      dot: 'bg-orange-500 shadow-orange-500/60',
      badge: 'bg-orange-950/90 text-orange-300 border-orange-600/80',
      border: 'border-orange-500/70',
      glow: 'shadow-[0_0_10px_rgba(249,115,22,0.35)]',
      text: 'text-orange-400',
      label: 'HIGH',
    };
  }
  if (score >= 40) {
    return {
      dot: 'bg-amber-500 shadow-amber-500/60',
      badge: 'bg-amber-950/90 text-amber-300 border-amber-600/80',
      border: 'border-amber-500/70',
      glow: 'shadow-[0_0_8px_rgba(234,179,8,0.3)]',
      text: 'text-amber-400',
      label: 'MEDIUM',
    };
  }
  return {
    dot: 'bg-teal-400 shadow-teal-400/60',
    badge: 'bg-teal-950/90 text-teal-300 border-teal-600/80',
    border: 'border-teal-500/70',
    glow: 'shadow-[0_0_8px_rgba(45,212,191,0.3)]',
    text: 'text-teal-400',
    label: 'LOW',
  };
};

export const AssetMarkerItem: React.FC<AssetMarkerItemProps> = ({
  node,
  onSelectAsset,
  onToggleCluster,
  isClusterExpanded,
  zoom,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  const { asset, rawRisk, rawCrit, displayPoint, truePoint, isSelected, isCluster, clusterMembers } = node;

  const severity = getRiskSeverityClass(rawRisk);
  const shortName = asset.name.replace(/^Sundar\s+/i, '').replace(/^Emergency\s+/i, '');

  // 1. CLUSTER MARKER
  if (isCluster && clusterMembers) {
    return (
      <div
        ref={markerRef}
        style={{
          left: `${displayPoint.x}px`,
          top: `${displayPoint.y}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 25,
        }}
        className="absolute group transition-transform duration-200"
      >
        <button
          onClick={() => node.clusterId && onToggleCluster?.(node.clusterId)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={`Cluster of ${clusterMembers.length} assets`}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-900/95 border-2 ${severity.border} ${severity.glow} shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-400`}
        >
          <div className="flex items-center -space-x-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${severity.dot}`} />
            <Layers className="w-3.5 h-3.5 text-cyan-300 ml-1" />
          </div>
          <span className="text-cyan-200">+{clusterMembers.length}</span>
          <span className="text-[9px] text-slate-300 font-normal uppercase hidden sm:inline">Assets</span>
        </button>

        {/* Hover Popover previewing cluster items */}
        {isHovered && (
          <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full w-56 p-2 bg-navy-950/95 backdrop-blur border border-cyan-500/70 rounded-xl shadow-2xl z-50 text-[10px] font-mono pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-navy-800 text-cyan-300 font-bold">
              <span>Cluster ({clusterMembers.length} Lifelines)</span>
              <span className="text-amber-400">Click to expand</span>
            </div>
            <div className="mt-1.5 space-y-1 max-h-36 overflow-y-auto">
              {clusterMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-1 text-slate-200 truncate">
                  <div className="flex items-center gap-1 truncate">
                    {getAssetIcon(m.type, 'w-3 h-3 flex-shrink-0')}
                    <span className="truncate">{m.name}</span>
                  </div>
                  <span className="text-[9px] text-red-400 font-bold flex-shrink-0">
                    {m.risk_score || 50}R
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. SELECTED ASSET CARD
  if (isSelected) {
    return (
      <div
        ref={markerRef}
        style={{
          left: `${displayPoint.x}px`,
          top: `${displayPoint.y}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 40,
        }}
        className="absolute group select-none animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={() => onSelectAsset(asset.id)}
          aria-label={`Selected asset ${asset.name}`}
          className={`relative flex flex-col p-2 rounded-xl bg-navy-900/95 border-2 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.45)] ring-2 ring-cyan-400/40 text-left min-w-[160px] max-w-[230px] cursor-pointer focus:outline-none`}
        >
          {/* Top Row: Icon + Name + Ping */}
          <div className="flex items-center justify-between gap-1.5 w-full">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <div className={`p-1 rounded-md bg-navy-950 border ${severity.border} flex-shrink-0`}>
                {getAssetIcon(asset.type, 'w-3.5 h-3.5')}
              </div>
              <span className="text-xs font-mono font-bold text-white truncate">{shortName}</span>
            </div>
            {/* Animated Radar Ping */}
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
          </div>

          {/* Bottom Row: Metric chips */}
          <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-navy-800 text-[10px] font-mono">
            <span className="text-slate-300">
              Risk: <b className={severity.text}>{rawRisk}</b>
            </span>
            <span className="text-slate-400">
              Crit: <b className="text-white">{rawCrit}</b>
            </span>
            <span className={`px-1 py-0.2 rounded text-[9px] font-bold border ${severity.badge}`}>
              {severity.label}
            </span>
          </div>
        </button>
      </div>
    );
  }

  // 3. NORMAL ASSET MARKER (COMPACT / EXPANDED BASED ON ZOOM)
  const showDetailedPill = zoom >= 1.35;

  return (
    <div
      ref={markerRef}
      style={{
        left: `${displayPoint.x}px`,
        top: `${displayPoint.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 35 : 20,
      }}
      className="absolute group transition-transform duration-150"
    >
      <button
        onClick={() => onSelectAsset(asset.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label={`${asset.name}: Risk ${rawRisk}, Criticality ${rawCrit}`}
        className={`flex items-center gap-1.5 p-1 rounded-xl transition-all duration-150 border bg-navy-950/90 hover:bg-navy-900 shadow-lg hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${severity.border} ${severity.glow}`}
      >
        {/* Icon & Severity Badge */}
        <div className="relative p-1 rounded-lg bg-navy-900 border border-navy-800 flex items-center justify-center">
          {getAssetIcon(asset.type, 'w-3.5 h-3.5')}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-navy-950 ${severity.dot}`}
          />
        </div>

        {/* Text Pill (shown at high zoom or when plenty of space) */}
        {showDetailedPill && (
          <div className="flex items-center gap-1 pr-1 font-mono text-[10px] text-slate-200">
            <span className="max-w-[85px] truncate font-bold">{shortName}</span>
            <span className={`font-bold ${severity.text}`}>{rawRisk}</span>
          </div>
        )}
      </button>

      {/* Interactive Tooltip Popover on Hover */}
      {isHovered && (
        <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full w-52 p-2.5 bg-navy-950/95 backdrop-blur border border-cyan-400/80 rounded-xl shadow-2xl z-50 text-[11px] font-mono pointer-events-none animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-start justify-between gap-1 pb-1.5 border-b border-navy-800">
            <div>
              <div className="font-bold text-white text-xs leading-snug">{asset.name}</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                {asset.type.replace('_', ' ')} • ID: {asset.id}
              </div>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${severity.badge}`}>
              {severity.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-0.5 text-[10px]">
            <div>
              <span className="text-slate-400 block text-[9px]">Calculated Risk</span>
              <span className={`font-bold text-xs ${severity.text}`}>{rawRisk}/100</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Criticality Weight</span>
              <span className="font-bold text-white text-xs">{rawCrit}/100</span>
            </div>
          </div>

          <div className="mt-2 pt-1 border-t border-navy-800/80 flex items-center justify-between text-[9px] text-cyan-300">
            <span>Status: {(asset as any).status || asset.current_status || 'Operational'}</span>
            <span className="font-bold flex items-center gap-0.5">
              Select <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
