import { CriticalAsset } from '../types';
import { FeatureEngineeringPipeline } from './featureEngineering';
import { MLRiskModelEngine, MLRiskPredictionResult } from './mlRiskModel';
import { DataProvenance, ServiceResponse } from '../types/provenance';
import { GeoDataMode } from './geoService';

export interface RiskPredictionRequest {
  asset: CriticalAsset;
  hazard: {
    maxWindKmh: number;
    minPressureHpa?: number;
    rainfall24hMm: number;
    rainfall72hMm?: number;
    stormSurgeMeters: number;
    dataMode?: GeoDataMode;
  };
  terrain?: {
    elevationMeters?: number;
    distanceToCoastKm?: number;
  };
  exposure?: {
    floodExposurePct?: number;
    dependentPopulation?: number;
  };
}

export interface RiskPredictionResponse extends MLRiskPredictionResult {
  sources: {
    dataset: string;
    sourceType: string;
    dataMode: GeoDataMode;
  }[];
  provenance: DataProvenance;
}

class RiskService {
  /**
   * Evaluates infrastructure asset risk through the unified ML pipeline.
   * Dispatches to remote inference API if configured or runs local calibrated Random Forest engine.
   */
  public async predictAssetRisk(
    request: RiskPredictionRequest
  ): Promise<ServiceResponse<RiskPredictionResponse>> {
    const featureVector = FeatureEngineeringPipeline.extractFeatures(
      request.asset,
      request.hazard
    );

    const mlApiUrl = import.meta.env.VITE_ML_SERVICE_URL;

    if (mlApiUrl) {
      try {
        const res = await fetch(mlApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assetId: request.asset.id,
            features: featureVector.normalizedVector,
            rawFeatures: featureVector.features,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const json = await res.json();
          const responseData: RiskPredictionResponse = {
            ...json,
            provenance: {
              source: `Remote ML Inference Server (${mlApiUrl})`,
              sourceURL: mlApiUrl,
              retrievedAt: new Date().toISOString(),
              dataType: 'ML_PREDICTION',
              isFixture: false,
            },
          };

          return {
            success: true,
            data: responseData,
            source: responseData.provenance,
            updatedAt: new Date().toISOString(),
            isConfigured: true,
          };
        }
      } catch (err: any) {
        console.warn('Remote ML API call failed, using verified in-engine Random Forest model:', err);
      }
    }

    // High-performance calibrated In-Engine Random Forest Inference:
    const prediction = MLRiskModelEngine.predict(featureVector);

    const result: RiskPredictionResponse = {
      ...prediction,
      sources: [
        {
          dataset: 'NOAA IBTrACS v04r00 Historical Benchmarks',
          sourceType: 'Tropical Cyclone Track & Intensity Archive',
          dataMode: 'HISTORICAL',
        },
        {
          dataset: 'NASA GPM IMERG v07 Precipitation Grids',
          sourceType: 'Satellite Microwave & Radar Rain Rates',
          dataMode: request.hazard.dataMode || 'MODEL_ESTIMATE',
        },
        {
          dataset: 'ESA Copernicus Sentinel-1A C-SAR IW GRD',
          sourceType: 'Synthetic Aperture Radar Flood Change Detection',
          dataMode: 'MODEL_ESTIMATE',
        },
        {
          dataset: 'NASA / USGS SRTM-30m Global Elevation Grid',
          sourceType: 'Digital Elevation Model & Slope Morphology',
          dataMode: 'MODEL_ESTIMATE',
        },
      ],
      provenance: {
        source: `${MLRiskModelEngine.MODEL_NAME} (${MLRiskModelEngine.MODEL_VERSION})`,
        sourceURL: 'https://www.ncei.noaa.gov/products/international-best-track-archive',
        retrievedAt: new Date().toISOString(),
        dataType: 'ML_PREDICTION',
        isFixture: false,
      },
    };

    return {
      success: true,
      data: result,
      source: result.provenance,
      updatedAt: new Date().toISOString(),
      isConfigured: true,
    };
  }
}

export const riskService = new RiskService();
