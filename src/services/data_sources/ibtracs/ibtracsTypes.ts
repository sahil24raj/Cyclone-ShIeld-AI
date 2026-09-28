/**
 * NOAA IBTrACS (International Best Track Archive for Climate Stewardship)
 * Standardized schema for historical tropical cyclone observations.
 * Source: NOAA NCEI (v04r00)
 */

export interface IBTrACSTrackPoint {
  eventId: string;
  stormId: string;
  stormName: string;
  basin: string; // 'NI' (North Indian Ocean), 'SI', 'WP', etc.
  subBasin: string; // 'BB' (Bay of Bengal), 'AS' (Arabian Sea)
  isoTime: string; // ISO 8601 UTC timestamp
  nature: string; // 'TS' (Tropical Storm), 'ET' (Extratropical), 'NR' (Not Reported)
  latitude: number; // Decimal degrees North
  longitude: number; // Decimal degrees East
  maxWindKmh: number; // Maximum sustained wind speed in km/h (converted from knots / 3-min IMD or 1-min JTWC)
  minPressureHpa: number; // Minimum central pressure in hPa/mbar
  distanceToLandKm: number; // Calculated distance to nearest coastline in km
  stormCategory: string; // e.g. 'CS', 'SCS', 'VSCS', 'ESCS', 'SuCS' / 'Cat 1' - 'Cat 5'
  trackSpeedKmh?: number; // Forward translation speed of storm center
  trackDirectionDeg?: number; // Heading in degrees
}

export interface IBTrACSStormEvent {
  stormId: string;
  stormName: string;
  year: number;
  basin: string;
  subBasin: string;
  startTime: string;
  endTime: string;
  peakWindKmh: number;
  minCentralPressureHpa: number;
  peakCategory: string;
  landfallLocation?: string;
  landfallTime?: string;
  totalTrackPoints: number;
  trackPoints: IBTrACSTrackPoint[];
  dataSource: {
    agency: string; // 'NOAA NCEI'
    dataset: string; // 'IBTrACS-all / IBTrACS.NI'
    version: string; // 'v04r00'
    sourceUrl: string;
    downloadDate: string;
    processingDate: string;
    isOfficialBenchmark: boolean;
  };
}
