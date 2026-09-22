import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Wind,
  Waves,
  CloudRain,
  Building2,
  Navigation,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAppState, MapLayerConfig } from '../../context/AppStateContext';

export const MapLegend: React.FC = () => {
  const { mapLayers, toggleMapLayer } = useAppState();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const LAYER_CONTROLS: { key: keyof MapLayerConfig; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'cycloneTrack', label: 'Track & Uncertainty Cone', icon: <Wind className="w-3.5 h-3.5 text-rose-400" />, color: '#F43F5E' },
    { key: 'windRadius', label: 'Gale Wind Radii (50kt)', icon: <Wind className="w-3.5 h-3.5 text-orange-400" />, color: '#FB923C' },
    { key: 'stormSurge', label: 'Storm Surge Hazard (3.4m)', icon: <Waves className="w-3.5 h-3.5 text-purple-400" />, color: '#C084FC' },
    { key: 'floodExtent', label: 'SAR Flood Inundation', icon: <Waves className="w-3.5 h-3.5 text-cyan-400" />, color: '#22D3EE' },
    { key: 'rainfall', label: 'CHIRPS Rainfall (>250mm)', icon: <CloudRain className="w-3.5 h-3.5 text-blue-400" />, color: '#60A5FA' },
    { key: 'criticalInfrastructure', label: 'Critical Assets (42)', icon: <Building2 className="w-3.5 h-3.5 text-amber-400" />, color: '#FBBF24' },
    { key: 'evacuationRoutes', label: 'Evacuation Corridors', icon: <Navigation className="w-3.5 h-3.5 text-emerald-400" />, color: '#34D399' },
  ];

  return (
    <div className="bg-navy-900/90 backdrop-blur-md border border-navy-750 p-3 rounded-xl shadow-2xl text-xs space-y-2.5 font-sans max-w-[240px] select-none">
      <div className="flex items-center justify-between border-b border-navy-750 pb-1.5">
        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-200 text-xs">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active GIS Layers</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          title={isCollapsed ? 'Expand Legend' : 'Collapse Legend'}
        >
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Layer Quick Toggles */}
          <div className="space-y-1">
            {LAYER_CONTROLS.map((layer) => {
              const isEnabled = mapLayers[layer.key];
              return (
                <button
                  key={layer.key}
                  onClick={() => toggleMapLayer(layer.key)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded transition-all ${
                    isEnabled
                      ? 'bg-navy-850 text-slate-100 font-medium border border-navy-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-navy-950/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {layer.icon}
                    <span className="truncate text-[10px] font-mono">{layer.label}</span>
                  </div>
                  {isEnabled ? (
                    <Eye className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Risk Scale Legend */}
          <div className="border-t border-navy-750 pt-2 space-y-1 font-mono text-[9px]">
            <div className="text-slate-400 font-bold uppercase tracking-wider">Risk Level Indicator</div>
            <div className="grid grid-cols-2 gap-1 text-slate-300">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 ring-1 ring-red-400" />
                <span>Critical (&gt;75)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 ring-1 ring-orange-400" />
                <span>High (51-75)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 ring-1 ring-amber-400" />
                <span>Mod (26-50)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-emerald-400" />
                <span>Low (&lt;25)</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
