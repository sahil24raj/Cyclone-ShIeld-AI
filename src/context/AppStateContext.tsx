import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Village, CriticalAsset, SimulationParameters, TimelinePhase, CAPAlert } from '../types';
import { MOCK_VILLAGES } from '../data/villageData';
import { MOCK_ASSETS } from '../data/infrastructureData';

export type ActiveTab =
  | 'command'
  | 'map'
  | 'evacuation'
  | 'infrastructure'
  | 'simulator'
  | 'briefing'
  | 'alert'
  | 'historical'
  | 'methodology';

export interface MapLayerConfig {
  cycloneTrack: boolean;
  forecastCone: boolean;
  windRadius: boolean;
  rainfall: boolean;
  stormSurge: boolean;
  floodExtent: boolean;
  elevation: boolean;
  populationDensity: boolean;
  criticalInfrastructure: boolean;
  evacuationRoutes: boolean;
}

export type BasemapStyle = 'dark' | 'satellite' | 'carto' | 'osm';

interface AppStateContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  timelinePhase: TimelinePhase;
  setTimelinePhase: (phase: TimelinePhase) => void;
  selectedVillage: Village | null;
  setSelectedVillage: (village: Village | null) => void;
  selectedAsset: CriticalAsset | null;
  setSelectedAsset: (asset: CriticalAsset | null) => void;
  simulationParams: SimulationParameters;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParameters>>;
  resetSimulationParams: () => void;
  mapLayers: MapLayerConfig;
  toggleMapLayer: (layerKey: keyof MapLayerConfig) => void;
  basemapStyle: BasemapStyle;
  setBasemapStyle: (style: BasemapStyle) => void;
  assets: CriticalAsset[];
  toggleAssetAction: (assetId: string, actionKey: string) => void;
  alerts: CAPAlert[];
  addAlert: (alert: CAPAlert) => void;
  updateAlertStatus: (id: string, status: CAPAlert['status']) => void;
  openVillageRiskDetail: (villageNameOrId: string) => void;
  openAssetDetail: (assetId: string) => void;
}

const DEFAULT_MAP_LAYERS: MapLayerConfig = {
  cycloneTrack: true,
  forecastCone: true,
  windRadius: true,
  rainfall: false,
  stormSurge: true,
  floodExtent: true,
  elevation: false,
  populationDensity: false,
  criticalInfrastructure: true,
  evacuationRoutes: true,
};

const DEFAULT_SIM_PARAMS: SimulationParameters = {
  windSpeedMultiplier: 1.0,
  rainfallMultiplier: 1.0,
  surgeHeightOffset: 0.0,
  trackShiftKm: 0,
  landfallTimeShiftHours: 0,
};

const INITIAL_ALERTS: CAPAlert[] = [
  {
    identifier: 'CSAI-2026-001',
    sender: 'CycloneShield AI Prototype',
    sent: '2026-09-22T06:00:00+05:30',
    status: 'Approved',
    msgType: 'Alert',
    event: 'Prototype Severe Storm Surge & Inundation Advisory',
    urgency: 'Immediate',
    severity: 'Critical',
    certainty: 'Likely',
    category: 'Safety',
    headline: 'Mandatory Evacuation Order for Coastal Sector (Wards 7 & Delta Nagar)',
    description:
      'AI storm surge model predicts up to 3.4m surge inundation with road cutoffs along SH-12. Primary shelter access is blocked. Move immediately to designated safe multi-purpose shelters.',
    instruction:
      'Follow official district administration instructions. Do not attempt SH-12 coastal highway. Use Elevated Route 2 to reach Shelter B (Model High School Complex).',
    areaDesc: 'Sundar Coast District - Coastal Sectors 1-4',
    affectedVillages: ['Coastal Ward 7', 'Delta Nagar', 'Mangrove Hamlet'],
    channels: ['SMS', 'Sirens', 'WhatsApp', 'Megaphone'],
    language: 'en',
  },
  {
    identifier: 'CSAI-2026-002',
    sender: 'CycloneShield AI Prototype',
    sent: '2026-09-22T08:15:00+05:30',
    status: 'Draft',
    msgType: 'Alert',
    event: 'Critical Infrastructure Power & Medical Safety Alert',
    urgency: 'Expected',
    severity: 'Severe',
    certainty: 'Observed',
    category: 'Infra',
    headline: 'De-energize 33kV Coastal Feeders & Elevate Medical ICU Equipment',
    description:
      'Predicted flood water ingress at 220/33kV Substation trench and District General Hospital Ground Floor within 12 hours.',
    instruction:
      'Switch hospital ICU to Level 2 auxiliary generator. Isolate coastal electrical feeder circuits 3 and 4 prior to peak surge.',
    areaDesc: 'District Hospital & Coastal Substation Zone',
    affectedVillages: ['Sundar Pur', 'Coastal Ward 7'],
    channels: ['VHF_Radio', 'SMS'],
    language: 'en',
  },
];

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command');
  const [timelinePhase, setTimelinePhase] = useState<TimelinePhase>('T-24h');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CriticalAsset | null>(null);
  const [simulationParams, setSimulationParams] = useState<SimulationParameters>(DEFAULT_SIM_PARAMS);
  const [mapLayers, setMapLayers] = useState<MapLayerConfig>(DEFAULT_MAP_LAYERS);
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('dark');
  const [assets, setAssets] = useState<CriticalAsset[]>(MOCK_ASSETS);
  const [alerts, setAlerts] = useState<CAPAlert[]>(INITIAL_ALERTS);

  const resetSimulationParams = () => {
    setSimulationParams(DEFAULT_SIM_PARAMS);
  };

  const toggleMapLayer = (layerKey: keyof MapLayerConfig) => {
    setMapLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const toggleAssetAction = (assetId: string, actionKey: string) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== assetId) return asset;
        const currentVal = !!asset.action_status[actionKey];
        return {
          ...asset,
          action_status: {
            ...asset.action_status,
            [actionKey]: !currentVal,
          },
        };
      })
    );
  };

  const addAlert = (alert: CAPAlert) => {
    setAlerts((prev) => [alert, ...prev]);
  };

  const updateAlertStatus = (id: string, status: CAPAlert['status']) => {
    setAlerts((prev) =>
      prev.map((a) => (a.identifier === id ? { ...a, status } : a))
    );
  };

  const openVillageRiskDetail = (villageNameOrId: string) => {
    const found = MOCK_VILLAGES.find(
      (v) => v.id === villageNameOrId || v.name.toLowerCase() === villageNameOrId.toLowerCase()
    );
    if (found) {
      setSelectedVillage(found);
      setSelectedAsset(null);
    }
  };

  const openAssetDetail = (assetId: string) => {
    const found = assets.find((a) => a.id === assetId);
    if (found) {
      setSelectedAsset(found);
      setSelectedVillage(null);
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        timelinePhase,
        setTimelinePhase,
        selectedVillage,
        setSelectedVillage,
        selectedAsset,
        setSelectedAsset,
        simulationParams,
        setSimulationParams,
        resetSimulationParams,
        mapLayers,
        toggleMapLayer,
        basemapStyle,
        setBasemapStyle,
        assets,
        toggleAssetAction,
        alerts,
        addAlert,
        updateAlertStatus,
        openVillageRiskDetail,
        openAssetDetail,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
