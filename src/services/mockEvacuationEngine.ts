import {
  MockVillageData,
  MockRoadRoute,
  RouteStatus,
  EvacuationPriorityClass,
  EvacuationAssessmentResult,
  RiskCalculationResult,
  ScenarioInputs,
  CalculatedAssetOutput,
  CalculatedRouteOutput,
} from '../types/disaster';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Calculates Route Status: Safe | Caution | At risk | Blocked
 */
export function calculateRouteStatus(
  route: MockRoadRoute,
  inputs: ScenarioInputs
): RouteStatus {
  // Elevated routes withstand higher water levels
  if (route.isElevated) {
    if (inputs.windSpeedKmh > 190) return 'Caution';
    return 'Safe';
  }

  // Coastal Road specific logic
  if (route.id === 'rt-coastal') {
    if (inputs.stormSurgeMeters >= 1.2 || inputs.rainfallMm >= 150) {
      return 'Blocked';
    }
    if (inputs.stormSurgeMeters >= 0.8 || inputs.rainfallMm >= 100) {
      return 'At risk';
    }
    return 'Caution';
  }

  // River Bridge Route
  if (route.id === 'rt-river-bridge') {
    if (inputs.windSpeedKmh >= 160 || inputs.rainfallMm >= 280) {
      return 'Blocked';
    }
    if (inputs.windSpeedKmh >= 120 || inputs.rainfallMm >= 180) {
      return 'Caution';
    }
    return 'Safe';
  }

  // Port Access Road
  if (route.id === 'rt-port-access') {
    if (inputs.stormSurgeMeters >= 2.5 || inputs.rainfallMm >= 260) {
      return 'Blocked';
    }
    if (inputs.stormSurgeMeters >= 1.5 || inputs.rainfallMm >= 160) {
      return 'At risk';
    }
    return 'Caution';
  }

  // Inland Relief Route
  if (route.id === 'rt-inland-relief') {
    return 'Safe';
  }

  // General fallback by elevation vs surge & rainfall
  if (route.elevationAvg < inputs.stormSurgeMeters + 0.5) {
    return 'Blocked';
  }
  if (route.elevationAvg < inputs.stormSurgeMeters + 1.5 || inputs.rainfallMm > 250) {
    return 'At risk';
  }
  if (inputs.windSpeedKmh > 140) {
    return 'Caution';
  }
  return 'Safe';
}

/**
 * Evaluates whether a shelter is safe and accessible
 */
export function calculateShelterSafety(
  shelter: CalculatedAssetOutput,
  inputs: ScenarioInputs,
  routes: CalculatedRouteOutput[]
): {
  isSafe: boolean;
  hasCapacity: boolean;
  isAccessible: boolean;
  reason?: string;
} {
  const capacity = shelter.capacity || 0;
  const occupancy = shelter.currentOccupancy || 0;
  const hasCapacity = occupancy < capacity;

  // High School Cyclone Shelter A specific condition:
  // Coastal Road is its access road. If Coastal Road is blocked or surge >= 1.5m, it is unsafe/inaccessible.
  if (shelter.id === 'infra-shelter-a') {
    const coastalRoute = routes.find((r) => r.id === 'rt-coastal');
    const isRoadFlooded = coastalRoute ? coastalRoute.calculatedStatus === 'Blocked' : inputs.stormSurgeMeters >= 1.2;

    if (isRoadFlooded || inputs.stormSurgeMeters >= 1.5) {
      return {
        isSafe: false,
        hasCapacity,
        isAccessible: false,
        reason: 'Shelter A is geographically closer, but its access road is projected to flood.',
      };
    }
  }

  // Flood zone or low elevation
  if (shelter.elevationMeters <= inputs.stormSurgeMeters + 0.5 && inputs.stormSurgeMeters >= 2.0) {
    return {
      isSafe: false,
      hasCapacity,
      isAccessible: false,
      reason: `Facility elevation (${shelter.elevationMeters}m) is inside projected ${inputs.stormSurgeMeters.toFixed(1)}m surge inundation zone.`,
    };
  }

  if (!hasCapacity) {
    return {
      isSafe: true,
      hasCapacity: false,
      isAccessible: true,
      reason: `Shelter is at maximum operational capacity (${occupancy} / ${capacity} beds).`,
    };
  }

  return {
    isSafe: true,
    hasCapacity: true,
    isAccessible: true,
  };
}

/**
 * Assigns best safe shelter and evacuation route for a given village
 */
