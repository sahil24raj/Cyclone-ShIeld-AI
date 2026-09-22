export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';
export type AssetType = 'hospital' | 'power_substation' | 'bridge' | 'road' | 'telecom' | 'water_treatment' | 'shelter' | 'port';
export type Language = 'en' | 'hi' | 'bn' | 'or';
export type TimelinePhase = 'T-48h' | 'T-36h' | 'T-24h' | 'T-12h' | 'T-00h' | 'T+06h';

export interface CycloneTrackPoint {
  time: TimelinePhase;
  lat: number;
  lng: number;
  wind: number; // km/h
  pressure: number; // hPa
  category: string;
  surgeEstimate: number; // meters
  rainfall24h: number; // mm
  uncertaintyRadiusKm: number;
}

export interface Village {
  id: string;
  name: string;
  name_hi?: string;
  name_bn?: string;
  name_or?: string;
  lat: number;
  lng: number;
  population: number;
  elderly_population: number;
  children_population: number;
  elevation: number; // meters
  distance_to_coast: number; // km
  flood_probability: number; // percentage (0-100)
  estimated_water_depth: number; // meters
  shelter_distance: number; // km
  road_access_score: number; // 0-100 (100 is best)
  overall_risk: number; // 0-100
  priority_level: PriorityLevel;
  primary_shelter_id: string;
  alternate_shelter_id?: string;
  is_road_submerged: boolean;
  evacuation_status: 'pending' | 'in_progress' | 'completed' | 'sheltering_in_place';
  key_vulnerabilities: string[];
  recommended_action: string;
}

export interface CriticalAsset {
  id: string;
  name: string;
  type: AssetType;
  lat: number;
  lng: number;
  risk_score: number; // 0-100
  criticality: 'critical' | 'high' | 'moderate' | 'standard';
  hazard_exposure: string;
  current_status: 'operational' | 'alert' | 'at_risk' | 'isolated' | 'shut_down';
  elevation: number;
  in_flood_zone: boolean;
  recommended_actions: string[];
  action_status: { [actionKey: string]: boolean };
  contact_person?: string;
  backup_power_ready?: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  current_occupancy: number;
  elevation: number;
  in_flood_zone: boolean;
  is_operational: boolean;
  has_generator: boolean;
  has_medical_kit: boolean;
  access_road_status: 'clear' | 'partially_flooded' | 'blocked';
  contact_number: string;
  assigned_villages: string[];
}

export interface EvacuationRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distance_km: number;
  status: 'clear' | 'vulnerable' | 'flooded' | 'blocked';
  is_elevated: boolean;
  capacity_vehicles_per_hr: number;
  estimated_travel_time_min: number;
  elevation_avg: number;
  coordinates: [number, number][];
}

export interface SimulationParameters {
  windSpeedMultiplier: number; // 0.8 - 1.5
  rainfallMultiplier: number; // 0.5 - 2.0
  surgeHeightOffset: number; // -1.0 to +3.0 meters
  trackShiftKm: number; // -50km (South) to +50km (North)
  landfallTimeShiftHours: number; // -12 to +12 hours
}

export interface CAPAlert {
  identifier: string;
  sender: string;
  sent: string;
  status: 'Draft' | 'Approved' | 'Simulated Dispatch';
  msgType: 'Alert' | 'Update' | 'Cancel';
  event: string;
  urgency: 'Immediate' | 'Expected' | 'Future';
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Minor';
  certainty: 'Observed' | 'Likely' | 'Possible';
  category: 'Met' | 'Safety' | 'Infra' | 'Evac';
  headline: string;
  description: string;
  instruction: string;
  areaDesc: string;
  affectedVillages: string[];
  channels: ('SMS' | 'WhatsApp' | 'Sirens' | 'VHF_Radio' | 'Megaphone')[];
  language: Language;
}

export interface RiskBreakdown {
  overallRisk: number;
  hazardScore: number;
  exposureScore: number;
  vulnerabilityScore: number;
  criticalityScore: number;
  drivers: {
    label: string;
    impact: number; // positive or negative points
    category: 'hazard' | 'vulnerability' | 'exposure';
  }[];
}
