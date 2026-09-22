import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Bell,
  Globe,
  Clock,
  Radio,
  Flame,
  Activity,
  CheckCircle2,
  RefreshCw,
  Database,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { Language, TimelinePhase } from '../../types';
import { SystemStatusModal } from './SystemStatusModal';

export const TopHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const {
    timelinePhase,
    setTimelinePhase,
    alerts,
    setActiveTab,
    activeCyclone,
    weather,
    dataSources,
    isStatusModalOpen,
    setIsStatusModalOpen,
    refreshData,
    isLoading
  } = useAppState();
  const [currentTime, setCurrentTime] = useState<string>('');

  const isFixtureMode = import.meta.env.VITE_ENABLE_DEV_FIXTURES === 'true';

  // Live ticking IST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(`${timeStr} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const PHASES: { id: TimelinePhase; label: string; activeDesc: string }[] = [
    { id: 'T-48h', label: 'T-48h', activeDesc: 'Deep Depression in Bay of Bengal' },
    { id: 'T-36h', label: 'T-36h', activeDesc: 'Upgraded to Severe Storm' },
    { id: 'T-24h', label: 'T-24h', activeDesc: 'Very Severe Storm (135 km/h) • Current' },
    { id: 'T-12h', label: 'T-12h', activeDesc: 'Pre-Landfall Evacuation Cutoff' },
    { id: 'T-00h', label: 'Landfall', activeDesc: 'Peak Surge & Gale Impact' },
    { id: 'T+06h', label: 'T+6h', activeDesc: 'Inland Weakening & Flood Inundation' },
  ];

  return (
    <>
      <header className="bg-navy-900 border-b border-navy-750 px-3.5 py-2 sticky top-0 z-30 flex items-center justify-between shadow-xl select-none">
        {/* Brand & Live Telemetry Badge */}
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('command')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 via-blue-700 to-navy-900 border border-cyan-400/40 shadow-md shadow-cyan-950">
              <ShieldAlert className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm md:text-base tracking-tight text-white font-mono flex items-center gap-1.5">
                  CYCLONE-X
                </h1>
                {isFixtureMode ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    DEV FIXTURE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    PRODUCTION
                  </span>
                )}
              </div>
              <p className="text-[10px] text-cyan-400 font-medium tracking-wide hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </button>

          {/* Active Storm Quick Telemetry Card */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-navy-750">
            {activeCyclone ? (
              <div className="bg-navy-950 px-2.5 py-1 rounded-lg border border-navy-800 flex items-center gap-2.5 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                  <span className="text-slate-400 text-[10px]">Storm:</span>
                  <span className="font-bold text-white text-[11px]">{activeCyclone.name}</span>
                </div>
                <span className="h-3 w-px bg-navy-800" />
                <div className="flex items-center gap-1 text-[11px] text-orange-400 font-bold">
                  <Flame className="w-3 h-3" />
                  <span>{activeCyclone.maxWindSpeed} km/h</span>
                </div>
                <span className="h-3 w-px bg-navy-800" />
                <div className="text-[10px] text-slate-400">
                  Landfall: <b className="text-cyan-300">{activeCyclone.landfallETA}</b>
                </div>
              </div>
            ) : (
              <div className="bg-navy-950 px-2.5 py-1 rounded-lg border border-navy-800 flex items-center gap-2 font-mono text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>NO ACTIVE CYCLONE • IMD RSMC STANDBY</span>
              </div>
            )}
          </div>
        </div>

        {/* Center Lead-Time Phase Selector */}
        <div className="hidden md:flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-navy-800 font-mono text-xs">
          <div className="flex items-center gap-1 px-2 text-[10px] text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span className="hidden lg:inline">Phase:</span>
          </div>
          {PHASES.map((p) => {
            const isSelected = timelinePhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setTimelinePhase(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all relative ${
                  isSelected
                    ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950 border border-cyan-400/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
                }`}
                title={p.activeDesc}
              >
                {p.label}
                {isSelected && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-300 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Data Sources Status, Clock, Language & Alerts */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Data Sources Status Button */}
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="flex items-center gap-1.5 bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-750 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors"
            title="Inspect Data Source & Provenance Status"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Data Feeds</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isFixtureMode
                  ? 'bg-purple-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={() => refreshData()}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-400 hover:text-white border border-navy-750 transition-colors"
            title="Refresh All Feeds"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Live Clock */}
          <div className="hidden lg:flex flex-col items-end text-right font-mono pr-1">
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{currentTime || '18:25:00 IST'}</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              IST • Asian/Kolkata
            </div>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center bg-navy-850 border border-navy-750 rounded-lg px-2 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1 font-sans"
              aria-label="Language selector"
            >
              <option value="en" className="bg-navy-900 text-slate-100">English (EN)</option>
              <option value="hi" className="bg-navy-900 text-slate-100">हिंदी (HI)</option>
              <option value="bn" className="bg-navy-900 text-slate-100">বাংলা (BN)</option>
              <option value="or" className="bg-navy-900 text-slate-100">ଓଡ଼ିଆ (OR)</option>
            </select>
          </div>

          {/* CAP Notifications Bell */}
          <button
            onClick={() => setActiveTab('alert')}
            className="relative p-2 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-750 transition-colors"
            title="Active CAP Advisories"
            aria-label="Active CAP Advisories"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center ring-2 ring-navy-900 shadow-sm">
                {alerts.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* System Data Sources Modal */}
      <SystemStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        dataSources={dataSources}
      />
    </>
  );
};
