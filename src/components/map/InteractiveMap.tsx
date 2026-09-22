import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAppState } from '../../context/AppStateContext';
import { MapLegend } from './MapLegend';
import { DeterministicRiskEngine } from '../../services/riskEngine';
import { RotateCcw, Plus, Minus, Compass, Layers } from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const [mouseCoords, setMouseCoords] = useState<string>('20.480°N, 86.820°E');

  const {
    mapLayers,
    basemapStyle,
    timelinePhase,
    simulationParams,
    selectedVillage,
    setSelectedVillage,
    selectedAsset,
    setSelectedAsset,
    activeCyclone,
    villages,
    assets,
    shelters,
    evacuationRoutes,
  } = useAppState();

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Sundar Coast District (Bay of Bengal coast)
    const map = L.map(mapContainerRef.current, {
      center: [20.48, 86.82],
      zoom: 11,
      zoomControl: false,
      minZoom: 8,
      maxZoom: 18,
    });

    // Track mouse coordinates for GIS HUD
    map.on('mousemove', (e) => {
      setMouseCoords(`${e.latlng.lat.toFixed(3)}°N, ${e.latlng.lng.toFixed(3)}°E`);
    });

    const layerGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Manage Dynamic Basemap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newTileLayer: L.TileLayer;

    if (basemapStyle === 'satellite') {
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri World Imagery &copy; Earthstar Geographics',
          maxZoom: 19,
        }
      );
    } else if (basemapStyle === 'osm') {
      newTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
    } else {
      // Default: Clean Dark Gray Canvas (Watermark-free)
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri &copy; OpenStreetMap contributors &copy; GIS Community',
          maxZoom: 16,
        }
      );
    }

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [basemapStyle]);

  // Center on District
  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20.48, 86.82], 11, { duration: 0.8 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Update Dynamic Map Layers whenever toggles, phase, or simulation params change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const trackShift = simulationParams.trackShiftKm * 0.009; // deg approx

    // 1. Sundar Coast District Boundary (Always visible as reference)
    const districtCoords: [number, number][] = [
      [20.72, 86.55],
      [20.70, 87.15],
      [20.50, 87.08],
      [20.30, 86.80],
      [20.25, 86.50],
      [20.45, 86.50],
      [20.72, 86.55],
    ];

    L.polygon(districtCoords, {
      color: '#38BDF8',
      weight: 1.5,
      dashArray: '4, 4',
      fillOpacity: 0.03,
      fillColor: '#0284C7',
    }).addTo(group);

    // 2. Storm Surge Inundation Zone (If enabled and storm/simulation active)
    if (mapLayers.stormSurge && activeCyclone) {
      const surgeMultiplier = 1 + simulationParams.surgeHeightOffset / 3.4;
      const surgeCoords: [number, number][] = [
        [20.52, 87.05 + trackShift * 0.5],
        [20.46, 86.92 + trackShift * 0.5],
        [20.42, 86.85 + trackShift * 0.5],
        [20.35, 86.72 + trackShift * 0.5],
        [20.28, 86.60 + trackShift * 0.5],
        [20.22, 86.48],
        [20.18, 86.62],
        [20.30, 86.88],
        [20.45, 87.18],
      ];

      L.polygon(surgeCoords, {
        color: '#8B5CF6',
        weight: 2,
        fillColor: '#8B5CF6',
        fillOpacity: Math.min(0.65, 0.35 * surgeMultiplier),
      })
        .bindTooltip(`<b>Storm Surge Hazard Zone</b><br>Projected Surge: ${(activeCyclone.stormSurgeMax + simulationParams.surgeHeightOffset).toFixed(1)}m<br>Peak Tide Inundation`, {
          className: 'leaflet-tooltip-dark',
        })
        .addTo(group);
    }

    // 3. Flood Extent / Inland Water Inundation (Sentinel-1 SAR detected polygon)
    if (mapLayers.floodExtent) {
      const floodCoords: [number, number][] = [
        [20.48, 86.78],
        [20.45, 86.83],
        [20.41, 86.74],
        [20.38, 86.68],
        [20.43, 86.65],
      ];

      L.polygon(floodCoords, {
        color: '#06B6D4',
        weight: 1.5,
        fillColor: '#06B6D4',
        fillOpacity: 0.32 * simulationParams.rainfallMultiplier,
      })
        .bindTooltip('<b>Sentinel-1 SAR Flood Inundation Extent</b><br>Surface Water Index: SAR Change Detected<br>Depth Range: 0.8 - 2.3m', {
          className: 'leaflet-tooltip-dark',
        })
        .addTo(group);
    }

    // 4. Rainfall Layer
    if (mapLayers.rainfall) {
      const rainCoords: [number, number][] = [
        [20.65, 86.70],
        [20.62, 87.05],
        [20.35, 86.95],
        [20.32, 86.58],
      ];
      L.polygon(rainCoords, {
        color: '#3B82F6',
        weight: 1,
        dashArray: '2, 6',
        fillColor: '#3B82F6',
        fillOpacity: 0.22 * simulationParams.rainfallMultiplier,
      })
        .bindTooltip(`<b>24h Precipitation Forecast</b><br>Accumulation: ${Math.round(280 * simulationParams.rainfallMultiplier)}mm`, {
          className: 'leaflet-tooltip-dark',
        })
        .addTo(group);
    }

    // 5. Cyclone Track, Uncertainty Cone & Gale Radii (Only if active cyclone exists)
    if (mapLayers.cycloneTrack && activeCyclone) {
      const allPoints = [...activeCyclone.observedTrack, ...activeCyclone.forecastTrack];
      const adjustedTrack = allPoints.map((pt) => ({
        ...pt,
        lat: pt.lat + trackShift,
      }));

      const trackLatlngs = adjustedTrack.map((pt) => [pt.lat, pt.lng] as [number, number]);

      // Track Line
      L.polyline(trackLatlngs, {
        color: '#F43F5E',
        weight: 3.5,
        opacity: 0.9,
      }).addTo(group);

      // Uncertainty Cone Polygon
      if (mapLayers.forecastCone) {
        const coneLeft: [number, number][] = [];
        const coneRight: [number, number][] = [];

        adjustedTrack.forEach((pt) => {
          const radiusDeg = (pt.uncertaintyRadiusKm / 111) * 0.7;
          coneLeft.push([pt.lat + radiusDeg * 0.6, pt.lng - radiusDeg]);
          coneRight.push([pt.lat - radiusDeg * 0.6, pt.lng + radiusDeg]);
        });

        const conePolygon = [...coneLeft, ...coneRight.reverse()];

        L.polygon(conePolygon, {
          color: '#FDA4AF',
          weight: 1,
          dashArray: '4, 4',
          fillColor: '#F43F5E',
          fillOpacity: 0.12,
        }).addTo(group);
      }

      // Track Points & Time Labels
      adjustedTrack.forEach((pt) => {
        const isCurrent = pt.time === 'T-24h';
        const isSelectedPhase = pt.time === timelinePhase;

        const circleMarker = L.circleMarker([pt.lat, pt.lng], {
          radius: isCurrent || isSelectedPhase ? 9 : 5,
          color: isCurrent ? '#FFFFFF' : '#F43F5E',
          fillColor: isCurrent ? '#EF4444' : '#FB7185',
          fillOpacity: 1,
          weight: isCurrent ? 3 : 1.5,
        });

        circleMarker.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold text-red-400">${pt.time}: ${pt.category}</div>
            <div>Max Wind: ${Math.round(pt.wind * simulationParams.windSpeedMultiplier)} km/h</div>
            <div>Central Pressure: ${pt.pressure} hPa</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        circleMarker.addTo(group);
      });

      // Gale Wind Radius Buffer
      if (mapLayers.windRadius) {
        const currentPt = adjustedTrack.find((p) => p.time === 'T-24h') || adjustedTrack[2] || adjustedTrack[0];
        const currentWindSpeed = activeCyclone.maxWindSpeed * simulationParams.windSpeedMultiplier;

        L.circle([currentPt.lat, currentPt.lng], {
          radius: currentWindSpeed * 550, // in meters
          color: '#F97316',
          weight: 1.5,
          dashArray: '6, 6',
          fillColor: '#F97316',
          fillOpacity: 0.1,
        })
          .bindTooltip(`<b>Gale Wind Radius (50 knot / 92 km/h boundary)</b><br>Max Sustained: ${Math.round(currentWindSpeed)} km/h`, {
            className: 'leaflet-tooltip-dark',
          })
          .addTo(group);
      }
    }

    // 6. Evacuation Routes
    if (mapLayers.evacuationRoutes && evacuationRoutes.length > 0) {
      evacuationRoutes.forEach((route) => {
        const isBlocked = route.status === 'blocked' || route.status === 'flooded';
        const isElevated = route.is_elevated;

        const poly = L.polyline(route.coordinates, {
          color: isBlocked ? '#EF4444' : isElevated ? '#10B981' : '#F59E0B',
          weight: isElevated ? 4.5 : 3,
          dashArray: isBlocked ? '6, 6' : undefined,
          opacity: isBlocked ? 0.8 : 0.95,
        });

        poly.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold ${isBlocked ? 'text-red-400' : 'text-emerald-400'}">${route.name}</div>
            <div>Status: <b>${route.status.toUpperCase()}</b></div>
            <div>Elevated Corridor: ${isElevated ? 'YES (Flood Safe)' : 'NO'}</div>
            <div>Transit: ~${route.estimated_travel_time_min} mins (${route.distance_km} km)</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        poly.addTo(group);
      });
    }

    // 7. Cyclone Shelters
    if (shelters.length > 0) {
      shelters.forEach((shelter) => {
        const isBlocked = shelter.access_road_status === 'blocked' || !shelter.is_operational;

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

        const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon });
        marker.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold ${isBlocked ? 'text-red-400' : 'text-emerald-400'}">${shelter.name}</div>
            <div>Capacity: ${shelter.current_occupancy} / ${shelter.capacity}</div>
            <div>Road Access: <b class="${isBlocked ? 'text-red-400' : 'text-emerald-400'}">${shelter.access_road_status.toUpperCase()}</b></div>
            <div>Generator: ${shelter.has_generator ? 'READY' : 'NONE'}</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        marker.addTo(group);
      });
    }

    // 8. Critical Infrastructure Assets
    if (mapLayers.criticalInfrastructure && assets.length > 0) {
      assets.forEach((asset) => {
        const isCritical = asset.risk_score >= 80;
        const isSelected = selectedAsset?.id === asset.id;

        const assetIcon = L.divIcon({
          className: 'custom-asset-marker',
          html: `
            <div class="w-6 h-6 rounded-full ${
              isSelected
                ? 'bg-cyan-400 border-2 border-white ring-4 ring-cyan-500/50 scale-125'
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

        const marker = L.marker([asset.lat, asset.lng], { icon: assetIcon });
        marker.on('click', () => {
          setSelectedAsset(asset);
          setSelectedVillage(null);
        });

        marker.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold text-amber-300">${asset.name}</div>
            <div>Risk Score: ${asset.risk_score}/100</div>
            <div>Status: ${asset.current_status}</div>
            <div class="text-cyan-400 text-[10px] mt-1">Click to Inspect in Panel &gt;</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        marker.addTo(group);
      });
    }

    // 9. Village Risk Markers
    if (villages.length > 0) {
      villages.forEach((village) => {
        const riskBreakdown = DeterministicRiskEngine.calculateRisk(village, simulationParams);
        const level = DeterministicRiskEngine.getRiskLevel(riskBreakdown.overallRisk);
        const isSelected = selectedVillage?.id === village.id;

        const colorBg =
          level === 'critical'
            ? 'bg-red-600'
            : level === 'high'
            ? 'bg-orange-600'
            : level === 'moderate'
            ? 'bg-amber-600'
            : 'bg-emerald-600';

        const ringColor =
          isSelected
            ? 'border-white ring-4 ring-cyan-400 scale-125'
            : level === 'critical'
            ? 'border-red-300 shadow-red-500/60'
            : level === 'high'
            ? 'border-orange-300 shadow-orange-500/60'
            : level === 'moderate'
            ? 'border-amber-300'
            : 'border-emerald-300';

        const isP0 = village.priority_level === 'P0';

        const villageIcon = L.divIcon({
          className: 'custom-village-marker',
          html: `
            <div class="relative flex items-center justify-center group cursor-pointer">
              <div class="w-8 h-8 rounded-full ${colorBg} border-2 ${ringColor} text-white shadow-xl flex items-center justify-center font-mono font-extrabold text-xs transition-all transform group-hover:scale-125">
                ${riskBreakdown.overallRisk}
              </div>
              ${
                isP0
                  ? '<span class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping opacity-75"></span>'
                  : ''
              }
              <div class="absolute -bottom-5 bg-navy-950/90 text-slate-100 text-[10px] font-mono px-1.5 py-0.2 rounded border border-navy-700 whitespace-nowrap shadow-md pointer-events-none">
                ${village.name}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([village.lat, village.lng], { icon: villageIcon });
        marker.on('click', () => {
          setSelectedVillage(village);
          setSelectedAsset(null);
        });

        marker.bindTooltip(
          `<div class="font-mono text-xs">
            <div class="font-bold text-white">${village.name}</div>
            <div>Risk: <b class="${level === 'critical' ? 'text-red-400' : 'text-orange-400'}">${riskBreakdown.overallRisk}/100 (${level.toUpperCase()})</b></div>
            <div>Priority: ${village.priority_level}</div>
            <div>Population: ${village.population.toLocaleString()}</div>
            <div class="text-cyan-400 text-[10px] mt-1">Click to Inspect in Panel &gt;</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        marker.addTo(group);
      });
    }
  }, [
    mapLayers,
    timelinePhase,
    simulationParams,
    selectedVillage,
    selectedAsset,
    activeCyclone,
    villages,
    assets,
    shelters,
    evacuationRoutes,
  ]);

  return (
    <div className="relative w-full h-full min-h-[450px] flex-1 bg-navy-950 overflow-hidden">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Legend (Top Left) */}
      <div className="absolute top-3 left-3 z-10 hidden md:block">
        <MapLegend />
      </div>

      {/* GIS Floating HUD Bar (Top Right) */}
      <div className="absolute top-3 right-3 z-10 bg-navy-900/90 backdrop-blur-md border border-navy-750 px-3 py-1.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2.5 text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 font-bold">GIS Viewport</span>
        </div>
        <span className="h-3 w-px bg-navy-800" />
        <span className="text-[10px] text-slate-400 hidden sm:inline">
          {mouseCoords}
        </span>
      </div>

      {/* Floating Zoom & Center Controls (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-navy-900/90 hover:bg-navy-800 backdrop-blur-md border border-navy-750 text-slate-200 hover:text-white flex items-center justify-center shadow-lg transition-colors font-bold"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-navy-900/90 hover:bg-navy-800 backdrop-blur-md border border-navy-750 text-slate-200 hover:text-white flex items-center justify-center shadow-lg transition-colors font-bold"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetCenter}
          className="w-8 h-8 rounded-lg bg-navy-900/90 hover:bg-navy-800 backdrop-blur-md border border-navy-750 text-cyan-400 hover:text-cyan-300 flex items-center justify-center shadow-lg transition-colors"
          title="Center on District"
          aria-label="Center on District"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
