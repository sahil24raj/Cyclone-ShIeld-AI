import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { CAPAlert, Language } from '../../types';

export const AlertCentreView: React.FC = () => {
  const { alerts, addAlert, updateAlertStatus } = useAppState();

  const [alertType, setAlertType] = useState<string>('Evacuation');
  const [severity, setSeverity] = useState<CAPAlert['severity']>('Critical');
  const [urgency, setUrgency] = useState<CAPAlert['urgency']>('Immediate');
  const [targetArea, setTargetArea] = useState<string>('Sundar Coast District - Wards 7 & Delta Sector');
  const [headline, setHeadline] = useState<string>(
    'URGENT MANDATORY EVACUATION: Use Elevated Corridor 2 to Shelter B'
  );
  const [instruction, setInstruction] = useState<string>(
    'Move to designated cyclone shelter before 18:00 IST. Do not attempt SH-12 coastal route due to 0.8m storm surge water. Follow police diversion signs.'
  );
  const [selectedChannels, setSelectedChannels] = useState<('SMS' | 'WhatsApp' | 'Sirens' | 'Megaphone')[]>([
    'SMS',
    'WhatsApp',
    'Sirens',
  ]);
  const [alertLang, setAlertLang] = useState<Language>('en');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleChannel = (ch: 'SMS' | 'WhatsApp' | 'Sirens' | 'Megaphone') => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleCompose = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: CAPAlert = {
      identifier: `CSAI-2026-${String(alerts.length + 1).padStart(3, '0')}`,
      sender: 'CycloneShield AI Prototype',
      sent: new Date().toISOString(),
      status: 'Draft',
      msgType: 'Alert',
      event: `Prototype ${alertType} Impact Alert`,
      urgency,
      severity,
      certainty: 'Likely',
      category: 'Safety',
      headline,
      description: `Prototype simulated alert for ${targetArea}. Weather parameters indicate severe cyclone hazards.`,
      instruction,
      areaDesc: targetArea,
      affectedVillages: ['Coastal Ward 7', 'Delta Nagar'],
      channels: selectedChannels,
      language: alertLang,
    };
    addAlert(newAlert);
  };

  const handleSimulateDispatch = (id: string) => {
    updateAlertStatus(id, 'Simulated Dispatch');
  };

  const currentCapJson = {
    identifier: 'CSAI-2026-001',
    sender: 'CycloneShield AI Prototype',
    status: 'Draft',
    msgType: 'Alert',
    event: `Prototype ${alertType.toLowerCase()} impact alert`,
    severity,
    urgency,
    certainty: 'Likely',
    areaDesc: targetArea,
    headline,
    instruction,
    disclaimer: 'Simulated CAP alert payload for hackathon decision-support demonstration.',
  };

  const copyCapJson = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              Common Alerting Protocol (CAP v1.2) Generator
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Multi-Channel Emergency Alert Composer
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Compose and review standardized ITU-T X.1303 / OASIS CAP alert payloads. Dispatches to Cell Broadcast, SMS gateways, and siren controllers.
          </p>
        </div>

        {/* Big Safe Simulation Badge */}
        <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex-shrink-0">
          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>SIMULATED DISPATCH ONLY • NO LIVE SMS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Alert Composer Form (7 Cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Compose New CAP Advisory</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Draft Mode (Requires DEO Sign-Off)
            </span>
          </div>

          <form onSubmit={handleCompose} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Alert Category</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Evacuation">Evacuation Order</option>
                  <option value="Flood">Storm Surge Flood</option>
                  <option value="High Wind">Gale Wind Warning</option>
                  <option value="Infrastructure">Infrastructure Hazard</option>
                  <option value="Rainfall">Torrential Rain</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">CAP Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Critical">Critical (Immediate Danger)</option>
                  <option value="Severe">Severe (Major Disruption)</option>
                  <option value="Moderate">Moderate (Caution)</option>
                  <option value="Minor">Minor (Advisory)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Immediate">Immediate (&lt; 2 hours)</option>
                  <option value="Expected">Expected (Next 6-12h)</option>
                  <option value="Future">Future (T-24h window)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Geographic Zone</label>
              <input
                type="text"
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Public Headline (Broadcast Title)</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2.5 text-slate-200 font-bold focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Action Instruction to Public</label>
              <textarea
                rows={3}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                className="w-full bg-navy-950 border border-navy-750 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
              />
            </div>

            {/* Target Broadcast Channels */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Dissemination Channels</label>
              <div className="flex flex-wrap gap-2">
                {(['SMS', 'WhatsApp', 'Sirens', 'Megaphone'] as const).map((ch) => {
                  const isSelected = selectedChannels.includes(ch);
                  return (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
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

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs font-mono shadow-lg transition-all"
              >
                + Create CAP Alert Draft
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: CAP JSON & Active Alerts (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-time CAP JSON Payload Preview */}
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between border-b border-navy-750 pb-2">
              <div className="flex items-center gap-1.5 font-mono text-xs text-white font-bold">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>CAP XML/JSON Payload Preview</span>
              </div>
              <button
                onClick={() => copyCapJson(JSON.stringify(currentCapJson, null, 2), 'preview')}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedId === 'preview' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy JSON</span>
              </button>
            </div>

            <pre className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-[10px] font-mono text-emerald-300/90 overflow-x-auto max-h-56 leading-tight">
              {JSON.stringify(currentCapJson, null, 2)}
            </pre>
          </div>

          {/* Active Alerts List & Dispatch Simulator */}
          <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-navy-750 pb-2">
              <h4 className="font-bold text-xs text-white font-mono flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Alert Queue &amp; Approval Status</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">{alerts.length} Total</span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {alerts.map((al) => (
                <div key={al.identifier} className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">
                      {al.identifier}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        al.status === 'Simulated Dispatch'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : al.status === 'Approved'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {al.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-200 text-xs leading-snug">
                    {al.headline}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-navy-800/60 text-[10px] font-mono">
                    <span className="text-slate-400">Channels: {al.channels.join(', ')}</span>
                    {al.status !== 'Simulated Dispatch' && (
                      <button
                        onClick={() => handleSimulateDispatch(al.identifier)}
                        className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded font-bold transition-colors"
                      >
                        Simulate Dispatch &gt;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
