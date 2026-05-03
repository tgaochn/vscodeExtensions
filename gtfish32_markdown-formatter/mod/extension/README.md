# gtfish32_markdown-formatter

An advanced Markdown formatter for VS Code with strong CJK (Chinese/Japanese/Korean) text support. This extension normalizes Markdown documents by handling mixed CJK-English spacing, full-width to half-width character conversion, LaTeX symbol conversion, code block formatting, and more.

## Features

- **CJK-English auto-spacing**: Automatically inserts spaces between Chinese and English characters for better readability
- **Full-width character conversion**: Converts full-width numbers, letters, and punctuation to half-width equivalents
- **LaTeX-to-Unicode conversion**: Converts LaTeX math commands to Unicode symbols (e.g., `\alpha` to α, `\le` to ≤)
- **Code block auto-wrapping**: Auto-detects and wraps bare code blocks with language tags (PLAINTEXT, MERMAID, PYTHON, POWERSHELL, BAT, VBS, CMD, REG, etc.)
- **Math formula formatting**: Converts inline math formulas to block format with proper line breaks
- **HTML/Markdown bidirectional conversion**: Convert between HTML description format and Markdown
- **Relative path copying**: Copy the current file's encoded relative path as a Markdown link
- **Delimiter-aware formatting**: Smart formatting that preserves content inside brackets, quotes, and code spans
- **Table preservation**: Detects Markdown tables and preserves their spacing
- **YAML frontmatter preservation**: Skips formatting inside `---` separator blocks

## Commands

| Command | Description |
|---------|-------------|
| `MarkdownFormat: 格式化MD` | Format the current Markdown document |
| `MarkdownFormat: 格式化MD_html2md` | Convert HTML description to Markdown |
| `MarkdownFormat: 格式化MD_md2html` | Convert Markdown to HTML description |
| `MarkdownFormat: 复制当前文件的相对路径` | Copy encoded relative path of current file |
| `MarkdownFormat: 复制当前文件的相对路径_带标题` | Copy encoded relative path with filename as title |

## Key Modifications from Original

This is an extensively rewritten fork of [`liushilive.markdownformat`](https://marketplace.visualstudio.com/items?itemName=liushilive.MarkdownFormat) (v0.0.15). The original version has not been updated since 2019. Major changes include:

- **Architecture**: Refactored into modular structure with separate `utils.js` module; layered processing pipeline (T0-T5)
- **4 new commands** added (HTML/MD conversion, path copying)
- **Removed all configuration options** in favor of always-on formatting
- **Added**: CJK-English spacing, LaTeX symbol conversion, code block language detection, math formula line breaks, delimiter-aware processing, table detection, YAML frontmatter preservation
- **Registered as Document Formatting Provider** for format-on-save support

## Changelog

See the full changelog in the [README changelog section](#changelog-details) below.

### Changelog Details

<details>
<summary>Click to expand full changelog</summary>

#### [0.8.25] - 2026-04-25
- Added more code block language formats: MD, MARKDOWN, PYTHON, POWERSHELL, BAT, VBS, CMD, REG

#### [0.8.24] - 2026-04-14
- Added MERMAID code block format support

#### [0.8.23] - 2026-04-12
- Added plaintext output format handling
- Optimized table recognition

#### [0.8.22] - 2025-11-22
- Optimized space compression formatter positioning
- Used lookup tables to reduce duplicate logic

#### [0.8.21] - 2025-11-19
- Content inside `---` separators (YAML frontmatter) is now preserved

#### [0.8.0] - 2024-08-03
- Major refactoring with dedicated math formula processing

#### [0.4.0] - 2024-07-20
- Code refactoring, added math-related replacements, removed unused config

#### [0.2.0] - 2022-08-15
- Added HTML/Markdown conversion commands

#### [0.1.0] - 2022-07-03
- Initial fork: added full-width conversion, Greek letter replacement, math formula simplification

</details>

## Attribution

Based on [MarkdownFormat](https://marketplace.visualstudio.com/items?itemName=liushilive.MarkdownFormat) by liushilive (v0.0.15). This fork has been independently and extensively modified with substantial new functionality and is maintained separately.
