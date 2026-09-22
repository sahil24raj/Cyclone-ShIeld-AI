import React from 'react';
import {
  Layers,
  Wind,
  Waves,
  CloudRain,
  Building2,
  Navigation,
  Home,
  Mountain,
  Users,
  Eye,
  Sliders,
  Sparkles,
  Compass
} from 'lucide-react';
import { LayerToggle } from '../ui/LayerToggle';
import { useAppState } from '../../context/AppStateContext';
import { MOCK_VILLAGES } from '../../data/villageData';
import { calculateVillageRisk } from '../../utils/riskCalculator';

export const LeftLayerPanel: React.FC = () => {
  const {
    mapLayers,
    toggleMapLayer,
    basemapStyle,
    setBasemapStyle,
    selectedVillage,
    setSelectedVillage,
    setSelectedAsset,
    simulationParams,
  } = useAppState();

  const criticalVillages = MOCK_VILLAGES.filter(
    (v) => calculateVillageRisk(v, simulationParams).overallRisk >= 70
  );

  return (
    <div className="bg-navy-900 border border-navy-750 rounded-2xl p-3.5 shadow-xl flex flex-col justify-between h-full space-y-4 select-none overflow-y-auto">
      <div className="space-y-3.5">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-xs text-white font-mono uppercase tracking-wider">
              GIS Layer Stack
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            Active: {Object.values(mapLayers).filter(Boolean).length} / 10
          </span>
        </div>

        {/* Layer Toggles Group */}
        <div className="space-y-1.5">
          <LayerToggle
            label="Cyclone Track & Cone"
            sublabel="Holland wind model & uncertainty"
            checked={mapLayers.cycloneTrack}
            onChange={() => toggleMapLayer('cycloneTrack')}
            icon={<Compass className="w-3.5 h-3.5 text-rose-400" />}
            badge="Cat-3"
          />

          <LayerToggle
            label="Gale Wind Radius"
            sublabel="50 knot / 92 km/h boundary"
            checked={mapLayers.windRadius}
            onChange={() => toggleMapLayer('windRadius')}
            icon={<Wind className="w-3.5 h-3.5 text-red-400" />}
            badge="135 km/h"
          />

          <LayerToggle
            label="Storm Surge Inundation"
            sublabel="SLOSH hydrodynamic coastal polygon"
            checked={mapLayers.stormSurge}
            onChange={() => toggleMapLayer('stormSurge')}
            icon={<Waves className="w-3.5 h-3.5 text-purple-400" />}
            badge="3.4m Peak"
          />

          <LayerToggle
            label="SAR Flood Extent"
            sublabel="Sentinel-1 radar water change index"
            checked={mapLayers.floodExtent}
            onChange={() => toggleMapLayer('floodExtent')}
            icon={<Waves className="w-3.5 h-3.5 text-cyan-400" />}
            badge="Copernicus"
          />

          <LayerToggle
            label="CHIRPS 24h Rainfall"
            sublabel="Accumulated precipitation isohyets"
            checked={mapLayers.rainfall}
            onChange={() => toggleMapLayer('rainfall')}
            icon={<CloudRain className="w-3.5 h-3.5 text-blue-400" />}
            badge="280 mm"
          />

          <LayerToggle
            label="Critical Infrastructure"
            sublabel="42 lifelines with hazard status"
            checked={mapLayers.criticalInfrastructure}
            onChange={() => toggleMapLayer('criticalInfrastructure')}
            icon={<Building2 className="w-3.5 h-3.5 text-amber-400" />}
            badge="42 Pts"
          />

          <LayerToggle
            label="Evacuation Corridors"
            sublabel="Elevated bypass & cutoff indicators"
            checked={mapLayers.evacuationRoutes}
            onChange={() => toggleMapLayer('evacuationRoutes')}
            icon={<Navigation className="w-3.5 h-3.5 text-emerald-400" />}
            badge="7 Cutoffs"
          />
        </div>

        {/* Quick Focus: Critical Coastal Wards */}
        <div className="pt-2 border-t border-navy-750/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="font-semibold text-slate-300">Quick Focus (P0 Wards):</span>
            <span className="text-red-400 font-bold">{criticalVillages.length} Priority</span>
          </div>

          <div className="space-y-1">
            {criticalVillages.slice(0, 3).map((v) => {
              const risk = calculateVillageRisk(v, simulationParams);
              const isSelected = selectedVillage?.id === v.id;

              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVillage(v);
                    setSelectedAsset(null);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-red-950/40 text-red-200 border-red-500 font-bold shadow-sm'
                      : 'bg-navy-950/80 text-slate-300 hover:text-white border-navy-800 hover:bg-navy-850'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-sans font-semibold text-[11px] truncate">
                      {v.name}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      Pop: {v.population.toLocaleString()} • Elev {v.elevation}m
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex-shrink-0">
                    {risk.overallRisk}/100
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Basemap Switcher */}
      <div className="pt-3 border-t border-navy-750/80 space-y-1.5 font-mono text-xs">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          GIS Basemap Canvas
        </div>
        <div className="grid grid-cols-3 gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setBasemapStyle('dark')}
            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
              basemapStyle === 'dark'
                ? 'bg-cyan-600 text-white font-bold border-cyan-400'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
            }`}
          >
            Dark GIS
          </button>
          <button
            type="button"
            onClick={() => setBasemapStyle('satellite')}
            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
              basemapStyle === 'satellite'
                ? 'bg-cyan-600 text-white font-bold border-cyan-400'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setBasemapStyle('osm')}
            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
              basemapStyle === 'osm'
                ? 'bg-cyan-600 text-white font-bold border-cyan-400'
                : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
            }`}
          >
            Street Map
          </button>
        </div>
      </div>
    </div>
  );
};
