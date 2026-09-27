import { ScenarioInputs } from '../types/disaster';
import { MOCK_VILLAGES_LIST } from './mockVillages';
import { MOCK_INFRASTRUCTURE_LIST } from './mockInfrastructure';
import { MOCK_ROADS_LIST } from './mockRoads';
import { DEFAULT_SCENARIO_INPUTS } from './mockStorm';

export function getMockGeoJson(inputs: ScenarioInputs = DEFAULT_SCENARIO_INPUTS) {
  const trackShiftDeg = inputs.trackShiftKm * 0.009;

  // Track coordinates
  const trackLine: [number, number][] = [
    [87.90, 18.50],
    [87.50, 19.30],
    [87.10, 20.00 + trackShiftDeg * 0.5],
    [86.82, 20.48 + trackShiftDeg],
    [86.40, 20.95 + trackShiftDeg * 1.2],
    [85.90, 21.40 + trackShiftDeg * 1.5],
  ];

  // Surge zone polygon (GeoJSON: [lng, lat])
  const surgePolygon: [number, number][] = [
    [87.05 + trackShiftDeg * 0.5, 20.52],
    [86.92 + trackShiftDeg * 0.5, 20.46],
    [86.85 + trackShiftDeg * 0.5, 20.42],
    [86.72 + trackShiftDeg * 0.5, 20.35],
    [86.60 + trackShiftDeg * 0.5, 20.28],
    [86.48, 20.22],
    [86.62, 20.18],
    [86.88, 20.30],
    [87.18, 20.45],
    [87.05 + trackShiftDeg * 0.5, 20.52],
  ];

  // Flood zone polygon
  const floodPolygon: [number, number][] = [
    [86.78, 20.48],
    [86.83, 20.45],
    [86.74, 20.41],
    [86.68, 20.38],
    [86.65, 20.43],
    [86.78, 20.48],
  ];

  // Rainfall Hotspot polygon
  const rainPolygon: [number, number][] = [
    [86.70, 20.65],
    [87.05, 20.62],
    [86.95, 20.35],
    [86.58, 20.32],
    [86.70, 20.65],
  ];

  return {
    type: 'FeatureCollection',
    features: [
      // Cyclone Track
      {
        type: 'Feature',
        properties: { name: 'Cyclone Track', type: 'cyclone_track' },
        geometry: {
          type: 'LineString',
          coordinates: trackLine,
        },
      },
      // Surge Zone
      {
        type: 'Feature',
        properties: { name: 'Storm Surge Inundation Zone', type: 'storm_surge', peakSurgeMeters: inputs.stormSurgeMeters },
        geometry: {
          type: 'Polygon',
          coordinates: [surgePolygon],
        },
      },
      // Flood Inundation Zone
      {
        type: 'Feature',
        properties: { name: 'Sentinel-1 SAR Inundation Zone', type: 'flood_extent', rainfallMm: inputs.rainfallMm },
        geometry: {
          type: 'Polygon',
          coordinates: [floodPolygon],
        },
      },
      // Rainfall Hotspot
      {
        type: 'Feature',
        properties: { name: 'Rainfall Accumulation Hotspot', type: 'rainfall_hotspot', rainfallMm: inputs.rainfallMm },
        geometry: {
          type: 'Polygon',
          coordinates: [rainPolygon],
        },
      },
      // Villages
      ...MOCK_VILLAGES_LIST.map((v) => ({
        type: 'Feature',
        properties: { ...v, featureType: 'village' },
        geometry: {
          type: 'Point',
          coordinates: [v.longitude, v.latitude],
        },
      })),
      // Infrastructure
      ...MOCK_INFRASTRUCTURE_LIST.map((infra) => ({
        type: 'Feature',
        properties: { ...infra, featureType: 'infrastructure' },
        geometry: {
          type: 'Point',
          coordinates: [infra.longitude, infra.latitude],
        },
      })),
      // Roads
      ...MOCK_ROADS_LIST.map((road) => ({
        type: 'Feature',
        properties: { ...road, featureType: 'road' },
        geometry: {
          type: 'LineString',
          coordinates: road.coordinates.map(([lat, lng]) => [lng, lat]),
        },
      })),
    ],
  };
}

const defaultGeoJson = getMockGeoJson(DEFAULT_SCENARIO_INPUTS);
export const MOCK_GEOJSON_TRACK = defaultGeoJson.features.find((f: any) => f.properties?.type === 'cyclone_track');
export const MOCK_GEOJSON_SURGE_ZONE = defaultGeoJson.features.find((f: any) => f.properties?.type === 'storm_surge');
export const MOCK_GEOJSON_FLOOD_ZONE = defaultGeoJson.features.find((f: any) => f.properties?.type === 'flood_extent');
