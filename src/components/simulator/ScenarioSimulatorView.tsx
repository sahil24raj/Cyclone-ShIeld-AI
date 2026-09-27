import React, { useState } from 'react';
import {
  Sliders,
  Wind,
  CloudRain,
  Waves,
  Compass,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Users,
  Building2,
  Navigation,
  CheckCircle2,
  Save,
  SplitSquareVertical,
  Info,
  TrendingUp,
  AlertTriangle,
  AlertOctagon,
  Layers
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { DEFAULT_SCENARIO_INPUTS, BASE_STORM_SCENARIO } from '../../data/mockStorm';
import { formatIndianNumber } from '../../utils/formatters';

export const ScenarioSimulatorView: React.FC = () => {
  const {
    scenarioInputs,
    setScenarioInputs,
    resetScenarioInputs,
    simulationSummary,
    setActiveTab,
  } = useAppState();

  const [explanationOpen, setExplanationOpen] = useState<boolean>(true);
  const [snapshotSaved, setSnapshotSaved] = useState<boolean>(false);

  const {
    windSpeedKmh,
    rainfallMm,
    stormSurgeMeters,
    trackShiftKm,
    landfallHours,
  } = scenarioInputs;

  // Presets
  const applyPreset = (type: 'baseline' | 'north30' | 'superCyclone' | 'southTrack') => {
    switch (type) {
      case 'baseline':
        resetScenarioInputs();
        break;
      case 'north30':
        setScenarioInputs({
          windSpeedKmh: 145,
          rainfallMm: 225,
          stormSurgeMeters: 2.4,
          trackShiftKm: 30,
          landfallHours: 20,
        });
        break;
      case 'superCyclone':
        setScenarioInputs({
          windSpeedKmh: 205,
          rainfallMm: 340,
          stormSurgeMeters: 3.8,
          trackShiftKm: 15,
          landfallHours: 14,
        });
        break;
      case 'southTrack':
        setScenarioInputs({
          windSpeedKmh: 110,
          rainfallMm: 120,
          stormSurgeMeters: 1.2,
          trackShiftKm: -40,
          landfallHours: 32,
        });
        break;
    }
  };

  // Meaningful Deltas vs Baseline
  const baselineCritical = 3;
  const currentCritical = simulationSummary.criticalVillagesCount;
  const deltaCritical = currentCritical - baselineCritical;

  const baselineAssetsAtRisk = 4;
  const currentAssetsAtRisk = simulationSummary.criticalAssetsAtRiskCount;
  const deltaAssets = currentAssetsAtRisk - baselineAssetsAtRisk;

  const baselineRoadsAtRisk = 2;
  const currentRoadsAtRisk = simulationSummary.roadsAtRiskCount;
  const deltaRoads = currentRoadsAtRisk - baselineRoadsAtRisk;

  const baselineShelterGap = 0;
  const currentShelterGap = simulationSummary.shelterCapacityGap;
  const deltaShelterGap = currentShelterGap - baselineShelterGap;

  const baselinePopExposed = 145000;
  const currentPopExposed = simulationSummary.totalPopulationExposed;
  const deltaPopExposed = currentPopExposed - baselinePopExposed;

  // Causal explanation generator
  const getCausalExplanation = () => {
    if (trackShiftKm > 0) {
      return `Risk increased significantly in northern settlements because the storm track shifted ${trackShiftKm} km north, placing low-elevation coastal wards and Sundar District Hospital closer to the peak surge quadrant. Peak surge of ${stormSurgeMeters.toFixed(1)}m will inundate 3 additional road corridors.`;
    }
    if (trackShiftKm < 0) {
      return `Risk decreased slightly for northern wards as the track shifted ${Math.abs(trackShiftKm)} km south towards the uninhabited mangrove estuary, reducing direct hospital flood exposure.`;
    }
    if (windSpeedKmh > 160 || stormSurgeMeters > 2.5) {
      return `Severe intensity upgrade: With surge elevated to ${stormSurgeMeters.toFixed(1)}m and wind shear at ${windSpeedKmh} km/h, secondary embankments are breached, adding ${currentCritical} settlements into mandatory P0 evacuation.`;
    }
    return `Baseline Scenario: Cyclone Varuna is on standard trajectory heading towards Sundar Coast District with 135 km/h peak winds and 1.8m surge at T-24h.`;
  };

  const isShiftedFromBaseline =
    windSpeedKmh !== DEFAULT_SCENARIO_INPUTS.windSpeedKmh ||
    rainfallMm !== DEFAULT_SCENARIO_INPUTS.rainfallMm ||
    stormSurgeMeters !== DEFAULT_SCENARIO_INPUTS.stormSurgeMeters ||
    trackShiftKm !== DEFAULT_SCENARIO_INPUTS.trackShiftKm ||
    landfallHours !== DEFAULT_SCENARIO_INPUTS.landfallHours;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1700px] mx-auto font-sans select-none text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
              Dynamic Scenario Simulator
            </span>
            <span className="bg-navy-950 border border-navy-750 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
              Decision Stress-Testing
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            What If the Cyclone Changes?
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Test track shifts, intensity spikes, and early landfall to evaluate readiness and surge vulnerability.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('baseline')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
              !isShiftedFromBaseline
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
            }`}
          >
            Baseline Varuna
          </button>
          <button
            onClick={() => applyPreset('north30')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
              trackShiftKm === 30
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 font-bold'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
            }`}
          >
            +30km North Track
          </button>
          <button
            onClick={() => applyPreset('superCyclone')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
              windSpeedKmh > 200
                ? 'bg-red-600/30 text-red-300 border-red-500/50 font-bold'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
            }`}
          >
            Super Cyclone Spikes
          </button>
        </div>
      </div>

      {/* 3-ZONE LAYOUT: Controls (Left) | Visual Before/After (Centre) | Impact Deltas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: 5 Labeled Controls (4 Cols) */}
        <div className="lg:col-span-4 bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Simulation Controls</span>
            </h3>
            <button
              onClick={resetScenarioInputs}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          </div>

          {/* Control 1: Wind Speed */}
          <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Peak Sustained Wind Speed</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold text-sm">{windSpeedKmh} km/h</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Modifies building structural damage and roof tear-off probabilities.
            </p>
            <input
              type="range"
              min={90}
              max={250}
              step={5}
              value={windSpeedKmh}
              onChange={(e) => setScenarioInputs((prev) => ({ ...prev, windSpeedKmh: Number(e.target.value) }))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>90 km/h</span>
              <span className="text-slate-400">Baseline: 135 km/h</span>
              <span>250 km/h</span>
            </div>
          </div>

          {/* Control 2: Rainfall */}
          <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                <span>24-Hour Rainfall Accumulation</span>
              </span>
              <span className="font-mono text-blue-300 font-bold text-sm">{rainfallMm} mm</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Drives inland river swelling, low-lying waterlogging, and bridge clearance risk.
            </p>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={rainfallMm}
              onChange={(e) => setScenarioInputs((prev) => ({ ...prev, rainfallMm: Number(e.target.value) }))}
              className="w-full accent-blue-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>50 mm</span>
              <span className="text-slate-400">Baseline: 180 mm</span>
              <span>500 mm</span>
            </div>
          </div>

          {/* Control 3: Storm Surge */}
          <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-teal-400" />
                <span>Astronomical Tide + Surge Depth</span>
              </span>
              <span className="font-mono text-teal-300 font-bold text-sm">{stormSurgeMeters.toFixed(1)} m</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Elevates coastal seawater inundation level over sea defense dikes.
            </p>
            <input
              type="range"
              min={0.5}
              max={6.0}
              step={0.1}
              value={stormSurgeMeters}
              onChange={(e) => setScenarioInputs((prev) => ({ ...prev, stormSurgeMeters: Number(e.target.value) }))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.5 m</span>
              <span className="text-slate-400">Baseline: 1.8 m</span>
              <span>6.0 m</span>
            </div>
          </div>

          {/* Control 4: Track Shift */}
          <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Cross-Track Shift (North / South)</span>
              </span>
              <span className="font-mono text-purple-300 font-bold text-sm">
                {trackShiftKm === 0 ? '0 km (Direct)' : trackShiftKm > 0 ? `+${trackShiftKm} km North` : `${trackShiftKm} km South`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Shifts the maximum surge quadrant relative to district population centers.
            </p>
            <input
              type="range"
              min={-80}
              max={80}
              step={5}
              value={trackShiftKm}
              onChange={(e) => setScenarioInputs((prev) => ({ ...prev, trackShiftKm: Number(e.target.value) }))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-80 km (South)</span>
              <span className="text-slate-400">0 km (Center)</span>
              <span>+80 km (North)</span>
            </div>
          </div>

          {/* Control 5: Landfall Time */}
          <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Time to Landfall (T-Minus)</span>
              </span>
              <span className="font-mono text-amber-300 font-bold text-sm">T–{landfallHours}h</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Compresses or expands the available evacuation window before high winds hit.
            </p>
            <input
              type="range"
              min={6}
              max={48}
              step={2}
              value={landfallHours}
              onChange={(e) => setScenarioInputs((prev) => ({ ...prev, landfallHours: Number(e.target.value) }))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>T-6h</span>
              <span className="text-slate-400">Baseline: T-24h</span>
              <span>T-48h</span>
            </div>
          </div>
        </div>

        {/* CENTRE: Before vs After Scenario Comparison (4 Cols) */}
        <div className="lg:col-span-4 bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
              <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                <SplitSquareVertical className="w-4 h-4 text-cyan-400" />
                <span>Baseline vs Simulated Scenario</span>
              </h3>
              <span className="text-[10px] font-mono text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                Live Diff
              </span>
            </div>

            {/* Baseline Card */}
            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                1. Official Baseline Forecast (T-24h)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Track / Landfall</span>
                  <span className="text-white font-semibold">Central / T-24h</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Peak Wind / Surge</span>
                  <span className="text-cyan-300 font-semibold">135 km/h • 1.8m</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Critical Wards</span>
                  <span className="text-amber-400 font-semibold">3 Wards (P0)</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Shelter Gap</span>
                  <span className="text-teal-400 font-semibold">0 (Full capacity)</span>
                </div>
              </div>
            </div>

            {/* Simulated Card */}
            <div className="bg-purple-950/20 p-3.5 rounded-xl border border-purple-800/60 space-y-2">
              <div className="text-[10px] font-mono text-purple-300 uppercase font-bold">
                2. Simulated Stress Scenario
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Simulated Track</span>
                  <span className="text-purple-300 font-bold">
                    {trackShiftKm === 0 ? '0 km' : `${trackShiftKm > 0 ? '+' : ''}${trackShiftKm} km`} • T–{landfallHours}h
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Simulated Hazard</span>
                  <span className="text-teal-300 font-bold">{windSpeedKmh} km/h • {stormSurgeMeters.toFixed(1)}m</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Critical Wards</span>
                  <span className="text-red-400 font-bold">{currentCritical} Wards (P0)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Shelter Gap</span>
                  <span className={deltaShelterGap > 0 ? 'text-red-400 font-bold' : 'text-teal-400 font-bold'}>
                    {deltaShelterGap > 0 ? `+${formatIndianNumber(deltaShelterGap)} beds` : 'Capacity Safe'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Visual Map Preview */}
            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-center space-y-2">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Geographic Sector Inundation Diff</span>
              </div>
              <div className="h-28 bg-navy-900/90 rounded-lg border border-navy-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="text-center p-2 z-10">
                  <div className="text-xs font-mono text-cyan-300 font-bold">
                    {trackShiftKm > 0 ? 'Northern Lowlands Under Expanded Surge' : trackShiftKm < 0 ? 'Southern Mangroves Absorb Peak Energy' : 'Central Delta Estuary Primary Impact Zone'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {currentAssetsAtRisk} lifelines exposed to depth &gt; 1.0m
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-800">
            <button
              onClick={() => setActiveTab('map')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>View On Live Map</span>
            </button>
            <button
              onClick={() => {
                setSnapshotSaved(true);
                setTimeout(() => setSnapshotSaved(false), 2500);
              }}
              className="bg-navy-950 hover:bg-navy-850 text-slate-300 font-mono text-xs font-bold py-2 rounded-xl border border-navy-800 transition flex items-center justify-center gap-1.5"
            >
              {snapshotSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{snapshotSaved ? 'Snapshot Saved' : 'Save Snapshot'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Meaningful Deltas & Causal Explanation (4 Cols) */}
        <div className="lg:col-span-4 bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
              <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span>Impact of This Change</span>
              </h3>
              <span className="text-[10px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                Dynamic Recalculation
              </span>
            </div>

            {/* 5 Meaningful Delta Chips */}
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5 font-sans">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>High-Risk Villages</span>
                </span>
                <span className={`font-bold ${deltaCritical > 0 ? 'text-red-400' : 'text-teal-300'}`}>
                  {deltaCritical > 0 ? `+${deltaCritical}` : deltaCritical === 0 ? '0' : deltaCritical} Wards ({currentCritical} total)
                </span>
              </div>

              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5 font-sans">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shelter Capacity Deficit</span>
                </span>
                <span className={`font-bold ${deltaShelterGap > 0 ? 'text-red-400' : 'text-teal-300'}`}>
                  {deltaShelterGap > 0 ? `+${formatIndianNumber(deltaShelterGap)} gap` : 'No deficit'}
                </span>
              </div>

              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5 font-sans">
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  <span>Evacuation Corridors at Risk</span>
                </span>
                <span className={`font-bold ${deltaRoads > 0 ? 'text-red-400' : 'text-teal-300'}`}>
                  {deltaRoads > 0 ? `+${deltaRoads} cutoffs` : `${currentRoadsAtRisk} roads`}
                </span>
              </div>

              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5 font-sans">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hospitals in Flood Zone</span>
                </span>
                <span className="font-bold text-red-400">
                  {trackShiftKm > 10 ? '+1 (District Hospital)' : '0 (Perimeter Dry)'}
                </span>
              </div>

              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5 font-sans">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                  <span>Additional Exposed Population</span>
                </span>
                <span className={`font-bold ${deltaPopExposed > 0 ? 'text-orange-400' : 'text-teal-300'}`}>
                  {deltaPopExposed > 0 ? `+${formatIndianNumber(deltaPopExposed)}` : 'Baseline'}
                </span>
              </div>
            </div>

            {/* Causal Explanation Box */}
            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-purple-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Causal Scenario Explanation</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {getCausalExplanation()}
              </p>
            </div>
          </div>

          {/* Forward Action to AI Situation Brief */}
          <button
            onClick={() => setActiveTab('briefing')}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg mt-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Briefing with This Scenario</span>
          </button>
        </div>
      </div>
    </div>
  );
};
