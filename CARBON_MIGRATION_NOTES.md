# Carbon Design System Migration Notes

## Critical Issue
The current Assets page implementation uses Material-UI (MUI), but the LFX Mentorship challenge **explicitly requires Carbon Design System**.

## Required Actions

### 1. Install Carbon Dependencies
Run the following command to install Carbon packages:
```bash
npm install --save @carbon/react @carbon/charts-react @carbon/icons-react @carbon/themes
```

### 2. Import Carbon Styles
Add to your main CSS file or component:
```css
@import '@carbon/react/scss/spacing';
@import '@carbon/react/scss/breakpoint';
@import '@carbon/react/scss/type';
@import '@carbon/react/scss/theme';
```

### 3. Component Migration Checklist
- [ ] AssetsPage.js - Replace MUI with Carbon
- [ ] AssetsSummary.js - Use Carbon Tile
- [ ] AssetsTable.js - Use Carbon DataTable
- [ ] AssetsEfficiencyMatrix.js - Wrap with Carbon components
- [ ] AssetsChart.js - Use Carbon Charts
- [ ] AssetDetailModal.js - Use Carbon Modal

## Key Carbon Components to Use
- `@carbon/react`: Button, Dropdown, DataTable, Tile, Modal, Tabs, Loading, Tag, ProgressBar
- `@carbon/charts-react`: StackedBarChart, LineChart, BubbleChart
- `@carbon/icons-react`: Renew, Download, Currency, Dashboard, Warning, ChartBubble

## Important Notes
- The rest of the codebase uses MUI, but the Assets page MUST use Carbon per requirements
- Carbon and MUI can coexist in the same project
- Follow Carbon design tokens for spacing, colors, and typography
