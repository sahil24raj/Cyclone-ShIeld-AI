# Cyclone Shield AI — Data Sources & Provenance Catalog

This document details every metric displayed in the Cyclone Shield AI / Cyclone-X platform, its provenance type, authoritative source requirements, integration method, and current status.

---

## 1. Data Provenance Taxonomy

Every dataset and card in the system is assigned a strict `DataType`:

| DataType | Definition | Frontend Treatment |
| :--- | :--- | :--- |
| **`OBSERVATION`** | Ground truth measurements from meteorological buoys, radar stations, AWS (Automatic Weather Stations), or satellite scatterometry. | Labeled with station ID/source and observation timestamp. |
| **`OFFICIAL_FORECAST`** | Official agency forecast track cones issued by recognized meteorological agencies (IMD RSMC New Delhi, JTWC, WMO). | Labeled with issuing agency bulletin number and advisory time. |
| **`HISTORICAL`** | Post-event verified cyclone track and impact datasets (IBTrACS, NDMA, IMD reports). | Labeled as verified post-storm archive with analysis metadata. |
| **`ML_PREDICTION`** | Outputs directly produced by a validated statistical or neural network prediction model. | Explicitly displays model architecture, inference latency, and features. Disabled when model is unconfigured. |
| **`DERIVED_ANALYSIS`** | Deterministic formulas combining observation data with spatial exposure layers (e.g. Risk Index formula $0.35H + 0.25E + 0.25V + 0.15C$). | Labeled with exact mathematical formula and weighted components. |

---

## 2. Metric-by-Metric Data Sources

### A. Meteorological Observations

| UI Metric / Card | Real Data Source | Update Frequency | Protocol / Format | Fallback State |
| :--- | :--- | :--- | :--- | :--- |
| **Temperature** (°C) | Open-Meteo / IMD AWS / ECMWF IFS | Hourly / 15-min | REST JSON (`WeatherObservation`) | `"Weather data unavailable"` |
| **Relative Humidity** (%) | Open-Meteo / IMD AWS | Hourly | REST JSON (`WeatherObservation`) | `"Weather data unavailable"` |
| **Atmospheric Pressure** (hPa) | Surface Buoy Network / AWS / WMO GTS | 15-min | REST JSON (`WeatherObservation`) | `"Weather data unavailable"` |
| **Wind Speed & Gust** (km/h) | Coastal Radar / Scatterometer (ASCAT) | Real-time / Hourly | REST JSON (`WeatherObservation`) | `"Weather data unavailable"` |
| **Wind Direction** (°) | Coastal Radar / Buoys | Real-time / Hourly | Degrees (0-360) | `"Weather data unavailable"` |
| **Precipitation Accumulation** (mm) | IMD Doppler Radar (DWR) / GPM IMERG | Hourly | REST JSON | `"Weather data unavailable"` |
| **Cloud Cover** (%) | INSAT-3D / 3DR Imager / Open-Meteo | 30-min | Percentage | `"Weather data unavailable"` |
| **Visibility** (km) | Airport METAR / Coastal Station | Hourly | km | `"Weather data unavailable"` |

### B. Cyclone Tracking & Forecasting

| UI Metric / Layer | Real Data Source | Update Frequency | Protocol / Format | Fallback State |
| :--- | :--- | :--- | :--- | :--- |
| **Active Cyclone Name / ID** | IMD RSMC Tropical Cyclone Advisory / JTWC | 3 to 6 Hours | JSON / GeoJSON | `"NO ACTIVE CYCLONE"` |
| **Observed Past Track Points** | IMD Bulletins / INSAT Dvorak Estimates | 3 Hours | `TrackPoint[]` with `OBSERVATION` | `"No track points recorded"` |
| **Official Agency Forecast Track** | Official IMD Tropical Cyclone Bulletin | 6 Hours | `TrackPoint[]` with `OFFICIAL_FORECAST` | `"Official forecast not issued"` |
| **Central Pressure & Peak Wind** | Dvorak T-Number / Automated Aircraft Dropsondes | 3 Hours | hPa / km/h | `"—"` |
| **Current Storm Category** | WMO / IMD Cyclone Classification Scale | 3 Hours | CS / SCS / VSCS / ESCS / Super Cyclone | `"Category Unassigned"` |

