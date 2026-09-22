import React from 'react';
import {
  X,
  Building2,
  AlertTriangle,
  CheckSquare,
  Square,
  Zap,
  Phone,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { CriticalAsset } from '../../types';
import { useAppState } from '../../context/AppStateContext';

interface AssetDetailModalProps {
  asset: CriticalAsset | null;
  onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const { toggleAssetAction } = useAppState();

  if (!asset) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-navy-750 bg-navy-950 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {asset.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ID: {asset.id}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {asset.name}
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

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Status & Risk Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-navy-850 p-3 rounded-lg border border-navy-750 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Risk Score</div>
              <div className="text-2xl font-black font-mono text-red-400 mt-0.5">
                {asset.risk_score}
                <span className="text-xs text-slate-500">/100</span>
              </div>
            </div>

            <div className="bg-navy-850 p-3 rounded-lg border border-navy-750 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Criticality</div>
              <div className="text-sm font-bold font-mono text-orange-300 uppercase mt-1">
                {asset.criticality}
              </div>
            </div>

            <div className="bg-navy-850 p-3 rounded-lg border border-navy-750 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Operational State</div>
              <div className="text-sm font-bold font-mono text-cyan-300 uppercase mt-1">
                {asset.current_status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Hazard Exposure Note */}
          <div className="bg-red-950/30 border border-red-800/40 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-300 font-mono">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Hazard & Vulnerability Exposure</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {asset.hazard_exposure}
            </p>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              Elevation: {asset.elevation}m AMSL • Flood Zone Inundation: {asset.in_flood_zone ? 'YES' : 'NO'}
            </div>
          </div>

          {/* Recommended Operational Action Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Emergency Action Checklist (DEO Protocol)</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to check off</span>
            </div>

            <div className="space-y-2">
              {asset.recommended_actions.map((action) => {
                const isCompleted = !!asset.action_status[action];
                return (
                  <button
                    key={action}
                    onClick={() => toggleAssetAction(asset.id, action)}
                    className={`w-full text-left p-3 rounded-lg text-xs flex items-start gap-2.5 transition-all border ${
                      isCompleted
                        ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                        : 'bg-navy-850 hover:bg-navy-800 border-navy-750 text-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={isCompleted ? 'line-through opacity-80' : ''}>
                      {action}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operational Contacts & Backup Utilities */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-cyan-400" />
                <span>Site In-Charge:</span>
              </div>
              <div className="font-semibold text-slate-200 truncate">
                {asset.contact_person || 'District EOC Control'}
              </div>
            </div>

            <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Aux Generator Status:</span>
              </div>
              <div className={`font-semibold ${asset.backup_power_ready ? 'text-emerald-400' : 'text-red-400'}`}>
                {asset.backup_power_ready ? 'Standby Ready (Diesel Fueled)' : 'Verification Needed'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-navy-750 bg-navy-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 rounded-lg text-xs font-mono font-semibold transition-colors"
          >
            Close Asset Details
          </button>
        </div>
      </div>
    </div>
  );
};
