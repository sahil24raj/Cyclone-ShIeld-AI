# CycloneShield AI — Comprehensive Data Quality & Validation Report

**Validation Execution Date:** 2026-09-28  
**Target Focus Geography:** Kakinada / Coastal Andhra Pradesh, Bay of Bengal (`16.50°N – 17.50°N`, `81.75°E – 82.75°E`)  
**Pipeline Mode:** `REAL_DATA_FIRST`  
**Supervised ML Label Audit Result:** **NO VALID INFRASTRUCTURE-FAILURE LABELS EXIST IN RAW DATA.** System strictly operates in **DERIVED RISK / EXPOSURE ESTIMATE** mode (`DERIVED_ANALYSIS`). Circular synthetic label generation is strictly prohibited.

---

## 1. Executive Summary & Inventory

| Dataset | Source Agency | File Path | Format | Size | Validated CRS | Spatial Coverage | Temporal Range | Status | Pipeline Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NOAA IBTrACS v04r01** | NOAA NCEI / WMO | `data/raw/cyclone/ibtracs.since1980.list.v04r01.csv` | CSV | 137.4 MB | EPSG:4326 | Global (309,724 records) / Bay of Bengal (472 storms) | 1980 – 2026 | **VALID** | Real cyclone track, wind, pressure, storm speed, distance to land |
| **DFO FloodArchive** | Dartmouth Flood Observatory | `data/raw/flood/FloodArchive.xlsx` | XLSX | 0.48 MB | EPSG:4326 | Global (5,130 events) / India (283 events) | 1985 – 2021 | **VALID (CONTEXT ONLY)** | Macro flood event context & severity. **NOT failure labels** |
| **JRC Global Surface Water v1.5** | European Commission JRC | `data/raw/surface_water/JRC_occurrence_80E_20N_v1_5_2024.tif` | GeoTIFF | 21.03 MB | EPSG:4326 | Tile `80E_20N` (40,000 x 40,000 px, ~30m res) | 1984 – 2024 | **VALID** | High-resolution historical surface water occurrence (0–100%) |
| **OSM Hospitals** | OpenStreetMap / HOT | `data/raw/infrastructure/hospitals/hospitals.geojson` | GeoJSON | 0.05 MB | EPSG:4326 | Kakinada District (94 real healthcare assets) | Static GeoJSON | **VALID** | Real healthcare infrastructure points |
| **OSM Power Sub-stations** | OpenStreetMap / HOT | `data/raw/infrastructure/power/power_assets.geojson` | GeoJSON | 0.01 MB | EPSG:4326 | Kakinada District (5 electrical substations) | Static GeoJSON | **VALID** | Real electrical grid infrastructure points |
| **OSM Bridges** | OpenStreetMap / HOT | `data/raw/infrastructure/bridges/bridges.geojson` | GeoJSON | 0.12 MB | EPSG:4326 | Kakinada District (244 bridges & culverts) | Static GeoJSON | **VALID** | Real transport bridge infrastructure points |
| **OSM Road Segments** | OpenStreetMap / HOT | `data/raw/infrastructure/roads/roads_1.geojson`, `roads_2.geojson` | GeoJSON | 0.14 MB | EPSG:4326 | Kakinada District (167 deduplicated road points) | Static GeoJSON | **VALID** | Real road connectivity points |
| **NASA GPM IMERG Final V07** | NASA GSFC / Giovanni | `data/raw/rainfall/imerg/GIOVANNI-g4.timeAvgMap.GPM_3IMERGDF_07_precipitation...tif` | GeoTIFF | 24.73 MB | EPSG:4326 | Global 0.1° x 0.1° grid (1800 x 3600 px) | 2024-01-01 to 2024-01-04 | **VALID (CLIPPED)** | Satellite precipitation observation grid |
| **Open-Meteo Kakinada Weather** | Open-Meteo ERA5 / Archive | `data/raw/weather/katinda_openmetro.csv` | JSON/CSV | 25.15 MB | EPSG:4326 | Kakinada Station (`16.977°N, 82.234°E`) | 1980-01-01 to 2026-09-27 | **VALID** | 409,728 hourly real weather observations |
| **Berlin Weather CSV** | Open-Meteo | `data/quarantine/WRONG_LOCATION_Berlin_open-meteo.csv` | CSV | 11.4 KB | EPSG:4326 | Berlin, Germany (`52.52°N, 13.42°E`) | 2024 | **QUARANTINED** | Strictly excluded (wrong geography) |
| **Incomplete IMERG Download** | NASA Giovanni | `data/quarantine/INCOMPLETE_IMERG_download.crdownload` | Partial | 172.8 MB | N/A | Corrupted / Incomplete stream | N/A | **QUARANTINED** | Strictly excluded (partial download) |

---

## 2. Dataset-by-Dataset Technical Audit

### 2.1 NOAA IBTrACS v04r01 (Cyclone Best-Track)
- **File:** `data/raw/cyclone/ibtracs.since1980.list.v04r01.csv`
- **Schema & Columns:** 174 columns including `SID`, `SEASON`, `BASIN`, `SUBBASIN`, `NAME`, `ISO_TIME`, `LAT`, `LON`, `WMO_WIND`, `WMO_PRES`, `USA_WIND`, `USA_PRES`, `DIST2LAND`, `STORM_SPEED`, `STORM_DIR`.
- **Units:**
  - `LAT`, `LON`: Decimal degrees (WGS84).
  - `WMO_WIND` / `USA_WIND`: Knots (converted to km/h via $\times 1.852$).
  - `WMO_PRES` / `USA_PRES`: hPa / millibars.
  - `DIST2LAND`: Kilometers.
  - `STORM_SPEED`: Knots.
  - `STORM_DIR`: Compass degrees (0–360°).
