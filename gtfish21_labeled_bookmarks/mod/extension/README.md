# gtfish21-labeled-bookmarks

Labeled bookmarks with multiple groups and customizable visual indicators. Organize bookmarks by named groups with configurable icon shapes, colors, and unicode markers. Navigate efficiently across files with dedicated keybindings.

## Features

- **Labeled Bookmarks**: Assign text labels to bookmarks for easy identification
- **Multiple Bookmark Groups**: Organize bookmarks into named groups with separate visual styles
- **Customizable Icon Shapes**: Choose from bookmark, circle, heart, label, or star shapes per group
- **Configurable Icon Colors**: Set custom colors for each bookmark group (teal, blue, magenta, red, yellow, green)
- **Unicode Markers**: Add emoji or unicode decorations to bookmark groups
- **Tree View Sidebar**: Dedicated activity bar panel showing bookmarks by active group, inactive groups, and by file
- **Selection Expansion**: Expand text selection from cursor to next or previous bookmark
- **Overview Ruler Markers**: Bookmark positions shown in the scrollbar with configurable lane placement
- **Line-End Label Display**: Show bookmark labels at the end of bookmarked lines (bordered or inverse style)
- **Cross-File Navigation**: Jump to any bookmark across all open workspace files
- **Move Bookmarks**: Transfer bookmarks between groups
- **Untrusted Workspace Support**: Full functionality in untrusted workspaces

## Commands

| Command | Description |
| ------- | ----------- |
| Bookmarks: toggle bookmark | Toggle a bookmark on the current line |
| Bookmarks: toggle labeled bookmark | Toggle a bookmark with a custom label |
| Bookmarks: navigate to bookmark | Quick-pick navigation to any bookmark in the active group |
| Bookmarks: navigate to bookmark of any group | Navigate to bookmarks across all groups |
| Bookmarks: navigate to next/previous bookmark | Jump to adjacent bookmarks |
| Bookmarks: expand selection to next/previous | Expand selection to nearest bookmark |
| Bookmarks: select/add/delete group | Manage bookmark groups |
| Bookmarks: set group icon shape/color | Customize group visual indicators |
| Bookmarks: toggle hiding all/inactive groups | Control bookmark decoration visibility |
| Bookmarks: show tree view | Open the bookmarks sidebar panel |

## Key Modifications from Original

- Remapped bookmark toggle to Ctrl+Alt+M
- Remapped labeled bookmark toggle to Ctrl+Alt+L
- Remapped next/previous navigation to Ctrl+Alt+K / Ctrl+Alt+J
- Added Shift+Alt+K / Shift+Alt+J for selection expansion to bookmarks
- Remapped group management to Ctrl+Alt+B chord sequences

## Attribution

Based on [Labeled Bookmarks](https://marketplace.visualstudio.com/items?itemName=koalamer.labeled-bookmarks) by koalamer. Independently modified and maintained.
