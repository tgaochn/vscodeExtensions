# gtfish18-instant-md-table

Generate Markdown tables instantly by specifying dimensions. Supports column alignment options and inserts the table directly at the cursor position.

## Features

- **Quick table generation**: Create a Markdown table by specifying rows and columns in a simple `Rows,Columns` format
- **Default table size**: Leave input empty to generate a default 4x4 table
- **Column alignment options**: Choose between left, center, or right alignment for the entire table
- **Alignment Quick Pick menu**: When using the alignment command, a Quick Pick menu lets you select the alignment style
- **Insert at cursor**: Tables are inserted directly at the current cursor position in the editor
- **Proper Markdown syntax**: Generates valid Markdown table syntax with header row, separator row, and data rows
- **Input validation**: Validates the `Rows,Columns` format and shows a helpful message for incorrect input

## Commands

| Command | Description |
| ------- | ----------- |
| `Markdown: New Table` | Generate a new Markdown table with default alignment |
| `Markdown: New Table With Alignment` | Generate a new Markdown table with left/center/right alignment choice |

## Usage

1. Place your cursor where you want the table
2. Open the Command Palette (`Ctrl+Shift+P`)
3. Run `Markdown: New Table` or `Markdown: New Table With Alignment`
4. Enter table dimensions as `Rows,Columns` (e.g., `3,5`) or leave empty for 4x4
5. If using alignment, select left, center, or right from the Quick Pick menu

## Key Modifications from Original

- Added default 4x4 table size when input is left empty
- Suppressed success notification for less intrusive workflow

## Attribution

Based on [Markdown Table Generator](https://marketplace.visualstudio.com/items?itemName=jayfidev.markdown-table-generator) by JayFiDev. Independently modified and maintained.
