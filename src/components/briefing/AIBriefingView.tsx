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
  Download,
  AlertOctagon,
  RefreshCw,
  Database,
  Info,
  ShieldAlert,
  Navigation,
  Languages
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { generateLocalBriefing } from '../../services/mockBriefingGenerator';
import { formatIndianNumber } from '../../utils/formatters';

export const AIBriefingView: React.FC = () => {
  const { simulationSummary, scenarioInputs } = useAppState();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeAdvisoryLang, setActiveAdvisoryLang] = useState<'en' | 'hi'>('en');

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
# AI SITUATION BRIEF: Cyclone Varuna (T-${scenarioInputs.landfallHours}h)
Generated: ${new Date().toISOString()}

1. Situation Summary:
${briefing.executiveSummary}

2. Immediate Priorities:
${briefing.recommendedActionsNext6Hours.map((a, i) => `${i + 1}. ${a}`).join('\n')}

3. Areas Requiring Evacuation:
${briefing.p0AndP1Villages.map((v) => `- ${v.villageName} (${v.priority}, ${formatIndianNumber(v.population)} pop) -> Shelter: ${v.recommendedShelter}`).join('\n')}

4. Critical Infrastructure Actions:
${briefing.criticalAssetsRequiringAction.map((a) => `- ${a.assetName} (Risk ${a.riskScore}/100): ${a.action}`).join('\n')}

5. Shelter and Route Status:
- Total Shelter Capacity: ${formatIndianNumber(briefing.shelterCapacityStatus.totalCapacity)}
- Available Beds: ${formatIndianNumber(briefing.shelterCapacityStatus.availableBeds)}
- Capacity Deficit: ${formatIndianNumber(briefing.shelterCapacityStatus.deficit)}

6. Public Advisory (${activeAdvisoryLang.toUpperCase()}):
${activeAdvisoryLang === 'en' ? briefing.englishPublicAdvisory : briefing.hindiPublicAdvisory}

7. Confidence & Limitations:
${briefing.modelConfidence}
${briefing.limitations}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto font-sans select-none text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
              AI Decision Support
            </span>
            <span className="bg-navy-950 border border-navy-750 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
              Prototype Simulation
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            AI Situation Brief
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Structured decision support based on the current prototype scenario.
          </p>
        </div>

        {/* Source Badges & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Briefing'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="bg-navy-950 hover:bg-navy-850 text-slate-300 font-mono text-xs font-bold px-3.5 py-2 rounded-xl border border-navy-800 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SITREP' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Trust & Source Labels Strip */}
      <div className="flex flex-wrap items-center gap-2.5 bg-navy-900/60 border border-navy-750 p-2.5 rounded-xl text-xs font-mono">
        <span className="text-slate-400">Data Attributions:</span>
        <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded text-[11px]">
          Model estimate
        </span>
        <span className="bg-purple-950/60 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded text-[11px]">
          Synthetic sample scenario
        </span>
        <span className="bg-amber-950/60 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded text-[11px] font-bold">
          Human review required
        </span>
      </div>

      {/* 7 CORE SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Summary, Priorities, Evacuation Targets (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 1. Situation Summary */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold border-b border-navy-800 pb-2">
              <FileText className="w-4 h-4" />
              <span>1. Situation Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {briefing.executiveSummary}
            </p>
          </div>

          {/* 2. Immediate Priorities */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold border-b border-navy-800 pb-2">
              <AlertOctagon className="w-4 h-4" />
              <span>2. Immediate Tactical Priorities (Next 6 Hours)</span>
            </div>
            <div className="space-y-2">
              {briefing.recommendedActionsNext6Hours.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-navy-950 p-2.5 rounded-xl border border-navy-800 text-xs">
                  <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 font-mono font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-slate-200">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Areas Requiring Evacuation */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-navy-800 pb-2">
              <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>3. Areas Requiring Evacuation (P0 / P1 Wards)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {briefing.p0AndP1Villages.length} Priority Wards
              </span>
            </div>

            <div className="space-y-2">
              {briefing.p0AndP1Villages.map((v, i) => (
                <div key={i} className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{v.villageName}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          v.priority === 'P0' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
                        }`}
                      >
                        {v.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Population: {formatIndianNumber(v.population)} residents
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-teal-300">
                    <span className="text-slate-400 text-[10px] block">Safe Destination:</span>
                    <span>{v.recommendedShelter}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Critical Infrastructure Actions */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold border-b border-navy-800 pb-2">
              <Building2 className="w-4 h-4" />
              <span>4. Critical Infrastructure Protective Actions</span>
            </div>
            <div className="space-y-2">
              {briefing.criticalAssetsRequiringAction.map((asset, i) => (
                <div key={i} className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-white">{asset.assetName}</span>
                    <span className="text-red-400 font-bold">{asset.riskScore}/100 Risk</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{asset.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Shelters & Routes, Public Advisory, Limitations (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 5. Shelter & Route Status */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold border-b border-navy-800 pb-2">
              <Home className="w-4 h-4" />
              <span>5. Shelter Capacity &amp; Route Status</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-400 block">Total Spaces</span>
                <span className="text-white font-bold text-sm">
                  {formatIndianNumber(briefing.shelterCapacityStatus.totalCapacity)}
                </span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-400 block">Available Beds</span>
                <span className="text-teal-300 font-bold text-sm">
                  {formatIndianNumber(briefing.shelterCapacityStatus.availableBeds)}
                </span>
              </div>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Corridor Vulnerability</div>
              <div className="text-slate-200 mt-1">
                Elevated Route 2 &amp; National Highway 16 remain dry. Coastal Road and Riverbend Bridge restricted for heavy vehicles.
              </div>
            </div>
          </div>

          {/* 6. Public Advisory with Tabs (English / Hindi) */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-navy-800 pb-2">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
                <Languages className="w-4 h-4" />
                <span>6. Public Warning &amp; Citizen Advisory</span>
              </div>

              {/* Language Tabs */}
              <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-lg border border-navy-800 font-mono text-xs">
                <button
                  onClick={() => setActiveAdvisoryLang('en')}
                  className={`px-2.5 py-0.5 rounded transition ${
                    activeAdvisoryLang === 'en' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setActiveAdvisoryLang('hi')}
                  className={`px-2.5 py-0.5 rounded transition ${
                    activeAdvisoryLang === 'hi' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 text-xs font-mono leading-relaxed whitespace-pre-line text-slate-200">
              {activeAdvisoryLang === 'en' ? briefing.englishPublicAdvisory : briefing.hindiPublicAdvisory}
            </div>
          </div>

          {/* 7. Confidence & Limitations */}
          <div className="bg-navy-900 border border-navy-750 rounded-2xl p-4.5 space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs font-bold border-b border-navy-800 pb-2">
              <Info className="w-4 h-4" />
              <span>7. Confidence &amp; Prototype Limitations</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5">
              <p><b>Model Confidence:</b> {briefing.modelConfidence}</p>
              <p className="text-slate-400 text-[11px]">{briefing.limitations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Footer */}
      <div className="bg-navy-950 border border-navy-800 p-3 rounded-xl text-center text-xs font-mono text-slate-400">
        AI-generated briefing is advisory only. Final action requires authorized disaster-management review.
      </div>
    </div>
  );
};
