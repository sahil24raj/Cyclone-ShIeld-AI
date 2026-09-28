import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Move,
  Layers,
  Sparkles,
  Crosshair,
  Info
} from 'lucide-react';
import { CriticalAsset } from '../../types';
import {
  useMatrixCollisionLayout,
  getAssetRisk,
  getAssetCriticality,
  ResolvedAssetNode,
  Point
} from './useMatrixCollisionLayout';
import { AssetMarkerItem, getRiskSeverityClass } from './AssetMarkerItem';

interface TacticalMatrixCanvasProps {
  assets: CriticalAsset[];
  selectedAssetId: string;
  onSelectAsset: (assetId: string) => void;
  className?: string;
}

export const TacticalMatrixCanvas: React.FC<TacticalMatrixCanvasProps> = ({
  assets,
  selectedAssetId,
  onSelectAsset,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 680, height: 440 });

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);
  const [enableClustering, setEnableClustering] = useState<boolean>(true);

  // Measure container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || 680,
          height: clientHeight || 440,
        });
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    return () => ro.disconnect();
  }, []);

  // Padding inside canvas for axis ticks and titles
  const padding = useMemo(
    () => ({ top: 32, right: 36, bottom: 42, left: 48 }),
    []
  );

  // Run collision layout hook
  const { nodes, clusters, allRenderableNodes } = useMatrixCollisionLayout(assets, {
    width: dimensions.width,
    height: dimensions.height,
    padding,
    zoom,
    pan,
    selectedAssetId,
    expandedClusterId,
    enableClustering,
  });

  // ZOOM CONTROLS
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.6, +(z - 0.25).toFixed(2)));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setExpandedClusterId(null);
  }, []);

  // FIT ALL ASSETS TO VIEWPORT
  const handleFitAll = useCallback(() => {
    if (assets.length === 0 || dimensions.width <= 0 || dimensions.height <= 0) {
      handleReset();
      return;
    }

    const usableW = Math.max(10, dimensions.width - padding.left - padding.right);
    const usableH = Math.max(10, dimensions.height - padding.top - padding.bottom);

    const risks = assets.map(getAssetRisk);
    const crits = assets.map(getAssetCriticality);

    const minRisk = Math.min(...risks);
    const maxRisk = Math.max(...risks);
    const minCrit = Math.min(...crits);
    const maxCrit = Math.max(...crits);

    const spanX = Math.max(25, maxRisk - minRisk);
    const spanY = Math.max(25, maxCrit - minCrit);

    // Calculate ideal zoom to frame the points with 20% margin
    const targetZoomX = 85 / spanX;
    const targetZoomY = 85 / spanY;
    const newZoom = Math.min(2.0, Math.max(0.75, Math.min(targetZoomX, targetZoomY) * 0.9));

    // Calculate center offset
    const avgRisk = (minRisk + maxRisk) / 2;
    const avgCrit = (minCrit + maxCrit) / 2;

    const baseCenterX = padding.left + (avgRisk / 100) * usableW;
    const baseCenterY = dimensions.height - padding.bottom - (avgCrit / 100) * usableH;

    const canvasCenterX = dimensions.width / 2;
    const canvasCenterY = dimensions.height / 2;

    const targetPanX = -(baseCenterX - canvasCenterX) * newZoom;
    const targetPanY = -(baseCenterY - canvasCenterY) * newZoom;

    setZoom(+newZoom.toFixed(2));
    setPan({ x: Math.round(targetPanX), y: Math.round(targetPanY) });
  }, [assets, dimensions, padding, handleReset]);

  // WHEEL ZOOM HANDLER
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((prevZoom) => {
      const nextZoom = Math.min(2.5, Math.max(0.6, +(prevZoom + zoomDelta).toFixed(2)));
      return nextZoom;
    });
  }, []);

  // PAN POINTER DRAG HANDLERS
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only left click initiates pan
    if (e.button !== 0) return;
    // Don't drag if clicking directly on a button or marker
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // CLUSTER TOGGLE
  const handleToggleCluster = useCallback((clusterId: string) => {
    setExpandedClusterId((prev) => (prev === clusterId ? null : clusterId));
  }, []);

  // Calculate Quadrant Boundaries in current zoomed/panned coordinate space
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const usableW = Math.max(10, dimensions.width - padding.left - padding.right);
  const usableH = Math.max(10, dimensions.height - padding.top - padding.bottom);

  // Center 50% lines in screen space
  const midX = (padding.left + usableW * 0.5 - centerX) * zoom + centerX + pan.x;
  const midY = (dimensions.height - padding.bottom - usableH * 0.5 - centerY) * zoom + centerY + pan.y;

  return (
    <div className={`relative bg-navy-950 rounded-2xl border border-navy-800 flex flex-col justify-between overflow-hidden shadow-2xl select-none ${className}`}>
      {/* 1. TOP TOOLBAR: Controls & Title */}
      <div className="absolute top-2.5 right-3.5 z-30 flex items-center gap-1.5 bg-navy-900/90 backdrop-blur-md p-1 rounded-xl border border-navy-750 shadow-lg font-mono text-xs">
        {/* Cluster Mode Toggle */}
        <button
          onClick={() => setEnableClustering((c) => !c)}
          title={enableClustering ? 'Disable Smart Clustering' : 'Enable Smart Clustering'}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
            enableClustering
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
              : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span className="hidden sm:inline">Clusters</span>
        </button>

        <span className="w-px h-4 bg-navy-800" />

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.6}
          title="Zoom Out"
          className="p-1 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Level Indicator */}
        <span className="text-[10px] text-cyan-300 font-bold px-1 min-w-[36px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 2.5}
          title="Zoom In"
          className="p-1 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-navy-800" />

        {/* Fit All */}
        <button
          onClick={handleFitAll}
          title="Fit All Assets to Viewport"
          className="p-1 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition flex items-center gap-1"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden md:inline">Fit</span>
        </button>

        {/* Reset View */}
        <button
          onClick={handleReset}
          title="Reset Zoom & Pan"
          className="p-1 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. INTERACTIVE CANVAS CONTAINER */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[430px] md:h-[460px] overflow-hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* 4 QUADRANT BACKGROUND ZONES */}
        <div
          style={{
            position: 'absolute',
            left: `${padding.left}px`,
            right: `${padding.right}px`,
            top: `${padding.top}px`,
            bottom: `${padding.bottom}px`,
          }}
          className="pointer-events-none rounded-xl overflow-hidden border border-navy-800/60"
        >
          {/* Static quadrant quadrant background tint */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {/* Top-Left: Quadrant II (Amber - Vital Lifeline Standby) */}
            <div className="bg-amber-950/15 border-r border-b border-navy-800/80 p-2.5 flex flex-col justify-between">
              <div className="text-[9px] font-mono font-bold text-amber-400/90 bg-amber-950/80 border border-amber-700/60 px-2 py-0.5 rounded-md self-start">
                QUADRANT II: VITAL LIFELINE STANDBY
              </div>
              <span className="text-[8px] font-mono text-amber-300/40">High Crit • Low/Moderate Risk</span>
            </div>

            {/* Top-Right: Quadrant I (Red - Critical P0 Urgent Action) */}
            <div className="bg-red-950/20 border-b border-navy-800/80 p-2.5 flex flex-col justify-between">
              <div className="text-[9px] font-mono font-bold text-red-300 bg-red-950/90 border border-red-700/80 px-2 py-0.5 rounded-md self-end flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span>QUADRANT I: CRITICAL P0 DEFENSE</span>
              </div>
              <span className="text-[8px] font-mono text-red-300/50 text-right">High Crit • Critical Risk &gt; 60</span>
            </div>

            {/* Bottom-Left: Quadrant IV (Navy/Teal - Routine Monitoring) */}
            <div className="bg-navy-900/30 border-r border-navy-800/80 p-2.5 flex flex-col justify-between">
              <span className="text-[8px] font-mono text-slate-500">Standard Crit • Low Risk</span>
              <div className="text-[9px] font-mono font-bold text-slate-400 bg-navy-900/90 border border-navy-750 px-2 py-0.5 rounded-md self-start">
                QUADRANT IV: ROUTINE MONITORING
              </div>
            </div>

            {/* Bottom-Right: Quadrant III (Orange - Secondary Hazard Mitigation) */}
            <div className="bg-orange-950/15 p-2.5 flex flex-col justify-between">
              <span className="text-[8px] font-mono text-orange-400/40 text-right">Standard Crit • High Risk</span>
              <div className="text-[9px] font-mono font-bold text-orange-400 bg-orange-950/80 border border-orange-800/60 px-2 py-0.5 rounded-md self-end">
                QUADRANT III: SECONDARY ACCESS MITIGATION
              </div>
            </div>
          </div>

          {/* DYNAMIC CROSSHAIR TICKS & GUIDELINES */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 50% Center dashed crosshair */}
            <div
              style={{ left: `${((50 / 100) * 100)}%` }}
              className="absolute top-0 bottom-0 w-px border-l border-dashed border-cyan-500/25"
            />
            <div
              style={{ top: `${((50 / 100) * 100)}%` }}
              className="absolute left-0 right-0 h-px border-t border-dashed border-cyan-500/25"
            />

            {/* Subtle 25% and 75% grid lines */}
            <div style={{ left: '25%' }} className="absolute top-0 bottom-0 w-px border-l border-dotted border-navy-800/40" />
            <div style={{ left: '75%' }} className="absolute top-0 bottom-0 w-px border-l border-dotted border-navy-800/40" />
            <div style={{ top: '25%' }} className="absolute left-0 right-0 h-px border-t border-dotted border-navy-800/40" />
            <div style={{ top: '75%' }} className="absolute left-0 right-0 h-px border-t border-dotted border-navy-800/40" />
          </div>
        </div>

        {/* 3. SVG VECTOR LAYER FOR CONNECTORS AND TRUE DATA POINTS */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <defs>
            <radialGradient id="selectedGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {allRenderableNodes.map((node) => {
            const { truePoint, displayPoint, isDisplaced, isSelected, rawRisk } = node;
            const severity = getRiskSeverityClass(rawRisk);

            // True data point dot color
            const dotColor =
              rawRisk >= 80 ? '#ef4444' : rawRisk >= 60 ? '#f97316' : rawRisk >= 40 ? '#eab308' : '#2dd4bf';

            return (
              <g key={`svg-node-${node.asset.id}-${node.isCluster ? 'cluster' : 'asset'}`}>
                {/* 1. True Mathematical Coordinate Marker */}
                <circle
                  cx={truePoint.x}
                  cy={truePoint.y}
                  r={isSelected ? 5 : 3.5}
                  fill={dotColor}
                  stroke="#071A2B"
                  strokeWidth={1.5}
                  className={isSelected ? 'animate-pulse' : ''}
                />

                {/* 2. Highlight Ring if selected */}
                {isSelected && (
                  <circle
                    cx={truePoint.x}
                    cy={truePoint.y}
                    r={9}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    className="animate-spin"
                    style={{ transformOrigin: `${truePoint.x}px ${truePoint.y}px` }}
                  />
                )}

                {/* 3. Connector Line from True Coordinate to Displaced Marker */}
                {isDisplaced && (
                  <line
                    x1={truePoint.x}
                    y1={truePoint.y}
                    x2={displayPoint.x}
                    y2={displayPoint.y}
                    stroke={isSelected ? '#06b6d4' : dotColor}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray={isSelected ? 'none' : '3 3'}
                    strokeOpacity={isSelected ? 0.9 : 0.45}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* 4. ASSET MARKERS LAYER */}
        <div className="absolute inset-0 pointer-events-auto">
          {allRenderableNodes.map((node) => (
            <AssetMarkerItem
              key={`${node.asset.id}-${node.isCluster ? 'cluster' : 'single'}`}
              node={node}
              onSelectAsset={onSelectAsset}
              onToggleCluster={handleToggleCluster}
              isClusterExpanded={expandedClusterId === node.clusterId}
              zoom={zoom}
            />
          ))}
        </div>

        {/* 5. STATIC Y-AXIS LABELS & TICKS (Left Gutter) */}
        <div
          style={{
            top: `${padding.top}px`,
            bottom: `${padding.bottom}px`,
            left: '6px',
            width: `${padding.left - 10}px`,
          }}
          className="absolute flex flex-col justify-between text-[10px] font-mono text-slate-400 pointer-events-none z-20"
        >
          <span className="text-red-400 font-bold">100 -</span>
          <span>75 -</span>
          <span className="text-cyan-400">50 -</span>
          <span>25 -</span>
          <span>0 -</span>
        </div>

        {/* Y-AXIS ROTATED TITLE */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold pointer-events-none z-20">
          Criticality Weight &rarr;
        </div>

        {/* 6. STATIC X-AXIS LABELS & TICKS (Bottom Gutter) */}
        <div
          style={{
            left: `${padding.left}px`,
            right: `${padding.right}px`,
            bottom: '12px',
          }}
          className="absolute flex justify-between text-[10px] font-mono text-slate-400 pointer-events-none z-20"
        >
          <span>| 0 (Safe)</span>
          <span>| 25</span>
          <span className="text-cyan-400 font-bold">| 50 (Elevated)</span>
          <span>| 75</span>
          <span className="text-red-400 font-bold">| 100 (Extreme)</span>
        </div>

        {/* X-AXIS TITLE */}
        <div className="absolute inset-x-0 bottom-0.5 text-center text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold pointer-events-none z-20">
          Calculated Hazard Risk Score &rarr;
        </div>
      </div>
    </div>
  );
};
