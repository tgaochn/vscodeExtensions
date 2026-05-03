# gtfish19-wrap-selection

Wrap selected text with quotes, brackets, or custom user-defined patterns. Features a QuickPick menu for selecting from configured wrap patterns and automatic keybindings that wrap on keypress.

## Features

- **QuickPick pattern menu**: Select from user-configured wrap patterns via a Quick Pick menu
- **Default pattern command**: Apply the default wrap pattern with a single command
- **Auto-wrap on keypress**: Pressing a quote or bracket key with selected text wraps it automatically
- **Multi-selection support**: Wraps all active selections simultaneously
- **Custom patterns**: Define wrap patterns using template literals in `wrapSelection.patterns` settings
- **Built-in patterns**: Supports `()`, `[]`, `{}`, `<>`, `{{}}`, backticks, single/double/french quotes, and more
- **Context menu**: Wrap selection available from the right-click editor context menu

## Commands

| Command | Description |
| ------- | ----------- |
| `Wrap selected text` | Open QuickPick menu to choose a wrap pattern |
| `Wrap selected text using custom pattern` | Apply the default wrap pattern |
| `Wrap selected text with single quote` | Wrap in single quotes |
| `Wrap selected text with double quote` | Wrap in double quotes |

## Keybindings

| Shortcut | Action |
| -------- | ------ |
| `'` / `"` / `` ` `` (with selection) | Wrap in quotes |
| `[` or `]` / `(` or `)` (with selection) | Wrap in brackets |

## Key Modifications from Original

- Added QuickPick menu for browsing user-defined wrap patterns
- Added default pattern command for one-keypress wrapping
- Added editor context menu entry

## Attribution

Based on [wrap](https://marketplace.visualstudio.com/items?itemName=gko.wrap) by gko (konstantin). Independently modified and maintained.
