export type DataType = 
  | 'OBSERVATION' 
  | 'OFFICIAL_FORECAST' 
  | 'HISTORICAL' 
  | 'ML_PREDICTION' 
  | 'DERIVED_ANALYSIS';

export interface DataProvenance {
  source: string;
  sourceURL?: string;
  retrievedAt: string;
  observationTime?: string;
  dataType: DataType;
  confidence?: number;
  isFixture?: boolean;
  notes?: string;
}

export type ConnectionStatus = 'connected' | 'not_configured' | 'error' | 'fixture_mode' | 'no_active_event';

export interface DataSourceStatus {
  id: string;
  name: string;
  provider: string;
  status: ConnectionStatus;
  lastSync?: string;
  dataType: DataType;
  details?: string;
  requiresApiKey?: boolean;
  envVarKey?: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  source?: DataProvenance;
  updatedAt: string;
  isConfigured: boolean;
}

export interface SystemDataSources {
  weather: DataSourceStatus;
  cyclone: DataSourceStatus;
  mlModel: DataSourceStatus;
  geospatial: DataSourceStatus;
  population: DataSourceStatus;
  historical: DataSourceStatus;
}
