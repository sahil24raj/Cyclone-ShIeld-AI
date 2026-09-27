# 🌀 CycloneShield AI
> **Tagline:** *Predict. Protect. Respond.*  
> **Supporting Line:** *Turn cyclone forecasts into local, actionable decisions.*

An AI-powered, simulation-driven Emergency Operations Centre (EOC) predictive risk and vulnerability decision-support platform designed for coastal disaster-management authorities. CycloneShield AI turns raw meteorological forecasts into local action directives: ranking ward vulnerability, testing single-point lifeline failures, routing evacuees away from flooded corridors, and generating CAP v1.2 emergency bulletins.

---

## 🚀 How to Run the Simulation Demo

Follow these simple steps to run the complete simulation locally:

### 1. Prerequisites & Installation
```bash
# Clone the repository
git clone https://github.com/sahil24raj/Cyclone-ShIeld-AI.git
cd "Cyclone-ShIeld-AI"

# Install dependencies (Node.js 18+)
npm install
```

### 2. Start Local Development Server
```bash
# Run local Vite development server
npm run dev

# Or build and test the production preview
npm run build
npm run preview
```
Open **`http://localhost:5173`** (or `http://localhost:4173` for preview) in your browser.

### 3. Interactive Guided Demo Walkthrough (3-Minute Tour)
Click the **"Start Guided Demo"** button on the Overview page header to step through:
1. **Overview**: Current storm story of **Cyclone Varuna** at **T-24h**, 135 km/h winds, and 2.84 Lakh exposed population.
2. **Coastal Ward 7 Inspection**: Click on Coastal Ward 7 to see its **Critical Risk (86/100)** and why low elevation (2.1m) + surge (1.8m) triggers P0 evacuation.
3. **Evacuation Corridor Allocation**: View the automatic rejection of **Shelter A** (access road flooded) and redirection to **Municipal Cyclone Shelter B** via **Elevated Route 2**.
4. **Lifeline Infrastructure Matrix**: Open the Criticality vs Risk matrix to inspect **Coastal Power Substation** (95/100 criticality) and power disruption mitigation actions.
5. **Scenario Simulator (+30km North Shift)**: Shift the cyclone track by +30 km North to see dynamic increases: **+7 critical villages, +4,200 shelter gap, +3 road cutoffs**.
6. **AI Situation Brief**: Generate structured decision-support SITREPs with dual English/Hindi advisories.
7. **CAP Alert Authorization**: Review standardized OASIS CAP v1.2 JSON drafts and cell broadcast mobile alerts under simulated human-in-the-loop review.

---

### ⚠️ Statutory & Prototype Simulation Notice
> **IMPORTANT NOTICE:** This prototype platform is designed strictly for decision-support demonstration and hackathon evaluation. **It does not supersede official warnings issued by the India Meteorological Department (IMD), National Disaster Management Authority (NDMA), or State Disaster Management Authorities (SDMA / OSDMA).** All risk scores, flooded segments, and demographic figures are synthetic demonstration values.

---

## 🧪 Mock Prediction Engine (Offline / Zero-Dependency)

CycloneShield AI includes a **zero-dependency, deterministic Mock Prediction & Simulation Engine**. When running in simulation mode, the application produces dynamic cyclone impact calculations, inundation models, evacuation routing assessments, AI SITREPs, and CAP alerts **without requiring any real weather API, Google Earth Engine, IMD API, Gemini API, database, API key, internet connection, or backend server.**

### Mode Configuration
Set in your `.env` or environment variables:
```bash
# Set to 'mock' for local deterministic simulation (default if omitted)
VITE_DATA_MODE=mock

# Set to 'live' when live adapters and API keys are connected
# VITE_DATA_MODE=live
```

### Mathematical Risk Formulation
The calculation engine runs client-side with 100% deterministic output:

$$\text{Overall Risk} = 0.35 \times \text{Hazard} + 0.25 \times \text{Exposure} + 0.25 \times \text{Vulnerability} + 0.15 \times \text{Criticality}$$

- **Hazard (35%)**: Peak wind speed, storm surge tidal depth, rainfall accumulation, and radial track proximity.
- **Exposure (25%)**: Population density, elderly/children count, infrastructure density, and economic assets.
- **Vulnerability (25%)**: Ground elevation above sea level, coast distance, road cutoff risk, and shelter distance.
- **Criticality (15%)**: Hospitals, 33kV substations, water treatment plants, and evacuation corridors.

---

## 🌟 Core Decision-Support Modules

1. **Overview (Situation at a Glance)**:
   - Storm Story: Category, wind speed, rainfall, surge, confidence, and illustrated progress timeline.
   - Immediate Actions: Clickable P0 metrics and next 6-hour tactical directives.
   - Priority Wards: Visual risk cards for Coastal Ward 7, Delta Nagar, and East Embankment with horizontal risk distribution bar.

2. **Live Impact GIS Map**:
   - Leaflet map of Sundar Coast District with toggleable layer stack (Surge, Flood, Wind, Critical Assets, Evacuation Routes).
   - Bottom scenario timeline scrubber (T-48h to T+6h) that updates hazard footprints in real-time.
   - Contextual right-hand drawer with contributing-factor bars.

3. **Evacuation Plan**:
   - Evacuation Readiness summary header (P0/P1 population, shelter vacancies, blocked roads).
   - Priority village list with corridor flow architecture and 7-item actionable logistics directives.
   - Expandable alternative corridor comparison.

4. **Infrastructure Resilience Matrix**:
   - 2D Criticality vs Risk matrix with interactive asset dots.
   - Detailed asset defense panel with potential service disruptions and response owner deadlines.
   - Time-staged action queue (Immediate, Next 6 Hours, Monitor).

5. **Scenario Simulator**:
   - 5 simple sliders with baseline indicators (Wind, Rain, Surge, Track Shift, Landfall Time).
   - Before/after comparative diff panel and meaningful impact deltas (+7 villages, +4,200 shelter gap).
   - Automated causal explanation synthesizer.

6. **AI Situation Brief**:
   - 7 structured sections: Summary, Priorities, Evacuation Targets, Infrastructure Actions, Shelter/Route Status, Dual-Language Public Advisories (EN/HI), Confidence & Limitations.

7. **Alert Drafts Studio**:
   - 4-stage authorization workflow (`Draft → Review → Approve → Simulated Dispatch`).
   - OASIS CAP v1.2 JSON tab and mobile cell broadcast notification preview in English & Hindi.

8. **Data Provenance & Method**:
   - Transparent plain-language explanation of formulas, synthetic baseline parameters, production satellite connections, and model limitations.

---

## 📄 License
Prototype developed for Hackathon evaluation. Open source under MIT License.
