# gtfish26-join-selected-string

Join selected text lines or clipboard content with a custom separator character. Provides three distinct join modes: paste-and-join from clipboard, join selections to clipboard, and quick comma-join to clipboard.

## Features

- **Join Paste**: Reads multi-line text from clipboard, joins all lines with a user-specified separator, and pastes the result at each cursor position
- **Join to Clipboard**: Takes all current editor selections, joins them with a custom separator, and copies the result to clipboard
- **Quick Join to Clipboard**: Joins all current editor selections with a comma-space separator and copies to clipboard without prompting
- **Multi-cursor support**: All operations work with multiple selections simultaneously
- **Custom separator prompt**: An input box lets you specify any string as the separator (default: `, `)

## Commands

| Command | Description |
| ------- | ----------- |
| `GF26: Join Selected Text` | Join clipboard lines with custom separator and paste into editor |
| `Join selected text to clipboard` | Join editor selections with custom separator and copy to clipboard |
| `Quick join selected text to clipboard (with comma)` | Join editor selections with `, ` and copy to clipboard |

## Key Modifications from Original

- Added two new commands (`join-to-clipboard` and `quick-join-to-clipboard`) that join editor selections rather than clipboard content
- Clipboard-based join now replaces all active selections instead of inserting at cursor
- Default separator changed to comma-space for common use cases

## Attribution

Based on [Join Paste](https://marketplace.visualstudio.com/items?itemName=vvlvm.join-paste) by vvlvm. This fork has been independently modified with additional clipboard join commands and maintained separately.