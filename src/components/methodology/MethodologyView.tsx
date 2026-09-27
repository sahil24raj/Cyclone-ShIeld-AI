import React from 'react';
import {
  Database,
  Calculator,
  Satellite,
  Layers,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Radio,
  ExternalLink,
  ShieldCheck,
  Compass,
  Building2,
  Users
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto font-sans select-none text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Database className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
              Transparent Risk Architecture
            </span>
            <span className="bg-navy-950 border border-navy-750 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
              Deterministic Formulation
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Data Provenance &amp; Multi-Hazard Risk Formulation
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Transparent methodology explaining how raw physical parameters are synthesized into deterministic local action directives.
          </p>
        </div>

        {/* Prototype Verification Badge */}
        <div className="bg-navy-950 border border-navy-800 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-3">
          <div>
            <span className="text-slate-400 text-[10px]">Simulation Engine:</span>
            <div className="font-bold text-cyan-300">Client-Side Zero-Latency</div>
          </div>
          <span className="h-5 w-px bg-navy-800" />
          <div>
            <span className="text-slate-400 text-[10px]">Data Baseline:</span>
            <div className="font-bold text-purple-400">Deterministic Synthetic</div>
          </div>
        </div>
      </div>

      {/* 1. VISUAL RISK FORMULA */}
      <div className="bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
          <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>How Risk is Calculated</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            0 to 100 Calibrated Risk Score
          </span>
        </div>

        {/* Big Visual Equation Box */}
        <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-center space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            Composite Multi-Hazard Vulnerability Formula
          </div>
          <div className="text-base md:text-lg font-mono font-black text-cyan-300 py-1 flex flex-wrap items-center justify-center gap-2">
            <span>Overall Risk</span>
            <span className="text-slate-500">=</span>
            <span className="text-red-400">0.35 × Hazard</span>
            <span className="text-slate-500">+</span>
            <span className="text-orange-400">0.25 × Exposure</span>
            <span className="text-slate-500">+</span>
            <span className="text-amber-400">0.25 × Vulnerability</span>
            <span className="text-slate-500">+</span>
            <span className="text-teal-300">0.15 × Criticality</span>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-navy-950 p-3.5 rounded-xl border border-red-900/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-red-400">Hazard (35%)</span>
              <span className="bg-red-950 text-red-300 px-1.5 py-0.2 rounded text-[10px]">Physical</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Wind speed intensity, storm surge height, rainfall volume, and radial track proximity.
            </p>
          </div>

          <div className="bg-navy-950 p-3.5 rounded-xl border border-orange-900/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-orange-400">Exposure (25%)</span>
              <span className="bg-orange-950 text-orange-300 px-1.5 py-0.2 rounded text-[10px]">Population</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Resident count, household density, elderly and children demographics in harm's way.
            </p>
          </div>

          <div className="bg-navy-950 p-3.5 rounded-xl border border-amber-900/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-400">Vulnerability (25%)</span>
              <span className="bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded text-[10px]">Terrain</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Elevation above sea level, distance to coastline, drainage slopes, and shelter proximity.
            </p>
          </div>

          <div className="bg-navy-950 p-3.5 rounded-xl border border-teal-900/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-teal-300">Criticality (15%)</span>
              <span className="bg-teal-950 text-teal-300 px-1.5 py-0.2 rounded text-[10px]">Lifelines</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Presence of hospitals, substations, communication relays, and key bridge corridors.
            </p>
          </div>
        </div>
      </div>

      {/* 2. INPUTS USED IN SIMULATION */}
      <div className="bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="border-b border-navy-800 pb-2.5">
          <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Inputs Used in Simulation</span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            The mathematical model ingests 8 primary physical and demographic layers to generate local outputs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
            <span className="text-cyan-400 font-bold block">1. Cyclone Wind</span>
            <span className="text-slate-300 text-[11px]">Sustained &amp; gust speed</span>
          </div>
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
            <span className="text-blue-400 font-bold block">2. Rainfall</span>
            <span className="text-slate-300 text-[11px]">24h precipitation rate</span>
          </div>
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
            <span className="text-teal-400 font-bold block">3. Storm Surge</span>
            <span className="text-slate-300 text-[11px]">Tidal sea surface height</span>
          </div>
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
            <span className="text-emerald-400 font-bold block">4. Elevation</span>
            <span className="text-slate-300 text-[11px]">Digital elevation model</span>
          </div>
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
            <span className="text-amber-400 font-bold block">5. Distance to Coast</span>
            <span className="text-slate-300 text-[11px]">Shoreline proximity</span>
          </div>
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
            <span className="text-orange-400 font-bold block">6. Population</span>
            <span className="text-slate-300 text-[11px]">Census ward exposure</span>
          </div>
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
            <span className="text-indigo-400 font-bold block">7. Roads &amp; Shelters</span>
            <span className="text-slate-300 text-[11px]">Corridor accessibility</span>
          </div>
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
            <span className="text-purple-400 font-bold block">8. Infra Criticality</span>
            <span className="text-slate-300 text-[11px]">Power, health &amp; bridges</span>
          </div>
        </div>
      </div>

      {/* 3. SYNTHETIC vs PRODUCTION CONNECTIVITY & LIMITATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Synthetic Baseline Notice */}
        <div className="bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold border-b border-navy-800 pb-2">
            <Info className="w-4 h-4" />
            <span>What is Synthetic</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All current sample values, village demographic counts, and baseline cyclone trajectories are calibrated synthetic mock data designed for offline hackathon demonstration and deterministic testing.
          </p>
        </div>

        {/* Production Adapters */}
        <div className="bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold border-b border-navy-800 pb-2">
            <Satellite className="w-4 h-4" />
            <span>Production Integrations</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In live deployment, the platform connects to India Meteorological Department (IMD) bulletins, Sentinel-1 SAR flood imagery, Google Earth Engine DEM, CHIRPS rainfall, and OpenStreetMap road vectors.
          </p>
        </div>

        {/* Known Limitations */}
        <div className="bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold border-b border-navy-800 pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Known Limitations</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Simplified shallow-water surge equations are used instead of full SLOSH/ADCIRC 3D meshes. Road blockages are computed by elevation thresholds rather than live traffic telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};
