import React, { useMemo } from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { aggregateByType } from "../../utils/assetCalculations";
import { formatCurrency } from "../../utils/assetFormatting";

const AssetsChart = ({ data, breakdown }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const aggregated = aggregateByType(data);
    return aggregated.map((item) => ({
      type: item.type,
      productive: item.productiveCost,
      wasted: item.idleCost,
      total: item.totalCost,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Paper elevation={2} sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Cost Breakdown by Asset Type
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Paper>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            padding: 1,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 0.5 }}>
            {payload[0].payload.type}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{ color: entry.color, display: "block" }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
          <Typography variant="caption" sx={{ display: "block", marginTop: 0.5 }}>
            Total: {formatCurrency(payload[0].payload.total)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Cost Breakdown by Asset Type
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="productive" stackId="a" fill="#24a148" name="Productive Cost" />
          <Bar dataKey="wasted" stackId="a" fill="#da1e28" name="Wasted Cost" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default AssetsChart;
