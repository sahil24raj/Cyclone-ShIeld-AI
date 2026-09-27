import React from 'react';
import {
  Wind,
  Users,
  Building2,
  Clock,
  Navigation,
  ShieldAlert,
  CloudRain,
  Waves,
  Home,
  AlertOctagon,
  Percent,
  Sparkles
} from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { useAppState } from '../../context/AppStateContext';

export const SummaryCards: React.FC = () => {
  const {
    activeCyclone,
    simulationSummary,
    setActiveTab,
    dataMode,
  } = useAppState();

  const {
    maxSustainedWindKmh,
    rainfall24hMm,
    stormSurgeEstimateMeters,
    forecastConfidencePct,
    totalPopulationExposed,
    p0Population,
    criticalAssetsAtRiskCount,
    totalAssetsCount,
    roadsAtRiskCount,
    totalRoadsCount,
    availableShelterCapacity,
    shelterCapacityGap,
    estimatedLandfallTime,
  } = simulationSummary;

  return (
    <div className="space-y-2 select-none">
      {/* Primary Top Metric Bar (6 Core Parameters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* 1. Maximum Sustained Wind */}
        <MetricCard
          label="Max Sustained Wind"
          value={maxSustainedWindKmh}
          unit="km/h"
          statusColor={maxSustainedWindKmh >= 140 ? 'red' : maxSustainedWindKmh >= 100 ? 'orange' : 'emerald'}
          icon={<Wind className="w-4 h-4" />}
          trend={{
            text: activeCyclone?.category || 'Model Estimate',
            direction: maxSustainedWindKmh >= 135 ? 'up' : 'neutral',
            isWarning: maxSustainedWindKmh >= 135,
          }}
          metadata={{
            source: 'Cyclone Varuna Simulation',
            timestamp: 'Model estimate',
          }}
        />

        {/* 2. 24-Hour Rainfall */}
        <MetricCard
          label="24h Rainfall Total"
          value={rainfall24hMm}
          unit="mm"
          statusColor={rainfall24hMm >= 250 ? 'red' : rainfall24hMm >= 150 ? 'orange' : 'cyan'}
          icon={<CloudRain className="w-4 h-4" />}
          trend={{
            text: rainfall24hMm >= 200 ? 'Torrential Peak' : 'Accumulated Isohyet',
            direction: 'neutral',
          }}
          metadata={{
            source: 'Precipitation Model',
            timestamp: 'Model estimate',
          }}
        />

        {/* 3. Storm Surge Peak */}
        <MetricCard
          label="Storm Surge Peak"
          value={stormSurgeEstimateMeters.toFixed(1)}
          unit="m AMSL"
          statusColor={stormSurgeEstimateMeters >= 2.5 ? 'red' : stormSurgeEstimateMeters >= 1.5 ? 'orange' : 'purple'}
          icon={<Waves className="w-4 h-4" />}
          trend={{
            text: stormSurgeEstimateMeters >= 1.8 ? 'Tidal Overtopping' : 'Normal High Tide',
            direction: 'neutral',
            isWarning: stormSurgeEstimateMeters >= 1.8,
          }}
          metadata={{
            source: 'SLOSH Hydrodynamic',
            timestamp: 'Model estimate',
          }}
        />

        {/* 4. Estimated Landfall Time */}
        <MetricCard
          label="Estimated Landfall"
          value={estimatedLandfallTime.split(' ')[0]}
          unit="lead"
          statusColor="orange"
          icon={<Clock className="w-4 h-4" />}
          trend={{
            text: '24h Base Window',
            direction: 'neutral',
          }}
          metadata={{
            source: 'Track Trajectory',
            timestamp: 'Model estimate',
          }}
        />

        {/* 5. Population Exposed */}
        <MetricCard
          label="Population Exposed"
          value={(totalPopulationExposed / 100000).toFixed(2)}
          unit="Lakh"
          statusColor="orange"
          icon={<Users className="w-4 h-4" />}
          trend={{
            text: p0Population > 0 ? `${p0Population.toLocaleString()} P0 Evac` : 'Low Hazard',
            direction: 'neutral',
            isWarning: p0Population > 0,
          }}
          metadata={{
            source: 'Ward Census Model',
            timestamp: `${simulationSummary.villages.length} Wards Scored`,
          }}
        />

        {/* 6. Forecast / Model Confidence */}
        <MetricCard
          label="Model Confidence"
          value={forecastConfidencePct}
          unit="%"
          statusColor={forecastConfidencePct >= 75 ? 'emerald' : forecastConfidencePct >= 60 ? 'cyan' : 'amber'}
          icon={<Percent className="w-4 h-4" />}
          trend={{
            text: 'Deterministic Formula',
            direction: 'neutral',
          }}
          metadata={{
            source: 'P-CHMVM v2.4 Engine',
            timestamp: 'Model estimate',
          }}
        />
      </div>

      {/* Secondary Operational Status Bar (4 Action Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 7. Critical Assets at Risk */}
        <div onClick={() => setActiveTab('infrastructure')} className="cursor-pointer">
          <MetricCard
            label="Critical Assets at Risk"
            value={`${criticalAssetsAtRiskCount} / ${totalAssetsCount}`}
            unit="assets"
            statusColor={criticalAssetsAtRiskCount > 0 ? 'amber' : 'emerald'}
            icon={<Building2 className="w-4 h-4" />}
            trend={{
              text: criticalAssetsAtRiskCount > 0 ? 'Flood/Wind Stress' : 'All Secure',
              direction: 'neutral',
              isWarning: criticalAssetsAtRiskCount > 0,
            }}
            metadata={{
              source: 'State Infrastructure Registry',
              timestamp: 'Inspect Assets >',
            }}
          />
        </div>

        {/* 8. Roads at Risk / Submerged */}
        <div onClick={() => setActiveTab('evacuation')} className="cursor-pointer">
          <MetricCard
            label="Roads & Routes at Risk"
            value={`${roadsAtRiskCount} / ${totalRoadsCount}`}
            unit="routes"
            statusColor={roadsAtRiskCount > 0 ? 'purple' : 'emerald'}
            icon={<Navigation className="w-4 h-4" />}
            trend={{
              text: roadsAtRiskCount > 0 ? 'Coastal Arterials Blocked' : 'Routes Open',
              direction: 'neutral',
              isWarning: roadsAtRiskCount > 0,
            }}
            metadata={{
              source: 'Evacuation Corridor Engine',
              timestamp: 'Inspect Routes >',
            }}
          />
        </div>

        {/* 9. Available Safe Shelter Capacity */}
        <div onClick={() => setActiveTab('evacuation')} className="cursor-pointer">
          <MetricCard
            label="Available Shelter Capacity"
            value={availableShelterCapacity.toLocaleString()}
            unit="beds"
            statusColor={availableShelterCapacity > 5000 ? 'emerald' : 'orange'}
            icon={<Home className="w-4 h-4" />}
            trend={{
              text: 'Active Cyclone Sanctuaries',
              direction: 'neutral',
            }}
            metadata={{
              source: 'Multi-Purpose Shelters',
              timestamp: 'Inspect Shelters >',
            }}
          />
        </div>

        {/* 10. Shelter Capacity Deficit / Gap */}
        <div onClick={() => setActiveTab('evacuation')} className="cursor-pointer">
          <MetricCard
            label="Shelter Capacity Deficit"
            value={shelterCapacityGap > 0 ? shelterCapacityGap.toLocaleString() : '0'}
            unit="beds needed"
            statusColor={shelterCapacityGap > 0 ? 'red' : 'emerald'}
            icon={<AlertOctagon className="w-4 h-4" />}
            trend={{
              text: shelterCapacityGap > 0 ? 'Spillover Shelter Needed' : 'Capacity Sufficient',
              direction: 'neutral',
              isWarning: shelterCapacityGap > 0,
            }}
            metadata={{
              source: 'Logistics Optimization',
              timestamp: 'Evacuation Matrix >',
            }}
          />
        </div>
      </div>
    </div>
  );
};
