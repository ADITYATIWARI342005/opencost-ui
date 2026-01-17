# Carbon Design System Installation Instructions

## IMPORTANT: Install Carbon Dependencies First

Before running the refactored Assets page, you must install Carbon Design System packages:

```bash
npm install --save @carbon/react @carbon/charts-react @carbon/icons-react @carbon/themes
```

## Why This Is Required

The LFX Mentorship challenge explicitly requires using Carbon Design System (see [Issue #155](https://github.com/opencost/opencost-ui/issues/155)). The current implementation uses Material-UI, which does not meet the requirements.

## After Installation

1. The Carbon components will be available for import
2. Carbon styles will be automatically included
3. The Assets page will render correctly with Carbon components

## Note on Coexistence

Carbon and Material-UI can coexist in the same project. The rest of the OpenCost UI uses MUI, but the Assets page uses Carbon as required by the challenge.
