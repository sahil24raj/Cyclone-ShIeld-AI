import React from 'react';
import { SummaryCards } from './SummaryCards';
import { LeftLayerPanel } from './LeftLayerPanel';
import { RightIntelligencePanel } from './RightIntelligencePanel';
import { CriticalWardsTable } from './CriticalWardsTable';
import { InteractiveMap } from '../map/InteractiveMap';
import {
  Sparkles,
  Map as MapIcon,
  Sliders,
  AlertOctagon,
  ArrowRight,
  Radio,
  Maximize2
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const CommandCentreView: React.FC = () => {
  const { setActiveTab } = useAppState();

  return (
    <div className="space-y-4 p-3 md:p-5 max-w-[1750px] mx-auto font-sans">
      {/* Top Welcome & Quick Operational Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
              Emergency Operations Center (EOC) • Sundar Coast Sector
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Integrated Cyclone Impact &amp; Infrastructure Command
          </h2>
          <p className="text-xs text-slate-300">
            Real-time multi-hazard synthesis combining Sentinel-1 SAR water indices, Holland wind kinematics, and SLOSH hydrodynamic surge.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveTab('briefing')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-3.5 rounded-xl shadow-md shadow-cyan-950/50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Briefing</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-750 text-purple-300 border border-purple-500/30 font-bold py-2 px-3 rounded-xl transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>What-If Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('alert')}
            className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-bold py-2 px-3 rounded-xl transition-all"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span>Draft CAP Alert</span>
          </button>
        </div>
      </div>

      {/* 6 Key Operational Summary Metrics */}
      <SummaryCards />

      {/* Main 3-Column Disaster Operations Layout (Map > Intelligence > Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column: GIS Layer Stack & Quick Focus (3 Cols on lg/xl) */}
        <div className="lg:col-span-3 h-[580px]">
          <LeftLayerPanel />
        </div>

        {/* Center Column: Interactive GIS Map Hero (6 Cols on lg/xl) */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-750 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[580px]">
          <div className="p-3 border-b border-navy-750 bg-navy-950/90 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs text-white font-mono">
                Sundar Coast District Multi-Hazard GIS Map
              </span>
              <span className="bg-cyan-500/15 text-cyan-300 text-[10px] font-mono px-1.5 py-0.2 rounded border border-cyan-500/30">
                T-24h Model
              </span>
            </div>

            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
              title="Expand to Fullscreen GIS"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen GIS</span>
            </button>
          </div>

          <div className="flex-1 relative">
            <InteractiveMap />
          </div>
        </div>

        {/* Right Column: Operational Inspection & AI Action Panel (3 Cols on lg/xl) */}
        <div className="lg:col-span-3 h-[580px]">
          <RightIntelligencePanel />
        </div>
      </div>

      {/* Bottom Section: Critical Wards Vulnerability & Evacuation Matrix */}
      <CriticalWardsTable />
    </div>
  );
};
