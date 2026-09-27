export type RiskClass = 'Low' | 'Moderate' | 'High' | 'Critical';
export type EvacuationPriorityClass = 'P0' | 'P1' | 'P2' | 'P3';
export type RouteStatus = 'Safe' | 'Caution' | 'At risk' | 'Blocked';
export type AssetStatus = 'operational' | 'alert' | 'at_risk' | 'isolated' | 'shut_down';
export type InfrastructureType =
  | 'hospital'
  | 'power_substation'
  | 'bridge'
  | 'road'
  | 'telecom'
  | 'water_treatment'
  | 'shelter'
  | 'port';

export interface StormScenario {
  name: string;
  district: string;
  basePhase: string;
  baseLandfallHours: number;
  baseWindSpeedKmh: number;
  baseRainfallMm: number;
  baseStormSurgeMeters: number;
  baseTrackShiftKm: number;
  baseForecastConfidencePct: number;
}

export interface ScenarioInputs {
  windSpeedKmh: number;       // 60 - 220 km/h (base 135)
  rainfallMm: number;         // 0 - 400 mm (base 180)
  stormSurgeMeters: number;   // 0 - 5.0 m (base 1.8)
  trackShiftKm: number;       // -80 to +80 km (base 0)
  landfallHours: number;      // 6 - 72 hours (base 24)
}

export interface MockVillageData {
  id: string;
  name: string;
  name_hi?: string;
  name_bn?: string;
  name_or?: string;
  latitude: number;
  longitude: number;
  population: number;
  elderlyPopulation: number;
  childrenPopulation: number;
  elevationMeters: number;
  distanceToCoastKm: number;
  distanceToRiverKm: number;
  baselineFloodProbability: number; // 0 - 100
  baselineWaterDepthMeters: number;
  roadAccessScore: number;          // 0 - 100 (100 is best)
  shelterDistanceKm: number;
  socialVulnerabilityScore: number; // 0 - 100
  infrastructureDensityScore: number; // 0 - 100
  builtUpExposureScore: number;     // 0 - 100
  assignedShelterId: string;
  baseRiskScore: number;            // 0 - 100
}

export interface MockInfrastructureAsset {
  id: string;
  name: string;
  type: InfrastructureType;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  criticalityScore: number;         // 0 - 100
  baseFloodRisk: number;            // 0 - 100
  baseWindRisk: number;             // 0 - 100
  backupPowerAvailable?: boolean;
  capacity?: number;                // for shelters
  currentOccupancy?: number;        // for shelters
  roadAccessScore: number;          // 0 - 100
  status: AssetStatus;
  recommendedAction: string;
  action_status?: { [key: string]: boolean };
  contact_person?: string;
}

export interface MockRoadRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  elevationAvg: number;
  isElevated: boolean;
  baseStatus: RouteStatus;
  capacityVehiclesPerHour: number;
  estimatedTravelTimeMin: number;
  coordinates: [number, number][];
}

export interface RiskCalculationResult {
  overallRisk: number; // 0 - 100
  riskClass: RiskClass;
  hazardScore: number; // 0 - 100
  exposureScore: number; // 0 - 100
  vulnerabilityScore: number; // 0 - 100
  criticalityScore: number; // 0 - 100
  hazardBreakdown: {
    windHazard: number;
    floodHazard: number;
    surgeHazard: number;
    rainfallHazard: number;
    trackProximityHazard: number;
  };
  exposureBreakdown: {
    populationExposure: number;
    infrastructureDensity: number;
    builtUpExposure: number;
    economicExposure: number;
  };
  vulnerabilityBreakdown: {
    lowElevation: number;
    coastRiverProximity: number;
    roadAccessibility: number;
    shelterAccessibility: number;
    socialVulnerability: number;
  };
  mainRiskDrivers: {
    label: string;
    impact: number;
    category: 'hazard' | 'vulnerability' | 'exposure';
  }[];
  modelConfidencePct: number;
  lastUpdatedTimestamp: string;
}

export interface EvacuationAssessmentResult {
  evacuationPriority: EvacuationPriorityClass;
  evacuationPriorityScore: number; // 0 - 100
  populationExposed: number;
  elderlyCount: number;
  childrenCount: number;
  floodProbabilityPct: number;
  estimatedFloodDepthMeters: number;
  nearestRecommendedShelter: MockInfrastructureAsset;
  rejectedNearestShelter?: {
    shelter: MockInfrastructureAsset;
    reason: string;
  };
  shelterCapacityStatus: {
    capacity: number;
    currentOccupancy: number;
    availableBeds: number;
    isOverfilled: boolean;
  };
  routeStatus: RouteStatus;
  recommendedRouteName: string;
  estimatedTravelTimeMinutes: number;
  recommendedAction: string;
  shelterAssignmentExplanation: string;
}

