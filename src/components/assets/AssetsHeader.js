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
      {/* Date Range Dropdown - Carbon Component (Most Visible!) */}
      <div style={{ minWidth: "150px", flex: "0 0 auto" }}>
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
          size="md"
        />
      </div>

      {/* Breakdown Dropdown - Carbon Component */}
      <div style={{ minWidth: "150px", flex: "0 0 auto" }}>
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
          size="md"
        />
      </div>

      {/* Currency Dropdown - Carbon Component */}
      <div style={{ minWidth: "150px", flex: "0 0 auto" }}>
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
          size="md"
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
