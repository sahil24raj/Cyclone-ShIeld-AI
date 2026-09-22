# 🌀 CycloneShield AI
> **Tagline:** *Predict. Protect. Respond.*

An AI-powered predictive risk and vulnerability modelling platform prototype for Bay of Bengal and coastal APAC cyclones. Developed for disaster-management authorities, municipal bodies, and emergency response teams to simulate storm surge, forecast flood pathways, rank village vulnerability, and generate automated multilingual decision briefings.

---

### ⚠️ Statutory & Prototype Disclaimer
> **IMPORTANT NOTICE:** This prototype platform is designed strictly for decision-support demonstration and hackathon evaluation. **It does not supersede official warnings issued by the India Meteorological Department (IMD), National Disaster Management Authority (NDMA), or State Disaster Management Authorities (SDMA / OSDMA).** All risk scores, flooded segments, and demographic figures are synthetic demonstration values.

---

## 🌟 Key Features

1. **Integrated Emergency Command Centre**:
   - Live KPI overview: Sustained Wind (135 km/h) with sparkline trends, Population Exposed (2.84 Lakh), Critical Assets at Risk (42), Shelter Capacity Gap (92,000), and Flooded Roads (31 segments).
   - Real-time tactical alerts feed for EOC dispatchers.
   - High-vulnerability ward prioritization ranking.

2. **Full-Width Interactive GIS Map (Sundar Coast District)**:
   - Built on CartoDB Dark Matter / OpenStreetMap tiles.
   - Dynamic layers: Cyclone track points (T-48h to T+6h), Forecast uncertainty cone, 135 km/h Gale wind radius, Storm surge inundation overlay, Sentinel-1 SAR flood extent polygon, CHIRPS rainfall isohyet (>250mm), and Evacuation corridors.
   - Interactive village markers with explainable risk breakdown.
   - Shelter status markers (Green for operational; Red with pulsating warning for blocked/submerged access).

3. **Explainable Multi-Hazard Risk Model**:
   - Transparent mathematical equation:
     $$\text{Overall Risk} = 0.35 \times \text{Hazard} + 0.25 \times \text{Exposure} + 0.25 \times \text{Vulnerability} + 0.15 \times \text{Criticality}$$
   - Granular driver attribution: `+18 pts` wind, `+22 pts` low elevation, `+15 pts` rainfall, `+14 pts` road submersion cutoff, `+11 pts` dependent demographics.

4. **Dynamic Shelter Rerouting Engine**:
   - Automated hazard avoidance: When Coastal Ward 7's primary access road (SH-12) floods under 0.8m storm surge, the system redirects evacuees from Shelter A to **Shelter B (Sundar Model High School)** via **Elevated Corridor 2 (Puri-Sundar Bypass)**.
   - Capacity deficit tracking and transit time estimations.

5. **Critical Infrastructure Resilience Registry**:
   - 42 tracked assets across Hospitals, Power Substations, Bridges, Road Corridors, Ports, Water Treatment, and Telecom Towers.
   - Interactive operational action checklists (e.g., ICU relocation to 2nd floor, de-energizing 33kV coastal feeders, diesel generator verification).

6. **Sensitivity Scenario Simulator**:
   - Interactive sliders for Wind Speed, Rainfall Accumulation, Storm Surge Peak Offset, North/South Track Shifts (-50km to +50km), and Landfall Timing.
   - Real-time before/after differential analysis showing exact increases in vulnerable villages, flooded routes, and shelter deficits.

7. **Multimodal AI Briefing Synthesizer**:
   - Structured situation reports (SITREP) with executive summaries, top 5 operational risks, critical infrastructure directives, and next 6-hour action checklists.
   - Native multilingual public advisories in **English**, **Hindi (हिंदी)**, **Bengali (বাংলা)**, and **Odia (ଓଡ଼ିଆ)**.
   - Gemini API prompt integration contract schema.

8. **CAP v1.2 Standardized Alert Composer**:
   - Common Alerting Protocol (CAP) compliant JSON/XML payload generator.
   - Multi-channel dissemination preview: Cell Broadcast SMS, WhatsApp, Siren Actuators, and Megaphones.
   - Explicit "Simulated Dispatch Only" safety guardrail.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn / pnpm

### Installation Steps

```bash
# 1. Clone or navigate to the directory
cd "cycloneShield AI"

# 2. Configure environment variables (CARTO Map API Key)
# A configured .env file is included with your CARTO API key:
# VITE_CARTO_API_KEY=cb1_3t5l_1_a644c0e42df5a70a5cea7a0f

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will be available at `http://localhost:3000`.

To build for production:
```bash
npm run build
npm run preview
```

---

## 🏗️ Project Architecture