- **Subsetting & Filtration:** 472 tropical cyclones identified in the North Indian Ocean / Bay of Bengal basin (`LAT 0.7°–31.0°N`, `LON 41.8°–100.0°E`). 18 severe storm tracks passed within direct proximity of Kakinada (e.g., FANI, PHETHAI, TITLI, HUDHUD, LAILA, HELEN, LEHAR).
- **Missing Value Handling:** `USA_WIND` missing rate is 27.0% (interpolated with `WMO_WIND` where available; flagged with `wind_observed_flag`).
- **Real Observation Check:** **CONFIRMED REAL DATA.**

### 2.2 DFO FloodArchive (Historical Large Flood Events)
- **File:** `data/raw/flood/FloodArchive.xlsx`
- **Schema & Columns:** `ID`, `GlideNumber`, `Country`, `OtherCountry`, `long`, `lat`, `Area`, `Began`, `Ended`, `Validation`, `Dead`, `Displaced`, `MainCause`, `Severity`.
- **Geographic Extent:** 283 India events, 36 in Andhra Pradesh / East Coast basin.
- **Audit for Supervised Learning:**
  - Contains flood centroid coordinates and macro casualty numbers.
  - **Does NOT contain individual asset damage records, power grid breakdown logs, or road impassability measurements.**
  - **Conclusion:** Cannot be used as a supervised training target without fabricating labels. It is utilized strictly as macro-event historical flood context.

### 2.3 JRC Global Surface Water v1.5 (Occurrence Raster)
- **File:** `data/raw/surface_water/JRC_occurrence_80E_20N_v1_5_2024.tif`
- **Dimensions:** 40,000 x 40,000 pixels at ~0.00025° (~30 meter) spatial resolution.
- **Bounds:** 80°E to 90°E, 10°N to 20°N. Kakinada (`16.98°N, 82.23°E`) falls within the high-density Godavari delta zone.
- **Value Semantics:** `0` = 0% water occurrence (dry land); `1–100` = permanent/seasonal surface water occurrence percentage; `255` = ocean / nodata background.
- **Real Observation Check:** **CONFIRMED REAL DATA.**

### 2.4 OpenStreetMap Infrastructure Layers (510 Deduplicated Assets)
- **Hospitals:** 94 point features (`data/raw/infrastructure/hospitals/hospitals.geojson`)
- **Power Assets:** 5 electrical substations (`data/raw/infrastructure/power/power_assets.geojson`)
- **Bridges:** 244 bridge/culvert points (`data/raw/infrastructure/bridges/bridges.geojson`)
- **Roads:** 167 deduplicated highway/arterial points (`roads_1.geojson` + `roads_2.geojson`)
- **Spatial Bounding Box:** `16.74°N – 17.01°N`, `82.08°E – 82.27°E`.
- **Real Observation Check:** **CONFIRMED REAL DATA.**

### 2.5 NASA GPM IMERG Final Run V07 Precipitation
- **File:** `data/raw/rainfall/imerg/GIOVANNI-g4.timeAvgMap.GPM_3IMERGDF_07_precipitation...tif`
- **Global Grid:** 1800 x 3600 pixels (0.1° x 0.1° resolution).
- **Clipping Specification:** Programmatically clipped to Kakinada bounding box: `West = 81.75`, `South = 16.50`, `East = 82.75`, `North = 17.50`.
- **Units:** mm/hr mean precipitation rate.
- **Real Observation Check:** **CONFIRMED REAL DATA.**

### 2.6 Open-Meteo Kakinada Weather Archive
- **File:** `data/raw/weather/katinda_openmetro.csv`
- **Coordinates:** `16.977152°N, 82.23394°E`, Elevation: 6.0m ASL.
- **Temporal Depth:** 409,728 hourly records (1980-01-01 to 2026-09-27).
- **Observed Variables:** `temperature_2m` (°C), `precipitation` (mm), `surface_pressure` (hPa), `wind_speed_10m` (km/h), `wind_gusts_10m` (km/h), `wind_direction_10m` (°).
- **Real Observation Check:** **CONFIRMED REAL DATA.**

---

## 3. Supervised Machine Learning Integrity Determination

> [!IMPORTANT]
> **Defensible Supervised Labels Audit: ABSENT**  
> There is no empirical ground-truth dataset in the repository recording whether specific Kakinada hospitals flooded, specific bridges collapsed, or specific power transformers exploded during historical cyclones.
>
> **Enforced Protocol:**
> 1. Supervised ML training on synthetic labels (`random()`, `composite_risk > 75`) is **permanently disabled**.
> 2. The pipeline computes a **Derived Multi-Hazard Spatial Vulnerability Score** directly from real geophysical observations:
>    $$\text{Composite Risk} = 0.35 \times \text{Hazard Exposure} + 0.25 \times \text{Vulnerability} + 0.25 \times \text{Surface Water Exposure} + 0.15 \times \text{Criticality}$$
> 3. All outputs are explicitly tagged as:
>    - `prediction_type`: `DERIVED_ANALYSIS` / `MODEL_ESTIMATE`
>    - `data_quality`: `REAL`
>    - `confidence`: `null` (never fabricated as "95%")

---

## 4. Quarantined Files Record

1. `data/quarantine/WRONG_LOCATION_Berlin_open-meteo.csv` — Retained for audit; excluded due to German coordinates (`52.52°N, 13.42°E`).
2. `data/quarantine/INCOMPLETE_IMERG_download.crdownload` — Retained for audit; excluded due to incomplete browser download stream.
