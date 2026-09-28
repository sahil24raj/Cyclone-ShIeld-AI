# CycloneShield AI — Data Provenance & Metric Lineage

This document provides a line-by-line lineage of every metric, score, and card rendered across the CycloneShield AI platform.

---

## 1. Metric-by-Metric Lineage Table

| Metric / Card in UI | Exact Value Source | Dataset & Path | Processing / Equation Applied | Data Mode |
| :--- | :--- | :--- | :--- | :--- |
| **Cyclone Wind Speed** | Maximum sustained wind ($V_{\text{max}}$) | `data/raw/cyclone/IBTrACS.NI.v04r01.nc` | NetCDF extraction, converted from knots to km/h ($1\text{ kt} = 1.852\text{ km/h}$) | `REAL (OBSERVATION)` |
| **Minimum Pressure** | Central barometric pressure ($P_{\text{min}}$) | `data/raw/cyclone/IBTrACS.NI.v04r01.nc` | Direct observation at storm eye (hPa) | `REAL (OBSERVATION)` |
| **Local Weather & Gusts** | Station meteorological observations | `data/raw/weather/katinda_openmetro.csv` | Extracted hourly observations at Kakinada station (`16.98°N, 82.23°E`) | `REAL (OBSERVATION)` |
| **24h / 72h Rainfall** | Satellite precipitation accumulation | `data/raw/rainfall/imerg/NASA_GPM_IMERG_Precipitation_2024.tif` | Spatial raster clipping over Kakinada bounding box (`81.75°E–82.75°E, 16.50°N–17.50°N`) | `REAL (OBSERVATION)` |
| **Surface Water Occurrence** | Long-term water presence frequency (%) | `data/raw/surface_water/JRC_occurrence_80E_20N_v1_5_2024.tif` | 30-meter raster pixel lookup at asset `[lat, lon]` | `REAL (OBSERVATION)` |
| **Asset Location & Type** | GeoJSON points & polygons | `data/raw/infrastructure/*.geojson` | OpenStreetMap coordinate extraction & deduplication (468 assets) | `REAL (OBSERVATION)` |
| **Distance to Coast** | Kilometers to shoreline | OSM Coastline Vector | Great-circle Haversine formula from asset `[lat, lon]` to coast line | `DERIVED_ANALYSIS` |
| **Risk Score (0–100)** | Multi-criteria risk index | `ml/build_real_pipeline.py` | Composite formula: $0.35H + 0.25V + 0.25E + 0.15C$ | `DERIVED_ANALYSIS` |
| **Risk Class** | Triage classification | `ml/build_real_pipeline.py` | $\ge 75 \rightarrow \text{CRITICAL}$, $60–74 \rightarrow \text{HIGH}$, $40–59 \rightarrow \text{MEDIUM}$, $< 40 \rightarrow \text{LOW}$ | `DERIVED_ANALYSIS` |
| **Confidence Metric** | Statistical prediction certainty | `ml/prediction_server.py` | **Set to `null`** (Supervised structural tags unavailable; no fabricated 95% confidence) | `NOT_APPLICABLE` |

---

## 2. Real-Time Provenance Tracking in API Responses

Every prediction JSON returned by the Python backend (`http://127.0.0.1:5050/api/predict` and `/api/assets`) includes the full provenance manifest:

```json
"provenance": [
  { "field": "cyclone_wind", "source": "NOAA IBTrACS v04r01", "is_real": true },
  { "field": "station_weather", "source": "Open-Meteo Kakinada (16.98N, 82.23E)", "is_real": true },
  { "field": "surface_water", "source": "JRC Occurrence Raster Tile 80E_20N", "is_real": true },
  { "field": "precipitation", "source": "NASA GPM IMERG Final V07", "is_real": true },
  { "field": "asset_geometry", "source": "OpenStreetMap", "is_real": true }
]
```
