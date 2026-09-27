import React, { useState } from 'react';
import {
  Navigation,
  AlertOctagon,
  Home,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users,
  Bus,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  HelpCircle,
  XCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { PriorityBadge, RiskBadge } from '../ui/RiskBadge';
import { formatIndianNumber } from '../../utils/formatters';
import { useAppState } from '../../context/AppStateContext';

export const EvacuationPlannerView: React.FC = () => {
  const {
    simulationSummary,
    setSelectedVillage,
    setSelectedAsset,
    setActiveTab,
  } = useAppState();

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedVillageCard, setSelectedVillageCard] = useState<string | null>(null);

  const { villages, shelters, routes, p0Population, p1Population } = simulationSummary;

  const filteredVillages = villages.filter(
    (v) => filterPriority === 'all' || v.evacuation.evacuationPriority === filterPriority
  );

  // Shelter capacity chart data
  const shelterChartData = shelters.map((s) => ({
    name: s.name.replace('Cyclone Shelter ', 'Sh ').replace('Community Hall Shelter ', 'Sh ').replace('Relief Shelter ', 'Sh '),
    Occupied: s.currentOccupancy || 0,
    Available: Math.max(0, (s.capacity || 0) - (s.currentOccupancy || 0)),
    isBlocked: s.calculatedStatus === 'isolated' || s.calculatedStatus === 'at_risk',
  }));

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1650px] mx-auto font-sans select-none">
      {/* Page Header Banner */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              <Navigation className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
              Dynamic Evacuation Optimization Engine
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Vulnerability-Ranked Evacuation &amp; Dynamic Shelter Assignment
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Deterministic routing automatically rejects flooded or blocked corridors and redirects vulnerable populations to elevated, capacity-verified sanctuaries.
          </p>
        </div>

        {/* Priority Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-navy-950 p-1.5 rounded-xl border border-navy-800 self-start md:self-auto font-mono text-xs">
          <button
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'all'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Wards ({villages.length})
          </button>
          <button
            onClick={() => setFilterPriority('P0')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'P0'
                ? 'bg-red-600 text-white font-bold'
                : 'text-red-400 hover:text-red-300'
            }`}
          >
            P0: Immediate
          </button>
          <button
            onClick={() => setFilterPriority('P1')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'P1'
                ? 'bg-orange-600 text-white font-bold'
                : 'text-orange-400 hover:text-orange-300'
            }`}
          >
            P1: &lt; 6 Hours
          </button>
          <button
            onClick={() => setFilterPriority('P2')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'P2'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            P2: Prepare
          </button>
        </div>
      </div>

      {/* Mandatory Demo Showcase: Coastal Ward 7 Dynamic Re-routing Callout */}
      <div className="bg-gradient-to-r from-red-950/60 via-navy-900 to-navy-900 border-l-4 border-red-500 border-y border-r border-navy-750 p-4 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-red-300 font-mono">
                Mandatory Demo Case — Coastal Ward 7 Reroute Directive
              </h4>
              <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2 py-0.2 rounded border border-red-500/40">
                P0 IMMEDIATE
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              “Shelter A is geographically closer, but its access road is projected to flood. Shelter B is assigned through Elevated Route 2 because it remains accessible and has available capacity.”
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const w7 = villages.find((v) => v.id === 'vil-01');
            if (w7) {
              setSelectedVillage(w7);
              setSelectedAsset(null);
              setActiveTab('command');
            }
          }}
          className="flex-shrink-0 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
        >
          <span>Examine on GIS Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Evacuation Master Matrix Table */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-navy-750 bg-navy-950/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Village Evacuation Matrix &amp; Safe Shelter Routing</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Model Estimate • P0 Population: {formatIndianNumber(p0Population)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 font-mono text-[10px] uppercase bg-navy-950/40">
                <th className="py-3 px-3.5">Priority</th>
                <th className="py-3 px-3.5">Village / Ward</th>
                <th className="py-3 px-3.5">Population &amp; Vulnerability</th>
                <th className="py-3 px-3.5">Flood &amp; Surge Exposure</th>
                <th className="py-3 px-3.5">Assigned Safe Shelter</th>
                <th className="py-3 px-3.5">Evacuation Corridor &amp; Status</th>
                <th className="py-3 px-3.5">Transit Time</th>
                <th className="py-3 px-3.5 text-right">GIS Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono">
              {filteredVillages.map((village) => {
                const { risk, evacuation } = village;
                const isSelected = selectedVillageCard === village.id;

                return (
                  <React.Fragment key={village.id}>
                    <tr
                      onClick={() =>
                        setSelectedVillageCard((prev) => (prev === village.id ? null : village.id))
                      }
                      className="hover:bg-navy-850/60 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-3.5">
                        <PriorityBadge priority={evacuation.evacuationPriority} size="sm" />
                      </td>

                      <td className="py-3.5 px-3.5 font-sans">
                        <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{village.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Risk: <b className="text-red-400">{risk.overallRisk}/100</b> ({risk.riskClass}) • Elev {village.elevationMeters}m
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-slate-200 font-sans">
                        <div className="font-semibold">{formatIndianNumber(village.population)}</div>
                        <div className="text-[10px] text-orange-400 font-mono">
                          {village.elderlyPopulation} elderly + {village.childrenPopulation} children
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-cyan-300">
                        <div>{evacuation.floodProbabilityPct}% Flood Prob</div>
                        <div className="text-[10px] text-slate-400">
                          ~{evacuation.estimatedFloodDepthMeters.toFixed(1)}m water depth
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5">
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5 font-sans">
                          <Home className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>{evacuation.nearestRecommendedShelter.name}</span>
                        </div>
                        {evacuation.rejectedNearestShelter ? (
                          <div className="text-[10px] text-red-400 font-bold mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                            <span>Rerouted: {evacuation.rejectedNearestShelter.shelter.name.split(' ')[0]} Unsafe</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-emerald-400 mt-0.5">
                            Vacancy: {evacuation.shelterCapacityStatus.availableBeds.toLocaleString()} beds
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3.5">
                        <div className="text-slate-200 font-sans font-medium">
                          {evacuation.recommendedRouteName}
                        </div>
                        <div className="text-[10px] font-mono mt-0.5">
                          <span
                            className={
                              evacuation.routeStatus === 'Safe'
                                ? 'text-emerald-400'
                                : evacuation.routeStatus === 'Caution'
                                ? 'text-amber-400'
                                : evacuation.routeStatus === 'At risk'
                                ? 'text-orange-400'
                                : 'text-red-400 font-bold'
                            }
                          >
                            ● Route Status: {evacuation.routeStatus.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-cyan-300">
                        ~{evacuation.estimatedTravelTimeMinutes} mins
                      </td>

                      <td className="py-3.5 px-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVillage(village);
                            setSelectedAsset(null);
                            setActiveTab('command');
                          }}
                          className="text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-200 group-hover:underline"
                        >
                          Inspect &gt;
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Explanation Drawer */}
                    {isSelected && (
                      <tr className="bg-navy-950 border-b border-navy-800">
                        <td colSpan={8} className="p-4 space-y-2.5">
                          <div className="bg-navy-900 p-3 rounded-xl border border-navy-750 text-xs text-slate-200 space-y-2">
                            <div className="flex items-center justify-between border-b border-navy-800 pb-1.5">
                              <div className="font-bold text-amber-300 font-mono flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                <span>Shelter Optimization &amp; Routing Decision Logic:</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">
                                Confidence: {risk.modelConfidencePct}% • Updated {new Date(risk.lastUpdatedTimestamp).toLocaleTimeString('en-IN')}
                              </span>
                            </div>

                            <p className="leading-relaxed font-sans">
                              {evacuation.shelterAssignmentExplanation}
                            </p>

                            <div className="pt-2 border-t border-navy-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                              <div className="text-slate-400">
                                <strong>Recommended Action:</strong> {evacuation.recommendedAction}
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedVillage(village);
                                  setSelectedAsset(null);
                                  setActiveTab('command');
                                }}
                                className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-lg font-bold transition-colors"
                              >
                                View in Command Centre &gt;
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shelter Capacity & Corridor Logistics Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recharts Shelter Capacity Graph */}
        <div className="lg:col-span-2 bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-navy-750 pb-2">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Multi-Purpose Cyclone Shelter Occupancy &amp; Vacancy
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              4 Designated Sanctuaries
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shelterChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="Occupied" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Available" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Corridor Fleet Status */}
        <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-navy-750 pb-2">
            <Bus className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white font-mono">
              Evacuation Corridor Status
            </h3>
          </div>

          <div className="space-y-2 font-mono text-xs text-slate-300">
            {routes.map((rt) => (
              <div
                key={rt.id}
                className="bg-navy-850 p-2 rounded-lg border border-navy-750 flex items-center justify-between"
              >
                <div>
                  <div className="font-sans font-bold text-white text-[11px]">{rt.name}</div>
                  <div className="text-[9px] text-slate-400">{rt.distanceKm} km • Elev {rt.elevationAvg}m</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rt.calculatedStatus === 'Safe'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : rt.calculatedStatus === 'Caution'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : rt.calculatedStatus === 'At risk'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {rt.calculatedStatus.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('command')}
            className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs py-2 rounded-lg transition-colors font-semibold flex items-center justify-center gap-1.5"
          >
            <span>Inspect Routes On GIS Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
