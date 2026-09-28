import { useMemo } from 'react';
import { CriticalAsset } from '../../types';

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResolvedAssetNode {
  asset: CriticalAsset;
  rawRisk: number;
  rawCrit: number;
  truePoint: Point; // Screen pixel coordinates of the true mathematical point
  displayPoint: Point; // Screen pixel coordinates after collision resolution
  isDisplaced: boolean;
  displacementDistance: number;
  isSelected: boolean;
  clusterId?: string;
  clusterMembers?: CriticalAsset[];
  isCluster: boolean;
  boxWidth: number;
  boxHeight: number;
}

export interface LayoutOptions {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  zoom: number;
  pan: Point;
  selectedAssetId?: string;
  expandedClusterId?: string | null;
  enableClustering?: boolean;
}

// Helpers for score extraction
export function getAssetRisk(asset: any): number {
  return asset.calculatedRiskScore || asset.risk_score || asset.baseFloodRisk || 50;
}

export function getAssetCriticality(asset: any): number {
  if (asset.criticalityScore !== undefined) return asset.criticalityScore;
  if (asset.criticality === 'critical') return 95;
  if (asset.criticality === 'high') return 75;
  if (asset.criticality === 'moderate') return 55;
  return 40;
}

// Check if two bounding boxes overlap with an optional buffer margin
function boxesOverlap(
  b1: BoundingBox,
  b2: BoundingBox,
  margin = 8
): boolean {
  return !(
    b1.x + b1.width + margin <= b2.x ||
    b2.x + b2.width + margin <= b1.x ||
    b1.y + b1.height + margin <= b2.y ||
    b2.y + b2.height + margin <= b1.y
  );
}

// Generate spiral candidate offsets in pixels
const SPIRAL_CANDIDATES: Point[] = [
  { x: 0, y: 0 },
  { x: 0, y: -24 },
  { x: 30, y: 0 },
  { x: 0, y: 24 },
  { x: -30, y: 0 },
  { x: 26, y: -22 },
  { x: -26, y: -22 },
  { x: 26, y: 22 },
  { x: -26, y: 22 },
  { x: 0, y: -48 },
  { x: 55, y: 0 },
  { x: 0, y: 48 },
  { x: -55, y: 0 },
  { x: 45, y: -38 },
  { x: -45, y: -38 },
  { x: 45, y: 38 },
  { x: -45, y: 38 },
  { x: 65, y: -24 },
  { x: -65, y: -24 },
  { x: 65, y: 24 },
  { x: -65, y: 24 },
  { x: 0, y: -72 },
  { x: 75, y: 0 },
  { x: 0, y: 72 },
  { x: -75, y: 0 },
  { x: 60, y: -58 },
  { x: -60, y: -58 },
  { x: 60, y: 58 },
  { x: -60, y: 58 },
];

