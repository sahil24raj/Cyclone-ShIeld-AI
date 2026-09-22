import { Shelter, EvacuationRoute } from '../types';

export const FIXTURE_SHELTERS: (Shelter & { isFixture: true })[] = [
  {
    id: 'S01',
    name: 'Shelter A - Coastal Multi-Purpose Cyclone Shelter',
    lat: 19.85,
    lng: 85.88,
    capacity: 2500,
    current_occupancy: 2150,
    elevation: 4.8,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-94370-11221',
    assigned_villages: ['Coastal Ward 7', 'Fishermen Colony'],
    isFixture: true
  },
  {
    id: 'S02',
    name: 'Shelter B - Block High School Elevated Shelter',
    lat: 19.87,
    lng: 85.84,
    capacity: 3500,
    current_occupancy: 1800,
    elevation: 6.2,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-94370-22332',
    assigned_villages: ['Coastal Ward 7 (Rerouted)', 'Sundar Pur'],
    isFixture: true
  },
  {
    id: 'S03',
    name: 'Shelter C - Mangrove Sector Relief Center',
    lat: 19.77,
    lng: 85.80,
    capacity: 1800,
    current_occupancy: 1750,
    elevation: 3.2,
    in_flood_zone: true,
    is_operational: true,
    has_generator: true,
    has_medical_kit: false,
    access_road_status: 'partially_flooded',
    contact_number: '+91-94370-33443',
    assigned_villages: ['Delta Nagar', 'Mangrove Hamlet'],
    isFixture: true
  },
  {
    id: 'S04',
    name: 'Shelter D - North Ridge Community Complex',
    lat: 19.94,
    lng: 85.81,
    capacity: 4000,
    current_occupancy: 920,
    elevation: 9.5,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-94370-44554',
    assigned_villages: ['North Ridge', 'Central Cantonment'],
    isFixture: true
  },
  {
    id: 'S05',
    name: 'Shelter E - East Embankment Panchayat Hall',
    lat: 19.90,
    lng: 85.91,
    capacity: 2200,
    current_occupancy: 1650,
    elevation: 5.1,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-94370-55665',
    assigned_villages: ['East Embankment'],
    isFixture: true
  }
];

export const FIXTURE_EVACUATION_ROUTES: (EvacuationRoute & { isFixture: true })[] = [
  {
    id: 'R01',
    name: 'Route 1: SH-12 Coastal Highway',
    from: 'Coastal Ward 7',
    to: 'Shelter A',
    distance_km: 4.2,
    status: 'flooded',
    is_elevated: false,
    capacity_vehicles_per_hr: 300,
    estimated_travel_time_min: 65,
    elevation_avg: 1.6,
    coordinates: [
      [19.82, 85.88],
      [19.83, 85.88],
      [19.84, 85.88],
      [19.85, 85.88]
    ],
    isFixture: true
  },
  {
    id: 'R02',
    name: 'Route 2: Elevated Bypass Corridor 2',
    from: 'Coastal Ward 7',
    to: 'Shelter B',
    distance_km: 6.8,
    status: 'clear',
    is_elevated: true,
    capacity_vehicles_per_hr: 850,
    estimated_travel_time_min: 22,
    elevation_avg: 5.8,
    coordinates: [
      [19.82, 85.88],
      [19.84, 85.86],
      [19.86, 85.85],
      [19.87, 85.84]
    ],
    isFixture: true
  },
  {
    id: 'R03',
    name: 'Route 3: Delta Western Embankment Road',
    from: 'Delta Nagar',
    to: 'Shelter C',
    distance_km: 3.1,
    status: 'vulnerable',
    is_elevated: false,
    capacity_vehicles_per_hr: 450,
    estimated_travel_time_min: 35,
    elevation_avg: 2.8,
    coordinates: [
      [19.79, 85.82],
      [19.78, 85.81],
      [19.77, 85.80]
    ],
    isFixture: true
  },
  {
    id: 'R04',
    name: 'Route 4: Inland Trunk Highway NH-316',
    from: 'Sundar Pur',
    to: 'Shelter D',
    distance_km: 9.4,
    status: 'clear',
    is_elevated: true,
    capacity_vehicles_per_hr: 1400,
    estimated_travel_time_min: 18,
    elevation_avg: 8.2,
    coordinates: [
      [19.86, 85.84],
      [19.90, 85.83],
      [19.94, 85.81]
    ],
    isFixture: true
  }
];
