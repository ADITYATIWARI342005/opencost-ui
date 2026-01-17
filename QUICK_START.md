# Quick Start Guide - Assets Page

## Installation

1. **Install Carbon Dependencies** (Required):
   ```bash
   npm install --save @carbon/react @carbon/icons-react
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Navigate to Assets Page**:
   - Open http://localhost:1234/assets
   - Or click "Assets" in the sidebar navigation

## What's Implemented

### ✅ Core Features
- Assets page at `/assets` route
- Fetches from `/assets` API endpoint
- Time window selector (7d, 30d, etc.)
- Breakdown selector (Type, Provider, Cluster, Category)
- Currency selector
- CSV export

### ✅ Carbon Design System Components
- **AssetsHeader** - Carbon Dropdowns & Buttons (most visible!)
- **AssetsSummary** - Carbon Tiles with Icons
- **Loading States** - Carbon Loading component
- **Error States** - Carbon InlineNotification
- **Efficiency Matrix** - Wrapped in Carbon Tile with Carbon Tags

### ✅ Key Innovation
- **Efficiency Matrix** - 2x2 quadrant visualization showing assets by cost vs utilization

### ✅ Data Table
- Sortable columns
- Pagination
- **Totals row at top** (OpenCost pattern)
- Utilization progress bars
- Owner tags

## File Structure

```
src/
├── pages/
│   └── Assets.js                    # Main page (uses Carbon Loading/Notifications)
├── components/assets/
│   ├── AssetsHeader.js              # Carbon Dropdowns & Buttons ⭐
│   ├── AssetsSummary.js             # Carbon Tiles ⭐
│   ├── AssetsEfficiencyMatrix.js    # Canvas + Carbon Tile ⭐
│   ├── AssetsTable.js               # MUI Table (matches existing pages)
│   ├── AssetsChart.js               # Recharts (matches existing pages)
│   └── AssetDetailModal.js          # MUI Modal (matches existing pages)
├── services/
│   └── assets.js                    # API client
└── utils/
    ├── assetCalculations.js         # Business logic
    └── assetFormatting.js           # Formatting helpers
```

## Testing

1. **Test API Connection**:
   - Ensure OpenCost backend is running on http://localhost:9090 (or configured BASE_URL)
   - Check browser console for API errors

2. **Test Features**:
   - Change time window → Data should refresh
   - Change breakdown → View should update
   - Click efficiency matrix bubbles → Modal should open
   - Click table rows → Modal should open
   - Export CSV → File should download

3. **Test Edge Cases**:
   - No assets found → Empty state should show
   - API error → Error notification should appear
   - Large dataset → Pagination should work

## Notes

- **Hybrid Approach**: Carbon for visible components (Header, Summary), MUI for table/charts (consistency)
- **Totals Row**: Appears at TOP of table (OpenCost pattern)
- **Efficiency Matrix**: Key differentiator - makes waste immediately visible

## Troubleshooting

**Carbon components not rendering?**
- Ensure Carbon dependencies are installed
- Check browser console for import errors

**API not connecting?**
- Verify OpenCost backend is running
- Check BASE_URL environment variable
- Review browser network tab for API calls

**Table not showing Totals row?**
- Verify data is loading correctly
- Check that `AssetsTable.js` includes Totals row logic

## Next Steps for Submission

1. Take screenshots (see SUBMISSION_CHECKLIST.md)
2. Write cover letter (use COVER_LETTER_TEMPLATE.md)
3. Create PR (use PR_DESCRIPTION_TEMPLATE.md)
4. Submit via LFX Portal

Good luck! 🚀
