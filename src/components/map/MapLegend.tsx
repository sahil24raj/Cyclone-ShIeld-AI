import React from 'react';
import { Layers, Eye, EyeOff, Wind, Waves, CloudRain, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAppState, MapLayerConfig } from '../../context/AppStateContext';

export const MapLegend: React.FC = () => {
  const { mapLayers, toggleMapLayer, basemapStyle, setBasemapStyle } = useAppState();

  const LAYER_CONTROLS: { key: keyof MapLayerConfig; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'cycloneTrack', label: 'Cyclone Track & Cone', icon: <Wind className="w-3.5 h-3.5 text-rose-400" />, color: '#F43F5E' },
    { key: 'windRadius', label: 'Gale Wind Radii', icon: <Wind className="w-3.5 h-3.5 text-orange-400" />, color: '#FB923C' },
    { key: 'stormSurge', label: 'Storm Surge Inundation', icon: <Waves className="w-3.5 h-3.5 text-purple-400" />, color: '#C084FC' },
    { key: 'floodExtent', label: 'Sentinel-1 Flood Extent', icon: <CloudRain className="w-3.5 h-3.5 text-cyan-400" />, color: '#22D3EE' },
    { key: 'rainfall', label: 'CHIRPS Rainfall (>250mm)', icon: <CloudRain className="w-3.5 h-3.5 text-blue-400" />, color: '#60A5FA' },
    { key: 'criticalInfrastructure', label: 'Critical Assets & Hospitals', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />, color: '#FBBF24' },
    { key: 'evacuationRoutes', label: 'Evacuation Corridors', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, color: '#34D399' },
  ];

  return (
    <div className="bg-navy-900/95 backdrop-blur-md border border-navy-750 p-3 rounded-lg shadow-2xl text-xs space-y-3 font-sans max-w-[260px]">
      <div className="flex items-center justify-between border-b border-navy-750 pb-1.5">
        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-200">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>GIS Layer Controls</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Prototype GEE</span>
      </div>

      {/* Basemap Selector */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Basemap Source</div>
        <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
          <button
            onClick={() => setBasemapStyle('dark')}
            className={`px-2 py-1 rounded border text-center transition-all ${
              basemapStyle === 'dark'
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
            }`}
          >
            Dark Clean
          </button>
          <button
            onClick={() => setBasemapStyle('satellite')}
            className={`px-2 py-1 rounded border text-center transition-all ${
              basemapStyle === 'satellite'
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setBasemapStyle('carto')}
            className={`px-2 py-1 rounded border text-center transition-all ${
              basemapStyle === 'carto'
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
            }`}
          >
            CARTO Dark
          </button>
          <button
            onClick={() => setBasemapStyle('osm')}
            className={`px-2 py-1 rounded border text-center transition-all ${
              basemapStyle === 'osm'
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
            }`}
          >
            OpenStreet
          </button>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-1.5 border-t border-navy-750 pt-2">
        {LAYER_CONTROLS.map((layer) => {
          const isEnabled = mapLayers[layer.key];
          return (
            <button
              key={layer.key}
              onClick={() => toggleMapLayer(layer.key)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all ${
                isEnabled
                  ? 'bg-navy-800 text-slate-100 font-medium border border-navy-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {layer.icon}
                <span className="truncate text-[11px]">{layer.label}</span>
              </div>
              {isEnabled ? (
                <Eye className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Risk Color Legend */}
      <div className="border-t border-navy-750 pt-2 space-y-1.5 font-mono text-[10px]">
        <div className="text-slate-400 font-bold uppercase tracking-wider">Vulnerability Scale</div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-950" />
            <span className="text-slate-300">P0 / Critical (&gt;75)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-950" />
            <span className="text-slate-300">P1 / High (51-75)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-950" />
            <span className="text-slate-300">P2 / Mod (26-50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-950" />
            <span className="text-slate-300">P3 / Low (&lt;25)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
