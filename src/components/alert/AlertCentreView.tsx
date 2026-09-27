import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  Send,
  CheckCircle2,
  Code,
  Radio,
  FileText,
  Smartphone,
  MessageSquare,
  Volume2,
  Clock,
  ShieldAlert,
  Copy,
  Check,
  Eye,
  AlertTriangle,
  Lock,
  Sparkles,
  CheckCheck,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { generateCapDraft } from '../../services/mockBriefingGenerator';
import { CapAlertDraft } from '../../types/disaster';

export const AlertCentreView: React.FC = () => {
  const { simulationSummary, scenarioInputs } = useAppState();

  const [alertType, setAlertType] = useState<string>('Evacuation');
  const [activeWorkflowStage, setActiveWorkflowStage] = useState<'Draft' | 'Review' | 'Approve' | 'Simulated Dispatch'>('Review');
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [mobileLang, setMobileLang] = useState<'en' | 'hi'>('en');
  const [copied, setCopied] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // Generate dynamic CAP draft based on current simulation results
  const capDraft: CapAlertDraft = useMemo(() => {
    return generateCapDraft(simulationSummary, alertType);
  }, [simulationSummary, alertType]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(capDraft.jsonPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const workflowStages: ('Draft' | 'Review' | 'Approve' | 'Simulated Dispatch')[] = [
    'Draft',
    'Review',
    'Approve',
    'Simulated Dispatch',
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto font-sans select-none text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <AlertOctagon className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold">
              CAP Alert Studio
            </span>
            <span className="bg-navy-950 border border-navy-750 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
              OASIS CAP v1.2 Protocol
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Alert Drafts &amp; Public Warning Studio
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Communication workflow for drafting, reviewing, and approving Common Alerting Protocol emergency bulletins.
          </p>
        </div>

        {/* Human Approval Required Badge */}
        <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-mono font-bold">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Human approval required before dispatch</span>
        </div>
      </div>

      {/* FOUR-STAGE PROGRESS LINE */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3 font-bold">
          Alert Authorization Pipeline
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {workflowStages.map((stage, idx) => {
            const isCurrent = activeWorkflowStage === stage;
            const isCompleted = workflowStages.indexOf(activeWorkflowStage) > idx;

            return (
              <button
                key={stage}
                onClick={() => {
                  if (stage === 'Approve') setIsApproved(true);
                  setActiveWorkflowStage(stage);
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950'
                    : isCompleted
                    ? 'bg-navy-950/80 border-teal-500/40 text-teal-300'
                    : 'bg-navy-950 border-navy-800 text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    isCurrent
                      ? 'bg-cyan-500 text-navy-950'
                      : isCompleted
                      ? 'bg-teal-500 text-navy-950'
                      : 'bg-navy-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isCurrent ? 'text-white' : ''}`}>
                    {stage}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {stage === 'Draft'
                      ? 'Synthesized by AI'
                      : stage === 'Review'
                      ? 'EOC Officer Check'
                      : stage === 'Approve'
                      ? 'Authorized Signature'
                      : 'Simulated Sandbox Only'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT: Alert Configuration (Left) & Mobile/CAP Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: Alert Parameters & Draft Message (6 Cols) */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>CAP Alert Metadata &amp; Content</span>
            </h3>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded font-bold">
              Severity: Extreme
            </span>
          </div>

          {/* Alert Type Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Alert Category</label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {['Evacuation', 'Infrastructure Warning', 'Post-Landfall Advisory'].map((t) => (
                <button
                  key={t}
                  onClick={() => setAlertType(t)}
                  className={`p-2 rounded-xl border transition ${
                    alertType === t
                      ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Structured Metadata Fields */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
              <span className="text-[10px] text-slate-400 block uppercase">Target Locations</span>
              <span className="text-white font-bold">{capDraft.affectedVillages.join(', ')}</span>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
              <span className="text-[10px] text-slate-400 block uppercase">Validity Window</span>
              <span className="text-amber-300 font-bold">T–{scenarioInputs.landfallHours}h to Landfall +6h</span>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
              <span className="text-[10px] text-slate-400 block uppercase">Intended Audience</span>
              <span className="text-white font-bold">Coastal Residents &amp; Relief Squads</span>
            </div>

            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800">
              <span className="text-[10px] text-slate-400 block uppercase">Supported Languages</span>
              <span className="text-teal-300 font-bold">English, Hindi, Bengali, Odia</span>
            </div>
          </div>

          {/* Draft Message Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Draft Bulletin Body</label>
            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 text-xs leading-relaxed text-slate-200 font-mono whitespace-pre-line">
              {capDraft.instruction}
            </div>
          </div>

          {/* Stage Action Button */}
          <div className="pt-2 border-t border-navy-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-mono">
              Status: <b className="text-amber-400">{activeWorkflowStage} State</b>
            </div>

            <button
              onClick={() => {
                setIsApproved(true);
                setActiveWorkflowStage('Approve');
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isApproved ? 'Approved by Officer' : 'Approve Draft (Simulated)'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Mobile Alert Preview & CAP JSON Tab (6 Cols) */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-750 p-4.5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Warning Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'json'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>CAP XML/JSON Payload</span>
              </button>
            </div>

            {activeTab === 'preview' ? (
              <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-lg border border-navy-800 font-mono text-xs">
                <button
                  onClick={() => setMobileLang('en')}
                  className={`px-2 py-0.5 rounded transition ${
                    mobileLang === 'en' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setMobileLang('hi')}
                  className={`px-2 py-0.5 rounded transition ${
                    mobileLang === 'hi' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  HI
                </button>
              </div>
            ) : (
              <button
                onClick={handleCopyJson}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            )}
          </div>

          {activeTab === 'preview' ? (
            /* Realistic Mobile Device Mockup */
            <div className="flex justify-center p-2">
              <div className="w-[320px] bg-slate-950 border-4 border-slate-700 rounded-[32px] p-3 shadow-2xl space-y-3">
                {/* Speaker Notch */}
                <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto" />

                {/* Emergency Cell Broadcast Notification */}
                <div className="bg-red-950/90 border-2 border-red-500 rounded-2xl p-3 text-left space-y-2 shadow-xl">
                  <div className="flex items-center gap-2 text-red-300 font-mono text-[11px] font-bold">
                    <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
                    <span>EMERGENCY ALERT / आपातकालीन चेतावनी</span>
                  </div>

                  <p className="text-xs text-white leading-snug font-sans font-semibold">
                    {mobileLang === 'en'
                      ? `CYCLONE VARUNA: P0 Evacuation ordered for ${capDraft.affectedVillages.join(', ')}. Proceed via Elevated Route 2 to Shelter B immediately. Avoid Coastal Road.`
                      : `चक्रवात वरुणा: ${capDraft.affectedVillages.join(', ')} के लिए तुरंत खाली करने का आदेश। कृपया एलिवेटेड रूट 2 से शेल्टर बी जाएं। तटीय मार्ग से बचें।`}
                  </p>

                  <div className="text-[10px] font-mono text-slate-400 border-t border-red-900 pt-1 flex justify-between">
                    <span>District Disaster Authority</span>
                    <span>T–{scenarioInputs.landfallHours}h Landfall</span>
                  </div>
                </div>

                {/* SMS Card */}
                <div className="bg-navy-900/90 border border-navy-750 rounded-xl p-2.5 text-[11px] text-slate-300 font-sans space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">SMS Broadcast Dispatch</div>
                  <p>
                    Emergency helpline: 1077 / 112. Medical assistance pre-positioned at Sundar District Hospital.
                  </p>
                </div>

                {/* Home Indicator */}
                <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
              </div>
            </div>
          ) : (
            /* CAP JSON Code Block */
            <div className="h-[360px] overflow-y-auto bg-navy-950 p-3 rounded-xl border border-navy-800 font-mono text-[11px] text-cyan-300 leading-relaxed">
              <pre>{capDraft.jsonPayload}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
