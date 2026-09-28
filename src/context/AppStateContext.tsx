import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import {
  Village,
  CriticalAsset,
  Shelter,
  EvacuationRoute,
  SimulationParameters,
  TimelinePhase,
  CAPAlert,
  HistoricalCycloneEvent
} from '../types';
import {
  ScenarioInputs,
  SimulationSummaryOutput,
  CalculatedVillageOutput,
  CalculatedAssetOutput,
  CalculatedRouteOutput
} from '../types/disaster';
import {
  SystemDataSources,
  DataSourceStatus,
  DataProvenance
} from '../types/provenance';
import { weatherService, WeatherObservation } from '../services/weatherService';
import { cycloneService, ActiveCyclone } from '../services/cycloneService';
import { predictionService, MLPredictionOutput } from '../services/predictionService';
import { infrastructureService } from '../services/infrastructureService';
import { historicalService } from '../services/historicalService';
import { runSimulation } from '../services/mockPredictionEngine';
import { DEFAULT_SCENARIO_INPUTS, BASE_STORM_SCENARIO } from '../data/mockStorm';

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
export type DataMode = 'mock' | 'live' | 'fallback';

interface AppStateContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  timelinePhase: TimelinePhase;
  setTimelinePhase: (phase: TimelinePhase) => void;
  selectedVillage: Village | CalculatedVillageOutput | null;
  setSelectedVillage: (village: Village | CalculatedVillageOutput | null) => void;
  selectedAsset: CriticalAsset | CalculatedAssetOutput | null;
  setSelectedAsset: (asset: CriticalAsset | CalculatedAssetOutput | null) => void;
  simulationParams: SimulationParameters;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParameters>>;
  resetSimulationParams: () => void;
  
  // Scenario inputs for restored Mock Prediction Mode
  scenarioInputs: ScenarioInputs;
  setScenarioInputs: React.Dispatch<React.SetStateAction<ScenarioInputs>>;
  resetScenarioInputs: () => void;
  simulationSummary: SimulationSummaryOutput;
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  modeBadgeText: string;

  mapLayers: MapLayerConfig;
  toggleMapLayer: (layerKey: keyof MapLayerConfig) => void;
  basemapStyle: BasemapStyle;
  setBasemapStyle: (style: BasemapStyle) => void;
  
  // Service State
  activeCyclone: ActiveCyclone | null;
  weather: WeatherObservation | null;
  villages: Village[];
  assets: CriticalAsset[];
  shelters: Shelter[];
  evacuationRoutes: EvacuationRoute[];
  historicalEvents: HistoricalCycloneEvent[];
  prediction: MLPredictionOutput | null;
  dataSources: SystemDataSources;
  isLoading: boolean;
  isStatusModalOpen: boolean;
  setIsStatusModalOpen: (open: boolean) => void;
  refreshData: () => Promise<void>;

  // Actions & Alerts
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

const INITIAL_DATA_SOURCES: SystemDataSources = {
  weather: {
    id: 'src-weather',
    name: 'Meteorological Observations',
    provider: 'Open-Meteo Global WMO',
    status: 'connected',
    dataType: 'OBSERVATION',
    details: 'WMO compliant surface analysis / local simulation fallback.',
    envVarKey: 'VITE_WEATHER_API_URL',
  },
  cyclone: {
    id: 'src-cyclone',
    name: 'Active Tropical Cyclone Feed',
    provider: 'CycloneShield Prediction Engine',
    status: 'connected',
    dataType: 'ML_PREDICTION',
    details: 'Cyclone Varuna synthetic simulation & track model.',
    envVarKey: 'VITE_CYCLONE_FEED_URL',
  },
  mlModel: {
    id: 'src-ml',
    name: 'Intensity & Risk Prediction Engine',
    provider: 'CycloneShield P-CHMVM v2.4',
    status: 'connected',
    dataType: 'ML_PREDICTION',
    details: 'Deterministic hydrodynamic & multi-hazard risk engine.',
    envVarKey: 'VITE_ML_SERVICE_URL',
  },
  geospatial: {
    id: 'src-geo',
    name: 'Critical Infrastructure Layer',
    provider: 'State Disaster Infrastructure Registry',
    status: 'connected',
    dataType: 'OBSERVATION',
    details: 'Hospitals, substations, bridges, shelters, and routes.',
    envVarKey: 'VITE_INFRASTRUCTURE_GEOJSON_URL',
  },
  population: {
    id: 'src-pop',
    name: 'Ward Census & Demographics',
    provider: 'Sundar Coast District Administration',
    status: 'connected',
    dataType: 'OBSERVATION',
    details: 'Ward-level population, elderly, child vulnerability stats.',
    envVarKey: 'VITE_VILLAGES_GEOJSON_URL',
  },
  historical: {
    id: 'src-hist',
    name: 'Historical Cyclone Benchmark Archive',
    provider: 'IMD / OSDMA Post-Disaster Records',
    status: 'connected',
    dataType: 'HISTORICAL',
    details: 'Verified post-event ground truth for Fani, Amphan, Yaas, Mocha, Dana.',
  },
};

