import React, { useState } from 'react';
import {
  Sparkles,
  Map as MapIcon,
  Navigation,
  Building2,
  Sliders,
  AlertTriangle,
  ArrowRight,
  Shield,
  Clock,
  Flame,
  CloudRain,
  Waves,
  Activity,
  CheckCircle2,
  ExternalLink,
  Info,
  Radio,
  ChevronRight,
  Play
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { CalculatedVillageOutput } from '../../types/disaster';
import { GuidedDemoModal } from '../common/GuidedDemoModal';

export const CommandCentreView: React.FC = () => {
  const {
    activeCyclone,
    simulationSummary,
    setActiveTab,
    setSelectedVillage,
    scenarioInputs,
  } = useAppState();
  const { t } = useLanguage();

  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeWhyModalVillage, setActiveWhyModalVillage] = useState<CalculatedVillageOutput | null>(null);

  const villages = simulationSummary.villages;
  const p0Villages = villages.filter((v) => v.evacuation.evacuationPriority === 'P0');
  const criticalVillages = villages.filter((v) => v.risk.riskClass === 'Critical');
  const highVillages = villages.filter((v) => v.risk.riskClass === 'High');
  const modVillages = villages.filter((v) => v.risk.riskClass === 'Moderate');
  const lowVillages = villages.filter((v) => v.risk.riskClass === 'Low');

  // Priority location cards: Coastal Ward 7, Delta Nagar, East Embankment
  const ward7 = villages.find((v) => v.id === 'vil-01') || villages[0];
  const deltaNagar = villages.find((v) => v.id === 'vil-02') || villages[1];
  const eastEmbankment = villages.find((v) => v.id === 'vil-08') || villages[7];
  const priorityLocations = [ward7, deltaNagar, eastEmbankment];

  const handleOpenOnMap = (village: CalculatedVillageOutput) => {
    setSelectedVillage(village);
    setActiveTab('map');
  };

  const TIMELINE_STAGES = [
    { label: 'Now', time: 'T-28h', active: false, desc: 'Deep Depression in Bay of Bengal' },
    { label: 'T–24h', time: 'Current', active: true, desc: 'Very Severe Storm (135 km/h)' },
    { label: 'T–12h', time: 'Pre-Landfall', active: false, desc: 'Evacuation cutoff window' },
    { label: 'Landfall', time: 'T-00h', active: false, desc: 'Peak surge & gale impact' },
    { label: 'T+6h', time: 'Post-Storm', active: false, desc: 'Inland flood inundation' },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1700px] mx-auto font-sans text-slate-100">
      {/* Top Header & Guided Demo Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 border border-navy-750 p-4 md:p-5 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-bold">
              {t('eoc_title')}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">
            {t('situation_at_glance')}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {t('hero_subtitle')}
          </p>
        </div>

        {/* Guided Demo & Quick Launch */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsDemoOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-teal-950/50 transition-all font-mono text-xs"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t('start_guided_demo')}</span>
          </button>

          <button
            onClick={() => setActiveTab('briefing')}
            className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-cyan-500/30 font-bold py-2.5 px-3.5 rounded-xl transition-all text-xs font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('ai_briefing_btn')}</span>
          </button>
        </div>
      </div>

      {/* ZONE 1: CURRENT STORM STORY */}
      <section className="bg-navy-900 border border-navy-750 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Storm Overview Summary */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                {activeCyclone?.category || 'Severe Cyclonic Storm'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Model estimate • Deterministic
              </span>
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Cyclone Varuna
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Estimated landfall in <strong className="text-teal-300 font-mono">24 hours</strong> along Sundar Coast. Immediate tactical focus on low-elevation coastal wards.
              </p>
            </div>

            {/* 4 Core Physics Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t('sustained_wind')}</span>
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {scenarioInputs.windSpeedKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
                </div>
                <div className="text-[10px] text-rose-400 font-mono mt-0.5">{t('gale_winds')}</div>
              </div>

              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('rainfall_24h')}</span>
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {scenarioInputs.rainfallMm} <span className="text-xs font-normal text-slate-400">mm</span>
                </div>
                <div className="text-[10px] text-blue-400 font-mono mt-0.5">{t('heavy_rain')}</div>
              </div>

              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                  <Waves className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t('peak_surge')}</span>
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {scenarioInputs.stormSurgeMeters.toFixed(1)} <span className="text-xs font-normal text-slate-400">m</span>
                </div>
                <div className="text-[10px] text-purple-400 font-mono mt-0.5">{t('inundation_risk')}</div>
              </div>

              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('confidence')}</span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                  78%
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{t('high_confidence')}</div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('map')}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all text-xs font-mono"
              >
                <MapIcon className="w-4 h-4" />
                <span>{t('view_fullscreen_map')}</span>
              </button>
            </div>
          </div>

          {/* Illustrated Cyclone Timeline Scrubber */}
          <div className="lg:col-span-5 bg-navy-950 p-4 rounded-2xl border border-navy-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                {t('cyclone_trajectory_timeline')}
              </span>
              <span className="text-teal-300 font-bold">{t('landfall_in_24h')}</span>
            </div>

            <div className="relative pt-4 pb-2">
              {/* Timeline Track Line */}
              <div className="absolute top-7 left-3 right-3 h-1 bg-navy-800 rounded-full" />
              <div className="absolute top-7 left-3 w-1/4 h-1 bg-teal-500 rounded-full" />

              {/* Timeline Steps */}
              <div className="relative flex justify-between">
                {TIMELINE_STAGES.map((stage, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold z-10 ${
                        stage.active
                          ? 'bg-teal-500 text-white ring-4 ring-teal-500/30'
                          : 'bg-navy-850 text-slate-400 border border-navy-700'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-[11px] font-mono font-bold ${stage.active ? 'text-teal-300' : 'text-slate-400'}`}>
                      {stage.label}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono hidden sm:block">
                      {stage.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navy-900/80 p-2.5 rounded-xl border border-navy-800/80 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
              <span>
                {t('tactical_phase_desc')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ZONE 2: WHAT NEEDS ATTENTION NOW (4 Core Action Metrics + Next 6h Checklist) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{t('what_needs_attention')}</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {t('click_to_drill_down')}
          </span>
        </div>

        {/* 4 Clickable Action Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('evacuation')}
            className="bg-navy-900 hover:bg-navy-850 p-4 rounded-2xl border border-red-500/30 hover:border-red-500/60 transition-all text-left shadow-lg group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{t('evac_priority_title')}</span>
              <Navigation className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-2xl font-black font-mono text-red-400 mt-2">
              3 Villages
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Require immediate <strong className="text-red-300 font-mono">P0 evacuation</strong> (16,450 people).
            </p>
          </button>

          <button
            onClick={() => setActiveTab('infrastructure')}
            className="bg-navy-900 hover:bg-navy-850 p-4 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 transition-all text-left shadow-lg group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{t('critical_assets_title')}</span>
              <Building2 className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-2">
              42 Lifelines
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Under observation across hospitals, power &amp; telecom.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('evacuation')}
            className="bg-navy-900 hover:bg-navy-850 p-4 rounded-2xl border border-rose-500/30 hover:border-rose-500/60 transition-all text-left shadow-lg group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{t('roads_risk_title')}</span>
              <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-2xl font-black font-mono text-rose-400 mt-2">
              7 Roads at Risk
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Coastal Road &amp; Port Access vulnerable to storm surge cutoff.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('evacuation')}
            className="bg-navy-900 hover:bg-navy-850 p-4 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all text-left shadow-lg group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{t('shelter_gap_title')}</span>
              <Shield className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-2xl font-black font-mono text-purple-300 mt-2">
              92,000 Capacity
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Standby shelters C &amp; D operational with 18,500 available beds.
            </p>
          </button>
        </div>

        {/* Top Recommended Actions in Next 6 Hours */}
        <div className="bg-navy-900 border border-navy-750 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Top Recommended Actions in the Next 6 Hours</span>
            </h4>
            <span className="text-[10px] font-mono bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
              Prioritized by Risk Severity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1">
              <div className="flex items-center gap-1.5 font-mono font-bold text-red-400 text-[11px]">
                <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">1</span>
                <span>P0 Evacuation</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Begin immediate P0 evacuation for <strong>Coastal Ward 7</strong> and <strong>Delta Nagar</strong>.
              </p>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1">
              <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400 text-[11px]">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
                <span>Route Diversion</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Redirect evacuation transport from Coastal Road to <strong>Elevated Route 2</strong>.
              </p>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1">
              <div className="flex items-center gap-1.5 font-mono font-bold text-teal-400 text-[11px]">
                <span className="w-4 h-4 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">3</span>
                <span>Power Resilience</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Activate diesel backup generators at <strong>Coastal Power Substation</strong>.
              </p>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1">
              <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-400 text-[11px]">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">4</span>
                <span>Medical Pre-position</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Pre-position emergency triage teams near <strong>Sundar District Hospital</strong>.
              </p>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1">
              <div className="flex items-center gap-1.5 font-mono font-bold text-purple-400 text-[11px]">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">5</span>
                <span>Bridge Inspection</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Inspect <strong>Riverbend Bridge</strong> before heavy emergency transport movements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ZONE 3: PRIORITY LOCATIONS & RISK DISTRIBUTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Priority Coastal Locations
            </h3>
            <p className="text-xs text-slate-400">
              Highest-risk settlements requiring immediate operational attention and shelter assignments.
            </p>
          </div>

          {/* Compact Horizontal Risk Distribution Bar (No pie charts) */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400 text-[10px]">Risk Split:</span>
            <div className="flex h-3 w-48 rounded-full overflow-hidden border border-navy-700 bg-navy-950">
              <div
                style={{ width: `${(criticalVillages.length / villages.length) * 100}%` }}
                className="bg-red-500"
                title={`Critical: ${criticalVillages.length} villages`}
              />
              <div
                style={{ width: `${(highVillages.length / villages.length) * 100}%` }}
                className="bg-orange-500"
                title={`High: ${highVillages.length} villages`}
              />
              <div
                style={{ width: `${(modVillages.length / villages.length) * 100}%` }}
                className="bg-amber-500"
                title={`Moderate: ${modVillages.length} villages`}
              />
              <div
                style={{ width: `${(lowVillages.length / villages.length) * 100}%` }}
                className="bg-emerald-500"
                title={`Low: ${lowVillages.length} villages`}
              />
            </div>
            <div className="flex gap-2 text-[10px] text-slate-300">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> {criticalVillages.length} Crit</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> {highVillages.length} High</span>
            </div>
          </div>
        </div>

        {/* 3 Large Visual Risk Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {priorityLocations.map((village) => {
            const isCrit = village.risk.riskClass === 'Critical';
            const isP0 = village.evacuation.evacuationPriority === 'P0';

            return (
              <div
                key={village.id}
                className={`bg-navy-900 border ${
                  isCrit ? 'border-red-500/40' : 'border-orange-500/40'
                } rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                        isCrit
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      }`}
                    >
                      {village.risk.riskClass} Risk • Score {village.risk.overallRisk}/100
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        isP0
                          ? 'bg-red-600 text-white'
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}
                    >
                      {village.evacuation.evacuationPriority} Evacuation
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-white mt-2.5">
                    {village.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Population: <strong className="text-white font-mono">{village.population.toLocaleString()}</strong> ({village.elderlyPopulation + village.childrenPopulation} vulnerable)
                  </p>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-navy-800 text-xs font-mono">
                    <div className="bg-navy-950 p-2 rounded-lg border border-navy-800/80">
                      <span className="text-[10px] text-slate-400">Flood Probability</span>
                      <div className="text-sm font-bold text-rose-300">
                        {village.evacuation.floodProbabilityPct}%
                      </div>
                    </div>

                    <div className="bg-navy-950 p-2 rounded-lg border border-navy-800/80">
                      <span className="text-[10px] text-slate-400">Water Depth</span>
                      <div className="text-sm font-bold text-blue-300">
                        {village.evacuation.estimatedFloodDepthMeters.toFixed(1)} m
                      </div>
                    </div>
                  </div>

                  {/* Shelter & Route Routing */}
                  <div className="mt-3 bg-navy-950 p-3 rounded-xl border border-navy-800 text-xs space-y-1">
                    <div className="text-slate-400 text-[10px] font-mono uppercase tracking-wider">
                      Assigned Safe Shelter
                    </div>
                    <div className="font-bold text-teal-300 flex items-center justify-between">
                      <span>{village.evacuation.nearestRecommendedShelter.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {village.evacuation.shelterCapacityStatus.availableBeds.toLocaleString()} beds free
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Via <strong className="text-slate-200">{village.evacuation.recommendedRouteName}</strong> ({village.evacuation.routeStatus})
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-navy-800">
                  <button
                    onClick={() => setActiveWhyModalVillage(village)}
                    className="flex-1 py-2 px-3 bg-navy-850 hover:bg-navy-800 text-teal-300 hover:text-teal-200 border border-teal-500/30 rounded-xl text-xs font-mono font-bold transition-all text-center"
                  >
                    Why is this at risk?
                  </button>

                  <button
                    onClick={() => handleOpenOnMap(village)}
                    className="py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-md shadow-teal-950"
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Open Map</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* "Why is this at risk?" Modal */}
      {activeWhyModalVillage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-750 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-750 pb-3">
              <div>
                <span className="text-[10px] font-mono text-teal-300 uppercase tracking-wider font-bold">
                  Explainable Risk Attribution
                </span>
                <h3 className="text-lg font-black text-white">
                  {activeWhyModalVillage.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveWhyModalVillage(null)}
                className="p-1 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs text-slate-300">
                Overall Risk Score: <strong className="text-white font-mono">{activeWhyModalVillage.risk.overallRisk}/100</strong> ({activeWhyModalVillage.risk.riskClass})
              </div>

              {/* Main Risk Contributing Factors */}
              <div className="space-y-2">
                {activeWhyModalVillage.risk.mainRiskDrivers.map((driver, idx) => (
                  <div
                    key={idx}
                    className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-200">{driver.label}</span>
                    <span className="font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                      +{driver.impact} pts
                    </span>
                  </div>
                ))}
              </div>

              {/* Rerouting Explanation */}
              <div className="bg-teal-500/10 border border-teal-500/30 p-3 rounded-xl text-xs text-teal-200 space-y-1">
                <div className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Evacuation Routing Decision:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {activeWhyModalVillage.evacuation.shelterAssignmentExplanation}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  const target = activeWhyModalVillage;
                  setActiveWhyModalVillage(null);
                  handleOpenOnMap(target);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-mono font-bold transition-colors"
              >
                Inspect on GIS Map &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Minute Guided Demo Controller */}
      <GuidedDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
};
