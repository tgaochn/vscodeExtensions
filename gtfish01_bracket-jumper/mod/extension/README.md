# gtfish01_bracket-jumper

Jump between matching brackets with customized keybindings. This extension provides eight directional bracket navigation commands that let you move or select to the nearest bracket in any direction, including scope-aware "ascend" commands that find the enclosing bracket pair at the same or higher nesting level.

## Features

- **Jump Left/Right**: Move the cursor to the nearest bracket in either direction. Opening brackets land the cursor after the bracket; closing brackets land it before.
- **Select Left/Right**: Extend the current selection to the nearest bracket in either direction, preserving the anchor position.
- **Ascend Left/Right**: Jump to the nearest unmatched bracket at the same or higher scope, skipping over fully paired inner brackets.
- **Select Ascend Left/Right**: Extend selection to the nearest unmatched bracket at the same or higher scope.
- **Uni-bracket Support**: Handles quotes and backticks (`"`, `'`, `` ` ``) as context-sensitive brackets, using heuristics to determine whether they are opening or closing.
- **Configurable Bracket Sets**: Customize which characters count as opening brackets, closing brackets, and uni-brackets via settings.
- **Escape-aware**: Backslash-escaped brackets are correctly ignored during navigation.

## Commands

| Command | Description | Windows/Linux | Mac |
| ------- | ----------- | ------------- | --- |
| `bracket-jumper.jumpLeft` | Jump to next-left bracket | `Ctrl+Alt+Left` | `Ctrl+Left` |
| `bracket-jumper.jumpRight` | Jump to next-right bracket | `Ctrl+Alt+Right` | `Ctrl+Right` |
| `bracket-jumper.selectLeft` | Select to next-left bracket | `Ctrl+Alt+Shift+Left` | `Ctrl+Shift+Left` |
| `bracket-jumper.selectRight` | Select to next-right bracket | `Ctrl+Alt+Shift+Right` | `Ctrl+Shift+Right` |
| `bracket-jumper.ascendLeft` | Ascend to nearest left bracket at same/higher scope | `Ctrl+Alt+Up` | `Ctrl+Up` |
| `bracket-jumper.ascendRight` | Ascend to nearest right bracket at same/higher scope | `Ctrl+Alt+Down` | `Ctrl+Down` |
| `bracket-jumper.selectAscendLeft` | Select to nearest left bracket at same/higher scope | `Ctrl+Alt+Shift+Up` | `Ctrl+Shift+Up` |
| `bracket-jumper.selectAscendRight` | Select to nearest right bracket at same/higher scope | `Ctrl+Alt+Shift+Down` | `Ctrl+Shift+Down` |

## Configuration

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `bracket-jumper.openingBrackets` | `["<", "{", "[", "("]` | Characters recognized as opening brackets |
| `bracket-jumper.closingBrackets` | `[">", "}", "]", ")"]` | Characters recognized as closing brackets |
| `bracket-jumper.uniBrackets` | `` ["`", "\"", "'"] `` | Characters that serve as both opening and closing brackets |

## Key Modifications from Original

- Customized keybinding mappings for both Mac and Windows/Linux platforms
- Added uni-bracket support for quotes and backticks with context-aware opening/closing heuristics
- Enhanced ascend commands to properly handle uni-brackets with pair counting

## Attribution

Based on [Bracket Jumper](https://marketplace.visualstudio.com/items?itemName=sashaweiss.bracket-jumper) by sashaweiss. Independently modified and maintained.
