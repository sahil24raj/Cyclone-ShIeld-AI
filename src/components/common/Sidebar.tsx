import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Navigation,
  Building2,
  Sliders,
  Sparkles,
  AlertOctagon,
  Database,
  History,
  Radio,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAppState, ActiveTab } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarItem {
  id: ActiveTab;
  labelKey: string;
  fallbackLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts } = useAppState();
  const { t } = useLanguage();

  const NAV_ITEMS: SidebarItem[] = [
    {
      id: 'command',
      labelKey: 'command_centre',
      fallbackLabel: 'Command Center',
      icon: LayoutDashboard,
    },
    {
      id: 'map',
      labelKey: 'impact_map',
      fallbackLabel: 'Impact GIS Map',
      icon: MapIcon,
      badge: 'Live GIS',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'evacuation',
      labelKey: 'evacuation_planner',
      fallbackLabel: 'Evacuation Planner',
      icon: Navigation,
      badge: 'P0 Active',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    },
    {
      id: 'infrastructure',
      labelKey: 'critical_infrastructure',
      fallbackLabel: 'Critical Infrastructure',
      icon: Building2,
      badge: '42 Assets',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'simulator',
      labelKey: 'scenario_simulator',
      fallbackLabel: 'Scenario Simulator',
      icon: Sliders,
      badge: 'Sensitivity',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'briefing',
      labelKey: 'ai_briefing',
      fallbackLabel: 'AI Situation Brief',
      icon: Sparkles,
      badge: 'Multimodal',
      badgeColor: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/30',
    },
    {
      id: 'alert',
      labelKey: 'alert_centre',
      fallbackLabel: 'CAP Alert Center',
      icon: AlertOctagon,
      badge: `${alerts.length} CAP`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'historical',
      labelKey: 'historical_analysis',
      fallbackLabel: 'Historical Benchmark',
      icon: History,
      badge: '5 Events',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'methodology',
      labelKey: 'data_methodology',
      fallbackLabel: 'Data & Provenance',
      icon: Database,
    },
  ];

  return (
    <aside className="w-64 bg-navy-900 border-r border-navy-750 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-80px)] shadow-xl z-20 select-none">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
          <span>Operational Modules</span>
          <span className="text-[9px] text-cyan-400">EOC v2.4</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = t(item.labelKey) !== item.labelKey ? t(item.labelKey) : item.fallbackLabel;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-navy-850/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate font-sans text-[11px]">{label}</span>
              </div>

              {item.badge ? (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold flex-shrink-0 ${
                    item.badgeColor || 'bg-navy-800 text-slate-300 border-navy-700'
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400/70" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer System Telemetry */}
      <div className="p-3 border-t border-navy-750 bg-navy-950/70 space-y-2">
        <div className="bg-navy-900 rounded-xl p-2.5 border border-navy-800 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              SAR Water Index
            </span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>GEE Pipeline:</span>
            <span className="text-slate-200 font-medium">Copernicus S-1</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Model Engine:</span>
            <span className="text-cyan-400 font-bold">P-CHMVM v2.4</span>
          </div>
        </div>

        <div className="px-2 text-[10px] text-slate-400 font-mono text-center flex items-center justify-center gap-1">
          <ShieldAlert className="w-3 h-3 text-cyan-400" />
          <span>CYCLONE-X APAC Intelligence</span>
        </div>
      </div>
    </aside>
  );
};
