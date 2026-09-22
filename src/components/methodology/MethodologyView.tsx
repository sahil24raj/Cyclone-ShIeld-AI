import React from 'react';
import {
  Database,
  Calculator,
  Satellite,
  Layers,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldAlert,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { METHODOLOGY_DATA } from '../../data/methodologyData';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto font-sans">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Scientific Architecture &amp; Data Provenance
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Multi-Hazard Vulnerability Modeling Framework (v2.4)
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Transparent, explainable risk equations combining hydrodynamic coastal surge, synthetic aperture radar (SAR), digital elevation models (DEM), and demographic vulnerability matrices.
          </p>
        </div>

        <div className="bg-navy-950 border border-navy-800 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-3">
          <div>
            <span className="text-slate-400 text-[10px]">Framework:</span>
            <div className="font-bold text-cyan-300">P-CHMVM v2.4</div>
          </div>
          <span className="h-4 w-px bg-navy-800" />
          <div>
            <span className="text-slate-400 text-[10px]">Confidence Bar:</span>
            <div className="font-bold text-emerald-400">88.4% (Tier 1)</div>
          </div>
        </div>
      </div>

      {/* 1. Core Risk Formula & Weight Breakdown */}
      <div className="bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white font-mono">
              Composite Explainable Risk Equation
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            0 - 100 Calibrated Score Index
          </span>
        </div>

        <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 font-mono text-center">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">
            Global District Vulnerability Equation
          </div>
          <code className="text-sm md:text-base font-bold text-cyan-300 block py-1">
            Overall Risk = 0.35 × Hazard + 0.25 × Exposure + 0.25 × Vulnerability + 0.15 × Criticality
          </code>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {METHODOLOGY_DATA.riskFormula.weights.map((w) => (
            <div
              key={w.component}
              className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{w.component}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ color: w.color, backgroundColor: `${w.color}15` }}>
                  {w.weight}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {w.component === 'Hazard Score' && 'Wind (25%) + Surge (25%) + Flood (25%) + Rain (15%) + Track (10%)'}
                {w.component === 'Exposure Score' && 'Population (35%) + Infra Density (25%) + Built-up (20%) + Agriculture (20%)'}
                {w.component === 'Vulnerability Score' && 'Low Elev (30%) + Coast Prox (20%) + Road Cutoff (20%) + Shelter Dist (15%) + Social (15%)'}
                {w.component === 'Criticality Score' && 'Hospital ICU + 33kV Substation + Evacuation Corridor Prioritization'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Earth Observation & Satellite Data Pipeline */}
      <div className="bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white font-mono">
              Earth Observation &amp; AI Integration Pipeline
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">
            GEE &amp; Gemini Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {METHODOLOGY_DATA.dataSources.map((src) => (
            <div key={src.name} className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-start justify-between">
                <div className="font-bold text-xs text-white font-sans">{src.name}</div>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-navy-900 text-cyan-300 border border-navy-750 font-semibold">
                  {src.sourceType}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">{src.role}</p>

              <div className="pt-2 border-t border-navy-850 text-[10px] font-mono text-slate-400 space-y-1">
                <div>Datasets: <span className="text-slate-300">{src.datasets.join(', ')}</span></div>
                <div className="flex items-center justify-between">
                  <span>Frequency: {src.frequency}</span>
                  <span className="text-emerald-400">{src.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Explicit Known Limitations & Disclaimers */}
      <div className="bg-navy-900 border border-red-500/30 p-5 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-navy-750 pb-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm text-white font-mono">
            Mandatory Limitations &amp; Operational Guardrails
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {METHODOLOGY_DATA.limitations.map((lim, idx) => (
            <div key={idx} className="bg-navy-950/80 p-3 rounded-xl border border-navy-800 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
              <span>{lim}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
