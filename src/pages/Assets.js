import { Loading, InlineNotification } from "@carbon/react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { find, get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import Header from "../components/Header";
import Page from "../components/Page";
import Footer from "../components/Footer";
import Subtitle from "../components/Subtitle";
import Warnings from "../components/Warnings";
import AssetsService from "../services/assets";
import {
  checkCustomWindow,
  toVerboseTimeRange,
} from "../util";
import { currencyCodes } from "../constants/currencyCodes";
import { enrichAssetsData, calculateSummaryMetrics } from "../utils/assetCalculations";
import AssetsHeader from "../components/assets/AssetsHeader";
import AssetsSummary from "../components/assets/AssetsSummary";
import AssetsEfficiencyMatrix from "../components/assets/AssetsEfficiencyMatrix";
import AssetsTable from "../components/assets/AssetsTable";
import AssetDetailModal from "../components/assets/AssetDetailModal";
import AssetsChart from "../components/assets/AssetsChart";
import { exportToCSV } from "../utils/assetFormatting";

const windowOptions = [
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

const breakdownOptions = [
  { name: "Type", value: "type" },
  { name: "Provider", value: "provider" },
  { name: "Cluster", value: "cluster" },
  { name: "Category", value: "category" },
];

const accumulateOptions = [
  { name: "Entire window", value: true },
  { name: "Daily", value: false },
];

// generateTitle generates a string title from a report object
function generateTitle({ window, breakdown }) {
  let windowName = get(find(windowOptions, { value: window }), "name", "");
  if (windowName === "") {
    if (checkCustomWindow(window)) {
      windowName = toVerboseTimeRange(window);
    } else {
      console.warn(`unknown window: ${window}`);
    }
  }

  let breakdownName = get(
    find(breakdownOptions, { value: breakdown }),
    "name",
    "",
  ).toLowerCase();
  if (breakdownName === "") {
    console.warn(`unknown breakdown: ${breakdown}`);
  }

  return `${windowName} by ${breakdownName}`;
}

const AssetsPage = () => {
  // Asset data state
  const [assetsData, setAssetsData] = useState([]);
  const [enrichedData, setEnrichedData] = useState([]);

  // Data fetching in-progress / error states
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  // State of controls on the page is generally derived from query parameters in the url.
  const routerLocation = useLocation();
  const searchParams = new URLSearchParams(routerLocation.search);
  const navigate = useNavigate();

  const win = searchParams.get("window") || "7d";
  const breakdown = searchParams.get("breakdown") || "type";
  const currency = searchParams.get("currency") || "USD";
  const title =
    searchParams.get("title") || generateTitle({ window: win, breakdown });

  // Selected asset for detail modal
  const [selectedAsset, setSelectedAsset] = useState(null);

  // When assets data changes, enrich it
  useEffect(() => {
    if (assetsData && Object.keys(assetsData).length > 0) {
      const enriched = enrichAssetsData(assetsData);
      setEnrichedData(enriched);
    } else {
      setEnrichedData([]);
    }
  }, [assetsData]);

  // When parameters which effect query results change, refetch the data.
  useEffect(() => {
    fetchData();
  }, [win]);

  async function fetchData() {
    setLoading(true);
    setErrors([]);

    try {
      const resp = await AssetsService.fetchAssets(win);
      if (resp && resp.data && Object.keys(resp.data).length > 0) {
        setAssetsData(resp.data);
      } else {
        if (resp && resp.message && resp.message.indexOf("boundary error") >= 0) {
          let match = resp.message.match(/(ETL is \d+\.\d+% complete)/);
          let secondary = "Try again after ETL build is complete";
          if (match && match.length > 0) {
            secondary = `${match[1]}. ${secondary}`;
          }
          setErrors([
            {
              primary: "Data unavailable while ETL is building",
              secondary: secondary,
            },
          ]);
        }
        setAssetsData({});
      }
    } catch (err) {
      if (err.message && err.message.indexOf("404") === 0) {
        setErrors([
          {
            primary: "Failed to load assets data",
            secondary:
              "Please update OpenCost to the latest version, then open an Issue on GitHub if problems persist.",
          },
        ]);
      } else {
        let secondary = "Please open an Issue on GitHub if problems persist.";
        if (err.message && err.message.length > 0) {
          secondary = err.message;
        }
        setErrors([
          {
            primary: "Failed to load assets data",
            secondary: secondary,
          },
        ]);
      }
      setAssetsData({});
    }

    setLoading(false);
  }

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    return calculateSummaryMetrics(enrichedData);
  }, [enrichedData]);

  // Filter data by breakdown
  const filteredData = useMemo(() => {
    if (!breakdown || breakdown === "type") {
      return enrichedData;
    }
    // For now, return all data - breakdown filtering can be enhanced
    return enrichedData;
  }, [enrichedData, breakdown]);

  // Generate subtitle for header
  const subtitle = useMemo(() => {
    const windowName = get(find(windowOptions, { value: win }), "name", win);
    const breakdownName = get(
      find(breakdownOptions, { value: breakdown }),
      "name",
      breakdown
    );
    return `${windowName} by ${breakdownName}`;
  }, [win, breakdown]);

  return (
    <Page active="assets">
      {/* Header with title and refresh button - matches Cost Allocation pattern exactly */}
      <Header headerTitle="Infrastructure Assets">
        <IconButton
          aria-label="refresh"
          onClick={() => fetchData()}
          style={{ padding: 12 }}
        >
          <RefreshIcon />
        </IconButton>
      </Header>

      {/* Error warnings - matches Cost Allocation pattern */}
      {!loading && errors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Warnings warnings={errors} />
        </div>
      )}

      <Paper id="assets-report">
        {/* Title/Subtitle and Controls Row - matches Cost Allocation pattern exactly */}
        <div style={{ display: "flex", flexFlow: "row", padding: 24 }}>
          {/* Left side: Title and Subtitle */}
          <div style={{ flexGrow: 1 }}>
            <Typography variant="h5">{title}</Typography>
            <Subtitle report={{ window: win, aggregateBy: breakdown }} />
          </div>

          {/* Right side: Carbon Controls - matches Cost Allocation pattern */}
          <AssetsHeader
            timeWindow={win}
            onTimeWindowChange={(win) => {
              searchParams.set("window", win);
              navigate({
                search: `?${searchParams.toString()}`,
              });
            }}
            breakdown={breakdown}
            onBreakdownChange={(breakdown) => {
              searchParams.set("breakdown", breakdown);
              navigate({
                search: `?${searchParams.toString()}`,
              });
            }}
            currency={currency}
            onCurrencyChange={(curr) => {
              searchParams.set("currency", curr);
              navigate({
                search: `?${searchParams.toString()}`,
              });
            }}
            onRefresh={() => fetchData()}
            onExport={() => {
              if (filteredData && filteredData.length > 0) {
                exportToCSV(
                  filteredData,
                  `assets-${win}-${breakdown}-${new Date().toISOString().split("T")[0]}.csv`
                );
              }
            }}
            loading={loading}
            title={title}
            subtitle={subtitle}
          />
        </div>

        {/* Carbon Loading Component */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <Loading description="Loading assets..." withOverlay={false} />
          </div>
        )}
        {!loading && (
          <>
            {/* Summary Metrics - 4 tiles in row */}
            <AssetsSummary metrics={summaryMetrics} currency={currency} />

            {/* Visualizations - side by side with equal sizing */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
                padding: "0 24px",
                alignItems: "stretch", // Ensure equal height
              }}
            >
              <AssetsEfficiencyMatrix
                data={filteredData}
                onAssetClick={setSelectedAsset}
              />
              <AssetsChart
                data={filteredData}
                breakdown={breakdown}
                currency={currency}
              />
            </div>

            {/* Table - full width with Totals row at top */}
            <AssetsTable
              data={filteredData}
              currency={currency}
              onAssetClick={setSelectedAsset}
            />
          </>
        )}
      </Paper>
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          open={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
      <Footer />
    </Page>
  );
};

export default React.memo(AssetsPage);
