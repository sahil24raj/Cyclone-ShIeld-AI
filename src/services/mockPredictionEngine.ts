import {
  ScenarioInputs,
  RiskClass,
  RiskCalculationResult,
  MockVillageData,
  MockInfrastructureAsset,
  CalculatedVillageOutput,
  CalculatedAssetOutput,
  CalculatedRouteOutput,
  SimulationSummaryOutput,
} from '../types/disaster';
import { MOCK_VILLAGES_LIST } from '../data/mockVillages';
import { MOCK_INFRASTRUCTURE_LIST } from '../data/mockInfrastructure';
import { MOCK_ROADS_LIST } from '../data/mockRoads';
import { calculateEvacuationAssessment, calculateRouteStatus } from './mockEvacuationEngine';
import { BASE_STORM_SCENARIO } from '../data/mockStorm';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Normalizes a score to a 0-100 integer
 */
function normalizeScore(score: number): number {
  return clamp(Math.round(score), 0, 100);
}

/**
 * Calculates Hazard Score (0 - 100)
 * Weights:
 * - Wind Hazard: 25%
 * - Flood/Inundation Hazard: 25%
 * - Storm Surge Hazard: 25%
 * - Rainfall Hazard: 15%
 * - Track Proximity/Uncertainty: 10%
 */
export function calculateHazardScore(
  village: MockVillageData,
  inputs: ScenarioInputs
): {
  hazardScore: number;
  breakdown: {
    windHazard: number;
    floodHazard: number;
    surgeHazard: number;
    rainfallHazard: number;
    trackProximityHazard: number;
  };
} {
  // 1. Wind Hazard (25%): 60 to 220 km/h scale
  // At base 135 km/h, wind is a Very Severe Cyclonic Storm (~78/100)
  const windRatio = (inputs.windSpeedKmh - 60) / (220 - 60);
  const windHazard = clamp(
    windRatio * 100 * 1.15 + (inputs.windSpeedKmh >= 130 ? 20 : 0),
    0,
    100
  );

  // 2. Storm Surge Hazard (25%): 0 to 5m surge, strongly penalizes lower elevation & coastal proximity
  const coastalFactor = clamp(1 - village.distanceToCoastKm / 8.0, 0.15, 1.0);
  const elevationSurgeFactor = clamp(1 - village.elevationMeters / 4.5, 0.15, 1.0);
  const surgeOvertop = Math.max(0, inputs.stormSurgeMeters - village.elevationMeters * 0.5);
  const surgeHazard = clamp(
    (inputs.stormSurgeMeters / 3.8) * 100 * coastalFactor * elevationSurgeFactor * 1.5 +
      (surgeOvertop > 0 ? 30 : 0) +
      (village.distanceToCoastKm < 4.0 ? 20 : 0),
    0,
    100
  );

  // 3. Flood/Inundation Hazard (25%): driven by rainfall, river/coast proximity, and baseline flood prob
  const riverFactor = clamp(1 - village.distanceToRiverKm / 3.5, 0.1, 1.0);
  const floodHazard = clamp(
    village.baselineFloodProbability * 0.55 +
      (inputs.rainfallMm / 300) * 45 +
      riverFactor * 15 +
      (inputs.rainfallMm >= 150 ? 12 : 0),
    0,
    100
  );

  // 4. Rainfall Hazard (15%): 0 to 400 mm
  const rainfallHazard = clamp((inputs.rainfallMm / 300) * 100, 0, 100);

  // 5. Track Proximity & Uncertainty (10%)
  // Storm center eye latitude is ~20.48 deg + track shift
  const eyeLat = 20.48 + inputs.trackShiftKm * 0.008;
  const latDelta = Math.abs(village.latitude - eyeLat);
  const proximityScore = clamp(100 - latDelta * 130, 10, 100);
  const trackDirectionBonus =
    inputs.trackShiftKm > 0 && village.latitude >= 20.48
      ? clamp(inputs.trackShiftKm * 0.5, 0, 25)
      : inputs.trackShiftKm < 0 && village.latitude < 20.48
      ? clamp(Math.abs(inputs.trackShiftKm) * 0.5, 0, 25)
      : 0;

  const trackProximityHazard = clamp(proximityScore * 0.8 + trackDirectionBonus, 0, 100);

  const rawHazard =
    0.25 * windHazard +
    0.25 * floodHazard +
    0.25 * surgeHazard +
    0.15 * rainfallHazard +
    0.10 * trackProximityHazard;

  return {
    hazardScore: normalizeScore(rawHazard),
    breakdown: {
      windHazard: normalizeScore(windHazard),
      floodHazard: normalizeScore(floodHazard),
      surgeHazard: normalizeScore(surgeHazard),
      rainfallHazard: normalizeScore(rainfallHazard),
      trackProximityHazard: normalizeScore(trackProximityHazard),
    },
  };
}

