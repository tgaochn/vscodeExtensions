# gtfish09_insert-comma

Insert commas at the end of selected lines with indentation preservation.

## Description

This extension provides a quick way to insert commas at the end of lines in your editor selections. It is useful for formatting comma-separated lists, CSV data, JSON arrays, and similar structures. The extension preserves existing indentation and can optionally insert a newline after the comma.

## Key Modifications

This is a custom fork of [`chrisvltn.vs-code-semicolon-insertion`](https://marketplace.visualstudio.com/items?itemName=chrisvltn.vs-code-semicolon-insertion) (v0.0.6) with the following changes:

- **Changed insertion character**: Converted from semicolon insertion to comma insertion
- **Command renamed**: Uses `extension.insertComma` instead of the original semicolon command
- **Smart duplicate detection**: Checks if a line already ends with a comma before inserting to avoid duplicates

## Usage

1. Select the lines where you want to add commas
2. Run the "Insert comma" command from the Command Palette

## Attribution

Based on [Semicolon Insertion Shortcut](https://marketplace.visualstudio.com/items?itemName=chrisvltn.vs-code-semicolon-insertion) by chrisvltn (v0.0.6). Independently modified and maintained.
