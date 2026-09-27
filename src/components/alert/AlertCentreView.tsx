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
  Sparkles
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { generateCapDraft } from '../../services/mockBriefingGenerator';
import { CapAlertDraft } from '../../types/disaster';

export const AlertCentreView: React.FC = () => {
  const { simulationSummary, alerts, addAlert, updateAlertStatus, modeBadgeText } = useAppState();

  const [alertType, setAlertType] = useState<string>('Evacuation');
  const [selectedChannels, setSelectedChannels] = useState<('SMS' | 'WhatsApp' | 'Sirens' | 'Megaphone')[]>([
    'SMS',
    'WhatsApp',
    'Sirens',
  ]);
  const [copied, setCopied] = useState<boolean>(false);
  const [approvedDrafts, setApprovedDrafts] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');

  // Generate dynamic CAP draft based on current simulation results
  const capDraft: CapAlertDraft = useMemo(() => {
    return generateCapDraft(simulationSummary, alertType);
  }, [simulationSummary, alertType]);

  const toggleChannel = (ch: 'SMS' | 'WhatsApp' | 'Sirens' | 'Megaphone') => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(capDraft.jsonPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleApproval = (id: string) => {
    setApprovedDrafts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1600px] mx-auto font-sans">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertOctagon className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
              Standardized Public Safety Alert Protocol (CAP v1.2)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Emergency CAP Alert Center &amp; Broadcast Dispatcher
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Generates standardized ITU-T X.1303 / OASIS CAP v1.2 alert schemas from model estimates.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex-shrink-0">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Simulation draft — human approval required</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Alert Composer & Parameters (6 Cols) */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Simulated CAP Alert Configuration</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
              Draft Status: Human Review Mandated
            </span>
          </div>

          <div className="space-y-3.5 text-xs font-sans">
            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Select Alert Domain / Hazard
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {['Evacuation', 'Flood', 'Wind'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAlertType(type)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      alertType === type
                        ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                        : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
                    }`}
                  >
                    {type === 'Evacuation' ? 'Evacuation Order' : type === 'Flood' ? 'Surge Inundation' : 'Gale Winds'}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Attributes Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                <span className="text-slate-500 block text-[9px] uppercase">Severity</span>
                <span className={`font-bold ${
                  capDraft.severity === 'Critical' ? 'text-rose-400' :
                  capDraft.severity === 'Severe' ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  {capDraft.severity}
                </span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                <span className="text-slate-500 block text-[9px] uppercase">Urgency</span>
                <span className="font-bold text-amber-300">{capDraft.urgency}</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                <span className="text-slate-500 block text-[9px] uppercase">Certainty</span>
                <span className="font-bold text-cyan-300">{capDraft.certainty}</span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                <span className="text-slate-500 block text-[9px] uppercase">Time Window</span>
                <span className="font-bold text-purple-300">{capDraft.timeWindow}</span>
              </div>
            </div>

            {/* Target Area */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Impacted Geographic Zone</label>
              <div className="bg-navy-950 border border-navy-750 rounded-lg p-2.5 text-slate-200 font-mono text-xs">
                {capDraft.areaDesc}
              </div>
            </div>

            {/* Villages in scope */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Prioritized Villages / Wards</label>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {capDraft.affectedVillages.map((v) => (
                  <span key={v} className="bg-rose-950/40 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Broadcast Channels Selection */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Dissemination Gateways (Simulated)</label>
              <div className="flex flex-wrap gap-2">
                {(['SMS', 'WhatsApp', 'Sirens', 'Megaphone'] as const).map((ch) => {
                  const isSelected = selectedChannels.includes(ch);
                  return (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold'
                          : 'bg-navy-950 text-slate-400 border-navy-800'
                      }`}
                    >
                      {ch === 'SMS' && <Smartphone className="w-3.5 h-3.5" />}
                      {ch === 'WhatsApp' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                      {ch === 'Sirens' && <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                      {ch === 'Megaphone' && <Radio className="w-3.5 h-3.5 text-purple-400" />}
                      <span>{ch}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Human Approval Sign-off Simulation */}
            <div className="pt-2 border-t border-navy-800/80">
              <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Designated Officer Human Approval</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {approvedDrafts[capDraft.identifier] ? 'Signed & Authorized for Simulation Dispatch' : 'Draft stage — requires affirmative sign-off'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleApproval(capDraft.identifier)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    approvedDrafts[capDraft.identifier]
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                      : 'bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30'
                  }`}
                >
                  {approvedDrafts[capDraft.identifier] ? '✓ Approved' : 'Sign Off Draft'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: CAP JSON & Readable Message Preview (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-navy-750 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'preview' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Human-Readable Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'json' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>CAP JSON Payload</span>
                </button>
              </div>

              {activeTab === 'json' && (
                <button
                  onClick={handleCopyJson}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            {activeTab === 'preview' ? (
              <div className="space-y-3 text-xs">
                {/* Visual Message Card */}
                <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-3">
                  <div className="flex items-center justify-between font-mono text-[11px] border-b border-navy-800 pb-2">
                    <span className="text-cyan-400 font-bold">{capDraft.identifier}</span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                      {capDraft.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-rose-300 leading-snug">
                      {capDraft.headline}
                    </h4>
                    <p className="text-slate-300 mt-1.5 leading-relaxed">
                      {capDraft.description}
                    </p>
                  </div>

                  <div className="bg-navy-900 p-3 rounded-lg border border-navy-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                      Recommended Action Directive:
                    </span>
                    <p className="text-slate-200 text-xs font-medium leading-relaxed">
                      {capDraft.instruction}
                    </p>
                  </div>

                  <div className="pt-1 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>Sender: {capDraft.sender}</span>
                    <span>Scope: {capDraft.scope}</span>
                  </div>
                </div>

                {/* Statutory Guardrail Notice */}
                <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-800/40 text-[11px] text-amber-200/80 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Hackathon Safe Guardrail:</strong> No live telecom dispatch occurs. This module demonstrates automated translation of physical simulation parameters into compliant Common Alerting Protocol data structures for mock district disaster drills.
                  </div>
                </div>
              </div>
            ) : (
              <pre className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 text-[10px] font-mono text-emerald-300/90 overflow-x-auto max-h-[380px] leading-tight select-all">
                {capDraft.jsonPayload}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