export interface CalculatedVillageOutput extends MockVillageData {
  risk: RiskCalculationResult;
  evacuation: EvacuationAssessmentResult;
  // Compatibility fields for legacy UI
  lat: number;
  lng: number;
  elderly_population: number;
  children_population: number;
  elevation: number;
  distance_to_coast: number;
  flood_probability: number;
  estimated_water_depth: number;
  shelter_distance: number;
  road_access_score: number;
  overall_risk: number;
  priority_level: EvacuationPriorityClass;
  primary_shelter_id: string;
  alternate_shelter_id?: string;
  is_road_submerged: boolean;
  evacuation_status: 'pending' | 'in_progress' | 'completed' | 'sheltering_in_place';
  key_vulnerabilities: string[];
  recommended_action: string;
}

export interface CalculatedAssetOutput extends MockInfrastructureAsset {
  calculatedRiskScore: number;
  calculatedFloodRisk: number;
  calculatedWindRisk: number;
  calculatedStatus: AssetStatus;
  calculatedRoadAccessScore: number;
  inFloodZone: boolean;
  // Compatibility fields
  lat: number;
  lng: number;
  risk_score: number;
  criticality: 'critical' | 'high' | 'moderate' | 'standard';
  hazard_exposure: string;
  current_status: AssetStatus;
  elevation: number;
  in_flood_zone: boolean;
  recommended_actions: string[];
  action_status: { [actionKey: string]: boolean };
  backup_power_ready?: boolean;
  current_occupancy?: number;
  has_generator?: boolean;
  is_operational?: boolean;
  access_road_status?: string;
  distance_km?: number;
}

export interface CalculatedRouteOutput extends MockRoadRoute {
  calculatedStatus: RouteStatus;
  calculatedTravelTimeMin: number;
  isFlooded: boolean;
  isBlocked: boolean;
  // Compatibility fields
  status: 'clear' | 'vulnerable' | 'flooded' | 'blocked';
  distance_km: number;
  is_elevated: boolean;
  capacity_vehicles_per_hr: number;
  estimated_travel_time_min: number;
  elevation_avg: number;
}

export interface SimulationSummaryOutput {
  scenarioInputs: ScenarioInputs;
  stormStatus: string;
  estimatedLandfallTime: string;
  maxSustainedWindKmh: number;
  rainfall24hMm: number;
  stormSurgeEstimateMeters: number;
  forecastConfidencePct: number;
  totalPopulationExposed: number;
  p0Population: number;
  p1Population: number;
  criticalVillagesCount: number;
  highVillagesCount: number;
  criticalAssetsAtRiskCount: number;
  totalAssetsCount: number;
  roadsAtRiskCount: number;
  totalRoadsCount: number;
  totalShelterCapacity: number;
  availableShelterCapacity: number;
  shelterCapacityGap: number;
  scenarioImpactSummary: string;
  villages: CalculatedVillageOutput[];
  assets: CalculatedAssetOutput[];
  routes: CalculatedRouteOutput[];
  shelters: CalculatedAssetOutput[];
}

export interface SimulationBriefingOutput {
  executiveSummary: string;
  topFiveRisks: string[];
  criticalAssetsRequiringAction: {
    assetName: string;
    riskScore: number;
    action: string;
  }[];
  p0AndP1Villages: {
    villageName: string;
    priority: EvacuationPriorityClass;
    population: number;
    recommendedShelter: string;
  }[];
  shelterCapacityStatus: {
    totalCapacity: number;
    totalOccupied: number;
    availableBeds: number;
    deficit: number;
  };
  recommendedActionsNext6Hours: string[];
  englishPublicAdvisory: string;
  hindiPublicAdvisory: string;
  modelConfidence: string;
  limitations: string;
}

export interface CapAlertDraft {
  identifier: string;
  sender: string;
  sent: string;
  status: 'Simulation draft — human approval required';
  msgType: 'Alert';
  scope: 'Public';
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
  timeWindow: string;
  recommendedAction: string;
  jsonPayload: string;
  readablePreview: string;
}
