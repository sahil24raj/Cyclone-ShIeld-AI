import { CriticalAsset } from '../types';

export const FIXTURE_ASSETS: (CriticalAsset & { isFixture: true })[] = [
  {
    id: 'A01',
    name: 'Sundar District General Hospital',
    type: 'hospital',
    lat: 19.83,
    lng: 85.86,
    risk_score: 84,
    criticality: 'critical',
    hazard_exposure: 'Projected 1.4m surge inundation on ground floor ICU/NICU ward. High risk of basement auxiliary generator flooding.',
    current_status: 'alert',
    elevation: 2.2,
    in_flood_zone: true,
    recommended_actions: [
      'Relocate ICU & neonatal patients to 2nd floor surgical ward',
      'Elevate auxiliary diesel generator fuel lines above 2.5m mark',
      'Pre-position 72-hour emergency surgical blood & O2 cylinders',
      'Deploy portable water pump at emergency bay entrance'
    ],
    action_status: {
      'Relocate ICU & neonatal patients to 2nd floor surgical ward': true,
      'Elevate auxiliary diesel generator fuel lines above 2.5m mark': false,
      'Pre-position 72-hour emergency surgical blood & O2 cylinders': true,
      'Deploy portable water pump at emergency bay entrance': false,
    },
    contact_person: 'Dr. A. K. Patnaik (Chief Medical Superintendent - 9437012345)',
    backup_power_ready: true,
    isFixture: true
  },
  {
    id: 'A02',
    name: '220/33kV Coastal Main Substation',
    type: 'power_substation',
    lat: 19.85,
    lng: 85.89,
    risk_score: 91,
    criticality: 'critical',
    hazard_exposure: 'Direct exposure to 140 km/h coastal gale winds and salt spray flashover. Switchyard drainage trench vulnerable to surge backflow.',
    current_status: 'at_risk',
    elevation: 1.9,
    in_flood_zone: true,
    recommended_actions: [
      'Pre-emptively de-energize exposed 33kV coastal Feeder 3 & 4',
      'Seal control room cable trenches with rapid-setting polymer barrier',
      'Switch essential district load to inland 132kV Grid 2',
      'Position mobile transformer unit at elevated North Cantonment yard'
    ],
    action_status: {
      'Pre-emptively de-energize exposed 33kV coastal Feeder 3 & 4': true,
      'Seal control room cable trenches with rapid-setting polymer barrier': false,
      'Switch essential district load to inland 132kV Grid 2': false,
      'Position mobile transformer unit at elevated North Cantonment yard': false,
    },
    contact_person: 'Er. Rajesh Panda (Superintending Engineer - 9437098765)',
    backup_power_ready: false,
    isFixture: true
  },
  {
    id: 'A03',
    name: 'SH-12 Tidal Estuary Bridge',
    type: 'bridge',
    lat: 19.81,
    lng: 85.84,
    risk_score: 88,
    criticality: 'critical',
    hazard_exposure: 'Tidal surge piling at river mouth approaching pier cap clearance (0.4m remaining). Approach road Km 14 submerged under 0.8m seawater.',
    current_status: 'isolated',
    elevation: 1.5,
    in_flood_zone: true,
    recommended_actions: [
      'Suspend all heavy commercial vehicular traffic immediately',
      'Divert civilian evacuation convoys to Elevated Corridor 2',
      'Deploy structural scour acoustic sensors on pier foundations',
      'Position emergency recovery tow trucks on both bridgeheads'
    ],
    action_status: {
      'Suspend all heavy commercial vehicular traffic immediately': true,
      'Divert civilian evacuation convoys to Elevated Corridor 2': true,
      'Deploy structural scour acoustic sensors on pier foundations': true,
      'Position emergency recovery tow trucks on both bridgeheads': false,
    },
    contact_person: 'NHAI / State PWD Emergency Cell (0674-2390112)',
    backup_power_ready: true,
    isFixture: true
  },
  {
    id: 'A04',
    name: 'Sundar Port Water Treatment Plant',
    type: 'water_treatment',
    lat: 19.76,
    lng: 85.81,
    risk_score: 76,
    criticality: 'high',
    hazard_exposure: 'Raw water intake pump house subject to saline intrusion and power tripping. Backwash basin overflow risk.',
    current_status: 'alert',
    elevation: 2.6,
    in_flood_zone: true,
    recommended_actions: [
      'Fill 10MLD elevated clear water reservoir to 100% capacity',
      'Stockpile 5 metric tons of emergency water purification chlorine',
      'Switch intake pumps to auxiliary diesel power bank',
      'Issue municipal advisory to boil stored water before drinking'
    ],
    action_status: {
      'Fill 10MLD elevated clear water reservoir to 100% capacity': true,
      'Stockpile 5 metric tons of emergency water purification chlorine': true,
      'Switch intake pumps to auxiliary diesel power bank': true,
      'Issue municipal advisory to boil stored water before drinking': false,
    },
    contact_person: 'Public Health Engineering Dept (PHED - 0674-2394455)',
    backup_power_ready: true,
    isFixture: true
  },
  {
    id: 'A05',
    name: 'BSNL 120m District Telecom Tower',
    type: 'telecom',
    lat: 19.87,
    lng: 85.87,
    risk_score: 65,
    criticality: 'high',
    hazard_exposure: 'High wind loading on microwave antennas. Optical fiber backhaul cable route along SH-12 at risk of washout.',
    current_status: 'operational',
    elevation: 4.1,
    in_flood_zone: false,
    recommended_actions: [
      'Enable inter-carrier national emergency roaming (NER) protocol',
      'Verify satellite bandwidth fallback for District Collectorate EOC',
      'Tie down lattice guy wires and check battery bank backup hours',
      'Pre-stage mobile COW (Cell on Wheels) at Relief Camp E'
    ],
    action_status: {
      'Enable inter-carrier national emergency roaming (NER) protocol': true,
      'Verify satellite bandwidth fallback for District Collectorate EOC': false,
      'Tie down lattice guy wires and check battery bank backup hours': true,
      'Pre-stage mobile COW (Cell on Wheels) at Relief Camp E': false,
    },
    contact_person: 'Telecom Enforcement Resource (TERM Cell - 9437155667)',
    backup_power_ready: true,
    isFixture: true
  },
  {
    id: 'A06',
    name: 'District Community Shelter Hub B',
    type: 'shelter',
    lat: 19.84,
    lng: 85.83,
    risk_score: 38,
    criticality: 'critical',
    hazard_exposure: 'Engineered RCC cyclone shelter at 4.5m AMSL. Outside direct surge zone; high wind buffeting on upper floor windows.',
    current_status: 'operational',
    elevation: 4.5,
    in_flood_zone: false,
    recommended_actions: [
      'Verify 125kVA diesel generator fuel reserves (minimum 48 hours)',
      'Pre-position 5,000 ready-to-eat dry food packets and halogen lamps',
      'Deploy 2 medical teams with emergency trauma triage kits',
      'Set up separate maternal care & infant nursing enclosure'
    ],
    action_status: {
      'Verify 125kVA diesel generator fuel reserves (minimum 48 hours)': true,
      'Pre-position 5,000 ready-to-eat dry food packets and halogen lamps': true,
      'Deploy 2 medical teams with emergency trauma triage kits': true,
      'Set up separate maternal care & infant nursing enclosure': true,
    },
    contact_person: 'Block Development Officer (BDO Coastal - 9437024680)',
    backup_power_ready: true,
    isFixture: true
  },
  {
    id: 'A07',
    name: 'Sundar Deep-Water Commercial Port',
    type: 'port',
    lat: 19.72,
    lng: 85.77,
    risk_score: 95,
    criticality: 'critical',
    hazard_exposure: 'Direct coastal exposure with 4.2m sea swell. Quay cranes and fuel storage terminal in critical flood zone.',
    current_status: 'shut_down',
    elevation: 1.2,
    in_flood_zone: true,
    recommended_actions: [
      'Suspend all berthing operations and anchor vessels in deep sea',
      'Secure gantry cranes with mechanical rail storm clamps',
      'Purge and shut down chemical and fuel bunkering pipelines',
      'Evacuate non-essential port staff to Port Admin Hill'
    ],
    action_status: {
      'Suspend all berthing operations and anchor vessels in deep sea': true,
      'Secure gantry cranes with mechanical rail storm clamps': true,
      'Purge and shut down chemical and fuel bunkering pipelines': true,
      'Evacuate non-essential port staff to Port Admin Hill': true,
    },
    contact_person: 'Port Conservator & Harbor Master (0674-2450099)',
    backup_power_ready: true,
    isFixture: true
  },
  {
    id: 'A08',
    name: 'SH-12 Coastal Highway Km 10-22',
    type: 'road',
    lat: 19.80,
    lng: 85.87,
    risk_score: 92,
    criticality: 'high',
    hazard_exposure: 'Multiple breaches and tidal overtopping. Embankment erosion along Km 14.2 causing road pavement collapse.',
    current_status: 'isolated',
    elevation: 1.4,
    in_flood_zone: true,
    recommended_actions: [
      'Erect physical roadblock barriers at Km 9.5 and Km 23.0',
      'Position police patrol units to enforce civilian detour compliance',
      'Deploy sandbag protection squads to arrest further shoulder erosion',
      'Pre-position asphalt repair cold-mix & excavators at North depot'
    ],
    action_status: {
      'Erect physical roadblock barriers at Km 9.5 and Km 23.0': true,
      'Position police patrol units to enforce civilian detour compliance': true,
      'Deploy sandbag protection squads to arrest further shoulder erosion': false,
      'Pre-position asphalt repair cold-mix & excavators at North depot': false,
    },
    contact_person: 'Executive Engineer (PWD Roads - 9437033445)',
    backup_power_ready: false,
    isFixture: true
  }
];
