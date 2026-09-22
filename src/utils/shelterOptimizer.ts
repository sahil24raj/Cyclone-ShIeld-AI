import { Village, Shelter } from '../types';
import { MOCK_SHELTERS } from '../data/infrastructureData';

export interface ShelterAssignmentResult {
  assignedShelter: Shelter;
  isRerouted: boolean;
  originalShelter?: Shelter;
  routeReason: string;
  recommendedCorridor: string;
  estimatedTransitTimeMin: number;
  availableCapacity: number;
}

export function optimizeShelterAssignment(village: Village): ShelterAssignmentResult {
  const primary = MOCK_SHELTERS.find((s) => s.id === village.primary_shelter_id) || MOCK_SHELTERS[0];

  // If primary shelter is in flood zone, or access road is blocked/submerged
  if (primary.access_road_status === 'blocked' || !primary.is_operational || primary.in_flood_zone && village.estimated_water_depth > 1.2) {
    const alternate = MOCK_SHELTERS.find((s) => s.id === village.alternate_shelter_id) || MOCK_SHELTERS[1];
    
    return {
      assignedShelter: alternate,
      isRerouted: true,
      originalShelter: primary,
      routeReason: `${primary.name} is closest (${village.shelter_distance} km), but primary access road SH-12 is projected to flood under 0.8m tidal surge.`,
      recommendedCorridor: 'Elevated Corridor 2 (Puri-Sundar Bypass)',
      estimatedTransitTimeMin: 22,
      availableCapacity: alternate.capacity - alternate.current_occupancy,
    };
  }

  return {
    assignedShelter: primary,
    isRerouted: false,
    routeReason: `Direct access available via local elevated arterial. Shelter operational with backup power.`,
    recommendedCorridor: 'Standard Primary Access Road',
    estimatedTransitTimeMin: Math.round(village.shelter_distance * 4),
    availableCapacity: primary.capacity - primary.current_occupancy,
  };
}
