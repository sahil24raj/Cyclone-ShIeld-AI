import React, { useState } from 'react';
import {
  Building2,
  Zap,
  Activity,
  Phone,
  Droplet,
  Truck,
  Anchor,
  Home,
  AlertTriangle,
  CheckSquare,
  Square,
  Filter,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { CriticalAsset, AssetType } from '../../types';
import { AssetDetailModal } from '../map/AssetDetailModal';

export const InfrastructureView: React.FC = () => {
  const { assets, toggleAssetAction, selectedAsset, setSelectedAsset } = useAppState();
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sort assets by priority / risk score descending
  const sortedAssets = [...assets]
    .filter((a) => {
      const matchType = selectedTypeFilter === 'all' || a.type === selectedTypeFilter;
      const matchQuery =
        searchQuery === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchQuery;
    })
    .sort((a, b) => b.risk_score - a.risk_score);

  const TYPE_TABS: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Assets (42)', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'hospital', label: 'Hospitals', icon: <Activity className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'power_substation', label: 'Power Grids', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'bridge', label: 'Bridges', icon: <Truck className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'road', label: 'Roadways', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> },
    { id: 'telecom', label: 'Telecom Hubs', icon: <Phone className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'water_treatment', label: 'Water Treatment', icon: <Droplet className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'port', label: 'Marine Ports', icon: <Anchor className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1600px] mx-auto font-sans">
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

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospitals, substations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-950 border border-navy-750 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* Asset Type Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
        {TYPE_TABS.map((tab) => {
          const isSelected = selectedTypeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTypeFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all flex-shrink-0 border ${
                isSelected
                  ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold shadow-md shadow-cyan-950'
                  : 'bg-navy-900 hover:bg-navy-850 text-slate-400 hover:text-slate-200 border-navy-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Assets Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedAssets.map((asset) => {
          const isCritical = asset.risk_score >= 80;
          const completedActions = Object.values(asset.action_status).filter(Boolean).length;
          const totalActions = asset.recommended_actions.length;

          return (
            <div
              key={asset.id}
              className={`bg-navy-900 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all hover:border-cyan-500/50 ${
                isCritical ? 'border-red-500/30' : 'border-navy-750'
              }`}
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700">
                    {asset.type.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    Risk: {asset.risk_score}/100
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white leading-snug mb-1">
                  {asset.name}
                </h3>

                <p className="text-[11px] text-slate-300 leading-relaxed mb-3 line-clamp-2">
                  {asset.hazard_exposure}
                </p>

                {/* Checklist Preview */}
                <div className="space-y-1.5 mb-3 bg-navy-950 p-2.5 rounded-xl border border-navy-800 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>Action Protocol Progress:</span>
                    <span className="text-cyan-400 font-bold">
                      {completedActions} / {totalActions} Done
                    </span>
                  </div>

                  {asset.recommended_actions.slice(0, 2).map((act) => {
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
                        <span className={`truncate ${isDone ? 'line-through opacity-70' : ''}`}>
                          {act}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="border-t border-navy-800 pt-3 flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">
                  Status: <b className="text-cyan-300 uppercase">{asset.current_status}</b>
                </div>
                <button
                  onClick={() => setSelectedAsset(asset)}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  Manage Protocols &gt;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
};
