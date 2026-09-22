import { DataProvenance, ServiceResponse } from '../types/provenance';
import { IMDWeatherService, IMDCurrentWxRecord } from './imdWeatherService';

export interface WeatherObservation {
  latitude: number;
  longitude: number;
  timestamp: string;
  temperature: number; // °C
  humidity: number; // %
  pressure: number; // hPa
  precipitation: number; // mm
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGust?: number; // km/h
  cloudCover?: number; // %
  visibility?: number; // meters
  provenance: DataProvenance;
}

/**
 * Weather Service for fetching real-time meteorological observations.
 * Supports:
 * 1. Official IMD (India Meteorological Department) API Gateway:
 *    - Current Weather: https://api.imd.gov.in/api/v1/current_wx
 *    - City Forecast: https://api.imd.gov.in/api/v1/cityforecast?id=42182
 *    - District Nowcast: https://api.imd.gov.in/api/v1/districtnowcast
 *    - District Rainfall: https://api.imd.gov.in/api/v1/districtrainfall
 *    - Subdivision Rainfall: https://api.imd.gov.in/api/v1/subdivision_rainfall_forecast
 *    - City Mapping: https://api.imd.gov.in/api/v1/cityforecast_mapping
 * 2. Open-Meteo WMO-compliant live fallback (free open-access endpoint).
 */
class WeatherService {
  private isFixtureMode(): boolean {
    return import.meta.env.VITE_ENABLE_DEV_FIXTURES === 'true';
  }

  public async getObservation(lat: number, lng: number): Promise<ServiceResponse<WeatherObservation>> {
    const hasImdKey = !!import.meta.env.VITE_IMD_API_KEY;

    // 1. Try IMD Official Current Weather API if API key / token is provided
    if (hasImdKey) {
      try {
        const imdRes = await IMDWeatherService.getCurrentWeather();
        if (imdRes.success && imdRes.data && imdRes.data.length > 0) {
          const rec: IMDCurrentWxRecord = imdRes.data[0];
          const observation: WeatherObservation = {
            latitude: lat,
            longitude: lng,
            timestamp: rec.Date_Time || new Date().toISOString(),
            temperature: typeof rec.Temp === 'number' ? rec.Temp : parseFloat(rec.Temp || '28.0'),
            humidity: typeof rec.RH === 'number' ? rec.RH : parseFloat(rec.RH || '85'),
            pressure: typeof rec.MSLP === 'number' ? rec.MSLP : parseFloat(rec.MSLP || '1008'),
            precipitation: typeof rec.Rainfall === 'number' ? rec.Rainfall : parseFloat(rec.Rainfall || '0'),
            windSpeed: typeof rec.Wind_Speed === 'number' ? rec.Wind_Speed : parseFloat(rec.Wind_Speed || '15'),
            windDirection: typeof rec.Wind_Direction === 'number' ? rec.Wind_Direction : parseFloat(rec.Wind_Direction || '90'),
            windGust: rec.Gust ? (typeof rec.Gust === 'number' ? rec.Gust : parseFloat(rec.Gust)) : undefined,
            provenance: {
              source: `IMD AWS Station ${rec.Station_Name || rec.Station_Id || 'Surface Network'}`,
              sourceURL: 'https://api.imd.gov.in/api/v1/current_wx',
              retrievedAt: new Date().toISOString(),
              observationTime: rec.Date_Time,
              dataType: 'OBSERVATION',
              isFixture: false,
              licence: 'Government of India - IMD API Gateway',
            },
          };

          return {
            success: true,
            data: observation,
            source: observation.provenance,
            updatedAt: new Date().toISOString(),
            isConfigured: true,
          };
        }
      } catch (e) {
        console.warn('IMD API query failed, falling back to WMO numerical feed:', e);
      }
    }

    // 2. Open-Meteo Live WMO API (Live Open-Access Fallback)
    const customApiUrl = import.meta.env.VITE_WEATHER_API_URL;
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    try {
      const url = customApiUrl && !customApiUrl.includes('imd.gov.in')
        ? `${customApiUrl}?lat=${lat}&lon=${lng}&appid=${apiKey || ''}`
        : `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,surface_pressure,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover&wind_speed_unit=kmh`;

      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) {
        throw new Error(`Weather feed HTTP error ${response.status}`);
      }

      const raw = await response.json();

      if (raw.current) {
        const observation: WeatherObservation = {
          latitude: lat,
          longitude: lng,
          timestamp: raw.current.time || new Date().toISOString(),
          temperature: raw.current.temperature_2m ?? 0,
          humidity: raw.current.relative_humidity_2m ?? 0,
          pressure: raw.current.surface_pressure ?? 1013,
          precipitation: raw.current.precipitation ?? 0,
          windSpeed: raw.current.wind_speed_10m ?? 0,
          windDirection: raw.current.wind_direction_10m ?? 0,
          windGust: raw.current.wind_gusts_10m,
          cloudCover: raw.current.cloud_cover,
          provenance: {
            source: 'Open-Meteo WMO-Standard Surface Observations',
            sourceURL: 'https://open-meteo.com',
            retrievedAt: new Date().toISOString(),
            observationTime: raw.current.time,
            dataType: 'OBSERVATION',
            isFixture: false,
          },
        };

        return {
          success: true,
          data: observation,
          source: observation.provenance,
          updatedAt: new Date().toISOString(),
          isConfigured: true,
        };
      }

      throw new Error('Unexpected weather API response format');
    } catch (err: any) {
      if (this.isFixtureMode()) {
        const fixtureObs: WeatherObservation = {
          latitude: lat,
          longitude: lng,
          timestamp: new Date().toISOString(),
          temperature: 28.4,
          humidity: 89,
          pressure: 978.2,
          precipitation: 45.0,
          windSpeed: 135.0,
          windDirection: 110,
          windGust: 165.0,
          cloudCover: 100,
          visibility: 1200,
          provenance: {
            source: 'Development Synthetic Weather Fixture (Bay of Bengal)',
            retrievedAt: new Date().toISOString(),
            dataType: 'OBSERVATION',
            isFixture: true,
            notes: 'Dev fixtures enabled via VITE_ENABLE_DEV_FIXTURES=true',
          },
        };

        return {
          success: true,
          data: fixtureObs,
          source: fixtureObs.provenance,
          updatedAt: new Date().toISOString(),
          isConfigured: true,
        };
      }

      return {
        success: false,
        data: null,
        error: `Weather data unavailable (${err.message || 'Network error'})`,
        updatedAt: new Date().toISOString(),
        isConfigured: false,
      };
    }
  }
}

export const weatherService = new WeatherService();
export { IMDWeatherService };
