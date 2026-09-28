# CycloneShield AI — Production Architecture Specification

## 1. High-Level Architecture Overview

CycloneShield AI is designed as an anticipatory disaster intelligence decision-support platform with a clean separation of real data ingestion, spatial/temporal validation, deterministic multi-hazard physical computation, Python prediction microservices, and interactive presentation layers.

```
+-------------------------------------------------------------------------+
|                         REAL OBSERVATIONAL DATA                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | NOAA IBTrACS v04r01|  | Open-Meteo ERA5    |  | JRC Global Water  |  |
|  | Best-Track NetCDF  |  | Hourly Station CSV |  | 30m GeoTIFF Tile  |  |
|  +--------------------+  +--------------------+  +-------------------+  |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | NASA GPM IMERG V07 |  | OpenStreetMap Real |  | DFO FloodArchive  |  |
|  | Satellite Rain TIF |  | 468 Infrastructure |  | Macro Event Poly  |  |
|  +--------------------+  +--------------------+  +-------------------+  |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                  FEATURE ENGINEERING & DATA FUSION                      |
|                     (ml/build_real_pipeline.py)                         |
|                                                                         |
|   • Memory-Mapped 30m JRC water occurrence lookup at [lat, lon]         |
|   • NASA GPM IMERG 0.1° bounding box spatial clipping (Kakinada BBox)   |
|   • Haversine distance to coast and cyclone storm eye                   |
|   • Synchronized Open-Meteo hourly weather observations                 |
|   • Output: data/processed/feature_table.parquet / .json (468 Assets)   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|             DETERMINISTIC MULTI-CRITERIA RISK ENGINE                    |
|                        (P-CHMVM v2.4 Engine)                            |
|                                                                         |
|   Composite Risk = 0.35 * Hazard + 0.25 * Vulnerability                 |
|                  + 0.25 * Exposure + 0.15 * Criticality                 |
|   Provenance: DERIVED_ANALYSIS • Confidence: null                       |
|   Output: data/processed/risk_estimates.json (CRITICAL: 62, HIGH: 148)  |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                 PYTHON PREDICTION API MICROSERVICE                      |
|                     (ml/prediction_server.py :5050)                     |
|                                                                         |
|   • GET  /api/assets   -> Returns 468 assets with real features & scores|
|   • POST /api/predict  -> Real-time inference on custom scenario params |
|   • GET  /api/provenance -> Machine-readable dataset lineage            |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                   REACT FRONTEND DECISION INTERFACE                     |
|                              (Port 3000)                                |
|                                                                         |
|   • Interactive Geospatial Command Centre (Leaflet GIS)                 |
|   • Lifeline Criticality vs Risk Matrix (Impact vs Vulnerability)       |
|   • Dynamic Evacuation Routing & Shelter Redirection                    |
|   • Gemini AI Structured SITREP Synthesis & OASIS CAP v1.2 Alerts       |
|   • Methodology & Data Transparency View (Real vs Sample Proof)         |
+-------------------------------------------------------------------------+
```

---

## 2. Core Service Modules

1. **Prediction Service (`src/services/predictionService.ts`)**:
   - Queries the Python Flask microservice on `http://127.0.0.1:5050/api/predict` and `/api/assets`.
   - Manages graceful offline fallbacks with verified local real-data bundles (`kakinada_real_risk_estimates.json`).
   - Strictly enforces the standard prediction contract (`confidence: null`, `prediction_type: "DERIVED_ANALYSIS"`, `data_quality: "REAL"`).

2. **Feature Engineering Pipeline (`src/services/featureEngineering.ts`)**:
   - Transforms raw hazard inputs into normalized 10-feature vectors with field-level provenance attributions.

3. **Multi-Hazard Risk Engine (`src/services/mlRiskModel.ts`)**:
   - Implements the P-CHMVM v2.4 multi-criteria formulation ($0.35H + 0.25V + 0.25E + 0.15C$).
   - Computes granular component breakdowns (`hazard_score`, `vulnerability_score`, `exposure_score`, `criticality_score`).

4. **Scenario Simulation Service (`src/services/scenarioSimulationService.ts`)**:
   - Executes dynamic "what-if" impact adjustments for user-selected storm track shifts and intensity variations.
   - Automatically marks simulated outputs as `SIMULATION / DEMO`.

5. **AI Synthesis & CAP v1.2 Service (`src/services/geminiService.ts`)**:
   - Formulates structured prompts for Google Gemini AI using factual real feature vectors.
   - Constrained against inventing numerical observations; drafts dual-language (English/Hindi) operational SITREPs.

---

## 3. Security & Privacy Considerations

- **No Hardcoded Credentials**: API tokens (`VITE_GEMINI_API_KEY`, etc.) are configured via `.env` variables and excluded from version control.
- **Client-Side Operational Readiness**: The system runs complete local simulations offline without mandatory external dependencies, ensuring functionality during telecommunication outages.
- **Data Privacy**: No Personally Identifiable Information (PII) is stored or transmitted. Infrastructure geometries reflect public OpenStreetMap open-access records.
