# gtfish20-notes

Markdown-focused note-taking extension inspired by Notational Velocity / nvALT. Provides a dedicated sidebar panel for managing notes with configurable storage locations and file extensions.

## Features

- **Dedicated Notes Sidebar**: Activity bar icon opens a tree view for browsing and managing all notes
- **Configurable Storage Location**: Set any directory as your notes folder via settings or the setup command
- **Folder Management**: Create, rename, and delete folders directly from the notes tree view
- **Date-Stamped Notes**: Quickly create new notes with the current date prepended to the filename
- **File Extension Filtering**: Configure which file extensions appear in the notes view (default: all types)
- **Default Note Extension**: Set your preferred file format for new notes (default: `.md`)
- **Context Menu Actions**: Right-click notes and folders for rename, delete, and create operations
- **Welcome View**: Guided setup prompts new users to select a notes storage location

## Commands

| Command | Description |
| ------- | ----------- |
| GF20: New Note | Create a new note in the current folder |
| GF20: New Note with Date | Create a new note with the current date in the filename |
| GF20: New Folder | Create a new folder in the notes directory |
| GF20: List Notes | Open the notes quick-pick list |
| GF20: Delete Note | Delete the selected note |
| GF20: Delete Folder | Delete the selected folder |
| GF20: Rename Note | Rename the selected note |
| GF20: Rename Folder | Rename the selected folder |
| GF20: Refresh Notes | Refresh the notes tree view |
| GF20: Notes Settings | Open notes storage location settings |

## Keybindings

| Shortcut | Command |
| -------- | ------- |
| Alt+L | List Notes |
| Alt+N | New Note |

## Key Modifications from Original

- Remapped all command prefixes to the GF20 namespace for clarity
- Added custom keybindings (Alt+L for list, Alt+N for new note)
- Added folder management commands (create, rename, delete folders)
- Added date-stamped note creation for timestamped workflows

## Attribution

Based on [Notes](https://marketplace.visualstudio.com/items?itemName=dionmunk.vscode-notes) by dionmunk. Independently modified and maintained.
