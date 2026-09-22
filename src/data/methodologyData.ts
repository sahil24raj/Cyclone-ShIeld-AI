export const METHODOLOGY_DATA = {
  version: '2.4-PROTOTYPE',
  framework: 'Probabilistic Cyclone Hazard & Multimodal Vulnerability Modeling (P-CHMVM)',
  riskFormula: {
    equation: 'Overall Risk = 0.35 × Hazard + 0.25 × Exposure + 0.25 × Vulnerability + 0.15 × Criticality',
    weights: [
      { component: 'Hazard Score', weight: '35%', color: '#EF4444' },
      { component: 'Exposure Score', weight: '25%', color: '#F97316' },
      { component: 'Vulnerability Score', weight: '25%', color: '#EAB308' },
      { component: 'Criticality Score', weight: '15%', color: '#8B5CF6' },
    ],
    hazardSubWeights: [
      { name: 'Sustained Wind Speed & Gusts', weight: 25, metric: 'Holland Wind Model / IMD Radar' },
      { name: 'Coastal Storm Surge Peak Height', weight: 25, metric: 'SLOSH / ADCIRC Hydrodynamic Model' },
      { name: 'Inundation / Flooding Extent', weight: 25, metric: 'Sentinel-1 SAR Water Index (GEE)' },
      { name: '24h Precipitation Accumulation', weight: 15, metric: 'CHIRPS / GPM IMERG Real-time' },
      { name: 'Track Proximity & Cone Uncertainty', weight: 10, metric: 'Ensemble NWP Track Error Decay' }
    ],
    exposureSubWeights: [
      { name: 'Resident Population (Census + Mobile Density)', weight: 35, metric: 'WorldPop / Meta HD Pop Grid' },
      { name: 'Critical Infrastructure Density', weight: 25, metric: 'OSM + State Disaster Registry' },
      { name: 'Built-up / Impervious Surface Area', weight: 20, metric: 'Dynamic World 10m LULC' },
      { name: 'Agricultural & Aquaculture Assets', weight: 20, metric: 'Sentinel-2 NDVI / Crop Mask' }
    ],
    vulnerabilitySubWeights: [
      { name: 'Low Elevation & Slope (<3m AMSL)', weight: 30, metric: 'NASA SRTM 30m / FABDEM 1m' },
      { name: 'Proximity to Coastline & Tidal Inlets', weight: 20, metric: 'Geodesic Coastal Distance Grid' },
      { name: 'Road Accessibility & Flood Cutoff Index', weight: 20, metric: 'Network Graph Flood Vulnerability' },
      { name: 'Distance to Certified Cyclone Shelter', weight: 15, metric: 'Euclidean & Road-Weighted Buffer' },
      { name: 'Social Vulnerability (Elderly/Children/Kutcha)', weight: 15, metric: 'Socio-Economic Census Index' }
    ]
  },
  dataSources: [
    {
      name: 'Google Earth Engine (GEE)',
      role: 'Planetary-scale geospatial analytics and cloud-native raster computation',
      datasets: ['COPERNICUS/S1_GRD (Sentinel-1 SAR)', 'NASA/NASADEM_HGT/001 (Elevation)', 'UCSB-CHG/CHIRPS/DAILY (Precipitation)'],
      frequency: '6-12 hr satellite revisit',
      status: 'Simulated API Contract in Prototype',
      sourceType: 'Satellite Earth Observation'
    },
    {
      name: 'India Meteorological Department (IMD) / JTWC',
      role: 'Cyclone best-track forecasts, central pressure, gale wind radii and Doppler radar feeds',
      datasets: ['RSMC New Delhi Bulletins', 'DWR Paradip / Visakhapatnam Doppler velocity'],
      frequency: '3-hourly synoptic bulletins',
      status: 'Mock Scenarios (Varuna Event)',
      sourceType: 'Meteorological'
    },
    {
      name: 'Gemini Multimodal Reasoning Engine',
      role: 'Synthesizes multi-source spatial hazards into structured operational briefings & multilingual advisories',
      datasets: ['Structured GeoJSON inputs', 'District standard operating procedure (SOP) tables'],
      frequency: 'On-demand execution',
      status: 'Rule-based mock logic with Gemini system prompt integration template',
      sourceType: 'Generative AI & Decision Support'
    },
    {
      name: 'State Disaster Management Authority (SDMA / OSDMA)',
      role: 'Shelter capacity registry, vulnerable demographic surveys, road elevation benchmarks',
      datasets: ['Multi-Purpose Cyclone Shelter Database', 'Census Ward Demographics'],
      frequency: 'Annual baseline + Pre-disaster updates',
      status: 'Synthetic District Dataset (Sundar Coast District)',
      sourceType: 'Administrative'
    }
  ],
  limitations: [
    'PROTOTYPE DISCLAIMER: This system is an engineering and AI concept demonstrator for hackathons. It does NOT replace official warnings from IMD, NDMA, or State Disaster Authorities.',
    'HYDRODYNAMIC SIMPLIFICATION: Storm surge inundation layers utilize a simplified bathtub/friction elevation model rather than full coupled 2D ADCIRC finite-element mesh simulations.',
    'INFRASTRUCTURE INVENTORY GAPS: Asset locations and backup equipment statuses are synthetic demo entries; real deployment requires field validation through SDMA GIS databases.',
    'FORECAST DECAY UNCERTAINTY: Model confidence decreases non-linearly with forecast lead times beyond T-24h due to cross-track ensemble divergence.',
    'CLOUD & SAR PASS LATENCY: Real-time satellite SAR radar change detection depends on orbital overpasses (typically 12-24 hr latency during rapid cyclogenesis).',
    'AI ADVISORY REVIEW REQUIREMENT: All AI-generated briefings, CAP alerts, and public instructions must be reviewed and countersigned by an authorized District Emergency Officer.'
  ]
};
