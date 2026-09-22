import { CriticalAsset, Shelter } from '../types';

export const MOCK_SHELTERS: Shelter[] = [
  {
    id: 'sh-01',
    name: 'Shelter A (Coastal Multipurpose Cyclone Shelter)',
    lat: 20.46,
    lng: 86.88,
    capacity: 2500,
    current_occupancy: 450,
    elevation: 3.2,
    in_flood_zone: true,
    is_operational: false, // Access road flooded!
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'blocked',
    contact_number: '+91-6722-290101',
    assigned_villages: ['Coastal Ward 7', 'Mangrove Hamlet']
  },
  {
    id: 'sh-02',
    name: 'Shelter B (Sundar Model High School Complex)',
    lat: 20.52,
    lng: 86.82,
    capacity: 6500,
    current_occupancy: 2100,
    elevation: 6.8,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-6722-290102',
    assigned_villages: ['Coastal Ward 7 (Rerouted)', 'Riverbend']
  },
  {
    id: 'sh-03',
    name: 'Shelter C (Delta Nagar Community Center)',
    lat: 20.36,
    lng: 86.74,
    capacity: 3200,
    current_occupancy: 2900,
    elevation: 2.2,
    in_flood_zone: true,
    is_operational: true,
    has_generator: true,
    has_medical_kit: false,
    access_road_status: 'partially_flooded',
    contact_number: '+91-6722-290103',
    assigned_villages: ['Delta Nagar']
  },
  {
    id: 'sh-04',
    name: 'Shelter D (Port Trust Indoor Stadium)',
    lat: 20.31,
    lng: 86.60,
    capacity: 8000,
    current_occupancy: 3400,
    elevation: 5.5,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-6722-290104',
    assigned_villages: ['New Port Colony', 'Delta Nagar (Overflow)']
  },
  {
    id: 'sh-05',
    name: 'Shelter E (District Polytechnic Campus)',
    lat: 20.56,
    lng: 86.89,
    capacity: 10500,
    current_occupancy: 4200,
    elevation: 8.4,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-6722-290105',
    assigned_villages: ['Sundar Pur', 'East Embankment']
  },
  {
    id: 'sh-06',
    name: 'Shelter F (Kharipalli Block Training Centre)',
    lat: 20.64,
    lng: 86.97,
    capacity: 4500,
    current_occupancy: 1200,
    elevation: 9.1,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-6722-290106',
    assigned_villages: ['Kharipalli']
  },
  {
    id: 'sh-07',
    name: 'Shelter G (Inland Reserve Relief Camp)',
    lat: 20.68,
    lng: 86.75,
    capacity: 12000,
    current_occupancy: 1800,
    elevation: 12.0,
    in_flood_zone: false,
    is_operational: true,
    has_generator: true,
    has_medical_kit: true,
    access_road_status: 'clear',
    contact_number: '+91-6722-290107',
    assigned_villages: ['Contingency Spillover']
  }
];

