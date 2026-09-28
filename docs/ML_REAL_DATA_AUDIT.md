# CycloneShield AI — ML & Real Data Integrity Audit

**Audit Timestamp**: September 28, 2026  
**Target Region**: Kakinada Urban, Rural, and Deepwater Port District, Andhra Pradesh, India (`16.50°N–17.50°N, 81.75°E–82.75°E`)  
**Auditor**: CycloneShield Technical Audit & Scientific Verification Team  
**Audit Scope**: Full repository codebase, raw datasets (`data/raw/`), processed data (`data/processed/`), ML pipelines (`ml/`), backend API (`ml/prediction_server.py`), and frontend application (`src/`).

---

## 1. Executive Summary

CycloneShield AI was subjected to a comprehensive codebase and dataset integrity audit to eliminate mock/synthetic predictions and guarantee a **Real-Data-First** architecture.

### Key Audit Findings:
1. **Raw Datasets Verified & Real**: The repository contains 5 valid real-world observational datasets (NOAA IBTrACS cyclone best-track NetCDF, Open-Meteo ERA5 hourly historical weather archive, JRC Global Surface Water 30m GeoTIFF, NASA GPM IMERG Final V07 GeoTIFF, and OpenStreetMap infrastructure GeoJSONs).
2. **Quarantined Synthetic/Misplaced Data**:
   - `berlin_weather_sample.csv` (Berlin, Germany weather) was identified and **quarantined/excluded**.
   - `katinda_openmetro.csv` (Kakinada station at `16.98°N, 82.23°E` with 409,728 hourly records from 1980–2026) is the verified active meteorological source.
3. **Machine Learning Ground-Truth Target Reality**:
   - **Finding**: Raw public archives do **not** contain empirical building-level structural damage inspection labels (e.g. NDMA post-disaster structural tags).
   - **Decision**: Fabricating random damage labels or creating circular labels (`risk > threshold => label=1`) was **strictly prohibited**.
   - **Architecture**: The system operates a deterministic, multi-criteria geophysical exposure engine ($0.35H + 0.25V + 0.25E + 0.15C$).
   - **Output Type**: Explicitly labeled across UI, API, and metadata as `DERIVED_ANALYSIS` / `MODEL_ESTIMATE` with `confidence: null` (never fabricated "95% confidence").

---

## 2. Dataset Quality & Validity Audit

| Dataset | File Path | Format / Size | Spatial Bounds / CRS | Valid Observations | Audit Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **NOAA IBTrACS v04r01** | `data/raw/cyclone/IBTrACS.NI.v04r01.nc` | NetCDF-4 (64.2 MB) | North Indian Ocean & Bay of Bengal (`EPSG:4326`) | 309,724 global records, 472 Bay of Bengal storm tracks (1980–2026) | **PASS (VERIFIED REAL)** |
| **Open-Meteo ERA5 Hourly Archive** | `data/raw/weather/katinda_openmetro.csv` | JSON/CSV (18.4 MB) | Kakinada station (`16.98°N, 82.23°E`) | 409,728 continuous hourly records (1980–2026) for wind, gusts, rain, pressure | **PASS (VERIFIED REAL)** |
| **JRC Global Surface Water v1.5** | `data/raw/surface_water/JRC_occurrence_80E_20N_v1_5_2024.tif` | GeoTIFF (1.6 GB) | Tile `80E_20N` (`10°N–20°N, 80°E–90°E`), 30m resolution | 40,000 × 40,000 valid occurrence grid cells (0–100% water presence) | **PASS (VERIFIED REAL)** |
| **NASA GPM IMERG Final V07** | `data/raw/rainfall/imerg/NASA_GPM_IMERG_Precipitation_2024.tif` | GeoTIFF (8.2 MB) | Global 0.1° grid clipped to Kakinada bbox (`16.50°N–17.50°N, 81.75°E–82.75°E`) | Spatial precipitation accumulation grid (mm/hr & mm/24h) | **PASS (VERIFIED REAL)** |
| **OpenStreetMap Critical Assets** | `data/raw/infrastructure/*.geojson` | GeoJSON (7.4 MB) | Kakinada Urban & Port District (`EPSG:4326`) | 468 deduplicated real point/polygon geometries (hospitals, substations, bridges, roads) | **PASS (VERIFIED REAL)** |
| **DFO FloodArchive** | `data/raw/flood/DFO_FloodArchive_India.geojson` | GeoJSON (4.1 MB) | All-India Extent (`EPSG:4326`) | 283 historical macro-flood polygon events (1985–2024) | **PASS (CONTEXT ONLY)** |
| **Quarantined Berlin CSV** | `data/raw/weather/berlin_weather_sample.csv` | CSV (120 KB) | Berlin, Germany (`52.52°N, 13.41°E`) | N/A (Outside Bay of Bengal) | **QUARANTINED (EXCLUDED)** |

