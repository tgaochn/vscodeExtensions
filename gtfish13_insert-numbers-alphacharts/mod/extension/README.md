# gtfish13_insert-numbers-alphacharts

Insert sequential numbers, alphabetic characters, hex values, and custom-formatted sequences at multiple cursor positions with powerful expression-based patterns.

## Features

- **Numeric sequences**: Insert incrementing or decrementing numbers at each cursor position with configurable start value and step (e.g., `1:1` for 1, 2, 3...)
- **Alphabetic sequences**: Insert sequential letters (a, b, c... or A, B, C...) with wrapping support for multi-character sequences
- **Hexadecimal support**: Insert hex number sequences starting from any hex value (e.g., `0x0A:1`)
- **Expression mode**: Use arbitrary JavaScript expressions with pipe syntax for computed sequences (e.g., `i|~ n*n` for squares)
- **D3 number formatting**: Apply d3-format patterns for padding, precision, and locale-aware formatting (e.g., `1:1~05d` for zero-padded 5-digit numbers)
- **Random number generation**: Generate random numbers within a range using the `r` modifier
- **Repeat and frequency**: Control how many times each value repeats (`#`) and cursor frequency (`*`)
- **History management**: Recall previous insertion patterns from a configurable history list with quick-pick interface
- **Sort and reverse**: Optionally sort selections (`$`) or reverse insertion order (`!`)

## Commands

| Command | Description |
| ------- | ----------- |
| `GF13: Insert Numbers & Alphachars` | Open input box to specify a sequence pattern and insert at all cursors |
| `GF13: Show Insert History` | Show quick-pick list of previously used insertion patterns |

## Keyboard Shortcuts

| Shortcut | Command |
| -------- | ------- |
| `Ctrl+Alt+.` (Mac: `Cmd+Alt+.`) | Insert Numbers & Alphachars |
| `Ctrl+Alt+,` (Mac: `Cmd+Alt+,`) | Show Insert History |

## Configuration

| Setting | Description | Default |
| ------- | ----------- | ------- |
| `insertnums.historyLimit` | Maximum number of historical records (0 = unlimited) | `30` |
| `insertnums.editHistory` | Allow editing picked item from history | `false` |

## Key Modifications from Original

- Added dedicated keyboard shortcuts (`Ctrl+Alt+.` and `Ctrl+Alt+,`) for faster access
- Changed default start pattern from `1:1` to `0:1` for zero-based indexing

## Attribution

Based on [Insert Sequences](https://marketplace.visualstudio.com/items?itemName=volkerdobler.insertnums) by Volker Dobler. Independently modified and maintained.
