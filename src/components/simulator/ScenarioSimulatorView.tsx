import React from 'react';
import {
  Sliders,
  Wind,
  CloudRain,
  Waves,
  Compass,
  Clock,
  RotateCcw,
  TrendingUp,
  AlertOctagon,
  Users,
  Building2,
  Home,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Navigation
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { DEFAULT_SCENARIO_INPUTS, BASE_STORM_SCENARIO } from '../../data/mockStorm';

export const ScenarioSimulatorView: React.FC = () => {
  const {
    scenarioInputs,
    setScenarioInputs,
    resetScenarioInputs,
    simulationSummary,
    setActiveTab,
    dataMode,
  } = useAppState();

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

  // Deltas against baseline
  const baselineCritical = 3; // Ward 7, Delta Nagar, East Embankment/Riverbend
  const currentCritical = simulationSummary.criticalVillagesCount;
  const deltaCritical = currentCritical - baselineCritical;

  const baselineAssetsAtRisk = 4;
  const currentAssetsAtRisk = simulationSummary.criticalAssetsAtRiskCount;
  const deltaAssets = currentAssetsAtRisk - baselineAssetsAtRisk;

  const baselineRoadsAtRisk = 2; // Coastal Road, Port Access Road
  const currentRoadsAtRisk = simulationSummary.roadsAtRiskCount;
  const deltaRoads = currentRoadsAtRisk - baselineRoadsAtRisk;

  const baselineShelterGap = 0;
  const currentShelterGap = simulationSummary.shelterCapacityGap;
  const deltaShelterGap = currentShelterGap - baselineShelterGap;

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1600px] mx-auto font-sans select-none">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
              Deterministic Scenario Modeler
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Sensitivity &amp; Multi-Hazard Stress-Testing
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Dynamically recalculates all village risk scores, infrastructure hazards, route cutoffs, and shelter assignments with zero server dependency.
          </p>
        </div>

        {/* Preset & Reset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('baseline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
              trackShiftKm === 0 && windSpeedKmh === 135 && rainfallMm === 180 && stormSurgeMeters === 1.8
                ? 'bg-cyan-600 text-white border-cyan-400 font-bold shadow-sm'
                : 'bg-navy-850 hover:bg-navy-800 text-slate-300 border-navy-700'
            }`}
          >
            Baseline ({BASE_STORM_SCENARIO.name})
          </button>
          <button
            type="button"
            onClick={() => applyPreset('north30')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border ${
              trackShiftKm === 30
                ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border-purple-500/40'
            }`}
          >
            +30km North Shift
          </button>
          <button
            type="button"
            onClick={() => applyPreset('superCyclone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border ${
              windSpeedKmh >= 200
                ? 'bg-red-600 text-white border-red-400 shadow-sm'
                : 'bg-red-600/20 hover:bg-red-600/40 text-red-300 border-red-500/40'
            }`}
          >
            Super Cyclone (205 km/h)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('southTrack')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border ${
              trackShiftKm === -40
                ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                : 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border-blue-500/40'
            }`}
          >
            -40km South Shift
          </button>
          <button
            type="button"
            onClick={resetScenarioInputs}
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-white transition-colors"
            title="Reset to Base Scenario"
            aria-label="Reset Scenario"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sliders Control Panel (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Multi-Hazard Parameter Sliders</span>
            </h3>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              Deterministic • Model Estimate
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* 1. Maximum Sustained Wind Speed */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <Wind className="w-4 h-4 text-red-400" /> Maximum Sustained Wind Speed
                </span>
                <span className="text-base font-bold text-red-400 font-mono">
                  {windSpeedKmh} km/h{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    (Base: 135 km/h)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="220"
                step="5"
                value={windSpeedKmh}
                onChange={(e) =>
                  setScenarioInputs((p) => ({ ...p, windSpeedKmh: parseInt(e.target.value) }))
                }
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>60 km/h (Depression)</span>
                <span>135 km/h (Varuna Base)</span>
                <span>220 km/h (Super Cyclone)</span>
              </div>
            </div>

            {/* 2. 24-Hour Rainfall Accumulation */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <CloudRain className="w-4 h-4 text-blue-400" /> 24-Hour Rainfall Accumulation
                </span>
                <span className="text-base font-bold text-blue-400 font-mono">
                  {rainfallMm} mm{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    (Base: 180 mm)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="400"
                step="10"
                value={rainfallMm}
                onChange={(e) =>
                  setScenarioInputs((p) => ({ ...p, rainfallMm: parseInt(e.target.value) }))
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm (Dry)</span>
                <span>180 mm (Base Rainfall)</span>
                <span>400 mm (Extreme Torrential)</span>
              </div>
            </div>

            {/* 3. Storm Surge Peak */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <Waves className="w-4 h-4 text-purple-400" /> Peak Coastal Storm Surge
                </span>
                <span className="text-base font-bold text-purple-400 font-mono">
                  {stormSurgeMeters.toFixed(1)} meters{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    (Base: 1.8 m)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={stormSurgeMeters}
                onChange={(e) =>
                  setScenarioInputs((p) => ({ ...p, stormSurgeMeters: parseFloat(e.target.value) }))
                }
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.0m (Astronomic Only)</span>
                <span>1.8m (Base Surge)</span>
                <span>5.0m (Catastrophic Surge)</span>
              </div>
            </div>

            {/* 4. Cyclone Track Shift */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <Compass className="w-4 h-4 text-cyan-400" /> Cyclone Track Cross-Axis Displacement
                </span>
                <span className="text-base font-bold text-cyan-400 font-mono">
                  {trackShiftKm > 0
                    ? `+${trackShiftKm} km North`
                    : trackShiftKm < 0
                    ? `${trackShiftKm} km South`
                    : '0 km (Nominal Track)'}
                </span>
              </div>
              <input
                type="range"
                min="-80"
                max="80"
                step="5"
                value={trackShiftKm}
                onChange={(e) =>
                  setScenarioInputs((p) => ({ ...p, trackShiftKm: parseInt(e.target.value) }))
                }
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-80 km (South / Sea Shift)</span>
                <span>0 km (Direct Impact)</span>
                <span>+80 km (North Urban Core Shift)</span>
              </div>
            </div>

            {/* 5. Landfall Lead Time */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <Clock className="w-4 h-4 text-amber-400" /> Estimated Time to Landfall
                </span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {landfallHours} Hours (T-{landfallHours}h)
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="72"
                step="2"
                value={landfallHours}
                onChange={(e) =>
                  setScenarioInputs((p) => ({ ...p, landfallHours: parseInt(e.target.value) }))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>6h (Immediate Impact)</span>
                <span>24h (Base Window)</span>
                <span>72h (Early Surveillance)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Impact Summary Panel (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-white font-mono">
                  Scenario Impact Summary
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Model Estimate
              </span>
            </div>

            {/* Impact Metrics Grid */}
            <div className="bg-gradient-to-br from-navy-950 to-navy-900 border border-navy-750 rounded-xl p-4 space-y-2.5">
              <div className="text-xs font-mono font-bold text-slate-200 mb-1">
                Dynamic Recalculation Results:
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                    Critical Risk Villages:
                  </span>
                  <span className={`font-bold ${currentCritical >= 3 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {currentCritical} / {simulationSummary.villages.length} ({deltaCritical >= 0 ? '+' : ''}{deltaCritical} vs base)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    P0 Immediate Evacuation:
                  </span>
                  <span className="font-bold text-orange-300">
                    {simulationSummary.p0Population.toLocaleString()} residents
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    Critical Assets at Risk:
                  </span>
                  <span className={`font-bold ${currentAssetsAtRisk > baselineAssetsAtRisk ? 'text-orange-400' : 'text-slate-200'}`}>
                    {currentAssetsAtRisk} / {simulationSummary.totalAssetsCount} ({deltaAssets >= 0 ? '+' : ''}{deltaAssets})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-purple-400" />
                    Roads at Risk / Blocked:
                  </span>
                  <span className={`font-bold ${currentRoadsAtRisk > 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {currentRoadsAtRisk} / {simulationSummary.totalRoadsCount} ({deltaRoads >= 0 ? '+' : ''}{deltaRoads})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-cyan-400" />
                    Shelter Capacity Gap:
                  </span>
                  <span className={`font-bold ${currentShelterGap > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {currentShelterGap > 0 ? `${currentShelterGap.toLocaleString()} beds needed` : 'Adequate Capacity'}
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Text Block */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scenario Impact Narrative:</span>
              </div>
              <pre className="font-sans whitespace-pre-wrap leading-relaxed text-xs text-slate-300">
                {simulationSummary.scenarioImpactSummary}
              </pre>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Inspect On Dynamic Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('briefing')}
              className="bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-navy-700 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-colors"
            >
              AI Briefing &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
