# gtfish15-split-join-text

Split and join text lines with configurable separators. Quickly break a single line into multiple lines at separator positions, or join multiple lines back into one.

## Features

- **Split text at separator**: Splits a line into multiple lines at each occurrence of a user-specified separator
- **Split and delete separator**: Splits text and removes the separator character from the output
- **Join text with separator**: Joins selected lines into one, inserting a separator between them
- **Join and delete indent**: Joins lines while stripping leading whitespace
- **Configurable default separator**: Set a default separator (defaults to comma) via settings
- **Multi-selection support**: Operates on all active selections or the current cursor line

## Commands

| Command | Description |
| ------- | ----------- |
| `Split Text with separator` | Split text into new lines at separator positions |
| `Split Text with separator, and delete separator` | Split and remove the separator |
| `Join Text with separator` | Join selected lines with a separator |
| `Join Text with separator, and delete indent` | Join lines, removing leading whitespace |

## Keybindings

| Shortcut | Command |
| -------- | ------- |
| `Ctrl+K Ctrl+1` | Split Text with separator |
| `Ctrl+K Ctrl+2` | Join Text with separator |

## Key Modifications from Original

- Added custom keybindings for quick split/join access
- Added "split and delete separator" and "join and delete indent" variants

## Attribution

Based on [Split Join texts](https://marketplace.visualstudio.com/items?itemName=matsuyanagi.split-join-text) by Matsuyanagi. Independently modified and maintained.
