import { Village, SimulationParameters, RiskBreakdown, RiskLevel, PriorityLevel } from '../types';

export function calculateVillageRisk(
  village: Village,
  params: SimulationParameters = {
    windSpeedMultiplier: 1.0,
    rainfallMultiplier: 1.0,
    surgeHeightOffset: 0.0,
    trackShiftKm: 0,
    landfallTimeShiftHours: 0,
  }
): RiskBreakdown {
  // Base Hazard calculations with parameter modulation
  const baseWind = 135 * params.windSpeedMultiplier;
  const windHazardScore = Math.min(100, Math.max(0, (baseWind / 180) * 100));

  // Adjusted surge based on distance to coast + offset
  const surgeHeight = Math.max(0, 3.4 + params.surgeHeightOffset);
  const surgeHazardScore = Math.min(
    100,
    Math.max(0, (surgeHeight / 5.0) * 100 * Math.max(0.1, 1 - village.distance_to_coast / 15))
  );

  // Flood hazard adjusted by rainfall multiplier and elevation
  const effectiveRainfall = 280 * params.rainfallMultiplier;
  const floodHazardScore = Math.min(
    100,
    Math.max(
      0,
      village.flood_probability * (effectiveRainfall / 280) * (surgeHeight / 3.4) +
        (params.trackShiftKm > 0 ? (village.lat > 20.45 ? 12 : -8) : 0)
    )
  );

  const rainfallHazardScore = Math.min(100, (effectiveRainfall / 400) * 100);

  // Distance from simulated track center
  const trackProximityScore = Math.max(
    10,
    100 - Math.abs(village.lat - (20.48 + params.trackShiftKm * 0.009)) * 120
  );

  // Weighted Hazard Component (35% total)
  const hazardScore = Math.round(
    0.25 * windHazardScore +
      0.25 * surgeHazardScore +
      0.25 * floodHazardScore +
      0.15 * rainfallHazardScore +
      0.10 * trackProximityScore
  );

  // Exposure Component (25% total)
  const popScore = Math.min(100, (village.population / 12000) * 100);
  const infraScore = village.name.includes('Port') || village.name.includes('Sundar') ? 85 : 45;
  const builtUpScore = village.distance_to_coast < 4 ? 75 : 50;
  const economicScore = village.distance_to_coast < 2 ? 90 : 55;

  const exposureScore = Math.round(
    0.35 * popScore + 0.25 * infraScore + 0.20 * builtUpScore + 0.20 * economicScore
  );

  // Vulnerability Component (25% total)
  const lowElevationScore = Math.min(100, Math.max(10, (1 / Math.max(0.8, village.elevation)) * 40));
  const coastProximityScore = Math.min(100, Math.max(10, (1 / Math.max(0.5, village.distance_to_coast)) * 30));
  const roadAccessVuln = 100 - village.road_access_score;
  const shelterDistanceVuln = Math.min(100, (village.shelter_distance / 8) * 100);
  const socialVuln = ((village.elderly_population + village.children_population) / village.population) * 150;

  const vulnerabilityScore = Math.round(
    0.30 * lowElevationScore +
      0.20 * coastProximityScore +
      0.20 * roadAccessVuln +
      0.15 * shelterDistanceVuln +
      0.15 * socialVuln
  );

  // Criticality Component (15% total)
  const criticalityScore = Math.round(
    (village.priority_level === 'P0' ? 95 : village.priority_level === 'P1' ? 75 : 45)
  );

  // Final Composite Risk Formula
  const overallRisk = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        0.35 * hazardScore +
          0.25 * exposureScore +
          0.25 * vulnerabilityScore +
          0.15 * criticalityScore
      )
    )
  );

  // Detailed explainable reasoning drivers
  const drivers: RiskBreakdown['drivers'] = [];

  if (windHazardScore > 65) {
    drivers.push({
      label: `Severe gales (${Math.round(baseWind)} km/h)`,
      impact: Math.round((windHazardScore - 50) * 0.4),
      category: 'hazard',
    });
  }

  if (lowElevationScore > 50) {
    drivers.push({
      label: `Low elevation (${village.elevation.toFixed(1)}m AMSL)`,
      impact: +22,
      category: 'vulnerability',
    });
  }

  if (village.flood_probability > 70) {
    drivers.push({
      label: `Surge inundation probability (${Math.round(floodHazardScore)}%)`,
      impact: +18,
      category: 'hazard',
    });
  }

  if (rainfallHazardScore > 60) {
    drivers.push({
      label: `Heavy rainfall accumulation (${Math.round(effectiveRainfall)}mm)`,
      impact: +15,
      category: 'hazard',
    });
  }

  if (shelterDistanceVuln > 50) {
    drivers.push({
      label: `Shelter transit distance (${village.shelter_distance.toFixed(1)} km)`,
      impact: +9,
      category: 'vulnerability',
    });
  }

  if (village.is_road_submerged || village.road_access_score < 50) {
    drivers.push({
      label: 'Critical evacuation route submersion risk',
      impact: +14,
      category: 'vulnerability',
    });
  }

  if (socialVuln > 40) {
    drivers.push({
      label: `High dependent demographic (${village.elderly_population + village.children_population} vulnerable)`,
      impact: +11,
      category: 'exposure',
    });
  }

  return {
    overallRisk,
    hazardScore,
    exposureScore,
    vulnerabilityScore,
    criticalityScore,
    drivers,
  };
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 76) return 'critical';
  if (score >= 51) return 'high';
  if (score >= 26) return 'moderate';
  return 'low';
}

export function getPriorityFromRisk(score: number): PriorityLevel {
  if (score >= 76) return 'P0';
  if (score >= 55) return 'P1';
  if (score >= 35) return 'P2';
  return 'P3';
}
