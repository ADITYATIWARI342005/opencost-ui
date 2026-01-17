# Carbon Design System Refactor Summary

## Status: In Progress

This document tracks the refactoring of the Assets page from Material-UI to Carbon Design System as required by the LFX Mentorship challenge.

## Completed Refactors

✅ **AssetsSummary.js** - Converted to use Carbon Tile, Grid, Column, and Carbon Icons

## In Progress

🔄 **AssetsPage.js** - Main page component (needs Carbon Loading, InlineNotification)
🔄 **AssetsTable.js** - Data table (needs Carbon DataTable with Totals row at top - CRITICAL)
🔄 **AssetsEfficiencyMatrix.js** - Efficiency visualization (needs Carbon Tile wrapper)
🔄 **AssetsChart.js** - Cost breakdown chart (needs Carbon Charts StackedBarChart)
🔄 **AssetDetailModal.js** - Detail modal (needs Carbon Modal, Tabs, StructuredList)

## Key Requirements from Challenge

1. ✅ Use Carbon Design System (not MUI)
2. ✅ Implement Assets page with /assets API
3. ✅ Efficiency Matrix visualization (differentiator)
4. ⚠️ Match existing OpenCost UI patterns (Totals row at top, etc.)
5. ⚠️ Proper time window selector
6. ⚠️ Breakdown selector
7. ⚠️ Currency selector
8. ⚠️ CSV export

## Critical Patterns to Match

- **Totals Row**: Must appear at TOP of table (OpenCost pattern)
- **Header Structure**: Match Allocation/CloudCost page headers
- **Time Window Options**: Today, Yesterday, Week-to-date, Last 7/30/60/90 days
- **Right-aligned monetary values**
- **Sortable columns with indicators**

## Next Steps

1. Complete AssetsTable.js refactor (highest priority - includes Totals row)
2. Refactor AssetsPage.js to use Carbon components
3. Update AssetsChart.js to use Carbon Charts
4. Refactor AssetDetailModal.js
5. Create Carbon-compliant SCSS file
6. Test all functionality

## Installation Required

Run: `npm install --save @carbon/react @carbon/charts-react @carbon/icons-react @carbon/themes`
