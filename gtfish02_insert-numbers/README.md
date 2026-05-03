# gtfish02_insert-numbers

Insert sequential numbers at multiple cursor positions with an enhanced input experience.

## Description

This extension allows you to insert sequential numbers at multiple cursor positions in VS Code. It supports customizable format strings, start values, and step increments. You can use full format string syntax (e.g., `%d:0:1`) or simply type a plain integer to set the start value directly.

## Key Modifications

This is a custom fork of [`Asuka.insertnumbers`](https://marketplace.visualstudio.com/items?itemName=Asuka.insertnumbers) (v0.9.1) with the following changes:

- **Simplified integer input**: When you enter a plain integer (e.g., `5`), it is automatically used as the start value, eliminating the need to use the full format string syntax
- **Enhanced input parsing**: Added regex-based detection (`/^\+?[1-9][0-9]*$/`) to distinguish between plain numbers and format strings
- **Three input modes**: plain integer, format string with colons (`%d:0:1`), format string without colons (`%d`, `%05d`)

## Usage

1. Place multiple cursors where you want numbers inserted
2. Press `Ctrl+Alt+N` (or `Cmd+Alt+N` on Mac)
3. Enter a format string or plain number in the input box
   - `5` - starts numbering from 5
   - `%d:0:1` - format string with start=0, step=1
   - `%05d` - zero-padded 5-digit numbers

## Attribution

Based on [Insert Numbers](https://marketplace.visualstudio.com/items?itemName=Asuka.insertnumbers) by Asuka (v0.9.1). Independently modified and maintained.
