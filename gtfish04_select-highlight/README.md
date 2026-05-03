# gtfish04_select-highlight

Highlight all occurrences of selected text with a customized cochineal color scheme.

## Description

This extension highlights all occurrences of the currently selected text in the editor. It uses word boundary detection to prevent false matches within identifiers (e.g., selecting "var" won't highlight "variable") and distinguishes between the selected text and matching occurrences with different colors.

## Key Modifications

This is a custom fork of [`ebicochineal.select-highlight-cochineal-color`](https://marketplace.visualstudio.com/items?itemName=ebicochineal.select-highlight-cochineal-color) (v0.0.3) with the following changes:

- **Swapped light/dark color scheme**: Reversed the color assignments between light and dark themes for improved visibility
  - Light theme: highlight uses `#FF99B4`, selection uses `#AE2B52`
  - Dark theme: highlight uses `#FFB3C7`, selection uses `#C7506F`
- **Custom selection background**: Sets `editor.selectionBackground` to `#FFB3C7`

## Features

- Real-time highlighting as selection changes
- Smart word boundary detection using alphanumeric/underscore character set
- Automatic disabling of built-in VS Code selection highlight to avoid conflicts
- Different colors for selected text vs. matching occurrences

## Attribution

Based on [select-highlight-cochineal-color](https://marketplace.visualstudio.com/items?itemName=ebicochineal.select-highlight-cochineal-color) by ebicochineal (v0.0.3). Independently modified and maintained.
