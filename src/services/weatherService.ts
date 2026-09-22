import { DataProvenance, ServiceResponse } from '../types/provenance';

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
 * Supports Open-Meteo (open-access WMO compliant numerical feed) or user-configured endpoint.
 */
class WeatherService {
  private isFixtureMode(): boolean {
    return import.meta.env.VITE_ENABLE_DEV_FIXTURES === 'true';
  }

  public async getObservation(lat: number, lng: number): Promise<ServiceResponse<WeatherObservation>> {
    // Check if custom API is configured or use open-access Open-Meteo WMO endpoint
    const customApiUrl = import.meta.env.VITE_WEATHER_API_URL;
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    try {
      // 1. If Open-Meteo or custom endpoint is requested
      const url = customApiUrl
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
            source: 'Open-Meteo Global WMO Observations',
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