/**
 * Calculates Exposure Score (0 - 100)
 * Weights:
 * - Population Exposure: 35%
 * - Infrastructure Density: 25%
 * - Built-Up Exposure: 20%
 * - Economic/Agriculture Exposure: 20%
 */
export function calculateExposureScore(village: MockVillageData): {
  exposureScore: number;
  breakdown: {
    populationExposure: number;
    infrastructureDensity: number;
    builtUpExposure: number;
    economicExposure: number;
  };
} {
  const popScore = clamp((village.population / 8000) * 100, 20, 100);
  const infraScore = village.infrastructureDensityScore;
  const builtUpScore = village.builtUpExposureScore;
  const economicScore = clamp(
    (village.distanceToCoastKm < 4 ? 90 : 65) + (village.population > 6000 ? 10 : 0),
    0,
    100
  );

  const rawExposure =
    0.35 * popScore +
    0.25 * infraScore +
    0.20 * builtUpScore +
    0.20 * economicScore;

  return {
    exposureScore: normalizeScore(rawExposure),
    breakdown: {
      populationExposure: normalizeScore(popScore),
      infrastructureDensity: normalizeScore(infraScore),
      builtUpExposure: normalizeScore(builtUpScore),
      economicExposure: normalizeScore(economicScore),
    },
  };
}

/**
 * Calculates Vulnerability Score (0 - 100)
 * Weights:
 * - Low Elevation: 30%
 * - Coast/River Proximity: 20%
 * - Road Accessibility: 20%
 * - Shelter Accessibility: 15%
 * - Social Vulnerability: 15%
 */
export function calculateVulnerabilityScore(village: MockVillageData): {
  vulnerabilityScore: number;
  breakdown: {
    lowElevation: number;
    coastRiverProximity: number;
    roadAccessibility: number;
    shelterAccessibility: number;
    socialVulnerability: number;
  };
} {
  // Low elevation score: 0-2.5m = 75-100, 5m+ = low
  const lowElevation = clamp(Math.max(0, 1 - village.elevationMeters / 4.5) * 100, 10, 100);

  // Coast & River Proximity: closer = higher score
  const coastScore = clamp(Math.max(0, 1 - village.distanceToCoastKm / 7.5) * 100, 0, 100);
  const riverScore = clamp(Math.max(0, 1 - village.distanceToRiverKm / 3.0) * 100, 0, 100);
  const coastRiverProximity = clamp(Math.max(coastScore, riverScore * 0.95), 10, 100);

  // Road Access Cutoff Vulnerability (inverse of road access score)
  const roadAccessibility = clamp(100 - village.roadAccessScore, 10, 95);

  // Shelter Distance Vulnerability
  const shelterAccessibility = clamp((village.shelterDistanceKm / 6.0) * 100, 10, 100);

  // Social Vulnerability (elderly + children ratio and score)
  const vulnerablePop = village.elderlyPopulation + village.childrenPopulation;
  const ratio = (vulnerablePop / village.population) * 100;
  const socialVulnerability = clamp(village.socialVulnerabilityScore * 0.7 + (ratio / 35) * 30, 15, 100);

  const rawVuln =
    0.30 * lowElevation +
    0.20 * coastRiverProximity +
    0.20 * roadAccessibility +
    0.15 * shelterAccessibility +
    0.15 * socialVulnerability;

  return {
    vulnerabilityScore: normalizeScore(rawVuln),
    breakdown: {
      lowElevation: normalizeScore(lowElevation),
      coastRiverProximity: normalizeScore(coastRiverProximity),
      roadAccessibility: normalizeScore(roadAccessibility),
      shelterAccessibility: normalizeScore(shelterAccessibility),
      socialVulnerability: normalizeScore(socialVulnerability),
    },
  };
}

/**
 * Calculates Criticality Score (0 - 100)
 * Based on critical infrastructure at risk, road severance, and base vulnerability
 */
