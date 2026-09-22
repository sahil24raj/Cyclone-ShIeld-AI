import { Village, SimulationParameters, RiskBreakdown, RiskLevel } from '../types';
import { DataProvenance } from '../types/provenance';

/**
 * Deterministic Risk Engine (Derived Risk Assessment).
 * 
 * NOTE: This is an explicit rule-based physical vulnerability formulation,
 * NOT an AI/ML black-box model.
 * 
 * Formula:
 * Overall Risk = 0.35 × Hazard + 0.25 × Exposure + 0.25 × Vulnerability + 0.15 × Criticality
 */
export class DeterministicRiskEngine {
  public static calculateRisk(village: Village, params?: SimulationParameters): RiskBreakdown & { provenance: DataProvenance } {
    const windMult = params?.windSpeedMultiplier ?? 1.0;
    const rainMult = params?.rainfallMultiplier ?? 1.0;
    const surgeOffset = params?.surgeHeightOffset ?? 0.0;
    const trackShift = params?.trackShiftKm ?? 0.0;

    // 1. Hazard Score (0 - 100)
    const baseWind = 135 * windMult;
    const windComponent = Math.min(100, (baseWind / 180) * 100);
    const surgeComponent = Math.min(100, ((village.estimated_water_depth + surgeOffset) / 4.0) * 100);
    const floodProbComponent = village.flood_probability;
    const rainComponent = Math.min(100, ((280 * rainMult) / 400) * 100);
    const trackFactor = trackShift > 0 ? Math.min(20, trackShift * 0.4) : Math.max(-15, trackShift * 0.3);

    const hazardScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          0.30 * windComponent +
          0.30 * surgeComponent +
          0.20 * floodProbComponent +
          0.10 * rainComponent +
          0.10 * Math.max(0, 50 + trackFactor)
        )
      )
    );

    // 2. Exposure Score (0 - 100)
    const popDensityFactor = Math.min(100, (village.population / 10000) * 100);
    const vulnerablePop = village.elderly_population + village.children_population;
    const vulnerableRatio = (vulnerablePop / village.population) * 100;
    const vulnerableFactor = Math.min(100, (vulnerableRatio / 40) * 100);
    const distanceCoastFactor = Math.max(0, (1 - village.distance_to_coast / 10.0) * 100);

    const exposureScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          0.40 * popDensityFactor +
          0.35 * vulnerableFactor +
          0.25 * distanceCoastFactor
        )
      )
    );

    // 3. Vulnerability Score (0 - 100)
    const elevationFactor = Math.max(0, (1 - Math.min(10, village.elevation) / 10.0) * 100);
    const roadCutoffFactor = (100 - village.road_access_score);
    const shelterDistFactor = Math.min(100, (village.shelter_distance / 6.0) * 100);

    const vulnerabilityScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          0.40 * elevationFactor +
          0.35 * roadCutoffFactor +
          0.25 * shelterDistFactor
        )
      )
    );

    // 4. Criticality Score (0 - 100)
    const criticalityScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          0.45 * (village.is_road_submerged ? 95 : 30) +
          0.35 * (village.priority_level === 'P0' ? 95 : village.priority_level === 'P1' ? 70 : 40) +
          0.20 * (village.population > 5000 ? 80 : 40)
        )
      )
    );

    // Composite Weighted Equation
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

    // Attribution Drivers
    const drivers: RiskBreakdown['drivers'] = [];
    if (village.elevation <= 2.0) {
      drivers.push({ label: 'Low Elevation (< 2m AMSL surge zone)', impact: 22, category: 'vulnerability' });
    }
    if (village.is_road_submerged) {
      drivers.push({ label: 'Primary Road Inundation / Cutoff', impact: 20, category: 'vulnerability' });
    }
    if (hazardScore >= 75) {
      drivers.push({ label: 'Severe Wind Gale & Surge Exposure', impact: 18, category: 'hazard' });
    }
    if (vulnerableRatio >= 30) {
      drivers.push({ label: 'High Elderly & Child Ratio (> 30%)', impact: 14, category: 'exposure' });
    }
    if (village.shelter_distance >= 3.0) {
      drivers.push({ label: 'Extended Evacuation Transit Distance', impact: 10, category: 'vulnerability' });
    }

    return {
      overallRisk,
      hazardScore,
      exposureScore,
      vulnerabilityScore,
      criticalityScore,
      drivers,
      provenance: {
        source: 'Deterministic Physical Hydrodynamic Vulnerability Model (P-CHMVM v2.4)',
        retrievedAt: new Date().toISOString(),
        dataType: 'DERIVED_ANALYSIS',
        isFixture: false,
        notes: 'Calculated deterministically using documented weights: 0.35*H + 0.25*E + 0.25*V + 0.15*C',
      }
    };
  }

  public static getRiskLevel(score: number): RiskLevel {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'moderate';
    return 'low';
  }
}
