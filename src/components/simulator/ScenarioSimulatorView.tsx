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
  ArrowRight
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MOCK_VILLAGES } from '../../data/villageData';
import { calculateVillageRisk } from '../../utils/riskCalculator';

export const ScenarioSimulatorView: React.FC = () => {
  const { simulationParams, setSimulationParams, resetSimulationParams, setActiveTab } = useAppState();

  const currentWind = Math.round(135 * simulationParams.windSpeedMultiplier);
  const currentRain = Math.round(280 * simulationParams.rainfallMultiplier);
  const currentSurge = (3.4 + simulationParams.surgeHeightOffset).toFixed(1);

  // Dynamic calculations
  const totalVillagesCritical = MOCK_VILLAGES.filter(
    (v) => calculateVillageRisk(v, simulationParams).overallRisk >= 75
  ).length;

  const baselineVillagesCritical = MOCK_VILLAGES.filter(
    (v) => calculateVillageRisk(v).overallRisk >= 75
  ).length;

  const deltaVillages = totalVillagesCritical - baselineVillagesCritical;
  const popExposedLakhs = (
    2.84 * simulationParams.rainfallMultiplier * (simulationParams.surgeHeightOffset >= 0 ? 1 + simulationParams.surgeHeightOffset * 0.12 : 0.9)
  ).toFixed(2);
  const deltaPopLakhs = (parseFloat(popExposedLakhs) - 2.84).toFixed(2);

  const assetsAtRisk = Math.round(42 * (currentWind / 135) * (simulationParams.rainfallMultiplier > 1 ? 1.15 : 1.0));
  const deltaAssets = assetsAtRisk - 42;

  const shelterGap = Math.round(92000 + simulationParams.surgeHeightOffset * 8000 + (simulationParams.trackShiftKm > 0 ? 4200 : 0));
  const deltaShelterGap = shelterGap - 92000;

  const floodedRoutes = Math.round(7 + (simulationParams.rainfallMultiplier - 1) * 3 + (simulationParams.trackShiftKm > 15 ? 2 : 0));
  const deltaRoutes = floodedRoutes - 7;

  // Preset Handlers
  const applyPreset = (type: 'baseline' | 'north30' | 'superCyclone' | 'southTrack') => {
    switch (type) {
      case 'baseline':
        resetSimulationParams();
        break;
      case 'north30':
        setSimulationParams({
          windSpeedMultiplier: 1.05,
          rainfallMultiplier: 1.25,
          surgeHeightOffset: 0.6,
          trackShiftKm: 30,
          landfallTimeShiftHours: -4,
        });
        break;
      case 'superCyclone':
        setSimulationParams({
          windSpeedMultiplier: 1.35,
          rainfallMultiplier: 1.6,
          surgeHeightOffset: 1.8,
          trackShiftKm: 10,
          landfallTimeShiftHours: -6,
        });
        break;
      case 'southTrack':
        setSimulationParams({
          windSpeedMultiplier: 0.95,
          rainfallMultiplier: 0.85,
          surgeHeightOffset: -0.5,
          trackShiftKm: -30,
          landfallTimeShiftHours: 4,
        });
        break;
    }
  };

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1600px] mx-auto font-sans">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
              Predictive What-If Scenario Modeler
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Meteorological Sensitivity &amp; Inundation Stress-Testing
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Test track deviations, sudden eyewall intensification, and storm surge amplifications with instantaneous deterministic recalculation.
          </p>
        </div>

        {/* Operational Notice */}
        <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-2.5 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-purple-200">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
            <span>
              <strong>Scenario Modeler:</strong> Perturb track trajectory, wind velocity, and tidal surge to compute real-time stress test deltas. Not an official IMD meteorological forecast.
            </span>
          </div>
          <span className="text-[10px] text-purple-300/80 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-700/50 whitespace-nowrap">
            v2.4 Sensitivity Engine
          </span>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('baseline')}
            className="px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 border border-navy-700 text-xs font-mono font-medium transition-colors"
          >
            Baseline T-24h
          </button>
          <button
            onClick={() => applyPreset('north30')}
            className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-colors"
          >
            +30km North Shift
          </button>
          <button
            onClick={() => applyPreset('superCyclone')}
            className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition-colors"
          >
            Super Cyclone Cat-5
          </button>
          <button
            onClick={resetSimulationParams}
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-white transition-colors"
            title="Reset to default"
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
              <span>Variable Hazard Inputs</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Interactive Multi-Parameter Model
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* 1. Wind Speed Slider */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <Wind className="w-4 h-4 text-red-400" /> Maximum Sustained Wind
                </span>
                <span className="text-base font-bold text-red-400 font-mono">
                  {currentWind} km/h{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    ({((simulationParams.windSpeedMultiplier - 1) * 100).toFixed(0)}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={simulationParams.windSpeedMultiplier}
                onChange={(e) =>
                  setSimulationParams((p) => ({ ...p, windSpeedMultiplier: parseFloat(e.target.value) }))
                }
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>108 km/h (Moderate)</span>
                <span>135 km/h (Baseline)</span>
                <span>202 km/h (Super Storm)</span>
              </div>
            </div>

            {/* 2. Rainfall Accumulation Slider */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <CloudRain className="w-4 h-4 text-blue-400" /> 24-Hour Rainfall Accumulation
                </span>
                <span className="text-base font-bold text-blue-400 font-mono">
                  {currentRain} mm{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    ({((simulationParams.rainfallMultiplier - 1) * 100).toFixed(0)}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={simulationParams.rainfallMultiplier}
                onChange={(e) =>
                  setSimulationParams((p) => ({ ...p, rainfallMultiplier: parseFloat(e.target.value) }))
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>140 mm (Low)</span>
                <span>280 mm (Baseline)</span>
                <span>560 mm (Extreme Torrential)</span>
              </div>
            </div>

            {/* 3. Storm Surge Offset Slider */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <Waves className="w-4 h-4 text-purple-400" /> Coastal Storm Surge Peak
                </span>
                <span className="text-base font-bold text-purple-400 font-mono">
                  {currentSurge} meters{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    ({simulationParams.surgeHeightOffset >= 0 ? '+' : ''}
                    {simulationParams.surgeHeightOffset.toFixed(1)}m)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="3.0"
                step="0.2"
                value={simulationParams.surgeHeightOffset}
                onChange={(e) =>
                  setSimulationParams((p) => ({ ...p, surgeHeightOffset: parseFloat(e.target.value) }))
                }
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2.4m (Minor)</span>
                <span>3.4m (Baseline)</span>
                <span>6.4m (Catastrophic)</span>
              </div>
            </div>

            {/* 4. Cyclone Track Shift Slider */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <Compass className="w-4 h-4 text-cyan-400" /> Track Cross-Axis Displacement
                </span>
                <span className="text-base font-bold text-cyan-400 font-mono">
                  {simulationParams.trackShiftKm > 0
                    ? `${simulationParams.trackShiftKm} km North`
                    : simulationParams.trackShiftKm < 0
                    ? `${Math.abs(simulationParams.trackShiftKm)} km South`
                    : 'On Predicted Track'}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={simulationParams.trackShiftKm}
                onChange={(e) =>
                  setSimulationParams((p) => ({ ...p, trackShiftKm: parseInt(e.target.value) }))
                }
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-50 km (Southwards into Sea)</span>
                <span>0 km (Nominal Track)</span>
                <span>+50 km (Northwards to Urban Core)</span>
              </div>
            </div>

            {/* 5. Landfall Lead Time Shift */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-sans font-semibold">
                  <Clock className="w-4 h-4 text-amber-400" /> Landfall Timing Offset
                </span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {simulationParams.landfallTimeShiftHours > 0
                    ? `+${simulationParams.landfallTimeShiftHours}h Delayed`
                    : simulationParams.landfallTimeShiftHours < 0
                    ? `${Math.abs(simulationParams.landfallTimeShiftHours)}h Accelerated`
                    : 'Nominal 24h Window'}
                </span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="2"
                value={simulationParams.landfallTimeShiftHours}
                onChange={(e) =>
                  setSimulationParams((p) => ({ ...p, landfallTimeShiftHours: parseInt(e.target.value) }))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-12h (Accelerating Forward)</span>
                <span>0h</span>
                <span>+12h (Slow-Moving Stalled Storm)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Impact Delta Panel (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-white font-mono">
                  Impact Differential Summary
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Simulated Output
              </span>
            </div>

            {/* Structured Delta Card */}
            <div className="bg-gradient-to-br from-navy-950 to-navy-900 border border-navy-750 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-200">
                Projected Scenario Delta vs Nominal Baseline:
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300">P0 Critical Villages:</span>
                  <span className={`font-bold ${deltaVillages > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {totalVillagesCritical} ({deltaVillages >= 0 ? '+' : ''}{deltaVillages} change)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300">Population Exposed:</span>
                  <span className={`font-bold ${parseFloat(deltaPopLakhs) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {popExposedLakhs} Lakh ({parseFloat(deltaPopLakhs) >= 0 ? '+' : ''}{deltaPopLakhs} L)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300">Critical Assets in Flood Zone:</span>
                  <span className={`font-bold ${deltaAssets > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                    {assetsAtRisk} ({deltaAssets >= 0 ? '+' : ''}{deltaAssets} assets)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300">Shelter Capacity Deficit:</span>
                  <span className={`font-bold ${deltaShelterGap > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {shelterGap.toLocaleString()} beds ({deltaShelterGap >= 0 ? '+' : ''}{deltaShelterGap.toLocaleString()})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-navy-850 border border-navy-800">
                  <span className="text-slate-300">Flooded Evacuation Arterials:</span>
                  <span className={`font-bold ${deltaRoutes > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {floodedRoutes} routes ({deltaRoutes >= 0 ? '+' : ''}{deltaRoutes} severed)
                  </span>
                </div>
              </div>
            </div>

            {/* Textual Narrative Explanation */}
            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deterministic Scenario Assessment:</span>
              </div>
              <p className="leading-relaxed">
                {simulationParams.trackShiftKm >= 20 ? (
                  <>
                    A <strong className="text-white">+{simulationParams.trackShiftKm} km North shift</strong> steers the severe eyewall toward dense urban settlements in <strong>Sundar Pur and Delta Nagar</strong>. Coastal hospital access will be severed 4 hours earlier due to intensified tidal surge piling in estuary bottlenecks.
                  </>
                ) : simulationParams.windSpeedMultiplier > 1.2 ? (
                  <>
                    Escalation to <strong className="text-white">{currentWind} km/h wind</strong> increases structural roofing failure risk by 68%. Overhead power transmission feeder lines must be pre-emptively shut down.
                  </>
                ) : (
                  <>
                    Conditions are aligned with the <strong className="text-white">Baseline T-24h scenario</strong>. Primary vulnerability is concentrated in Coastal Ward 7 and Delta Nagar with 0.8m road submersion on SH-12.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Inspect On Dynamic Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('briefing')}
              className="bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-navy-700 px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium transition-colors"
            >
              AI Briefing &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
