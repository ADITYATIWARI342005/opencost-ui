# Complete Carbon Design System Refactoring Guide

## Overview

This guide provides the complete refactoring plan to convert the Assets page from Material-UI to Carbon Design System as required by the LFX Mentorship challenge ([Issue #155](https://github.com/opencost/opencost-ui/issues/155)).

## Critical Requirements

1. **Use Carbon Design System** - NOT Material-UI (explicit requirement)
2. **Match OpenCost Patterns** - Totals row at top, header structure, etc.
3. **Efficiency Matrix** - Key differentiator feature
4. **Complete Functionality** - All features must work with Carbon

## Installation

```bash
npm install --save @carbon/react @carbon/charts-react @carbon/icons-react @carbon/themes
```

## Component Refactoring Status

### ✅ Completed
- AssetsSummary.js - Converted to Carbon Tile, Grid, Column, Icons

### 🔄 In Progress / Needs Refactoring

#### 1. AssetsPage.js
**Current**: Uses MUI (CircularProgress, Paper, Typography, IconButton)
**Target**: Use Carbon (Loading, Tile/Container, Button, InlineNotification)

**Key Changes**:
- Replace `CircularProgress` → `Loading` or `InlineLoading`
- Replace `Paper` → Carbon container or keep existing Page wrapper
- Replace `Typography` → Carbon text components or native HTML
- Replace `IconButton` → Carbon `Button` with icon
- Replace `Button` (MUI) → Carbon `Button`

#### 2. AssetsTable.js (CRITICAL - Has Totals Row)
**Current**: Uses MUI Table components
**Target**: Use Carbon DataTable

**Key Changes**:
- Replace MUI `Table` → Carbon `DataTable`
- Replace `TablePagination` → Carbon `Pagination`
- Replace `Chip` → Carbon `Tag`
- Replace `LinearProgress` → Carbon `ProgressBar`
- **CRITICAL**: Maintain Totals row at TOP (OpenCost pattern)
- Use Carbon DataTable's render prop pattern

**Carbon DataTable Pattern**:
```javascript
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
  ProgressBar
} from '@carbon/react';
```

#### 3. AssetsChart.js
**Current**: Uses Recharts
**Target**: Use Carbon Charts StackedBarChart

**Key Changes**:
- Replace Recharts `BarChart` → Carbon `StackedBarChart`
- Import from `@carbon/charts-react`
- Use Carbon Charts data format

#### 4. AssetDetailModal.js
**Current**: Uses MUI Dialog, Tabs
**Target**: Use Carbon Modal, Tabs

**Key Changes**:
- Replace MUI `Dialog` → Carbon `Modal`
- Replace MUI `Tabs` → Carbon `Tabs`, `TabList`, `TabPanels`, `TabPanel`
- Replace MUI `Chip` → Carbon `Tag`
- Replace MUI `LinearProgress` → Carbon `ProgressBar`
- Use Carbon `StructuredList` for detail view

#### 5. AssetsEfficiencyMatrix.js
**Current**: Uses MUI Paper, Typography, Chip
**Target**: Use Carbon Tile, Tag

**Key Changes**:
- Replace `Paper` → Carbon `Tile`
- Replace `Typography` → Native HTML or Carbon text
- Replace `Chip` → Carbon `Tag`
- Keep canvas implementation (it's fine)

## Implementation Priority

1. **HIGHEST**: AssetsTable.js (includes Totals row - critical OpenCost pattern)
2. **HIGH**: AssetsPage.js (main container)
3. **MEDIUM**: AssetsChart.js (visualization)
4. **MEDIUM**: AssetDetailModal.js (detail view)
5. **LOW**: AssetsEfficiencyMatrix.js (mostly styling changes)

## Carbon Component Mapping

| MUI Component | Carbon Component | Import |
|--------------|------------------|--------|
| CircularProgress | Loading / InlineLoading | @carbon/react |
| Paper | Tile | @carbon/react |
| Typography | Native HTML or Carbon text | - |
| Button | Button | @carbon/react |
| IconButton | Button (with icon prop) | @carbon/react |
| Table | DataTable | @carbon/react |
| TablePagination | Pagination | @carbon/react |
| Chip | Tag | @carbon/react |
| LinearProgress | ProgressBar | @carbon/react |
| Dialog | Modal | @carbon/react |
| Tabs | Tabs, TabList, TabPanels | @carbon/react |
| Grid | Grid, Column | @carbon/react |
| BarChart (Recharts) | StackedBarChart | @carbon/charts-react |

## Styling Approach

### Option 1: Carbon SCSS (Recommended)
Create `src/components/assets/styles/Assets.scss`:
```scss
@use '@carbon/react/scss/spacing' as *;
@use '@carbon/react/scss/breakpoint' as *;
@use '@carbon/react/scss/type' as *;
@use '@carbon/react/scss/theme' as *;

.assets-page {
  padding: $spacing-05;
}

.assets-summary__tile {
  display: flex;
  gap: $spacing-05;
  padding: $spacing-05;
}
```

### Option 2: Inline Styles (Quick)
Use Carbon design tokens in inline styles:
```javascript
style={{ padding: '1rem', color: 'var(--cds-text-primary)' }}
```

## Testing Checklist

After refactoring, test:
- [ ] Page loads without errors
- [ ] Data fetches from API
- [ ] Totals row appears at TOP of table
- [ ] Sorting works
- [ ] Pagination works
- [ ] Efficiency Matrix renders
- [ ] Chart displays
- [ ] Modal opens and shows data
- [ ] Export CSV works
- [ ] All Carbon components render correctly
- [ ] No console errors

## Next Steps

1. Install Carbon dependencies
2. Refactor AssetsTable.js (highest priority)
3. Refactor AssetsPage.js
4. Refactor remaining components
5. Create/update SCSS file
6. Test thoroughly
7. Update documentation

## Notes

- Carbon and MUI can coexist in the same project
- The rest of OpenCost UI uses MUI, but Assets page uses Carbon per requirements
- Maintain existing functionality while switching UI framework
- Follow Carbon design tokens for consistency
