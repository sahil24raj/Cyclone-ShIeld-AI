import { EvacuationRoute } from '../types';

export const MOCK_EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: 'rt-01',
    name: 'Coastal Highway (SH-12 Lower Sector)',
    from: 'Coastal Ward 7 / Mangrove Hamlet',
    to: 'Shelter A (Coastal Cyclone Shelter)',
    distance_km: 5.8,
    status: 'blocked',
    is_elevated: false,
    capacity_vehicles_per_hr: 450,
    estimated_travel_time_min: 45,
    elevation_avg: 1.8,
    coordinates: [
      [20.45, 86.82],
      [20.455, 86.85],
      [20.46, 86.88]
    ]
  },
  {
    id: 'rt-02',
    name: 'Elevated Corridor 2 (Puri-Sundar Bypass)',
    from: 'Coastal Ward 7 Junction',
    to: 'Shelter B (Model High School Complex)',
    distance_km: 7.2,
    status: 'clear',
    is_elevated: true,
    capacity_vehicles_per_hr: 900,
    estimated_travel_time_min: 18,
    elevation_avg: 6.5,
    coordinates: [
      [20.45, 86.82],
      [20.48, 86.81],
      [20.52, 86.82]
    ]
  },
  {
    id: 'rt-03',
    name: 'Delta Embankment Road',
    from: 'Delta Nagar',
    to: 'Shelter C / Port Trust Stadium',
    distance_km: 6.4,
    status: 'vulnerable',
    is_elevated: false,
    capacity_vehicles_per_hr: 300,
    estimated_travel_time_min: 35,
    elevation_avg: 2.2,
    coordinates: [
      [20.38, 86.72],
      [20.35, 86.68],
      [20.31, 86.60]
    ]
  },
  {
    id: 'rt-04',
    name: 'Mahanadi North Trunk Road',
    from: 'Riverbend',
    to: 'Shelter B / Shelter E',
    distance_km: 8.5,
    status: 'clear',
    is_elevated: true,
    capacity_vehicles_per_hr: 850,
    estimated_travel_time_min: 22,
    elevation_avg: 7.2,
    coordinates: [
      [20.42, 86.68],
      [20.48, 86.74],
      [20.52, 86.82]
    ]
  },
  {
    id: 'rt-05',
    name: 'Sundar Pur High Capacity Ring Road',
    from: 'Sundar Pur',
    to: 'Shelter E (Polytechnic Campus)',
    distance_km: 3.1,
    status: 'clear',
    is_elevated: true,
    capacity_vehicles_per_hr: 1400,
    estimated_travel_time_min: 8,
    elevation_avg: 8.8,
    coordinates: [
      [20.55, 86.91],
      [20.555, 86.90],
      [20.56, 86.89]
    ]
  }
];

export const EVACUATION_SUMMARY = {
  totalPopToEvacuate: 284000,
  evacuatedSoFar: 142000,
  remainingToEvacuate: 142000,
  shelterCapacityTotal: 192000,
  shelterCapacityGap: 92000,
  p0Population: 22600, // Coastal Ward 7 + Delta Nagar + Riverbend + Mangrove Hamlet
  vulnerableGroups: {
    elderly: 2752,
    children: 4423,
    pregnantOrMedical: 1140
  },
  transportFleetAssigned: {
    busesStateTransport: 140,
    tractorsAndTrailers: 220,
    amphibiousRescueCraft: 18,
    ndrfInflatableBoats: 32
  }
};
