/**
 * Unit Tests for CycloneShield AI Mock Prediction & Evacuation Engine
 * Validates deterministic risk formulas, priority classifications,
 * shelter routing, and scenario impact scaling.
 */

import { DEFAULT_SCENARIO_INPUTS } from '../../data/mockStorm';
import { MOCK_VILLAGES_LIST } from '../../data/mockVillages';
import { MOCK_INFRASTRUCTURE_LIST } from '../../data/mockInfrastructure';
import { MOCK_ROADS_LIST } from '../../data/mockRoads';
import {
  calculateHazardScore,
  calculateExposureScore,
  calculateVulnerabilityScore,
  calculateCriticalityScore,
  calculateOverallRisk,
  calculateFloodProbability,
  calculateFloodDepth,
  runSimulation,
} from '../mockPredictionEngine';
import {
  calculateRouteStatus,
  calculateShelterSafety,
  assignBestShelter,
  calculateEvacuationPriority,
  calculateEvacuationAssessment,
} from '../mockEvacuationEngine';
import { generateLocalBriefing, generateCapDraft } from '../mockBriefingGenerator';
import { MockVillageData, MockRoadRoute } from '../../types/disaster';

export function runTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${testName}`);
    } else {
      failed++;
      errors.push(testName);
      console.error(`  ✗ ${testName}`);
    }
  }

  function assertEqual(actual: any, expected: any, testName: string) {
    if (actual === expected) {
      passed++;
      console.log(`  ✓ ${testName}`);
    } else {
      failed++;
      const msg = `${testName} -> Expected ${expected}, got ${actual}`;
      errors.push(msg);
      console.error(`  ✗ ${msg}`);
    }
  }

  console.log('\n--- 1. Testing Clamping & Normalization (0-100) ---');
  const coastalWard: MockVillageData = MOCK_VILLAGES_LIST.find((v: MockVillageData) => v.id === 'vil-01')!;
  const hazardHigh = calculateHazardScore(coastalWard, {
    ...DEFAULT_SCENARIO_INPUTS,
    windSpeedKmh: 220,
    rainfallMm: 400,
    stormSurgeMeters: 5.0,
  });
  assert(hazardHigh.hazardScore >= 0 && hazardHigh.hazardScore <= 100, 'Hazard score is clamped between 0 and 100 for extreme input');

  const hazardLow = calculateHazardScore(coastalWard, {
    ...DEFAULT_SCENARIO_INPUTS,
    windSpeedKmh: 60,
    rainfallMm: 0,
    stormSurgeMeters: 0,
  });
  assert(hazardLow.hazardScore >= 0 && hazardLow.hazardScore <= 100, 'Hazard score is clamped between 0 and 100 for minimum input');

  const exposureScore = calculateExposureScore(coastalWard);
  assert(exposureScore.exposureScore >= 0 && exposureScore.exposureScore <= 100, 'Exposure score is clamped 0-100');

  const vulnerabilityScore = calculateVulnerabilityScore(coastalWard);
  assert(vulnerabilityScore.vulnerabilityScore >= 0 && vulnerabilityScore.vulnerabilityScore <= 100, 'Vulnerability score is clamped 0-100');

  const criticalityScore = calculateCriticalityScore(coastalWard, hazardHigh.hazardScore, false);
  assert(criticalityScore >= 0 && criticalityScore <= 100, 'Criticality score is clamped 0-100');

  const overallRisk = calculateOverallRisk(coastalWard, DEFAULT_SCENARIO_INPUTS);
  assert(overallRisk.overallRisk >= 0 && overallRisk.overallRisk <= 100, 'Overall risk is clamped 0-100');

  console.log('\n--- 2. Testing Mandatory Coastal Ward 7 Demo Behavior ---');
  const baseSim = runSimulation(DEFAULT_SCENARIO_INPUTS);
  const ward7 = baseSim.villages.find((v) => v.id === 'vil-01')!;

  assert(ward7.risk.overallRisk >= 76, `Coastal Ward 7 has Critical risk (>=76), got: ${ward7.risk.overallRisk}`);
  assertEqual(ward7.risk.riskClass, 'Critical', 'Coastal Ward 7 riskClass is "Critical"');
  assertEqual(ward7.evacuation.evacuationPriority, 'P0', 'Coastal Ward 7 evacuation priority is "P0"');
  assertEqual(ward7.evacuation.nearestRecommendedShelter.id, 'infra-shelter-b', 'Coastal Ward 7 is assigned to Municipal Cyclone Shelter B (infra-shelter-b)');
  assertEqual(ward7.evacuation.recommendedRouteName, 'Elevated Route 2', 'Coastal Ward 7 is routed via Elevated Route 2');
  assert(
    ward7.evacuation.shelterAssignmentExplanation.includes('Shelter A is geographically closer, but its access road is projected to flood'),
    'Coastal Ward 7 includes required explanation rejecting Shelter A due to road flood risk'
  );

  console.log('\n--- 3. Testing Dynamic Scenario Responsiveness ---');
  // Rainfall and flood depth scaling
  const lowRainDepth = calculateFloodDepth(coastalWard, { ...DEFAULT_SCENARIO_INPUTS, rainfallMm: 50, stormSurgeMeters: 0.5 });
  const highRainDepth = calculateFloodDepth(coastalWard, { ...DEFAULT_SCENARIO_INPUTS, rainfallMm: 350, stormSurgeMeters: 3.5 });
  assert(highRainDepth > lowRainDepth, `Higher rainfall & surge increases estimated flood depth (${highRainDepth}m > ${lowRainDepth}m)`);

  const lowFloodProb = calculateFloodProbability(coastalWard, { ...DEFAULT_SCENARIO_INPUTS, rainfallMm: 50, stormSurgeMeters: 0.5 });
  const highFloodProb = calculateFloodProbability(coastalWard, { ...DEFAULT_SCENARIO_INPUTS, rainfallMm: 350, stormSurgeMeters: 3.5 });
  assert(highFloodProb > lowFloodProb, `Higher rainfall & surge increases flood probability (${highFloodProb}% > ${lowFloodProb}%)`);

  // North track shift testing: northern villages (Sundar Pur / Kharipalli / East Embankment) risk increases
  const simNorth30 = runSimulation({ ...DEFAULT_SCENARIO_INPUTS, trackShiftKm: 30 });
  const sundarPurBase = baseSim.villages.find((v) => v.name === 'Sundar Pur')!;
  const sundarPurNorth = simNorth30.villages.find((v) => v.name === 'Sundar Pur')!;
  assert(
    sundarPurNorth.risk.overallRisk >= sundarPurBase.risk.overallRisk,
    `North track shift (+30km) increases hazard/risk for northern village Sundar Pur (${sundarPurNorth.risk.overallRisk} >= ${sundarPurBase.risk.overallRisk})`
  );

  // South track shift testing: southern villages (New Port Colony / Delta Nagar) risk increases
  const simSouth30 = runSimulation({ ...DEFAULT_SCENARIO_INPUTS, trackShiftKm: -30 });
  const deltaNagarBase = baseSim.villages.find((v) => v.name === 'Delta Nagar')!;
  const deltaNagarSouth = simSouth30.villages.find((v) => v.name === 'Delta Nagar')!;
  assert(
    deltaNagarSouth.risk.overallRisk >= deltaNagarBase.risk.overallRisk,
    `South track shift (-30km) increases hazard/risk for southern village Delta Nagar (${deltaNagarSouth.risk.overallRisk} >= ${deltaNagarBase.risk.overallRisk})`
  );

  console.log('\n--- 4. Testing Route Status & Bridge Vulnerabilities ---');
  const coastalRoad: MockRoadRoute = MOCK_ROADS_LIST.find((r: MockRoadRoute) => r.name === 'Coastal Road')!;
  const severeInputs = { ...DEFAULT_SCENARIO_INPUTS, rainfallMm: 350, stormSurgeMeters: 3.5 };
  const severeRouteStatus = calculateRouteStatus(coastalRoad, severeInputs);
  assertEqual(severeRouteStatus, 'Blocked', 'Coastal Road becomes Blocked in severe flood scenario');

  const elevatedRoute: MockRoadRoute = MOCK_ROADS_LIST.find((r: MockRoadRoute) => r.name === 'Elevated Route 2')!;
  const elevatedStatus = calculateRouteStatus(elevatedRoute, severeInputs);
  assert(elevatedStatus === 'Safe' || elevatedStatus === 'Caution', 'Elevated Route 2 remains Safe or Caution even in severe scenario');

  console.log('\n--- 5. Testing Shelter Capacity & Occupancy ---');
  assert(baseSim.totalShelterCapacity > 0, 'Total shelter capacity is positive');
  assert(baseSim.availableShelterCapacity >= 0, 'Available shelter capacity is non-negative');
  baseSim.shelters.forEach((sh) => {
    assert((sh.currentOccupancy || 0) <= (sh.capacity || 0), `Shelter ${sh.name} is not overfilled (${sh.currentOccupancy} <= ${sh.capacity})`);
  });

  console.log('\n--- 6. Testing Determinism ---');
  const run1 = runSimulation(DEFAULT_SCENARIO_INPUTS);
  const run2 = runSimulation(DEFAULT_SCENARIO_INPUTS);
  assertEqual(JSON.stringify(run1.villages), JSON.stringify(run2.villages), 'Same inputs produce exact identical village risks (100% deterministic)');
  assertEqual(JSON.stringify(run1.assets), JSON.stringify(run2.assets), 'Same inputs produce exact identical asset risks (100% deterministic)');

  console.log('\n--- 7. Testing AI Briefing & CAP Alerts Generation ---');
  const briefing = generateLocalBriefing(baseSim);
  assert(briefing.executiveSummary.length > 50, 'Briefing executive summary is populated');
  assertEqual(briefing.topFiveRisks.length, 5, 'Briefing contains top 5 risks');
  assert(briefing.hindiPublicAdvisory.includes('सुंदर तटीय जिले'), 'Briefing contains required Hindi advisory format');

  const capDraft = generateCapDraft(baseSim);
  assertEqual(capDraft.status, 'Simulation draft — human approval required', 'CAP draft status is strictly "Simulation draft — human approval required"');
  assert(capDraft.jsonPayload.includes('CSAI-SIM-'), 'CAP JSON payload is valid string containing identifier');

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  return { passed, failed, errors };
}

// Auto-run when executed directly via Node/tsx
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('mockPredictionEngine.test')) {
  const result = runTests();
  if (result.failed > 0) {
    process.exit(1);
  }
}

