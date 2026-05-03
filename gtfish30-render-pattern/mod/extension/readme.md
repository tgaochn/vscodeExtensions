# gtfish30-render-pattern

Recognize custom regex patterns in text files as clickable document links and open matched paths with configurable external commands. Supports Windows drive paths, UNC paths, and `file://` URLs with automatic path transforms and command fallback chains.

## Features

- **Regex-based pattern matching**: Define custom regex patterns that are recognized as clickable links in any text file
- **DocumentLinkProvider integration**: Matched patterns appear as underlined clickable links in the VS Code editor (not just in markdown preview)
- **Configurable command chains**: Each pattern can specify multiple commands in order of preference; the first command with an existing executable is used
- **Path transforms**: Built-in transforms convert forward slashes to backslashes (`forwardSlash`) or decode `file:///` URLs to local paths (`fileUrl`)
- **Custom tooltips**: Each pattern can define a tooltip template with `${path}` placeholder shown on hover
- **Live configuration reload**: Changing `render-pattern.patterns` in settings immediately re-registers the link provider
- **Default patterns**: Pre-configured for Windows drive paths (`C:/...`), UNC paths (`\\server\share`), and `file:///` URLs
- **External tool support**: Can open paths in Directory Opus, Windows Explorer, or any other command-line tool

## Commands

| Command | Description |
| ------- | ----------- |
| `Open Path` | Open the matched path using the configured command chain (triggered by clicking a detected link) |

## Configuration

Patterns are configured via `render-pattern.patterns` in VS Code settings. Each pattern object has:

| Property | Type | Required | Description |
| -------- | ---- | -------- | ----------- |
| `name` | string | Yes | Unique identifier for the pattern |
| `regex` | string | Yes | Regular expression to match (global flag added automatically) |
| `commands` | string[] | Yes | Ordered list of command templates; `${path}` is replaced with the matched path |
| `tooltip` | string | No | Tooltip text on hover; supports `${path}` placeholder |
| `pathTransform` | string | No | Transform type: `none`, `forwardSlash`, or `fileUrl` |

## Attribution

Original extension by gtfish1988. Independently developed and maintained.