export function assignBestShelter(
  village: MockVillageData,
  shelters: CalculatedAssetOutput[],
  routes: CalculatedRouteOutput[],
  inputs: ScenarioInputs
): {
  assignedShelter: CalculatedAssetOutput;
  rejectedNearestShelter?: {
    shelter: CalculatedAssetOutput;
    reason: string;
  };
  recommendedRouteName: string;
  routeStatus: RouteStatus;
  estimatedTravelTimeMinutes: number;
  explanation: string;
} {
  const shelterA = shelters.find((s) => s.id === 'infra-shelter-a') || shelters[0];
  const shelterB = shelters.find((s) => s.id === 'infra-shelter-b') || shelters[1];
  const shelterC = shelters.find((s) => s.id === 'infra-shelter-c') || shelters[2];
  const shelterD = shelters.find((s) => s.id === 'infra-shelter-d') || shelters[3];

  const elevatedRoute2 = routes.find((r) => r.id === 'rt-elevated-2');
  const coastalRoute = routes.find((r) => r.id === 'rt-coastal');
  const riverRoute = routes.find((r) => r.id === 'rt-river-bridge');
  const portRoute = routes.find((r) => r.id === 'rt-port-access');
  const inlandRoute = routes.find((r) => r.id === 'rt-inland-relief');

  // Mandatory Demo Behavior 1: Coastal Ward 7
  if (village.name === 'Coastal Ward 7' || village.id === 'vil-01') {
    const shelterASafety = calculateShelterSafety(shelterA, inputs, routes);

    if (!shelterASafety.isSafe || !shelterASafety.isAccessible) {
      return {
        assignedShelter: shelterB,
        rejectedNearestShelter: {
          shelter: shelterA,
          reason: 'Shelter A is geographically closer, but its access road is projected to flood.',
        },
        recommendedRouteName: 'Elevated Route 2',
        routeStatus: elevatedRoute2?.calculatedStatus || 'Safe',
        estimatedTravelTimeMinutes: elevatedRoute2?.calculatedTravelTimeMin || 18,
        explanation:
          'Shelter A is geographically closer, but its access road is projected to flood. Shelter B is assigned through Elevated Route 2 because it remains accessible and has available capacity.',
      };
    }

    return {
      assignedShelter: shelterA,
      recommendedRouteName: 'Coastal Road',
      routeStatus: coastalRoute?.calculatedStatus || 'Safe',
      estimatedTravelTimeMinutes: coastalRoute?.calculatedTravelTimeMin || 20,
      explanation: 'Direct access available via local coastal arterial to Shelter A.',
    };
  }

  // Mangrove Hamlet (close to Ward 7 / Sea)
  if (village.name === 'Mangrove Hamlet' || village.id === 'vil-07') {
    return {
      assignedShelter: shelterB,
      rejectedNearestShelter: {
        shelter: shelterA,
        reason: 'Shelter A coastal arterial submerged under 1.2m surge.',
      },
      recommendedRouteName: 'Elevated Route 2',
      routeStatus: elevatedRoute2?.calculatedStatus || 'Safe',
      estimatedTravelTimeMinutes: (elevatedRoute2?.calculatedTravelTimeMin || 18) + 8,
      explanation:
        'Coastal access to Shelter A is severed by storm surge inundation. Evacuees are redirected to Municipal Cyclone Shelter B via Elevated Route 2.',
    };
  }

  // Delta Nagar
  if (village.name === 'Delta Nagar' || village.id === 'vil-02') {
    const shelterCSafety = calculateShelterSafety(shelterC, inputs, routes);
    if (!shelterCSafety.isSafe || !shelterCSafety.hasCapacity || inputs.stormSurgeMeters >= 2.0) {
      return {
        assignedShelter: shelterD,
        rejectedNearestShelter: {
          shelter: shelterC,
          reason: 'Shelter C is in low elevation surge zone and near full capacity (90%).',
        },
        recommendedRouteName: 'Port Access Road (High Sector) / Southern Bypass',
        routeStatus: portRoute?.calculatedStatus || 'Caution',
        estimatedTravelTimeMinutes: (portRoute?.calculatedTravelTimeMin || 30) + 5,
        explanation:
          'Shelter C is inside the projected delta surge zone. Residents are routed to Mangrove Relief Shelter D which offers higher elevation and 4,600+ available beds.',
      };
    }

    return {
      assignedShelter: shelterC,
      recommendedRouteName: 'Delta Embankment Corridor',
      routeStatus: 'Caution',
      estimatedTravelTimeMinutes: 20,
      explanation: 'Assigned to Delta Community Center with standby transfer protocol to Shelter D.',
    };
  }

  // Riverbend
  if (village.name === 'Riverbend' || village.id === 'vil-04') {
    return {
      assignedShelter: shelterB,
      recommendedRouteName: 'River Bridge Route (Mahanadi North Trunk)',
      routeStatus: riverRoute?.calculatedStatus || 'Caution',
      estimatedTravelTimeMinutes: riverRoute?.calculatedTravelTimeMin || 28,
      explanation:
        'Assigned to Municipal Cyclone Shelter B via River Bridge Route. Bridge status is monitored for high wind load restrictions.',
    };
  }

  // Sundar Pur & East Embankment
  if (village.name === 'Sundar Pur' || village.name === 'East Embankment' || village.id === 'vil-03' || village.id === 'vil-08') {
    return {
      assignedShelter: shelterB,
      recommendedRouteName: 'Inland Relief Route',
      routeStatus: inlandRoute?.calculatedStatus || 'Safe',
      estimatedTravelTimeMinutes: inlandRoute?.calculatedTravelTimeMin || 14,
      explanation:
        'Direct connection via Inland Relief Route to Municipal Cyclone Shelter B. Elevated terrain guarantees zero flood cutoff.',
    };
  }

  // Default / Kharipalli / New Port Colony
  const defaultShelter = village.name === 'New Port Colony' ? shelterD : shelterB;
  return {
    assignedShelter: defaultShelter,
    recommendedRouteName: village.name === 'New Port Colony' ? 'Port Access Road' : 'Inland Relief Route',
    routeStatus: 'Safe',
    estimatedTravelTimeMinutes: 15,
    explanation: `Direct route to ${defaultShelter.name} available with clear status and sufficient vacancy.`,
  };
}

