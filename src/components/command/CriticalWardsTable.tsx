import React from 'react';
import {
  AlertOctagon,
  Users,
  Waves,
  Navigation,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  MapPin,
  Database
} from 'lucide-react';
import { DeterministicRiskEngine } from '../../services/riskEngine';
import { optimizeShelterAssignment } from '../../utils/shelterOptimizer';
import { RiskBadge, PriorityBadge } from '../ui/RiskBadge';
import { useAppState } from '../../context/AppStateContext';

export const CriticalWardsTable: React.FC = () => {
  const { simulationParams, openVillageRiskDetail, setActiveTab, villages } = useAppState();

  // Calculate sorted villages by risk
  const sortedVillages = [...villages]
    .map((v) => ({
      village: v,
      risk: DeterministicRiskEngine.calculateRisk(v, simulationParams),
      shelterOpt: optimizeShelterAssignment(v),
    }))
    .sort((a, b) => b.risk.overallRisk - a.risk.overallRisk);

  if (villages.length === 0) {
    return (
      <div className="bg-navy-900 border border-navy-750 rounded-2xl p-6 shadow-xl text-center space-y-3 font-sans">
        <div className="p-3 rounded-full bg-navy-950 w-fit mx-auto border border-navy-800 text-slate-500">
          <Database className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-white font-mono">
          Ward Vulnerability Matrix Unavailable
        </h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Population registry layer is unconfigured. Provide a GeoJSON endpoint via <code className="text-cyan-400">VITE_VILLAGES_GEOJSON_URL</code> or enable dev fixtures.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4 md:p-5 shadow-xl space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-750 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-sm text-white font-mono tracking-tight">
              Ward Vulnerability &amp; Evacuation Priority Matrix
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Ranked deterministically using multi-hazard physical exposure formulations
          </p>
        </div>

        <button
          onClick={() => setActiveTab('evacuation')}
          className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto bg-navy-850 hover:bg-navy-800 px-3 py-1.5 rounded-xl border border-navy-700 transition-colors shadow-sm"
        >
          <span>Open Full Evacuation Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-navy-800 text-slate-400 font-mono text-[10px] uppercase bg-navy-950/40">
              <th className="py-2.5 px-3">Ward / Village</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Risk Score</th>
              <th className="py-2.5 px-3">Population</th>
              <th className="py-2.5 px-3">Surge Exposure</th>
              <th className="py-2.5 px-3">Assigned Safe Shelter</th>
              <th className="py-2.5 px-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60 font-mono">
            {sortedVillages.map(({ village, risk, shelterOpt }) => {
              const riskLevel = DeterministicRiskEngine.getRiskLevel(risk.overallRisk);

              return (
                <tr
                  key={village.id}
                  onClick={() => openVillageRiskDetail(village.id)}
                  className="hover:bg-navy-850/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 font-medium text-slate-100 font-sans">
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{village.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {village.distance_to_coast}km coast • {village.elevation}m MSL
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <PriorityBadge priority={village.priority_level} size="sm" />
                  </td>

                  <td className="py-3 px-3">
                    <RiskBadge level={riskLevel} score={risk.overallRisk} size="sm" />
                  </td>

                  <td className="py-3 px-3 text-slate-200">
                    <div className="font-semibold">{village.population.toLocaleString()}</div>
                    <div className="text-[10px] text-orange-400">
                      {village.elderly_population + village.children_population} dependents
                    </div>
                  </td>

                  <td className="py-3 px-3 text-cyan-300">
                    <div>{village.flood_probability}% probability</div>
                    <div className="text-[10px] text-slate-400">
                      ~{village.estimated_water_depth.toFixed(1)}m water depth
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    {shelterOpt.isRerouted ? (
                      <div className="text-red-400 text-[11px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                        <span>Rerouted: Shelter B</span>
                      </div>
                    ) : (
                      <div className="text-emerald-400 text-[11px] font-semibold">
                        {shelterOpt.assignedShelter.name.split('(')[0]}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                      via {shelterOpt.recommendedCorridor}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openVillageRiskDetail(village.id);
                      }}
                      className="text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-200 group-hover:underline"
                    >
                      Inspect &gt;
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
