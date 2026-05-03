# gtfish24-jira-markdown

Convert between Markdown and JIRA markup formats directly in VS Code. Supports headers, lists, bold, italic, code blocks, links, tables, and more. Outputs converted text to timestamped files or split-view panels for easy copying.

## Features

- **Markdown to JIRA**: Converts the selected text from Markdown format to JIRA markup, shown in a side-by-side split view
- **JIRA to Markdown**: Converts the full document from JIRA markup to Markdown, saved as a timestamped `.md` file
- **Timestamped File Output**: JIRA-to-Markdown results are saved to `tempfile/jira2md/YYYYMMDD HHMMSS.md` in the workspace directory
- **Split View Output**: Markdown-to-JIRA results open in a temporary side panel for quick copy-paste
- **Header Conversion**: Bidirectional conversion between `# H1` / `## H2` and `h1.` / `h2.` formats (levels 1-6)
- **List Conversion**: Handles ordered and unordered lists with proper nesting depth translation
- **Bold and Italic**: Converts between `**bold**` / `*italic*` and `*bold*` / `_italic_` JIRA syntax
- **Code Blocks**: Converts between fenced code blocks (` ``` `) and JIRA `{code}` / `{noformat}` blocks
- **Inline Code Coloring**: Translates backtick inline code to JIRA colored text markup (`{color:#159788}`)
- **Table Conversion**: Converts Markdown tables to JIRA `||header||` format and single-row tables to `{panel}` blocks
- **Link Conversion**: Bidirectional translation between `[text](url)` and `[text|url]` link formats
- **Superscript and Subscript**: Converts `<sup>` / `<sub>` HTML tags to JIRA `^text^` / `~text~` notation

## Commands

| Command | Description |
| ------- | ----------- |
| Convert Markdown to JIRA | Convert selected Markdown text to JIRA markup (opens in split view) |
| Convert JIRA to Markdown | Convert full document from JIRA to Markdown (saves timestamped file) |

## Key Modifications from Original

- Replaced in-place editing with timestamped file output for JIRA-to-Markdown conversion
- Added split-view panel output for Markdown-to-JIRA conversion
- Rewrote inline code conversion to use JIRA color markup instead of monospace `{{}}` syntax
- Fixed link and table conversion regex patterns for improved accuracy

## Attribution

Based on [markdown-to-jira](https://marketplace.visualstudio.com/items?itemName=chintans1.markdown-to-jira) by chintans1. Independently modified and maintained.
