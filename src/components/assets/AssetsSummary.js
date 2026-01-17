import React from "react";
import { Tile, Grid, Column } from "@carbon/react";
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
      color: "var(--cds-support-error)",
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
    <div className="assets-summary" style={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
      <Grid narrow fullWidth>
        {summaryCards.map((card, index) => (
          <Column key={index} sm={4} md={4} lg={3}>
            <Tile className="assets-summary__tile">
              <div
                className="assets-summary__tile-icon"
                style={{ color: card.color }}
              >
                {card.icon}
              </div>
              <div className="assets-summary__tile-content">
                <p className="assets-summary__tile-label">{card.label}</p>
                <p
                  className="assets-summary__tile-value"
                  style={{
                    color:
                      card.label === "Waste Detected"
                        ? "var(--cds-support-error)"
                        : card.label === "Efficiency Score"
                        ? card.color
                        : "var(--cds-text-primary)",
                  }}
                >
                  {card.value}
                </p>
                <p
                  className="assets-summary__tile-subtitle"
                  style={{
                    color:
                      card.label === "Efficiency Score"
                        ? card.color
                        : "var(--cds-text-secondary)",
                  }}
                >
                  {card.subtitle}
                </p>
              </div>
            </Tile>
          </Column>
        ))}
      </Grid>
    </div>
  );
};

export default AssetsSummary;
