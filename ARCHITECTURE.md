# Cyclone Shield AI — Production Architecture Specification

## 1. High-Level Architecture Overview

Cyclone Shield AI / Cyclone-X is designed as a disaster intelligence decision-support platform with a clear separation of data ingestion, validation, deterministic risk computation, ML prediction, and presentation layers.

```
+-------------------------------------------------------------------------+
|                         EXTERNAL DATA SOURCES                           |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | WMO / Open-Meteo   |  | IMD / JTWC Feeds   |  | Survey of India / |  |
|  | Live Weather APIs  |  | Bulletins & Tracks |  | SDMA GIS GeoJSON  |  |
|  +--------------------+  +--------------------+  +-------------------+  |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                  INGESTION & SERVICE LAYER (src/services)               |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   | WeatherService (weatherService.ts)                              |   |
|   | - Ingests WMO Open-Meteo REST API                               |   |
|   | - Normalizes to standardized WeatherObservation interface       |   |
|   | - Tracks source metadata, observation timestamps & units        |   |
|   +-----------------------------------------------------------------+   |
|   | CycloneService (cycloneService.ts)                              |   |
|   | - Ingests IMD / JTWC tropical cyclone bulletins & track feeds   |   |
|   | - Distinguishes OBSERVATION vs OFFICIAL_FORECAST track points   |   |
|   | - Enforces category mapping according to WMO/IMD scale          |   |
|   +-----------------------------------------------------------------+   |
|   | InfrastructureService (infrastructureService.ts)                |   |
|   | - Ingests GeoJSON polygons for wards, assets, shelters, routes  |   |
|   | - Gracefully handles missing/unconfigured geospatial layers     |   |
|   +-----------------------------------------------------------------+   |
|   | HistoricalService (historicalService.ts)                        |   |
|   | - Provides authoritative IBTrACS post-event verified datasets   |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
                                    |
         +--------------------------+-------------------------+
         |                                                    |
         v                                                    v
+------------------------------------+  +------------------------------------+
| DETERMINISTIC RISK ENGINE          |  | ML PREDICTION SERVICE              |
| (src/services/riskEngine.ts)       |  | (src/services/predictionService.ts)|
|                                    |  |                                    |
| Method: Multi-Criteria Spatial Math|  | Status: Contract Defined           |
| Score: 0.35H + 0.25E + 0.25V +     |  | When Unconnected:                  |
|        0.15C                       |  |   `predictionAvailable: false`     |
| Provenance: DERIVED_ANALYSIS       |  |   UI shows "AI model not connected"|
| Explainable Driver Attribution     |  | When Connected:                    |
| Graph Shelter Route Optimizer      |  |   Consumes real feature vector     |
+------------------------------------+  +------------------------------------+
         |                                                    |
         +--------------------------+-------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                       APPLICATION STATE MANAGEMENT                      |
|                     (src/context/AppStateContext.tsx)                   |
|                                                                         |
| - Manages live data sources status (SystemDataSources)                  |
| - Controls reactive refresh cycle & simulation modulation               |
| - Exposes activeCyclone, weather, prediction, villages, shelters        |
| - Controls modal states (System Status Inspector, Layer Toggles)        |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                            PRESENTATION LAYER                           |
|                                                                         |
|  +---------------------+  +---------------------+  +-----------------+  |
|  | TopHeader           |  | Command Center      |  | Interactive GIS |  |
|  | - System Status dot |  | - SummaryCards      |  |   Leaflet Map   |  |
|  | - Real storm info   |  | - Risk Ward Table   |  | - Live tracks   |  |
|  | - Dev fixture badge |  | - Derived Analytics |  | - Ward polygons |  |
|  +---------------------+  +---------------------+  +-----------------+  |
|  | Evacuation View     |  | Historical Analysis |  | Alert Centre    |  |
|  | - Graph optimizer   |  | - IBTrACS verified  |  | - Standard CAP  |  |
|  | - Transit corridors |  |   storm archive     |  |   draft payload |  |
|  +---------------------+  +---------------------+  +-----------------+  |
+-------------------------------------------------------------------------+
```

---

## 2. Security & Secret Management

1. **No Secret Keys in Client-Side JavaScript**:
   - The frontend communicates directly with unauthenticated public endpoints (like Open-Meteo) or with an authenticated private backend proxy.
   - Private third-party API keys (e.g. Tomorrow.io, custom spatial APIs) must be maintained on a server-side proxy.
2. **Environment Variable Gating**:
   - Variables are injected at build/runtime via standard `import.meta.env.VITE_*` definitions.
   - Synthetic development samples in `src/fixtures/` are strictly gated behind `VITE_ENABLE_DEV_FIXTURES=true`. When set to `false`, the platform enforces zero fake data and displays clean unconfigured states.

---

## 3. Data Flow & Provenance Lifecycle

1. **Initial Load**:
   - `AppStateContext` initializes services simultaneously.
   - `weatherService.getLiveWeather()` fetches live meteorological data for the coastal coordinate $(20.48^\circ\text{N}, 86.85^\circ\text{E})$.
   - `cycloneService.getActiveCyclone()` checks for live active cyclone feeds.
   - `predictionService.getPrediction()` checks if an ML backend URL is configured; if missing, returns `predictionAvailable: false`.
2. **Deterministic Risk Computation**:
   - `DeterministicRiskEngine` computes the composite score using current meteorological parameters (wind, surge, precipitation) and ward exposure characteristics.
   - Every risk output is stamped with `dataType: 'DERIVED_ANALYSIS'`.
3. **User Inspection**:
   - Operators can click the **System Status** button in the TopHeader at any time to inspect the health, URL endpoint, response latency, and record count of all 6 platform subsystems.
