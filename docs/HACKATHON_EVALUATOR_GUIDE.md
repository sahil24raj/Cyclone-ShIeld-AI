# CycloneShield AI — Hackathon Evaluator & Judge Walkthrough Guide

**Project Title**: CycloneShield AI — Anticipatory Disaster Risk & Infrastructure Vulnerability Intelligence  
**Track**: Disaster Management, Climate Resilience & AI for Social Good  
**Target Coastal Domain**: Kakinada Municipal & Deepwater Port District, Andhra Pradesh, India (`16.50°N–17.50°N, 81.75°E–82.75°E`)  
**Evaluation Time**: 5–10 Minutes

---

## ⚡ Executive Summary (1-Minute Overview)

CycloneShield AI is an AI-powered Emergency Operations Centre (EOC) predictive risk platform designed for coastal disaster-management authorities (NDMA, SDMA, District Collectors). Instead of relying on post-disaster damage assessments or synthetic assumptions, CycloneShield AI **fuses real satellite and meteorological observations with 468 real OpenStreetMap critical infrastructure assets** to prioritize protective action *before* cyclone landfall.

### What Makes CycloneShield AI Technically Rigorous:
1. **Real Data First**: Ingests NOAA IBTrACS (309k historical tracks), Open-Meteo ERA5 (409k hourly records for Kakinada), European Commission JRC 30m Global Surface Water, NASA GPM IMERG Final V07 satellite precipitation, and OpenStreetMap infrastructure.
2. **Scientific Honesty on ML**: Open disaster archives contain macro-event footprints, not building-by-building structural failure tags. We **refused to fabricate fake training labels** (`risk > 70 => label = 1`). Instead, we implement a transparent, peer-reviewed multi-criteria physical exposure model ($0.35H + 0.25V + 0.25E + 0.15C$), labeled with 100% honesty as `DERIVED_ANALYSIS` with `confidence: null`.
3. **End-to-End Decision Support**: Combines live geospatial mapping, multi-criteria lifeline risk matrices, dynamic evacuation route cut-off simulation, and Gemini AI structured emergency briefings (English/Hindi).

---

## 🧭 5-Minute Evaluator Inspection Walkthrough

### Step 1: Data Lineage & Quality Audit
- Open the **Methodology & Data Transparency** tab in the web interface (or inspect [`docs/DATA_SOURCES.md`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/cycloneShield%20AI/docs/DATA_SOURCES.md) and [`data/manifests/data_quality_report.md`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/cycloneShield%20AI/data/manifests/data_quality_report.md)).
- **Observe**: Every dataset is validated for CRS (`EPSG:4326`), spatial bounds, units, and temporal continuity. Misplaced data (such as the Berlin weather sample) was quarantined and permanently excluded.

### Step 2: Interactive Geospatial Map & Real Asset Pins
- Navigate to the **Map / Command Centre** view.
- Click on any critical asset marker (e.g. *Government General Hospital* or *Kakinada Beach Road 220kV Substation*).
- **Observe**: The Asset Detail Panel displays verified real data sources (NOAA IBTrACS, Open-Meteo, JRC 30m, NASA GPM IMERG), real metric breakdowns, and data quality tags (`REAL DATA`). No fake 95% confidence numbers are displayed.

### Step 3: Lifeline Criticality vs Risk Matrix
- Navigate to the **Risk Matrix** tab.
- **Observe**: The 4-quadrant matrix plots all 468 real assets by Structural Vulnerability vs Criticality Tier. 62 critical high-exposure assets are highlighted in the P0 evacuation and reinforcement triage tier.

### Step 4: Evacuation Corridor Routing & Road Cutoffs
- Navigate to the **Evacuation & Shelters** view.
- **Observe**: Dynamic simulation of storm surge overtopping identifies flooded coastal roads, automatically disqualifying submerged shelter routes and recalculating safe elevated transit corridors.

### Step 5: AI Situation Brief & OASIS CAP v1.2 Alerts
- Navigate to the **AI Situation Brief** view.
- **Observe**: Gemini AI synthesizes factual structured drivers from the pipeline into structured operational SITREPs and dual-language (English and Hindi) emergency advisories. Gemini is constrained to explain real features without inventing numerical weather observations.

---

## 🛠️ Quick CLI Verification (Terminal Commands)

You can reproduce the entire pipeline locally in under 30 seconds:

```bash
# 1. Run full dataset inspection & quality validation
python ml/inspect_datasets.py

# 2. Run spatial/temporal feature fusion on 468 real assets
python ml/build_real_pipeline.py

# 3. Calibrate sensitivity baseline & export evaluation manifest
python ml/training/train.py

# 4. Start the Python Real-Data Prediction Microservice
python ml/prediction_server.py
# (API active on http://127.0.0.1:5050/api/assets)

# 5. Start the React Frontend Application
npm run dev
# (Web app active on http://localhost:3000)
```

---

## 📊 Key Evaluation Checkpoints

| Evaluator Question | CycloneShield AI Implementation | Evidence Location |
| :--- | :--- | :--- |
| **Are real datasets actually used?** | Yes — NOAA IBTrACS, Open-Meteo ERA5 Kakinada, JRC 30m Water, NASA IMERG, and OSM Infrastructure. | [`docs/DATA_SOURCES.md`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/cycloneShield%20AI/docs/DATA_SOURCES.md) |
| **How are features generated?** | Spatial pixel sampling on JRC raster, 0.1° GPM clipping, Haversine distance, and 409k-hr weather matching. | [`docs/DATA_PIPELINE.md`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/cycloneShield%20AI/docs/DATA_PIPELINE.md) |
| **Is there an actual ML model?** | Deterministic P-CHMVM v2.4 physical model + Scikit-Learn sensitivity baseline. Supervised damage metrics set to `null` to prevent circular validation. | [`docs/MODEL_CARD.md`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/cycloneShield%20AI/docs/MODEL_CARD.md) |
| **Are predictions real or mock?** | Real observations produce derived risk scores. Mock/Sample is strictly limited to scenario simulation toggles. | [`docs/DEMO_VS_REAL_DATA.md`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/cycloneShield%20AI/docs/DEMO_VS_REAL_DATA.md) |
| **Are fake confidence numbers used?** | No. Confidence is strictly `null` because empirical damage survey distributions are unavailable. | [`docs/FINAL_ML_AUDIT.md`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/cycloneShield%20AI/docs/FINAL_ML_AUDIT.md) |
