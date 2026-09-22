import React from 'react';
import {
  Radio,
  AlertTriangle,
  Waves,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const QuickAlertsFeed: React.FC = () => {
  const { setActiveTab, openVillageRiskDetail, openAssetDetail } = useAppState();

  const ALERTS = [
    {
      id: 'al-1',
      severity: 'critical',
      title: 'SH-12 Submerged at Km 14.2 — Coastal Ward 7 Rerouted',
      time: '8 mins ago',
      desc: '0.8m storm surge backflow detected via Sentinel-1 SAR. Evacuation traffic diverted to Elevated Corridor 2 towards Shelter B.',
      actionLabel: 'View Ward 7 Risk',
      onClick: () => openVillageRiskDetail('vil-01'),
    },
    {
      id: 'al-2',
      severity: 'high',
      title: '220/33kV Substation Trench Water Ingress Hazard',
      time: '18 mins ago',
      desc: 'Mandatory pre-landfall protocol: De-energize coastal Feeders 3 & 4 before surge crest to prevent transformer explosion.',
      actionLabel: 'Asset Action Item',
      onClick: () => openAssetDetail('ast-03'),
    },
    {
      id: 'al-3',
      severity: 'critical',
      title: 'Delta Sub-Divisional Hospital ICU Evacuation',
      time: '32 mins ago',
      desc: 'Ground floor at risk of 2.1m tidal surge. Complete medical relocation of 45 non-ambulatory patients to Inland Facility in progress.',
      actionLabel: 'Hospital Status',
      onClick: () => openAssetDetail('ast-02'),
    },
    {
      id: 'al-4',
      severity: 'moderate',
      title: 'Sentinel-1A SAR Orbit Pass Processed on GEE',
      time: '45 mins ago',
      desc: 'Updated water index rasters ingested into risk engine. Spatial resolution 10m grid with 88.4% model confidence.',
      actionLabel: 'View Methodology',
      onClick: () => setActiveTab('methodology'),
    }
  ];

  return (
    <div className="bg-navy-900 border border-navy-750 rounded-xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <h3 className="font-bold text-sm text-white font-mono tracking-tight">
            Live Tactical Alerts &amp; Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          EOC Dispatch Channel
        </span>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {ALERTS.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border transition-all ${
              alert.severity === 'critical'
                ? 'bg-red-950/20 border-red-800/40 hover:border-red-500/60'
                : alert.severity === 'high'
                ? 'bg-orange-950/20 border-orange-800/40 hover:border-orange-500/60'
                : 'bg-navy-850 border-navy-750 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                  alert.severity === 'critical'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : alert.severity === 'high'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {alert.severity}
              </span>
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {alert.time}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-100 mb-1 leading-snug">
              {alert.title}
            </h4>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
              {alert.desc}
            </p>

            <button
              onClick={alert.onClick}
              className="text-[10px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>{alert.actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
