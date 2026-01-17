import React, { useRef, useEffect, useMemo } from "react";
import { Tile, Tag } from "@carbon/react";

const AssetsEfficiencyMatrix = ({ data, onAssetClick }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate max values for scaling
  const { maxCost, maxUtilization } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxCost: 1, maxUtilization: 1 };
    }

    const costs = data.map((a) => a.totalCost || 0);
    const utilizations = data.map((a) => (a.utilization || 0) * 100);

    return {
      maxCost: Math.max(...costs, 1),
      maxUtilization: Math.max(...utilizations, 1),
    };
  }, [data]);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw quadrant backgrounds
    const midX = width / 2;
    const midY = height / 2;

    // Top-left: Critical (red)
    ctx.fillStyle = "rgba(218, 30, 40, 0.1)";
    ctx.fillRect(0, 0, midX, midY);

    // Top-right: Efficient (green)
    ctx.fillStyle = "rgba(36, 161, 72, 0.1)";
    ctx.fillRect(midX, 0, midX, midY);

    // Bottom-left: Review (yellow)
    ctx.fillStyle = "rgba(241, 194, 27, 0.1)";
    ctx.fillRect(0, midY, midX, midY);

    // Bottom-right: Optimized (green)
    ctx.fillStyle = "rgba(36, 161, 72, 0.1)";
    ctx.fillRect(midX, midY, midX, midY);

    // Draw axes
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 2;

    // Vertical axis (middle)
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, height);
    ctx.stroke();

    // Horizontal axis (middle)
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = "#525252";
    ctx.font = "12px Arial";
    ctx.fillText("Low Utilization", 10, 20);
    ctx.fillText("High Utilization", width - 120, 20);
    ctx.fillText("High Cost", 10, midY - 10);
    ctx.fillText("Low Cost", 10, height - 10);

    // Store asset positions for click detection
    const assetPositions = [];

    // Draw asset bubbles
    data.forEach((asset) => {
      const utilization = (asset.utilization || 0) * 100;
      const cost = asset.totalCost || 0;

      // Calculate position
      const x = (utilization / maxUtilization) * width;
      const y = height - (cost / maxCost) * height;

      // Calculate bubble size (proportional to cost)
      const radius = Math.max(5, Math.min(20, Math.sqrt(cost) * 2));

      // Determine color based on quadrant
      const quadrant = asset.quadrant || "review";
      let color;
      if (quadrant === "critical") {
        color = "rgba(218, 30, 40, 0.7)";
      } else if (quadrant === "review") {
        color = "rgba(241, 194, 27, 0.7)";
      } else {
        color = "rgba(36, 161, 72, 0.7)";
      }

      // Draw bubble
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Store for click detection
      assetPositions.push({ x, y, radius, asset });
    });

    // Store positions for click handler
    canvas.assetPositions = assetPositions;
  }, [data, maxCost, maxUtilization]);

  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !canvasRef.current.assetPositions) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked asset
    const clicked = canvas.assetPositions.find(({ x: bx, y: by, radius }) => {
      const distance = Math.sqrt((x - bx) ** 2 + (y - by) ** 2);
      return distance <= radius;
    });

    if (clicked && onAssetClick) {
      onAssetClick(clicked.asset);
    }
  };

  // Count assets by quadrant
  const quadrantCounts = useMemo(() => {
    if (!data || data.length === 0) {
      return { critical: 0, review: 0, efficient: 0 };
    }

    return {
      critical: data.filter((a) => a.quadrant === "critical").length,
      review: data.filter((a) => a.quadrant === "review").length,
      efficient:
        data.filter((a) => a.quadrant === "efficient").length +
        data.filter((a) => a.quadrant === "optimized").length,
    };
  }, [data]);

  return (
    <Tile className="efficiency-matrix" style={{ padding: "1.5rem" }}>
      <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem", fontWeight: 400 }}>
        Asset Efficiency Matrix
      </h3>
      <p
        style={{
          color: "var(--cds-text-secondary, #525252)",
          fontSize: "0.875rem",
          marginBottom: "1rem",
        }}
      >
        Click any bubble to view details
      </p>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onClick={handleCanvasClick}
          style={{
            cursor: "pointer",
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Tag type="red" size="sm">
          Critical: {quadrantCounts.critical}
        </Tag>
        <Tag type="orange" size="sm">
          Review: {quadrantCounts.review}
        </Tag>
        <Tag type="green" size="sm">
          Efficient: {quadrantCounts.efficient}
        </Tag>
      </div>
    </Tile>
  );
};

export default AssetsEfficiencyMatrix;
