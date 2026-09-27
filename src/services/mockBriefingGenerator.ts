import {
  SimulationSummaryOutput,
  SimulationBriefingOutput,
  CapAlertDraft,
} from '../types/disaster';
import { BASE_STORM_SCENARIO } from '../data/mockStorm';

/**
 * Deterministically generates AI-style situation report without any external API or backend.
 */
export function generateLocalBriefing(
  summary: SimulationSummaryOutput
): SimulationBriefingOutput {
  const { scenarioInputs, villages, assets, shelters, routes } = summary;

  // 1. Executive Summary
  const executiveSummary = `PROTOTYPE SIMULATION SITREP — Model Estimate for ${BASE_STORM_SCENARIO.name} affecting ${BASE_STORM_SCENARIO.district}.
Current scenario projections indicate sustained winds of ${scenarioInputs.windSpeedKmh} km/h, 24-hour rainfall accumulation of ${scenarioInputs.rainfallMm} mm, and a peak coastal storm surge of ${scenarioInputs.stormSurgeMeters.toFixed(1)} meters AMSL.
Landfall window estimate is T-${scenarioInputs.landfallHours}h (${scenarioInputs.landfallHours} hours remaining).
A total of ${summary.totalPopulationExposed.toLocaleString()} residents across ${villages.length} wards are under model observation, with ${summary.p0Population.toLocaleString()} residents in immediate P0 mandatory evacuation sectors.
${summary.criticalAssetsAtRiskCount} critical infrastructure lifelines face severe inundation or wind stress.`;

  // 2. Top Five Risks
  const topRisks: string[] = [
    `1. Coastal Storm Surge Inundation: Peak water levels reaching ${scenarioInputs.stormSurgeMeters.toFixed(1)}m, causing severe tidal overtopping in Coastal Ward 7 and Mangrove Hamlet.`,
    `2. Evacuation Corridor Severance: Coastal Road (SH-12) is rendered impassable due to tidal surge; traffic must be rerouted through Elevated Route 2.`,
    `3. Critical Hospital Facility Disruption: Delta Community Health Centre and Sundar District Hospital ground-floor bays face water ingress within 12 hours.`,
    `4. High Wind Shear & Grid Flashover: Sustained ${scenarioInputs.windSpeedKmh} km/h gales threaten Coastal Power Substation switchyards and 33kV overhead lines.`,
    `5. Shelter Capacity Pressure: Net district shelter capacity deficit is projected at ${summary.shelterCapacityGap.toLocaleString()} beds if secondary spillover shelters are not activated.`,
  ];

  // 3. Critical Assets Requiring Immediate Action
  const criticalAssetsRequiringAction = assets
    .filter((a) => a.calculatedRiskScore >= 75)
    .slice(0, 5)
    .map((a) => ({
      assetName: a.name,
      riskScore: a.calculatedRiskScore,
      action: a.recommendedAction,
    }));

  // 4. P0 and P1 Evacuation Villages
  const p0AndP1Villages = villages
    .filter((v) => v.evacuation.evacuationPriority === 'P0' || v.evacuation.evacuationPriority === 'P1')
    .map((v) => ({
      villageName: v.name,
      priority: v.evacuation.evacuationPriority,
      population: v.population,
      recommendedShelter: v.evacuation.nearestRecommendedShelter.name,
    }));

  // 5. Shelter Capacity Status
  const totalCapacity = summary.totalShelterCapacity;
  const totalOccupied = shelters.reduce((acc, s) => acc + (s.currentOccupancy || 0), 0);
  const availableBeds = summary.availableShelterCapacity;
  const deficit = summary.shelterCapacityGap;

  // 6. Recommended Actions for Next 6 Hours
  const recommendedActionsNext6Hours = [
    'Execute mandatory transfer of P0 residents in Coastal Ward 7 and Delta Nagar via Elevated Route 2 before dusk.',
    'Pre-emptively de-energize coastal 33kV Feeders 3 & 4 at Coastal Power Substation to protect regional grid transformers.',
    'Complete medical evacuation of non-ambulatory patients from Delta Community Health Centre to higher-elevation inland facilities.',
    'Deploy PWD quick-response chainsaw and sandbag teams at Riverbend Bridge approach and East Embankment sluices.',
    'Broadcast multi-channel multilingual public advisories instructing citizens to avoid flooded coastal highways.',
  ];

  // 7. English Public Advisory
  const englishPublicAdvisory = `[MODEL ESTIMATE — PROTOTYPE SIMULATION ONLY]
EMERGENCY CYCLONE ADVISORY FOR SUNDAR COAST DISTRICT:
Sustained winds of ${scenarioInputs.windSpeedKmh} km/h and storm surge of ${scenarioInputs.stormSurgeMeters.toFixed(1)}m are projected over the next ${scenarioInputs.landfallHours} hours.
Residents in Coastal Ward 7, Delta Nagar, and Mangrove Hamlet must evacuate immediately to designated multi-purpose cyclone shelters.
DO NOT use the flooded Coastal Road. Use Elevated Route 2 to reach Municipal Cyclone Shelter B.
This is a prototype simulation; follow official directives from IMD and District Disaster Management Authority.`;

  // 8. Hindi Public Advisory
  const hindiPublicAdvisory = `अगले ${scenarioInputs.landfallHours} घंटों में सुंदर तटीय जिले के निचले और तटीय क्षेत्रों में तेज हवाओं, भारी वर्षा और जलभराव का मॉडल अनुमान है। Coastal Ward 7 तथा Delta Nagar के निवासियों को स्थानीय प्रशासन के निर्देशानुसार सुरक्षित आश्रय स्थल की ओर जाने की तैयारी करनी चाहिए। यह एक prototype simulation है; केवल आधिकारिक IMD और जिला प्रशासन के निर्देशों का पालन करें।`;

  // 9. Model Confidence
  const modelConfidence = `Model Confidence: ${summary.forecastConfidencePct}% • Deterministic physical hydrodynamic formulation P-CHMVM v2.4 calibrated on Bay of Bengal historical events.`;

  // 10. Limitations
  const limitations = `LIMITATIONS & DISCLAIMER:
- This briefing is generated deterministically from synthetic scenario inputs for demonstration and decision-support prototype evaluation.
- It does NOT constitute an official meteorological bulletin, weather forecast, or statutory evacuation order.
- In actual emergency operations, official bulletins from the India Meteorological Department (IMD) and National/State Disaster Management Authorities (NDMA/OSDMA) are legally binding.`;

  return {
    executiveSummary,
    topFiveRisks: topRisks,
    criticalAssetsRequiringAction,
    p0AndP1Villages,
    shelterCapacityStatus: {
      totalCapacity,
      totalOccupied,
      availableBeds,
      deficit,
    },
    recommendedActionsNext6Hours,
    englishPublicAdvisory,
    hindiPublicAdvisory,
    modelConfidence,
    limitations,
  };
}

