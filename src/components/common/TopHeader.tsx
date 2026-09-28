import React, { useState, useEffect } from 'react';
import {
  Bell,
  Globe,
  Clock,
  Radio,
  Activity,
  Database,
  UserCheck,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { Language } from '../../types';
import { SystemStatusModal } from './SystemStatusModal';

export const TopHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const {
    alerts,
    setActiveTab,
    dataSources,
    dataMode,
    setDataMode,
    isStatusModalOpen,
    setIsStatusModalOpen,
  } = useAppState();

  const [currentTime, setCurrentTime] = useState<string>('');

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

  return (
    <>
      <header className="bg-navy-900 border-b border-navy-750 px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-xl select-none">
        {/* Left: CycloneShield AI Brand & Tagline */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('command')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Go to Overview"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-600 to-navy-900 border border-teal-400/40 shadow-lg shadow-teal-950/40">
              <Shield className="w-5 h-5 text-teal-100 group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base md:text-lg tracking-tight text-white font-sans flex items-center gap-1.5">
                  {t('app_title')} <span className="text-teal-400 font-mono text-xs font-bold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/30">AI</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-300 font-medium tracking-wide hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </button>
        </div>

        {/* Center: Clean Strategic Status Chips & Data Mode Switcher */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Interactive Data Mode Switcher */}
          <div className="bg-navy-950 p-1 rounded-xl border border-navy-750 flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setDataMode('mock')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                dataMode === 'mock'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Deterministic Historical / Calibration Simulation Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>DEMO MODE</span>
            </button>
            <button
              onClick={() => setDataMode('live')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                dataMode === 'live'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Direct Live Meteorological & Satellite Ingestion Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE FEED</span>
            </button>
          </div>

          {/* Active Scenario Location */}
          <div className="bg-navy-950/80 px-3 py-1.5 rounded-lg border border-navy-750 flex items-center gap-2 text-xs backdrop-blur-sm">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="text-slate-200 font-medium">{t('active_scenario')}</span>
          </div>

          {/* Time to Landfall */}
          <div className="bg-navy-950/80 px-2.5 py-1.5 rounded-lg border border-navy-750 flex items-center gap-1.5 text-xs font-mono text-teal-300 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{t('time_to_landfall')}</span>
          </div>
        </div>

        {/* Right: Language Dropdown, Live IST Clock, Officer Profile, Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Live IST Clock */}
          <div className="hidden xl:flex flex-col text-right text-[10px] font-mono text-slate-400 pr-1">
            <span className="text-slate-200 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t('updated_just_now')}
            </span>
            <span>{currentTime || '19:30:00 IST'}</span>
          </div>

          {/* Language Selector Dropdown with high clarity */}
          <div className="relative flex items-center bg-navy-950 border border-teal-500/30 hover:border-teal-500/60 rounded-lg px-2 py-1 text-xs shadow-sm transition-colors">
            <Globe className="w-3.5 h-3.5 text-teal-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer pr-1 font-sans"
              aria-label="Language selector"
            >
              <option value="en" className="bg-navy-900 text-slate-100">English (EN)</option>
              <option value="hi" className="bg-navy-900 text-slate-100">हिंदी (HI)</option>
              <option value="bn" className="bg-navy-900 text-slate-100">বাংলা (BN)</option>
              <option value="or" className="bg-navy-900 text-slate-100">ଓଡ଼ିଆ (OR)</option>
            </select>
          </div>

          {/* User/Role Menu */}
          <div className="hidden sm:flex items-center gap-2 bg-navy-950 border border-navy-750 px-2.5 py-1.5 rounded-lg text-xs">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center">
              <UserCheck className="w-3 h-3" />
            </div>
            <div className="text-left leading-tight hidden md:block">
              <div className="text-[11px] font-bold text-slate-100">{t('role_officer')}</div>
              <div className="text-[9px] text-slate-400 font-mono">{t('role_station')}</div>
            </div>
          </div>

          {/* Data Sources Status Modal Button */}
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="p-2 rounded-lg bg-navy-950 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-750 transition-colors"
            title="Inspect Data Source & Provenance Status"
            aria-label="Data Sources"
          >
            <Database className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveTab('alert')}
            className="relative p-2 rounded-lg bg-navy-950 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-750 transition-colors"
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

      {/* Clean Single Information Sub-Strip */}
      <div className="bg-navy-950 border-b border-navy-800 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between font-sans shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          <span>{t('simulation_notice')}</span>
        </div>
        <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>{t('hero_subtitle')}</span>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setActiveTab('methodology')}
            className="text-teal-400 hover:text-teal-300 hover:underline font-semibold"
          >
            {t('model_methodology_link')}
          </button>
        </div>
      </div>

      {/* System Data Sources Modal */}
      <SystemStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        dataSources={dataSources}
      />
    </>
  );
};