### C. Geospatial & Exposure Layers

| UI Layer | Real Data Source | Format | Attributes | Fallback State |
| :--- | :--- | :--- | :--- | :--- |
| **Ward / Village Polygons** | Survey of India / District GIS Cell | GeoJSON MultiPolygon | ID, Name, Pop, Elevation, Distance to Coast | Layer Hidden / Disabled |
| **Evacuation Shelters** | State Disaster Management Authority (SDMA / OSDMA) | GeoJSON Point | Shelter Name, Capacity, Status, Generator, Water | Empty List / Unconfigured |
| **Critical Infrastructure Assets** | OpenStreetMap / State Electricity Board / Health Dept | GeoJSON Point/Line | Asset Type (Hospital, Substation, Tower), Criticality | Empty Layer |
| **Evacuation Routes & Corridors** | State Highway Authority / PMGSY GIS | GeoJSON LineString | Road Condition, Flood Vulnerability, Transit Min | Empty Routes |

### D. Risk & Vulnerability Metrics

| UI Element | Source / Computation | Method | Formula | Labeling |
| :--- | :--- | :--- | :--- | :--- |
| **Composite Ward Risk Index (0-100)** | Deterministic Spatial Engine | Deterministic | $0.35H + 0.25E + 0.25V + 0.15C$ | `DERIVED_ANALYSIS` |
| **Sub-hazard Scores (H, E, V, C)** | Computed from wind, surge, elevation, social vuln | Deterministic | Documented in `riskEngine.ts` | `DERIVED_ANALYSIS` |
| **Shelter Assignment & Rerouting** | Dijkstra Shortest Safe Path Algorithm | Graph Optimization | Node weights modulated by flood depth | `DERIVED_ANALYSIS` |

### E. Historical Cyclone Records

| Event | Source Dataset | Verified Impact Data |
| :--- | :--- | :--- |
| **Cyclone Fani (2019)** | IMD RSMC Technical Report / OSDMA Archive | Peak Winds: 215 km/h, Landfall: Puri, Population Evacuated: 1.48M |
| **Super Cyclone Amphan (2020)** | WMO / IMD Post-Cyclone Report | Peak Winds: 240 km/h, Landfall: Bakkhali, Surge: 4.8m |
| **Cyclone Yaas (2021)** | IMD Cyclone Bulletin Series / SDMA | Peak Winds: 140 km/h, Landfall: Dhamra Port, Tidal Inundation: High |
| **Cyclone Mocha (2023)** | WMO ESCAP Panel Report | Peak Winds: 275 km/h, Min Pressure: 918 hPa |
| **Severe Cyclone Dana (2024)** | IMD RSMC Verified Track Dataset | Peak Winds: 120 km/h, Landfall: Habalikhati Nature Camp, Evac: 800k+ |

---

## 3. Configuration & API Endpoints

To connect production data sources, set the corresponding environment variables in `.env.local`:

```bash
# Live Weather
VITE_WEATHER_API_URL=https://api.open-meteo.com/v1/forecast

# Cyclone Observation & Forecast Feed
VITE_CYCLONE_FEED_URL=https://your-api-gateway.gov/cyclone-feed.json

# ML Inference Microservice
VITE_ML_SERVICE_URL=https://ml.cycloneshield.ai/predict

# Geospatial Layers
VITE_INFRASTRUCTURE_GEOJSON_URL=https://gis.cycloneshield.ai/infrastructure.geojson
VITE_VILLAGES_GEOJSON_URL=https://gis.cycloneshield.ai/wards.geojson
```
