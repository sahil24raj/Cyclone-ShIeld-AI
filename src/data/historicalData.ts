import { HistoricalCycloneEvent } from '../types';

export const HISTORICAL_CYCLONE_EVENTS: HistoricalCycloneEvent[] = [
  {
    id: 'fani-2019',
    name: 'Extremely Severe Cyclonic Storm FANI',
    year: 2019,
    dateRange: '26 April – 4 May 2019',
    basin: 'Bay of Bengal (North Indian Ocean)',
    landfallLocation: 'Puri, Odisha (19.8°N, 85.8°E)',
    peakCategory: 'Category 5 Equivalent (T6.5 / 3-min 215 km/h)',
    observedMaxWindKmh: 215,
    predictedMaxWindKmh: 210,
    observedPeakSurgeMeters: 5.2,
    predictedPeakSurgeMeters: 4.8,
    observedRainfallMm: 380,
    predictedRainfallMm: 350,
    evacuatedPopulation: 1400000,
    keyImpactSummary: 'Massive devastation of power distribution grid (over 150,000 poles downed) and extensive structural destruction across Puri and Khordha districts. Pre-landfall mass evacuation of 1.4M residents in 24 hours kept casualties below 64.',
    inundationAccuracyPct: 91.4,
    infrastructureDamageScore: 94,
    lessonsLearned: [
      'Overhead 33kV & 11kV distribution corridors require underground conversion or rapid modular restoration kits.',
      'Storm surge penetrated 3.5 km inland through coastal river mouth estuaries.',
      'Early SMS cell broadcasts and cyclone sanctuary networks saved an estimated 10,000+ lives.'
    ]
  },
  {
    id: 'amphan-2020',
    name: 'Super Cyclonic Storm AMPHAN',
    year: 2020,
    dateRange: '16 May – 21 May 2020',
    basin: 'Bay of Bengal (North Indian Ocean)',
    landfallLocation: 'Bakkhali, West Bengal & Sundarbans (21.7°N, 88.3°E)',
    peakCategory: 'Super Cyclonic Storm (T7.0 / 1-min 260 km/h, 3-min 240 km/h)',
    observedMaxWindKmh: 240,
    predictedMaxWindKmh: 235,
    observedPeakSurgeMeters: 5.8,
    predictedPeakSurgeMeters: 5.5,
    observedRainfallMm: 420,
    predictedRainfallMm: 400,
    evacuatedPopulation: 3000000,
    keyImpactSummary: 'Severely impacted the ecologically fragile Sundarbans mangrove delta and Kolkata urban agglomeration. Embankments breached at 160+ locations, causing salinization of arable land.',
    inundationAccuracyPct: 89.2,
    infrastructureDamageScore: 96,
    lessonsLearned: [
      'Mangrove buffer zones reduced surge velocity by ~40% compared to unshielded embankments.',
      'Urban waterlogging in metro core required high-capacity mobile diesel de-watering pumps.',
      'Telecom fiber backhaul towers experienced severe misalignment from 160 km/h gusts.'
    ]
  },
  {
    id: 'yaas-2021',
    name: 'Very Severe Cyclonic Storm YAAS',
    year: 2021,
    dateRange: '23 May – 28 May 2021',
    basin: 'Bay of Bengal (North Indian Ocean)',
    landfallLocation: 'Dhamra Port, Bhadrak, Odisha (20.9°N, 86.9°E)',
    peakCategory: 'Very Severe Cyclonic Storm (3-min 140 km/h)',
    observedMaxWindKmh: 140,
    predictedMaxWindKmh: 145,
    observedPeakSurgeMeters: 4.2,
    predictedPeakSurgeMeters: 4.0,
    observedRainfallMm: 310,
    predictedRainfallMm: 290,
    evacuatedPopulation: 2100000,
    keyImpactSummary: 'Landfall coincided with astronomical perigean spring tide (full moon), amplifying coastal inundation depth by 1.8m above standard meteorological surge models.',
    inundationAccuracyPct: 92.7,
    infrastructureDamageScore: 82,
    lessonsLearned: [
      'Coupling astronomical tidal phases with SLOSH hydrodynamic equations is non-negotiable for low-lying estuaries.',
      'Saline water ingress caused extensive agricultural damage that persisted for 2 crop seasons.',
      'Livestock shelter provision was a primary barrier to complete human evacuation compliance.'
    ]
  },
  {
    id: 'mocha-2023',
    name: 'Extremely Severe Cyclonic Storm MOCHA',
    year: 2023,
    dateRange: '9 May – 15 May 2023',
    basin: 'Bay of Bengal (North Indian Ocean)',
    landfallLocation: 'Sittwe, Rakhine State, Myanmar (20.1°N, 92.9°E)',
    peakCategory: 'Category 5 Equivalent (1-min 280 km/h, 3-min 215 km/h)',
    observedMaxWindKmh: 215,
    predictedMaxWindKmh: 220,
    observedPeakSurgeMeters: 3.8,
    predictedPeakSurgeMeters: 4.1,
    observedRainfallMm: 260,
    predictedRainfallMm: 280,
    evacuatedPopulation: 750000,
    keyImpactSummary: 'One of the strongest storms in the North Indian Ocean on record. Rapid eyewall intensification in deep warm oceanic eddies (OHC > 100 kJ/cm²) prior to landfall.',
    inundationAccuracyPct: 87.8,
    infrastructureDamageScore: 91,
    lessonsLearned: [
      'Ocean Heat Content (OHC) and sea surface temperature anomalies are critical early indicators for rapid intensification (RI).',
      'Satellite SAR cross-polarization radar channels provided critical wind-speed ground truth when airborne reconnaissance was unavailable.',
      'Refugee camp settlements required specialized lightweight shelter anchoring guidelines.'
    ]
  },
  {
    id: 'dana-2024',
    name: 'Severe Cyclonic Storm DANA',
    year: 2024,
    dateRange: '23 October – 26 October 2024',
    basin: 'Bay of Bengal (North Indian Ocean)',
    landfallLocation: 'Habalikhati Nature Camp / Dhamra, Odisha (20.8°N, 86.8°E)',
    peakCategory: 'Severe Cyclonic Storm (3-min 110-120 km/h)',
    observedMaxWindKmh: 120,
    predictedMaxWindKmh: 115,
    observedPeakSurgeMeters: 2.1,
    predictedPeakSurgeMeters: 2.3,
    observedRainfallMm: 240,
    predictedRainfallMm: 230,
    evacuatedPopulation: 600000,
    keyImpactSummary: 'High-precision track forecasting by IMD and multi-agency AI models allowed surgical targeted evacuation of vulnerable coastal strips. Zero human casualties recorded in Odisha core zone.',
    inundationAccuracyPct: 94.1,
    infrastructureDamageScore: 68,
    lessonsLearned: [
      'Hyperlocal ward-level vulnerability scoring prevented unnecessary broad-scale economic shutdown.',
      'Pre-positioned mobile generator trailers and water desalination units ensured 100% hospital uptime.',
      'Real-time GIS road obstruction tracking allowed relief convoys to reach cutoff hamlets within 4 hours.'
    ]
  }
];