export function calculateCriticalityScore(
  village: MockVillageData,
  hazardScore: number,
  roadSubmerged: boolean
): number {
  let score = village.baseRiskScore ? village.baseRiskScore * 0.75 : 55;
  if (village.population > 7000) score += 10;
  if (roadSubmerged) score += 15;
  if (hazardScore > 70) score += 10;
  if (village.distanceToCoastKm < 4.0) score += 8;
  return normalizeScore(score);
}

/**
 * Classifies numeric risk score into standard risk classes:
 * - 0–25: Low
 * - 26–50: Moderate
 * - 51–75: High
 * - 76–100: Critical
 */
export function getRiskClass(score: number): RiskClass {
  if (score >= 76) return 'Critical';
  if (score >= 51) return 'High';
  if (score >= 26) return 'Moderate';
  return 'Low';
}

/**
 * Calculates Overall Risk Score using the explainable formula:
 * overallRisk = 0.35 * hazardScore + 0.25 * exposureScore + 0.25 * vulnerabilityScore + 0.15 * criticalityScore
 */
export function calculateOverallRisk(
  village: MockVillageData,
  inputs: ScenarioInputs
): RiskCalculationResult {
  const { hazardScore, breakdown: hazardBreakdown } = calculateHazardScore(village, inputs);
  const { exposureScore, breakdown: exposureBreakdown } = calculateExposureScore(village);
  const { vulnerabilityScore, breakdown: vulnerabilityBreakdown } = calculateVulnerabilityScore(village);

  const estFloodDepth = calculateFloodDepth(village, inputs);
  const isRoadSubmerged = estFloodDepth >= 0.8 || village.roadAccessScore < 40;
  const criticalityScore = calculateCriticalityScore(village, hazardScore, isRoadSubmerged);

  const rawOverall =
    0.35 * hazardScore +
    0.25 * exposureScore +
    0.25 * vulnerabilityScore +
    0.15 * criticalityScore;

  const overallRisk = normalizeScore(rawOverall);
  const riskClass = getRiskClass(overallRisk);

  // Main Explainable Drivers
  const drivers: RiskCalculationResult['mainRiskDrivers'] = [];

  if (hazardBreakdown.surgeHazard >= 65) {
    drivers.push({
      label: `Storm surge inundation potential (${inputs.stormSurgeMeters.toFixed(1)}m surge / ${village.distanceToCoastKm}km to sea)`,
      impact: +24,
      category: 'hazard',
    });
  }
  if (vulnerabilityBreakdown.lowElevation >= 60) {
    drivers.push({
      label: `Low coastal elevation (${village.elevationMeters.toFixed(1)}m AMSL)`,
      impact: +20,
      category: 'vulnerability',
    });
  }
  if (isRoadSubmerged || vulnerabilityBreakdown.roadAccessibility >= 60) {
    drivers.push({
      label: `Evacuation road inundation risk (Access score: ${village.roadAccessScore}/100)`,
      impact: +18,
      category: 'vulnerability',
    });
  }
  if (hazardBreakdown.windHazard >= 65) {
    drivers.push({
      label: `Extreme gale force winds (${inputs.windSpeedKmh} km/h)`,
      impact: +16,
      category: 'hazard',
    });
  }
  if (exposureBreakdown.populationExposure >= 60) {
    drivers.push({
      label: `High exposed population density (${village.population.toLocaleString()} residents)`,
      impact: +14,
      category: 'exposure',
    });
  }
  if (vulnerabilityBreakdown.socialVulnerability >= 65) {
    drivers.push({
      label: `Elevated dependent quotient (${village.elderlyPopulation + village.childrenPopulation} elderly & children)`,
      impact: +12,
      category: 'vulnerability',
    });
  }

  // Model Confidence: decreases as lead time is long and track shift is high
  const confidence = clamp(
    Math.round(
      BASE_STORM_SCENARIO.baseForecastConfidencePct -
        (inputs.landfallHours - 24) * 0.3 -
        Math.abs(inputs.trackShiftKm) * 0.15
    ),
    45,
    95
  );

  return {
    overallRisk,
    riskClass,
    hazardScore,
    exposureScore,
    vulnerabilityScore,
    criticalityScore,
    hazardBreakdown,
    exposureBreakdown,
    vulnerabilityBreakdown,
    mainRiskDrivers: drivers,
    modelConfidencePct: confidence,
    lastUpdatedTimestamp: new Date().toISOString(),
  };
}

