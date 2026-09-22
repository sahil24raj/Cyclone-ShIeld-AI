import React from 'react';
import {
  AlertOctagon,
  Users,
  Waves,
  Navigation,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { MOCK_VILLAGES } from '../../data/villageData';
import { calculateVillageRisk, getRiskLevel } from '../../utils/riskCalculator';
import { getPriorityBadgeClasses, getRiskBadgeClasses, formatIndianNumber } from '../../utils/formatters';
import { optimizeShelterAssignment } from '../../utils/shelterOptimizer';
import { useAppState } from '../../context/AppStateContext';

export const CriticalWardsTable: React.FC = () => {
  const { simulationParams, openVillageRiskDetail, setActiveTab } = useAppState();

  // Calculate sorted villages by risk
  const sortedVillages = [...MOCK_VILLAGES]
    .map((v) => ({
      village: v,
      risk: calculateVillageRisk(v, simulationParams),
      shelterOpt: optimizeShelterAssignment(v),
    }))
    .sort((a, b) => b.risk.overallRisk - a.risk.overallRisk);

  return (
    <div className="bg-navy-900 border border-navy-750 rounded-xl p-4 shadow-lg space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-750 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-sm text-white font-mono tracking-tight">
              High Vulnerability Wards &amp; Evacuation Ranking
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Ranked deterministically using multi-hazard risk algorithm
          </p>
        </div>

        <button
          onClick={() => setActiveTab('evacuation')}
          className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto bg-navy-850 px-2.5 py-1.5 rounded-lg border border-navy-700 transition-colors"
        >
          <span>Full Evacuation Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-navy-800 text-slate-400 font-mono text-[10px] uppercase">
              <th className="py-2.5 px-3">Ward / Village</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Risk Index</th>
              <th className="py-2.5 px-3">Population</th>
              <th className="py-2.5 px-3">Surge Prob / Depth</th>
              <th className="py-2.5 px-3">Shelter Assignment</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60 font-mono">
            {sortedVillages.map(({ village, risk, shelterOpt }) => {
              const priorityBadge = getPriorityBadgeClasses(village.priority_level);
              const riskLevel = getRiskLevel(risk.overallRisk);
              const riskBadge = getRiskBadgeClasses(riskLevel);

              return (
                <tr
                  key={village.id}
                  onClick={() => openVillageRiskDetail(village.id)}
                  className="hover:bg-navy-800/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 font-medium text-slate-100 font-sans">
                    <div className="font-bold group-hover:text-cyan-300 transition-colors">
                      {village.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {village.distance_to_coast}km to coast • {village.elevation}m elev
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${priorityBadge.bg}`}
                    >
                      {village.priority_level}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold font-mono px-2 py-0.5 rounded border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}
                      >
                        {risk.overallRisk}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {riskLevel}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-200">
                    <div>{formatIndianNumber(village.population)}</div>
                    <div className="text-[10px] text-slate-400">
                      {village.elderly_population + village.children_population} vuln
                    </div>
                  </td>

                  <td className="py-3 px-3 text-cyan-300">
                    <div>{village.flood_probability}% prob</div>
                    <div className="text-[10px] text-slate-400">
                      ~{village.estimated_water_depth.toFixed(1)}m water depth
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    {shelterOpt.isRerouted ? (
                      <div className="text-red-400 text-[11px] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                        <span>Rerouted: Shelter B</span>
                      </div>
                    ) : (
                      <div className="text-emerald-400 text-[11px]">
                        {shelterOpt.assignedShelter.name.split('(')[0]}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
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
                      Explain &gt;
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
