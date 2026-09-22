import React from 'react';
import {
  Wind,
  Users,
  Building2,
  AlertTriangle,
  Flame,
  Clock,
  Navigation,
  ShieldAlert,
  CloudRain
} from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { useAppState } from '../../context/AppStateContext';
import { DeterministicRiskEngine } from '../../services/riskEngine';

export const SummaryCards: React.FC = () => {
  const {
    activeCyclone,
    weather,
    villages,
    assets,
    prediction,
    simulationParams,
    setActiveTab,
    dataSources
  } = useAppState();

  const isFixtureMode = import.meta.env.VITE_ENABLE_DEV_FIXTURES === 'true';

  // 1. Wind Speed Metric
  const currentWind = activeCyclone
    ? Math.round(activeCyclone.maxWindSpeed * simulationParams.windSpeedMultiplier)
    : (weather ? Math.round(weather.windSpeed) : null);

  // 2. Population Exposed
  const totalPop = villages.reduce((acc, v) => acc + v.population, 0);
  const p0Pop = villages
    .filter(v => v.priority_level === 'P0')
    .reduce((acc, v) => acc + v.population, 0);

  // 3. District Risk Score (Derived)
  const averageRisk = villages.length > 0
    ? Math.round(
        villages.reduce(
          (acc, v) => acc + DeterministicRiskEngine.calculateRisk(v, simulationParams).overallRisk,
          0
        ) / villages.length
      )
    : null;

  // 4. Critical Assets in Inundation/Risk Zone
  const assetsAtRisk = assets.filter(a => a.in_flood_zone || a.risk_score >= 70).length;

  // 5. Road Cutoffs
  const floodedWardsCount = villages.filter(v => v.is_road_submerged).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 select-none">
      {/* 1. Wind Speed */}
      <MetricCard
        label="Wind Speed"
        value={currentWind !== null ? currentWind : '--'}
        unit={currentWind !== null ? 'km/h' : ''}
        statusColor={currentWind && currentWind >= 100 ? 'red' : 'emerald'}
        icon={<Wind className="w-4 h-4" />}
        trend={{
          text: activeCyclone ? (isFixtureMode ? 'Fixture Active' : 'Observation Feed') : (weather ? 'Local WMO Station' : 'Feed Unset'),
          direction: currentWind && currentWind >= 100 ? 'up' : 'neutral',
          isWarning: !!(currentWind && currentWind >= 100),
        }}
        metadata={{
          source: activeCyclone ? activeCyclone.provenance.source : (weather?.provenance.source || 'Unconfigured'),
          timestamp: weather ? 'Live WMO' : 'T-24h Lead',
        }}
      />

      {/* 2. Cyclone Landfall ETA / Status */}
      <MetricCard
        label="Storm Landfall ETA"
        value={activeCyclone ? activeCyclone.landfallETA.split(' ')[0] : 'None'}
        unit={activeCyclone ? '' : 'Active'}
        statusColor={activeCyclone ? 'orange' : 'cyan'}
        icon={<Clock className="w-4 h-4" />}
        trend={{
          text: activeCyclone ? activeCyclone.category : 'RSMC Monitoring',
          direction: 'neutral',
        }}
        metadata={{
          source: 'IMD / JTWC Feed',
          timestamp: activeCyclone ? 'Official Forecast' : 'Standby',
        }}
      />

      {/* 3. Overall District Risk (Derived Assessment) */}
      <MetricCard
        label="Derived District Risk"
        value={averageRisk !== null ? averageRisk : '--'}
        unit={averageRisk !== null ? '/ 100' : ''}
        statusColor={averageRisk && averageRisk >= 80 ? 'red' : averageRisk && averageRisk >= 60 ? 'orange' : 'cyan'}
        icon={<ShieldAlert className="w-4 h-4" />}
        trend={{
          text: averageRisk && averageRisk >= 75 ? 'P0 Priority Wards' : 'Derived Analysis',
          direction: 'neutral',
          isWarning: !!(averageRisk && averageRisk >= 75),
        }}
        metadata={{
          source: 'Deterministic Risk Engine',
          timestamp: `${villages.length} Wards Scored`,
        }}
      />

      {/* 4. Population Exposed */}
      <MetricCard
        label="Population Exposed"
        value={totalPop > 0 ? (totalPop / 100000).toFixed(2) : '--'}
        unit={totalPop > 0 ? 'Lakh' : ''}
        statusColor="orange"
        icon={<Users className="w-4 h-4" />}
        trend={{
          text: p0Pop > 0 ? `${p0Pop.toLocaleString()} P0 Evac` : 'No Critical Wards',
          direction: 'neutral',
          isWarning: p0Pop > 0,
        }}
        metadata={{
          source: 'District Census',
          timestamp: `${villages.length} Wards`,
        }}
      />

      {/* 5. Critical Assets at Risk */}
      <div onClick={() => setActiveTab('infrastructure')} className="cursor-pointer">
        <MetricCard
          label="Critical Assets"
          value={assets.length > 0 ? `${assetsAtRisk} / ${assets.length}` : '--'}
          unit={assets.length > 0 ? 'at risk' : ''}
          statusColor={assetsAtRisk > 0 ? 'amber' : 'emerald'}
          icon={<Building2 className="w-4 h-4" />}
          trend={{
            text: assetsAtRisk > 0 ? 'Inundation/Wind Risk' : 'All Clear',
            direction: 'neutral',
            isWarning: assetsAtRisk > 0,
          }}
          metadata={{
            source: 'State Asset Registry',
            timestamp: `${assets.length} Total Monitored`,
          }}
        />
      </div>

      {/* 6. Roads & Route Cutoffs */}
      <div onClick={() => setActiveTab('evacuation')} className="cursor-pointer">
        <MetricCard
          label="Road Submersions"
          value={villages.length > 0 ? floodedWardsCount : '--'}
          unit={villages.length > 0 ? 'arterials' : ''}
          statusColor={floodedWardsCount > 0 ? 'purple' : 'emerald'}
          icon={<Navigation className="w-4 h-4" />}
          trend={{
            text: floodedWardsCount > 0 ? 'Reroute Active' : 'Routes Operational',
            direction: 'neutral',
            isWarning: floodedWardsCount > 0,
          }}
          metadata={{
            source: 'PWD Highway Network',
            timestamp: 'Corridor Status',
          }}
        />
      </div>
    </div>
  );
};
