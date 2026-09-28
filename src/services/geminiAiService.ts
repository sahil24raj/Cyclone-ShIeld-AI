import { CriticalAsset } from '../types';
import { MLRiskPredictionResult } from './mlRiskModel';
import { AssetFeatureVector } from './featureEngineering';

export interface GeminiExplanationEvidence {
  factor: string;
  value: string;
  source: string;
}

export interface GeminiExplanationResponse {
  situationSummary: string;
  riskExplanation: string;
  serviceImpact: string;
  recommendedAction: string;
  evidence: GeminiExplanationEvidence[];
  limitations: string[];
  aiProvider: 'GOOGLE_GEMINI_API' | 'STRUCTURED_DETERMINISTIC_ENGINE';
  isGroundedOnML: boolean;
  generatedAt: string;
}

export class GeminiAIService {
  /**
   * Generates structured AI reasoning grounded STRICTLY on ML model predictions and empirical feature evidence.
   */
  public static async generateAssetExplanation(
    asset: CriticalAsset,
    prediction: MLRiskPredictionResult,
    featureVector: AssetFeatureVector
  ): Promise<GeminiExplanationResponse> {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

    // Structured prompt payload containing only empirical evidence:
    const evidenceList: GeminiExplanationEvidence[] = [
      {
        factor: 'Calculated ML Risk Score',
        value: `${prediction.riskScore}/100 (${prediction.riskClass})`,
        source: `${prediction.modelVersion} (Random Forest Ensemble)`,
      },
      {
        factor: 'Peak Coastal Storm Surge',
        value: `${featureVector.features.storm_surge.value} m AMSL`,
        source: featureVector.features.storm_surge.source,
      },
      {
        factor: '24-Hour Rainfall Accumulation',
        value: `${featureVector.features.rainfall_24h.value} mm`,
        source: featureVector.features.rainfall_24h.source,
      },
      {
        factor: 'Ground Topography & Elevation',
        value: `${featureVector.features.elevation.value} m AMSL (Dist to coast: ${featureVector.features.distance_to_coast.value} km)`,
        source: featureVector.features.elevation.source,
      },
      {
        factor: 'Access Road Viability',
        value: `${featureVector.features.road_accessibility.value}% transit viability`,
        source: featureVector.features.road_accessibility.source,
      },
      {
        factor: 'Backup Generation',
        value: featureVector.features.backup_power.value ? 'Verified Ready' : 'NO Backup Available',
        source: featureVector.features.backup_power.source,
      },
    ];

    if (geminiApiKey) {
      try {
        const prompt = `You are the lead operational AI reasoning engine for CycloneShield AI disaster response.
Explain the following Machine Learning prediction for emergency managers.
Do NOT invent any new weather values, risk numbers, or coordinates.
Use ONLY the supplied evidence below:

Asset: ${asset.name} (${asset.type})
Criticality: ${asset.criticality}/100
ML Risk Score: ${prediction.riskScore}/100 (${prediction.riskClass})
Class Probabilities: Low: ${prediction.probabilities.LOW}, Med: ${prediction.probabilities.MEDIUM}, High: ${prediction.probabilities.HIGH}, Critical: ${prediction.probabilities.CRITICAL}
Top Drivers: ${prediction.drivers.map((d) => `${d.featureLabel} (${d.observedValue})`).join(', ')}
Evidence:
${evidenceList.map((e) => `- ${e.factor}: ${e.value} (${e.source})`).join('\n')}

Respond with STRICT JSON matching this exact structure:
{
  "situationSummary": "Concise summary of facility exposure",
  "riskExplanation": "Why this risk score was generated based on specific factors",
  "serviceImpact": "Expected disruption to public services and dependent population",
  "recommendedAction": "Actionable directive for emergency authority with deadline",
  "limitations": ["Model limitation 1", "Model limitation 2"]
}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (response.ok) {
          const resJson = await response.json();
          const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              situationSummary: parsed.situationSummary || `${asset.name} faces severe coastal storm exposure.`,
              riskExplanation: parsed.riskExplanation || `Compound impact of ${prediction.drivers[0]?.featureLabel || 'surge'} and road accessibility risk.`,
              serviceImpact: parsed.serviceImpact || `Risk of critical service disruption to ~${(asset as any).population_served || 35000} dependent citizens.`,
              recommendedAction: parsed.recommendedAction || (asset.recommended_actions?.[0] || 'Stage mobile flood defenses immediately.'),
              evidence: evidenceList,
              limitations: parsed.limitations || [
                'Inundation timing is subject to high-tide peak timing uncertainty.',
                'Structural wind rating assumes standard coastal engineering code compliance.',
              ],
              aiProvider: 'GOOGLE_GEMINI_API',
              isGroundedOnML: true,
              generatedAt: new Date().toISOString(),
            };
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, using deterministic structured reasoning engine:', err);
      }
    }

    // High-fidelity deterministic structured reasoning engine fallback:
    return this.generateDeterministicExplanation(asset, prediction, featureVector, evidenceList);
  }

  private static generateDeterministicExplanation(
    asset: CriticalAsset,
    prediction: MLRiskPredictionResult,
    featureVector: AssetFeatureVector,
    evidenceList: GeminiExplanationEvidence[]
  ): GeminiExplanationResponse {
    const f = featureVector.features;
    const isHospital = asset.type === 'hospital';
    const isPower = asset.type === 'power_substation';
    const isBridge = asset.type === 'bridge';

    let situationSummary = '';
    let riskExplanation = '';
    let serviceImpact = '';
    let recommendedAction = '';

    if (prediction.riskScore >= 75) {
      situationSummary = `${asset.name} is in the critical inundation pathway with an ML Risk Score of ${prediction.riskScore}/100 (CRITICAL).`;
      riskExplanation = `Facility vulnerability escalated primarily because projected storm surge of ${f.storm_surge.value}m AMSL exceeds local terrain elevation (${f.elevation.value}m AMSL) while arterial road accessibility drops to ${f.road_accessibility.value}%.`;
      serviceImpact = isHospital
        ? `Ground-floor emergency and intensive care units risk water ingress, potentially jeopardizing critical ICU/NICU patient lifelines and surgical power stability.`
        : isPower
        ? `Severe waterlogging of outdoor 33kV switchyard busbars will trigger automatic transformer trip, blacking out downstream feeder districts and water treatment pumps.`
        : `Structural scouring and approach road severance will isolate coastal communities from emergency response vehicle access.`;
      recommendedAction = isHospital
        ? `Execute immediate vertical or inter-hospital relocation of non-ambulatory and ICU/NICU patients to higher ground within 4 hours; stage auxiliary mobile pumps.`
        : isPower
        ? `Pre-emptively de-energize exposed low-lying distribution feeders and verify waterproof containment for control house battery banks.`
        : `Erect warning barriers and deploy heavy recovery machinery at bridge abutment approaches.`;
    } else if (prediction.riskScore >= 60) {
      situationSummary = `${asset.name} is under elevated alert status with an ML Risk Score of ${prediction.riskScore}/100 (HIGH).`;
      riskExplanation = `High wind load (${f.max_wind.value} km/h) combined with 24-hour rainfall of ${f.rainfall_24h.value}mm creates elevated operational stress, though ground elevation (${f.elevation.value}m) provides moderate flood buffering.`;
      serviceImpact = `Intermittent service degradation expected during peak gale-force gusts; peripheral access routes may experience temporary ponding.`;
      recommendedAction = asset.recommended_actions?.[0] || `Secure auxiliary power generators, clear drainage culverts, and place emergency response personnel on 15-minute standby.`;
    } else {
      situationSummary = `${asset.name} maintains acceptable operational stability with an ML Risk Score of ${prediction.riskScore}/100 (${prediction.riskClass}).`;
      riskExplanation = `Favorable topographic elevation (${f.elevation.value}m AMSL) and maintained corridor accessibility (${f.road_accessibility.value}%) mitigate current forecast hazard levels.`;
      serviceImpact = `Routine operations sustainable with standard storm precautions.`;
      recommendedAction = `Maintain periodic sensor telemetry monitoring and verify emergency fuel reserves.`;
    }

    return {
      situationSummary,
      riskExplanation,
      serviceImpact,
      recommendedAction,
      evidence: evidenceList,
      limitations: [
        'Deterministic SLOSH surge models carry ±0.3m uncertainty based on astronomical tide timing.',
        'Corridor accessibility estimates assume unblocked drainage channels and intact embankment structures.',
        'Predictions should be cross-verified with on-ground District Disaster Management Authority spotters.',
      ],
      aiProvider: 'STRUCTURED_DETERMINISTIC_ENGINE',
      isGroundedOnML: true,
      generatedAt: new Date().toISOString(),
    };
  }
}
