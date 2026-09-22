import { CycloneTrackPoint } from '../types';

export interface CycloneFixtureMetadata {
  id: string;
  name: string;
  category: string;
  landfallETA: string;
  maxWindSpeed: number; // km/h
  centralPressure: number; // hPa
  stormSurgeMax: number; // meters
  rainfall24h: number; // mm
  currentPosition: {
    lat: number;
    lng: number;
  };
  trackPoints: CycloneTrackPoint[];
  isFixture: true;
  fixtureDescription: string;
}

export const FIXTURE_CYCLONE: CycloneFixtureMetadata = {
  id: 'VARUNA-2026-01',
  name: 'Cyclone Varuna (DEV FIXTURE)',
  category: 'Severe Cyclonic Storm (VSCS)',
  landfallETA: 'T-24h (2026-09-23 06:00 IST)',
  maxWindSpeed: 135,
  centralPressure: 978,
  stormSurgeMax: 3.4,
  rainfall24h: 280,
  currentPosition: {
    lat: 19.35,
    lng: 85.85,
  },
  trackPoints: [
    {
      time: 'T-48h',
      lat: 17.2,
      lng: 87.8,
      wind: 85,
      pressure: 994,
      category: 'Cyclonic Storm',
      surgeEstimate: 1.2,
      rainfall24h: 90,
      uncertaintyRadiusKm: 65,
    },
    {
      time: 'T-36h',
      lat: 18.1,
      lng: 86.9,
      wind: 110,
      pressure: 986,
      category: 'Severe Cyclonic Storm',
      surgeEstimate: 2.1,
      rainfall24h: 160,
      uncertaintyRadiusKm: 50,
    },
    {
      time: 'T-24h',
      lat: 19.35,
      lng: 85.85,
      wind: 135,
      pressure: 978,
      category: 'Very Severe Cyclonic Storm',
      surgeEstimate: 3.4,
      rainfall24h: 280,
      uncertaintyRadiusKm: 35,
    },
    {
      time: 'T-12h',
      lat: 19.9,
      lng: 85.2,
      wind: 145,
      pressure: 972,
      category: 'Very Severe Cyclonic Storm',
      surgeEstimate: 3.8,
      rainfall24h: 340,
      uncertaintyRadiusKm: 25,
    },
    {
      time: 'T-00h',
      lat: 20.3,
      lng: 84.7,
      wind: 155,
      pressure: 968,
      category: 'Very Severe Cyclonic Storm (Landfall)',
      surgeEstimate: 4.2,
      rainfall24h: 410,
      uncertaintyRadiusKm: 15,
    },
    {
      time: 'T+06h',
      lat: 20.9,
      lng: 84.2,
      wind: 95,
      pressure: 988,
      category: 'Deep Depression (Inland Dissipation)',
      surgeEstimate: 1.0,
      rainfall24h: 180,
      uncertaintyRadiusKm: 40,
    },
  ],
  isFixture: true,
  fixtureDescription: 'Synthetic Bay of Bengal cyclone track for UI development testing.'
};
