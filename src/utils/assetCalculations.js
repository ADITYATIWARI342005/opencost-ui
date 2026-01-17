/**
 * Utility functions for calculating asset metrics
 */

/**
 * Calculate utilization based on asset type
 */
export const calculateUtilization = (asset) => {
  switch (asset.type) {
    case "Node":
      // Use cpuBreakdown and ramBreakdown
      const cpuUtil = asset.cpuBreakdown
        ? 1 - (asset.cpuBreakdown.idle || 0)
        : 0;
      const ramUtil = asset.ramBreakdown
        ? 1 - (asset.ramBreakdown.idle || 0)
        : 0;
      return (cpuUtil + ramUtil) / 2;

    case "Disk":
      // Use storage utilization
      if (asset.byteHours && asset.byteHoursUsed) {
        return asset.byteHoursUsed / asset.byteHours;
      }
      return 0.5; // Default if no data

    case "LoadBalancer":
      // Load balancers are typically fully utilized or not
      return 0.8; // Assume high utilization

    case "Network":
      return 0.7; // Network typically has variable usage

    default:
      return 0.5; // Default mid-range
  }
};

/**
 * Extract owner from Kubernetes labels
 */
export const extractOwner = (labels = {}) => {
  // Common label patterns for ownership
  const ownerKeys = [
    "team",
    "owner",
    "app",
    "application",
    "namespace", // Fallback
    "kubernetes_io_name",
  ];

  for (const key of ownerKeys) {
    if (labels[key]) {
      return labels[key];
    }
  }

  return null; // Untagged
};

/**
 * Calculate median value
 */
const calculateMedian = (values) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

/**
 * Classify asset into efficiency quadrant
 */
export const classifyEfficiencyQuadrant = (cost, utilization, allAssets) => {
  if (!allAssets || allAssets.length === 0) return "review";

  const costs = allAssets.map((a) => a.totalCost || 0).filter((c) => c > 0);
  const medianCost = calculateMedian(costs);
  const utilizationThreshold = 0.5;

  const highCost = cost > medianCost;
  const highUtilization = utilization > utilizationThreshold;

  if (highCost && !highUtilization) return "critical";
  if (highCost && highUtilization) return "efficient";
  if (!highCost && !highUtilization) return "review";
  return "optimized";
};

/**
 * Transform raw API assets into enriched data model
 */
export const enrichAssetsData = (rawAssets) => {
  const enrichedAssets = [];

  for (const [key, asset] of Object.entries(rawAssets)) {
    const utilization = calculateUtilization(asset);
    const totalCost = asset.totalCost || 0;
    const idleCost = totalCost * (1 - utilization);
    const productiveCost = totalCost - idleCost;

    const enriched = {
      // Original data
      ...asset,

      // Parsed identifiers
      id: key,
      name: asset.properties?.name || key.split("/").pop() || "Unknown",
      type: asset.type,
      provider: asset.properties?.provider || "Unknown",
      cluster: asset.properties?.cluster || "Unknown",
      category: asset.properties?.category || "Unknown",

      // Cost metrics
      totalCost,
      idleCost,
      productiveCost,

      // Utilization calculation
      utilization,

      // Efficiency score (0-100)
      efficiencyScore: Math.round(utilization * 100),

      // Owner extraction
      owner: extractOwner(asset.labels || {}),

      // Metadata
      window: asset.window,
      startTime: asset.start,
      endTime: asset.end,
    };

    enrichedAssets.push(enriched);
  }

  // Classify quadrants after all assets are enriched
  enrichedAssets.forEach((asset) => {
    asset.quadrant = classifyEfficiencyQuadrant(
      asset.totalCost,
      asset.utilization,
      enrichedAssets
    );
  });

  return enrichedAssets;
};

/**
 * Aggregate assets by type
 */
