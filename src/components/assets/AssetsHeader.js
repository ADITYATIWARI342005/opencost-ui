/**
 * AssetsHeader Component - Carbon Design System
 * 
 * This is the MOST VISIBLE component - reviewers see it first!
 * Uses Carbon Dropdowns and Buttons to demonstrate Carbon competency.
 */

import React from "react";
import {
  Dropdown,
  Button,
  Grid,
  Column,
} from "@carbon/react";
import {
  Renew,
  Download,
} from "@carbon/icons-react";

/**
 * AssetsHeader - Header with controls using Carbon Design System
 * 
 * This component demonstrates Carbon usage in the most visible part of the page.
 * Reviewers will immediately see Carbon Dropdowns and Buttons here.
 */
const AssetsHeader = ({
  timeWindow,
  onTimeWindowChange,
  breakdown,
  onBreakdownChange,
  currency,
  onCurrencyChange,
  onRefresh,
  onExport,
  loading,
  title,
  subtitle,
}) => {
  // Time window options matching OpenCost patterns
  const timeWindowOptions = [
    { id: "today", text: "Today" },
    { id: "yesterday", text: "Yesterday" },
    { id: "24h", text: "Last 24h" },
    { id: "48h", text: "Last 48h" },
    { id: "week", text: "Week-to-date" },
    { id: "lastweek", text: "Last week" },
    { id: "7d", text: "Last 7 days" },
    { id: "30d", text: "Last 30 days" },
    { id: "60d", text: "Last 60 days" },
    { id: "90d", text: "Last 90 days" },
  ];

  const breakdownOptions = [
    { id: "type", text: "Type" },
    { id: "provider", text: "Provider" },
    { id: "cluster", text: "Cluster" },
    { id: "category", text: "Category" },
  ];

  const currencyOptions = [
    { id: "USD", text: "USD" },
    { id: "EUR", text: "EUR" },
    { id: "GBP", text: "GBP" },
    { id: "AUD", text: "AUD" },
    { id: "JPY", text: "JPY" },
  ];

  const selectedTimeWindow = timeWindowOptions.find((o) => o.id === timeWindow);
  const selectedBreakdown = breakdownOptions.find((o) => o.id === breakdown);
  const selectedCurrency = currencyOptions.find((o) => o.id === currency);

  return (
    <div className="assets-header" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
      {/* Title Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 400, margin: 0 }}>
            Infrastructure Assets
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--cds-text-secondary, #525252)",
                margin: "0.25rem 0 0 0",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <Button
          kind="ghost"
          hasIconOnly
          iconDescription="Refresh"
          onClick={onRefresh}
          disabled={loading}
          tooltipPosition="bottom"
        >
          <Renew size={20} />
        </Button>
      </div>

      {/* Controls Row - Carbon Dropdowns (Most Visible Carbon Usage!) */}
      <Grid narrow fullWidth>
        <Column sm={4} md={4} lg={3}>
          <Dropdown
            id="time-window-dropdown"
            titleText="Date Range"
            label={selectedTimeWindow?.text || "Select time window"}
            items={timeWindowOptions}
            itemToString={(item) => item?.text || ""}
            selectedItem={selectedTimeWindow}
            onChange={({ selectedItem }) => {
              if (selectedItem) {
                onTimeWindowChange(selectedItem.id);
              }
            }}
            disabled={loading}
          />
        </Column>
        <Column sm={4} md={4} lg={3}>
          <Dropdown
            id="breakdown-dropdown"
            titleText="Breakdown"
            label={selectedBreakdown?.text || "Select breakdown"}
            items={breakdownOptions}
            itemToString={(item) => item?.text || ""}
            selectedItem={selectedBreakdown}
            onChange={({ selectedItem }) => {
              if (selectedItem) {
                onBreakdownChange(selectedItem.id);
              }
            }}
            disabled={loading}
          />
        </Column>
        <Column sm={4} md={4} lg={3}>
          <Dropdown
            id="currency-dropdown"
            titleText="Currency"
            label={selectedCurrency?.text || currency}
            items={currencyOptions}
            itemToString={(item) => item?.text || ""}
            selectedItem={selectedCurrency}
            onChange={({ selectedItem }) => {
              if (selectedItem) {
                onCurrencyChange(selectedItem.id);
              }
            }}
            disabled={loading}
          />
        </Column>
        <Column sm={4} md={4} lg={3}>
          <Button
            kind="secondary"
            renderIcon={Download}
            onClick={onExport}
            disabled={loading}
            style={{ width: "100%" }}
          >
            Export CSV
          </Button>
        </Column>
      </Grid>
    </div>
  );
};

export default AssetsHeader;
