import React from 'react';
import {
  X,
  Database,
  CloudRain,
  Wind,
  Cpu,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { SystemDataSources, DataSourceStatus } from '../../types/provenance';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSources: SystemDataSources;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose, dataSources }) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: DataSourceStatus['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Connected
          </span>
        );
      case 'fixture_mode':
        return (
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
            <Radio className="w-3 h-3 text-purple-400 animate-pulse" /> Dev Fixtures Active
          </span>
        );
      case 'not_configured':
        return (
          <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-slate-500" /> Not Configured
          </span>
        );
      case 'error':
        return (
          <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-400" /> Connection Error
          </span>
        );
      case 'no_active_event':
        return (
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> No Active Cyclone
          </span>
        );
    }
  };

  const sourcesList: { key: keyof SystemDataSources; icon: React.ReactNode }[] = [
    { key: 'weather', icon: <CloudRain className="w-4 h-4 text-blue-400" /> },
    { key: 'cyclone', icon: <Wind className="w-4 h-4 text-rose-400" /> },
    { key: 'mlModel', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
    { key: 'geospatial', icon: <MapPin className="w-4 h-4 text-amber-400" /> },
    { key: 'population', icon: <Users className="w-4 h-4 text-cyan-400" /> },
    { key: 'historical', icon: <Database className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-navy-750 bg-navy-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  System Architecture & Provenance
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Data Pipeline &amp; Integration Status
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="bg-navy-950/80 p-3 rounded-xl border border-navy-800 text-xs text-slate-300">
            <strong>Production Data Policy:</strong> Cyclone Shield AI enforces strict data provenance. When real API endpoints or sensors are not connected, the platform renders explicit unconfigured states rather than synthetic or fabricated data.
          </div>

          <div className="space-y-2.5">
            {sourcesList.map(({ key, icon }) => {
              const src = dataSources[key];
              return (
                <div
                  key={src.id}
                  className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-navy-900 border border-navy-800 flex-shrink-0 mt-0.5 sm:mt-0">
                      {icon}
                    </span>
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        <span>{src.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          ({src.provider})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {src.details}
                      </div>
                      {src.envVarKey && (
                        <div className="text-[10px] font-mono text-cyan-400/80 mt-1">
                          Config env: <code className="bg-navy-900 px-1 py-0.5 rounded">{src.envVarKey}</code>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 self-start sm:self-center">
                    {getStatusBadge(src.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-navy-750 bg-navy-950 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>See DATA_SOURCES.md for endpoint specifications.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 rounded-lg text-xs font-mono font-semibold transition-colors"
          >
            Close Status
          </button>
        </div>
      </div>
    </div>
  );
};
