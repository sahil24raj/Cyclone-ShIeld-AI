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
  Filter
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { CriticalAsset, AssetType } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { RiskBreakdownBar } from '../ui/RiskBreakdownBar';
import { EmptyState } from '../ui/EmptyState';

export const InfrastructureView: React.FC = () => {
  const { assets, toggleAssetAction, setSelectedAsset, setActiveTab } = useAppState();
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter & Sort
  const filteredAssets = assets
    .filter((a) => {
      const matchType = selectedTypeFilter === 'all' || a.type === selectedTypeFilter;
      const matchQuery =
        searchQuery === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchQuery;
    })
    .sort((a, b) => b.risk_score - a.risk_score);

  const totalAssets = assets.length;
  const criticalAssets = assets.filter((a) => a.risk_score >= 80).length;
  const floodZoneAssets = assets.filter((a) => a.in_flood_zone).length;
  const backupPowerReady = assets.filter((a) => a.backup_power_ready).length;

  const TYPE_TABS: { id: string; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'All Lifelines', icon: <Building2 className="w-3.5 h-3.5" />, count: totalAssets },
    { id: 'hospital', label: 'Hospitals', icon: <Activity className="w-3.5 h-3.5 text-rose-400" />, count: assets.filter(a => a.type === 'hospital').length },
    { id: 'power_substation', label: 'Power Grid', icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, count: assets.filter(a => a.type === 'power_substation').length },
    { id: 'bridge', label: 'Bridges', icon: <Truck className="w-3.5 h-3.5 text-blue-400" />, count: assets.filter(a => a.type === 'bridge').length },
    { id: 'road', label: 'Roadways', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />, count: assets.filter(a => a.type === 'road').length },
    { id: 'telecom', label: 'Telecom Hubs', icon: <Phone className="w-3.5 h-3.5 text-cyan-400" />, count: assets.filter(a => a.type === 'telecom').length },
    { id: 'water_treatment', label: 'Water Plants', icon: <Droplet className="w-3.5 h-3.5 text-sky-400" />, count: assets.filter(a => a.type === 'water_treatment').length },
    { id: 'port', label: 'Marine Ports', icon: <Anchor className="w-3.5 h-3.5 text-purple-400" />, count: assets.filter(a => a.type === 'port').length },
  ];

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1650px] mx-auto font-sans">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Critical Infrastructure Resilience Registry
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Lifeline Assets &amp; Operational Defense Protocols
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Automated priority ranking based on surge flood depth, wind shear thresholds, backup power continuity, and hospital patient density.
          </p>
        </div>

        {/* Quick Summary Telemetry */}
        <div className="flex items-center gap-3 bg-navy-950 border border-navy-800 p-2.5 rounded-xl font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-400">Total Registry</div>
            <div className="font-bold text-white text-sm">{totalAssets} Assets</div>
          </div>
          <span className="h-6 w-px bg-navy-800" />
          <div>
            <div className="text-[10px] text-red-400">Critical Risk</div>
            <div className="font-bold text-red-400 text-sm">{criticalAssets} Priority</div>
          </div>
          <span className="h-6 w-px bg-navy-800" />
          <div>
            <div className="text-[10px] text-cyan-400">In Surge Zone</div>
            <div className="font-bold text-cyan-300 text-sm">{floodZoneAssets} Assets</div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-900 border border-navy-750 p-3 rounded-2xl shadow-lg">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
          {TYPE_TABS.map((tab) => {
            const isSelected = selectedTypeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all flex-shrink-0 border ${
                  isSelected
                    ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold shadow-sm shadow-cyan-950'
                    : 'bg-navy-950 hover:bg-navy-850 text-slate-400 hover:text-slate-200 border-navy-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-navy-900 border border-navy-750 text-slate-400">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by name, ID, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-950 border border-navy-750 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <EmptyState
          title="No Matching Infrastructure Assets"
          description={`No assets match the search query "${searchQuery}" or selected category filter.`}
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedTypeFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const isCritical = asset.risk_score >= 80;
            const completedActions = Object.values(asset.action_status).filter(Boolean).length;
            const totalActions = asset.recommended_actions.length;

            return (
              <div
                key={asset.id}
                className={`bg-navy-900 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all hover:border-cyan-500/50 group ${
                  isCritical ? 'border-red-500/30' : 'border-navy-750'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Type & Risk Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-navy-950 text-slate-300 border border-navy-800">
                      {asset.type.replace('_', ' ')}
                    </span>
                    <RiskBadge
                      level={isCritical ? 'critical' : asset.risk_score >= 60 ? 'high' : 'moderate'}
                      score={asset.risk_score}
                      size="sm"
                    />
                  </div>

                  {/* Asset Title & Exposure */}
                  <div>
                    <h3 className="font-bold text-sm text-white leading-snug group-hover:text-cyan-300 transition-colors">
                      {asset.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>Elev {asset.elevation}m • {asset.in_flood_zone ? 'Surge Inundation Zone' : 'Higher Elevation'}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                    {asset.hazard_exposure}
                  </p>

                  {/* Action Protocols Checklist */}
                  <div className="space-y-1.5 bg-navy-950 p-2.5 rounded-xl border border-navy-800 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Action Protocol Progress:</span>
                      <span className="text-cyan-400 font-bold">
                        {completedActions} / {totalActions} Done
                      </span>
                    </div>

                    {asset.recommended_actions.map((act) => {
                      const isDone = !!asset.action_status[act];
                      return (
                        <button
                          key={act}
                          onClick={() => toggleAssetAction(asset.id, act)}
                          className="w-full text-left flex items-start gap-2 text-[11px] text-slate-300 hover:text-white transition-colors"
                        >
                          {isDone ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`truncate ${isDone ? 'line-through opacity-60' : ''}`}>
                            {act}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer: Status & Command Center Inspector */}
                <div className="border-t border-navy-800 pt-3 mt-3 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-400">
                    Status: <b className="text-cyan-300 uppercase">{asset.current_status}</b>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setActiveTab('command');
                    }}
                    className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-200 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect On GIS</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
