import React from 'react';
import { AlertCircle, RefreshCw, FolderSearch } from 'lucide-react';

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-2 animate-pulse ${className}`} aria-busy="true" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-navy-850 border border-navy-800 rounded-md"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center space-y-3 bg-navy-950/60 border border-navy-800 rounded-2xl">
      <div className="p-3 rounded-full bg-navy-900 border border-navy-750 text-slate-400">
        {icon || <FolderSearch className="w-6 h-6 text-slate-400" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="font-bold text-sm text-white font-mono">{title}</h4>
        {description && <p className="text-xs text-slate-400 leading-relaxed">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-cyan-300 border border-navy-700 text-xs font-mono font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Pipeline Interruption',
  message,
  onRetry,
}) => {
  return (
    <div className="p-6 bg-red-950/20 border border-red-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-red-300 font-mono">{title}</h4>
          <p className="text-slate-300 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/50 font-mono text-xs font-bold transition-colors flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
