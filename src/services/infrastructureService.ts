import { Village, CriticalAsset, Shelter, EvacuationRoute } from '../types';
import { ServiceResponse, DataProvenance } from '../types/provenance';
import { FIXTURE_VILLAGES } from '../fixtures/villageFixtures';
import { FIXTURE_ASSETS } from '../fixtures/infrastructureFixtures';
import { FIXTURE_SHELTERS, FIXTURE_EVACUATION_ROUTES } from '../fixtures/evacuationFixtures';

class InfrastructureService {
  private isFixtureMode(): boolean {
    return import.meta.env.VITE_ENABLE_DEV_FIXTURES === 'true';
  }

  public async getVillages(): Promise<ServiceResponse<Village[]>> {
    const customUrl = import.meta.env.VITE_VILLAGES_GEOJSON_URL;

    if (customUrl) {
      try {
        const res = await fetch(customUrl, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`Villages feed returned ${res.status}`);
        const data = await res.json();
        return {
          success: true,
          data: data.villages || data,
          source: {
            source: 'District Administration Census & Geospatial Registry',
            sourceURL: customUrl,
            retrievedAt: new Date().toISOString(),
            dataType: 'OBSERVATION',
            isFixture: false,
          },
          updatedAt: new Date().toISOString(),
          isConfigured: true,
        };
      } catch (err: any) {
        return {
          success: false,
          data: null,
          error: `Failed loading ward population data: ${err.message}`,
          updatedAt: new Date().toISOString(),
          isConfigured: true,
        };
      }
    }

    if (this.isFixtureMode()) {
      return {
        success: true,
        data: FIXTURE_VILLAGES,
        source: {
          source: 'Synthetic Dev Fixture (8 Coastal Wards)',
          retrievedAt: new Date().toISOString(),
          dataType: 'OBSERVATION',
          isFixture: true,
          notes: 'Enabled via VITE_ENABLE_DEV_FIXTURES=true',
        },
        updatedAt: new Date().toISOString(),
        isConfigured: true,
      };
    }

    return {
      success: true,
      data: null,
      error: 'Population/Ward registry not configured (VITE_VILLAGES_GEOJSON_URL unset).',
      updatedAt: new Date().toISOString(),
      isConfigured: false,
    };
  }

  public async getCriticalAssets(): Promise<ServiceResponse<CriticalAsset[]>> {
    const customUrl = import.meta.env.VITE_INFRASTRUCTURE_GEOJSON_URL;

    if (customUrl) {
      try {
        const res = await fetch(customUrl, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`Infra feed returned ${res.status}`);
        const data = await res.json();
        return {
          success: true,
          data: data.assets || data,
          source: {
            source: 'State Infrastructure Asset Management System',
            sourceURL: customUrl,
            retrievedAt: new Date().toISOString(),
            dataType: 'OBSERVATION',
            isFixture: false,
          },
          updatedAt: new Date().toISOString(),
          isConfigured: true,
        };
      } catch (err: any) {
        return {
          success: false,
          data: null,
          error: `Infrastructure data error: ${err.message}`,
          updatedAt: new Date().toISOString(),
          isConfigured: true,
        };
      }
    }

    if (this.isFixtureMode()) {
      return {
        success: true,
        data: FIXTURE_ASSETS,
        source: {
          source: 'Synthetic Dev Fixture (8 Critical Assets)',
          retrievedAt: new Date().toISOString(),
          dataType: 'OBSERVATION',
          isFixture: true,
          notes: 'Enabled via VITE_ENABLE_DEV_FIXTURES=true',
        },
        updatedAt: new Date().toISOString(),
        isConfigured: true,
      };
    }

    return {
      success: true,
      data: null,
      error: 'Critical infrastructure layer not configured (VITE_INFRASTRUCTURE_GEOJSON_URL unset).',
      updatedAt: new Date().toISOString(),
      isConfigured: false,
    };
  }

  public async getShelters(): Promise<ServiceResponse<Shelter[]>> {
    if (this.isFixtureMode()) {
      return {
        success: true,
        data: FIXTURE_SHELTERS,
        source: {
          source: 'State Disaster Management Authority Shelter Network (Fixture)',
          retrievedAt: new Date().toISOString(),
          dataType: 'OBSERVATION',
          isFixture: true,
        },
        updatedAt: new Date().toISOString(),
        isConfigured: true,
      };
    }
    return {
      success: true,
      data: null,
      error: 'Shelter registry not configured.',
      updatedAt: new Date().toISOString(),
      isConfigured: false,
    };
  }

  public async getEvacuationRoutes(): Promise<ServiceResponse<EvacuationRoute[]>> {
    if (this.isFixtureMode()) {
      return {
        success: true,
        data: FIXTURE_EVACUATION_ROUTES,
        source: {
          source: 'PWD & Police Highway Corridor Network (Fixture)',
          retrievedAt: new Date().toISOString(),
          dataType: 'OBSERVATION',
          isFixture: true,
        },
        updatedAt: new Date().toISOString(),
        isConfigured: true,
      };
    }
    return {
      success: true,
      data: null,
      error: 'Evacuation corridors not configured.',
      updatedAt: new Date().toISOString(),
      isConfigured: false,
    };
  }
}

export const infrastructureService = new InfrastructureService();