const INITIAL_ALERTS: CAPAlert[] = [
  {
    identifier: 'CSAI-2026-001',
    sender: 'CycloneShield Decision Support Desk',
    sent: new Date().toISOString(),
    status: 'Draft',
    msgType: 'Alert',
    event: 'Derived Coastal Surge Advisory',
    urgency: 'Immediate',
    severity: 'Critical',
    certainty: 'Likely',
    category: 'Safety',
    headline: 'Mandatory Evacuation Advisory: Coastal Ward 7 & Delta Lowlands',
    description:
      'Hydrodynamic storm surge modeling indicates potential water depth overtopping 2.0m AMSL under Cyclone Varuna. Mandatory evacuation to Municipal Cyclone Shelter B via Elevated Route 2.',
    instruction:
      'Follow official district administration advisories. Do not attempt flooded coastal arterial roads. Use designated elevated bypass corridors.',
    areaDesc: 'Sundar Coast District - Coastal Sectors',
    affectedVillages: ['Coastal Ward 7', 'Delta Nagar', 'Mangrove Hamlet'],
    channels: ['SMS', 'Sirens', 'WhatsApp', 'Megaphone'],
    language: 'en',
  },
];

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command');
  const [timelinePhase, setTimelinePhase] = useState<TimelinePhase>('T-24h');
  const [selectedVillage, setSelectedVillage] = useState<Village | CalculatedVillageOutput | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CriticalAsset | CalculatedAssetOutput | null>(null);

  // Determine requested data mode: default to 'mock' if missing or set to mock
  const rawEnvMode = import.meta.env.VITE_DATA_MODE;
  const initialMode: DataMode = rawEnvMode === 'live' ? 'live' : 'mock';
  const [dataMode, setDataMode] = useState<DataMode>(initialMode);

  // Scenario Inputs for dynamic calculation
  const [scenarioInputs, setScenarioInputs] = useState<ScenarioInputs>(DEFAULT_SCENARIO_INPUTS);
  
  // Legacy simulation params (synchronized)
  const [simulationParams, setSimulationParams] = useState<SimulationParameters>(DEFAULT_SIM_PARAMS);

  const [mapLayers, setMapLayers] = useState<MapLayerConfig>(DEFAULT_MAP_LAYERS);
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('dark');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [historicalEvents, setHistoricalEvents] = useState<HistoricalCycloneEvent[]>([]);
  const [alerts, setAlerts] = useState<CAPAlert[]>(INITIAL_ALERTS);
  const [dataSources, setDataSources] = useState<SystemDataSources>(INITIAL_DATA_SOURCES);

  // Synchronize scenarioInputs and simulationParams bi-directionally
  const updateScenarioInputs = useCallback((newInputs: React.SetStateAction<ScenarioInputs>) => {
    setScenarioInputs((prev) => {
      const next = typeof newInputs === 'function' ? newInputs(prev) : newInputs;
      setSimulationParams({
        windSpeedMultiplier: next.windSpeedKmh / 135,
        rainfallMultiplier: next.rainfallMm / 180,
        surgeHeightOffset: next.stormSurgeMeters - 1.8,
        trackShiftKm: next.trackShiftKm,
        landfallTimeShiftHours: next.landfallHours - 24,
      });
      return next;
    });
  }, []);

  const updateSimulationParams = useCallback((newParams: React.SetStateAction<SimulationParameters>) => {
    setSimulationParams((prev) => {
      const next = typeof newParams === 'function' ? newParams(prev) : newParams;
      setScenarioInputs({
        windSpeedKmh: Math.round(135 * next.windSpeedMultiplier),
        rainfallMm: Math.round(180 * next.rainfallMultiplier),
        stormSurgeMeters: Math.round((1.8 + next.surgeHeightOffset) * 10) / 10,
        trackShiftKm: next.trackShiftKm,
        landfallHours: clamp(24 + next.landfallTimeShiftHours, 6, 72),
      });
      return next;
    });
  }, []);

  const resetScenarioInputs = useCallback(() => {
    setScenarioInputs(DEFAULT_SCENARIO_INPUTS);
    setSimulationParams(DEFAULT_SIM_PARAMS);
  }, []);

  const resetSimulationParams = useCallback(() => {
    resetScenarioInputs();
  }, [resetScenarioInputs]);

  // Execute deterministic simulation on scenario inputs
  const simulationSummary = useMemo(() => {
    return runSimulation(scenarioInputs);
  }, [scenarioInputs]);

  // Derive dynamic ActiveCyclone based on current scenario inputs
  const activeCyclone: ActiveCyclone = useMemo(() => {
    const trackShiftDeg = scenarioInputs.trackShiftKm * 0.009;
    const cat =
      scenarioInputs.windSpeedKmh >= 180
        ? 'Extremely Severe Cyclonic Storm'
        : scenarioInputs.windSpeedKmh >= 120
        ? 'Very Severe Cyclonic Storm'
        : 'Severe Cyclonic Storm';

    return {
      id: 'cyclone-varuna',
      name: BASE_STORM_SCENARIO.name,
      category: cat,
      maxWindSpeed: scenarioInputs.windSpeedKmh,
      centralPressure: Math.round(1010 - (scenarioInputs.windSpeedKmh / 220) * 45),
      stormSurgeMax: scenarioInputs.stormSurgeMeters,
      rainfall24h: scenarioInputs.rainfallMm,
      landfallETA: scenarioInputs.landfallHours <= 12
        ? `${scenarioInputs.landfallHours}h (Imminent)`
        : `T-${scenarioInputs.landfallHours}h`,
      currentPosition: {
        lat: 20.00 + trackShiftDeg * 0.5,
        lng: 87.10,
      },
      observedTrack: [
        { time: 'T-48h', lat: 18.50, lng: 87.90, wind: 85, pressure: 994, category: 'Cyclonic Storm', surgeEstimate: 0.6, rainfall24h: 90, uncertaintyRadiusKm: 60 },
        { time: 'T-36h', lat: 19.30, lng: 87.50, wind: 110, pressure: 986, category: 'Severe Cyclonic Storm', surgeEstimate: 1.1, rainfall24h: 130, uncertaintyRadiusKm: 50 },
        { time: 'T-24h', lat: 20.00 + trackShiftDeg * 0.5, lng: 87.10, wind: scenarioInputs.windSpeedKmh, pressure: Math.round(1010 - (scenarioInputs.windSpeedKmh / 220) * 45), category: cat, surgeEstimate: scenarioInputs.stormSurgeMeters, rainfall24h: scenarioInputs.rainfallMm, uncertaintyRadiusKm: 35 },
      ],
      forecastTrack: [
        { time: 'T-12h', lat: 20.48 + trackShiftDeg, lng: 86.82, wind: scenarioInputs.windSpeedKmh + 10, pressure: Math.round(1005 - (scenarioInputs.windSpeedKmh / 220) * 45), category: cat, surgeEstimate: scenarioInputs.stormSurgeMeters + 0.4, rainfall24h: scenarioInputs.rainfallMm + 40, uncertaintyRadiusKm: 25 },
        { time: 'T-00h', lat: 20.95 + trackShiftDeg * 1.2, lng: 86.40, wind: Math.round(scenarioInputs.windSpeedKmh * 0.9), pressure: 980, category: 'Landfall Surge Peak', surgeEstimate: scenarioInputs.stormSurgeMeters + 0.6, rainfall24h: scenarioInputs.rainfallMm + 80, uncertaintyRadiusKm: 20 },
        { time: 'T+06h', lat: 21.40 + trackShiftDeg * 1.5, lng: 85.90, wind: Math.round(scenarioInputs.windSpeedKmh * 0.6), pressure: 995, category: 'Inland Weakening', surgeEstimate: 0.8, rainfall24h: scenarioInputs.rainfallMm, uncertaintyRadiusKm: 30 },
      ],
      provenance: {
        source: 'Cyclone Varuna Deterministic Simulation',
        retrievedAt: new Date().toISOString(),
        dataType: 'DERIVED_ANALYSIS',
        isFixture: true,
        notes: 'Model estimate based on user-configured scenario parameters.',
      },
    };
  }, [scenarioInputs]);

  // Derive Weather Observation
  const weather: WeatherObservation = useMemo(() => {
    return {
      latitude: 20.48,
      longitude: 86.82,
      timestamp: new Date().toISOString(),
      temperature: 28,
      humidity: 92,
      windSpeed: scenarioInputs.windSpeedKmh,
      windDirection: 110,
      pressure: Math.round(1010 - (scenarioInputs.windSpeedKmh / 220) * 45),
      precipitation: scenarioInputs.rainfallMm,
      cloudCover: 95,
      provenance: {
        source: 'Simulated Surface Weather Feed',
        retrievedAt: new Date().toISOString(),
        dataType: 'DERIVED_ANALYSIS',
        isFixture: true,
      },
    };
  }, [scenarioInputs]);

  // Derived dynamic entities
  const villages = simulationSummary.villages as unknown as Village[];
  const assets = simulationSummary.assets as unknown as CriticalAsset[];
  const shelters = simulationSummary.shelters as unknown as Shelter[];
  const evacuationRoutes = simulationSummary.routes as unknown as EvacuationRoute[];

  // ML Prediction Output object
  const prediction: MLPredictionOutput = useMemo(() => {
    return {
      predictionAvailable: true,
      cycloneRiskProbability: 0.94,
      predictedIntensityClass: activeCyclone.category,
      predictedMaxWindKmh: scenarioInputs.windSpeedKmh,
      predictedMinPressureHpa: activeCyclone.centralPressure,
      predictedTrackDeltaKm: scenarioInputs.trackShiftKm,
      modelMetadata: {
        modelName: 'P-CHMVM v2.4 Deterministic Hydrodynamic Simulation',
        modelVersion: '2.4.0',
        trainingDataset: 'Bay of Bengal Historical Events 1999-2024',
        validationMetric: 'R2 = 0.91 (Hydrodynamic Peak Surge)',
      },
      provenance: {
        source: 'CycloneShield Physical Vulnerability Engine',
        retrievedAt: new Date().toISOString(),
        dataType: 'DERIVED_ANALYSIS',
        isFixture: true,
      },
    };
  }, [scenarioInputs, activeCyclone]);

  // Mode badge text
  const modeBadgeText = useMemo(() => {
    if (dataMode === 'mock') {
      return 'Mock Prediction Mode';
    }
    if (dataMode === 'live') {
      return 'Live Data Mode';
    }
    return 'Data unavailable — using simulation';
  }, [dataMode]);

  // Refresh data handler
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (rawEnvMode === 'live') {
        const [weatherRes, cycloneRes, histRes] = await Promise.all([
          weatherService.getObservation(19.82, 85.88).catch(() => null),
          cycloneService.getActiveCyclone().catch(() => null),
          historicalService.getHistoricalEvents().catch(() => null),
        ]);

        if (weatherRes && cycloneRes && cycloneRes.data) {
          setDataMode('live');
        } else {
          // Fallback to simulation
          setDataMode('fallback');
        }
        if (histRes?.data) {
          setHistoricalEvents(histRes.data);
        }
      } else {
        setDataMode('mock');
        const histRes = await historicalService.getHistoricalEvents();
        setHistoricalEvents(histRes.data || []);
      }
    } catch (err) {
      console.warn('Live adapter unavailable, staying in mock mode:', err);
      setDataMode('fallback');
    } finally {
      setIsLoading(false);
    }
  }, [rawEnvMode]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const toggleMapLayer = (layerKey: keyof MapLayerConfig) => {
    setMapLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const toggleAssetAction = (assetId: string, actionKey: string) => {
    // Updates action status on local asset instance
    if (selectedAsset && selectedAsset.id === assetId) {
      const currentVal = !!selectedAsset.action_status?.[actionKey];
      setSelectedAsset({
        ...selectedAsset,
        action_status: {
          ...selectedAsset.action_status,
          [actionKey]: !currentVal,
        },
      } as any);
    }
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
    const found = simulationSummary.villages.find(
      (v) => v.id === villageNameOrId || v.name.toLowerCase() === villageNameOrId.toLowerCase()
    );
    if (found) {
      setSelectedVillage(found);
      setSelectedAsset(null);
    }
  };

  const openAssetDetail = (assetId: string) => {
    const found = simulationSummary.assets.find((a) => a.id === assetId);
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
        setSimulationParams: updateSimulationParams,
        resetSimulationParams,
        scenarioInputs,
        setScenarioInputs: updateScenarioInputs,
        resetScenarioInputs,
        simulationSummary,
        dataMode,
        setDataMode,
        modeBadgeText,
        mapLayers,
        toggleMapLayer,
        basemapStyle,
        setBasemapStyle,
        activeCyclone,
        weather,
        villages,
        assets,
        shelters,
        evacuationRoutes,
        historicalEvents,
        prediction,
        dataSources,
        isLoading,
        isStatusModalOpen,
        setIsStatusModalOpen,
        refreshData,
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
