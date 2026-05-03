# gtfish16-auto-align

Auto-align columnar data with configurable pre-separator spacing for balanced column alignment in CSV and delimited files.

## Features

- **Auto-align on edit**: Automatically aligns columns when editing CSV or delimited files, with configurable delay
- **Pre-separator spacing**: Adds configurable space before separators (not just after) for balanced alignment
- **Tab/Shift+Tab field navigation**: Navigate between columns using Tab and Shift+Tab when auto-align is active
- **Left or right alignment**: Choose column alignment direction via settings
- **Separator dimming**: Visually dims separator characters for improved readability
- **Align selection**: Align only the selected text region rather than the entire file
- **Align with custom separator**: Prompt for a separator character and align the selection using it
- **Collapse columns**: Remove alignment padding to return columns to their compact form
- **Change separator**: Dynamically change the separator for the current file type
- **Status bar toggle**: Enable/disable auto-align mode via a status bar button
- **Optional trailing separator**: Add an ending separator to each line if desired
- **Cursor repositioning**: Intelligently repositions cursor after alignment operations

## Commands

| Command | Description |
| ------- | ----------- |
| `GF16 Align: Align Columns` | Align all columns in the file |
| `GF16 Align: Collapse Columns` | Remove alignment padding |
| `GF16 Align: Enable auto align mode` | Enable automatic alignment |
| `GF16 Align: Disable auto align mode` | Disable automatic alignment |
| `GF16 Align: Change Separator` | Change the separator for the current file type |
| `GF16 Align: Move Cursor to Next Field` | Navigate to the next column (Tab) |
| `GF16 Align: Move Cursor to Previous Field` | Navigate to the previous column (Shift+Tab) |
| `GF16 Align: Align Selection` | Align only the selected region |
| `GF16 Align: Align Selection With Separator` | Align selection with a custom separator |

## Key Modifications from Original

- Added configurable space before separators (`autoAlign.extraSpace`), producing balanced spacing like `value1 , value2` instead of `value1, value2`

## Attribution

Based on [Auto Align](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.align-mode) by Gruntfuggly (v0.0.21). Independently modified and maintained.
