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

    // Draw axis labels as transparent text overlays - no background boxes
    ctx.font = "bold 15px 'IBM Plex Sans', Arial, sans-serif"; // Larger, bolder font for readability
    
    // Top labels (X-axis - Utilization) - transparent text with shadow for contrast
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    // Text shadow for better readability on colored backgrounds
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillStyle = "#333333"; // Dark gray for high contrast
    ctx.fillText("Low Utilization", 12, 12);
    
    ctx.textAlign = "right";
    ctx.fillText("High Utilization", width - 12, 12);
    
    // Reset shadow for left labels
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Left side labels (Y-axis - Cost) - transparent text with shadow for contrast
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    
    // Text shadow for better readability on colored backgrounds
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillStyle = "#333333"; // Dark gray for high contrast
    ctx.fillText("High Cost", 12, midY - 12);
    ctx.fillText("Low Cost", 12, height - 12);
    
    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Store asset positions for click detection
    const assetPositions = [];

    // Draw asset bubbles (CRITICAL: Make bubbles visible!)
    data.forEach((asset) => {
      const utilization = asset.utilization || 0;
      const cost = asset.totalCost || 0;

      // Calculate position
      // X-axis: Utilization (0 = left, 1 = right)
      const x = utilization * width;
      
      // Y-axis: Cost (0 = bottom, maxCost = top)
      // Invert Y so high cost is at top
      const y = height - ((cost / maxCost) * height);

      // Calculate bubble size (proportional to cost, but ensure minimum visibility)
      // Use larger multiplier to make bubbles more visible
      const baseRadius = Math.max(8, Math.min(30, Math.sqrt(cost) * 5));
      const radius = cost > 0 ? baseRadius : 8;

      // Determine color based on quadrant
      const quadrant = asset.quadrant || "review";
      let color;
      if (quadrant === "critical") {
        color = "rgba(218, 30, 40, 0.8)"; // More opaque for visibility
      } else if (quadrant === "review") {
        color = "rgba(241, 194, 27, 0.8)";
      } else {
        color = "rgba(36, 161, 72, 0.8)";
      }

      // Draw bubble with shadow for visibility
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      
      // Add shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Fill bubble
      ctx.fillStyle = color;
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Store for click detection
      assetPositions.push({ x, y, radius, asset });
    });

    // Store positions for click handler on canvas element
    canvas.assetPositions = assetPositions;
  }, [data, maxCost, maxUtilization]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.assetPositions || canvas.assetPositions.length === 0) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find clicked asset (reverse order to get top-most bubble)
    const clicked = canvas.assetPositions
      .slice()
      .reverse()
      .find(({ x: bx, y: by, radius }) => {
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
    <Tile 
      className="efficiency-matrix" 
      style={{ 
        padding: "1.5rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
      }}
    >
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
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
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

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
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
