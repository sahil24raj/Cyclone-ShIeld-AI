import { FeatureEngineeringPipeline } from '../featureEngineering';
import { MLRiskModelEngine } from '../mlRiskModel';
import { IBTrACSService } from '../data_sources/ibtracs/ibtracsService';
import { geoService } from '../geoService';
import { CriticalAsset } from '../../types';

// Mock critical asset for validation:
const testHospital: CriticalAsset = {
  id: 'hosp-sundar-01',
  name: 'Sundar District Hospital',
  type: 'hospital',
  lat: 20.48,
  lng: 86.85,
  criticality: 'critical',
  risk_score: 78,
  hazard_exposure: 'Severe Coastal Surge & Flood Risk',
  current_status: 'operational',
  elevation: 3.8,
  in_flood_zone: true,
  backup_power_ready: false,
  contact_person: 'Dr. A. Sen, CMO',
  recommended_actions: [
    'Relocate ICU/NICU patients to higher floors immediately.',
    'Stage emergency diesel generator and auxiliary mobile pumps.',
  ],
  action_status: {},
};

export function runMLPipelineUnitTests(): boolean {
  console.log('--- Starting CycloneShield AI Pipeline Test Suite ---');
  let passed = 0;
  let total = 0;

  // Test 1: NOAA IBTrACS historical benchmark archive
  total++;
  const storms = IBTrACSService.getAllHistoricalStorms();
  if (storms.length >= 4 && storms.some((s) => s.stormName === 'FANI')) {
    console.log('[PASS] Test 1: NOAA IBTrACS dataset verified with benchmark storms.');
    passed++;
  } else {
    console.error('[FAIL] Test 1: IBTrACS benchmark storm list incomplete.');
  }

  // Test 2: Feature Engineering Extraction & Bounds
  total++;
  const vector = FeatureEngineeringPipeline.extractFeatures(testHospital, {
    maxWindKmh: 185,
    rainfall24hMm: 280,
    stormSurgeMeters: 3.4,
    dataMode: 'MODEL_ESTIMATE',
  });

  if (
    vector.normalizedVector.length === 18 &&
    vector.normalizedVector.every((v) => v >= 0.0 && v <= 1.0) &&
    vector.features.storm_surge.value === 3.4
  ) {
    console.log('[PASS] Test 2: Feature engineering normalized vector [0.0 - 1.0] verified.');
    passed++;
  } else {
    console.error('[FAIL] Test 2: Feature vector normalization out of bounds.');
  }

  // Test 3: ML Random Forest Inference & Class Probabilities
  total++;
  const prediction = MLRiskModelEngine.predict(vector);
  const sumProbs =
    prediction.probabilities.LOW +
    prediction.probabilities.MEDIUM +
    prediction.probabilities.HIGH +
    prediction.probabilities.CRITICAL;

  if (
    prediction.riskScore >= 70 &&
    prediction.riskClass === 'CRITICAL' &&
    Math.abs(sumProbs - 1.0) < 0.05 &&
    prediction.drivers.length > 0
  ) {
    console.log(`[PASS] Test 3: ML inference output score (${prediction.riskScore}/100) and SHAP drivers verified.`);
    passed++;
  } else {
    console.error('[FAIL] Test 3: ML risk classification probability divergence.', prediction);
  }

  // Test 4: Geospatial Elevation & Flood Layer Generation
  total++;
  const floodLayer = geoService.getSatelliteFloodLayer(0, 3.4);
  if (
    floodLayer.type === 'FeatureCollection' &&
    floodLayer.features.length >= 2 &&
    floodLayer.features[0].properties.hazardType === 'STORM_SURGE_INUNDATION'
  ) {
    console.log('[PASS] Test 4: Satellite SAR flood polygon generation verified.');
    passed++;
  } else {
    console.error('[FAIL] Test 4: Satellite flood polygon generation failed.');
  }

  console.log(`--- Test Suite Results: ${passed}/${total} passed ---`);
  return passed === total;
}
