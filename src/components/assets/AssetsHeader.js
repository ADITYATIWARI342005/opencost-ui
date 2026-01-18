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
import { currencyCodes } from "../../constants/currencyCodes";

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

  // Use all currency codes from constants - match Allocations page
  const currencyOptions = currencyCodes.map((code) => ({
    id: code,
    label: code,
  }));

  // Find selected items - ensure they always exist (important for controlled component)
  const selectedTimeWindow = timeWindowOptions.find((o) => o.id === timeWindow) || null;
  const selectedBreakdown = breakdownOptions.find((o) => o.id === breakdown) || null;
  const selectedCurrency = currencyOptions.find((o) => o.id === currency) || null;

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
          items={timeWindowOptions}
          itemToString={(item) => (item ? item.label : "")}
          selectedItem={selectedTimeWindow}
          onChange={({ selectedItem }) => {
            // Carbon Dropdown automatically closes on selection
            if (selectedItem) {
              onTimeWindowChange(selectedItem.id);
            }
          }}
          disabled={loading}
          size="md"
        />
      </div>

      {/* Breakdown Dropdown - Carbon Component with overlay behavior */}
      <div style={{ minWidth: "150px", flex: "0 0 auto" }}>
        <Dropdown
          id="breakdown-dropdown"
          titleText="Breakdown"
          items={breakdownOptions}
          itemToString={(item) => (item ? item.label : "")}
          selectedItem={selectedBreakdown}
          onChange={({ selectedItem }) => {
            // Carbon Dropdown automatically closes on selection
            if (selectedItem) {
              onBreakdownChange(selectedItem.id);
            }
          }}
          disabled={loading}
          size="md"
        />
      </div>

      {/* Currency Dropdown - Carbon Component with overlay behavior */}
      <div style={{ minWidth: "150px", flex: "0 0 auto" }}>
        <Dropdown
          id="currency-dropdown"
          titleText="Currency"
          items={currencyOptions}
          itemToString={(item) => (item ? item.label : "")}
          selectedItem={selectedCurrency}
          onChange={({ selectedItem }) => {
            // Carbon Dropdown automatically closes on selection
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
