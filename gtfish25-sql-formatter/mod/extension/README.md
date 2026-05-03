# gtfish25-sql-formatter

Format SQL files with support for 16 SQL dialects including BigQuery, PostgreSQL, MySQL, Snowflake, and more. Provides extensive formatting configuration options for keyword casing, indent style, comma placement, and expression width.

## Features

- **16 SQL Dialect Support**: Format SQL for BigQuery, DB2, Hive, MariaDB, MySQL, N1QL, PL/SQL, PostgreSQL, Redshift, SingleStoreDB, Snowflake, Spark, SQLite, Trino, TransactSQL, and standard SQL
- **SQL Flavour Override**: Override the detected SQL dialect for files where VS Code cannot determine the flavour
- **Keyword Case Control**: Preserve existing keyword casing, or force ALL CAPS or lowercase
- **Indent Style Options**: Choose from standard cascading indents, tabular-left, or tabular-right alignment
- **Comma Positioning**: Place commas before, after, or tabular-aligned relative to column expressions
- **Logical Operator Newlines**: Control whether AND/OR appear before or after line breaks
- **Alias Tabulation**: Right-align aliases to the longest line in SELECT clauses
- **Expression Width Limit**: Set maximum characters per line before the formatter breaks to a new line (default: 50)
- **Dense Operators**: Optionally strip whitespace around operators like + or >=
- **Tab Settings Override**: Ignore VS Code workspace tab settings and use custom tab size and spaces/tabs preference
- **Format Selection Command**: Format only the selected SQL text with the Simple-IQL formatter
- **Additional File Extensions**: Recognizes `.q` files alongside standard `.sql` files

## Commands

| Command | Description |
| ------- | ----------- |
| Format Selection (Simple-IQL) | Format the currently selected SQL text |

## Configuration

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `Prettier-SQL.SQLFlavourOverride` | `sql` | SQL dialect to use for formatting |
| `Prettier-SQL.keywordCase` | `preserve` | Keyword casing: preserve, upper, or lower |
| `Prettier-SQL.indentStyle` | `standard` | Indent style: standard, tabularLeft, tabularRight |
| `Prettier-SQL.commaPosition` | `after` | Comma placement: before, after, or tabular |
| `Prettier-SQL.expressionWidth` | `50` | Max characters per line before breaking |
| `Prettier-SQL.linesBetweenQueries` | `1` | Newlines between separate SQL statements |
| `Prettier-SQL.logicalOperatorNewline` | `before` | AND/OR placement: before or after line breaks |

## Key Modifications from Original

- Added a dedicated Format Selection (Simple-IQL) command for partial formatting
- Added `.q` file extension recognition for SQL files
- Customized default formatting preferences

## Attribution

Based on [Prettier SQL VSCode](https://marketplace.visualstudio.com/items?itemName=inferrinizzard.prettier-sql-vscode) by inferrinizzard. Independently modified and maintained.