```
src/
├── types/
│   └── index.ts                 # Type definitions (Village, Asset, Shelter, CAPAlert, etc.)
├── data/
│   ├── cycloneData.ts           # Cyclone Varuna track points, pressure, wind curves
│   ├── villageData.ts           # 8 coastal wards with demographics and coordinates
│   ├── infrastructureData.ts    # 42 critical lifeline assets & shelter registries
│   ├── evacuationData.ts        # Evacuation corridors, elevation routes, bottlenecks
│   └── methodologyData.ts       # Mathematical equations, data sources, limitations
├── utils/
│   ├── riskCalculator.ts        # Explainable composite 0-100 risk scoring engine
│   ├── shelterOptimizer.ts      # Flood-avoidance shelter assignment optimizer
│   └── formatters.ts            # Indian number formatting (Lakhs) & risk badges
├── context/
│   ├── AppStateContext.tsx      # Global simulation state, alerts, selected entities
│   └── LanguageContext.tsx      # Multilingual translation dictionary (EN/HI/BN/OR)
├── components/
│   ├── common/                  # TopHeader, Sidebar, PrototypeBanner, Modals
│   ├── map/                     # Leaflet InteractiveMap, MapLegend, VillageRiskDrawer
│   ├── command/                 # SummaryCards, Sparklines, CriticalWardsTable, Feeds
│   ├── evacuation/              # Evacuation matrix, Shelter capacity Recharts
│   ├── infrastructure/          # Filterable asset cards & action checklists
│   ├── simulator/               # Real-time sensitivity sliders & impact delta
│   ├── briefing/                # Gemini SITREP generator & reasoning traces
│   ├── alert/                   # CAP JSON alert composer & simulated dispatch
│   └── methodology/             # Scientific equations & limitation disclaimers
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🔌 API Integration Guide: Replacing Mock Data with Real APIs

When moving from this prototype to production deployment, follow the integration blueprints below:

### 1. Google Earth Engine (GEE) Python/JS Backend
Replace the static SAR and CHIRPS mock layers with dynamic Earth Engine endpoints:
```python
# Backend FastAPI endpoint consuming Google Earth Engine
import ee
ee.Initialize()

def get_sar_flood_extent(bounds, pre_event_date, post_event_date):
    s1 = ee.ImageCollection('COPERNICUS/S1_GRD') \
           .filterBounds(bounds) \
           .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    
    before = s1.filterDate(pre_event_date[0], pre_event_date[1]).mosaic()
    after = s1.filterDate(post_event_date[0], post_event_date[1]).mosaic()
    
    # SAR Ratio change detection (Water Index)
    difference = after.divide(before)
    flooded = difference.lt(1.25)
    return flooded.getDownloadURL({'format': 'GEO_TIFF'})
```

### 2. India Meteorological Department (IMD) / RSMC New Delhi
Replace `src/data/cycloneData.ts` with real-time JSON polling from RSMC bulletins:
```typescript
async function fetchLiveCycloneTrack(bulletinId: string) {
  const response = await fetch(`https://api.imd.gov.in/cyclone/v1/track/${bulletinId}`);
  const data = await response.json();
  return data.points.map((pt: any) => ({
    time: pt.leadTime,
    lat: pt.latitude,
    lng: pt.longitude,
    wind: pt.sustainedWindKmh,
    pressure: pt.centralPressureHpa,
    category: pt.cycloneGrade
  }));
}
```

### 3. Google Gemini Multimodal Reasoning Engine
Integrate `@google/genai` or `@google/generative-ai` in `src/components/briefing/AIBriefingView.tsx`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY!);

async function generateOperationalBriefing(structuredData: object) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `You are a disaster-management decision-support assistant.
Use this structured hazard dataset: ${JSON.stringify(structuredData)}.
Generate executive summary, top 5 risks, evacuation instructions, and public advisories in English and Hindi.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### 4. State Disaster Management Authority (SDMA / OSDMA) Shelter API
Connect real-time shelter occupancy and generator statuses directly via state API endpoints.

---

## 🎯 Verification Demo Flow (Hackathon Walkthrough)

1. **Command Centre**: Open app to see **Cyclone Varuna** at **T-24h**, wind speed **135 km/h**, and **2.84 Lakh** exposed population.
2. **Impact Map**: Inspect the fictional **Sundar Coast District** map. Toggle layers (Surge, Flood, Wind Radii, Evacuation Routes).
3. **Examine Coastal Ward 7**: Click on **Coastal Ward 7** marker to open the explainable risk breakdown (+18 wind, +22 low elevation, +14 road submerged).
4. **Evacuation Planner**: Observe the automatic rerouting notification: **Shelter A is blocked due to 0.8m surge; village redirected to Shelter B via Elevated Route 2**.
5. **Scenario Simulator**: Shift the cyclone track **+30 km North** and observe the real-time impact delta (+7 critical villages, +4,200 shelter deficit).
6. **AI Briefing**: Click **Generate AI Briefing** to review structured SITREP and multilingual advisories (English, Hindi, Odia, Bengali).
7. **Alert Centre**: Review the CAP v1.2 JSON payload and test the **Simulated Dispatch** workflow.

---

## 📄 License
Prototype developed for Hackathon evaluation. Open source under MIT License.
