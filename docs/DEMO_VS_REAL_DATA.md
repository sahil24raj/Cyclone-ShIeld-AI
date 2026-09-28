# CycloneShield AI — Real vs. Sample Data Policy

This document defines the strict data handling policy governing CycloneShield AI.

---

## 1. Core Principles

1. **REAL DATA IS THE SOLE PRIMARY SOURCE**: Real observations from NOAA IBTrACS, Open-Meteo, JRC Global Surface Water, NASA GPM IMERG, and OpenStreetMap are used across all computations.
2. **NO SILENT FABRICATION**: If a specific measurement is missing or unconfigured, it is marked as `UNAVAILABLE` or `null`. It is **never** replaced with an unflagged synthetic number.
3. **ISOLATED SAMPLE FALLBACK**: Sample or simulation parameters are strictly confined to interactive scenario test toggles and are visually labeled as `SAMPLE / DEMO`.

---

## 2. Data State Categorization

| Data State | System Handling | UI Representation | Machine-Readable Field |
| :--- | :--- | :--- | :--- |
| **`REAL`** | Extracted directly from validated NetCDF, GeoTIFF, CSV, or GeoJSON raw files. | Green badge: `REAL DATA` / Source attribution | `"is_real": true, "data_quality": "REAL"` |
| **`PARTIAL_REAL`** | Key observational streams (e.g. cyclone wind + JRC water) are real, but an auxiliary feature is unavailable. | Amber badge: `PARTIAL REAL DATA` | `"is_real": true, "data_quality": "PARTIAL_REAL"` |
| **`DEMO` / `SAMPLE`** | Used only during interactive hypothetical scenario simulation (e.g. user slides cyclone wind to 220 km/h). | High-visibility warning: `SIMULATION / DEMO` | `"is_real": false, "data_quality": "DEMO"` |
| **`UNAVAILABLE`** | Ground station offline or unmonitored. | `null` / `Data Unavailable` | `"value": null, "source_type": "UNAVAILABLE"` |

---

## 3. Sample vs. Real Data Comparison Table

| Pipeline Component | Real Implementation | Sample / Demo Treatment |
| :--- | :--- | :--- |
| **Cyclone Dynamics** | NOAA IBTrACS historical tracks (`data/raw/cyclone/`) | Scenario Simulator slider inputs (clearly marked as `SIMULATION`) |
| **Precipitation** | NASA GPM IMERG Final V07 + Open-Meteo hourly rain | Simulated rainfall multiplier in scenario testing |
| **Surface Water Exposure** | 30m JRC Global Surface Water raster tile `80E_20N` | None (Real 30m raster sampled for all 468 assets) |
| **Critical Infrastructure** | 468 verified OpenStreetMap points/polygons | None (100% verified real OSM geometries) |
| **Model Confidence** | Set to `null` (No fake confidence numbers) | Never populated with arbitrary "95% confidence" |
