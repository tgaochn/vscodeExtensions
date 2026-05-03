# gtfish03_matlab-formatter

MATLAB code formatter for VS Code with Windows Python compatibility.

## Description

This extension formats MATLAB source code by enforcing proper indentation and code structure. It supports both full document and range-based formatting and activates automatically when a `.m` MATLAB file is opened.

## Key Modifications

This is a custom fork of [`affenwiesel.matlab-formatter`](https://marketplace.visualstudio.com/items?itemName=affenwiesel.matlab-formatter) (v2.2.1) with the following changes:

- **Windows Python compatibility**: Added OS platform detection (`os.platform()`) to automatically prepend the `python` command prefix on Windows systems, ensuring the Python-based formatter script runs correctly
- **Dynamic command construction**: The formatter command is built with platform-specific prefixes and properly quoted file paths for cross-platform reliability

## Usage

1. Open a MATLAB `.m` file in VS Code
2. Use the built-in format document command (`Shift+Alt+F`) or right-click and select "Format Document"
3. Configure indentation width via `matlab-formatter.indentwidth` setting (default: 4 spaces)

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `matlab-formatter.indentwidth` | 4 | Number of spaces used for indentation |

## Attribution

Based on [matlab-formatter](https://marketplace.visualstudio.com/items?itemName=affenwiesel.matlab-formatter) by affenwiesel (v2.2.1). Independently modified and maintained.
