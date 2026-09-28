# CycloneShield AI — Dataset Status

## Ready / usable
- NOAA IBTrACS: historical cyclone tracks/intensity.
- DFO FloodArchive.xlsx: historical flood events, 5,130 rows, 1985–2021 in this file.
- JRC Global Surface Water occurrence: 10–20N, 80–90E tile, EPSG:4326, 0.00025° (~30m) raster.
- OSM hospitals: 94 features.
- OSM power: 5 features.
- OSM bridges: 244 features.
- OSM roads: 93 + 126 features (likely overlap/duplicates; deduplicate during preprocessing).

## Needs correction before ML
- Open-Meteo CSV is Berlin (52.52N, 13.42E), not Kakinada. Re-download for Kakinada.
- Giovanni IMERG screenshot confirms Final Run variable selection, but screenshot is not the dataset. The .crdownload is incomplete. Export/download the actual IMERG data (prefer GeoTIFF) for Kakinada/event dates.
- export (3) and export (4) are empty and should not be used.

## No more major datasets needed for V1
Skip WorldPop, SRTM, Sentinel-1, and Earth Engine for now.
