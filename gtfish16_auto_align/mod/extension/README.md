# gtfish16-auto-align

Auto-align columnar data with configurable pre-separator spacing.

## Description

This extension automatically aligns columnar data (CSV, delimited files) by expanding and padding columns to equal widths. It supports custom separators, field navigation with Tab/Shift+Tab, and configurable alignment options.

## Key Modifications

This is a custom fork of [`Gruntfuggly.align-mode`](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.align-mode) (v0.0.21) with the following changes:

- **Pre-separator spacing**: Added configurable space before separators (not just after), controlled by the `autoAlign.extraSpace` setting. This produces balanced spacing around column separators for more readable output
- Example: `value1 , value2` instead of `value1, value2`

## Features

- Auto-align on file change with configurable delay
- Tab/Shift+Tab to navigate between fields
- Left/right alignment options
- Separator dimming for visual clarity
- Optional trailing separator
- Cursor repositioning after alignment
- Supports CSV, BSV, and custom separators

## Changelog

### [0.0.1] - 2022-10-18
- Added spacing before and after separators

## Attribution

Based on [Auto Align](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.align-mode) by Gruntfuggly (v0.0.21). Independently modified and maintained.