/**
 * Calculates dynamic flood probability (%) based on rainfall, surge, elevation, and river/coast proximity
 */
export function calculateFloodProbability(
  village: MockVillageData,
  inputs: ScenarioInputs
): number {
  const rainMultiplier = inputs.rainfallMm / 180;
  const surgeMultiplier = inputs.stormSurgeMeters / 1.8;
  const elevationDampener = clamp(1 - village.elevationMeters / 6.0, 0.1, 1.0);

  const prob =
    village.baselineFloodProbability * 0.5 * rainMultiplier +
    (village.distanceToCoastKm < 4 ? 40 * surgeMultiplier * elevationDampener : 10) +
    (village.distanceToRiverKm < 2 ? 20 * rainMultiplier : 0);

  return normalizeScore(clamp(prob, 5, 99));
}

/**
 * Calculates dynamic estimated flood depth in meters
 */
export function calculateFloodDepth(
  village: MockVillageData,
  inputs: ScenarioInputs
): number {
  const rainDepth = (inputs.rainfallMm / 180) * 0.5;
  const coastalSurgeComponent =
    village.distanceToCoastKm <= 5.0
      ? Math.max(0, inputs.stormSurgeMeters - village.elevationMeters * 0.4) *
        (1 - village.distanceToCoastKm / 7.0)
      : 0;
  const riverBackflowComponent =
    village.distanceToRiverKm <= 2.0
      ? (inputs.rainfallMm / 300) * 0.8 * (1 - village.distanceToRiverKm / 3.0)
      : 0;

  const totalDepth =
    village.baselineWaterDepthMeters * 0.4 +
    rainDepth * 0.6 +
    coastalSurgeComponent +
    riverBackflowComponent;

  return Math.round(clamp(totalDepth, 0, 5.0) * 10) / 10;
}

/**
 * Calculates Infrastructure Asset Risk & Status dynamically
 */
export function calculateAssetRisk(
  asset: MockInfrastructureAsset,
  inputs: ScenarioInputs
): CalculatedAssetOutput {
  const windRatio = inputs.windSpeedKmh / 135;
  const rainRatio = inputs.rainfallMm / 180;
  const surgeRatio = inputs.stormSurgeMeters / 1.8;

  // Track shift impact: if north shift, northern assets (lat > 20.45) risk increases
  const northBonus =
    inputs.trackShiftKm > 0 && asset.latitude >= 20.45
      ? inputs.trackShiftKm * 0.3
      : inputs.trackShiftKm < 0 && asset.latitude < 20.45
      ? Math.abs(inputs.trackShiftKm) * 0.3
      : 0;

  const calculatedFloodRisk = normalizeScore(
    asset.baseFloodRisk * 0.4 * rainRatio +
      (asset.elevationMeters < 3.5 ? 40 * surgeRatio : 10) +
      northBonus
  );

  const calculatedWindRisk = normalizeScore(
    asset.baseWindRisk * 0.6 * windRatio + (inputs.windSpeedKmh > 160 ? 30 : 0)
  );

  const compositeRisk = normalizeScore(
    0.40 * calculatedFloodRisk +
      0.35 * calculatedWindRisk +
      0.25 * asset.criticalityScore
  );

  const inFloodZone = calculatedFloodRisk >= 65 || asset.elevationMeters < 2.5;

  let calculatedStatus = asset.status;
  if (compositeRisk >= 85 || (inFloodZone && asset.elevationMeters <= 2.0)) {
    calculatedStatus = 'isolated';
  } else if (compositeRisk >= 70 || inFloodZone) {
    calculatedStatus = 'at_risk';
  } else if (compositeRisk >= 50) {
    calculatedStatus = 'alert';
  } else {
    calculatedStatus = 'operational';
  }

  const calculatedRoadAccessScore = normalizeScore(
    clamp(asset.roadAccessScore - (calculatedFloodRisk > 70 ? 40 : 0), 10, 100)
  );

  return {
    ...asset,
    calculatedRiskScore: compositeRisk,
    calculatedFloodRisk,
    calculatedWindRisk,
    calculatedStatus,
    calculatedRoadAccessScore,
    inFloodZone,
    // Compatibility fields
    lat: asset.latitude,
    lng: asset.longitude,
    risk_score: compositeRisk,
    criticality:
      asset.criticalityScore >= 90
        ? 'critical'
        : asset.criticalityScore >= 75
        ? 'high'
        : 'moderate',
    hazard_exposure: `${calculatedStatus.toUpperCase()} • Flood Risk: ${calculatedFloodRisk}/100 • Wind Risk: ${calculatedWindRisk}/100`,
    current_status: calculatedStatus,
    elevation: asset.elevationMeters,
    in_flood_zone: inFloodZone,
    recommended_actions: [asset.recommendedAction],
    action_status: asset.action_status || { [asset.recommendedAction]: false },
    backup_power_ready: asset.backupPowerAvailable,
  };
}

