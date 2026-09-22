import React from 'react';
import {
  Sparkles,
  Building2,
  AlertTriangle,
  CheckSquare,
  Square,
  Flame,
  Wind,
  Waves,
  Clock,
  Navigation,
  Home,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  X,
  MapPin,
  Users,
  CheckCircle2
} from 'lucide-react';
import { RiskBadge, PriorityBadge } from '../ui/RiskBadge';
import { RiskBreakdownBar } from '../ui/RiskBreakdownBar';
import { useAppState } from '../../context/AppStateContext';
import { CYCLONE_METADATA } from '../../data/cycloneData';
import { calculateVillageRisk, getRiskLevel } from '../../utils/riskCalculator';
import { optimizeShelterAssignment } from '../../utils/shelterOptimizer';

export const RightIntelligencePanel: React.FC = () => {
  const {
    selectedAsset,
    setSelectedAsset,
    selectedVillage,
    setSelectedVillage,
    assets,
    toggleAssetAction,
    setActiveTab,
    simulationParams,
  } = useAppState();

  const currentWind = Math.round(135 * simulationParams.windSpeedMultiplier);
  const currentSurge = (3.4 + simulationParams.surgeHeightOffset).toFixed(1);

  // Top prioritized critical assets sorted by risk score
  const topCriticalAssets = [...assets].sort((a, b) => b.risk_score - a.risk_score).slice(0, 3);

  // ----------------------------------------------------
  // SCENARIO A: An Infrastructure Asset is Selected
  // ----------------------------------------------------
  if (selectedAsset) {
    const isCritical = selectedAsset.risk_score >= 80;
    const completedCount = Object.values(selectedAsset.action_status).filter(Boolean).length;
    const totalCount = selectedAsset.recommended_actions.length;

    return (
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full space-y-4 select-none overflow-y-auto">
        <div className="space-y-4">
          {/* Header & Close Button */}
          <div className="flex items-start justify-between border-b border-navy-750 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedAsset.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ID: {selectedAsset.id}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white leading-tight font-sans">
                {selectedAsset.name}
              </h3>
            </div>

            <button
              onClick={() => setSelectedAsset(null)}
              className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-white transition-colors"
              title="Close inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Risk Score Highlight */}
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                Composite Risk Assessment
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-white font-mono">
                  {selectedAsset.risk_score}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 100</span>
              </div>
            </div>

            <RiskBadge
              level={isCritical ? 'critical' : 'high'}
              size="md"
            />
          </div>

          {/* Risk Drivers Breakdown */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Vulnerability Drivers
            </div>
            <div className="space-y-2 bg-navy-950/80 p-3 rounded-xl border border-navy-800">
              <RiskBreakdownBar
                label="Storm Surge Inundation"
                score={selectedAsset.type === 'hospital' ? 95 : selectedAsset.type === 'power_substation' ? 91 : 85}
              />
              <RiskBreakdownBar
                label="Flood Depth Exposure"
                score={selectedAsset.in_flood_zone ? 89 : 45}
              />
              <RiskBreakdownBar
                label="Elevation Factor"
                score={selectedAsset.elevation <= 3.0 ? 93 : 60}
                subtext={`Site Elevation: ${selectedAsset.elevation}m`}
              />
              <RiskBreakdownBar
                label="Wind Shear Hazard"
                score={Math.min(95, Math.round(72 * (currentWind / 135)))}
                subtext={`Projected Gust: ${currentWind + 25} km/h`}
              />
              <RiskBreakdownBar
                label="Disruption Consequence"
                score={selectedAsset.criticality === 'critical' ? 95 : 80}
              />
            </div>
          </div>

          {/* Explainable AI: "WHY THIS RISK?" */}
          <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-1.5 text-xs text-slate-300 leading-relaxed">
            <div className="font-bold text-amber-300 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why This Risk?</span>
            </div>
            <p>
              {selectedAsset.type === 'hospital'
                ? `The hospital is exposed to projected ${currentSurge}m inundation and sits at a low elevation of ${selectedAsset.elevation}m. Ground floor ICU and emergency wards face water ingress within 12 hours. High patient density significantly increases consequence of disruption.`
                : selectedAsset.type === 'power_substation'
                ? `The substation switchyard sits inside the primary estuary backflow zone. Salt-spray flashover and ground trench inundation risk total grid tripping for coastal feeders.`
                : `The asset is situated in the active hazard corridor. Potential access road submersion could isolate maintenance crews during peak surge.`}
            </p>
          </div>

          {/* Action Directives (P1 / P2 / P3) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-300 uppercase">Action Protocols</span>
              <span className="text-cyan-400 font-semibold">
                {completedCount} / {totalCount} Done
              </span>
            </div>

            <div className="space-y-1.5 bg-navy-950 p-3 rounded-xl border border-navy-800">
              {selectedAsset.recommended_actions.map((act, index) => {
                const isDone = !!selectedAsset.action_status[act];
                const priorityTag = index === 0 ? 'P1' : index === 1 ? 'P1' : 'P2';

                return (
                  <button
                    key={act}
                    onClick={() => toggleAssetAction(selectedAsset.id, act)}
                    className="w-full text-left flex items-start gap-2 p-1.5 rounded hover:bg-navy-850 transition-colors text-xs text-slate-200"
                  >
                    <span className="mt-0.5 flex-shrink-0">
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-red-400 flex-shrink-0 mt-0.5">
                      [{priorityTag}]
                    </span>
                    <span className={`text-[11px] leading-snug ${isDone ? 'line-through text-slate-500' : ''}`}>
                      {act}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-navy-750 flex gap-2">
          <button
            onClick={() => setActiveTab('infrastructure')}
            className="flex-1 bg-navy-850 hover:bg-navy-800 text-cyan-300 border border-navy-700 py-2 rounded-xl text-xs font-mono font-medium transition-colors text-center"
          >
            Manage Registry &gt;
          </button>
          <button
            onClick={() => setSelectedAsset(null)}
            className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-white text-xs font-mono transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCENARIO B: A Village / Ward is Selected
  // ----------------------------------------------------
  if (selectedVillage) {
    const risk = calculateVillageRisk(selectedVillage, simulationParams);
    const level = getRiskLevel(risk.overallRisk);
    const shelterOpt = optimizeShelterAssignment(selectedVillage);

    return (
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full space-y-4 select-none overflow-y-auto">
        <div className="space-y-4">
          {/* Header & Close Button */}
          <div className="flex items-start justify-between border-b border-navy-750 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PriorityBadge priority={selectedVillage.priority_level} size="sm" />
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                  Ward ID: {selectedVillage.id}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white leading-tight font-sans flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {selectedVillage.name}
              </h3>
            </div>

            <button
              onClick={() => setSelectedVillage(null)}
              className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-white transition-colors"
              title="Close inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Overall Risk Score */}
          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                Multi-Hazard Risk Index
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-white font-mono">
                  {risk.overallRisk}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 100</span>
              </div>
            </div>

            <RiskBadge level={level} size="md" />
          </div>

          {/* Demographic Exposure Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
              <span className="text-[10px] text-slate-400">Total Population</span>
              <div className="font-bold text-white text-sm mt-0.5">
                {selectedVillage.population.toLocaleString()}
              </div>
            </div>
            <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
              <span className="text-[10px] text-orange-400">Vulnerable Dependents</span>
              <div className="font-bold text-orange-300 text-sm mt-0.5">
                {selectedVillage.elderly_population + selectedVillage.children_population}
              </div>
            </div>
          </div>

          {/* Risk Drivers Breakdown */}
          <div className="space-y-2 bg-navy-950/80 p-3 rounded-xl border border-navy-800">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
              Hazard &amp; Vulnerability Matrix
            </div>
            <RiskBreakdownBar
              label="Coastal Surge Inundation"
              score={selectedVillage.distance_to_coast <= 2.0 ? 94 : 65}
              subtext={`Coast Distance: ${selectedVillage.distance_to_coast} km`}
            />
            <RiskBreakdownBar
              label="Elevation Vulnerability"
              score={selectedVillage.elevation <= 2.0 ? 96 : 50}
              subtext={`Terrain Elev: ${selectedVillage.elevation}m MSL`}
            />
            <RiskBreakdownBar
              label="Road Access Submersion"
              score={selectedVillage.is_road_submerged ? 92 : 30}
              subtext={selectedVillage.is_road_submerged ? 'Primary SH-12 Cutoff' : 'Access Open'}
            />
            <RiskBreakdownBar
              label="Dependent Demographic Weight"
              score={Math.round(((selectedVillage.elderly_population + selectedVillage.children_population) / selectedVillage.population) * 100 * 2.2)}
            />
          </div>

          {/* Assigned Evacuation Plan & Safe Shelter */}
          <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-2 text-xs">
            <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Optimized Safe Sanctuary</span>
            </div>

            <div className="bg-navy-900 p-2 rounded-lg border border-navy-750">
              <div className="font-bold text-white font-sans text-xs">
                {shelterOpt.assignedShelter.name}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                Capacity: {shelterOpt.availableCapacity} beds available • ~{shelterOpt.estimatedTransitTimeMin} min transit
              </div>
            </div>

            {shelterOpt.isRerouted && (
              <div className="p-2 rounded bg-red-950/40 border border-red-500/40 text-[11px] text-red-300 font-mono">
                ⚠ Rerouted via {shelterOpt.recommendedCorridor} to avoid submerged highway.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-navy-750 flex gap-2">
          <button
            onClick={() => setActiveTab('evacuation')}
            className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-2 rounded-xl text-xs font-mono shadow-md transition-all text-center"
          >
            Dispatch Evacuation Plan &gt;
          </button>
          <button
            onClick={() => setSelectedVillage(null)}
            className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-white text-xs font-mono transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCENARIO C: Default Command State (No selection)
  // ----------------------------------------------------
  return (
    <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full space-y-4 select-none overflow-y-auto">
      <div className="space-y-4">
        {/* Section 1: CURRENT SITUATION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between border-b border-navy-750 pb-2">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white uppercase tracking-wider">
              <Flame className="w-4 h-4 text-red-400" />
              <span>Current Situation</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              ● IMD RSMC ACTIVE
            </span>
          </div>

          <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cyclone System:</span>
              <span className="font-bold text-white font-sans">{CYCLONE_METADATA.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Intensity:</span>
              <span className="text-red-400 font-bold">{currentWind} km/h (Cat-3)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Central Pressure:</span>
              <span className="text-slate-200">974 hPa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Est. Landfall:</span>
              <span className="text-orange-400 font-bold">~24h (Tomorrow 08:30 IST)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Overall District Risk:</span>
              <span className="text-red-400 font-bold">HIGH (74 / 100)</span>
            </div>
          </div>
        </div>

        {/* Section 2: TOP PRIORITIES (Critical infrastructure at risk) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Top Priority Assets</span>
            </span>
            <span className="text-[10px] text-cyan-400">Select to Inspect</span>
          </div>

          <div className="space-y-1.5">
            {topCriticalAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => {
                  setSelectedAsset(asset);
                  setSelectedVillage(null);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-navy-950 hover:bg-navy-850 border border-navy-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
              >
                <div className="truncate">
                  <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors truncate">
                    {asset.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {asset.hazard_exposure}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-red-400 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/30">
                    {asset.risk_score}/100
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: AI SITUATION BRIEF */}
        <div className="bg-gradient-to-br from-navy-950 to-navy-900 p-3.5 rounded-xl border border-navy-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Situation Brief</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">T-24h Model</span>
          </div>

          <p className="leading-relaxed text-[11px]">
            Peak storm surge of <strong>{currentSurge}m</strong> projected to coincide with astronomical tide. Coastal road <strong>SH-12 is cutoff</strong> at Km 14.2. Priority P0 mandatory evacuations must complete via <strong>Elevated Corridor 2</strong> before 18:00 IST.
          </p>

          <div className="pt-1.5 border-t border-navy-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Data: GEE Sentinel-1 SAR + IMD</span>
            <span className="text-emerald-400 font-bold">Conf: 88.4%</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-navy-750">
        <button
          onClick={() => setActiveTab('briefing')}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-mono shadow-lg flex items-center justify-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Open Full AI Briefing Document &gt;</span>
        </button>
      </div>
    </div>
  );
};
