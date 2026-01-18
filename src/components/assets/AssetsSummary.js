import React from "react";
import { Tile } from "@carbon/react";
import {
  Currency,
  Dashboard,
  Warning,
  ChartBubble,
} from "@carbon/icons-react";
import { formatCurrency } from "../../utils/assetFormatting";

/**
 * Assets Summary Component using Carbon Design System
 * Displays 4 key metric tiles: Total Cost, Efficiency Score, Waste Detected, Asset Breakdown
 */
const AssetsSummary = ({ metrics, currency }) => {
  const getEfficiencyColor = (score) => {
    if (score >= 70) return "var(--cds-support-success)"; // Green
    if (score >= 40) return "var(--cds-support-warning)"; // Yellow
    return "var(--cds-support-error)"; // Red
  };

  const getEfficiencyText = (score) => {
    if (score >= 70) return "Efficient";
    if (score >= 40) return "Needs Review";
    return "Action Required";
  };

  const summaryCards = [
    {
      icon: <Currency size={24} />,
      label: "Total Asset Cost",
      value: formatCurrency(metrics.totalCost, currency),
      subtitle: `${metrics.assetCount} assets`,
      color: "var(--cds-link-primary)",
    },
    {
      icon: <Dashboard size={24} />,
      label: "Efficiency Score",
      value: `${metrics.averageUtilization.toFixed(1)}%`,
      subtitle: getEfficiencyText(metrics.averageUtilization),
      color: getEfficiencyColor(metrics.averageUtilization),
    },
    {
      icon: <Warning size={24} />,
      label: "Waste Detected",
      value: formatCurrency(metrics.totalIdleCost, currency),
      subtitle: `${metrics.wastePercentage.toFixed(1)}% of total`,
      // Dynamic color: Green when $0.00 (no waste), Red when > $0.00 (waste detected)
      color: metrics.totalIdleCost === 0 
        ? "var(--cds-support-success, #24a148)" 
        : "var(--cds-support-error, #da1e28)",
      hasWaste: metrics.totalIdleCost > 0,
    },
    {
      icon: <ChartBubble size={24} />,
      label: "Asset Breakdown",
      value: metrics.assetCount,
      subtitle: `${metrics.criticalCount} critical, ${metrics.reviewCount} to review`,
      color: "var(--cds-link-primary)",
    },
  ];

  return (
    <div
      className="assets-summary"
      style={{
        padding: "0 24px 24px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}
    >
      {summaryCards.map((card, index) => (
        <Tile
          key={index}
          className="assets-summary__tile"
          style={{
            padding: "1rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.75rem",
            minHeight: "120px",
          }}
        >
          <div
            className="assets-summary__tile-header"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            <div
              className="assets-summary__tile-icon"
              style={{
                color: card.color,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </div>
            <p
              className="assets-summary__tile-label"
              style={{
                fontSize: "0.875rem",
                // Dynamic color for Waste Detected label
                color: card.label === "Waste Detected"
                  ? card.color
                  : "var(--cds-text-secondary, #525252)",
                margin: 0,
                fontWeight: card.label === "Waste Detected" ? 500 : 400,
              }}
            >
              {card.label}
            </p>
          </div>
          <div className="assets-summary__tile-content" style={{ width: "100%" }}>
            <p
              className="assets-summary__tile-value"
              style={{
                fontSize: "1.75rem",
                fontWeight: 600,
                margin: "0 0 0.25rem 0",
                lineHeight: 1.2,
                color:
                  card.label === "Waste Detected"
                    ? card.color // Dynamic: green when $0.00, red when > $0.00
                    : card.label === "Efficiency Score"
                    ? card.color
                    : "var(--cds-text-primary, #161616)",
              }}
            >
              {card.value}
            </p>
            <p
              className="assets-summary__tile-subtitle"
              style={{
                fontSize: "0.75rem",
                margin: 0,
                color:
                  card.label === "Efficiency Score"
                    ? card.color
                    : "var(--cds-text-secondary, #525252)",
              }}
            >
              {card.subtitle}
            </p>
          </div>
        </Tile>
      ))}
    </div>
  );
};

export default AssetsSummary;
