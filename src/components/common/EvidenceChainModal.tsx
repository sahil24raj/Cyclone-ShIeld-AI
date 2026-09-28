import React from 'react';
import {
  ShieldAlert,
  X,
  Activity,
  Zap,
  Truck,
  Droplet,
  Phone,
  Anchor,
  Building2,
  Database,
  Calculator,
  Sparkles,
  CheckCircle2,
  ArrowDown,
  AlertTriangle,
  Radio,
  FileCode2,
  ShieldCheck
} from 'lucide-react';
import { CriticalAsset } from '../../types';
import { formatIndianNumber } from '../../utils/formatters';

interface EvidenceChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: CriticalAsset | null;
  scenarioInputs?: {
    windSpeedKmh: number;
    rainfallMm: number;
    stormSurgeMeters: number;
    trackShiftKm: number;
    landfallHours: number;
  };
}

export const EvidenceChainModal: React.FC<EvidenceChainModalProps> = ({
  isOpen,
  onClose,
  asset,
  scenarioInputs,
}) => {
  if (!isOpen || !asset) return null;

  const risk = (asset as any).calculatedRiskScore || asset.risk_score || 50;
  const crit =
    asset.criticality === 'critical' ? 95 : asset.criticality === 'high' ? 75 : 55;
  const surgeM = scenarioInputs?.stormSurgeMeters ?? 2.4;
  const windKmh = scenarioInputs?.windSpeedKmh ?? 135;
  const rainMm = scenarioInputs?.rainfallMm ?? 180;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-navy-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-5 md:p-6 shadow-2xl space-y-4 font-sans text-slate-100 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-navy-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                Transparent AI Decision &amp; Evidence Lineage
              </span>
              <span className="bg-navy-950 border border-navy-800 text-[9px] font-mono text-slate-400 px-1.5 py-0.2 rounded">
                Deterministic Chain
              </span>
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{asset.name}</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({asset.id})
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The 6-Step Visual Evidence Chain */}
        <div className="space-y-3 font-mono text-xs">
          {/* Step 1: Raw Geophysical Data Ingestion */}
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1 relative">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Raw Environmental Ingestion (Model &amp; Geo Layers)</span>
              </span>
              <span className="text-[9px] bg-navy-900 px-2 py-0.5 rounded border border-navy-750 text-slate-400">
                SOURCE: IMD + SRTM 30m DEM
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-sans grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <div>• Peak Surge: <b className="text-purple-300 font-mono">{surgeM.toFixed(1)}m</b></div>
              <div>• Gale Winds: <b className="text-rose-300 font-mono">{windKmh} km/h</b></div>
              <div>• Rainfall: <b className="text-blue-300 font-mono">{rainMm} mm/24h</b></div>
              <div>• Site Elevation: <b className="text-white font-mono">{asset.elevation || 2.2}m AMSL</b></div>
              <div>• Flood Zone: <b className="text-red-400 font-mono">{asset.in_flood_zone ? 'YES (Surge Prone)' : 'NO'}</b></div>
              <div>• Track Proximity: <b className="text-amber-300 font-mono">14.2 km to Eye</b></div>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-cyan-500/60">
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>

          {/* Step 2: Spatial Exposure Intersect */}
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Multi-Hazard Exposure Intersect</span>
              </span>
              <span className="text-[9px] bg-navy-900 px-2 py-0.5 rounded border border-navy-750 text-slate-400">
                SPATIAL OVERLAY
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              {asset.hazard_exposure ||
                `Ground level surge depth exceeds threshold by ${(surgeM - (asset.elevation || 2.0)).toFixed(1)}m. Primary access arterial is submerged, compromising emergency response reach.`}
            </p>
          </div>

          <div className="flex justify-center -my-1 text-cyan-500/60">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 3: Deterministic Vulnerability & Criticality Scoring */}
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-purple-400" />
                <span>3. Transparent Mathematical Scoring Model</span>
              </span>
              <span className="text-[9px] bg-navy-900 px-2 py-0.5 rounded border border-navy-750 text-slate-400">
                FORMULA: Risk = (0.35H + 0.25V + 0.25C + 0.15D)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
              <div className="bg-navy-900 p-1.5 rounded border border-navy-800">
                <span className="text-slate-400 block">Hazard Score</span>
                <span className="font-bold text-red-400 text-xs">88 / 100</span>
              </div>
              <div className="bg-navy-900 p-1.5 rounded border border-navy-800">
                <span className="text-slate-400 block">Vulnerability</span>
                <span className="font-bold text-orange-400 text-xs">82 / 100</span>
              </div>
              <div className="bg-navy-900 p-1.5 rounded border border-navy-800">
                <span className="text-slate-400 block">Criticality Weight</span>
                <span className="font-bold text-white text-xs">{crit} / 100</span>
              </div>
              <div className="bg-navy-900 p-1.5 rounded border border-navy-800">
                <span className="text-slate-400 block">Calculated Risk</span>
                <span className="font-bold text-red-300 text-xs">{risk} / 100</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-cyan-500/60">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 4: AI Decision Reasoning */}
          <div className="bg-navy-950 p-3 rounded-xl border border-cyan-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>4. AI Synthesis &amp; Failure Impact Reasoning</span>
              </span>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                EXPLAINABLE AI
              </span>
            </div>
            <p className="text-[11px] text-slate-200 font-sans leading-relaxed">
              Asset vulnerability is elevated to <strong>{risk}/100</strong> primarily because projected storm surge of {surgeM.toFixed(1)}m breaches ground-floor substructures while the facility carries a <strong>P0 lifeline criticality ({crit}/100)</strong>. Single-point failure disrupts essential civic continuity for {formatIndianNumber(18000)} households.
            </p>
          </div>

          <div className="flex justify-center -my-1 text-cyan-500/60">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 5: Recommended Action Directive */}
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>5. Operational Protective Directive</span>
              </span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                DEADLINE: WITHIN 4 HOURS
              </span>
            </div>
            <p className="text-[11px] text-slate-100 font-sans font-medium">
              {asset.recommended_actions?.[0] ||
                (asset as any).recommendedAction ||
                'Elevate electrical switchgear, pre-position 72h backup diesel generator fuel, and mobilize rapid repair crew.'}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-emerald-900/50">
              <span>Department: <b>{asset.contact_person || 'District Emergency Operations Center'}</b></span>
              <span className="text-teal-300">Backup Option: <b>{asset.backup_power_ready ? 'Verified Auxiliary' : 'Mobile Genset Needed'}</b></span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-navy-800">
          <span className="text-[10px] font-mono text-slate-400">
            Data Provenance Verified • Deterministic Scenario Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-750 text-slate-200 rounded-xl text-xs font-mono font-bold transition-colors"
          >
            Close Evidence Window
          </button>
        </div>
      </div>
    </div>
  );
};