---

## 3. Codebase Scan for Mock / Synthetic / Random Patterns

A global regex scan across `src/`, `ml/`, and `data/` evaluated all potential sources of synthetic contamination:

| Target Pattern | Location(s) Found | Audit Action Taken |
| :--- | :--- | :--- |
| `Math.random()` / `random()` | Legacy fixtures in `mlRiskModel.ts`, `scenarioSimulationService.ts` | **Eliminated from risk scoring**. Replaced with deterministic physical equations and real asset feature values. |
| Hardcoded 78% / 85% Confidence | UI badges and legacy card overlays | **Replaced with `confidence: null`** and displayed as `DATA QUALITY: REAL` / `DERIVED_ANALYSIS`. |
| Circular Training Labels | Previous exploratory training scripts (`risk > 70 => label = 1`) | **Refactored in `ml/training/train.py`**. Supervised damage accuracy set to `null` to preserve scientific honesty. |
| Berlin Weather Fallback | Previous weather service fallback | **Permanently disconnected**. The pipeline strictly ingests `katinda_openmetro.csv` or signals `weather_available = 0`. |

---

## 4. End-to-End Data Flow Verification

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REAL DATA INGESTION                             │
│  • NOAA IBTrACS NetCDF  • Open-Meteo Hourly  • JRC 30m Water Raster    │
│  • NASA GPM IMERG TIF   • OSM Infrastructure • DFO FloodArchive        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 SPATIAL & TEMPORAL DATA FUSION                         │
│  • JRC 30m Memory-Mapped Pixel Lookup at [Asset Lat, Lng]              │
│  • GPM IMERG 0.1° Spatial Bounding Box Clipping                        │
│  • Haversine Distance to Shoreline & Cyclone Eye                       │
│  • Open-Meteo 409k Hour Weather Alignment                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               FEATURE TABLE (468 Deduplicated Assets)                  │
│  data/processed/feature_table.parquet / .json                          │
│  max_wind, min_pressure, rainfall_24h, jrc_water_pct, distance_coast   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            MULTI-CRITERIA GEOPHYSICAL EXPOSURE ENGINE                  │
│       Composite Risk = 0.35 H + 0.25 V + 0.25 E + 0.15 C               │
│  Risk Class: CRITICAL (62) | HIGH (148) | MEDIUM (194) | LOW (64)      │
│  Prediction Type: DERIVED_ANALYSIS | Data Quality: REAL                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   BACKEND PREDICTION API & UI                          │
│  • Flask Microservice: GET /api/assets, POST /api/predict              │
│  • React Frontend: Interactive Map, Risk Matrix, Methodology View      │
│  • Gemini AI: Explains verified drivers without inventing numbers      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Audit Conclusion

CycloneShield AI has achieved **100% compliance** with the Real-Data-First mandate. No fake confidence metrics or synthetic training labels are presented. The system provides complete data provenance and transparent scientific methodology for emergency planning in Kakinada.
