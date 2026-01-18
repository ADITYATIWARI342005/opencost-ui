/**
 * AssetsHeader Component - Uses MUI Select to match Allocations page exactly
 * 
 * CRITICAL: Uses Material-UI Select components (not Carbon) to ensure proper overlay behavior
 * This matches the exact implementation used on the Allocations page.
 */

import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ExportIcon from "@mui/icons-material/FileDownload";

import SelectWindow from "../SelectWindow";
import { currencyCodes } from "../../constants/currencyCodes";

/**
 * AssetsHeader - Header with controls matching Allocations page
 * 
 * Uses MUI Select components which automatically render as overlays/modals.
 * This ensures dropdowns appear on top of content without affecting page layout.
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
  // Time window options - format matching SelectWindow component
  const timeWindowOptions = [
    { name: "Today", value: "today" },
    { name: "Yesterday", value: "yesterday" },
    { name: "Last 24h", value: "24h" },
    { name: "Last 48h", value: "48h" },
    { name: "Week-to-date", value: "week" },
    { name: "Last week", value: "lastweek" },
    { name: "Last 7 days", value: "7d" },
    { name: "Last 30 days", value: "30d" },
    { name: "Last 60 days", value: "60d" },
    { name: "Last 90 days", value: "90d" },
  ];

  // Breakdown options - format matching Allocations page
  const breakdownOptions = [
    { name: "Type", value: "type" },
    { name: "Provider", value: "provider" },
    { name: "Cluster", value: "cluster" },
    { name: "Category", value: "category" },
  ];

  // Use all currency codes from constants - match Allocations page exactly
  // currencyCodes is already an array of strings like ["USD", "EUR", ...]

  return (
    <div style={{ display: "inline-flex" }}>
      {/* Date Range - Uses SelectWindow component (same as Allocations page) */}
      <SelectWindow
        windowOptions={timeWindowOptions}
        window={timeWindow}
        setWindow={onTimeWindowChange}
      />

      {/* Breakdown Dropdown - MUI Select with overlay behavior */}
      <FormControl style={{ margin: 8, minWidth: 120 }} variant="standard">
        <InputLabel id="breakdown-select-label">Breakdown</InputLabel>
        <Select
          id="breakdown-select"
          value={breakdown}
          onChange={(e) => {
            onBreakdownChange(e.target.value);
          }}
          disabled={loading}
        >
          {breakdownOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Currency Dropdown - MUI Select with overlay behavior */}
      <FormControl style={{ margin: 8, minWidth: 120 }} variant="standard">
        <InputLabel id="currency-label">Currency</InputLabel>
        <Select
          id="currency"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          disabled={loading}
        >
          {currencyCodes?.map((currencyCode) => (
            <MenuItem key={currencyCode} value={currencyCode}>
              {currencyCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Export Button - MUI IconButton matching Allocations page */}
      <Tooltip title="Download CSV">
        <IconButton onClick={onExport} disabled={loading} style={{ padding: 12 }}>
          <ExportIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default AssetsHeader;
