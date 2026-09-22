import React from 'react';
import {
  ShieldAlert,
  Bell,
  UserCheck,
  Globe,
  Clock,
  Radio,
  Flame,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { CYCLONE_METADATA } from '../../data/cycloneData';
import { Language, TimelinePhase } from '../../types';

export const TopHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { timelinePhase, setTimelinePhase, alerts, setActiveTab } = useAppState();

  const PHASES: { id: TimelinePhase; label: string; activeDesc: string }[] = [
    { id: 'T-48h', label: 'T-48h', activeDesc: 'Deep Depression in Bay of Bengal' },
    { id: 'T-36h', label: 'T-36h', activeDesc: 'Upgraded to Severe Storm' },
    { id: 'T-24h', label: 'T-24h (Current)', activeDesc: 'Very Severe Storm (135 km/h)' },
    { id: 'T-12h', label: 'T-12h', activeDesc: 'Pre-Landfall Evacuation Cutoff' },
    { id: 'T-00h', label: 'Landfall', activeDesc: 'Peak Surge (4.6m) & Gale Impact' },
    { id: 'T+06h', label: 'T+6h', activeDesc: 'Inland Weakening & Flood Inundation' },
  ];

  return (
    <header className="bg-navy-900 border-b border-navy-750 px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-lg">
      {/* Brand & Storm Header */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('command')}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 shadow-md shadow-cyan-950/60 ring-1 ring-cyan-400/30">
            <ShieldAlert className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5 font-mono">
                {t('app_title')}
              </h1>
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold tracking-wider">
                Prototype Mode
              </span>
            </div>
            <p className="text-[11px] text-cyan-400 font-medium tracking-wide">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Selected Active Event Badge */}
        <div className="hidden xl:flex items-center gap-2.5 pl-4 border-l border-navy-750">
          <div className="bg-navy-850 px-3 py-1.5 rounded-md border border-navy-700 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span className="text-slate-400 font-mono text-[11px]">Active Event:</span>
              <span className="font-bold text-slate-100 font-mono text-xs">
                {CYCLONE_METADATA.name}
              </span>
            </div>
            <span className="h-3 w-px bg-navy-700" />
            <div className="flex items-center gap-1 text-[11px] text-orange-400 font-medium font-mono">
              <Flame className="w-3 h-3" />
              Cat: {CYCLONE_METADATA.category}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Phase Bar & Quick Controls */}
      <div className="hidden lg:flex items-center gap-1 bg-navy-950 p-1 rounded-lg border border-navy-800">
        <div className="flex items-center gap-1 px-2 text-[11px] text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Lead Time:</span>
        </div>
        {PHASES.map((p) => {
          const isSelected = timelinePhase === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setTimelinePhase(p.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all relative ${
                isSelected
                  ? 'bg-cyan-600 text-white font-bold shadow-sm shadow-cyan-900 ring-1 ring-cyan-400'
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

      {/* Right User Actions, Notifications & Language */}
      <div className="flex items-center gap-2.5 md:gap-3.5">
        {/* Language Selector */}
        <div className="relative flex items-center bg-navy-850 border border-navy-700 rounded-md px-2 py-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            aria-label="Language selector"
          >
            <option value="en" className="bg-navy-900 text-slate-100">English (EN)</option>
            <option value="hi" className="bg-navy-900 text-slate-100">हिंदी (HI)</option>
            <option value="bn" className="bg-navy-900 text-slate-100">বাংলা (BN)</option>
            <option value="or" className="bg-navy-900 text-slate-100">ଓଡ଼ିଆ (OR)</option>
          </select>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => setActiveTab('alert')}
          className="relative p-2 rounded-md bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700 transition-colors"
          title="Active CAP Alerts"
          aria-label="Active CAP Alerts"
        >
          <Bell className="w-4 h-4" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center ring-2 ring-navy-900">
              {alerts.length}
            </span>
          )}
        </button>

        {/* User Role Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-navy-750">
          <div className="w-8 h-8 rounded-full bg-navy-800 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold shadow-inner">
            DEO
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
              {t('role_officer')}
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Sundar Coast EOC
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
