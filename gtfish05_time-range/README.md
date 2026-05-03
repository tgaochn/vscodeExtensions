# gtfish05_time-range

Insert formatted time range strings into the editor based on a user-specified duration. This extension calculates a start time (current time + 5 minutes, rounded) and an end time (start + duration), then inserts the range in `HH:MM - HH:MM` format at the cursor position.

## Features

- **Quick Time Range Insertion**: Prompts for a duration and inserts a formatted time range string at each cursor position.
- **Multiple Duration Formats**: Supports minutes (`30m`, `45min`) and hours (`1.5h`) as input.
- **Auto-calculated Start Time**: Start time is set to 5 minutes from the current time, providing a small buffer for scheduling.
- **Zero-padded Output**: Hours and minutes are always displayed with leading zeros (e.g., `09:30 - 10:00`).
- **Configurable Default Duration**: Set a default time lapse value via the `insertTimeRange.defaultInsertWord` setting so you can accept the default without typing each time.
- **Multi-cursor Support**: Works with multiple selections, inserting the time range at each cursor position.

## Commands

| Command | Description | Keybinding |
| ------- | ----------- | ---------- |
| `extension.insertTimeRange` | Insert time range | `Alt+Q` |

## Usage

1. Place the cursor where you want the time range inserted
2. Press `Alt+Q` (or run "Insert time range." from the command palette)
3. Enter a duration in the input box (e.g., `30m`, `1.5h`, `45min`)
4. The extension inserts a string like `14:35 - 15:05` at the cursor

## Configuration

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `insertTimeRange.defaultInsertWord` | `"30m"` | Default time lapse value shown in the input box |

## Examples

- Input `30m` with current time 14:00 produces: `14:05 - 14:35`
- Input `1.5h` with current time 09:00 produces: `09:05 - 10:35`
- Input `45min` with current time 16:20 produces: `16:25 - 17:10`
