import React from 'react';
import {
  X,
  AlertTriangle,
  Users,
  Waves,
  Navigation,
  Compass,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Village } from '../../types';
import { calculateVillageRisk, getRiskLevel } from '../../utils/riskCalculator';
import { optimizeShelterAssignment } from '../../utils/shelterOptimizer';
import { getRiskBadgeClasses, getPriorityBadgeClasses, formatIndianNumber } from '../../utils/formatters';
import { useAppState } from '../../context/AppStateContext';

interface VillageRiskDrawerProps {
  village: Village | null;
  onClose: () => void;
}

export const VillageRiskDrawer: React.FC<VillageRiskDrawerProps> = ({ village, onClose }) => {
  const { simulationParams, setActiveTab } = useAppState();

  if (!village) return null;

  const riskBreakdown = calculateVillageRisk(village, simulationParams);
  const riskLevel = getRiskLevel(riskBreakdown.overallRisk);
  const badgeClasses = getRiskBadgeClasses(riskLevel);
  const priorityClasses = getPriorityBadgeClasses(village.priority_level);
  const shelterOptimization = optimizeShelterAssignment(village);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-navy-900 border-l border-navy-750 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto font-sans transition-all duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-navy-750 bg-navy-950/80 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${priorityClasses.bg}`}>
                {priorityClasses.label}
              </span>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                Ward ID: {village.id}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              {village.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Sundar Coast Coastal Sector • {village.lat.toFixed(3)}°N, {village.lng.toFixed(3)}°E
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Body Content */}
      <div className="p-4 space-y-4">
        {/* Composite Explainable Risk Score Card */}
        <div className={`p-4 rounded-xl border ${badgeClasses.border} ${badgeClasses.bg} relative overflow-hidden`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Explainable Risk Index
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold font-mono text-white">
                  {riskBreakdown.overallRisk}
                </span>
                <span className="text-xs text-slate-300 font-mono">/ 100</span>
                <span className={`text-xs font-bold uppercase ml-2 px-2 py-0.5 rounded-full ${badgeClasses.border} ${badgeClasses.text} bg-navy-950/80`}>
                  {riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Sub-Score Radar Matrix */}
            <div className="text-right font-mono text-[10px] space-y-0.5 text-slate-300">
              <div>Hazard (35%): <span className="text-red-400 font-bold">{riskBreakdown.hazardScore}</span></div>
              <div>Exposure (25%): <span className="text-orange-400 font-bold">{riskBreakdown.exposureScore}</span></div>
              <div>Vulnerability (25%): <span className="text-amber-400 font-bold">{riskBreakdown.vulnerabilityScore}</span></div>
              <div>Criticality (15%): <span className="text-purple-400 font-bold">{riskBreakdown.criticalityScore}</span></div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-navy-750/50 text-[11px] text-slate-300">
            <span className="font-semibold text-white">Risk Formula:</span>{' '}
            <code className="bg-navy-950/80 px-1 py-0.5 rounded text-[10px] text-cyan-300 font-mono">
              0.35×H ({riskBreakdown.hazardScore}) + 0.25×E ({riskBreakdown.exposureScore}) + 0.25×V ({riskBreakdown.vulnerabilityScore}) + 0.15×C ({riskBreakdown.criticalityScore}) = {riskBreakdown.overallRisk}
            </code>
          </div>
        </div>

        {/* AI Model Reasoning Drivers */}
        <div className="bg-navy-850 p-3.5 rounded-xl border border-navy-750 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Risk Attribution Drivers</span>
          </div>
          <div className="space-y-1.5">
            {riskBreakdown.drivers.map((driver, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs bg-navy-900/80 px-2.5 py-1.5 rounded border border-navy-800"
              >
                <span className="text-slate-300">{driver.label}</span>
                <span className="font-mono font-bold text-red-400">
                  +{driver.impact} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-navy-850 p-3 rounded-lg border border-navy-750">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Total Population</span>
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {formatIndianNumber(village.population)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Elderly: {village.elderly_population} • Children: {village.children_population}
            </div>
          </div>

          <div className="bg-navy-850 p-3 rounded-lg border border-navy-750">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>Projected Water Depth</span>
            </div>
            <div className="text-lg font-bold font-mono text-cyan-300">
              {village.estimated_water_depth.toFixed(1)} meters
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Prob: {village.flood_probability}% • Elev: {village.elevation}m AMSL
            </div>
          </div>
        </div>

        {/* Dynamic Shelter Rerouting Recommendation Card */}
        <div className="bg-navy-850 p-4 rounded-xl border border-navy-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Shelter Assignment Optimization</span>
            </div>
            {shelterOptimization.isRerouted && (
              <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                Rerouted (Hazard Avoidance)
              </span>
            )}
          </div>

          {shelterOptimization.isRerouted ? (
            <div className="bg-red-950/40 border border-red-800/50 p-3 rounded-lg space-y-2 text-xs">
              <div className="flex items-start gap-2 text-red-300">
                <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p>{shelterOptimization.routeReason}</p>
              </div>

              <div className="bg-navy-900 p-2.5 rounded border border-navy-750 space-y-1 text-slate-200">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Assigned Safe Shelter: {shelterOptimization.assignedShelter.name}
                </div>
                <div className="text-[11px] text-slate-300">
                  <strong className="text-cyan-300">Recommended Corridor:</strong> {shelterOptimization.recommendedCorridor}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Transit Time: ~{shelterOptimization.estimatedTransitTimeMin} mins • Available Vacancy: {shelterOptimization.availableCapacity} beds
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-lg text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-200">Direct Route Clear</div>
                <div>Assigned to {shelterOptimization.assignedShelter.name} via {shelterOptimization.recommendedCorridor}.</div>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-300 bg-navy-900 p-2.5 rounded-lg border border-navy-800">
            <span className="font-bold text-amber-300">Recommended Action:</span>{' '}
            {village.recommended_action}
          </div>
        </div>

        {/* Data Provenance & Confidence */}
        <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Updated: 14 mins ago (Sentinel-1 Pass)</span>
          </div>
          <span className="text-emerald-400 font-bold">Confidence: 88.4%</span>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-navy-750 bg-navy-950 sticky bottom-0 z-10 flex gap-2">
        <button
          onClick={() => {
            onClose();
            setActiveTab('evacuation');
          }}
          className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold py-2.5 px-4 rounded-lg text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all"
        >
          <span>Open in Evacuation Planner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            onClose();
            setActiveTab('alert');
          }}
          className="bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-colors"
          title="Compose CAP Alert for this Ward"
        >
          Draft CAP
        </button>
      </div>
    </div>
  );
};
