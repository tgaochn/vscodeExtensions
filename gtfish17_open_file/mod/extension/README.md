# gtfish17-open-file

Open files directly from path strings in the editor. Place your cursor on a quoted or bracketed file path and trigger the command to navigate to that file.

## Features

- **Open file from path at cursor**: Detects paths in quotes, angle brackets, parentheses, or square brackets
- **Recursive workspace search**: Searches the workspace recursively to find matching files
- **Quick Pick for multiple matches**: Presents a Quick Pick menu when multiple files match
- **Configurable starting path**: Restrict search to specific subdirectories
- **Search exclusion patterns**: Exclude directories like `node_modules` from search
- **Filename-only matching**: Optionally match just the filename instead of the full path
- **URL-encoded path support**: Handles `%20` and other encoded characters in paths

## Commands

| Command | Description |
| ------- | ----------- |
| `GF17: Open file from path` | Open file at cursor position |

## Keybindings

| Shortcut | Command |
| -------- | ------- |
| `Alt+D` | Open file from path |

## Key Modifications from Original

- Added custom keybinding `Alt+D` for quick access
- Enhanced regex to support angle brackets, parentheses, and square brackets

## Attribution

Based on [Open file From Path](https://marketplace.visualstudio.com/items?itemName=Jack89ita.open-file-from-path) by Jack89ita. Independently modified and maintained.
