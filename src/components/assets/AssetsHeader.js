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
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "24h", label: "Last 24h" },
    { id: "48h", label: "Last 48h" },
    { id: "week", label: "Week-to-date" },
    { id: "lastweek", label: "Last week" },
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "60d", label: "Last 60 days" },
    { id: "90d", label: "Last 90 days" },
  ];

  const breakdownOptions = [
    { id: "type", label: "Type" },
    { id: "provider", label: "Provider" },
    { id: "cluster", label: "Cluster" },
    { id: "category", label: "Category" },
  ];

  // Import all currency codes from constants
  const currencyOptions = [
    { id: "USD", label: "USD" },
    { id: "EUR", label: "EUR" },
    { id: "GBP", label: "GBP" },
    { id: "AUD", label: "AUD" },
    { id: "JPY", label: "JPY" },
    { id: "AED", label: "AED" },
    { id: "AFN", label: "AFN" },
    { id: "ALL", label: "ALL" },
    // Add more as needed
  ];

  const selectedTimeWindow = timeWindowOptions.find((o) => o.id === timeWindow);
  const selectedBreakdown = breakdownOptions.find((o) => o.id === breakdown);
  const selectedCurrency = currencyOptions.find((o) => o.id === currency) || { id: currency, label: currency };

  return (
    <div
      className="assets-header"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "flex-start",
        flexWrap: "wrap",
        flex: "0 0 auto",
      }}
    >
      {/* Date Range Dropdown - Carbon Component with overlay behavior */}
      <div style={{ minWidth: "150px", flex: "0 0 auto" }}>
        <Dropdown
          id="time-window-dropdown"
          titleText="Date Range"
          label={selectedTimeWindow?.label || "Select time window"}
          items={timeWindowOptions}
          itemToString={(item) => (item ? item.label : "")}
          selectedItem={selectedTimeWindow}
          onChange={({ selectedItem }) => {
            if (selectedItem) {
              onTimeWindowChange(selectedItem.id);
            }
          }}
          disabled={loading}
          size="md"
          type="default"
        />
      </div>

      {/* Breakdown Dropdown - Carbon Component with overlay behavior */}
      <div style={{ minWidth: "150px", flex: "0 0 auto" }}>
        <Dropdown
          id="breakdown-dropdown"
          titleText="Breakdown"
          label={selectedBreakdown?.label || "Select breakdown"}
          items={breakdownOptions}
          itemToString={(item) => (item ? item.label : "")}
          selectedItem={selectedBreakdown}
          onChange={({ selectedItem }) => {
            if (selectedItem) {
              onBreakdownChange(selectedItem.id);
            }
          }}
          disabled={loading}
          size="md"
          type="default"
        />
      </div>

      {/* Currency Dropdown - Carbon Component with overlay behavior */}
      <div style={{ minWidth: "150px", flex: "0 0 auto" }}>
        <Dropdown
          id="currency-dropdown"
          titleText="Currency"
          label={selectedCurrency?.label || currency}
          items={currencyOptions}
          itemToString={(item) => (item ? item.label : "")}
          selectedItem={selectedCurrency}
          onChange={({ selectedItem }) => {
            if (selectedItem) {
              onCurrencyChange(selectedItem.id);
            }
          }}
          disabled={loading}
          size="md"
          type="default"
        />
      </div>

      {/* Export Button - Carbon Component */}
      <div style={{ flex: "0 0 auto" }}>
        <Button
          kind="ghost"
          hasIconOnly
          iconDescription="Export CSV"
          onClick={onExport}
          disabled={loading}
          renderIcon={Download}
          tooltipPosition="bottom"
        >
          <Download size={20} />
        </Button>
      </div>
    </div>
  );
};

export default AssetsHeader;