/**
 * Calculates complete simulation outputs for the entire district
 */
export function runSimulation(inputs: ScenarioInputs): SimulationSummaryOutput {
  // 1. Calculate routes first to determine accessibility
  const calculatedRoutes: CalculatedRouteOutput[] = MOCK_ROADS_LIST.map((route) => {
    const status = calculateRouteStatus(route, inputs);
    const isFlooded = status === 'At risk' || status === 'Blocked';
    const isBlocked = status === 'Blocked';
    const delayMultiplier =
      status === 'Blocked' ? 3.0 : status === 'At risk' ? 1.8 : status === 'Caution' ? 1.3 : 1.0;
    const travelTime = Math.round(route.estimatedTravelTimeMin * delayMultiplier);

    return {
      ...route,
      calculatedStatus: status,
      calculatedTravelTimeMin: travelTime,
      isFlooded,
      isBlocked,
      // Compatibility
      status: status === 'Safe' ? 'clear' : status === 'Caution' ? 'vulnerable' : status === 'At risk' ? 'flooded' : 'blocked',
      distance_km: route.distanceKm,
      is_elevated: route.isElevated,
      capacity_vehicles_per_hr: route.capacityVehiclesPerHour,
      estimated_travel_time_min: travelTime,
      elevation_avg: route.elevationAvg,
    };
  });

  // 2. Calculate assets and shelters
  const calculatedAssets: CalculatedAssetOutput[] = MOCK_INFRASTRUCTURE_LIST.map((asset) =>
    calculateAssetRisk(asset, inputs)
  );
  const calculatedShelters = calculatedAssets.filter((a) => a.type === 'shelter');

  // 3. Calculate villages with risk and evacuation assignments
  const calculatedVillages: CalculatedVillageOutput[] = MOCK_VILLAGES_LIST.map((village) => {
    const risk = calculateOverallRisk(village, inputs);
    const floodProb = calculateFloodProbability(village, inputs);
    const floodDepth = calculateFloodDepth(village, inputs);
    const evacuation = calculateEvacuationAssessment(
      village,
      risk,
      inputs,
      calculatedShelters,
      calculatedRoutes,
      floodDepth,
      floodProb
    );

    const isRoadSubmerged = evacuation.routeStatus === 'Blocked' || floodDepth >= 0.8;

    return {
      ...village,
      risk,
      evacuation,
      // Legacy compatibility mapping
      lat: village.latitude,
      lng: village.longitude,
      elderly_population: village.elderlyPopulation,
      children_population: village.childrenPopulation,
      elevation: village.elevationMeters,
      distance_to_coast: village.distanceToCoastKm,
      flood_probability: floodProb,
      estimated_water_depth: floodDepth,
      shelter_distance: village.shelterDistanceKm,
      road_access_score: village.roadAccessScore,
      overall_risk: risk.overallRisk,
      priority_level: evacuation.evacuationPriority,
      primary_shelter_id: village.assignedShelterId,
      alternate_shelter_id: evacuation.nearestRecommendedShelter.id,
      is_road_submerged: isRoadSubmerged,
      evacuation_status:
        evacuation.evacuationPriority === 'P0'
          ? 'in_progress'
          : evacuation.evacuationPriority === 'P1'
          ? 'pending'
          : 'sheltering_in_place',
      key_vulnerabilities: risk.mainRiskDrivers.map((d) => d.label),
      recommended_action: evacuation.recommendedAction,
    };
  });

  // 4. Summaries and Aggregations
  const totalPop = calculatedVillages.reduce((sum, v) => sum + v.population, 0);
  const p0Pop = calculatedVillages
    .filter((v) => v.evacuation.evacuationPriority === 'P0')
    .reduce((sum, v) => sum + v.population, 0);
  const p1Pop = calculatedVillages
    .filter((v) => v.evacuation.evacuationPriority === 'P1')
    .reduce((sum, v) => sum + v.population, 0);

  const criticalVillagesCount = calculatedVillages.filter((v) => v.risk.riskClass === 'Critical').length;
  const highVillagesCount = calculatedVillages.filter((v) => v.risk.riskClass === 'High').length;
  const criticalAssetsAtRiskCount = calculatedAssets.filter((a) => a.calculatedRiskScore >= 70).length;
  const roadsAtRiskCount = calculatedRoutes.filter(
    (r) => r.calculatedStatus === 'At risk' || r.calculatedStatus === 'Blocked'
  ).length;

  const totalShelterCapacity = calculatedShelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
  const totalShelterOccupied = calculatedShelters.reduce((sum, s) => sum + (s.currentOccupancy || 0), 0);
  const availableShelterCapacity = Math.max(0, totalShelterCapacity - totalShelterOccupied);

  // Shelter capacity gap: if evac population exceeds available safe shelter capacity
  const targetEvacPop = p0Pop + Math.round(p1Pop * 0.7);
  const shelterCapacityGap = Math.max(0, targetEvacPop - availableShelterCapacity);

  // Scenario Impact Summary
  const impactSummary = generateScenarioImpactSummary(
    inputs,
    criticalVillagesCount,
    criticalAssetsAtRiskCount,
    roadsAtRiskCount,
    shelterCapacityGap
  );

  return {
    scenarioInputs: inputs,
    stormStatus: `Prototype Model Estimate • ${BASE_STORM_SCENARIO.name}`,
    estimatedLandfallTime: `T-${inputs.landfallHours}h (${inputs.landfallHours} hours to landfall)`,
    maxSustainedWindKmh: inputs.windSpeedKmh,
    rainfall24hMm: inputs.rainfallMm,
    stormSurgeEstimateMeters: inputs.stormSurgeMeters,
    forecastConfidencePct: calculatedVillages[0]?.risk.modelConfidencePct || 78,
    totalPopulationExposed: totalPop,
    p0Population: p0Pop,
    p1Population: p1Pop,
    criticalVillagesCount,
    highVillagesCount,
    criticalAssetsAtRiskCount,
    totalAssetsCount: calculatedAssets.length,
    roadsAtRiskCount,
    totalRoadsCount: calculatedRoutes.length,
    totalShelterCapacity,
    availableShelterCapacity,
    shelterCapacityGap,
    scenarioImpactSummary: impactSummary,
    villages: calculatedVillages,
    assets: calculatedAssets,
    routes: calculatedRoutes,
    shelters: calculatedShelters,
  };
}