/**
 * Generates standardized Common Alerting Protocol (CAP v1.2) draft payload from simulation results
 */
export function generateCapDraft(
  summary: SimulationSummaryOutput,
  alertType: string = 'Evacuation'
): CapAlertDraft {
  const { scenarioInputs, villages } = summary;

  const criticalVillageNames = villages
    .filter((v) => v.evacuation.evacuationPriority === 'P0' || v.risk.riskClass === 'Critical')
    .map((v) => v.name);

  const affectedAreaStr = criticalVillageNames.length > 0
    ? `${BASE_STORM_SCENARIO.district} (${criticalVillageNames.join(', ')})`
    : `${BASE_STORM_SCENARIO.district} Coastal Sectors`;

  const timeWindow = `Next ${scenarioInputs.landfallHours} Hours (Valid through T-00h)`;

  const urgencyVal: 'Immediate' | 'Expected' | 'Future' =
    scenarioInputs.landfallHours <= 12 ? 'Immediate' : 'Expected';

  const severityVal: 'Critical' | 'Severe' | 'Moderate' | 'Minor' =
    scenarioInputs.stormSurgeMeters >= 2.5 || scenarioInputs.windSpeedKmh >= 150
      ? 'Critical'
      : 'Severe';

  const headline = alertType === 'Flood'
    ? `COASTAL SURGE FLOOD INUNDATION ALERT for ${affectedAreaStr}`
    : alertType === 'Wind'
    ? `GALE FORCE CYCLONE WIND HAZARD WARNING for ${affectedAreaStr}`
    : `MANDATORY EVACUATION: Extreme Cyclone Surge Hazard for ${affectedAreaStr}`;

  const description = `Prototype model estimation indicates severe coastal storm surge up to ${scenarioInputs.stormSurgeMeters.toFixed(1)}m AMSL and sustained winds of ${scenarioInputs.windSpeedKmh} km/h under ${BASE_STORM_SCENARIO.name}. Primary coastal highway is projected to flood.`;

  const instruction = `All residents in low-lying sectors of ${criticalVillageNames.join(', ')} must move to designated safe shelters. Use Elevated Route 2 to Municipal Cyclone Shelter B. Do not traverse flooded coastal routes. Follow local administration advisories.`;

  const payload = {
    identifier: `CSAI-SIM-${Date.now()}`,
    sender: 'CycloneShield AI Decision Support Desk',
    sent: new Date().toISOString(),
    status: 'Draft',
    msgType: 'Alert',
    scope: 'Public',
    info: {
      category: 'Safety',
      event: `Cyclone ${alertType} & Surge Warning`,
      urgency: urgencyVal,
      severity: severityVal,
      certainty: 'Likely' as const,
      headline,
      description,
      instruction,
      area: {
        areaDesc: affectedAreaStr,
        affectedVillages: criticalVillageNames,
      },
      parameter: {
        simulatedWindSpeedKmh: scenarioInputs.windSpeedKmh,
        simulatedSurgeMeters: scenarioInputs.stormSurgeMeters,
        simulatedRainfallMm: scenarioInputs.rainfallMm,
        disclaimer: 'Prototype simulation draft — human approval required before dissemination.',
      },
    },
  };

  const readablePreview = `═════════════════════════════════════════════════════════════════════════
COMMON ALERTING PROTOCOL (CAP v1.2) — SIMULATION DRAFT
Status: Simulation draft — human approval required (NOT DISPATCHED)
═════════════════════════════════════════════════════════════════════════
Event:       Cyclone ${alertType} & Storm Surge Warning
Severity:    ${severityVal.toUpperCase()} | Urgency: ${urgencyVal.toUpperCase()} | Certainty: LIKELY
Area:        ${affectedAreaStr}
Time Window: ${timeWindow}

HEADLINE:
${headline}

OPERATIONAL DIRECTIVE:
${instruction}

METEOROLOGICAL MODEL CONTEXT:
• Max Sustained Wind: ${scenarioInputs.windSpeedKmh} km/h
• Projected Storm Surge: ${scenarioInputs.stormSurgeMeters.toFixed(1)} m
• 24h Rainfall Accumulation: ${scenarioInputs.rainfallMm} mm
• Target Population in Hazard Zone: ${summary.p0Population.toLocaleString()} residents
═════════════════════════════════════════════════════════════════════════`;

  return {
    identifier: payload.identifier,
    sender: payload.sender,
    sent: payload.sent,
    status: 'Simulation draft — human approval required',
    msgType: 'Alert',
    scope: 'Public',
    event: payload.info.event,
    urgency: urgencyVal,
    severity: severityVal,
    certainty: 'Likely',
    category: 'Safety',
    headline,
    description,
    instruction,
    areaDesc: affectedAreaStr,
    affectedVillages: criticalVillageNames,
    timeWindow,
    recommendedAction: instruction,
    jsonPayload: JSON.stringify(payload, null, 2),
    readablePreview,
  };
}