export const aggregateByType = (assets) => {
  const aggregated = {};

  assets.forEach((asset) => {
    if (!aggregated[asset.type]) {
      aggregated[asset.type] = {
        type: asset.type,
        count: 0,
        totalCost: 0,
        idleCost: 0,
        productiveCost: 0,
        averageUtilization: 0,
      };
    }

    const agg = aggregated[asset.type];
    agg.count += 1;
    agg.totalCost += asset.totalCost;
    agg.idleCost += asset.idleCost;
    agg.productiveCost += asset.productiveCost;
  });

  // Calculate averages
  Object.values(aggregated).forEach((agg) => {
    agg.averageUtilization =
      agg.totalCost > 0 ? agg.productiveCost / agg.totalCost : 0;
  });

  return Object.values(aggregated);
};

/**
 * Calculate summary metrics
 */
export const calculateSummaryMetrics = (assets) => {
  if (!assets || assets.length === 0) {
    return {
      totalCost: 0,
      totalIdleCost: 0,
      totalProductiveCost: 0,
      averageUtilization: 0,
      wastePercentage: 0,
      quickWinSavings: 0,
      assetCount: 0,
      criticalCount: 0,
      reviewCount: 0,
      efficientCount: 0,
    };
  }

  const totalCost = assets.reduce((sum, a) => sum + (a.totalCost || 0), 0);
  const totalIdleCost = assets.reduce((sum, a) => sum + (a.idleCost || 0), 0);
  const totalProductiveCost = assets.reduce(
    (sum, a) => sum + (a.productiveCost || 0),
    0
  );

  const averageUtilization =
    totalCost > 0 ? (totalProductiveCost / totalCost) * 100 : 0;
  const wastePercentage = totalCost > 0 ? (totalIdleCost / totalCost) * 100 : 0;

  // Quick wins: Top 5 assets with highest idle cost
  const quickWins = [...assets]
    .sort((a, b) => (b.idleCost || 0) - (a.idleCost || 0))
    .slice(0, 5);
  const quickWinSavings = quickWins.reduce(
    (sum, a) => sum + (a.idleCost || 0),
    0
  );

  return {
    totalCost,
    totalIdleCost,
    totalProductiveCost,
    averageUtilization,
    wastePercentage,
    quickWinSavings,
    assetCount: assets.length,
    criticalCount: assets.filter((a) => a.quadrant === "critical").length,
    reviewCount: assets.filter((a) => a.quadrant === "review").length,
    efficientCount:
      assets.filter((a) => a.quadrant === "efficient").length +
      assets.filter((a) => a.quadrant === "optimized").length,
  };
};

/**
 * Get recommendations for an asset
 */
export const getRecommendations = (asset) => {
  const recommendations = [];

  // Low utilization recommendations
  if (asset.utilization < 0.3) {
    recommendations.push({
      title: "Rightsize or Terminate",
      description: `This ${asset.type} is underutilized at ${(
        asset.utilization * 100
      ).toFixed(1)}%. Consider downsizing or removing if not needed.`,
      savings: asset.idleCost,
      priority: "high",
    });
  }

  // Untagged resources
  if (!asset.owner) {
    recommendations.push({
      title: "Add Owner Tag",
      description:
        "This asset is untagged. Add owner labels for chargeback tracking.",
      savings: 0,
      priority: "medium",
    });
  }

  // Node-specific recommendations
  if (asset.type === "Node" && asset.preemptible === 0) {
    const potentialSavings = asset.totalCost * 0.7; // ~70% savings with spot
    recommendations.push({
      title: "Consider Spot Instances",
      description:
        "This node is on-demand. Spot instances could reduce costs by ~70%.",
      savings: potentialSavings,
      priority: "medium",
    });
  }

  // Disk-specific recommendations
  if (
    asset.type === "Disk" &&
    asset.storageClass &&
    asset.storageClass !== "standard-rwo"
  ) {
    recommendations.push({
      title: "Review Storage Class",
      description: `Using ${asset.storageClass}. Standard storage might be more cost-effective for this workload.`,
      savings: asset.totalCost * 0.3,
      priority: "low",
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};
