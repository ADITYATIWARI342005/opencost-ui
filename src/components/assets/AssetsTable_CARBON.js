/**
 * AssetsTable Component - Carbon Design System Version
 * 
 * IMPORTANT: This is the Carbon refactored version.
 * To use this, rename this file to AssetsTable.js after installing Carbon dependencies.
 * 
 * Installation required:
 * npm install --save @carbon/react @carbon/charts-react @carbon/icons-react
 */

import React, { useState, useEffect, useMemo } from "react";
import { get } from "lodash";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
  Tag,
  ProgressBar,
} from "@carbon/react";
import { formatCurrency, formatPercentage } from "../../utils/assetFormatting";

function descendingComparator(a, b, orderBy) {
  if (get(b, orderBy) < get(a, orderBy)) {
    return -1;
  }
  if (get(b, orderBy) > get(a, orderBy)) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headers = [
  { key: "name", header: "Asset Name" },
  { key: "type", header: "Type" },
  { key: "provider", header: "Provider" },
  { key: "cluster", header: "Cluster" },
  { key: "utilization", header: "Utilization" },
  { key: "idleCost", header: "Idle Cost" },
  { key: "totalCost", header: "Total Cost" },
  { key: "owner", header: "Owner" },
];

/**
 * AssetsTable Component using Carbon Design System
 * CRITICAL: Totals row appears at TOP (OpenCost pattern)
 */
const AssetsTable = ({ data, currency, onAssetClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortConfig, setSortConfig] = useState({
    key: "totalCost",
    direction: "DESC",
  });

  // Filter assets based on search
  const filteredAssets = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      (a) =>
        a.name?.toLowerCase().includes(query) ||
        a.type?.toLowerCase().includes(query) ||
        a.owner?.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  // Sort assets
  const sortedAssets = useMemo(() => {
    if (!sortConfig.key) return filteredAssets;
    const comparator = getComparator(
      sortConfig.direction.toLowerCase(),
      sortConfig.key
    );
    return stableSort([...filteredAssets], comparator);
  }, [filteredAssets, sortConfig]);

  // Paginate
  const paginatedAssets = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedAssets.slice(start, end);
  }, [sortedAssets, page, pageSize]);

  // Calculate totals row (CRITICAL: OpenCost pattern - totals at top)
  const totalsRow = useMemo(() => {
    const total = filteredAssets.reduce(
      (acc, asset) => {
        acc.totalCost += asset.totalCost || 0;
        acc.idleCost += asset.idleCost || 0;
        acc.utilization += asset.utilization || 0;
        acc.cpuCost += asset.cpuCost || 0;
        acc.ramCost += asset.ramCost || 0;
        return acc;
      },
      { totalCost: 0, idleCost: 0, utilization: 0, cpuCost: 0, ramCost: 0 }
    );
    const avgUtilization =
      filteredAssets.length > 0
        ? total.utilization / filteredAssets.length
        : 0;

    return {
      id: "totals",
      name: "Totals",
      type: "",
      provider: "",
      cluster: "",
      utilization: avgUtilization,
      idleCost: total.idleCost,
      totalCost: total.totalCost,
      cpuCost: total.cpuCost,
      ramCost: total.ramCost,
      owner: "",
      isTotals: true,
    };
  }, [filteredAssets]);

  // Transform data for Carbon DataTable
  const rows = useMemo(() => {
    // CRITICAL: Totals row first (OpenCost pattern)
    const totals = {
      id: totalsRow.id,
      name: totalsRow.name,
      type: totalsRow.type,
      provider: totalsRow.provider,
      cluster: totalsRow.cluster,
      utilization: totalsRow.utilization,
      idleCost: totalsRow.idleCost,
      totalCost: totalsRow.totalCost,
      owner: totalsRow.owner,
      isTotals: true,
      rawAsset: totalsRow,
    };

    const assetRows = paginatedAssets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      provider: asset.provider,
      cluster: asset.cluster,
      utilization: asset.utilization,
      idleCost: asset.idleCost,
      totalCost: asset.totalCost,
      owner: asset.owner || "Untagged",
      isTotals: false,
      rawAsset: asset,
    }));

    return [totals, ...assetRows];
  }, [totalsRow, paginatedAssets]);

  const handleSort = (headerKey) => {
    setSortConfig((prev) => {
      if (prev.key === headerKey) {
        return {
          key: headerKey,
          direction: prev.direction === "ASC" ? "DESC" : "ASC",
        };
      }
      return { key: headerKey, direction: "DESC" };
    });
    setPage(1); // Reset to first page on sort
  };

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <p>No assets found</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
      <DataTable
        rows={rows}
        headers={headers}
        isSortable
        size="lg"
        useZebraStyles
      >
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getTableContainerProps,
          onInputChange,
        }) => (
          <TableContainer {...getTableContainerProps()}>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                    onInputChange(e);
                  }}
                  placeholder="Search assets..."
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      {...getHeaderProps({ header })}
                      key={header.key}
                      isSortable={header.key !== "name" && header.key !== "type"}
                      onClick={() => {
                        if (header.key !== "name" && header.key !== "type") {
                          handleSort(header.key);
                        }
                      }}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const isTotals = row.cells[0].value === "Totals";
                  return (
                    <TableRow
                      key={row.id}
                      {...getRowProps({ row })}
                      className={isTotals ? "assets-table__totals-row" : ""}
                      onClick={() => {
                        if (!isTotals && onAssetClick) {
                          onAssetClick(row.rawAsset);
                        }
                      }}
                      style={{
                        cursor: isTotals ? "default" : "pointer",
                        backgroundColor: isTotals
                          ? "var(--cds-layer-accent-01)"
                          : undefined,
                        fontWeight: isTotals ? 600 : undefined,
                      }}
                    >
                      {row.cells.map((cell) => {
                        const headerKey = cell.info.header;
                        const cellValue = cell.value;

                        // Custom rendering per column
                        if (headerKey === "name") {
                          return (
                            <TableCell key={cell.id}>
                              {isTotals ? (
                                <strong>{cellValue}</strong>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  {cellValue}
                                  {!isTotals &&
                                    row.rawAsset?.utilization < 0.3 && (
                                      <Tag type="red" size="sm">
                                        Low Util
                                      </Tag>
                                    )}
                                </div>
                              )}
                            </TableCell>
                          );
                        }

                        if (headerKey === "type") {
                          return (
                            <TableCell key={cell.id}>
                              {isTotals ? (
                                "-"
                              ) : (
                                <Tag type="blue" size="sm">
                                  {cellValue}
                                </Tag>
                              )}
                            </TableCell>
                          );
                        }

                        if (
                          headerKey === "idleCost" ||
                          headerKey === "totalCost"
                        ) {
                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                textAlign: "right",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {isTotals ? (
                                <strong
                                  style={{
                                    color:
                                      headerKey === "idleCost"
                                        ? "var(--cds-support-error)"
                                        : undefined,
                                  }}
                                >
                                  {formatCurrency(cellValue || 0, currency)}
                                </strong>
                              ) : (
                                <span
                                  style={{
                                    color:
                                      headerKey === "idleCost"
                                        ? "var(--cds-support-error)"
                                        : undefined,
                                    fontWeight:
                                      headerKey === "idleCost" ? 600 : undefined,
                                  }}
                                >
                                  {formatCurrency(cellValue || 0, currency)}
                                </span>
                              )}
                            </TableCell>
                          );
                        }

                        if (headerKey === "utilization") {
                          return (
                            <TableCell
                              key={cell.id}
                              style={{ textAlign: "right", minWidth: "150px" }}
                            >
                              {isTotals ? (
                                <strong>
                                  {formatPercentage(cellValue || 0)}
                                </strong>
                              ) : (
                                <div>
                                  <ProgressBar
                                    value={(cellValue || 0) * 100}
                                    size="sm"
                                    status={
                                      cellValue >= 0.7
                                        ? "finished"
                                        : cellValue >= 0.4
                                        ? "active"
                                        : "error"
                                    }
                                    label=""
                                    style={{ marginBottom: "0.25rem" }}
                                  />
                                  <span style={{ fontSize: "0.875rem" }}>
                                    {formatPercentage(cellValue || 0)}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                          );
                        }

                        if (headerKey === "owner") {
                          return (
                            <TableCell key={cell.id}>
                              {isTotals ? (
                                "-"
                              ) : cellValue === "Untagged" ? (
                                <Tag type="gray" size="sm">
                                  Untagged
                                </Tag>
                              ) : (
                                <Tag size="sm">{cellValue}</Tag>
                              )}
                            </TableCell>
                          );
                        }

                        // Default rendering
                        return (
                          <TableCell key={cell.id}>
                            {isTotals ? (cellValue || "-") : cellValue}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <Pagination
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Assets per page:"
        page={page}
        pageSize={pageSize}
        pageSizes={[10, 25, 50, 100]}
        totalItems={filteredAssets.length}
        onChange={({ page: newPage, pageSize: newPageSize }) => {
          setPage(newPage);
          setPageSize(newPageSize);
        }}
      />
    </div>
  );
};

export default AssetsTable;
