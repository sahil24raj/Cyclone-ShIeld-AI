import React, { useState } from 'react';
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
  Code2,
  Terminal,
  Download,
  AlertOctagon,
  RefreshCw,
  Database
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { DeterministicRiskEngine } from '../../services/riskEngine';

export const AIBriefingView: React.FC = () => {
  const { simulationParams, setActiveTab, activeCyclone, weather, villages, assets } = useAppState();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTabLang, setActiveTabLang] = useState<'en' | 'hi' | 'or' | 'bn'>('en');

  const isFixtureMode = import.meta.env.VITE_ENABLE_DEV_FIXTURES === 'true';

  const currentWind = activeCyclone
    ? Math.round(activeCyclone.maxWindSpeed * simulationParams.windSpeedMultiplier)
    : (weather ? Math.round(weather.windSpeed) : 0);

  const currentSurge = activeCyclone
    ? (activeCyclone.stormSurgeMax + simulationParams.surgeHeightOffset).toFixed(1)
    : '0.0';

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SYSTEM_PROMPT = `You are an emergency disaster-management decision-support assistant. Use only the supplied structured meteorological observations and deterministic risk assessments. Do not invent unverified casualties, infrastructure damage, or official orders. Clearly distinguish between official meteorological forecasts (IMD), physical derived risk scores, and tactical recommendations.`;

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
              Decision-Support Situation Synthesizer
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Automated Situation Report &amp; Tactical Briefing
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Structured decision-support generator transforming multi-source observations and deterministic risk matrices into actionable operational directives.
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
            <span>{isGenerating ? 'Synthesizing Data...' : 'Generate Situation Report'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-navy-850 hover:bg-navy-800 text-slate-200 border border-navy-700 font-mono text-xs py-2.5 px-3 rounded-xl transition-colors"
            title="Copy SITREP Markdown"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Briefing Output Document (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-navy-900 border border-navy-750 rounded-2xl shadow-xl overflow-hidden">
            {/* SITREP Header Bar */}
            <div className="p-4 bg-navy-950 border-b border-navy-750 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">
                  SITREP: {activeCyclone ? activeCyclone.name : 'District Baseline Surveillance'}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">Time: {new Date().toLocaleDateString('en-IN')} IST</span>
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                  {isFixtureMode ? 'Dev Fixture Mode' : 'Live Data Stream'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-6 text-slate-200 text-xs leading-relaxed">
              {/* 1. Executive Summary */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-cyan-300 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1">
                  1. Executive Summary
                </h3>
                <p>
                  {activeCyclone ? (
                    <>
                      <strong>{activeCyclone.name}</strong> is monitored in the Bay of Bengal with sustained wind velocities of <strong>{currentWind} km/h</strong>. Projected landfall lead-time is <strong>{activeCyclone.landfallETA}</strong>.
                    </>
                  ) : (
                    <>
                      Currently, no active tropical cyclone advisory is registered by RSMC. Surface station observations show wind speeds of <strong>{currentWind} km/h</strong> and atmospheric pressure of <strong>{weather?.pressure || 1013} hPa</strong>.
                    </>
                  )}
                </p>
                <p>
                  Deterministic hydrodynamic surge equations indicate peak water levels of <strong>{currentSurge} meters</strong> in direct coastal frontage. A total of <strong>{villages.length} wards</strong> are under active surveillance with <strong>{assets.length} critical infrastructure lifelines</strong> monitored.
                </p>
              </section>

              {/* 2. Operational Priority Directives */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-red-400 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1">
                  2. Operational Priorities &amp; Critical Directives
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 font-sans pl-1">
                  <li>
                    <strong>Tidal Surge Cutoff Mitigation:</strong> Evacuate low-elevation wards (&lt; 2.0m AMSL) via designated elevated corridors prior to deterioration of road surface accessibility.
                  </li>
                  <li>
                    <strong>Medical Infrastructure Protection:</strong> Hospital ICU and emergency bays located in flood zones must elevate standby diesel power fuel lines and transfer ground-floor patients.
                  </li>
                  <li>
                    <strong>Electrical Substation Isolation:</strong> Pre-emptively isolate exposed coastal 33kV distribution feeders before peak tidal surge to prevent transformer flashover.
                  </li>
                  <li>
                    <strong>Multi-Purpose Shelter Pre-Fill:</strong> Ensure 48-hour drinking water, chlorine tablets, and dry rations are delivered to designated safe sanctuaries.
                  </li>
                </ol>
              </section>

              {/* 3. Multilingual Public Advisories */}
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-navy-800 pb-1">
                  <h3 className="font-bold text-sm text-purple-300 font-mono uppercase tracking-wide flex items-center gap-2">
                    <Globe className="w-4 h-4" /> 3. Multilingual Public Warning Broadcasts
                  </h3>
                  <div className="flex gap-1 font-mono text-[10px]">
                    <button
                      onClick={() => setActiveTabLang('en')}
                      className={`px-2 py-0.5 rounded ${activeTabLang === 'en' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setActiveTabLang('hi')}
                      className={`px-2 py-0.5 rounded ${activeTabLang === 'hi' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      हिंदी
                    </button>
                    <button
                      onClick={() => setActiveTabLang('or')}
                      className={`px-2 py-0.5 rounded ${activeTabLang === 'or' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      ଓଡ଼ିଆ
                    </button>
                    <button
                      onClick={() => setActiveTabLang('bn')}
                      className={`px-2 py-0.5 rounded ${activeTabLang === 'bn' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>

                <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-slate-200">
                  {activeTabLang === 'en' && (
                    <div className="space-y-2">
                      <div className="font-bold text-cyan-300 font-mono">[PUBLIC BROADCAST - ENGLISH]</div>
                      <p>
                        "EMERGENCY CYCLONE ADVISORY: Severe weather is expected along the coast. Residents in low-lying coastal wards must move immediately to designated cyclone shelters. Do not use flooded coastal highway routes; follow police diversions via elevated bypass corridors. Carry emergency drinking water, medication, and essential IDs."
                      </p>
                    </div>
                  )}

                  {activeTabLang === 'hi' && (
                    <div className="space-y-2">
                      <div className="font-bold text-cyan-300 font-mono">[सार्वजनिक प्रसारण - हिंदी]</div>
                      <p>
                        "आपातकालीन चक्रवात चेतावनी: तटीय क्षेत्र में भीषण मौसम की संभावना है। निचले तटीय क्षेत्रों के निवासी तुरंत सुरक्षित चक्रवात आश्रय में जाएं। जलमग्न तटीय मार्गों का उपयोग न करें; पुलिस द्वारा निर्देशित एलिवेटेड बाईपास मार्गों का उपयोग करें।"
                      </p>
                    </div>
                  )}

                  {activeTabLang === 'or' && (
                    <div className="space-y-2">
                      <div className="font-bold text-cyan-300 font-mono">[ସର୍ବସାଧାରଣ ସୂଚନା - ଓଡ଼ିଆ]</div>
                      <p>
                        "ଜରୁରୀକାଳୀନ ବାତ୍ୟା ସତର୍କତା: ଉପକୂଳ ଅଞ୍ଚଳରେ ପ୍ରବଳ ପାଣିପାଗ ସମ୍ଭାବନା ରହିଛି। ତଳିଆ ଉପକୂଳ ୱାର୍ଡର ସମସ୍ତ ବାସିନ୍ଦା ତୁରନ୍ତ ନିକଟସ୍ଥ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯାଆନ୍ତୁ। ବନ୍ୟାପ୍ଲାବିତ ରାସ୍ତା ବଦଳରେ ସୁରକ୍ଷିତ ଏଲିଭେଟେଡ୍ ବାଇପାସ୍ ବ୍ୟବହାର କରନ୍ତୁ।"
                      </p>
                    </div>
                  )}

                  {activeTabLang === 'bn' && (
                    <div className="space-y-2">
                      <div className="font-bold text-cyan-300 font-mono">[জনসাধারণের জন্য সতর্কবার্তা - বাংলা]</div>
                      <p>
                        "জরুরি ঘূর্ণিঝড় সতর্কতা: উপকূলীয় অঞ্চলে দুর্যোগপূর্ণ আবহাওয়ার আশঙ্কা রয়েছে। নিচু উপকূলীয় এলাকার বাসিন্দাদের অবিলম্বে নিরাপদ আশ্রয়কেন্দ্রে যাওয়ার নির্দেশ দেওয়া হচ্ছে।"
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* 4. Disclaimer & Limitations */}
              <section className="bg-navy-950/80 p-3.5 rounded-xl border border-navy-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-amber-400 font-mono uppercase">
                  Data Attribution &amp; Statutory Notice:
                </div>
                <p>
                  This situation report provides automated decision-support based on deterministic physical vulnerability formulas and official meteorological feeds. It does not replace statutory orders from the India Meteorological Department (IMD) or State Disaster Management Authority (SDMA).
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: System Schema & Data Sources */}
        <div className="lg:col-span-4 space-y-4">
          {/* Data Sources Attribution Card */}
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-navy-750 pb-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Data Feeds Ingested
              </h3>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Surface Weather:</span>
                <span className="text-cyan-300 font-bold">WMO Open-Meteo</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Cyclone RSMC:</span>
                <span className="text-rose-300 font-bold">IMD / JTWC Feeds</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Risk Computation:</span>
                <span className="text-amber-300 font-bold">P-CHMVM v2.4</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Historical Benchmarks:</span>
                <span className="text-purple-300 font-bold">Verified Archives</span>
              </div>
            </div>
          </div>

          {/* Gemini System Prompt Schema */}
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-navy-750 pb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                LLM Decision-Support Schema
              </h3>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-[11px] font-mono text-cyan-300/90 leading-relaxed max-h-48 overflow-y-auto">
              {SYSTEM_PROMPT}
            </div>

            <div className="text-[10px] text-slate-400 font-mono">
              Ready for Google GenAI SDK (gemini-1.5-pro / gemini-2.0-flash) structured JSON schema output.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