/**
 * Generates dynamic text summary comparing current scenario to baseline
 */
function generateScenarioImpactSummary(
  inputs: ScenarioInputs,
  criticalVillages: number,
  criticalAssets: number,
  roadsAtRisk: number,
  shelterGap: number
): string {
  const parts: string[] = [];

  if (inputs.trackShiftKm !== 0) {
    const dir = inputs.trackShiftKm > 0 ? 'north' : 'south';
    const km = Math.abs(inputs.trackShiftKm);
    parts.push(`If the cyclone track shifts ${km} km ${dir}:`);
  } else if (inputs.windSpeedKmh !== 135 || inputs.rainfallMm !== 180 || inputs.stormSurgeMeters !== 1.8) {
    parts.push(`Under modified scenario parameters (${inputs.windSpeedKmh} km/h wind, ${inputs.rainfallMm}mm rain, ${inputs.stormSurgeMeters}m surge):`);
  } else {
    parts.push(`At baseline scenario (${BASE_STORM_SCENARIO.name} T-24h):`);
  }

  parts.push(`• ${criticalVillages} village(s) classified at Critical / High multi-hazard risk`);
  parts.push(`• ${criticalAssets} critical infrastructure asset(s) enter severe inundation or wind stress zones`);
  parts.push(`• ${roadsAtRisk} evacuation road(s) classified as At Risk or Blocked by floodwaters`);
  parts.push(`• Shelter capacity deficit estimated at ${shelterGap.toLocaleString()} person-capacity`);

  return parts.join('\n');
}
