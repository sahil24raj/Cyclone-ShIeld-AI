import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  Eye,
  EyeOff,
  Navigation,
  Shield,
  Building2,
  Clock,
  RotateCcw,
  X,
  Info,
  Waves,
  Flame,
  CloudRain,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { TimelinePhase, CriticalAsset } from '../../types';
import { CalculatedVillageOutput, CalculatedAssetOutput } from '../../types/disaster';
import { MOCK_GEOJSON_TRACK, MOCK_GEOJSON_SURGE_ZONE, MOCK_GEOJSON_FLOOD_ZONE } from '../../data/mockGeoJson';
import { EvidenceChainModal } from '../common/EvidenceChainModal';
import { formatIndianNumber } from '../../utils/formatters';

export const InteractiveMap: React.FC = () => {
  const {
    timelinePhase,
    setTimelinePhase,
    mapLayers,
    toggleMapLayer,
    villages,
    assets,
    shelters,
    evacuationRoutes,
    selectedVillage,
    setSelectedVillage,
    selectedAsset,
    setSelectedAsset,
    scenarioInputs,
    setScenarioInputs,
    simulationSummary,
  } = useAppState();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Top Hazard Filter Selector
  const [activeHazardView, setActiveHazardView] = useState<'combined' | 'wind' | 'rainfall' | 'surge' | 'flood'>('combined');
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [evidenceAsset, setEvidenceAsset] = useState<CriticalAsset | null>(null);

  // Center Coordinates for Sundar Coast District: ~20.48 N, 86.85 E
  const CENTER_LAT = 20.48;
  const CENTER_LNG = 86.85;

  const PHASES: { id: TimelinePhase; label: string; offsetHours: number }[] = [
    { id: 'T-48h', label: 'T–48h', offsetHours: 48 },
    { id: 'T-36h', label: 'T–36h', offsetHours: 36 },
    { id: 'T-24h', label: 'T–24h', offsetHours: 24 },
    { id: 'T-12h', label: 'T–12h', offsetHours: 12 },
    { id: 'T-00h', label: 'Landfall', offsetHours: 0 },
    { id: 'T+06h', label: 'T+6h', offsetHours: -6 },
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [CENTER_LAT, CENTER_LNG],
        zoom: 11,
        minZoom: 9,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY || 'cb1_3t5l_1_a644c0e42df5a70a5cea7a0f';

      // Professional dark EOC canvas tiles (clean, watermark-free, high-contrast)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: 'Esri & CARTO',
      }).addTo(map);

      // Reference labels overlay
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount if needed
    };
  }, []);

  // Update Map Layers & GeoJSON Features dynamically on state change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const group = layerGroupRef.current;
    group.clearLayers();

    const trackShiftDeg = scenarioInputs.trackShiftKm * 0.008;

    // 1. Storm Surge Hazard Inundation Overlay (Purple/Blue)
    if (activeHazardView === 'combined' || activeHazardView === 'surge') {
      const surgeCoords: [number, number][] = [
        [20.30 + trackShiftDeg, 86.60],
        [20.44 + trackShiftDeg, 86.80],
        [20.52 + trackShiftDeg, 86.96],
        [20.65 + trackShiftDeg, 87.05],
        [20.58 + trackShiftDeg, 87.15],
        [20.35 + trackShiftDeg, 86.95],
      ];

      const surgeOpacity = Math.min(0.7, 0.2 + (scenarioInputs.stormSurgeMeters / 5.0) * 0.45);
      L.polygon(surgeCoords, {
        color: '#8B5CF6',
        fillColor: '#8B5CF6',
        fillOpacity: surgeOpacity,
        weight: 1.5,
        dashArray: '4, 4',
      })
        .bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold text-purple-300">Storm Surge Inundation Zone</div>
            <div>Model Estimate: ${scenarioInputs.stormSurgeMeters.toFixed(1)}m Peak Surge</div>
            <div class="text-[10px] text-slate-400">Low elevation coastal belt &lt; 3.0m AMSL</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        )
        .addTo(group);
    }

    // 2. Flood Extent Overlay (Cyan/Blue)
    if (activeHazardView === 'combined' || activeHazardView === 'flood' || activeHazardView === 'rainfall') {
      const floodCoords: [number, number][] = [
        [20.36 + trackShiftDeg, 86.68],
        [20.45 + trackShiftDeg, 86.74],
        [20.48 + trackShiftDeg, 86.90],
        [20.42 + trackShiftDeg, 86.85],
      ];

      const floodOpacity = Math.min(0.65, 0.2 + (scenarioInputs.rainfallMm / 400) * 0.4);
      L.polygon(floodCoords, {
        color: '#06B6D4',
        fillColor: '#06B6D4',
        fillOpacity: floodOpacity,
        weight: 1.5,
      })
        .bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold text-cyan-300">Riverine &amp; Delta Flood Zone</div>
            <div>Model Estimate: ${scenarioInputs.rainfallMm}mm 24h Accumulation</div>
            <div class="text-[10px] text-slate-400">Mahanadi Delta Catchment Overflow</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        )
        .addTo(group);
    }

    // 3. Cyclone Track & Forecast Cone
    if (mapLayers.cycloneTrack) {
      const trackPoints: [number, number][] = [
        [19.00, 87.80],
        [19.60, 87.40],
        [20.10 + trackShiftDeg * 0.5, 87.05], // T-24h
        [20.48 + trackShiftDeg, 86.85],       // Landfall
        [20.90 + trackShiftDeg * 1.2, 86.50], // T+6h
      ];

      // Track Line
      L.polyline(trackPoints, {
        color: '#F43F5E',
        weight: 3.5,
        opacity: 0.9,
      }).addTo(group);

      // Forecast Cone
      const conePolygon: [number, number][] = [
        [20.10 + trackShiftDeg * 0.5, 87.05],
        [20.65 + trackShiftDeg + 0.15, 86.75],
        [21.05 + trackShiftDeg * 1.2 + 0.25, 86.35],
        [20.75 + trackShiftDeg * 1.2 - 0.25, 86.60],
        [20.30 + trackShiftDeg - 0.15, 86.95],
      ];

      L.polygon(conePolygon, {
        color: '#F43F5E',
        fillColor: '#F43F5E',
        fillOpacity: 0.12,
        weight: 1,
        dashArray: '5, 5',
      }).addTo(group);

      // Landfall Center Marker
      const eyeIcon = L.divIcon({
        className: 'cyclone-eye-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-rose-500/30 border-2 border-rose-400 animate-ping absolute"></div>
            <div class="w-6 h-6 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-lg border border-white">
              🌀
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([20.48 + trackShiftDeg, 86.85], { icon: eyeIcon })
        .bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold text-rose-300">Projected Cyclone Landfall (T–00h)</div>
            <div>Max Wind: ${scenarioInputs.windSpeedKmh} km/h</div>
            <div>Peak Surge: ${scenarioInputs.stormSurgeMeters.toFixed(1)}m</div>
            <div class="text-[10px] text-slate-400">Track Shift: ${scenarioInputs.trackShiftKm > 0 ? '+' : ''}${scenarioInputs.trackShiftKm} km</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        )
        .addTo(group);
    }

    // 4. Evacuation Routes
    if (mapLayers.evacuationRoutes && evacuationRoutes.length > 0) {
      evacuationRoutes.forEach((route) => {
        const routeStatusStr = (route.status || (route as any).calculatedStatus || 'Safe').toLowerCase();
        const isBlocked = routeStatusStr === 'blocked' || routeStatusStr === 'at risk';
        const isElevated = route.is_elevated || (route as any).isElevated;

        const poly = L.polyline(route.coordinates, {
          color: isBlocked ? '#EF4444' : isElevated ? '#10B981' : '#F59E0B',
          weight: isElevated ? 4.5 : 3,
          dashArray: isBlocked ? '6, 6' : undefined,
          opacity: isBlocked ? 0.8 : 0.95,
        });

        poly.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold ${isBlocked ? 'text-red-400' : 'text-emerald-400'}">${route.name}</div>
            <div>Status: <b>${(route.status || (route as any).calculatedStatus || 'Safe').toUpperCase()}</b></div>
            <div>Elevated Corridor: ${isElevated ? 'YES (Flood Safe)' : 'NO'}</div>
            <div>Transit: ~${(route as any).calculatedTravelTimeMin || 20} mins</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        poly.addTo(group);
      });
    }

    // 5. Cyclone Shelters
    if (shelters.length > 0) {
      shelters.forEach((shelter) => {
        const roadStatus = ((shelter as any).access_road_status || (shelter as any).calculatedStatus || 'clear').toString();
        const isBlocked = roadStatus === 'blocked' || roadStatus === 'isolated' || !(shelter.is_operational ?? true);
        const currOcc = (shelter as any).current_occupancy ?? (shelter as any).currentOccupancy ?? 0;
        const cap = shelter.capacity ?? (shelter as any).capacity ?? 0;
        const lat = shelter.lat || (shelter as any).latitude;
        const lng = shelter.lng || (shelter as any).longitude;

        if (!lat || !lng) return;

        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-6 h-6 rounded-md ${
                isBlocked
                  ? 'bg-red-600 text-white border-2 border-red-300 shadow-red-500/50'
                  : 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-emerald-500/50'
              } shadow-md flex items-center justify-center font-bold text-[10px] font-mono cursor-pointer transition-transform hover:scale-125">
                SH
              </div>
              ${
                isBlocked
                  ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping"></span>'
                  : ''
              }
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([lat, lng], { icon: shelterIcon });
        marker.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold ${isBlocked ? 'text-red-400' : 'text-emerald-400'}">${shelter.name}</div>
            <div>Capacity: ${currOcc.toLocaleString()} / ${cap.toLocaleString()}</div>
            <div>Road Access: <b class="${isBlocked ? 'text-red-400' : 'text-emerald-400'}">${roadStatus.toUpperCase()}</b></div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        marker.addTo(group);
      });
    }

    // 6. Critical Infrastructure Assets
    if (mapLayers.criticalInfrastructure && assets.length > 0) {
      assets.forEach((asset) => {
        const isCritical = (asset.risk_score || (asset as any).calculatedRiskScore || 50) >= 75;
        const isSelected = selectedAsset?.id === asset.id;

        const assetIcon = L.divIcon({
          className: 'custom-asset-marker',
          html: `
            <div class="w-6 h-6 rounded-full ${
              isSelected
                ? 'bg-teal-400 border-2 border-white ring-4 ring-teal-500/50 scale-125'
                : isCritical
                ? 'bg-amber-600 border-2 border-amber-300'
                : 'bg-blue-600 border-2 border-blue-300'
            } text-white shadow-md flex items-center justify-center text-[10px] font-mono font-bold cursor-pointer transition-all hover:scale-125">
              ${asset.type === 'hospital' ? 'H' : asset.type === 'power_substation' ? '⚡' : '⚙'}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([asset.lat || (asset as any).latitude, asset.lng || (asset as any).longitude], { icon: assetIcon });
        marker.on('click', () => {
          setSelectedAsset(asset);
          setSelectedVillage(null);
        });

        marker.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold text-amber-300">${asset.name}</div>
            <div>Risk Score: ${(asset as any).calculatedRiskScore || asset.risk_score}/100</div>
            <div class="text-teal-400 text-[10px] mt-1">Click to Inspect in Panel &gt;</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        marker.addTo(group);
      });
    }

    // 7. Village Markers with Risk Scores
    if (villages.length > 0) {
      villages.forEach((village) => {
        const calculatedVillage = village as unknown as CalculatedVillageOutput;
        const riskScore = calculatedVillage.risk?.overallRisk || calculatedVillage.overall_risk || 50;
        const riskClass = calculatedVillage.risk?.riskClass || 'High';
        const isCrit = riskClass === 'Critical';
        const isSelected = selectedVillage?.id === village.id;

        const colorBg =
          isCrit
            ? 'bg-red-600'
            : riskClass === 'High'
            ? 'bg-orange-600'
            : riskClass === 'Moderate'
            ? 'bg-amber-600'
            : 'bg-emerald-600';

        const ringColor = isSelected
          ? 'border-white ring-4 ring-teal-400 scale-125'
          : isCrit
          ? 'border-red-300 shadow-red-500/60'
          : 'border-orange-300';

        const isP0 = (calculatedVillage.evacuation?.evacuationPriority || calculatedVillage.priority_level) === 'P0';

        const villageIcon = L.divIcon({
          className: 'custom-village-marker',
          html: `
            <div class="relative flex items-center justify-center group cursor-pointer">
              <div class="w-8 h-8 rounded-full ${colorBg} border-2 ${ringColor} text-white shadow-xl flex items-center justify-center font-mono font-extrabold text-xs transition-all transform group-hover:scale-125">
                ${riskScore}
              </div>
              ${
                isP0
                  ? '<span class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping opacity-75"></span>'
                  : ''
              }
              <div class="absolute -bottom-5 bg-navy-950/95 text-slate-100 text-[10px] font-mono px-1.5 py-0.2 rounded border border-navy-700 whitespace-nowrap shadow-md pointer-events-none">
                ${village.name}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([village.lat || (village as any).latitude, village.lng || (village as any).longitude], { icon: villageIcon });
        marker.on('click', () => {
          setSelectedVillage(calculatedVillage);
          setSelectedAsset(null);
        });

        marker.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold text-white">${village.name}</div>
            <div>Risk: <b class="${isCrit ? 'text-red-400' : 'text-orange-400'}">${riskScore}/100 (${riskClass.toUpperCase()})</b></div>
            <div>Priority: ${calculatedVillage.evacuation?.evacuationPriority || 'P0'}</div>
            <div>Population: ${village.population.toLocaleString()}</div>
            <div class="text-teal-300 text-[10px] mt-1">Click to Inspect in Panel &gt;</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        marker.addTo(group);
      });
    }
  }, [
    mapLayers,
    activeHazardView,
    timelinePhase,
    scenarioInputs,
    villages,
    assets,
    shelters,
    evacuationRoutes,
    selectedVillage,
    selectedAsset,
  ]);

  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([CENTER_LAT, CENTER_LNG], 11);
    }
  };

  const handleFitDistrict = () => {
    if (mapInstanceRef.current && villages.length > 0) {
      const latLngs = villages
        .map((v) => [v.lat || (v as any).latitude, v.lng || (v as any).longitude])
        .filter(([lat, lng]) => lat && lng) as [number, number][];
      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  const selectedVillageData = selectedVillage as unknown as CalculatedVillageOutput | null;

  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-col bg-navy-950 text-slate-100 font-sans select-none relative overflow-hidden">
      {/* Top Map Control Bar */}
      <div className="bg-navy-900 border-b border-navy-750 px-4 py-2.5 z-20 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Forecast Time Selector */}
        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-navy-800 font-mono text-xs">
          <div className="flex items-center gap-1 px-2 text-[10px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Phase:</span>
          </div>
          {PHASES.map((p) => (
            <button
              key={p.id}
              onClick={() => setTimelinePhase(p.id)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                timelinePhase === p.id
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Hazard Selector */}
        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-navy-800 font-mono text-xs">
          <button
            onClick={() => setActiveHazardView('combined')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeHazardView === 'combined'
                ? 'bg-teal-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Combined Risk
          </button>
          <button
            onClick={() => setActiveHazardView('surge')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeHazardView === 'surge'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Storm Surge
          </button>
          <button
            onClick={() => setActiveHazardView('flood')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeHazardView === 'flood'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flood Inundation
          </button>
          <button
            onClick={() => setActiveHazardView('wind')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeHazardView === 'wind'
                ? 'bg-rose-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wind Hazard
          </button>
        </div>

        {/* Quick Toggles, Fit Region & Reset Map */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => toggleMapLayer('criticalInfrastructure')}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              mapLayers.criticalInfrastructure
                ? 'bg-navy-800 text-amber-300 border-amber-500/40'
                : 'bg-navy-950 text-slate-500 border-navy-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Assets</span>
          </button>

          <button
            onClick={() => toggleMapLayer('evacuationRoutes')}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              mapLayers.evacuationRoutes
                ? 'bg-navy-800 text-emerald-300 border-emerald-500/40'
                : 'bg-navy-950 text-slate-500 border-navy-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Routes</span>
          </button>

          <button
            onClick={handleFitDistrict}
            className="px-2.5 py-1.5 bg-navy-850 hover:bg-navy-800 text-teal-300 rounded-lg border border-navy-750 flex items-center gap-1.5 transition-colors"
            title="Fit to Sundar Coast District"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit District</span>
          </button>

          <button
            onClick={handleResetMap}
            className="p-1.5 bg-navy-850 hover:bg-navy-800 text-slate-300 rounded-lg border border-navy-750 transition-colors"
            title="Reset Map View"
            aria-label="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Map Body (Map + Left Layers + Right Insight Drawer) */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Left Vertical Map Legend / Layers Control */}
        <div className="absolute top-4 left-4 z-10 bg-navy-900/90 backdrop-blur-md border border-navy-750 p-3 rounded-2xl shadow-2xl max-w-[210px] space-y-2.5 font-mono text-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>GIS Layer Control</span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => toggleMapLayer('cycloneTrack')}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border text-[11px] transition-colors ${
                mapLayers.cycloneTrack
                  ? 'bg-rose-500/15 text-rose-200 border-rose-500/30'
                  : 'bg-navy-950 text-slate-500 border-navy-800'
              }`}
            >
              <span>Storm Track &amp; Cone</span>
              {mapLayers.cycloneTrack ? <Eye className="w-3 h-3 text-rose-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>

            <button
              onClick={() => toggleMapLayer('stormSurge')}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border text-[11px] transition-colors ${
                mapLayers.stormSurge
                  ? 'bg-purple-500/15 text-purple-200 border-purple-500/30'
                  : 'bg-navy-950 text-slate-500 border-navy-800'
              }`}
            >
              <span>Surge Inundation</span>
              {mapLayers.stormSurge ? <Eye className="w-3 h-3 text-purple-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>

            <button
              onClick={() => toggleMapLayer('floodExtent')}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border text-[11px] transition-colors ${
                mapLayers.floodExtent
                  ? 'bg-cyan-500/15 text-cyan-200 border-cyan-500/30'
                  : 'bg-navy-950 text-slate-500 border-navy-800'
              }`}
            >
              <span>Delta Flood Extent</span>
              {mapLayers.floodExtent ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>

            <button
              onClick={() => toggleMapLayer('evacuationRoutes')}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border text-[11px] transition-colors ${
                mapLayers.evacuationRoutes
                  ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30'
                  : 'bg-navy-950 text-slate-500 border-navy-800'
              }`}
            >
              <span>Evacuation Routes</span>
              {mapLayers.evacuationRoutes ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
            </button>
          </div>

          <div className="pt-1 border-t border-navy-800 text-[9px] text-slate-400">
            Model estimate • Sundar Coast
          </div>
        </div>

        {/* Map Container Canvas */}
        <div ref={mapContainerRef} className="flex-1 h-full w-full z-0" />

        {/* Right Contextual Narrative Insight Drawer */}
        <div className="w-80 md:w-96 bg-navy-900 border-l border-navy-750 p-4 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto font-sans">
          {selectedVillageData ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-navy-750 pb-3">
                <div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      selectedVillageData.risk.riskClass === 'Critical'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                    }`}
                  >
                    {selectedVillageData.risk.riskClass} Risk • {selectedVillageData.risk.overallRisk}/100
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    {selectedVillageData.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Population: <strong className="text-white font-mono">{selectedVillageData.population.toLocaleString()}</strong> ({selectedVillageData.elderlyPopulation + selectedVillageData.childrenPopulation} vulnerable)
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVillage(null)}
                  className="p-1 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white"
                  aria-label="Close detail"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Narrative Risk Attribution with Contributing Factor Bars */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
                  Why It Is At Risk
                </div>

                <div className="space-y-2">
                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Low Elevation ({selectedVillageData.elevationMeters.toFixed(1)}m AMSL)</span>
                      <span className="font-mono text-red-400 font-bold">+22 pts</span>
                    </div>
                    <div className="h-1.5 bg-navy-850 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Storm Surge ({scenarioInputs.stormSurgeMeters.toFixed(1)}m Peak)</span>
                      <span className="font-mono text-rose-400 font-bold">+20 pts</span>
                    </div>
                    <div className="h-1.5 bg-navy-850 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Flood Inundation Probability ({selectedVillageData.evacuation.floodProbabilityPct}%)</span>
                      <span className="font-mono text-blue-400 font-bold">+18 pts</span>
                    </div>
                    <div className="h-1.5 bg-navy-850 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Directives */}
              <div className="bg-navy-950 p-3.5 rounded-xl border border-teal-500/30 space-y-2 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Recommended Action
                  </div>
                  <div className="font-bold text-teal-300 mt-0.5">
                    Begin {selectedVillageData.evacuation.evacuationPriority} evacuation immediately.
                  </div>
                </div>

                <div className="pt-2 border-t border-navy-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Recommended Destination
                  </div>
                  <div className="font-bold text-white flex items-center justify-between mt-0.5">
                    <span>{selectedVillageData.evacuation.nearestRecommendedShelter.name}</span>
                    <span className="text-[10px] font-mono text-teal-400">
                      {selectedVillageData.evacuation.shelterCapacityStatus.availableBeds.toLocaleString()} beds free
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-navy-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Safe Evacuation Route
                  </div>
                  <div className="font-bold text-slate-200 mt-0.5">
                    {selectedVillageData.evacuation.recommendedRouteName} ({selectedVillageData.evacuation.routeStatus})
                  </div>
                </div>
              </div>

              {/* Rejection Note if Shelter A was rejected */}
              {selectedVillageData.evacuation.rejectedNearestShelter && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Shelter Rerouted:</strong> {selectedVillageData.evacuation.rejectedNearestShelter.reason}
                  </span>
                </div>
              )}
            </div>
          ) : selectedAsset ? (
            /* Asset Deep-Dive Drawer */
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-navy-750 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        ((selectedAsset as any).calculatedRiskScore || selectedAsset.risk_score || 50) >= 75
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      Risk: {(selectedAsset as any).calculatedRiskScore || selectedAsset.risk_score}/100
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Criticality {selectedAsset.criticality}/100
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    {selectedAsset.name}
                  </h3>
                  <p className="text-xs text-slate-300 capitalize">
                    {selectedAsset.type.replace('_', ' ')} • Sundar Coastal Zone
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white"
                  aria-label="Close detail"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contributing Hazard Factors */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
                  Hazard &amp; Vulnerability Drivers
                </div>

                <div className="space-y-2">
                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Storm Surge Inundation</span>
                      <span className="font-mono text-rose-400 font-bold">
                        {((selectedAsset as any).surge_exposure_pct ?? 75)}% Exposure
                      </span>
                    </div>
                    <div className="h-1.5 bg-navy-850 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(selectedAsset as any).surge_exposure_pct ?? 75}%` }} />
                    </div>
                  </div>

                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Access Road Inundation</span>
                      <span className="font-mono text-amber-400 font-bold">High Risk</span>
                    </div>
                    <div className="h-1.5 bg-navy-850 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Backup Generation Status</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {selectedAsset.backup_power_ready || (selectedAsset as any).backupPowerAvailable ? 'VERIFIED READY' : 'NO BACKUP'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-navy-950 p-3.5 rounded-xl border border-amber-500/30 space-y-2 text-xs">
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  Recommended Tactical Action
                </div>
                <div className="font-bold text-white text-xs leading-relaxed">
                  {selectedAsset.recommended_actions?.[0] || 'Stage mobile flood barriers and initiate emergency patient relocation.'}
                </div>
              </div>

              {/* Evidence Lineage Trigger Button */}
              <button
                onClick={() => {
                  setEvidenceAsset(selectedAsset);
                  setIsEvidenceModalOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-teal-600/30 to-blue-600/30 hover:from-teal-600/50 hover:to-blue-600/50 border border-teal-500/40 text-teal-300 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>View Full Evidence Lineage &gt;</span>
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 text-teal-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">
                Contextual Risk Inspector
              </h4>
              <p className="text-xs text-slate-400">
                Select a village, road, shelter or critical asset on the map to inspect its deterministic hazard attribution, failure impact, and evacuation status.
              </p>
            </div>
          )}

          {/* Bottom Disclaimers */}
          <div className="pt-4 border-t border-navy-750 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              GIS Model Estimate
            </span>
            <span className="text-teal-400">78% Confidence</span>
          </div>
        </div>
      </div>

      {/* BOTTOM TIME SCRUBBER (Interactive Cinematic Timeline) */}
      <div className="bg-navy-900 border-t border-navy-750 px-6 py-2.5 z-20 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 flex-shrink-0">
          <Clock className="w-4 h-4 text-teal-400" />
          <span className="font-bold text-white">Scenario Scrubber:</span>
        </div>

        <div className="flex-1 max-w-3xl flex items-center gap-2 relative">
          <div className="w-full flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-navy-950 rounded-full -translate-y-1/2" />
            {PHASES.map((p) => {
              const isCurrent = timelinePhase === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setTimelinePhase(p.id)}
                  className={`relative z-10 flex flex-col items-center group focus:outline-none transition-all ${
                    isCurrent ? 'scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      isCurrent
                        ? 'bg-teal-400 border-white ring-4 ring-teal-500/40'
                        : 'bg-navy-800 border-navy-700'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono font-bold mt-1 ${
                      isCurrent ? 'text-teal-300' : 'text-slate-400'
                    }`}
                  >
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 flex-shrink-0 hidden md:block">
          Landfall in <strong className="text-teal-300">24 Hours</strong>
        </div>
      </div>

      {/* Evidence Chain Modal for Map Assets */}
      {evidenceAsset && (
        <EvidenceChainModal
          asset={evidenceAsset}
          isOpen={isEvidenceModalOpen}
          onClose={() => setIsEvidenceModalOpen(false)}
        />
      )}
    </div>
  );
};
