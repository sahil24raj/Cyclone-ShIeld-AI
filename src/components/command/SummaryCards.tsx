import React from 'react';
import {
  Wind,
  Users,
  Building2,
  Home,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Compass,
  Radio
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { CYCLONE_METADATA, WIND_TREND_DATA } from '../../data/cycloneData';
import { EVACUATION_SUMMARY } from '../../data/evacuationData';
import { useAppState } from '../../context/AppStateContext';

export const SummaryCards: React.FC = () => {
  const { simulationParams, setActiveTab } = useAppState();

  const currentWind = Math.round(135 * simulationParams.windSpeedMultiplier);
  const popExposedLakhs = (2.84 * simulationParams.rainfallMultiplier * (simulationParams.surgeHeightOffset >= 0 ? 1 + simulationParams.surgeHeightOffset * 0.12 : 0.9)).toFixed(2);
  const assetsCritical = simulationParams.windSpeedMultiplier > 1.1 ? 11 : 8;
  const shelterGap = Math.round(92000 + simulationParams.surgeHeightOffset * 8000);
  const roadsAtRisk = Math.round(31 + (simulationParams.rainfallMultiplier - 1) * 12);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Current Storm Status Card */}
      <div className="bg-navy-900 border border-navy-750 hover:border-cyan-500/40 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex flex-col justify-between group transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
            Storm Status
          </span>
          <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
            Active
          </span>
        </div>

        <div className="my-2">
          <div className="text-lg font-black text-white truncate flex items-center gap-1.5 font-mono">
            <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
            {CYCLONE_METADATA.name}
          </div>
          <div className="text-xs text-orange-300 font-medium truncate mt-0.5">
            {CYCLONE_METADATA.category}
          </div>
        </div>

        <div className="border-t border-navy-750/70 pt-2 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> Landfall:
          </span>
          <span className="text-cyan-300 font-bold">~24 Hours</span>
        </div>
      </div>

      {/* 2. Maximum Sustained Wind with Sparkline */}
      <div className="bg-navy-900 border border-navy-750 hover:border-red-500/40 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex flex-col justify-between transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
            Max Sustained Wind
          </span>
          <Wind className="w-4 h-4 text-red-400" />
        </div>

        <div className="my-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-black font-mono text-white">
            {currentWind}
          </span>
          <span className="text-xs text-slate-400 font-mono">km/h</span>
          <span className="text-[10px] text-red-400 font-mono font-bold flex items-center ml-auto">
            <ArrowUpRight className="w-3 h-3" /> Gusts 160
          </span>
        </div>

        {/* Recharts Wind Sparkline */}
        <div className="h-10 w-full -mb-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WIND_TREND_DATA} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="wind"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#windGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[10px] text-slate-400 font-mono text-right">
          Trend: Intensifying to peak
        </div>
      </div>

      {/* 3. Population Exposed */}
      <div className="bg-navy-900 border border-navy-750 hover:border-orange-500/40 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex flex-col justify-between transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
            Population Exposed
          </span>
          <Users className="w-4 h-4 text-orange-400" />
        </div>

        <div className="my-2">
          <div className="text-2xl font-black font-mono text-orange-300">
            {popExposedLakhs} <span className="text-sm font-semibold text-slate-300">Lakh</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <span className="text-red-400 font-bold font-mono">22,600 P0</span> immediate evac
          </div>
        </div>

        <div className="border-t border-navy-750/70 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Delta vs Prev Track:</span>
          <span className="text-orange-400 font-bold flex items-center">
            <ArrowUpRight className="w-3 h-3" /> +14.2%
          </span>
        </div>
      </div>

      {/* 4. Critical Assets at Risk */}
      <div
        onClick={() => setActiveTab('infrastructure')}
        className="bg-navy-900 border border-navy-750 hover:border-amber-500/40 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
            Assets at Risk
          </span>
          <Building2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>

        <div className="my-2">
          <div className="text-2xl font-black font-mono text-white">
            42 <span className="text-xs font-normal text-slate-400">Assets</span>
          </div>
          <div className="text-[11px] text-amber-300/90 font-mono mt-0.5">
            {assetsCritical} Critical • 19 High • 15 Mod
          </div>
        </div>

        <div className="border-t border-navy-750/70 pt-2 flex items-center justify-between text-[10px] font-mono text-cyan-400">
          <span>Action Protocol:</span>
          <span className="group-hover:underline">View All 42 &gt;</span>
        </div>
      </div>

      {/* 5. Shelters Available */}
      <div
        onClick={() => setActiveTab('evacuation')}
        className="bg-navy-900 border border-navy-750 hover:border-emerald-500/40 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
            Shelters Available
          </span>
          <Home className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>

        <div className="my-2">
          <div className="text-2xl font-black font-mono text-white">
            68 <span className="text-xs font-normal text-slate-400">Shelters</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
            Cap: 1.92 Lakh
          </div>
        </div>

        <div className="border-t border-navy-750/70 pt-2 flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">Deficit Gap:</span>
          <span className="text-red-400 font-bold font-mono">
            {shelterGap.toLocaleString()} gap
          </span>
        </div>
      </div>

      {/* 6. Roads at Risk */}
      <div className="bg-navy-900 border border-navy-750 hover:border-rose-500/40 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex flex-col justify-between transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
            Roads at Risk
          </span>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        </div>

        <div className="my-2">
          <div className="text-2xl font-black font-mono text-rose-300">
            {roadsAtRisk} <span className="text-xs font-normal text-slate-400">Segments</span>
          </div>
          <div className="text-[11px] text-red-400 font-mono mt-0.5 font-bold">
            7 Evac Routes Cutoff
          </div>
        </div>

        <div className="border-t border-navy-750/70 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>SH-12 Bypass:</span>
          <span className="text-emerald-400 font-bold">Corridor 2 Active</span>
        </div>
      </div>
    </div>
  );
};