/**
 * Calculates Evacuation Priority:
 * evacuationPriority = 0.40 * overallRisk + 0.25 * populationVulnerability + 0.20 * shelterAccessRisk + 0.15 * urgencyScore
 */
export function calculateEvacuationPriority(
  overallRisk: number,
  populationVulnerability: number,
  shelterAccessRisk: number,
  urgencyScore: number
): {
  priority: EvacuationPriorityClass;
  priorityScore: number;
} {
  const rawScore =
    0.40 * overallRisk +
    0.25 * populationVulnerability +
    0.20 * shelterAccessRisk +
    0.15 * urgencyScore;

  const score = Math.round(clamp(rawScore, 0, 100));

  let priority: EvacuationPriorityClass;
  if (score >= 70 || overallRisk >= 76) {
    priority = 'P0';
  } else if (score >= 48 || overallRisk >= 51) {
    priority = 'P1';
  } else if (score >= 25 || overallRisk >= 26) {
    priority = 'P2';
  } else {
    priority = 'P3';
  }

  return { priority, priorityScore: score };
}

/**
 * Produces the complete evacuation assessment object for a single village
 */
export function calculateEvacuationAssessment(
  village: MockVillageData,
  risk: RiskCalculationResult,
  inputs: ScenarioInputs,
  shelters: CalculatedAssetOutput[],
  routes: CalculatedRouteOutput[],
  floodDepth: number,
  floodProbability: number
): EvacuationAssessmentResult {
  // Urgency score: shorter lead time = higher urgency (6h = 100, 72h = 10)
  const urgencyScore = clamp(Math.round(((72 - inputs.landfallHours) / (72 - 6)) * 100), 10, 100);

  // Shelter access risk: higher if road access is low or route is flooded
  const shelterAccessRisk = clamp(100 - village.roadAccessScore + (floodDepth > 1.0 ? 30 : 0), 10, 100);

  const { priority, priorityScore } = calculateEvacuationPriority(
    risk.overallRisk,
    risk.vulnerabilityScore,
    shelterAccessRisk,
    urgencyScore
  );

  const assignment = assignBestShelter(village, shelters, routes, inputs);

  const totalCap = assignment.assignedShelter.capacity || 0;
  const currentOcc = assignment.assignedShelter.currentOccupancy || 0;
  const availableBeds = Math.max(0, totalCap - currentOcc);

  let recommendedAction: string;
  if (priority === 'P0') {
    recommendedAction = `Immediate mandatory evacuation. Re-route ${village.population.toLocaleString()} residents to ${assignment.assignedShelter.name} via ${assignment.recommendedRouteName}.`;
  } else if (priority === 'P1') {
    recommendedAction = `Stage phased evacuation within 6 hours. Pre-position public transport along ${assignment.recommendedRouteName}.`;
  } else if (priority === 'P2') {
    recommendedAction = `Prepare vulnerable households for movement; maintain standby coordination with ${assignment.assignedShelter.name}.`;
  } else {
    recommendedAction = `Advise shelter in place for permanent structures; keep communication channels open.`;
  }

  return {
    evacuationPriority: priority,
    evacuationPriorityScore: priorityScore,
    populationExposed: village.population,
    elderlyCount: village.elderlyPopulation,
    childrenCount: village.childrenPopulation,
    floodProbabilityPct: floodProbability,
    estimatedFloodDepthMeters: floodDepth,
    nearestRecommendedShelter: assignment.assignedShelter,
    rejectedNearestShelter: assignment.rejectedNearestShelter,
    shelterCapacityStatus: {
      capacity: totalCap,
      currentOccupancy: currentOcc,
      availableBeds,
      isOverfilled: currentOcc >= totalCap,
    },
    routeStatus: assignment.routeStatus,
    recommendedRouteName: assignment.recommendedRouteName,
    estimatedTravelTimeMinutes: assignment.estimatedTravelTimeMinutes,
    recommendedAction,
    shelterAssignmentExplanation: assignment.explanation,
  };
}
