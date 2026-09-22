# Cyclone Shield AI — Machine Learning Pipeline & Roadmap

This document outlines the machine learning architecture for Cyclone Shield AI / Cyclone-X, clearly delineating what is currently implemented, the standard feature vector interface, and what is required to connect a trained production model.

---

## 1. Truthful Current State Assessment

| Component | Status | Reality |
| :--- | :--- | :--- |
| **Model Hosting** | **NOT CONNECTED** | No live neural network or GBDT weights are currently hosted on a server. |
| **Prediction Endpoint** | **CONTRACT DEFINED** | `src/services/predictionService.ts` defines the complete TypeScript input/output contract. |
| **Frontend UI Behavior** | **TRUTHFUL EMPTY STATE** | Displays `"AI prediction model not connected"` and `"Prediction model offline — configure VITE_ML_SERVICE_URL"`. |
| **Risk Scoring** | **DETERMINISTIC FORMULA** | Risk calculations are purely deterministic mathematical models ($0.35H + 0.25E + 0.25V + 0.15C$) and explicitly labeled as **Derived Risk Assessment**. |

---

## 2. ML Service Contract Specification

The service interface (`src/services/predictionService.ts`) is designed to consume a standardized multi-variable feature vector:

### Input Feature Vector (`PredictionInputFeatures`)

```typescript
export interface PredictionInputFeatures {
  latitude: number;             // Cyclone center latitude (degrees N)
  longitude: number;            // Cyclone center longitude (degrees E)
  centralPressureHpa: number;   // Minimum central pressure in hPa
  maxWindSpeedKmh: number;      // Maximum sustained wind speed in km/h
  pressureChange24h?: number;   // Rate of intensification (hPa/24h)
  windChange24h?: number;       // Wind speed delta (km/h/24h)
  seaSurfaceTemperatureC?: number; // SST (°C) from satellite radiometer (e.g. MODIS/AMSR2)
  verticalWindShearKnots?: number; // Atmospheric shear 850-200 hPa
  translationSpeedKmh?: number; // Storm forward motion speed
  translationHeadingDeg?: number; // Heading azimuth (0-360°)
  oceanHeatContentKjCm2?: number; // Tropical Cyclone Heat Potential (TCHP)
  distanceToCoastlineKm?: number; // Orthodromic distance to nearest coast
}
```

### Prediction Output Response (`PredictionResult`)

```typescript
export interface PredictionResult {
  predictionAvailable: boolean;       // Set to true only when a valid inference response is received
  cycloneRiskProbability?: number;   // Probability [0.0 - 1.0]
  predictedIntensityClass?: string;  // e.g. "Extremely Severe Cyclonic Storm"
  predictedMaxWindKmh?: number;      // Continuous wind speed prediction (km/h)
  predictedMinPressureHpa?: number;  // Continuous central pressure (hPa)
  projectedLandfallHours?: number;   // Estimated time to landfall (hours)
  confidenceInterval?: {
    windLowKmh: number;
    windHighKmh: number;
    landfallMarginHours: number;
  };
  modelMetadata?: {
    modelName: string;               // e.g. "Cyclone-X XGBoost Intensity Estimator v2.1"
    architecture: string;            // e.g. "Temporal ConvNet + ResNet-18"
    trainedOnDataset: string;        // e.g. "IBTrACS North Indian Ocean 1982-2023"
    trainingLossMse: number;
    inferenceLatencyMs: number;
  };
  provenance: DataProvenance;
}
```

---

## 3. Production Model Deployment Blueprint

To deploy a real AI model backend:

1. **Model Training**:
   - Train on historical North Indian Ocean cyclone tracks from **IBTrACS v04r00** and **ERA5 atmospheric reanalysis**.
   - Target metrics: 12h/24h/48h intensity estimation ($\Delta V_{\max}$) and track displacement error.
2. **Serving**:
   - Containerize model using **FastAPI / TorchServe / ONNX Runtime**.
   - Expose endpoint `POST /api/predict`.
3. **Environment Setup**:
   - Set in `.env.local`:
     ```bash
     VITE_ML_SERVICE_URL=https://your-ml-api-gateway.com/api/predict
     ```
   - When configured, `predictionService.getPrediction()` automatically posts live feature payloads to the microservice and streams real inferences to the dashboard.