export const MOCK_ASSETS: CriticalAsset[] = [
  {
    id: 'ast-01',
    name: 'Sundar District General Hospital (300 beds)',
    type: 'hospital',
    lat: 20.44,
    lng: 86.79,
    risk_score: 91,
    criticality: 'critical',
    hazard_exposure: 'Projected flood depth 1.4m on ground floor; 135 km/h wind gusts threatening ICU roof',
    current_status: 'at_risk',
    elevation: 2.3,
    in_flood_zone: true,
    recommended_actions: [
      'Relocate ground-floor ICU and NICU patients to Level 2',
      'Start auxiliary diesel generator located on elevated podium',
      'Pre-position 48-hour emergency oxygen and potable water tanks',
      'Stockpile anti-snake venom and emergency trauma packs'
    ],
    action_status: {
      'Relocate ground-floor ICU and NICU patients to Level 2': false,
      'Start auxiliary diesel generator located on elevated podium': true,
      'Pre-position 48-hour emergency oxygen and potable water tanks': true,
      'Stockpile anti-snake venom and emergency trauma packs': false
    },
    contact_person: 'Dr. S. K. Mahapatra (Chief Medical Officer)',
    backup_power_ready: true
  },
  {
    id: 'ast-02',
    name: 'Delta Sub-Divisional Hospital (100 beds)',
    type: 'hospital',
    lat: 20.37,
    lng: 86.71,
    risk_score: 95,
    criticality: 'critical',
    hazard_exposure: 'Direct tidal surge pathway; estimated 2.1m inundation',
    current_status: 'isolated',
    elevation: 1.9,
    in_flood_zone: true,
    recommended_actions: [
      'Execute complete medical evacuation of 45 non-ambulatory patients to Inland Hospital',
      'Seal electronic imaging units and elevate laboratory reagents',
      'Deploy amphibious ambulance at facility entrance'
    ],
    action_status: {
      'Execute complete medical evacuation of 45 non-ambulatory patients to Inland Hospital': true,
      'Seal electronic imaging units and elevate laboratory reagents': false,
      'Deploy amphibious ambulance at facility entrance': false
    },
    contact_person: 'Dr. P. R. Jena (Medical Superintendent)',
    backup_power_ready: false
  },
  {
    id: 'ast-03',
    name: 'Sundar Coastal 220/33kV Main Grid Substation',
    type: 'power_substation',
    lat: 20.49,
    lng: 86.84,
    risk_score: 88,
    criticality: 'critical',
    hazard_exposure: 'Surge backflow reaching switchyard trench; salt spray causing flashovers',
    current_status: 'at_risk',
    elevation: 2.6,
    in_flood_zone: true,
    recommended_actions: [
      'De-energize coastal 33kV Feeders 3 & 4 before surge crest to prevent transformer explosion',
      'Lock out switchyard control room pumps and switch to battery trip circuits',
      'Pre-position quick-restoration emergency towers at Inland Substation depot'
    ],
    action_status: {
      'De-energize coastal 33kV Feeders 3 & 4 before surge crest to prevent transformer explosion': false,
      'Lock out switchyard control room pumps and switch to battery trip circuits': true,
      'Pre-position quick-restoration emergency towers at Inland Substation depot': false
    },
    contact_person: 'Er. A. K. Behera (Executive Engineer, Gridco)',
    backup_power_ready: true
  },
  {
    id: 'ast-04',
    name: 'Mahanadi Delta Estuary Road Bridge (SH-12)',
    type: 'bridge',
    lat: 20.43,
    lng: 86.76,
    risk_score: 84,
    criticality: 'high',
    hazard_exposure: 'Surge hydraulic load against bridge piers; debris impact risk',
    current_status: 'at_risk',
    elevation: 4.2,
    in_flood_zone: true,
    recommended_actions: [
      'Inspect bridge pier scour monitors every 2 hours',
      'Close bridge to heavy commercial transport above 80 km/h wind',
      'Station recovery tow crane at west approach'
    ],
    action_status: {
      'Inspect bridge pier scour monitors every 2 hours': true,
      'Close bridge to heavy commercial transport above 80 km/h wind': true,
      'Station recovery tow crane at west approach': false
    },
    contact_person: 'Er. T. Tripathy (PWD Roads & Bridges)',
    backup_power_ready: false
  },
  {
    id: 'ast-05',
    name: 'State Highway SH-12 Coastal Evacuation Arterial',
    type: 'road',
    lat: 20.47,
    lng: 86.87,
    risk_score: 92,
    criticality: 'critical',
    hazard_exposure: 'Kilometer 12 to 16 completely flooded by 0.9m surge water; 3 tree blockages',
    current_status: 'isolated',
    elevation: 1.8,
    in_flood_zone: true,
    recommended_actions: [
      'Issue immediate route closure and divert all traffic to Elevated Corridor 2',
      'Deploy PWD chainsaw disaster clearance teams to clear km 14.5 fallen banyan tree',
      'Place high-visibility solar hazard flashers at diversion points'
    ],
    action_status: {
      'Issue immediate route closure and divert all traffic to Elevated Corridor 2': true,
      'Deploy PWD chainsaw disaster clearance teams to clear km 14.5 fallen banyan tree': false,
      'Place high-visibility solar hazard flashers at diversion points': true
    },
    contact_person: 'Inspector M. Das (Traffic & Evacuation Control)',
    backup_power_ready: false
  },
  {
    id: 'ast-06',
    name: 'Sundar Coastal Port & Container Terminal',
    type: 'port',
    lat: 20.30,
    lng: 86.64,
    risk_score: 79,
    criticality: 'high',
    hazard_exposure: 'Sea state Category 8 (waves 5-7m); extreme wind shear on gantry cranes',
    current_status: 'shut_down',
    elevation: 3.5,
    in_flood_zone: true,
    recommended_actions: [
      'Suspend all vessel berthing and move cargo ships to deep-sea outer anchorage',
      'Lock down and anchor rail-mounted quay cranes',
      'Secure hazardous chemical containers in ISO-certified bunded warehouses'
    ],
    action_status: {
      'Suspend all vessel berthing and move cargo ships to deep-sea outer anchorage': true,
      'Lock down and anchor rail-mounted quay cranes': true,
      'Secure hazardous chemical containers in ISO-certified bunded warehouses': true
    },
    contact_person: 'Capt. R. Mohanty (Harbour Master)',
    backup_power_ready: true
  },
  {
    id: 'ast-07',
    name: 'Sundar City Central Water Treatment Plant (45 MLD)',
    type: 'water_treatment',
    lat: 20.53,
    lng: 86.80,
    risk_score: 65,
    criticality: 'high',
    hazard_exposure: 'High river turbidity (>400 NTU) due to upstream storm runoff; pump chamber safety',
    current_status: 'operational',
    elevation: 5.1,
    in_flood_zone: false,
    recommended_actions: [
      'Stockpile 15 metric tons of alum and chlorine disinfection tablets',
      'Test emergency gravity feed valve for rural water supply tankers',
      'Secure raw water intake floating booms against cyclone debris'
    ],
    action_status: {
      'Stockpile 15 metric tons of alum and chlorine disinfection tablets': true,
      'Test emergency gravity feed valve for rural water supply tankers': false,
      'Secure raw water intake floating booms against cyclone debris': false
    },
    contact_person: 'Er. N. C. Rout (PHED Water Division)',
    backup_power_ready: true
  },
  {
    id: 'ast-08',
    name: 'Telecom Repeater Hub & BSNL Master Tower (120m)',
    type: 'telecom',
    lat: 20.51,
    lng: 86.86,
    risk_score: 73,
    criticality: 'critical',
    hazard_exposure: 'Wind loads approaching 140 km/h; battery bank charging dependency',
    current_status: 'operational',
    elevation: 6.2,
    in_flood_zone: false,
    recommended_actions: [
      'Activate Satellite Emergency Communication terminal (HAM Radio link ready)',
      'Fuel primary generator with 72-hour diesel reserve',
      'Enable inter-carrier roaming across all mobile networks for SOS alerts'
    ],
    action_status: {
      'Activate Satellite Emergency Communication terminal (HAM Radio link ready)': true,
      'Fuel primary generator with 72-hour diesel reserve': true,
      'Enable inter-carrier roaming across all mobile networks for SOS alerts': true
    },
    contact_person: 'R. K. Sahoo (Telecom Disaster Officer)',
    backup_power_ready: true
  }
];
