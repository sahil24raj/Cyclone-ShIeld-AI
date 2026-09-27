import React, { useState } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Navigation,
  Building2,
  Sliders,
  Sparkles,
  AlertOctagon,
  Database,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useAppState, ActiveTab } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarItem {
  id: ActiveTab;
  translationKey: string;
  defaultLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts } = useAppState();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NAV_ITEMS: SidebarItem[] = [
    {
      id: 'command',
      translationKey: 'nav_overview',
      defaultLabel: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'map',
      translationKey: 'nav_map',
      defaultLabel: 'Live Impact Map',
      icon: MapIcon,
      badge: 'GIS',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
    {
      id: 'evacuation',
      translationKey: 'nav_evacuation',
      defaultLabel: 'Evacuation Plan',
      icon: Navigation,
      badge: 'P0 Plan',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    },
    {
      id: 'infrastructure',
      translationKey: 'nav_infrastructure',
      defaultLabel: 'Infrastructure Risks',
      icon: Building2,
      badge: '42 Assets',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'simulator',
      translationKey: 'nav_simulator',
      defaultLabel: 'Scenario Simulator',
      icon: Sliders,
      badge: 'What-If',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'briefing',
      translationKey: 'nav_briefing',
      defaultLabel: 'AI Situation Brief',
      icon: Sparkles,
      badge: 'SITREP',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'alert',
      translationKey: 'nav_alerts',
      defaultLabel: 'Alert Drafts',
      icon: AlertOctagon,
      badge: `${alerts.length} CAP`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'methodology',
      translationKey: 'nav_methodology',
      defaultLabel: 'Data & Method',
      icon: Database,
    },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-60'
      } bg-navy-900 border-r border-navy-750 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-80px)] shadow-xl z-20 select-none transition-all duration-200`}
    >
      {/* Navigation Links */}
      <div className="p-2.5 space-y-1">
        <div className="px-2.5 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
          {!isCollapsed && <span>{t('navigation_header')}</span>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-navy-800 text-slate-400 hover:text-slate-200 transition-colors mx-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = t(item.translationKey) || item.defaultLabel;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5'
              } rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-navy-850 border border-transparent'
              }`}
              title={isCollapsed ? label : undefined}
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/40'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {!isCollapsed && <span className="truncate font-sans text-xs">{label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold flex-shrink-0 ${
                    item.badgeColor || 'bg-navy-800 text-slate-300 border-navy-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-navy-750 bg-navy-950/60 text-xs text-slate-400 font-sans space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Decision Engine:</span>
            <span className="text-teal-400 font-bold">Deterministic</span>
          </div>
          <div className="text-[10px] text-slate-500 leading-tight">
            EOC Decision Support Platform
          </div>
        </div>
      )}
    </aside>
  );
};
