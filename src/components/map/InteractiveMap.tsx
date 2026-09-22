import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useAppState } from '../../context/AppStateContext';
import { MOCK_CYCLONE_TRACK, CYCLONE_METADATA } from '../../data/cycloneData';
import { MOCK_VILLAGES } from '../../data/villageData';
import { MOCK_ASSETS, MOCK_SHELTERS } from '../../data/infrastructureData';
import { MOCK_EVACUATION_ROUTES } from '../../data/evacuationData';
import { MapLegend } from './MapLegend';
import { VillageRiskDrawer } from './VillageRiskDrawer';
import { AssetDetailModal } from './AssetDetailModal';
import { calculateVillageRisk, getRiskLevel } from '../../utils/riskCalculator';

export const InteractiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const {
    mapLayers,
    basemapStyle,
    timelinePhase,
    simulationParams,
    selectedVillage,
    setSelectedVillage,
    selectedAsset,
    setSelectedAsset,
  } = useAppState();

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Sundar Coast District (Bay of Bengal coast)
    const map = L.map(mapContainerRef.current, {
      center: [20.48, 86.82],
      zoom: 11,
      zoomControl: false,
      minZoom: 9,
      maxZoom: 16,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

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

    const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY || 'cb1_3t5l_1_a644c0e42df5a70a5cea7a0f';

    let newTileLayer: L.TileLayer;

    if (basemapStyle === 'satellite') {
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri World Imagery &copy; Earthstar Geographics',
          maxZoom: 19,
        }
      );
    } else if (basemapStyle === 'carto') {
      newTileLayer = L.tileLayer(
        `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?api_key=${cartoApiKey}`,
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
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

  // Update Dynamic Map Layers whenever toggles, phase, or simulation params change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const trackShift = simulationParams.trackShiftKm * 0.009; // deg approx

    // 1. Sundar Coast District Boundary
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

    // 2. Storm Surge Inundation Zone (Along coastal boundary and estuaries)
    if (mapLayers.stormSurge) {
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
        .bindTooltip(`<b>Storm Surge Hazard Zone</b><br>Projected Surge: ${(3.4 + simulationParams.surgeHeightOffset).toFixed(1)}m<br>Peak Tide Inundation`, {
          className: 'leaflet-tooltip-dark',
        })
        .addTo(group);
    }

    // 3. Flood Extent / Inland Water Inundation (Sentinel-1 SAR simulated polygon)
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
        .bindTooltip('<b>Sentinel-1 Flood Inundation Extent</b><br>Water index: SAR change detected<br>Water depth: 0.8 - 2.3m', {
          className: 'leaflet-tooltip-dark',
        })
        .addTo(group);
    }

    // 4. CHIRPS Rainfall Isohyet Layer
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
        .bindTooltip(`<b>CHIRPS Rainfall Isohyet</b><br>24h Accumulation: ${Math.round(280 * simulationParams.rainfallMultiplier)}mm`, {
          className: 'leaflet-tooltip-dark',
        })
        .addTo(group);
    }

    // 5. Cyclone Track, Uncertainty Cone & Gale Radii
    if (mapLayers.cycloneTrack) {
      const adjustedTrack = MOCK_CYCLONE_TRACK.map((pt) => ({
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

        adjustedTrack.forEach((pt, i) => {
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

      // Wind Radius Buffer at current point
      if (mapLayers.windRadius) {
        const currentPt = adjustedTrack.find((p) => p.time === 'T-24h') || adjustedTrack[2];
        const currentWindSpeed = 135 * simulationParams.windSpeedMultiplier;

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
    if (mapLayers.evacuationRoutes) {
      MOCK_EVACUATION_ROUTES.forEach((route) => {
        const isBlocked = route.status === 'blocked';
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
    MOCK_SHELTERS.forEach((shelter) => {
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

    // 8. Critical Infrastructure Assets
    if (mapLayers.criticalInfrastructure) {
      MOCK_ASSETS.forEach((asset) => {
        const isCritical = asset.risk_score >= 80;

        const assetIcon = L.divIcon({
          className: 'custom-asset-marker',
          html: `
            <div class="w-6 h-6 rounded-full ${
              isCritical ? 'bg-amber-600 border-2 border-amber-300' : 'bg-blue-600 border-2 border-blue-300'
            } text-white shadow-md flex items-center justify-center text-[10px] font-mono font-bold cursor-pointer transition-transform hover:scale-125">
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
            <div class="text-cyan-400 text-[10px] mt-1">Click for Action Checklist &gt;</div>
          </div>`,
          { className: 'leaflet-tooltip-dark' }
        );

        marker.addTo(group);
      });
    }

    // 9. Village Risk Markers (Always on map)
    MOCK_VILLAGES.forEach((village) => {
      const riskBreakdown = calculateVillageRisk(village, simulationParams);
      const level = getRiskLevel(riskBreakdown.overallRisk);

      const colorBg =
        level === 'critical'
          ? 'bg-red-600'
          : level === 'high'
          ? 'bg-orange-600'
          : level === 'moderate'
          ? 'bg-amber-600'
          : 'bg-emerald-600';

      const ringColor =
        level === 'critical'
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
          <div class="text-cyan-400 text-[10px] mt-1">Click to view Explainable Risk &gt;</div>
        </div>`,
        { className: 'leaflet-tooltip-dark' }
      );

      marker.addTo(group);
    });
  }, [mapLayers, timelinePhase, simulationParams]);

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 bg-navy-950 overflow-hidden">
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Legend & Layer Controls */}
      <div className="absolute top-4 left-4 z-10 hidden sm:block">
        <MapLegend />
      </div>

      {/* Map Overlay Header Quick Bar */}
      <div className="absolute top-4 right-4 z-10 bg-navy-900/90 backdrop-blur-md border border-navy-750 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono flex items-center gap-3 text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 font-bold">Sundar Coast GIS</span>
        </div>
        <span className="h-3 w-px bg-navy-700" />
        <span className="text-[11px] text-slate-400">
          Center: 20.48°N, 86.82°E • Bay of Bengal
        </span>
      </div>

      {/* Village Risk Detail Drawer */}
      <VillageRiskDrawer
        village={selectedVillage}
        onClose={() => setSelectedVillage(null)}
      />

      {/* Asset Detail Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
};
