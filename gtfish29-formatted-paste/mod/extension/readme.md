# gtfish29-formatted-paste

A simple VS Code utility that pastes clipboard content with leading and trailing whitespace automatically stripped. Useful when copying text from terminals, web pages, or documentation where extra whitespace and newlines get included unintentionally.

## Features

- **Trimmed paste**: Reads text from the clipboard, strips all leading and trailing whitespace and newlines, and inserts the cleaned text at each cursor position
- **Multi-cursor support**: Works with multiple selections -- replaces each selection with the trimmed clipboard content
- **Default keybinding**: Bound to `Ctrl+Shift+V` (`Cmd+Shift+V` on Mac) when the editor has text focus
- **Non-destructive**: Only trims the outer whitespace; internal formatting, indentation, and line breaks within the content are preserved

## Commands

| Command | Description |
| ------- | ----------- |
| `Formatted Paste (Trimmed)` | Paste clipboard content with leading/trailing whitespace removed |

## Keybindings

| Keybinding | Mac | When | Command |
| ---------- | --- | ---- | ------- |
| `Ctrl+Shift+V` | `Cmd+Shift+V` | Editor has focus | Formatted Paste (Trimmed) |

## Attribution

Original extension by gtfish1988. Independently developed and maintained.