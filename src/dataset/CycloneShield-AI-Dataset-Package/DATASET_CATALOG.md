# CycloneShield AI — Dataset Catalog & Antigravity Instructions

## Purpose
This package contains the currently collected research datasets for the CycloneShield AI prototype. It is intentionally organized so an AI coding agent can discover provenance, file purpose, spatial coverage, units, and current validity without guessing.

## CRITICAL RULES FOR ANTIGRAVITY
1. **Do not use files in `data/quarantine/` for training or live inference.**
2. The Open-Meteo CSV in quarantine is **Berlin (52.52N, 13.42E)**, not Kakinada. It must not be treated as Kakinada weather.
3. The IMERG `.crdownload` is incomplete. Do not parse it. A numerical IMERG Final Run export is still required.
4. Do not treat screenshots/plots as numerical datasets.
5. Keep `src/fixtures/` demo data separate from `data/raw/` research data.
6. Never fabricate labels. If no defensible target exists, build an exposure/risk pipeline and document the limitation.
7. Preserve provenance, source version, acquisition date, spatial reference, units, and transformations in processed manifests.

## Target geography
Primary prototype focus: Kakinada / coastal Andhra Pradesh region.
Approximate target point: 16.99 N, 82.25 E.
JRC tile: 10–20 N, 80–90 E.
Open-Meteo replacement target: approximately 16.8–17.2 N, 82.0–82.5 E.

## Dataset inventory

| Dataset | Path | Status | Use |
|---|---|---|---|
| NOAA IBTrACS v04r01 | `data/raw/cyclone/ibtracs_since1980.list.v04r01.csv` | VALID | Historical cyclone tracks, intensity, pressure, land-distance and related track metadata |
| DFO Flood Archive | `data/raw/flood/FloodArchive.xlsx` | VALID | Historical large-flood event evidence / labels at event level |
| JRC Global Surface Water v1.5 | `data/raw/surface_water/JRC_occurrence_80E_20N_v1_5_2024.tif` | VALID | Historical surface-water occurrence / water-exposure spatial feature |
| OSM hospitals | `data/raw/infrastructure/hospitals/hospitals.geojson` | VALID | Critical healthcare infrastructure exposure |
| OSM power | `data/raw/infrastructure/power/power_assets.geojson` | VALID | Power infrastructure exposure |
| OSM bridges | `data/raw/infrastructure/bridges/bridges.geojson` | VALID | Transport infrastructure exposure |
| OSM roads part 1 | `data/raw/infrastructure/roads/roads_1.geojson` | VALID | Road network / accessibility exposure |
| OSM roads part 2 | `data/raw/infrastructure/roads/roads_2.geojson` | VALID | Road network / accessibility exposure; deduplicate before merge |
| Open-Meteo Berlin CSV | `data/quarantine/WRONG_LOCATION_Berlin_open-meteo.csv` | INVALID FOR TARGET | Wrong geography; retained only for auditability |
| IMERG incomplete download | `data/quarantine/INCOMPLETE_IMERG_download.crdownload` | INVALID/INCOMPLETE | Not a usable dataset; retained only for auditability |

## File-level details

### 1. NOAA IBTrACS v04r01
- Coverage: since 1980 file; global historical tropical cyclone best-track records.
- Observed file: 309,724 rows x 174 columns when parsed with a two-row header.
- Important fields include `SID`, `SEASON`, `BASIN`, `SUBBASIN`, `NAME`, `ISO_TIME`, `LAT`, `LON`, `WMO_WIND`, `WMO_PRES`, `DIST2LAND`, `LANDFALL`, and agency-specific intensity/pressure fields.
- Typical workflow: filter to North Indian Ocean / Bay of Bengal, spatially subset around target region, then construct event-level and time-window features.
- Do not mix agency estimates without documenting the selected source/priority.

### 2. DFO FloodArchive
- Excel sheet: `FloodArchive`.
- Observed: 5,130 flood events plus header; 14 columns.
- Columns: `ID`, `GlideNumber`, `Country`, `OtherCountry`, `long`, `lat`, `Area`, `Began`, `Ended`, `Validation`, `Dead`, `Displaced`, `MainCause`, `Severity`.
- Use as historical flood-event evidence. It is **not** a direct infrastructure-failure label dataset.
- Event dates should be used for matching against cyclone/weather windows.

### 3. JRC Global Surface Water v1.5
- File: `JRC_occurrence_80E_20N_v1_5_2024.tif`.
- Tile: 80–90 E, 10–20 N.
- Purpose: surface-water occurrence feature for spatial exposure/context.
- Inspect CRS, transform, nodata and raster values before feature extraction; do not assume pixel semantics without reading raster metadata.

### 4. OpenStreetMap infrastructure exports
- Hospitals: 94 features.
- Power: 5 features.
- Bridges: 244 features.
- Roads: 93 + 126 features in two exports; merge and deduplicate by OSM identifier / geometry before analysis.
- These are exposure layers. They do not by themselves provide historical failure labels.

## ML guidance
Recommended initial feature families:
- cyclone: maximum wind, minimum pressure, distance to track/coast, intensification indicators;
- weather/rainfall: precipitation totals over event windows (once valid Kakinada weather + IMERG data are present);
- surface water: local occurrence / water-context features;
- infrastructure: asset type, proximity to hazard, road accessibility, criticality metadata where available.

Use event/time-based train-validation-test splits to reduce temporal leakage. Evaluate recall/F1 and false negatives, not accuracy alone.

If a valid target cannot be constructed from the collected data, **do not invent one**. Build a transparent exposure/risk scoring or unsupervised/weakly supervised pipeline and label it accordingly.

## Data status before training
**Not yet training-ready for the full meteorological feature set.** Two items remain:
1. Replace the Berlin Open-Meteo CSV with the correct Kakinada-area CSV.
2. Download a real numerical NASA GPM IMERG Final Run V07 export (GeoTIFF/NetCDF/HDF), not the screenshot or `.crdownload`.

After those two are complete, proceed to preprocessing, spatial/event alignment, feature engineering, target construction, model training, evaluation, and app integration.
