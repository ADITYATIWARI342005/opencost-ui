import React, { useState, useEffect } from "react";
import { get } from "lodash";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import { formatCurrency, formatPercentage } from "../../utils/assetFormatting";
import { toCurrency } from "../../util";

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

const headCells = [
  { id: "name", numeric: false, label: "Asset Name", width: "auto" },
  { id: "type", numeric: false, label: "Type", width: 120 },
  { id: "provider", numeric: false, label: "Provider", width: 120 },
  { id: "cluster", numeric: false, label: "Cluster", width: 150 },
  { id: "utilization", numeric: true, label: "Utilization", width: 150 },
  { id: "idleCost", numeric: true, label: "Idle Cost", width: 120 },
  { id: "totalCost", numeric: true, label: "Total Cost", width: 120 },
  { id: "owner", numeric: false, label: "Owner", width: 120 },
];

const AssetsTable = ({ data, currency, onAssetClick }) => {
  if (!data || data.length === 0) {
    return (
      <Typography variant="body2" style={{ padding: 24 }}>
        No assets found
      </Typography>
    );
  }

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("totalCost");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const numData = data.length;

  useEffect(() => {
    setPage(0);
  }, [numData]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createSortHandler = (property) => (event) =>
    handleRequestSort(event, property);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const orderedRows = stableSort(data, getComparator(order, orderBy));
  const pageRows = orderedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Calculate totals row
  const totals = data.reduce(
    (acc, asset) => {
      acc.totalCost += asset.totalCost || 0;
      acc.idleCost += asset.idleCost || 0;
      acc.utilization += asset.utilization || 0;
      return acc;
    },
    { totalCost: 0, idleCost: 0, utilization: 0 }
  );
  const avgUtilization = data.length > 0 ? totals.utilization / data.length : 0;

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
    <div style={{ padding: "0 24px 24px 24px" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((cell) => (
                <TableCell
                  key={cell.id}
                  align={cell.numeric ? "right" : "left"}
                  style={{ width: cell.width }}
                >
                  <TableSortLabel
                    active={orderBy === cell.id}
                    direction={orderBy === cell.id ? order : "asc"}
                    onClick={createSortHandler(cell.id)}
                  >
                    {cell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Totals row */}
            <TableRow
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                fontWeight: 600,
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
              }}
            >
              <TableCell>
                <strong>Totals</strong>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell align="right">
                <strong>{formatPercentage(avgUtilization)}</strong>
              </TableCell>
              <TableCell align="right">
                <strong style={{ color: "#da1e28" }}>
                  {formatCurrency(totals.idleCost, currency)}
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong>{formatCurrency(totals.totalCost, currency)}</strong>
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>

            {pageRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => onAssetClick && onAssetClick(row)}
                sx={{ cursor: onAssetClick ? "pointer" : "default" }}
              >
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {row.name}
                    {row.utilization < 0.3 && (
                      <Chip
                        label="Low Util"
                        size="small"
                        color="error"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip label={row.type} size="small" color="primary" />
                </TableCell>
                <TableCell>{row.provider}</TableCell>
                <TableCell>{row.cluster}</TableCell>
                <TableCell align="right">
                  <div style={{ minWidth: 100 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(row.utilization || 0) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            row.utilization >= 0.7
                              ? "#24a148"
                              : row.utilization >= 0.4
                              ? "#f1c21b"
                              : "#da1e28",
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ marginTop: 0.5 }}>
                      {formatPercentage(row.utilization)}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <span style={{ color: "#da1e28", fontWeight: 600 }}>
                    {formatCurrency(row.idleCost, currency)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.totalCost, currency)}
                </TableCell>
                <TableCell>
                  {row.owner ? (
                    <Chip label={row.owner} size="small" />
                  ) : (
                    <Chip label="Untagged" size="small" color="default" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={numData}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </div>
  );
};

export default AssetsTable;
