# CycloneShield AI — Data Sources, Provenance & Dataset Inventory

This document details every raw and processed dataset in the CycloneShield AI platform, its spatial/temporal resolution, license, data type, usage in the pipeline, and operational limitations.

---

## 1. Master Real Dataset Catalog

| Dataset | Provider / Source | Data Type | Spatial Extent & Resolution | Temporal Coverage | Pipeline Usage | Real / Sample | Key Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NOAA IBTrACS v04r01** | NOAA NCEI / WMO RSMC | Best-Track NetCDF (`IBTrACS.NI.v04r01.nc`) | North Indian Ocean & Bay of Bengal (`EPSG:4326`) | 1980–2026 (309,724 track records, 472 storms) | Storm track vectors, max sustained wind ($V_{\text{max}}$), min pressure ($P_{\text{min}}$), storm translation speed | **REAL DATA** | 3-to-6-hour discrete intervals; interpolated along storm track. |
| **Open-Meteo ERA5 Reanalysis** | Open-Meteo / ECMWF ERA5 | JSON-Structured CSV (`katinda_openmetro.csv`) | Kakinada station (`16.98°N, 82.23°E`), Point | 1980–2026 (409,728 continuous hourly records) | Continuous local weather: wind gusts, precipitation, surface pressure, humidity | **REAL DATA** | Point station representation; micro-climatic urban heat island effects smoothed. |
| **JRC Global Surface Water v1.5** | European Commission Joint Research Centre | GeoTIFF Raster (`JRC_occurrence_80E_20N_v1_5_2024.tif`) | Tile `80E_20N` (`10°N–20°N, 80°E–90°E`), 30m resolution (40k × 40k px) | 1984–2024 (40-year multi-temporal satellite archive) | Sampled 30m surface water occurrence percentage at each asset coordinate | **REAL DATA** | Measures historical water presence, not real-time pluvial flash flood hydrographs. |
| **NASA GPM IMERG Final V07** | NASA Goddard Earth Sciences (GES DISC) | GeoTIFF Raster (`NASA_GPM_IMERG_Precipitation_2024.tif`) | Global 0.1° (~10km) grid clipped to Kakinada (`16.50°N–17.50°N, 81.75°E–82.75°E`) | 2024 Cyclone Season (Accumulated & Hourly) | Satellite precipitation accumulation (24h/72h rainfall features) | **REAL DATA** | 0.1° resolution is coarse for localized street-level stormwater drainage modeling. |
| **OpenStreetMap Infrastructure** | OpenStreetMap Contributors / Humanitarian OSM | GeoJSON (`data/raw/infrastructure/*.geojson`) | Kakinada Urban, Rural, & Deepwater Port District | Verified 2024–2026 OSM snapshots | 468 deduplicated real critical assets (hospitals, power substations, bridges, roads) | **REAL DATA** | Attribute completeness varies; secondary asset backup generator metadata inferred. |
| **DFO FloodArchive** | Dartmouth Flood Observatory / Univ. of Colorado | GeoJSON (`DFO_FloodArchive_India.geojson`) | All-India Extent (`EPSG:4326`) | 1985–2024 (283 India flood events) | Regional flood recurrence context and historical event boundary reference | **REAL DATA (CONTEXT)** | Macro-event polygons only; does not contain individual asset structural damage labels. |
| **Berlin Sample Weather (QUARANTINED)** | Open-Meteo Berlin Sample | CSV (`berlin_weather_sample.csv`) | Berlin, Germany (`52.52°N, 13.41°E`) | Quarantined | **EXCLUDED / QUARANTINED** | **REMOVED** | Geographic mismatch (Berlin, Germany). Replaced with Kakinada station data. |

---

## 2. Data Provenance Taxonomy

Every data point in the user interface and API response contains an explicit `dataType` and `provenance` metadata block:

| Provenance Label | Definition | Frontend Treatment |
| :--- | :--- | :--- |
| **`REAL` / `OBSERVATION`** | Measurements directly from ground stations, satellite radiometers, radar, or official best-track archives. | Displayed with real source badge (e.g. `NOAA IBTrACS`, `NASA GPM IMERG`, `JRC 30m`). |
| **`DERIVED_ANALYSIS`** | Deterministic multi-criteria exposure and hazard formulas evaluated on real observational features. | Labeled with transparent equation ($0.35H + 0.25V + 0.25E + 0.15C$). |
| **`MODEL_ESTIMATE`** | Statistical physical simulations (e.g. SLOSH coastal surge propagation, Holland wind profile decay). | Explicitly noted as simulated physical projection with model parameters. |
| **`SAMPLE` / `DEMO`** | Simulated fallback values used only when a specific real sensor stream is unavailable. | High-visibility warning badge (`DEMO / SAMPLE DATA`); never mixed silently with real data. |
| **`UNAVAILABLE`** | Missing or unconfigured data stream. | Displayed as `null` / `Data Unavailable` rather than inventing synthetic numbers. |

---

## 3. Metric-by-Metric Provenance Mapping

### A. Meteorological Observations

| Metric Name | Authoritative Source | Native Units | Transformation / Processing | Provenance Type |
| :--- | :--- | :--- | :--- | :--- |
| **Sustained Wind** | NOAA IBTrACS v04r01 | Knots | Converted to km/h ($1\text{ kt} = 1.852\text{ km/h}$) | `REAL (OBSERVATION)` |
| **Wind Gusts** | Open-Meteo ERA5 Kakinada | km/h | 10-meter peak instantaneous gust extraction | `REAL (OBSERVATION)` |
| **Minimum Central Pressure** | NOAA IBTrACS v04r01 | hPa / mbar | Direct sensor reading at storm center | `REAL (OBSERVATION)` |
| **Precipitation (24h/72h)** | NASA GPM IMERG Final V07 | mm | Spatial raster subset accumulated over 24/72 hours | `REAL (OBSERVATION)` |
| **Surface Water Occurrence** | JRC Global Surface Water v1.5 | % (0–100) | 30m pixel lookup at asset coordinate | `REAL (OBSERVATION)` |
| **Distance to Shoreline** | OpenStreetMap Coastline | km | Haversine distance from asset coordinate to coast | `DERIVED_ANALYSIS` |
| **Storm Surge Height** | Hydrodynamic SLOSH Model | meters | Coastal bathymetry & wind vector hydrodynamic propagation | `MODEL_ESTIMATE` |

---

## 4. Operational Limitations & Scientific Boundary Conditions

1. **No Fabricated Structural Failure Labels**: Open disaster databases record macro-event footprints, not post-disaster engineering building tag assessments. Supervised damage classification metrics are set to `null` to prevent circular validation.
2. **Surface Water Latency**: JRC Global Surface Water measures long-term historical water presence over a 40-year period, establishing chronic flood exposure baselines rather than real-time urban drainage overflow.
3. **Coarse Satellite Precipitation**: NASA GPM IMERG provides 0.1° (~10 km) resolution grid cells. Local convective micro-bursts are augmented by Open-Meteo station time-series.
