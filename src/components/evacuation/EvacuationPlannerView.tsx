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
  MapPin
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
import { MOCK_VILLAGES } from '../../data/villageData';
import { MOCK_SHELTERS } from '../../data/infrastructureData';
import { MOCK_EVACUATION_ROUTES, EVACUATION_SUMMARY } from '../../data/evacuationData';
import { calculateVillageRisk, getRiskLevel } from '../../utils/riskCalculator';
import { optimizeShelterAssignment } from '../../utils/shelterOptimizer';
import { PriorityBadge, RiskBadge } from '../ui/RiskBadge';
import { formatIndianNumber } from '../../utils/formatters';
import { useAppState } from '../../context/AppStateContext';

export const EvacuationPlannerView: React.FC = () => {
  const { simulationParams, setSelectedVillage, setSelectedAsset, setActiveTab } = useAppState();
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const villageRows = MOCK_VILLAGES.map((v) => {
    const risk = calculateVillageRisk(v, simulationParams);
    const shelterOpt = optimizeShelterAssignment(v);

    let departureDeadline = 'Immediate (T-24h to T-18h)';
    if (v.priority_level === 'P1') departureDeadline = 'Before T-12h';
    if (v.priority_level === 'P2') departureDeadline = 'Standby (T-06h)';
    if (v.priority_level === 'P3') departureDeadline = 'Shelter in Place';

    return {
      village: v,
      risk,
      shelterOpt,
      departureDeadline,
    };
  }).filter((row) => filterPriority === 'all' || row.village.priority_level === filterPriority);

  // Shelter capacity chart data
  const shelterChartData = MOCK_SHELTERS.map((s) => ({
    name: s.name.split('(')[0].replace('Shelter ', 'Sh '),
    Occupied: s.current_occupancy,
    Available: Math.max(0, s.capacity - s.current_occupancy),
    isBlocked: s.access_road_status === 'blocked',
  }));

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1650px] mx-auto font-sans">
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
            Vulnerability-Ranked Evacuation &amp; Shelter Routing
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            AI-driven shelter routing penalizes flooded highways and dynamically redirects vulnerable coastal populations to elevated cyclone sanctuaries.
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
            All Wards (8)
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

      {/* Highlights / Special Case Callout */}
      <div className="bg-gradient-to-r from-red-950/40 via-navy-900 to-navy-900 border-l-4 border-red-500 border-y border-r border-navy-750 p-4 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-300 font-mono">
              Active Optimization Exception: Coastal Ward 7 Rerouted
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
              <strong>Shelter A is closest (5.8 km)</strong>, but the access road (SH-12) is projected to flood under 0.8m storm surge backflow. The algorithm has assigned this village to <strong>Shelter B (Sundar Model High School Complex)</strong> through <strong>Elevated Corridor 2 (Puri-Sundar Bypass)</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const w7 = MOCK_VILLAGES.find(v => v.id === 'vil-01');
            if (w7) {
              setSelectedVillage(w7);
              setSelectedAsset(null);
              setActiveTab('command');
            }
          }}
          className="flex-shrink-0 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
        >
          <span>Examine Ward 7 on GIS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Evacuation Master Table */}
      <div className="bg-navy-900 border border-navy-750 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-navy-750 bg-navy-950/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Evacuation Matrix &amp; Transport Allocation</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            P0 Target Population: {formatIndianNumber(EVACUATION_SUMMARY.p0Population)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 font-mono text-[10px] uppercase bg-navy-950/40">
                <th className="py-3 px-3.5">Priority</th>
                <th className="py-3 px-3.5">Village / Ward</th>
                <th className="py-3 px-3.5">Population &amp; Vulnerable</th>
                <th className="py-3 px-3.5">Assigned Safe Shelter</th>
                <th className="py-3 px-3.5">Route &amp; Bottleneck Status</th>
                <th className="py-3 px-3.5">Transit Time</th>
                <th className="py-3 px-3.5">Departure Window</th>
                <th className="py-3 px-3.5 text-right">GIS Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono">
              {villageRows.map(({ village, risk, shelterOpt, departureDeadline }) => {
                const riskLevel = getRiskLevel(risk.overallRisk);

                return (
                  <tr
                    key={village.id}
                    onClick={() => {
                      setSelectedVillage(village);
                      setSelectedAsset(null);
                      setActiveTab('command');
                    }}
                    className="hover:bg-navy-850/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-3.5">
                      <PriorityBadge priority={village.priority_level} size="sm" />
                    </td>

                    <td className="py-3.5 px-3.5 font-sans">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{village.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Risk Score: <b className="text-red-400">{risk.overallRisk}/100</b> • Elev {village.elevation}m
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5 text-slate-200 font-sans">
                      <div className="font-semibold">{formatIndianNumber(village.population)}</div>
                      <div className="text-[10px] text-orange-400 font-mono">
                        {village.elderly_population} elderly + {village.children_population} children
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{shelterOpt.assignedShelter.name.split('(')[0]}</span>
                      </div>
                      {shelterOpt.isRerouted ? (
                        <div className="text-[10px] text-red-400 font-bold mt-0.5">
                          ⚠ Rerouted from {shelterOpt.originalShelter?.name.split('(')[0]}
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-400 mt-0.5">
                          Capacity Vacancy: {shelterOpt.availableCapacity} beds
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3.5">
                      <div className="text-slate-200 font-sans font-medium">
                        {shelterOpt.recommendedCorridor}
                      </div>
                      <div className="text-[10px] font-mono mt-0.5">
                        {village.is_road_submerged ? (
                          <span className="text-red-400 font-bold">
                            Primary Cutoff • Using Elevated Bypass
                          </span>
                        ) : (
                          <span className="text-emerald-400">
                            Road Clear &amp; Monitored
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5 text-cyan-300">
                      ~{shelterOpt.estimatedTransitTimeMin} mins
                    </td>

                    <td className="py-3.5 px-3.5 text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {departureDeadline}
                      </span>
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
                        Inspect on GIS &gt;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shelter Capacity & Logistics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recharts Shelter Capacity Graph */}
        <div className="lg:col-span-2 bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-navy-750 pb-2">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Multi-Purpose Cyclone Shelter Occupancy &amp; Deficit
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Total Shelters: 68 • Capacity: 1.92 Lakh
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

        {/* Transport Fleet & Logistic Readiness */}
        <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-navy-750 pb-2">
            <Bus className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white font-mono">
              Pre-Positioned Transport Fleet
            </h3>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="bg-navy-850 p-2.5 rounded-lg border border-navy-750 flex items-center justify-between">
              <span className="text-slate-300">State Transport Buses:</span>
              <span className="text-white font-bold">{EVACUATION_SUMMARY.transportFleetAssigned.busesStateTransport} units</span>
            </div>
            <div className="bg-navy-850 p-2.5 rounded-lg border border-navy-750 flex items-center justify-between">
              <span className="text-slate-300">Tractors &amp; High Trailers:</span>
              <span className="text-white font-bold">{EVACUATION_SUMMARY.transportFleetAssigned.tractorsAndTrailers} units</span>
            </div>
            <div className="bg-navy-850 p-2.5 rounded-lg border border-navy-750 flex items-center justify-between">
              <span className="text-slate-300">Amphibious Rescue Craft:</span>
              <span className="text-cyan-300 font-bold">{EVACUATION_SUMMARY.transportFleetAssigned.amphibiousRescueCraft} units</span>
            </div>
            <div className="bg-navy-850 p-2.5 rounded-lg border border-navy-750 flex items-center justify-between">
              <span className="text-slate-300">NDRF Inflatable Boats:</span>
              <span className="text-emerald-400 font-bold">{EVACUATION_SUMMARY.transportFleetAssigned.ndrfInflatableBoats} boats</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('command')}
            className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs py-2 rounded-lg transition-colors font-semibold flex items-center justify-center gap-1.5"
          >
            <span>Inspect Evacuation Corridors on GIS Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
