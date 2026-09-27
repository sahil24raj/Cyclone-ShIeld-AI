import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  FileText,
  AlertTriangle,
  Users,
  Building2,
  Home,
  Clock,
  Globe,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  Download,
  AlertOctagon,
  RefreshCw,
  Database,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { generateLocalBriefing } from '../../services/mockBriefingGenerator';

export const AIBriefingView: React.FC = () => {
  const { simulationSummary, scenarioInputs, modeBadgeText } = useAppState();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTabLang, setActiveTabLang] = useState<'en' | 'hi'>('en');

  // Generate deterministic briefing directly from current scenario simulation outputs
  const briefing = useMemo(() => {
    return generateLocalBriefing(simulationSummary);
  }, [simulationSummary]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 450);
  };

  const handleCopy = () => {
    const fullText = `
# SITUATION REPORT: Cyclone Varuna (T-${scenarioInputs.landfallHours}h)
Generated: ${new Date().toISOString()} (Deterministic Model Estimate)

## 1. Executive Summary
${briefing.executiveSummary}

## 2. Top Five Systemic Risks
${briefing.topFiveRisks.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## 3. Critical Assets Requiring Action
${briefing.criticalAssetsRequiringAction.map((a) => `- ${a.assetName}: (Risk: ${a.riskScore}/100) -> Action: ${a.action}`).join('\n')}

## 4. Immediate & Priority Evacuation Targets (P0 / P1)
${briefing.p0AndP1Villages.map((v) => `- ${v.villageName} (${v.priority}, ${v.population.toLocaleString()} pop) -> Shelter: ${v.recommendedShelter}`).join('\n')}

## 5. Shelter Capacity & Gap Assessment
- Total Shelter Capacity: ${briefing.shelterCapacityStatus.totalCapacity.toLocaleString()} persons
- Currently Occupied: ${briefing.shelterCapacityStatus.totalOccupied.toLocaleString()} persons
- Available Bed Capacity: ${briefing.shelterCapacityStatus.availableBeds.toLocaleString()} persons
- Capacity Deficit/Gap: ${briefing.shelterCapacityStatus.deficit.toLocaleString()} persons

## 6. Recommended Operational Actions (Next 6 Hours)
${briefing.recommendedActionsNext6Hours.map((a, i) => `${i + 1}. ${a}`).join('\n')}

## 7. English Public Advisory
${briefing.englishPublicAdvisory}

## 8. Hindi Public Advisory
${briefing.hindiPublicAdvisory}

## 9. Model Confidence
${briefing.modelConfidence}

## 10. Limitations & Statutory Disclaimer
${briefing.limitations}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1600px] mx-auto font-sans">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Autonomous Incident Intelligence Synthesizer
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            AI Tactical Briefing &amp; Situation Report (SITREP)
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Local deterministic NLP briefing engine executing without cloud dependencies, API keys, or external network calls.
          </p>
        </div>

        {/* Generate / Regenerate Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-cyan-950/60 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Recalculating...' : 'Generate Simulation Briefing'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-navy-850 hover:bg-navy-800 text-slate-200 border border-navy-700 font-mono text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
            title="Copy SITREP Markdown"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy SITREP'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Briefing Document (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-navy-900 border border-navy-750 rounded-2xl shadow-xl overflow-hidden">
            {/* SITREP Header Bar */}
            <div className="p-4 bg-navy-950 border-b border-navy-750 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">
                  SITREP: Cyclone Varuna (T-{scenarioInputs.landfallHours}h)
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">Timestamp: {new Date().toLocaleTimeString('en-IN')} IST</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  {modeBadgeText}
                </span>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-6 text-slate-200 text-xs leading-relaxed">
              {/* 1. Executive Summary */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-cyan-300 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1.5">
                  <span>1. Executive Summary</span>
                  <span className="text-[10px] text-cyan-400/70 font-normal lowercase">(model estimate)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {briefing.executiveSummary}
                </p>
              </section>

              {/* 2. Top Five Risks */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-rose-400 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>2. Top Five Systemic Risks</span>
                </h3>
                <div className="space-y-1.5 font-sans">
                  {briefing.topFiveRisks.map((risk, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-navy-950 p-2.5 rounded-lg border border-navy-800 text-slate-300">
                      <span className="font-mono text-rose-400 font-bold text-[11px] w-5 text-right flex-shrink-0">
                        0{idx + 1}.
                      </span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Critical Assets Requiring Action */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-amber-400 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>3. Critical Assets Requiring Action</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {briefing.criticalAssetsRequiringAction.map((asset) => (
                    <div key={asset.assetName} className="bg-navy-950 p-3 rounded-xl border border-navy-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{asset.assetName}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          Risk: {asset.riskScore}/100
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-300 pt-1 font-mono">Directive: {asset.action}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. P0 and P1 Evacuation Targets */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-purple-400 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1.5">
                  <Users className="w-4 h-4" />
                  <span>4. P0 &amp; P1 Evacuation Priority Targets</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                    <div className="text-xs font-bold text-rose-300 mb-1.5 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      P0: Immediate Evacuation (&lt; 2h)
                    </div>
                    {briefing.p0AndP1Villages.filter((v) => v.priority === 'P0').length > 0 ? (
                      <ul className="list-disc list-inside text-[11px] text-rose-200 space-y-1">
                        {briefing.p0AndP1Villages.filter((v) => v.priority === 'P0').map((v) => (
                          <li key={v.villageName}>
                            <strong>{v.villageName}</strong> ({v.population.toLocaleString()} pop) &rarr; {v.recommendedShelter}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[11px] text-slate-400">No villages currently in P0 priority</span>
                    )}
                  </div>

                  <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl">
                    <div className="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      P1: Evacuate Within 6 Hours
                    </div>
                    {briefing.p0AndP1Villages.filter((v) => v.priority === 'P1').length > 0 ? (
                      <ul className="list-disc list-inside text-[11px] text-amber-200 space-y-1">
                        {briefing.p0AndP1Villages.filter((v) => v.priority === 'P1').map((v) => (
                          <li key={v.villageName}>
                            <strong>{v.villageName}</strong> ({v.population.toLocaleString()} pop) &rarr; {v.recommendedShelter}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[11px] text-slate-400">No villages currently in P1 priority</span>
                    )}
                  </div>
                </div>
              </section>

              {/* 5. Shelter Capacity Status */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-emerald-400 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1.5">
                  <Home className="w-4 h-4" />
                  <span>5. Shelter Capacity &amp; Gap Assessment</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                    <div className="text-[10px] text-slate-400 uppercase">Total Capacity</div>
                    <div className="text-sm font-bold text-white mt-0.5">{briefing.shelterCapacityStatus.totalCapacity.toLocaleString()}</div>
                  </div>
                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                    <div className="text-[10px] text-slate-400 uppercase">Current Occupied</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">{briefing.shelterCapacityStatus.totalOccupied.toLocaleString()}</div>
                  </div>
                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                    <div className="text-[10px] text-slate-400 uppercase">Available Beds</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{briefing.shelterCapacityStatus.availableBeds.toLocaleString()}</div>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${briefing.shelterCapacityStatus.deficit > 0 ? 'bg-rose-950/40 border-rose-800/60 text-rose-300' : 'bg-navy-950 border-navy-800 text-slate-300'}`}>
                    <div className="text-[10px] uppercase">Capacity Deficit</div>
                    <div className="text-sm font-bold mt-0.5">{briefing.shelterCapacityStatus.deficit > 0 ? `-${briefing.shelterCapacityStatus.deficit.toLocaleString()}` : '0'}</div>
                  </div>
                </div>
              </section>

              {/* 6. Recommended Operational Actions for Next 6 Hours */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-blue-400 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1.5">
                  <Clock className="w-4 h-4" />
                  <span>6. Recommended Operational Directives (Next 6 Hours)</span>
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 font-sans pl-1 text-slate-300">
                  {briefing.recommendedActionsNext6Hours.map((action, idx) => (
                    <li key={idx} className="leading-relaxed">{action}</li>
                  ))}
                </ol>
              </section>

              {/* 7 & 8. Multilingual Public Warning Advisories (English & Hindi) */}
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-navy-800 pb-1.5">
                  <h3 className="font-bold text-sm text-purple-300 font-mono uppercase tracking-wide flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>7 &amp; 8. Multilingual Public Advisories</span>
                  </h3>
                  <div className="flex gap-1 font-mono text-[10px]">
                    <button
                      onClick={() => setActiveTabLang('en')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeTabLang === 'en' ? 'bg-purple-600 text-white font-bold' : 'bg-navy-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      English Advisory (7)
                    </button>
                    <button
                      onClick={() => setActiveTabLang('hi')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeTabLang === 'hi' ? 'bg-purple-600 text-white font-bold' : 'bg-navy-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      हिंदी परामर्श (8)
                    </button>
                  </div>
                </div>

                <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-slate-200">
                  {activeTabLang === 'en' ? (
                    <div className="space-y-2">
                      <div className="font-bold text-cyan-300 font-mono text-xs flex items-center justify-between">
                        <span>[7. PUBLIC ADVISORY - ENGLISH]</span>
                        <span className="text-[10px] text-slate-400 font-normal">Standard Citizen Bulletin</span>
                      </div>
                      <p className="font-sans leading-relaxed text-slate-300 text-xs whitespace-pre-line">
                        "{briefing.englishPublicAdvisory}"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="font-bold text-amber-300 font-mono text-xs flex items-center justify-between">
                        <span>[8. सार्वजनिक परामर्श - हिंदी (MANDATORY FORMAT)]</span>
                        <span className="text-[10px] text-slate-400 font-normal">नागरिक सुरक्षा प्रसारण</span>
                      </div>
                      <p className="font-sans leading-relaxed text-slate-200 text-xs bg-navy-900/60 p-3 rounded-lg border border-navy-800 whitespace-pre-line">
                        "{briefing.hindiPublicAdvisory}"
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* 9 & 10. Model Confidence and Limitations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 9. Model Confidence */}
                <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-cyan-300 font-mono">9. Model Confidence</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    {briefing.modelConfidence}
                  </p>
                </div>

                {/* 10. Limitations */}
                <div className="bg-amber-950/20 p-3.5 rounded-xl border border-amber-800/40 space-y-1">
                  <div className="font-bold text-xs text-amber-300 font-mono flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>10. Limitations &amp; Notice</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed whitespace-pre-line">
                    {briefing.limitations}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: System Engine & Scenario Context */}
        <div className="lg:col-span-4 space-y-4">
          {/* Current Dynamic Inputs */}
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-navy-750 pb-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Active Scenario Parameters
              </h3>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-400">Sustained Wind:</span>
                <span className="text-cyan-300 font-bold">{scenarioInputs.windSpeedKmh} km/h</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-400">24h Rainfall:</span>
                <span className="text-blue-300 font-bold">{scenarioInputs.rainfallMm} mm</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-400">Storm Surge:</span>
                <span className="text-amber-300 font-bold">{scenarioInputs.stormSurgeMeters.toFixed(1)} m</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-400">Track Shift:</span>
                <span className="text-purple-300 font-bold">{scenarioInputs.trackShiftKm > 0 ? `+${scenarioInputs.trackShiftKm}` : scenarioInputs.trackShiftKm} km</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-400">Landfall ETA:</span>
                <span className="text-rose-300 font-bold">T-{scenarioInputs.landfallHours}h</span>
              </div>
            </div>
          </div>

          {/* Local Deterministic Engine Attribution */}
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-navy-750 pb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Local Synthetic NLP Engine
              </h3>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-[11px] font-mono text-emerald-300/90 leading-relaxed">
              Synthesized purely via deterministic decision logic from current sample datasets. No external LLM token expenditure or network roundtrip required.
            </div>

            <div className="text-[10px] text-slate-400 font-mono">
              Ready for optional Google GenAI SDK (gemini-1.5-pro / gemini-2.0-flash) structured JSON streaming adapter in live data mode.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

