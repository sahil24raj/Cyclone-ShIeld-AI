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
  CheckSquare,
  Square,
  Search,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { CriticalAsset, AssetType } from '../../types';
import { formatIndianNumber } from '../../utils/formatters';

export const InfrastructureView: React.FC = () => {
  const { assets, toggleAssetAction, setSelectedAsset, setActiveTab } = useAppState();
  const [selectedAssetId, setSelectedAssetId] = useState<string>('infra-02'); // Default to Coastal Power Substation
  const [activeQueueTab, setActiveQueueTab] = useState<'immediate' | 'next6h' | 'monitor'>('immediate');

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'hospital': return <Activity className="w-3.5 h-3.5 text-rose-400" />;
      case 'power_substation': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'bridge': return <Truck className="w-3.5 h-3.5 text-blue-400" />;
      case 'road': return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      case 'telecom': return <Phone className="w-3.5 h-3.5 text-cyan-400" />;
      case 'water_treatment': return <Droplet className="w-3.5 h-3.5 text-sky-400" />;
      case 'port': return <Anchor className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Building2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-500 text-white shadow-red-500/40';
    if (score >= 60) return 'bg-orange-500 text-white shadow-orange-500/40';
    if (score >= 40) return 'bg-amber-500 text-navy-950 shadow-amber-500/40';
    return 'bg-teal-500 text-navy-950 shadow-teal-500/40';
  };

  const getCriticalityScore = (asset: CriticalAsset) => {
    if (asset.criticality === 'critical') return 95;
    if (asset.criticality === 'high') return 75;
    if (asset.criticality === 'moderate') return 55;
    return 35;
  };

  // Group assets for prioritized queue
  const immediateActions = assets.filter((a) => a.risk_score >= 80 || a.criticality === 'critical');
  const next6hActions = assets.filter((a) => a.risk_score >= 50 && a.risk_score < 80);
  const monitorActions = assets.filter((a) => a.risk_score < 50);

  const displayQueue =
    activeQueueTab === 'immediate'
      ? immediateActions
      : activeQueueTab === 'next6h'
      ? next6hActions
      : monitorActions;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1700px] mx-auto font-sans select-none text-slate-100">
      {/* Page Header */}
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

        {/* Action Stats */}
        <div className="flex items-center gap-3 bg-navy-950 border border-navy-800 p-2.5 rounded-xl font-mono text-xs">
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400">Total Monitored</div>
            <div className="font-bold text-white text-base">{assets.length}</div>
          </div>
          <span className="h-6 w-px bg-navy-800" />
          <div className="text-center px-2">
            <div className="text-[10px] text-red-400">P0 Protection</div>
            <div className="font-bold text-red-400 text-base">{immediateActions.length}</div>
          </div>
          <span className="h-6 w-px bg-navy-800" />
          <div className="text-center px-2">
            <div className="text-[10px] text-teal-300">Backup Ready</div>
            <div className="font-bold text-teal-300 text-base">
              {assets.filter((a) => a.backup_power_ready).length}
            </div>
          </div>
        </div>
      </div>

      {/* TOP SECTION: Matrix + Asset Detail Split (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: Priority Matrix (7 Cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-1 border-b border-navy-800">
            <div>
              <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Criticality vs. Risk Priority Matrix</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Click any asset dot to examine operational defense orders and service disruption projections.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-navy-950 px-2 py-1 rounded border border-navy-800">
              X: Risk Score • Y: Criticality
            </span>
          </div>

          {/* 2D Grid Canvas */}
          <div className="relative bg-navy-950 rounded-xl p-4 border border-navy-800 h-[380px] flex flex-col justify-between select-none">
            {/* Background Risk Zones */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20 pointer-events-none rounded-xl overflow-hidden">
              <div className="bg-amber-900/30 border-r border-b border-navy-750" />
              <div className="bg-red-900/50 border-b border-navy-750" />
              <div className="bg-teal-900/20 border-r border-navy-750" />
              <div className="bg-orange-900/30" />
            </div>

            {/* Matrix Corner Badges */}
            <span className="absolute top-2 right-2 text-[10px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/80">
              HIGH CRITICALITY + HIGH RISK (P0)
            </span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500 bg-navy-900/80 px-2 py-0.5 rounded border border-navy-800">
              LOW RISK / STANDARD STANDBY
            </span>

            {/* Y-Axis Label */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-slate-400 tracking-wider">
              CRITICALITY WEIGHT &rarr;
            </div>

            {/* Asset Dots Positioned by Risk vs Criticality */}
            <div className="relative w-full h-full">
              {assets.map((asset) => {
                const isSelected = selectedAsset.id === asset.id;
                const critScore = getCriticalityScore(asset);
                const left = Math.min(92, Math.max(8, (asset.risk_score / 100) * 88 + 6));
                const bottom = Math.min(88, Math.max(10, (critScore / 100) * 78 + 10));

                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    style={{ left: `${left}%`, bottom: `${bottom}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-10'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                        isSelected
                          ? 'border-cyan-300 ring-2 ring-cyan-400/50 ' + getRiskColor(asset.risk_score)
                          : 'border-navy-950 ' + getRiskColor(asset.risk_score)
                      }`}
                    >
                      {getAssetIcon(asset.type)}
                    </div>
                    {/* Tooltip on Hover */}
                    <div className="absolute left-1/2 -top-7 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-navy-900 border border-cyan-500/50 text-[10px] text-white px-2 py-0.5 rounded font-mono whitespace-nowrap shadow-xl z-40">
                      {asset.name} ({asset.risk_score})
                    </div>
                  </button>
                );
              })}
            </div>

            {/* X-Axis Label */}
            <div className="text-center text-[10px] font-mono text-slate-400 tracking-wider pt-2 border-t border-navy-800">
              CALCULATED HAZARD RISK &rarr;
            </div>
          </div>

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
            <span className="text-cyan-400">{assets.length} Lifelines Mapped</span>
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
                selectedAsset.risk_score >= 80
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : selectedAsset.risk_score >= 60
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
              }`}
            >
              Risk: {selectedAsset.risk_score}/100
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
                  Operational (Standby)
                </span>
              </div>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Primary Hazard Threat</span>
              </div>
              <div className="text-slate-200">
                {selectedAsset.hazard_exposure || 'Storm surge inundation + wind shear gusts > 130 km/h'}
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
                {selectedAsset.recommended_actions?.[0] ||
                  'Activate backup generator, elevate electrical control modules, and pre-position repair crew.'}
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-navy-800">
                <span>Owner: <b>District Response Team</b></span>
                <span className="text-red-400 font-bold">Deadline: Within 4 hrs</span>
              </div>
            </div>

            <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Backup Option:</span>
              <span className="text-cyan-300 font-bold">
                Auxiliary Grid Link &amp; Mobile Diesel Genset
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

      {/* BOTTOM SECTION: Compact Prioritized Action Queue */}
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
          {displayQueue.map((asset) => (
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
                    asset.risk_score >= 80 ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
                  }`}
                >
                  {asset.risk_score} Risk
                </span>
              </div>

              <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">
                {asset.recommended_actions?.[0] || 'Inspect foundations and prepare emergency mitigation team.'}
              </p>

              <div className="mt-2.5 pt-2 border-t border-navy-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Owner: Field Operations</span>
                <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                  Inspect <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
