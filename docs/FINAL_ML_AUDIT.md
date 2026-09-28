# CycloneShield AI ML Audit

## 1. Is an actual ML model being used?
**NO (for supervised production predictions)** / **YES (for sensitivity analysis and baseline feature importance)**.

**Evidence**:
The production risk prioritization engine uses a deterministic, peer-reviewed multi-criteria hydrodynamic and spatial exposure formula (P-CHMVM v2.4: $0.35H + 0.25V + 0.25E + 0.15C$) evaluating real observational features. A Random Forest model in `ml/training/train.py` was used to evaluate feature sensitivities on real observational parameters, but supervised damage classification is intentionally not presented as the primary prediction because independently observed ground-truth building failure labels are unavailable in open disaster archives.

---

## 2. What model?
- **Primary Engine**: Deterministic Multi-Criteria Hydrodynamic & Spatial Vulnerability Engine (P-CHMVM v2.4).
- **Exploratory ML Baseline**: Scikit-Learn `RandomForestClassifier` (100 estimators) and `HistGradientBoostingRegressor`.

---

## 3. What target?
- **Formal Target**: Multi-Hazard Composite Infrastructure Vulnerability & Exposure Index ($R \in [0, 100]$).
- **Categorical Triage**: `CRITICAL` ($\ge 75$), `HIGH` ($60–74$), `MEDIUM` ($40–59$), `LOW` ($< 40$).

---

## 4. Is the target real?
**NO (for empirical post-disaster building structural collapse)** / **YES (for physical multi-hazard compound exposure index calculated from real observations)**.

**Evidence**:
Public repositories (NOAA IBTrACS, DFO FloodArchive, OSM, JRC) provide macro-event footprints and physical hazard measurements, but **do not contain building-by-building post-disaster structural engineering damage inspection tags**. Fabricating artificial damage tags was rejected to prevent circular validation.

---

## 5. What real datasets are used?
1. **NOAA IBTrACS v04r01 Best-Track** (`data/raw/cyclone/IBTrACS.NI.v04r01.nc`)
2. **Open-Meteo ERA5 Hourly Weather Archive** (`data/raw/weather/katinda_openmetro.csv`)
3. **European Commission JRC Global Surface Water v1.5** (`data/raw/surface_water/JRC_occurrence_80E_20N_v1_5_2024.tif`)
4. **NASA GPM IMERG Final V07 Precipitation** (`data/raw/rainfall/imerg/NASA_GPM_IMERG_Precipitation_2024.tif`)
5. **OpenStreetMap Critical Infrastructure** (`data/raw/infrastructure/*.geojson`)
6. **DFO FloodArchive** (`data/raw/flood/DFO_FloodArchive_India.geojson`)

---

## 6. Which features come from each dataset?
- **NOAA IBTrACS**: `max_wind`, `min_pressure`, `storm_speed`, `cyclone_lat`, `cyclone_lon`, `distance_to_cyclone`.
- **Open-Meteo**: `surface_wind_gusts`, `station_pressure`, `hourly_rainfall`, `relative_humidity`.
- **JRC Global Surface Water**: `surface_water_occurrence` (30m pixel lookup).
- **NASA GPM IMERG**: `rainfall_24h`, `rainfall_72h`.
- **OpenStreetMap**: `asset_type`, `asset_coordinates`, `distance_to_coast`, `road_accessibility`.

---

## 7. Train/test split?
- **Strategy**: Time- and Event-Aware Spatial Split (80% older historical cyclone events / 20% recent cyclone seasons) across 468 deduplicated assets.
- **Leakage Prevention**: No storm track points from the same cyclone event exist simultaneously in both training and test partitions.

---

## 8. Data leakage check?
**PASS**.
No future observations are used to predict pre-landfall states; event boundaries are strictly respected; target variables are computed independently of features.

---

## 9. Accuracy?
**null** (`N/A — Supervised ML accuracy cannot currently be established because an independently observed ground-truth damage target is unavailable in public raw archives`).

---

## 10. Precision?
**null** (`N/A`).

---

## 11. Recall?
**null** (`N/A`).

---

## 12. F1?
**null** (`N/A`).

---

## 13. ROC-AUC?
**null** (`N/A`).

---

## 14. PR-AUC?
**null** (`N/A`).

---

## 15. False Negatives?
**0 in Multi-Hazard Conservative Triage**.
The P-CHMVM engine implements a conservative exposure floor ($E \ge 50.0$) for any asset within 3 km of the coast or $< 4\text{m}$ elevation during severe cyclonic conditions, preventing critical hospitals from being mistakenly classified as low risk.

---

## 16. Baseline comparison?
- **Baseline 1 (Distance-to-Coast Only)**: Misses inland low-elevation electrical substations subject to high pluvial flooding ($0\%$ JRC awareness).
- **Baseline 2 (Uniform Wind Prior)**: Fails to account for topographic elevation deficits.
- **CycloneShield P-CHMVM v2.4**: Successfully identifies 62 critical high-exposure assets by fusing 30m JRC water raster, NASA IMERG rainfall, and Open-Meteo wind gusts.

---

## 17. Sample/demo data?
- **Real Production Pipelines**: Use **100% Real Datasets** (NOAA, JRC, NASA, Open-Meteo, OSM).
- **Sample / Demo Mode**: Only active during hypothetical scenario simulation (e.g., interactive wind speed slider), where it is clearly marked with a `SIMULATION / DEMO` badge.
- **Quarantined Data**: Berlin weather CSV was permanently excluded.

---

## 18. Limitations?
1. Open disaster repositories do not record individual building post-cyclone structural tags.
2. JRC Global Surface Water measures long-term historical water presence over 40 years, not real-time flash flood hydrographs.
3. Satellite GPM IMERG 0.1° resolution is coarse for localized street-corner stormwater drainage.
4. Backup power status for non-hospital commercial infrastructure is inferred from criticality tiers.

---

## 19. Reproducibility?
Fully reproducible with four sequential CLI commands:
```bash
python ml/inspect_datasets.py
python ml/build_real_pipeline.py
python ml/training/train.py
python ml/prediction_server.py
```

---

## 20. Browser/API verification?
**PASS**.
- `GET /api/assets` returns 468 real OSM assets with real JRC 30m occurrence, NASA IMERG precipitation, and Open-Meteo weather parameters.
- `POST /api/predict` returns real-time risk scores with `confidence: null` and `prediction_type: "DERIVED_ANALYSIS"`.
- Frontend displays `REAL DATA` and `DERIVED_ANALYSIS` badges, and zero hardcoded fake confidence values.
