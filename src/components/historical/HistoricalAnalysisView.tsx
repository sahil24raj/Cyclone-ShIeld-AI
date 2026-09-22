import React, { useState } from 'react';
import {
  History,
  Wind,
  Waves,
  CloudRain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { HISTORICAL_CYCLONE_EVENTS } from '../../data/historicalData';
import { HistoricalCycloneEvent } from '../../types';
import { useAppState } from '../../context/AppStateContext';

export const HistoricalAnalysisView: React.FC = () => {
  const { setActiveTab } = useAppState();
  const [selectedEventId, setSelectedEventId] = useState<string>('fani-2019');

  const selectedEvent: HistoricalCycloneEvent =
    HISTORICAL_CYCLONE_EVENTS.find((e) => e.id === selectedEventId) || HISTORICAL_CYCLONE_EVENTS[0];

  // Comparison chart data for Observed vs Model Predicted across all storms
  const comparisonData = HISTORICAL_CYCLONE_EVENTS.map((e) => ({
    name: e.name.split(' ')[e.name.split(' ').length - 1],
    ObservedWind: e.observedMaxWindKmh,
    PredictedWind: e.predictedMaxWindKmh,
    ObservedSurge: e.observedPeakSurgeMeters,
    PredictedSurge: e.predictedPeakSurgeMeters,
    Accuracy: e.inundationAccuracyPct,
  }));

  const singleEventComparison = [
    { metric: 'Max Wind (km/h)', Observed: selectedEvent.observedMaxWindKmh, Predicted: selectedEvent.predictedMaxWindKmh },
    { metric: 'Peak Surge (m)', Observed: selectedEvent.observedPeakSurgeMeters * 30, Predicted: selectedEvent.predictedPeakSurgeMeters * 30, displayObs: `${selectedEvent.observedPeakSurgeMeters}m`, displayPred: `${selectedEvent.predictedPeakSurgeMeters}m` },
    { metric: '24h Rain (mm)', Observed: selectedEvent.observedRainfallMm, Predicted: selectedEvent.predictedRainfallMm },
  ];

  return (
    <div className="space-y-5 p-4 md:p-6 max-w-[1600px] mx-auto font-sans">
      {/* Page Header */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <History className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Historical Cyclone Ground-Truth Benchmark
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Retrospective Inundation &amp; Multi-Hazard Accuracy Audit
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
            Validation of hydrodynamic storm surge and damage prediction models against verified post-disaster field surveys from IMD, NDMA, and Copernicus Sentinel-1.
          </p>
        </div>

        {/* Global Model Precision Badge */}
        <div className="bg-navy-950 border border-navy-800 p-2.5 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-3">
          <div>
            <div className="text-[10px] text-slate-400">Mean Inundation Accuracy</div>
            <div className="font-bold text-emerald-400 text-sm">91.08% (Verified)</div>
          </div>
          <span className="h-6 w-px bg-navy-800" />
          <div>
            <div className="text-[10px] text-slate-400">Historical Benchmarks</div>
            <div className="font-bold text-cyan-300 text-sm">5 Major Cyclones</div>
          </div>
        </div>
      </div>

      {/* Cyclone Event Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {HISTORICAL_CYCLONE_EVENTS.map((event) => {
          const isSelected = selectedEventId === event.id;
          return (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all flex-shrink-0 border ${
                isSelected
                  ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 font-bold shadow-md shadow-cyan-950'
                  : 'bg-navy-900 hover:bg-navy-850 text-slate-400 hover:text-slate-200 border-navy-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{event.name.split(' ')[event.name.split(' ').length - 1]} ({event.year})</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-navy-950 text-slate-400 border border-navy-800">
                {event.inundationAccuracyPct}% Acc
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Selected Event Analysis Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: Event Profile & Physical Validation */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-750 pb-3">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                {selectedEvent.peakCategory}
              </span>
              <h3 className="font-extrabold text-lg text-white font-sans">
                {selectedEvent.name}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{selectedEvent.landfallLocation}</span>
                <span>•</span>
                <span>{selectedEvent.dateRange}</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
              <span className="text-[10px] font-mono text-slate-400">SAR Flood Accuracy</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {selectedEvent.inundationAccuracyPct}%
              </span>
            </div>
          </div>

          {/* Observed vs Model Estimated Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Wind Speed */}
            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Wind className="w-3.5 h-3.5 text-red-400" />
                <span>Peak Wind</span>
              </div>
              <div className="text-base font-bold text-white">
                {selectedEvent.observedMaxWindKmh} km/h
              </div>
              <div className="text-[10px] text-slate-400">
                Model: <b className="text-cyan-300">{selectedEvent.predictedMaxWindKmh} km/h</b> ({Math.abs(selectedEvent.observedMaxWindKmh - selectedEvent.predictedMaxWindKmh)} km/h delta)
              </div>
            </div>

            {/* Storm Surge */}
            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Waves className="w-3.5 h-3.5 text-purple-400" />
                <span>Peak Surge</span>
              </div>
              <div className="text-base font-bold text-white">
                {selectedEvent.observedPeakSurgeMeters} meters
              </div>
              <div className="text-[10px] text-slate-400">
                Model: <b className="text-purple-300">{selectedEvent.predictedPeakSurgeMeters} m</b> ({Math.abs(selectedEvent.observedPeakSurgeMeters - selectedEvent.predictedPeakSurgeMeters).toFixed(1)}m delta)
              </div>
            </div>

            {/* 24h Rainfall */}
            <div className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                <span>24h Rainfall</span>
              </div>
              <div className="text-base font-bold text-white">
                {selectedEvent.observedRainfallMm} mm
              </div>
              <div className="text-[10px] text-slate-400">
                Model: <b className="text-blue-300">{selectedEvent.predictedRainfallMm} mm</b> ({Math.abs(selectedEvent.observedRainfallMm - selectedEvent.predictedRainfallMm)}mm delta)
              </div>
            </div>
          </div>

          {/* Historical Impact Narrative */}
          <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-slate-200 font-mono flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Observed Ground-Truth Impact Summary</span>
            </h4>
            <p className="leading-relaxed">
              {selectedEvent.keyImpactSummary}
            </p>
            <div className="pt-2 border-t border-navy-850 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Evacuated Population:</span>
              <span className="text-white font-bold">{selectedEvent.evacuatedPopulation.toLocaleString()} residents</span>
            </div>
          </div>

          {/* Key Lessons Learned */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-amber-300 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Operational Lessons Encoded into CYCLONE-X</span>
            </h4>
            <div className="space-y-1.5">
              {selectedEvent.lessonsLearned.map((lesson, idx) => (
                <div
                  key={idx}
                  className="bg-navy-950 p-3 rounded-xl border border-navy-800 flex items-start gap-2 text-slate-300 leading-relaxed"
                >
                  <span className="text-cyan-400 font-mono font-bold mt-0.5">#{idx + 1}</span>
                  <span>{lesson}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Comparative Charts Across History */}
        <div className="lg:col-span-5 space-y-5">
          {/* Recharts Multi-Cyclone Comparison Bar Chart */}
          <div className="bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white font-mono">
                  Observed vs Predicted Wind (km/h)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">All Benchmarks</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 260]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar dataKey="ObservedWind" name="Observed (IMD)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="PredictedWind" name="Model Prediction" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Inundation Accuracy Across Events */}
          <div className="bg-navy-900 border border-navy-750 p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-navy-750 pb-2">
              <h4 className="font-bold text-xs text-white font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SAR Flood Inundation Match Rate</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Sentinel-1 Intersection</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {HISTORICAL_CYCLONE_EVENTS.map((e) => (
                <div key={e.id} className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 flex items-center justify-between">
                  <span className="text-slate-300 font-sans">{e.name.split(' ')[e.name.split(' ').length - 1]} ({e.year})</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-navy-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${e.inundationAccuracyPct}%` }}
                      />
                    </div>
                    <span className="font-bold text-emerald-400 text-xs w-12 text-right">
                      {e.inundationAccuracyPct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('methodology')}
                className="w-full bg-navy-850 hover:bg-navy-800 text-cyan-300 border border-navy-700 py-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Examine Risk Equations &amp; Data Provenance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
