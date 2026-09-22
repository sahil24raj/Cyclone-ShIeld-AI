import { CycloneTrackPoint } from '../types';

export const CYCLONE_METADATA = {
  name: 'Cyclone Varuna',
  name_hi: 'चक्रवात वरुणा',
  name_bn: 'ঘূর্ণিঝড় বরুণ',
  name_or: 'ବାତ୍ୟା ବରୁଣ',
  systemId: 'BOB-2026-03S',
  category: 'Severe Cyclonic Storm',
  basin: 'North Indian Ocean / Bay of Bengal',
  currentPhase: 'T-24h' as const,
  currentWindKmh: 135,
  peakWindKmh: 155,
  currentPressureHpa: 974,
  estimatedLandfallTime: 'Tomorrow, 08:30 IST (~24 hours)',
  landfallLocationName: 'Sundar Coast Delta, South Sector',
  landfallCoordinates: [20.15, 86.50] as [number, number],
  estimatedSurgeHeightMeters: 3.4,
  projectedRainfall24hMm: 280,
  forwardSpeedKmh: 18,
  confidenceLevel: 88, // %
  lastSatellitePass: 'Sentinel-1A SAR (05:40 UTC) & INSAT-3DR TIR',
  officialImdAdvisoryNo: 'PROTOTYPE-BULLETIN-14',
  disclaimer: 'Prototype scenario simulation for hackathon demonstration. Does not replace official IMD/NDMA bulletins.'
};

export const MOCK_CYCLONE_TRACK: CycloneTrackPoint[] = [
  {
    time: 'T-48h',
    lat: 20.80,
    lng: 87.20,
    wind: 95,
    pressure: 994,
    category: 'Cyclonic Storm',
    surgeEstimate: 1.2,
    rainfall24h: 90,
    uncertaintyRadiusKm: 15,
  },
  {
    time: 'T-36h',
    lat: 20.65,
    lng: 87.05,
    wind: 110,
    pressure: 986,
    category: 'Severe Cyclonic Storm',
    surgeEstimate: 2.1,
    rainfall24h: 160,
    uncertaintyRadiusKm: 25,
  },
  {
    time: 'T-24h',
    lat: 20.48,
    lng: 86.85,
    wind: 135,
    pressure: 974,
    category: 'Very Severe Cyclonic Storm (Current)',
    surgeEstimate: 3.4,
    rainfall24h: 280,
    uncertaintyRadiusKm: 40,
  },
  {
    time: 'T-12h',
    lat: 20.30,
    lng: 86.65,
    wind: 145,
    pressure: 968,
    category: 'Very Severe Cyclonic Storm',
    surgeEstimate: 4.1,
    rainfall24h: 340,
    uncertaintyRadiusKm: 65,
  },
  {
    time: 'T-00h',
    lat: 20.15,
    lng: 86.50,
    wind: 150,
    pressure: 962,
    category: 'Landfall Peak Intensity',
    surgeEstimate: 4.6,
    rainfall24h: 380,
    uncertaintyRadiusKm: 85,
  },
  {
    time: 'T+06h',
    lat: 20.10,
    lng: 86.45,
    wind: 105,
    pressure: 982,
    category: 'Weakening Post-Landfall',
    surgeEstimate: 2.2,
    rainfall24h: 210,
    uncertaintyRadiusKm: 110,
  }
];

export const WIND_TREND_DATA = [
  { time: 'T-48h', wind: 95, pressure: 994, popExposed: 1.1 },
  { time: 'T-36h', wind: 110, pressure: 986, popExposed: 1.8 },
  { time: 'T-24h', wind: 135, pressure: 974, popExposed: 2.84 },
  { time: 'T-12h (Est)', wind: 145, pressure: 968, popExposed: 3.2 },
  { time: 'Landfall (Est)', wind: 150, pressure: 962, popExposed: 3.65 },
  { time: 'T+06h (Est)', wind: 105, pressure: 982, popExposed: 2.4 }
];
