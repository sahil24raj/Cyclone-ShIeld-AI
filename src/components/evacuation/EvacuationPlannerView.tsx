import React, { useState } from 'react';
import {
  Navigation,
  AlertOctagon,
  Home,
  CheckCircle2,
  Clock,
  ArrowRight,
  Users,
  Bus,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  XCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
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
  const [selectedVillageId, setSelectedVillageId] = useState<string>('vil-01'); // Default to Coastal Ward 7
  const [compareAlternativesOpen, setCompareAlternativesOpen] = useState<boolean>(false);

  const { villages, shelters, routes, p0Population, p1Population } = simulationSummary;

  const totalShelterCapacity = shelters.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const totalShelterOccupied = shelters.reduce((acc, s) => acc + (s.currentOccupancy || 0), 0);
  const remainingSafeCapacity = Math.max(0, totalShelterCapacity - totalShelterOccupied);
  const blockedRoutesCount = routes.filter(
    (r) => r.calculatedStatus === 'Blocked' || r.calculatedStatus === 'At risk' || r.status === 'blocked' || r.status === 'flooded'
  ).length;
  const safeSheltersCount = shelters.filter((s) => s.calculatedStatus === 'operational').length;

  const filteredVillages = villages.filter(
    (v) => filterPriority === 'all' || v.evacuation.evacuationPriority === filterPriority
  );

  const selectedVillage = villages.find((v) => v.id === selectedVillageId) || villages[0];

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1700px] mx-auto font-sans select-none text-slate-100">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Navigation className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-bold">
              Evacuation Operations Matrix
            </span>
            <span className="bg-navy-950 border border-navy-750 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
              Deterministic Routing Model
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Vulnerability-Ranked Evacuation &amp; Sanctuary Allocation
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Turn storm surge depth and road submergence estimates into verified safe sanctuary assignments.
          </p>
        </div>

        {/* Priority Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-navy-950 p-1.5 rounded-xl border border-navy-800 font-mono text-xs">
          <button
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'all'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Wards ({villages.length})
          </button>
          <button
            onClick={() => setFilterPriority('P0')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'P0'
                ? 'bg-red-600 text-white font-bold shadow'
                : 'text-red-400 hover:text-red-300'
            }`}
          >
            P0: Immediate
          </button>
          <button
            onClick={() => setFilterPriority('P1')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'P1'
                ? 'bg-orange-600 text-white font-bold shadow'
                : 'text-orange-400 hover:text-orange-300'
            }`}
          >
            P1: &lt; 6h
          </button>
          <button
            onClick={() => setFilterPriority('P2')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'P2'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            P2: Standby
          </button>
        </div>
      </div>

      {/* TOP SECTION: Evacuation Readiness Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-navy-900/90 border-t-2 border-t-red-500 border border-navy-750 p-3.5 rounded-xl shadow">
          <div className="text-[11px] font-mono text-slate-400 uppercase">P0 Population (Now)</div>
          <div className="text-2xl font-black text-red-400 mt-1 font-mono">
            {formatIndianNumber(p0Population)}
          </div>
          <div className="text-[10px] text-red-300/80 mt-0.5">Immediate evacuation</div>
        </div>

        <div className="bg-navy-900/90 border-t-2 border-t-orange-500 border border-navy-750 p-3.5 rounded-xl shadow">
          <div className="text-[11px] font-mono text-slate-400 uppercase">P1 Population (&lt;6h)</div>
          <div className="text-2xl font-black text-orange-400 mt-1 font-mono">
            {formatIndianNumber(p1Population)}
          </div>
          <div className="text-[10px] text-orange-300/80 mt-0.5">High surge risk</div>
        </div>

        <div className="bg-navy-900/90 border-t-2 border-t-teal-500 border border-navy-750 p-3.5 rounded-xl shadow">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Shelters Available</div>
          <div className="text-2xl font-black text-teal-300 mt-1 font-mono">
            {safeSheltersCount} <span className="text-sm font-normal text-slate-400">/ {shelters.length}</span>
          </div>
          <div className="text-[10px] text-teal-300/80 mt-0.5">Fully operational</div>
        </div>

        <div className="bg-navy-900/90 border-t-2 border-t-cyan-500 border border-navy-750 p-3.5 rounded-xl shadow">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Remaining Safe Capacity</div>
          <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
            {formatIndianNumber(remainingSafeCapacity)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Available beds</div>
        </div>

        <div className="bg-navy-900/90 border-t-2 border-t-amber-500 border border-navy-750 p-3.5 rounded-xl shadow">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Unsafe / Blocked Routes</div>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
            {blockedRoutesCount} <span className="text-sm font-normal text-slate-400">/ {routes.length}</span>
          </div>
          <div className="text-[10px] text-amber-300/80 mt-0.5">Flooded or high risk</div>
        </div>

        <div className="bg-navy-900/90 border-t-2 border-t-indigo-500 border border-navy-750 p-3.5 rounded-xl shadow">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Est. Completion Time</div>
          <div className="text-2xl font-black text-indigo-300 mt-1 font-mono">
            ~4.5 hrs
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Before peak landfall</div>
        </div>
      </div>

      {/* MAIN CONTENT: Split 3-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: Prioritized Village List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Prioritized Village Queue ({filteredVillages.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Click to inspect plan</span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredVillages.map((village) => {
              const isSelected = selectedVillage.id === village.id;
              const isP0 = village.evacuation.evacuationPriority === 'P0';
              const isP1 = village.evacuation.evacuationPriority === 'P1';

              const priorityColor = isP0
                ? 'border-l-red-500 bg-red-950/20'
                : isP1
                ? 'border-l-orange-500 bg-orange-950/20'
                : 'border-l-amber-500 bg-amber-950/10';

              return (
                <div
                  key={village.id}
                  onClick={() => setSelectedVillageId(village.id)}
                  className={`p-3.5 rounded-xl border-l-4 border-y border-r transition-all cursor-pointer ${priorityColor} ${
                    isSelected
                      ? 'border-cyan-400 bg-navy-800/90 shadow-lg shadow-cyan-950/30'
                      : 'border-navy-750 hover:border-navy-600 bg-navy-900/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{village.name}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isP0
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : isP1
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {village.evacuation.evacuationPriority}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 font-mono">
                        People to move: <b className="text-white">{formatIndianNumber(village.population)}</b> • Risk: <b className={isP0 ? 'text-red-400' : 'text-orange-400'}>{village.risk.overallRisk}/100</b>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">Deadline</span>
                      <span className={`text-xs font-mono font-bold ${isP0 ? 'text-red-400' : 'text-amber-300'}`}>
                        {isP0 ? 'T-20h (Immediate)' : 'T-18h (<6h)'}
                      </span>
                    </div>
                  </div>

                  {/* Route & Shelter Summary Strip */}
                  <div className="mt-2.5 pt-2.5 border-t border-navy-800/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Home className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span className="truncate">{village.evacuation.nearestRecommendedShelter.name}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-slate-300">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          village.evacuation.routeStatus === 'Safe'
                            ? 'bg-teal-400'
                            : village.evacuation.routeStatus === 'Caution'
                            ? 'bg-amber-400'
                            : 'bg-red-500'
                        }`}
                      />
                      <span className="text-[10px] font-mono">{village.evacuation.routeStatus} Route</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTRE: Route & Shelter Visual Flow Architecture (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Evacuation Corridor Flow</span>
            </h3>
            <span className="text-[11px] font-mono text-teal-300">Active Routing Graph</span>
          </div>

          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-4 shadow-xl">
            {/* Step 1: Origin Village */}
            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold mb-1">
                1. Origin Hazard Zone
              </div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-base">{selectedVillage.name}</div>
                <span className="text-xs font-mono text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-800">
                  Surge: {selectedVillage.evacuation.estimatedFloodDepthMeters.toFixed(1)}m
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 font-mono">
                Pop: {formatIndianNumber(selectedVillage.population)} ({selectedVillage.elderlyPopulation} elderly, {selectedVillage.childrenPopulation} children)
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center">
              <div className="h-6 w-0.5 bg-cyan-500/40 relative">
                <ArrowRight className="w-4 h-4 text-cyan-400 absolute -bottom-2 -left-1.5 rotate-90" />
              </div>
            </div>

            {/* Step 2: Transit Corridor */}
            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800">
              <div className="text-[10px] font-mono text-teal-400 uppercase tracking-wider font-bold mb-1">
                2. Designated Evacuation Corridor
              </div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-base">{selectedVillage.evacuation.recommendedRouteName}</div>
                <span className="text-xs font-mono text-teal-300 bg-teal-950/50 px-2 py-0.5 rounded border border-teal-800">
                  {selectedVillage.evacuation.routeStatus}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Estimated transit duration: <b className="text-white">{selectedVillage.evacuation.estimatedTravelTimeMinutes || 35} mins</b>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center">
              <div className="h-6 w-0.5 bg-teal-500/40 relative">
                <ArrowRight className="w-4 h-4 text-teal-400 absolute -bottom-2 -left-1.5 rotate-90" />
              </div>
            </div>

            {/* Step 3: Destination Shelter */}
            <div className="bg-navy-950 p-3.5 rounded-xl border border-teal-600/40">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold mb-1">
                3. Verified Safe Sanctuary
              </div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-300 text-base">{selectedVillage.evacuation.nearestRecommendedShelter.name}</div>
                <span className="text-xs font-mono text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                  Capacity Safe
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 font-mono">
                Available space: <b className="text-white">{selectedVillage.evacuation.shelterCapacityStatus.availableBeds.toLocaleString()} beds</b> (Elev: {selectedVillage.evacuation.nearestRecommendedShelter.elevationMeters}m)
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => {
                setSelectedVillage(selectedVillage);
                setSelectedAsset(null);
                setActiveTab('map');
              }}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Track Corridor on Live Impact Map</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Selected Evacuation Plan Detail (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evacuation Directive Detail</span>
            </h3>
            <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/40">
              Official Directive
            </span>
          </div>

          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-4 shadow-xl">
            {/* Header info */}
            <div className="border-b border-navy-800 pb-3">
              <h4 className="text-lg font-black text-white">{selectedVillage.name}</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Comprehensive multi-agency logistics directive for field incident commanders.
              </p>
            </div>

            {/* 7 Item Structured Directive */}
            <div className="space-y-3 text-xs">
              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 flex items-start gap-2.5">
                <Users className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">1. People to Evacuate</div>
                  <div className="text-white font-bold font-mono text-sm mt-0.5">
                    {formatIndianNumber(selectedVillage.population)} residents
                  </div>
                </div>
              </div>

              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">2. Priority &amp; Timeline</div>
                  <div className="text-red-400 font-bold font-mono text-sm mt-0.5">
                    {selectedVillage.evacuation.evacuationPriority} — {selectedVillage.evacuation.evacuationPriority === 'P0' ? 'Start Immediately (Within 90 mins)' : 'Initiate within 6 hours'}
                  </div>
                </div>
              </div>

              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">3. Threat Rationale</div>
                  <div className="text-slate-200 mt-0.5">
                    Critical storm surge of ~{selectedVillage.evacuation.estimatedFloodDepthMeters.toFixed(1)}m and {selectedVillage.evacuation.floodProbabilityPct}% flood probability.
                  </div>
                </div>
              </div>

              {/* 4. Rejected Option */}
              {selectedVillage.evacuation.rejectedNearestShelter ? (
                <div className="bg-red-950/30 p-2.5 rounded-xl border border-red-800/60 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-red-300 uppercase font-bold">4. Rejected Nearest Option</div>
                    <div className="text-red-200 font-bold mt-0.5">
                      {selectedVillage.evacuation.rejectedNearestShelter.shelter.name}
                    </div>
                    <div className="text-[11px] text-red-300/90 mt-0.5 font-sans">
                      <b>Reason:</b> {selectedVillage.evacuation.rejectedNearestShelter.reason}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">4. Primary Option Status</div>
                    <div className="text-slate-200 mt-0.5">
                      Nearest primary shelter verified safe with no route inundation.
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Recommended Shelter */}
              <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/60 flex items-start gap-2.5">
                <Home className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-mono text-emerald-300 uppercase font-bold">5. Recommended Safe Shelter</div>
                  <div className="text-emerald-200 font-bold mt-0.5">
                    {selectedVillage.evacuation.nearestRecommendedShelter.name}
                  </div>
                  <div className="text-[11px] text-emerald-300/90 mt-0.5 font-mono">
                    Available verified capacity: {selectedVillage.evacuation.shelterCapacityStatus.availableBeds.toLocaleString()} spaces
                  </div>
                </div>
              </div>

              {/* 6. Recommended Route */}
              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">6. Recommended Route</div>
                  <div className="text-white font-bold mt-0.5">
                    {selectedVillage.evacuation.recommendedRouteName}
                  </div>
                  <div className="text-[11px] text-teal-300 mt-0.5 font-mono">
                    Status: {selectedVillage.evacuation.routeStatus} (Clear of surge zone)
                  </div>
                </div>
              </div>

              {/* 7. Action Command */}
              <div className="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-800/60 flex items-start gap-2.5">
                <Bus className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-mono text-indigo-300 uppercase font-bold">7. Resource Action Order</div>
                  <div className="text-slate-100 font-semibold mt-0.5">
                    Deploy 12 state transit buses and 4 medical-support vehicles within 90 minutes.
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable "Compare alternatives" component */}
            <div className="border-t border-navy-800 pt-3">
              <button
                onClick={() => setCompareAlternativesOpen(!compareAlternativesOpen)}
                className="w-full flex items-center justify-between text-xs font-mono text-slate-300 hover:text-cyan-400 transition py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Compare Alternative Shelter Corridors</span>
                </span>
                {compareAlternativesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {compareAlternativesOpen && (
                <div className="mt-2.5 space-y-2 bg-navy-950 p-3 rounded-xl border border-navy-800 text-[11px]">
                  <div className="grid grid-cols-5 text-[10px] font-mono text-slate-400 pb-1 border-b border-navy-800">
                    <div>Option</div>
                    <div>Travel</div>
                    <div>Safety</div>
                    <div>Capacity</div>
                    <div>Route Condition</div>
                  </div>

                  <div className="grid grid-cols-5 text-slate-200 py-1 items-center font-mono">
                    <div className="font-bold text-emerald-400 truncate">Shelter B (Primary)</div>
                    <div>32 min</div>
                    <div className="text-emerald-400">High (95%)</div>
                    <div>1,120 beds</div>
                    <div className="text-teal-300">Elevated (Dry)</div>
                  </div>

                  <div className="grid grid-cols-5 text-slate-400 py-1 items-center font-mono border-t border-navy-850">
                    <div className="truncate">Shelter C (East)</div>
                    <div>55 min (+23m)</div>
                    <div className="text-amber-400">Moderate</div>
                    <div>650 beds</div>
                    <div className="text-amber-300">Bridge Congested</div>
                  </div>

                  <div className="grid grid-cols-5 text-red-400/80 py-1 items-center font-mono border-t border-navy-850">
                    <div className="truncate">Shelter A (Nearest)</div>
                    <div>15 min</div>
                    <div className="text-red-400 font-bold">Unsafe</div>
                    <div>800 beds</div>
                    <div className="text-red-400">Road Inundated (1.4m)</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