export function useMatrixCollisionLayout(
  assets: CriticalAsset[],
  options: LayoutOptions
): {
  nodes: ResolvedAssetNode[];
  clusters: ResolvedAssetNode[];
  allRenderableNodes: ResolvedAssetNode[];
} {
  return useMemo(() => {
    const { width, height, padding, zoom, pan, selectedAssetId, expandedClusterId, enableClustering = true } = options;

    if (width <= 0 || height <= 0 || assets.length === 0) {
      return { nodes: [], clusters: [], allRenderableNodes: [] };
    }

    const usableWidth = Math.max(10, width - padding.left - padding.right);
    const usableHeight = Math.max(10, height - padding.top - padding.bottom);

    // 1. Compute Base Mathematical Screen Coordinates
    // Risk (0-100) -> X, Criticality (0-100) -> Y (higher criticality at the top)
    const rawNodes = assets.map((asset) => {
      const risk = getAssetRisk(asset);
      const crit = getAssetCriticality(asset);
      const isSelected = asset.id === selectedAssetId;

      // Base coordinate in unzoomed canvas space
      const baseCanvasX = padding.left + (risk / 100) * usableWidth;
      const baseCanvasY = height - padding.bottom - (crit / 100) * usableHeight;

      // Apply zoom centered at canvas center + pan offset
      const centerX = width / 2;
      const centerY = height / 2;

      const screenX = (baseCanvasX - centerX) * zoom + centerX + pan.x;
      const screenY = (baseCanvasY - centerY) * zoom + centerY + pan.y;

      // Approximate dimensions for collision detection
      let boxWidth = 38;
      let boxHeight = 38;
      if (isSelected) {
        boxWidth = 148;
        boxHeight = 44;
      } else if (zoom >= 1.35) {
        boxWidth = 110;
        boxHeight = 34;
      }

      return {
        asset,
        rawRisk: risk,
        rawCrit: crit,
        truePoint: { x: screenX, y: screenY },
        displayPoint: { x: screenX, y: screenY },
        isDisplaced: false,
        displacementDistance: 0,
        isSelected,
        isCluster: false,
        boxWidth,
        boxHeight,
      };
    });

    // 2. Clustering Phase (for assets with near-identical true coordinates when zoomed out)
    // Cluster threshold in screen pixels
    const clusterDistanceThreshold = zoom < 0.85 ? 42 : zoom < 1.15 ? 28 : 18;

    const clusters: ResolvedAssetNode[] = [];
    const unclusteredNodes: ResolvedAssetNode[] = [];
    const visited = new Set<string>();

    if (enableClustering) {
      for (let i = 0; i < rawNodes.length; i++) {
        const nodeA = rawNodes[i];
        if (visited.has(nodeA.asset.id)) continue;

        // Never cluster the selected asset
        if (nodeA.isSelected) {
          visited.add(nodeA.asset.id);
          unclusteredNodes.push(nodeA);
          continue;
        }

        const group: ResolvedAssetNode[] = [nodeA];
        for (let j = i + 1; j < rawNodes.length; j++) {
          const nodeB = rawNodes[j];
          if (visited.has(nodeB.asset.id) || nodeB.isSelected) continue;

          const dx = nodeA.truePoint.x - nodeB.truePoint.x;
          const dy = nodeA.truePoint.y - nodeB.truePoint.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= clusterDistanceThreshold) {
            group.push(nodeB);
          }
        }

        // Check if cluster is expanded by user
        const clusterKey = `cluster-${nodeA.asset.id}`;
        const isClusterExpanded = expandedClusterId === clusterKey;

        if (group.length > 1 && !isClusterExpanded) {
          // Mark all group members as visited
          group.forEach((n) => visited.add(n.asset.id));

          // Compute cluster centroid
          const avgX = group.reduce((sum, n) => sum + n.truePoint.x, 0) / group.length;
          const avgY = group.reduce((sum, n) => sum + n.truePoint.y, 0) / group.length;
          const avgRisk = group.reduce((sum, n) => sum + n.rawRisk, 0) / group.length;
          const avgCrit = group.reduce((sum, n) => sum + n.rawCrit, 0) / group.length;

          // Highest severity asset inside cluster acts as lead asset
          const leadAsset = group.slice().sort((a, b) => b.rawRisk - a.rawRisk)[0].asset;

          clusters.push({
            asset: leadAsset,
            rawRisk: Math.round(avgRisk),
            rawCrit: Math.round(avgCrit),
            truePoint: { x: avgX, y: avgY },
            displayPoint: { x: avgX, y: avgY },
            isDisplaced: false,
            displacementDistance: 0,
            isSelected: false,
            clusterId: clusterKey,
            clusterMembers: group.map((g) => g.asset),
            isCluster: true,
            boxWidth: 70,
            boxHeight: 36,
          });
        } else if (group.length > 1 && isClusterExpanded) {
          // If expanded, fan out individual assets along a smooth radial flower/circle
          visited.add(nodeA.asset.id);
          const fanRadius = Math.max(48, group.length * 14);
          group.forEach((node, idx) => {
            visited.add(node.asset.id);
            const angle = (idx / group.length) * 2 * Math.PI - Math.PI / 2;
            const fanX = nodeA.truePoint.x + Math.cos(angle) * fanRadius;
            const fanY = nodeA.truePoint.y + Math.sin(angle) * fanRadius;

            unclusteredNodes.push({
              ...node,
              displayPoint: { x: fanX, y: fanY },
              isDisplaced: true,
              displacementDistance: fanRadius,
              clusterId: clusterKey,
            });
          });
        } else {
          visited.add(nodeA.asset.id);
          unclusteredNodes.push(nodeA);
        }
      }
    } else {
      unclusteredNodes.push(...rawNodes);
    }

    // 3. Deterministic Collision Resolution for Remaining Nodes & Clusters
    // Sort nodes so Selected Asset & Critical Risk assets get priority in closest positioning
    const nodesToPlace: ResolvedAssetNode[] = [...clusters, ...unclusteredNodes].sort((a, b) => {
      if (a.isSelected) return -1;
      if (b.isSelected) return 1;
      return b.rawRisk - a.rawRisk;
    });

    const placedBoxes: BoundingBox[] = [];
    const resolvedNodes: ResolvedAssetNode[] = [];

    // Screen bounds margin so labels don't get clipped by edge of matrix
    const minX = 14;
    const maxX = width - 14;
    const minY = 14;
    const maxY = height - 14;

    for (const node of nodesToPlace) {
      // If already fanned out by cluster expansion, keep fan position unless it overlaps placed box
      let bestPos = { ...node.displayPoint };
      let bestDistance = Math.hypot(bestPos.x - node.truePoint.x, bestPos.y - node.truePoint.y);
      let foundSlot = false;

      // Test candidates starting from initial position then spiral outward
      for (const offset of SPIRAL_CANDIDATES) {
        const candidateX = node.displayPoint.x + offset.x;
        const candidateY = node.displayPoint.y + offset.y;

        // Ensure candidate is within canvas visible bounds
        const halfW = node.boxWidth / 2;
        const halfH = node.boxHeight / 2;
        const clampedX = Math.max(minX + halfW, Math.min(maxX - halfW, candidateX));
        const clampedY = Math.max(minY + halfH, Math.min(maxY - halfH, candidateY));

        const testBox: BoundingBox = {
          x: clampedX - halfW,
          y: clampedY - halfH,
          width: node.boxWidth,
          height: node.boxHeight,
        };

        // Check overlap with all previously placed nodes
        const hasCollision = placedBoxes.some((placed) => boxesOverlap(testBox, placed, 6));

        if (!hasCollision) {
          bestPos = { x: clampedX, y: clampedY };
          bestDistance = Math.hypot(clampedX - node.truePoint.x, clampedY - node.truePoint.y);
          placedBoxes.push(testBox);
          foundSlot = true;
          break;
        }
      }

      if (!foundSlot) {
        // Fallback: place at candidate that minimizes overlap, add to placed
        placedBoxes.push({
          x: bestPos.x - node.boxWidth / 2,
          y: bestPos.y - node.boxHeight / 2,
          width: node.boxWidth,
          height: node.boxHeight,
        });
      }

      const isDisplaced = bestDistance > 4;

      resolvedNodes.push({
        ...node,
        displayPoint: bestPos,
        isDisplaced,
        displacementDistance: bestDistance,
      });
    }

    const separatedNodes = resolvedNodes.filter((n) => !n.isCluster);
    const separatedClusters = resolvedNodes.filter((n) => n.isCluster);

    return {
      nodes: separatedNodes,
      clusters: separatedClusters,
      allRenderableNodes: resolvedNodes,
    };
  }, [assets, options]);
}
