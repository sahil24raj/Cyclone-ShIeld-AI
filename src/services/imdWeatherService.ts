/**
 * IMD (India Meteorological Department) Official API Client Service
 * 
 * Endpoints:
 * 1. Current Weather: https://api.imd.gov.in/api/v1/current_wx
 * 2. City Forecast: https://api.imd.gov.in/api/v1/cityforecast?id={stationId}
 * 3. District Nowcast: https://api.imd.gov.in/api/v1/districtnowcast
 * 4. District Rainfall: https://api.imd.gov.in/api/v1/districtrainfall
 * 5. Subdivision Rainfall Forecast: https://api.imd.gov.in/api/v1/subdivision_rainfall_forecast
 * 6. City Forecast Mapping: https://api.imd.gov.in/api/v1/cityforecast_mapping
 * 
 * Auth Requirement:
 * - Header `x-api-key`: IMD API Key
 * - Header `Authorization`: `Bearer <TOKEN>`
 */

import { ServiceResponse, DataProvenance } from '../types/provenance';

export interface IMDCurrentWxRecord {
  Station_Id?: string;
  Station_Name?: string;
  State?: string;
  Date_Time?: string;
  Temp?: string | number;
  RH?: string | number;
  MSLP?: string | number;
  Wind_Speed?: string | number;
  Wind_Direction?: string | number;
  Gust?: string | number;
  Rainfall?: string | number;
  Weather_Condition?: string;
  [key: string]: any;
}

export interface IMDCityForecastRecord {
  Station_Id?: string;
  Station_Name?: string;
  Forecast_Date?: string;
  Max_Temp?: string | number;
  Min_Temp?: string | number;
  Rainfall_Forecast?: string;
  Weather_Warning?: string;
  [key: string]: any;
}

export interface IMDNowcastRecord {
  District_Name?: string;
  State_Name?: string;
  Issue_Time?: string;
  Valid_Upto?: string;
  Warning_Type?: string;
  Warning_Severity?: 'Yellow' | 'Orange' | 'Red' | 'Green' | string;
  Warning_Text?: string;
  [key: string]: any;
}

export interface IMDDistrictRainfallRecord {
  District?: string;
  State?: string;
  Actual_Rainfall_mm?: number;
  Normal_Rainfall_mm?: number;
  Departure_Percentage?: number;
  Date?: string;
  [key: string]: any;
}

export interface IMDSubdivisionForecastRecord {
  Subdivision_Name?: string;
  Forecast_Day1?: string;
  Forecast_Day2?: string;
  Forecast_Day3?: string;
  Forecast_Day4?: string;
  Forecast_Day5?: string;
  [key: string]: any;
}

export interface IMDCityMappingRecord {
  id: string | number;
  station_name: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export class IMDWeatherService {
  private static BASE_URL = 'https://api.imd.gov.in/api/v1';

  private static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    const apiKey = import.meta.env.VITE_IMD_API_KEY;
    const bearerToken = import.meta.env.VITE_IMD_AUTH_TOKEN || import.meta.env.VITE_IMD_BEARER_TOKEN;

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    if (bearerToken) {
      headers['Authorization'] = bearerToken.startsWith('Bearer ') ? bearerToken : `Bearer ${bearerToken}`;
    }

    return headers;
  }

