import { HistoricalCycloneEvent } from '../types';

export const FIXTURE_HISTORICAL_EVENTS: HistoricalCycloneEvent[] = [
  {
    id: 'HIST-2019-FANI',
    name: 'Extremely Severe Cyclonic Storm Fani',
    year: 2019,
    dateRange: '26 Apr – 04 May 2019',
    basin: 'North Indian Ocean / Bay of Bengal',
    landfallLocation: 'Puri, Odisha Coast (19.8°N, 85.8°E)',
    peakCategory: 'Category 5 Equivalent (ESCS / Super Cyclone equivalent)',
    observedMaxWindKmh: 215,
    predictedMaxWindKmh: 205,
    observedPeakSurgeMeters: 5.2,
    predictedPeakSurgeMeters: 4.8,
    observedRainfallMm: 380,
    predictedRainfallMm: 350,
    evacuatedPopulation: 1480000,
    keyImpactSummary: 'Widespread structural collapse in Puri and Khordha. Near total destruction of 220kV power transmission towers; telecom grid blackout for 14 days.',
    inundationAccuracyPct: 91.2,
    infrastructureDamageScore: 89,
    lessonsLearned: [
      'Overhead power transmission within 25km coast suffered 94% tower failure; undergrounding of core feeder lines prioritized in coastal cities.',
      'Mass evacuation of 1.48 million people in 24 hours saved thousands of lives, proving efficacy of pre-designated multi-purpose cyclone shelters.',
      'Last-mile satellite HAM radio connectivity was critical when cellular base transceiver stations (BTS) collapsed.'
    ]
  },
  {
    id: 'HIST-2020-AMPHAN',
    name: 'Super Cyclonic Storm Amphan',
    year: 2020,
    dateRange: '16 – 21 May 2020',
    basin: 'Bay of Bengal',
    landfallLocation: 'Bakkhali, West Bengal / Sundarbans',
    peakCategory: 'Super Cyclonic Storm (Cat-5 Equivalent)',
    observedMaxWindKmh: 240,
    predictedMaxWindKmh: 225,
    observedPeakSurgeMeters: 5.8,
    predictedPeakSurgeMeters: 5.4,
    observedRainfallMm: 420,
    predictedRainfallMm: 390,
    evacuatedPopulation: 2500000,
    keyImpactSummary: 'Catastrophic saltwater intrusion in Sundarban delta islands. 2.5 million displaced. Kolkata metropolitan area experienced 130 km/h urban wind tunnel damage.',
    inundationAccuracyPct: 88.6,
    infrastructureDamageScore: 94,
    lessonsLearned: [
      'Mangrove ecosystem buffers attenuated peak surge energy by 35% in dense delta tracts vs degraded embankments.',
      'Dual crisis of COVID-19 pandemic + cyclone required strict hygiene and partitioned social distancing shelters.',
      'Urban drainage systems in Kolkata took 72 hours to dewater due to tidal lock at Hooghly outfall sluices.'
    ]
  },
  {
    id: 'HIST-2021-YAAS',
    name: 'Very Severe Cyclonic Storm Yaas',
    year: 2021,
    dateRange: '23 – 28 May 2021',
    basin: 'Bay of Bengal',
    landfallLocation: 'Dhamra Port, Bhadrak, Odisha',
    peakCategory: 'Very Severe Cyclonic Storm',
    observedMaxWindKmh: 140,
    predictedMaxWindKmh: 145,
    observedPeakSurgeMeters: 4.1,
    predictedPeakSurgeMeters: 3.9,
    observedRainfallMm: 310,
    predictedRainfallMm: 290,
    evacuatedPopulation: 710000,
    keyImpactSummary: 'Full-moon spring high tide compounded storm surge, causing 120km of saline river embankment breach and flooding 1,200 coastal villages.',
    inundationAccuracyPct: 93.4,
    infrastructureDamageScore: 72,
    lessonsLearned: [
      'Astronomical tidal phase synchronization is the single largest multiplier for coastal inundation damage.',
      'Geo-textile tube reinforced embankments survived without breaches compared to traditional earthen bunds.',
      'Pre-positioning mobile water treatment reverse osmosis (RO) plants prevented cholera outbreaks in flooded delta hamlets.'
    ]
  },
  {
    id: 'HIST-2023-MOCHA',
    name: 'Extremely Severe Cyclonic Storm Mocha',
    year: 2023,
    dateRange: '09 – 15 May 2023',
    basin: 'Bay of Bengal / Myanmar-Bangladesh Border',
    landfallLocation: 'Sittwe, Rakhine State, Myanmar',
    peakCategory: 'Super Cyclone / Cat 5 Equivalent',
    observedMaxWindKmh: 250,
    predictedMaxWindKmh: 235,
    observedPeakSurgeMeters: 4.5,
    predictedPeakSurgeMeters: 4.2,
    observedRainfallMm: 340,
    predictedRainfallMm: 320,
    evacuatedPopulation: 850000,
    keyImpactSummary: 'Massive wind destruction of bamboo shelters in refugee settlements. Severe coastal inundation cut off Sittwe port and airport communications.',
    inundationAccuracyPct: 86.8,
    infrastructureDamageScore: 92,
    lessonsLearned: [
      'Temporary bamboo and tarpaulin dwellings possess zero resilience against wind speeds > 100 km/h.',
      'Transboundary cyclone track data sharing between IMD and BMD provided 72-hour early warning lead time.',
      'Early positioning of satellite terminals allowed rapid situational assessment within 4 hours of landfall.'
    ]
  },
  {
    id: 'HIST-2024-DANA',
    name: 'Severe Cyclonic Storm Dana',
    year: 2024,
    dateRange: '22 – 26 Oct 2024',
    basin: 'Bay of Bengal',
    landfallLocation: 'Habalikhati Nature Camp, Kendrapara / Bhadrak, Odisha',
    peakCategory: 'Severe Cyclonic Storm',
    observedMaxWindKmh: 120,
    predictedMaxWindKmh: 115,
    observedPeakSurgeMeters: 2.2,
    predictedPeakSurgeMeters: 2.0,
    observedRainfallMm: 240,
    predictedRainfallMm: 220,
    evacuatedPopulation: 600000,
    keyImpactSummary: 'Zero human casualty milestone achieved through targeted micro-evacuation of pregnant women, disabled individuals, and elderly from 4,000 low-lying hamlets.',
    inundationAccuracyPct: 94.7,
    infrastructureDamageScore: 48,
    lessonsLearned: [
      'Hyper-local ward-level vulnerability mapping enabled precision evacuation without unnecessary mass panic.',
      'Pre-emptive tree pruning along 3,500km of state highways prevented major road blockage and allowed ambulance transit within 2 hours of eye passage.',
      'Community disaster volunteer network (Aapda Mitra) managed shelter food and sanitation with 98% satisfaction.'
    ]
  }
];
