/**
 * Utility functions for formatting asset data
 */

/**
 * Format currency value
 */
export const formatCurrency = (value, currency = "USD") => {
  if (value === null || value === undefined || isNaN(value)) {
    return "$0.00";
  }

  // Simple currency formatting - can be enhanced with currency conversion
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Export assets to CSV
 */
export const exportToCSV = (assets, filename = "assets-export.csv") => {
  if (!assets || assets.length === 0) {
    return;
  }

  // Define CSV headers
  const headers = [
    "Name",
    "Type",
    "Provider",
    "Cluster",
    "Category",
    "Total Cost",
    "Utilization",
    "Idle Cost",
    "Efficiency Score",
    "Owner",
    "Quadrant",
  ];

  // Convert assets to CSV rows
  const rows = assets.map((asset) => [
    asset.name || "",
    asset.type || "",
    asset.provider || "",
    asset.cluster || "",
    asset.category || "",
    asset.totalCost?.toFixed(2) || "0.00",
    formatPercentage(asset.utilization || 0),
    asset.idleCost?.toFixed(2) || "0.00",
    `${asset.efficiencyScore || 0}%`,
    asset.owner || "Untagged",
    asset.quadrant || "",
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
