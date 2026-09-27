import React, { useState } from 'react';
import {
  Building2,
  Zap,
  Activity,
  Phone,
  Droplet,
  Truck,
  Anchor,
  AlertTriangle,
  MapPin,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  ChevronRight,
  Filter,
  Layers,
  LayoutGrid,
  Sparkles,
  Info
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { CriticalAsset, AssetType } from '../../types';
import { formatIndianNumber } from '../../utils/formatters';

export const InfrastructureView: React.FC = () => {
  const { simulationSummary, setSelectedAsset, setActiveTab } = useAppState();
  const assets = simulationSummary.assets;

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || 'infra-power-1');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [activeQueueTab, setActiveQueueTab] = useState<'immediate' | 'next6h' | 'monitor'>('immediate');
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const getAssetIcon = (type: AssetType | string, sizeClass = "w-3.5 h-3.5") => {
    switch (type) {
      case 'hospital': return <Activity className={`${sizeClass} text-rose-400`} />;
      case 'power_substation': return <Zap className={`${sizeClass} text-amber-400`} />;
      case 'bridge': return <Truck className={`${sizeClass} text-blue-400`} />;
      case 'road': return <AlertTriangle className={`${sizeClass} text-red-400`} />;
      case 'telecom': return <Phone className={`${sizeClass} text-cyan-400`} />;
      case 'water_treatment': return <Droplet className={`${sizeClass} text-sky-400`} />;
      case 'port': return <Anchor className={`${sizeClass} text-purple-400`} />;
      default: return <Building2 className={`${sizeClass} text-slate-400`} />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-500 text-white border-red-400 shadow-red-500/40';
    if (score >= 60) return 'bg-orange-500 text-white border-orange-400 shadow-orange-500/40';
    if (score >= 40) return 'bg-amber-500 text-navy-950 border-amber-300 shadow-amber-500/40';
    return 'bg-teal-500 text-navy-950 border-teal-300 shadow-teal-500/40';
  };

  const getCriticalityScore = (asset: any): number => {
    if (asset.criticalityScore !== undefined) return asset.criticalityScore;
    if (asset.criticality === 'critical') return 95;
    if (asset.criticality === 'high') return 75;
    if (asset.criticality === 'moderate') return 55;
    return 40;
  };

  const getRiskScore = (asset: any): number => {
    return asset.calculatedRiskScore || asset.risk_score || asset.baseFloodRisk || 50;
  };

  // Filtered Assets for display
  const filteredAssets = assets.filter((a) => {
    if (selectedTypeFilter === 'all') return true;
    return a.type === selectedTypeFilter;
  });

  // Action Queue buckets
  const immediateActions = assets.filter((a) => getRiskScore(a) >= 75 || getCriticalityScore(a) >= 90);
  const next6hActions = assets.filter((a) => getRiskScore(a) >= 50 && getRiskScore(a) < 75 && getCriticalityScore(a) < 90);
  const monitorActions = assets.filter((a) => getRiskScore(a) < 50);

  const displayQueue =
    activeQueueTab === 'immediate'
      ? immediateActions
      : activeQueueTab === 'next6h'
      ? next6hActions
      : monitorActions;

  // Type Filter Tabs
  const TYPE_TABS = [
    { id: 'all', label: 'All Lifelines', count: assets.length },
    { id: 'hospital', label: 'Hospitals', count: assets.filter(a => a.type === 'hospital').length },
    { id: 'power_substation', label: 'Power Grid', count: assets.filter(a => a.type === 'power_substation').length },
    { id: 'bridge', label: 'Bridges', count: assets.filter(a => a.type === 'bridge').length },
    { id: 'telecom', label: 'Telecom', count: assets.filter(a => a.type === 'telecom').length },
    { id: 'water_treatment', label: 'Water Plants', count: assets.filter(a => a.type === 'water_treatment').length },
    { id: 'port', label: 'Marine Ports', count: assets.filter(a => a.type === 'port').length },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1700px] mx-auto font-sans select-none text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              Critical Infrastructure Resilience Matrix
            </span>
            <span className="bg-navy-950 border border-navy-750 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
              Operational Defense Grid
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Lifeline Criticality vs Hazard Impact Matrix
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Identify single-point failure risks across power, healthcare, bridges, and telecom before landfall occurs.
          </p>
        </div>

        {/* Telemetry Summary */}
        <div className="flex items-center gap-3 bg-navy-950 border border-navy-800 p-2.5 rounded-xl font-mono text-xs">
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400">Total Monitored</div>
            <div className="font-bold text-white text-base">{assets.length}</div>
          </div>
          <span className="h-6 w-px bg-navy-800" />
          <div className="text-center px-2">
            <div className="text-[10px] text-red-400">P0 Urgent Defense</div>
            <div className="font-bold text-red-400 text-base">{immediateActions.length}</div>
          </div>
          <span className="h-6 w-px bg-navy-800" />
          <div className="text-center px-2">
            <div className="text-[10px] text-teal-300">Backup Ready</div>
            <div className="font-bold text-teal-300 text-base">
              {assets.filter((a) => a.backupPowerAvailable || a.backup_power_ready).length}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Toolbar & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-900 border border-navy-750 p-2.5 rounded-2xl shadow-lg">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
          {TYPE_TABS.map((tab) => {
            const isSelected = selectedTypeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition border flex-shrink-0 ${
                  isSelected
                    ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                    : 'bg-navy-950 hover:bg-navy-850 text-slate-400 hover:text-slate-200 border-navy-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-navy-900 border border-navy-750 text-slate-400">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-navy-800 font-mono text-xs self-end sm:self-auto">
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              viewMode === 'matrix' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Matrix</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              viewMode === 'list' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Inventory Grid</span>
          </button>
        </div>
      </div>

      {/* TOP SECTION: Matrix + Asset Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: 2D Matrix Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-1 border-b border-navy-800">
            <div>
              <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Tactical Decision Quadrant Matrix</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Click any asset point to load emergency directives, response crew deadlines, and failure impacts.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-navy-950 px-2 py-1 rounded border border-navy-800">
              X: Calculated Risk (0-100) • Y: Criticality (0-100)
            </span>
          </div>

          {viewMode === 'matrix' ? (
            /* PROFESSIONAL 2D QUADRANT GRAPH */
            <div className="relative bg-navy-950 rounded-2xl p-6 border border-navy-800 h-[420px] select-none flex flex-col justify-between overflow-hidden shadow-inner">
              
              {/* 4 QUADRANT BACKGROUND ZONES */}
              <div className="absolute inset-x-12 inset-y-8 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden border border-navy-800/80">
                
                {/* Quadrant II: Top Left (Amber - Vital Lifeline Standby) */}
                <div className="bg-amber-950/15 border-r border-b border-navy-800/80 p-3 relative flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-amber-400/90 font-bold bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded self-start">
                    QUADRANT II: VITAL LIFELINE STANDBY
                  </div>
                  <span className="text-[9px] font-mono text-amber-300/40">High Criticality • Moderate/Low Risk</span>
                </div>

                {/* Quadrant I: Top Right (Red - Critical P0 Urgent Action) */}
                <div className="bg-red-950/25 border-b border-navy-800/80 p-3 relative flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-red-300 font-bold bg-red-950/80 border border-red-700/80 px-2 py-0.5 rounded self-end animate-pulse">
                    QUADRANT I: CRITICAL P0 URGENT ACTION
                  </div>
                  <span className="text-[9px] font-mono text-red-300/50 text-right">High Criticality • Critical Risk &gt; 70</span>
                </div>

                {/* Quadrant IV: Bottom Left (Teal/Navy - Routine Standby) */}
                <div className="bg-navy-900/30 border-r border-navy-800/80 p-3 relative flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500">Standard Criticality • Low Risk</span>
                  <div className="text-[10px] font-mono text-slate-400 font-bold bg-navy-900/80 border border-navy-750 px-2 py-0.5 rounded self-start">
                    QUADRANT IV: ROUTINE MONITORING
                  </div>
                </div>

                {/* Quadrant III: Bottom Right (Orange - Secondary Hazard Mitigation) */}
                <div className="bg-orange-950/15 p-3 relative flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-orange-400/40 text-right">Standard Criticality • High Risk</span>
                  <div className="text-[10px] font-mono text-orange-400 font-bold bg-orange-950/70 border border-orange-800/60 px-2 py-0.5 rounded self-end">
                    QUADRANT III: SECONDARY ACCESS MITIGATION
                  </div>
                </div>
              </div>

              {/* GRID TICK LINES */}
              <div className="absolute inset-x-12 inset-y-8 pointer-events-none">
                {/* 50% Center Lines */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-500/20 border-dashed border-cyan-500/30" />
                <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-500/20 border-dashed border-cyan-500/30" />

                {/* 25% and 75% subtle lines */}
                <div className="absolute top-0 bottom-0 left-1/4 w-px bg-navy-800/40" />
                <div className="absolute top-0 bottom-0 left-3/4 w-px bg-navy-800/40" />
                <div className="absolute left-0 right-0 top-1/4 h-px bg-navy-800/40" />
                <div className="absolute left-0 right-0 top-3/4 h-px bg-navy-800/40" />
              </div>

              {/* Y-AXIS TICKS & LABELS (Left margin: 48px) */}
              <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
                <span className="text-red-400 font-bold">100 -</span>
                <span>75 -</span>
                <span className="text-cyan-400">50 -</span>
                <span>25 -</span>
                <span>0 -</span>
              </div>

              {/* Y-AXIS TITLE */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold pointer-events-none">
                Criticality Weight &rarr;
              </div>

              {/* ASSET DOTS CANVAS */}
              <div className="absolute inset-x-12 inset-y-8">
                {filteredAssets.map((asset, index) => {
                  const isSelected = selectedAsset.id === asset.id;
                  const crit = getCriticalityScore(asset);
                  const risk = getRiskScore(asset);

                  // Calculate exact mathematical coordinates with collision spread
                  const rawX = (risk / 100) * 88 + 6;
                  const rawY = (crit / 100) * 84 + 8;

                  // Small deterministic offset to avoid overlap for assets with close scores
                  const offsetX = ((index % 3) - 1) * 2.2;
                  const offsetY = (((index * 2) % 3) - 1) * 2.2;

                  const posX = Math.min(94, Math.max(6, rawX + offsetX));
                  const posY = Math.min(92, Math.max(8, rawY + offsetY));

                  return (
                    <div
                      key={asset.id}
                      style={{
                        left: `${posX}%`,
                        bottom: `${posY}%`,
                      }}
                      className="absolute -translate-x-1/2 translate-y-1/2 z-20 group"
                    >
                      <button
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`relative rounded-xl p-1.5 transition-all flex items-center gap-1.5 border-2 shadow-lg ${
                          isSelected
                            ? 'bg-navy-900 border-cyan-300 ring-4 ring-cyan-400/40 scale-110 z-30'
                            : 'bg-navy-950/90 border-navy-700 hover:border-cyan-400 hover:scale-105 z-10'
                        }`}
                      >
                        {/* Icon Container */}
                        <div className={`p-1 rounded-lg ${getRiskColor(risk)}`}>
                          {getAssetIcon(asset.type, "w-3.5 h-3.5")}
                        </div>

                        {/* Text Label Pill */}
                        <span className={`text-[10px] font-mono font-bold whitespace-nowrap max-w-[110px] truncate ${
                          isSelected ? 'text-cyan-300' : 'text-slate-200'
                        }`}>
                          {asset.name.replace('Sundar ', '').replace('Emergency ', '')}
                        </span>

                        {/* Selected Indicator Ping */}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-1 -right-1" />
                        )}
                      </button>

                      {/* Tooltip on Hover */}
                      <div className="absolute left-1/2 -top-10 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-navy-900 border border-cyan-500 text-[10px] text-white p-1.5 rounded-lg font-mono whitespace-nowrap shadow-2xl z-40">
                        <div className="font-bold text-cyan-300">{asset.name}</div>
                        <div className="text-slate-300">
                          Risk: <b className="text-red-400">{risk}/100</b> • Criticality: <b className="text-white">{crit}/100</b>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-AXIS TICKS & LABELS (Bottom margin: 32px) */}
              <div className="absolute inset-x-12 bottom-1 flex justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
                <span>| 0 (Safe)</span>
                <span>| 25</span>
                <span className="text-cyan-400">| 50 (Elevated)</span>
                <span>| 75</span>
                <span className="text-red-400 font-bold">| 100 (Extreme)</span>
              </div>

              {/* X-AXIS TITLE */}
              <div className="absolute inset-x-0 bottom-0 text-center text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold pointer-events-none">
                Calculated Hazard Risk Score &rarr;
              </div>
            </div>
          ) : (
            /* TABULAR / GRID INVENTORY VIEW */
            <div className="h-[420px] overflow-y-auto space-y-2 pr-1">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset.id === asset.id;
                const risk = getRiskScore(asset);
                const crit = getCriticalityScore(asset);

                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-navy-800 border-cyan-400 ring-1 ring-cyan-500/40 shadow-lg'
                        : 'bg-navy-950 border-navy-800 hover:border-navy-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-navy-900 border border-navy-800">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs">{asset.name}</h5>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {asset.type.replace('_', ' ')} • ID: {asset.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Criticality</span>
                        <span className="font-bold text-white">{crit}/100</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg font-bold ${
                        risk >= 80 ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      }`}>
                        {risk} Risk
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Matrix Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Critical Risk (&ge;80)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>High Risk (60-79)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Medium (40-59)</span>
              </span>
            </div>
            <span className="text-cyan-400">{filteredAssets.length} Lifelines Mapped</span>
          </div>
        </div>

        {/* RIGHT: Asset Action Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-navy-950 border border-navy-800">
                {getAssetIcon(selectedAsset.type)}
              </div>
              <div>
                <h4 className="text-base font-bold text-white leading-tight">{selectedAsset.name}</h4>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  {selectedAsset.type.replace('_', ' ')} • ID: {selectedAsset.id}
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                getRiskScore(selectedAsset) >= 80
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : getRiskScore(selectedAsset) >= 60
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
              }`}
            >
              Risk: {getRiskScore(selectedAsset)}/100
            </span>
          </div>

          {/* Structured Detail Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 grid grid-cols-2 gap-2 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Criticality Score</span>
                <span className="text-sm font-bold text-white">{getCriticalityScore(selectedAsset)}/100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Operational Status</span>
                <span className="text-sm font-bold text-teal-300">
                  {selectedAsset.status || 'Operational (Standby)'}
                </span>
              </div>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Primary Hazard Threat</span>
              </div>
              <div className="text-slate-200">
                {selectedAsset.hazard_exposure ||
                  `Storm surge flood risk ${selectedAsset.calculatedFloodRisk || 85}% • Wind shear ${selectedAsset.calculatedWindRisk || 80}%`}
              </div>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px] font-bold">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Potential Service Disruption</span>
              </div>
              <div className="text-slate-200">
                {formatIndianNumber(18000)} households and regional relief nodes may lose essential lifeline continuity upon asset failure.
              </div>
            </div>

            <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Recommended Protective Action</span>
              </div>
              <div className="text-slate-100 font-medium">
                {selectedAsset.recommendedAction ||
                  selectedAsset.recommended_actions?.[0] ||
                  'Activate backup generator, elevate electrical control modules, and pre-position repair crew.'}
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-navy-800">
                <span>Contact: <b>{selectedAsset.contact_person || 'District Response Team'}</b></span>
                <span className="text-red-400 font-bold">Deadline: Within 4 hrs</span>
              </div>
            </div>

            <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Backup Option:</span>
              <span className="text-cyan-300 font-bold">
                {selectedAsset.backupPowerAvailable || selectedAsset.backup_power_ready
                  ? 'Auxiliary Rooftop Generator Verified'
                  : 'Mobile Diesel Genset Required'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedAsset(selectedAsset);
              setActiveTab('map');
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Locate Asset on Live Impact Map</span>
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION: Tactical Action Queue */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Tactical Infrastructure Action Queue</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Time-staged operational directives for municipal departments and utility operators.
            </p>
          </div>

          {/* Time Tabs */}
          <div className="flex items-center gap-1.5 bg-navy-950 p-1 rounded-xl border border-navy-800 font-mono text-xs">
            <button
              onClick={() => setActiveQueueTab('immediate')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeQueueTab === 'immediate'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-red-400 hover:text-white'
              }`}
            >
              Immediate ({immediateActions.length})
            </button>
            <button
              onClick={() => setActiveQueueTab('next6h')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeQueueTab === 'next6h'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-orange-400 hover:text-white'
              }`}
            >
              Next 6 Hours ({next6hActions.length})
            </button>
            <button
              onClick={() => setActiveQueueTab('monitor')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeQueueTab === 'monitor'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-teal-400 hover:text-white'
              }`}
            >
              Monitor ({monitorActions.length})
            </button>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displayQueue.map((asset) => {
            const risk = getRiskScore(asset);
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer bg-navy-950 ${
                  selectedAsset.id === asset.id
                    ? 'border-cyan-400 ring-1 ring-cyan-500/40'
                    : 'border-navy-800 hover:border-navy-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-navy-900 border border-navy-800">
                      {getAssetIcon(asset.type)}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs leading-snug">{asset.name}</h5>
                      <span className="text-[10px] font-mono text-slate-400">{asset.type}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      risk >= 80 ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
                    }`}
                  >
                    {risk} Risk
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">
                  {asset.recommendedAction || asset.recommended_actions?.[0] || 'Inspect foundations and prepare emergency mitigation team.'}
                </p>

                <div className="mt-2.5 pt-2 border-t border-navy-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Contact: {asset.contact_person ? asset.contact_person.split(' ')[0] : 'Field Ops'}</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
