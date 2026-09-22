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
  RefreshCw
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { CYCLONE_METADATA } from '../../data/cycloneData';
import { MOCK_VILLAGES } from '../../data/villageData';
import { MOCK_ASSETS } from '../../data/infrastructureData';

export const AIBriefingView: React.FC = () => {
  const { simulationParams, setActiveTab } = useAppState();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTabLang, setActiveTabLang] = useState<'en' | 'hi' | 'or' | 'bn'>('en');

  const currentWind = Math.round(135 * simulationParams.windSpeedMultiplier);
  const currentSurge = (3.4 + simulationParams.surgeHeightOffset).toFixed(1);

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

  const SYSTEM_PROMPT = `You are a disaster-management decision-support assistant. Use only the supplied structured data. Do not invent official warnings, cyclone values, infrastructure, shelters or evacuation orders. Clearly distinguish official data, satellite observations and model estimates. Generate concise, actionable, multilingual recommendations. Always include uncertainty, timestamp and limitations.`;

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
              Gemini Multimodal Reasoning Synthesizer
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Automated Situation Report &amp; Tactical Briefing
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Structured decision-support generator transforming multi-layer satellite observations and infrastructure telemetry into actionable executive directives.
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
            <span>{isGenerating ? 'Synthesizing Data...' : 'Generate AI Briefing'}</span>
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
                <span className="font-bold text-white">SITREP #04: Cyclone Varuna Decision Support</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">Timestamp: 2026-09-22 06:00 IST</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  Confidence: 88.4%
                </span>
              </div>
            </div>

            <div className="p-5 space-y-6 text-slate-200 text-xs leading-relaxed">
              {/* 1. Executive Summary */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-cyan-300 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1">
                  1. Executive Summary (T-24h Window)
                </h3>
                <p>
                  <strong>Cyclone Varuna</strong> is currently classified as a <strong>Severe Cyclonic Storm</strong> over the Bay of Bengal, packing sustained winds of <strong>{currentWind} km/h</strong> and approaching Sundar Coast District at 18 km/h. Landfall is projected in approximately <strong>24 hours</strong> near the South Sector Delta.
                </p>
                <p>
                  Hydrodynamic modeling indicates a peak storm surge of <strong>{currentSurge} meters</strong> coinciding with astronomical high tide, rendering coastal highway <strong>SH-12 impassable</strong> at Km 14.2 due to 0.8m sea water inundation. An estimated <strong>2.84 lakh residents</strong> are exposed across 8 administrative wards, with <strong>22,600 classified under Priority P0 (immediate mandatory evacuation)</strong>.
                </p>
              </section>

              {/* 2. Top Five Risks */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-red-400 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1">
                  2. Top Five Operational Risks
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 font-sans pl-1">
                  <li>
                    <strong>Tidal Surge Inundation Cutoff:</strong> Coastal Ward 7 and Mangrove Hamlet primary road links are submerged, creating isolation risk.
                  </li>
                  <li>
                    <strong>Hospital Infrastructure Compromise:</strong> Sundar District General Hospital ground floor (ICU/NICU) faces 1.4m water ingress.
                  </li>
                  <li>
                    <strong>Power Grid Salt-Spray Flashover:</strong> 220/33kV Main Substation switchyard trench is at risk of surge backflow.
                  </li>
                  <li>
                    <strong>Shelter Capacity Deficit:</strong> 92,000-person overflow gap requiring pre-deployment of school community halls.
                  </li>
                  <li>
                    <strong>High Dependent Vulnerability:</strong> 7,175 elderly persons and young children situated in low-elevation thatch-roof settlements.
                  </li>
                </ol>
              </section>

              {/* 3. Critical Infrastructure Directives */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-amber-300 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1">
                  3. Critical Infrastructure Immediate Directives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                  <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                    <div className="text-white font-bold text-[11px]">🏥 District Hospital:</div>
                    <div className="text-slate-300 text-[10px] mt-0.5">Move ICU to 2nd floor; start elevated diesel generator.</div>
                  </div>
                  <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                    <div className="text-white font-bold text-[11px]">⚡ 33kV Coastal Substation:</div>
                    <div className="text-slate-300 text-[10px] mt-0.5">De-energize coastal Feeders 3 &amp; 4 before peak surge.</div>
                  </div>
                  <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                    <div className="text-white font-bold text-[11px]">🌉 SH-12 Estuary Bridge:</div>
                    <div className="text-slate-300 text-[10px] mt-0.5">Suspend commercial trucking; monitor pier scour hourly.</div>
                  </div>
                  <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                    <div className="text-white font-bold text-[11px]">📡 BSNL 120m Telecom Tower:</div>
                    <div className="text-slate-300 text-[10px] mt-0.5">Activate HAM Radio backup &amp; inter-carrier roaming.</div>
                  </div>
                </div>
              </section>

              {/* 4. Village Evacuation Allocation */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-cyan-300 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1">
                  4. Ward Evacuation &amp; Routing Plan
                </h3>
                <div className="bg-navy-950 p-3 rounded-lg border border-navy-800 font-mono text-[11px] space-y-1">
                  <div className="text-red-400 font-bold">
                    • Coastal Ward 7 (4,850 pop): Rerouted to Shelter B via Elevated Corridor 2.
                  </div>
                  <div className="text-red-400 font-bold">
                    • Delta Nagar (8,200 pop): Mandatory evacuation to Shelter C and Port Stadium.
                  </div>
                  <div className="text-orange-400">
                    • Sundar Pur &amp; East Embankment: Staged evacuation to Shelter E within 6 hours.
                  </div>
                </div>
              </section>

              {/* 5. Recommended Actions for Next 6 Hours */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-emerald-400 font-mono uppercase tracking-wide flex items-center gap-2 border-b border-navy-800 pb-1">
                  5. Action Directives for Next 6 Hours (DEO Checklist)
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Complete 100% P0 evacuation before sunset and deterioration of ambient visibility.</li>
                  <li>Position chainsaw and tree clearance disaster response teams along Elevated Corridor 2.</li>
                  <li>Confirm 48-hour drinking water tanker pre-fill at Shelters B, D, and E.</li>
                  <li>Transmit CAP-format multilingual public broadcasts across SMS and local warning sirens.</li>
                </ul>
              </section>

              {/* 6. Multilingual Public Advisories */}
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-navy-800 pb-1">
                  <h3 className="font-bold text-sm text-purple-300 font-mono uppercase tracking-wide flex items-center gap-2">
                    <Globe className="w-4 h-4" /> 6. Multilingual Public Advisories
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
                        "EMERGENCY CYCLONE ADVISORY: Cyclone Varuna is approaching Sundar Coast. High storm surge and severe winds are expected within 24 hours. Residents of Coastal Ward 7 and Delta Nagar must move immediately to designated cyclone shelters. Do not use SH-12 coastal road; follow police diversions via Elevated Route 2 to Shelter B. Carry emergency dry rations, medical kits, and official IDs."
                      </p>
                    </div>
                  )}

                  {activeTabLang === 'hi' && (
                    <div className="space-y-2">
                      <div className="font-bold text-cyan-300 font-mono">[सार्वजनिक प्रसारण - हिंदी]</div>
                      <p>
                        "आपातकालीन चक्रवात चेतावनी: चक्रवात वरुणा सुंदर तट की ओर तेजी से बढ़ रहा है। अगले 24 घंटों में 135 किमी/घंटा हवाएं और भीषण ज्वारीय लहरें आने की आशंका है। तटीय वार्ड 7 और डेल्टा नगर के निवासी तुरंत सुरक्षित चक्रवात आश्रय में जाएं। जलमग्न एसएच-12 मार्ग का उपयोग न करें; एलिवेटेड रूट 2 से शेल्टर बी तक जाएं।"
                      </p>
                    </div>
                  )}

                  {activeTabLang === 'or' && (
                    <div className="space-y-2">
                      <div className="font-bold text-cyan-300 font-mono">[ସର୍ବସାଧାରଣ ସୂଚନା - ଓଡ଼ିଆ]</div>
                      <p>
                        "ଜରୁରୀକାଳୀନ ବାତ୍ୟା ସତର୍କତା: ବାତ୍ୟା ବରୁଣ ସୁନ୍ଦର ଉପକୂଳ ଆଡକୁ ଅଗ୍ରସର ହେଉଛି। ଆଗାମୀ ୨୪ ଘଣ୍ଟା ମଧ୍ୟରେ ପ୍ରବଳ ବର୍ଷା ଓ ଜୁଆର ଆସିବାର ସମ୍ଭାବନା ରହିଛି। ଉପକୂଳ ୱାର୍ଡ ୭ ଏବଂ ଡେଲ୍ଟା ନଗରର ସମସ୍ତ ବାସିନ୍ଦା ତୁରନ୍ତ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯାଆନ୍ତୁ। SH-12 ରାସ୍ତା ବଦଳରେ ଏଲିଭେଟେଡ୍ ରୁଟ୍ ୨ ବ୍ୟବହାର କରନ୍ତୁ।"
                      </p>
                    </div>
                  )}

                  {activeTabLang === 'bn' && (
                    <div className="space-y-2">
                      <div className="font-bold text-cyan-300 font-mono">[জনসাধারণের জন্য সতর্কবার্তা - বাংলা]</div>
                      <p>
                        "জরুরি ঘূর্ণিঝড় সতর্কতা: ঘূর্ণিঝড় বরুণ সুন্দর উপকূলের দিকে ধেয়ে আসছে। পরবর্তী ২৪ ঘণ্টায় তীব্র জলোচ্ছ্বাস এবং দমকা বাতাসের সম্ভাবনা রয়েছে। উপকূলীয় ওয়ার্ড ৭ ও ডেল্টা নগরের বাসিন্দাদের অবিলম্বে নিরাপদ আশ্রয়কেন্দ্রে যেতে অনুরোধ করা হচ্ছে।"
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* 7. Disclaimer & Limitations */}
              <section className="bg-navy-950/80 p-3.5 rounded-xl border border-navy-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-amber-400 font-mono uppercase">
                  Verification &amp; Statutory Disclaimer:
                </div>
                <p>
                  This synthetic prototype advisory was generated for demonstration purposes. It does not supersede official bulletins from the India Meteorological Department (IMD) or National Disaster Management Authority (NDMA). All emergency orders must be validated by the District Collector / DEO.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* AI Reasoning Trace & Integration Prompt (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Reasoning Trace Card */}
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-navy-750 pb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Multimodal Reasoning Trace
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Step-by-step risk weight contribution factors calculated for the active scenario:
            </p>

            <div className="space-y-2 font-mono text-xs">
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Low Elevation Factor:</span>
                <span className="text-red-400 font-bold">+22 pts</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Wind Gale Exposure:</span>
                <span className="text-orange-400 font-bold">+18 pts</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Rainfall Accumulation:</span>
                <span className="text-blue-400 font-bold">+15 pts</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Critical Infra Exposure:</span>
                <span className="text-purple-400 font-bold">+11 pts</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                <span className="text-slate-300">Shelter Transit Distance:</span>
                <span className="text-amber-400 font-bold">+09 pts</span>
              </div>
            </div>
          </div>

          {/* Gemini Integration System Prompt Contract */}
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-navy-750 pb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Gemini System Prompt Schema
              </h3>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-[11px] font-mono text-cyan-300/90 leading-relaxed max-h-48 overflow-y-auto">
              {SYSTEM_PROMPT}
            </div>

            <div className="text-[10px] text-slate-400 font-mono">
              Ready for Google GenAI SDK (gemini-1.5-pro / gemini-2.0-flash) tool calling integration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
