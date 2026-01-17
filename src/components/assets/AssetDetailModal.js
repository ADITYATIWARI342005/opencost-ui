import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { formatCurrency, formatPercentage, formatBytes } from "../../utils/assetFormatting";
import { getRecommendations } from "../../utils/assetCalculations";

const AssetDetailModal = ({ asset, open, onClose }) => {
  const [tabValue, setTabValue] = React.useState(0);

  if (!asset) return null;

  const recommendations = getRecommendations(asset);

  const getQuadrantColor = (quadrant) => {
    switch (quadrant) {
      case "critical":
        return "error";
      case "review":
        return "warning";
      case "efficient":
      case "optimized":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">{asset.name}</Typography>
          <Chip label={asset.type} color="primary" size="small" />
          <Chip
            label={asset.quadrant}
            color={getQuadrantColor(asset.quadrant)}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ marginBottom: 2 }}>
          <Tab label="Overview" />
          <Tab label="Labels" />
          <Tab label="Recommendations" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Provider"
                  secondary={asset.provider || "Unknown"}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Cluster"
                  secondary={asset.cluster || "Unknown"}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Category"
                  secondary={asset.category || "Unknown"}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Total Cost"
                  secondary={formatCurrency(asset.totalCost)}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Utilization"
                  secondary={
                    <Box sx={{ minWidth: 200, marginTop: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(asset.utilization || 0) * 100}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              asset.utilization >= 0.7
                                ? "#24a148"
                                : asset.utilization >= 0.4
                                ? "#f1c21b"
                                : "#da1e28",
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ marginTop: 0.5 }}>
                        {formatPercentage(asset.utilization)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Idle Cost (Waste)"
                  secondary={
                    <Typography sx={{ color: "#da1e28", fontWeight: 600 }}>
                      {formatCurrency(asset.idleCost)}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Efficiency Score"
                  secondary={`${asset.efficiencyScore || 0}%`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Owner"
                  secondary={
                    asset.owner ? (
                      <Chip label={asset.owner} size="small" />
                    ) : (
                      <Chip label="Untagged" size="small" color="default" />
                    )
                  }
                />
              </ListItem>
              {asset.type === "Node" && (
                <>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="CPU Cores"
                      secondary={asset.cpuCores || "N/A"}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="RAM"
                      secondary={
                        asset.ramBytes ? formatBytes(asset.ramBytes) : "N/A"
                      }
                    />
                  </ListItem>
                </>
              )}
              {asset.type === "Disk" && (
                <>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Storage Size"
                      secondary={
                        asset.bytes ? formatBytes(asset.bytes) : "N/A"
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Storage Class"
                      secondary={asset.storageClass || "N/A"}
                    />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            {asset.labels && Object.keys(asset.labels).length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(asset.labels).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No labels available
              </Typography>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{ padding: 2, marginBottom: 2 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 1,
                    }}
                  >
                    <Typography variant="h6">{rec.title}</Typography>
                    <Chip
                      label={rec.priority}
                      color={
                        rec.priority === "high"
                          ? "error"
                          : rec.priority === "medium"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    {rec.description}
                  </Typography>
                  {rec.savings > 0 && (
                    <Typography variant="body2" sx={{ color: "#24a148", fontWeight: 600 }}>
                      Potential Savings: {formatCurrency(rec.savings)}/month
                    </Typography>
                  )}
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recommendations available for this asset.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssetDetailModal;
