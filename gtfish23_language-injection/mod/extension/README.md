# gtfish23-language-injection

General-purpose language injection extension that adds syntax highlighting for additional languages inside Markdown fenced code blocks and Python multi-line strings. Supports AHK, Tree, Avro (AVDL), Julia, and SQL injection.

## Features

- **AHK in Markdown**: Syntax highlighting for AutoHotkey code inside ` ```ahk ` fenced blocks in Markdown files
- **Tree in Markdown**: Syntax highlighting for Tree-style directory listings inside ` ```tree ` fenced blocks
- **Avro in Markdown**: Syntax highlighting for Avro IDL (AVDL) schemas inside ` ```avro ` fenced blocks
- **Julia in Markdown**: Syntax highlighting for Julia code inside ` ```julia ` fenced blocks
- **SQL in Python Strings**: Auto-detects SQL statements (SELECT, FROM, WITH) in Python and Coconut multi-line strings and applies SQL syntax highlighting
- **F-String Compatible**: SQL injection works in Python f-strings as well as regular triple-quoted strings
- **Zero Configuration**: All injections activate automatically based on language markers and keyword detection

## Supported Injections

| Target Language | Injection | Trigger |
| --------------- | --------- | ------- |
| Markdown | AHK | ` ```ahk ` code fence |
| Markdown | Tree | ` ```tree ` code fence |
| Markdown | Avro IDL | ` ```avro ` code fence |
| Markdown | Julia | ` ```julia ` code fence |
| Python / Coconut | SQL | SELECT, FROM, or WITH keyword on its own line |

## How It Works

The extension uses TextMate grammar injection rules. For Markdown, it registers new fenced code block patterns that embed the corresponding language scope. For Python, it watches multi-line strings and f-strings for SQL keyword patterns, activating SQL highlighting until a terminator (`;`, `"""`, or `--`) is found.

## Key Modifications from Original

- Essentially a new extension built on the grammar injection concept from es6-string-html
- Added AHK, Tree, Avro, and Julia Markdown code block injections (not present in original)
- Added SQL-in-Python injection with auto-detection of SQL keywords
- Extended Python injection to Coconut language files

## Attribution

Based on the grammar injection concept from [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) by piers. Independently modified and maintained.
