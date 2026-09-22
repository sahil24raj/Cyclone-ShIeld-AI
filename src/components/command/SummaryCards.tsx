import React from 'react';
import {
  Wind,
  Users,
  Building2,
  AlertTriangle,
  Flame,
  Clock,
  Navigation,
  ShieldAlert
} from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { useAppState } from '../../context/AppStateContext';

export const SummaryCards: React.FC = () => {
  const { simulationParams, setActiveTab } = useAppState();

  const currentWind = Math.round(135 * simulationParams.windSpeedMultiplier);
  const popExposedLakhs = (
    2.84 *
    simulationParams.rainfallMultiplier *
    (simulationParams.surgeHeightOffset >= 0 ? 1 + simulationParams.surgeHeightOffset * 0.12 : 0.9)
  ).toFixed(2);
  const criticalAssetsCount = Math.min(42, Math.round(14 * (currentWind / 135) * (simulationParams.surgeHeightOffset > 0 ? 1.2 : 1.0)));
  const cutoffsCount = Math.round(7 + (simulationParams.rainfallMultiplier - 1) * 3 + (simulationParams.surgeHeightOffset > 0.5 ? 2 : 0));
  const overallRisk = Math.min(98, Math.round(74 * (currentWind / 135) * (1 + simulationParams.surgeHeightOffset * 0.08)));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 select-none">
      {/* 1. Wind Speed */}
      <MetricCard
        label="Wind Speed"
        value={currentWind}
        unit="km/h"
        statusColor="red"
        icon={<Wind className="w-4 h-4" />}
        trend={{
          text: '+12 km/h last 3h',
          direction: 'up',
          isWarning: true,
        }}
        metadata={{
          source: 'IMD RSMC',
          timestamp: '10:30 IST',
        }}
      />

      {/* 2. Landfall Window */}
      <MetricCard
        label="Landfall Window"
        value="~24"
        unit="Hours"
        statusColor="orange"
        icon={<Clock className="w-4 h-4" />}
        trend={{
          text: 'ETA: 08:30 IST',
          direction: 'neutral',
        }}
        metadata={{
          source: 'JTWC / IMD',
          timestamp: 'Conf 88.4%',
        }}
      />

      {/* 3. Overall District Risk */}
      <MetricCard
        label="Overall District Risk"
        value={overallRisk}
        unit="/ 100"
        statusColor={overallRisk >= 80 ? 'red' : 'orange'}
        icon={<ShieldAlert className="w-4 h-4" />}
        trend={{
          text: overallRisk >= 80 ? 'CRITICAL RISK' : 'HIGH RISK',
          direction: 'up',
          isWarning: true,
        }}
        metadata={{
          source: 'P-CHMVM v2.4',
          timestamp: '8 Wards',
        }}
      />

      {/* 4. Population Exposed */}
      <MetricCard
        label="Population Exposed"
        value={popExposedLakhs}
        unit="Lakh"
        statusColor="orange"
        icon={<Users className="w-4 h-4" />}
        trend={{
          text: '22,600 P0 Evac',
          direction: 'up',
          isWarning: true,
        }}
        metadata={{
          source: 'Census / GEE',
          timestamp: 'Coast Zone',
        }}
      />

      {/* 5. Critical Assets at Risk */}
      <div onClick={() => setActiveTab('infrastructure')} className="cursor-pointer">
        <MetricCard
          label="Critical Assets"
          value={`${criticalAssetsCount} / 42`}
          unit="at risk"
          statusColor="amber"
          icon={<Building2 className="w-4 h-4" />}
          trend={{
            text: 'Hospital + Substation',
            direction: 'up',
            isWarning: true,
          }}
          metadata={{
            source: 'OSM / District',
            timestamp: '3 Inundated',
          }}
        />
      </div>

      {/* 6. Roads at Risk */}
      <div onClick={() => setActiveTab('evacuation')} className="cursor-pointer">
        <MetricCard
          label="Roads at Risk"
          value={cutoffsCount}
          unit="cutoffs"
          statusColor="purple"
          icon={<Navigation className="w-4 h-4" />}
          trend={{
            text: 'SH-12 0.8m Submerged',
            direction: 'up',
            isWarning: true,
          }}
          metadata={{
            source: 'SAR Water Index',
            timestamp: 'Bypass Active',
          }}
        />
      </div>
    </div>
  );
};
