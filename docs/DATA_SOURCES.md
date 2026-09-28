# CycloneShield AI — Data Sources & Master Catalog

This document details every raw and processed dataset utilized by CycloneShield AI, including provider attribution, licensing, spatial/temporal scope, transformation methods, pipeline utilization, and known limitations.

---

## 1. Master Dataset Inventory

| Dataset | Provider / Agency | Format / File Path | Spatial Scope & Resolution | Temporal Coverage | Ingested Features & Metrics | Data Status | Key Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NOAA IBTrACS v04r01** | NOAA NCEI / WMO RSMC | NetCDF-4 (`data/raw/cyclone/IBTrACS.NI.v04r01.nc`) | North Indian Ocean & Bay of Bengal (`EPSG:4326`) | 1980–2026 (309,724 track records, 472 storms) | `wmo_wind` (max sustained wind in km/h), `wmo_pres` (minimum central pressure in hPa), storm translation velocity, track coordinates | **REAL DATA (VERIFIED)** | 3-to-6-hour discrete intervals; interpolated along storm track. |
| **Open-Meteo ERA5 Reanalysis** | Open-Meteo / ECMWF | JSON-Structured CSV (`data/raw/weather/katinda_openmetro.csv`) | Kakinada Station (`16.98°N, 82.23°E`), Point | 1980–2026 (409,728 continuous hourly records) | Continuous local weather: surface wind gusts (10m), precipitation accumulation (mm/h), surface barometric pressure, relative humidity | **REAL DATA (VERIFIED)** | Point station representation; localized micro-climatic urban street canyon effects smoothed. |
| **JRC Global Surface Water v1.5** | European Commission Joint Research Centre | GeoTIFF Raster (`data/raw/surface_water/JRC_occurrence_80E_20N_v1_5_2024.tif`) | Tile `80E_20N` (`10°N–20°N, 80°E–90°E`), 30m resolution (40,000 × 40,000 px) | 1984–2024 (40-year multi-temporal satellite archive) | Sampled 30m historical surface water occurrence frequency ($0–100\%$) directly at each asset coordinate | **REAL DATA (VERIFIED)** | Measures long-term historical water presence rather than real-time pluvial flash flood hydrographs. |
| **NASA GPM IMERG Final V07** | NASA Goddard Earth Sciences (GES DISC) | GeoTIFF Raster (`data/raw/rainfall/imerg/NASA_GPM_IMERG_Precipitation_2024.tif`) | Global 0.1° (~10km) grid clipped to Kakinada (`16.50°N–17.50°N, 81.75°E–82.75°E`) | 2024 Cyclone Season (Accumulated & Hourly) | Satellite precipitation accumulation (24h/72h rainfall features in mm) | **REAL DATA (VERIFIED)** | 0.1° spatial resolution is coarse for localized street-level stormwater drainage modeling. |
| **OpenStreetMap Infrastructure** | OpenStreetMap Contributors / HOT Export | GeoJSON (`data/raw/infrastructure/*.geojson`) | Kakinada Urban, Rural, & Deepwater Port District | Verified 2024–2026 OSM snapshots | 468 deduplicated critical assets (94 hospitals, 5 power substations, 244 bridges, 167 primary roads) | **REAL DATA (VERIFIED)** | Attribute completeness varies across municipal boundary; secondary backup power metadata inferred. |
| **DFO Global FloodArchive** | Dartmouth Flood Observatory / Univ. of Colorado | GeoJSON (`data/raw/flood/DFO_FloodArchive_India.geojson`) | All-India Extent (`EPSG:4326`) | 1985–2024 (283 India flood events) | Regional flood recurrence context and historical event boundary reference | **REAL DATA (CONTEXT)** | Macro-event polygons only; does not contain individual asset structural damage labels. |
| **Quarantined Berlin Sample** | Open-Meteo Sample | CSV (`data/quarantine/berlin_weather_sample.csv`) | Berlin, Germany (`52.52°N, 13.41°E`) | N/A | Excluded meteorological feed | **EXCLUDED / QUARANTINED** | Geographic mismatch (Berlin, Germany). Replaced with Kakinada station data. |

---

## 2. Data Provenance Taxonomy

Every data point rendered in the application or returned by the prediction API carries an explicit `DataType` tag:

| Provenance Tag | Definition | Operational Handling | UI Representation |
| :--- | :--- | :--- | :--- |
| **`REAL` / `OBSERVATION`** | Measurements directly from ground stations, satellite radiometers, radar, or official best-track archives. | Ingested via validated NetCDF, GeoTIFF, or CSV parsers without modification. | Displayed with real source badge (e.g. `NOAA IBTrACS`, `NASA GPM IMERG`, `JRC 30m`). |
| **`DERIVED_ANALYSIS`** | Deterministic multi-criteria exposure and hazard formulas evaluated on real observational features. | Computed via the transparent P-CHMVM v2.4 physical equation ($0.35H + 0.25V + 0.25E + 0.15C$). | Labeled with transparent equation and component breakdown. |
| **`MODEL_ESTIMATE`** | Statistical physical simulations (e.g. SLOSH coastal surge propagation, Holland wind profile radial decay). | Derived using established hydrodynamic and atmospheric wind-decay formulations. | Explicitly noted as simulated physical projection with model parameters. |
| **`SAMPLE` / `DEMO`** | Simulated fallback values used only when a specific real sensor stream is unavailable or in hypothetical scenario testing. | Isolated from production feeds; user is alerted via high-visibility banners. | High-visibility warning badge (`DEMO / SAMPLE DATA`); never mixed silently with real data. |
| **`UNAVAILABLE`** | Missing or unconfigured data stream. | Set to `null` or `0` availability flag rather than fabricating synthetic values. | Displayed as `null` / `Data Unavailable`. |

---

## 3. Data Processing & Coordinate System Standards

- **Spatial Coordinate Reference System (CRS)**: All geospatial vector layers (OpenStreetMap points, coastline boundaries, flood polygons) and raster products are transformed to standard **WGS84 (`EPSG:4326`)**.
- **Raster Sampling**: High-resolution 30m JRC raster sampling is performed using memory-mapped spatial indexing to extract exact water presence percentages without RAM overhead.
- **Bounding Box Clipping**: NASA GPM IMERG global files are programmatically clipped to the Kakinada regional extent:
  - **West**: $81.75^\circ\text{E}$
  - **South**: $16.50^\circ\text{N}$
  - **East**: $82.75^\circ\text{E}$
  - **North**: $17.50^\circ\text{N}$

---

## 4. Scientific Ground-Truth Integrity Notice

> [!IMPORTANT]
> **No Fabricated Structural Damage Labels**:
> A thorough audit of public disaster databases confirmed that while real meteorological, hydrodynamic, and spatial exposure observations exist in high volume, **empirical building-level structural damage inspection logs (e.g. post-disaster structural tags) do not exist in open archives**.
> 
> CycloneShield AI strictly prohibits the fabrication of synthetic labels (e.g. `random()` or `risk > 70 => label = 1`). Doing so would create circular validation. Supervised classification accuracy is reported as `null`, and the system operates on peer-reviewed deterministic multi-criteria physical exposure modeling.
