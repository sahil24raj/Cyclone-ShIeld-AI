import { CycloneTrackPoint } from '../types';
import { DataProvenance, ServiceResponse } from '../types/provenance';
import { FIXTURE_CYCLONE } from '../fixtures/cycloneFixtures';

export interface ActiveCyclone {
  id: string;
  name: string;
  category: string;
  landfallETA: string;
  maxWindSpeed: number; // km/h
  centralPressure: number; // hPa
  stormSurgeMax: number; // meters
  rainfall24h: number; // mm
  currentPosition: {
    lat: number;
    lng: number;
  };
  observedTrack: CycloneTrackPoint[];
  forecastTrack: CycloneTrackPoint[];
  provenance: DataProvenance;
}

class CycloneService {
  private isFixtureMode(): boolean {
    return import.meta.env.VITE_ENABLE_DEV_FIXTURES === 'true';
  }

  public async getActiveCyclone(): Promise<ServiceResponse<ActiveCyclone | null>> {
    const feedUrl = import.meta.env.VITE_CYCLONE_FEED_URL;

    if (feedUrl) {
      try {
        const response = await fetch(feedUrl, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) {
          throw new Error(`Cyclone feed returned ${response.status}`);
        }
        const data = await response.json();
        
        // Return parsed real cyclone data
        return {
          success: true,
          data: {
            ...data,
            provenance: {
              source: data.source || 'Authoritative Cyclone RSMC Feed (IMD/WMO)',
              sourceURL: feedUrl,
              retrievedAt: new Date().toISOString(),
              dataType: 'OFFICIAL_FORECAST',
              isFixture: false,
            }
          },
          updatedAt: new Date().toISOString(),
          isConfigured: true,
        };
      } catch (err: any) {
        return {
          success: false,
          data: null,
          error: `Cyclone feed error: ${err.message}`,
          updatedAt: new Date().toISOString(),
          isConfigured: true,
        };
      }
    }

    // If in dev fixture mode
    if (this.isFixtureMode()) {
      const observed = FIXTURE_CYCLONE.trackPoints.filter(p => p.time.startsWith('T-'));
      const forecast = FIXTURE_CYCLONE.trackPoints.filter(p => p.time.startsWith('T+') || p.time === 'T-00h');

      const cyclone: ActiveCyclone = {
        id: FIXTURE_CYCLONE.id,
        name: FIXTURE_CYCLONE.name,
        category: FIXTURE_CYCLONE.category,
        landfallETA: FIXTURE_CYCLONE.landfallETA,
        maxWindSpeed: FIXTURE_CYCLONE.maxWindSpeed,
        centralPressure: FIXTURE_CYCLONE.centralPressure,
        stormSurgeMax: FIXTURE_CYCLONE.stormSurgeMax,
        rainfall24h: FIXTURE_CYCLONE.rainfall24h,
        currentPosition: FIXTURE_CYCLONE.currentPosition,
        observedTrack: observed,
        forecastTrack: forecast,
        provenance: {
          source: 'Synthetic Dev Fixture (Bay of Bengal Simulation)',
          retrievedAt: new Date().toISOString(),
          dataType: 'OFFICIAL_FORECAST',
          isFixture: true,
          notes: 'Enabled via VITE_ENABLE_DEV_FIXTURES=true',
        },
      };

      return {
        success: true,
        data: cyclone,
        source: cyclone.provenance,
        updatedAt: new Date().toISOString(),
        isConfigured: true,
      };
    }

    // Default production state when no external feed is set:
    return {
      success: true,
      data: null,
      error: 'No active cyclone feed configured (VITE_CYCLONE_FEED_URL not set).',
      updatedAt: new Date().toISOString(),
      isConfigured: false,
    };
  }
}

export const cycloneService = new CycloneService();
