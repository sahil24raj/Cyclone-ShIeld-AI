import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  SystemDataSources,
  DataSourceStatus,
  DataProvenance
} from '../types/provenance';
import { weatherService, WeatherObservation } from '../services/weatherService';
import { cycloneService, ActiveCyclone } from '../services/cycloneService';
import { predictionService, MLPredictionOutput } from '../services/predictionService';
import { infrastructureService } from '../services/infrastructureService';
import { historicalService } from '../services/historicalService';

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
  
  // Real Service State
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
    status: 'not_configured',
    dataType: 'OBSERVATION',
    details: 'WMO compliant station observations & surface analysis.',
    envVarKey: 'VITE_WEATHER_API_URL',
  },
  cyclone: {
    id: 'src-cyclone',
    name: 'Active Tropical Cyclone Feed',
    provider: 'IMD / JTWC RSMC Bulletins',
    status: 'not_configured',
    dataType: 'OFFICIAL_FORECAST',
    details: 'Official tropical cyclone warnings and forecast cones.',
    envVarKey: 'VITE_CYCLONE_FEED_URL',
  },
  mlModel: {
    id: 'src-ml',
    name: 'Intensity & Risk ML Service',
    provider: 'CycloneShield ML Inference Engine',
    status: 'not_configured',
    dataType: 'ML_PREDICTION',
    details: 'Custom PyTorch/XGBoost model serving container.',
    envVarKey: 'VITE_ML_SERVICE_URL',
  },
  geospatial: {
    id: 'src-geo',
    name: 'Critical Infrastructure Layer',
    provider: 'OSDMA / State GIS Hub',
    status: 'not_configured',
    dataType: 'OBSERVATION',
    details: 'Hospitals, substations, bridges, shelters, and routes.',
    envVarKey: 'VITE_INFRASTRUCTURE_GEOJSON_URL',
  },
  population: {
    id: 'src-pop',
    name: 'Ward Census & Demographics',
    provider: 'Census of India / District Administration',
    status: 'not_configured',
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
    sender: 'CycloneShield Operations Desk',
    sent: new Date().toISOString(),
    status: 'Draft',
    msgType: 'Alert',
    event: 'Derived Coastal Surge Advisory',
    urgency: 'Immediate',
    severity: 'Critical',
    certainty: 'Likely',
    category: 'Safety',
    headline: 'Mandatory Evacuation Advisory for Low-Lying Coastal Sectors',
    description:
      'Hydrodynamic storm surge modeling indicates potential water depth overtopping 2.0m AMSL. Prepare pre-emptive evacuation to multi-purpose cyclone shelters.',
    instruction:
      'Follow official district administration advisories. Do not attempt flooded coastal arterial roads. Use elevated bypass routes.',
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
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CriticalAsset | null>(null);
  const [simulationParams, setSimulationParams] = useState<SimulationParameters>(DEFAULT_SIM_PARAMS);
  const [mapLayers, setMapLayers] = useState<MapLayerConfig>(DEFAULT_MAP_LAYERS);
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('dark');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Service State
  const [activeCyclone, setActiveCyclone] = useState<ActiveCyclone | null>(null);
  const [weather, setWeather] = useState<WeatherObservation | null>(null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [assets, setAssets] = useState<CriticalAsset[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [evacuationRoutes, setEvacuationRoutes] = useState<EvacuationRoute[]>([]);
  const [historicalEvents, setHistoricalEvents] = useState<HistoricalCycloneEvent[]>([]);
  const [prediction, setPrediction] = useState<MLPredictionOutput | null>(null);
  const [dataSources, setDataSources] = useState<SystemDataSources>(INITIAL_DATA_SOURCES);
  const [alerts, setAlerts] = useState<CAPAlert[]>(INITIAL_ALERTS);

  const isFixtureMode = import.meta.env.VITE_ENABLE_DEV_FIXTURES === 'true';

  const refreshData = useCallback(async () => {
    setIsLoading(true);

    try {
      // 1. Fetch Weather
      const weatherRes = await weatherService.getObservation(19.82, 85.88);
      setWeather(weatherRes.data);

      // 2. Fetch Cyclone
      const cycloneRes = await cycloneService.getActiveCyclone();
      setActiveCyclone(cycloneRes.data);

      // 3. Fetch Infrastructure & Population
      const [villagesRes, assetsRes, sheltersRes, routesRes] = await Promise.all([
        infrastructureService.getVillages(),
        infrastructureService.getCriticalAssets(),
        infrastructureService.getShelters(),
        infrastructureService.getEvacuationRoutes(),
      ]);

      setVillages(villagesRes.data || []);
      setAssets(assetsRes.data || []);
      setShelters(sheltersRes.data || []);
      setEvacuationRoutes(routesRes.data || []);

      // 4. Fetch Historical
      const histRes = await historicalService.getHistoricalEvents();
      setHistoricalEvents(histRes.data || []);

      // 5. Query ML Prediction Service
      const predRes = await predictionService.predict({
        latitude: 19.82,
        longitude: 85.88,
        pressure: weatherRes.data?.pressure || 978,
        temperature: weatherRes.data?.temperature || 28,
        humidity: weatherRes.data?.humidity || 90,
        windSpeed: weatherRes.data?.windSpeed || 135,
        windDirection: weatherRes.data?.windDirection || 110,
        rainfall: weatherRes.data?.precipitation || 280,
      });
      setPrediction(predRes.data);

      // Update System Data Source Statuses
      setDataSources({
        weather: {
          ...INITIAL_DATA_SOURCES.weather,
          status: weatherRes.isConfigured ? (isFixtureMode ? 'fixture_mode' : 'connected') : 'not_configured',
          lastSync: weatherRes.updatedAt,
        },
        cyclone: {
          ...INITIAL_DATA_SOURCES.cyclone,
          status: cycloneRes.data
            ? (isFixtureMode ? 'fixture_mode' : 'connected')
            : (cycloneRes.isConfigured ? 'no_active_event' : 'not_configured'),
          lastSync: cycloneRes.updatedAt,
        },
        mlModel: {
          ...INITIAL_DATA_SOURCES.mlModel,
          status: predRes.data?.predictionAvailable ? 'connected' : 'not_configured',
          lastSync: predRes.updatedAt,
          details: predRes.data?.predictionAvailable ? 'ML model actively scoring features.' : 'AI prediction model not connected.',
        },
        geospatial: {
          ...INITIAL_DATA_SOURCES.geospatial,
          status: assetsRes.isConfigured ? (isFixtureMode ? 'fixture_mode' : 'connected') : 'not_configured',
          lastSync: assetsRes.updatedAt,
        },
        population: {
          ...INITIAL_DATA_SOURCES.population,
          status: villagesRes.isConfigured ? (isFixtureMode ? 'fixture_mode' : 'connected') : 'not_configured',
          lastSync: villagesRes.updatedAt,
        },
        historical: {
          ...INITIAL_DATA_SOURCES.historical,
          status: 'connected',
          lastSync: histRes.updatedAt,
        },
      });

    } catch (err) {
      console.error('Data pipeline error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isFixtureMode]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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
    const found = villages.find(
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
