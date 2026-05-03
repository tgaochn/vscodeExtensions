# gtfish22-python-string-sql

Syntax highlighting for SQL code embedded inside Python multi-line strings and f-strings. Automatically detects SQL keywords and applies full SQL syntax coloring within Python source files.

## Features

- **Auto-Detect SQL in Python Strings**: Automatically highlights SQL syntax when SELECT, FROM, or WITH keywords are detected on their own line inside a multi-line string
- **F-String Support**: Works with Python f-strings in addition to regular triple-quoted strings
- **Coconut Language Support**: Extends injection to `.coc`, `.coco`, and `.coconut` files alongside standard Python
- **Snippet Insertion Keybinding**: Quick keyboard shortcut to insert a pre-formatted SQL-highlighted string block
- **Semicolon-Terminated Detection**: SQL highlighting ends naturally at semicolons, triple-quote boundaries, or comment markers
- **Zero Configuration**: Works immediately upon installation with no settings required

## Commands

| Command | Description |
| ------- | ----------- |
| Insert Snippet: SQL_highlighted_string | Insert a SQL string template with highlighting (via keybinding) |

## Keybindings

| Shortcut | Command |
| -------- | ------- |
| Cmd+S (Mac) / Ctrl+S (Win) | Insert SQL-highlighted string snippet (in Python/Coconut files) |

## How It Works

The extension uses TextMate grammar injection to detect SQL patterns inside Python string literals. When a line inside a multi-line string starts with `SELECT`, `FROM`, or `WITH`, the extension activates SQL syntax highlighting until a terminating character (`;`, `"""`, or `--`) is encountered.

## Key Modifications from Original

- Added a keybinding for quick SQL string snippet insertion
- Extended language support to include Coconut files
- Tuned injection patterns for f-string compatibility

## Attribution

Based on [python-string-sql](https://marketplace.visualstudio.com/items?itemName=ptweir.python-string-sql) by ptweir. Independently modified and maintained.