  /**
   * 1. Get Current Weather from IMD Surface Observation Network
   */
  public static async getCurrentWeather(stationId?: string): Promise<ServiceResponse<IMDCurrentWxRecord[]>> {
    const startTime = performance.now();
    const endpoint = `${this.BASE_URL}/current_wx`;
    const isConfigured = !!import.meta.env.VITE_IMD_API_KEY;

    try {
      const res = await fetch(endpoint, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`IMD API HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const records: IMDCurrentWxRecord[] = Array.isArray(data) ? data : data.data || [data];
      const filtered = stationId ? records.filter(r => r.Station_Id === stationId) : records;

      return {
        success: true,
        data: filtered,
        source: {
          source: 'IMD National Current Weather Surface Network',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OBSERVATION',
          licence: 'Government of India - Open Access Meteorological Feed',
        },
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
        recordCount: filtered.length,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        source: {
          source: 'IMD National Current Weather',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OBSERVATION',
        },
        error: err.message || 'IMD current weather request failed',
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  /**
   * 2. Get 7-Day City Forecast
   */
  public static async getCityForecast(stationId: string = '42182'): Promise<ServiceResponse<IMDCityForecastRecord[]>> {
    const startTime = performance.now();
    const endpoint = `${this.BASE_URL}/cityforecast?id=${stationId}`;
    const isConfigured = !!import.meta.env.VITE_IMD_API_KEY;

    try {
      const res = await fetch(endpoint, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`IMD API HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const records: IMDCityForecastRecord[] = Array.isArray(data) ? data : data.data || [data];

      return {
        success: true,
        data: records,
        source: {
          source: 'IMD Regional Meteorological Centre (RMC) City Forecast',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OFFICIAL_FORECAST',
        },
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
        recordCount: records.length,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        source: {
          source: 'IMD City Forecast',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OFFICIAL_FORECAST',
        },
        error: err.message || 'IMD City Forecast request failed',
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  /**
   * 3. Get District Nowcasts (Thunderstorm / Gale / Cyclone Alert Advisories)
   */
  public static async getDistrictNowcast(): Promise<ServiceResponse<IMDNowcastRecord[]>> {
    const startTime = performance.now();
    const endpoint = `${this.BASE_URL}/districtnowcast`;
    const isConfigured = !!import.meta.env.VITE_IMD_API_KEY;

    try {
      const res = await fetch(endpoint, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`IMD API HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const records: IMDNowcastRecord[] = Array.isArray(data) ? data : data.data || [data];

      return {
        success: true,
        data: records,
        source: {
          source: 'IMD District Nowcasting & Severe Weather Warning Desk',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OFFICIAL_FORECAST',
        },
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
        recordCount: records.length,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        source: {
          source: 'IMD District Nowcast',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OFFICIAL_FORECAST',
        },
        error: err.message || 'IMD Nowcast request failed',
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  /**
   * 4. Get District Rainfall Accumulation
   */
  public static async getDistrictRainfall(): Promise<ServiceResponse<IMDDistrictRainfallRecord[]>> {
    const startTime = performance.now();
    const endpoint = `${this.BASE_URL}/districtrainfall`;
    const isConfigured = !!import.meta.env.VITE_IMD_API_KEY;

    try {
      const res = await fetch(endpoint, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`IMD API HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const records: IMDDistrictRainfallRecord[] = Array.isArray(data) ? data : data.data || [data];

      return {
        success: true,
        data: records,
        source: {
          source: 'IMD National Hydrometeorological Data Centre (District Rainfall)',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OBSERVATION',
        },
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
        recordCount: records.length,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        source: {
          source: 'IMD District Rainfall',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OBSERVATION',
        },
        error: err.message || 'IMD District Rainfall request failed',
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  /**
   * 5. Get Meteorological Subdivision Rainfall Forecast
   */
  public static async getSubdivisionForecast(): Promise<ServiceResponse<IMDSubdivisionForecastRecord[]>> {
    const startTime = performance.now();
    const endpoint = `${this.BASE_URL}/subdivision_rainfall_forecast`;
    const isConfigured = !!import.meta.env.VITE_IMD_API_KEY;

    try {
      const res = await fetch(endpoint, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`IMD API HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const records: IMDSubdivisionForecastRecord[] = Array.isArray(data) ? data : data.data || [data];

      return {
        success: true,
        data: records,
        source: {
          source: 'IMD Meteorological Subdivision Rainfall Outlook',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OFFICIAL_FORECAST',
        },
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
        recordCount: records.length,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        source: {
          source: 'IMD Subdivision Rainfall Forecast',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'OFFICIAL_FORECAST',
        },
        error: err.message || 'IMD Subdivision forecast request failed',
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  /**
   * 6. Get City Forecast Station Mappings
   */
  public static async getCityMapping(): Promise<ServiceResponse<IMDCityMappingRecord[]>> {
    const startTime = performance.now();
    const endpoint = `${this.BASE_URL}/cityforecast_mapping`;
    const isConfigured = !!import.meta.env.VITE_IMD_API_KEY;

    try {
      const res = await fetch(endpoint, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`IMD API HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const records: IMDCityMappingRecord[] = Array.isArray(data) ? data : data.data || [data];

      return {
        success: true,
        data: records,
        source: {
          source: 'IMD City Forecast Station Directory',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'HISTORICAL',
        },
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
        recordCount: records.length,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        source: {
          source: 'IMD City Mapping',
          sourceURL: endpoint,
          retrievedAt: new Date().toISOString(),
          dataType: 'HISTORICAL',
        },
        error: err.message || 'IMD City Mapping request failed',
        updatedAt: new Date().toISOString(),
        isConfigured,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }
}
