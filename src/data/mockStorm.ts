import { StormScenario, ScenarioInputs } from '../types/disaster';

export const BASE_STORM_SCENARIO: StormScenario = {
  name: 'Cyclone Varuna',
  district: 'Sundar Coast District',
  basePhase: 'T-24 hours',
  baseLandfallHours: 24,
  baseWindSpeedKmh: 135,
  baseRainfallMm: 180,
  baseStormSurgeMeters: 1.8,
  baseTrackShiftKm: 0,
  baseForecastConfidencePct: 78,
};

export const DEFAULT_SCENARIO_INPUTS: ScenarioInputs = {
  windSpeedKmh: 135,
  rainfallMm: 180,
  stormSurgeMeters: 1.8,
  trackShiftKm: 0,
  landfallHours: 24,
};
