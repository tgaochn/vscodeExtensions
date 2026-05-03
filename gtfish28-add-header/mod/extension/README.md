# gtfish28-add-header

Add customizable comment headers to source code files with multi-language support. For markdown files, inserts a YAML frontmatter template with tag placeholders. For code files, generates a formatted comment box with author, filename, timestamps, language, repository URL, and description.

## Features

- **Multi-language comment styles**: Generates headers using the correct comment syntax for each language
  - C-style (`/* */`): C, C++, JavaScript, C#, Java, Go, Swift, PHP, Dart, Kotlin, plaintext
  - Hash-style (`##`): Python, Shell
  - HTML-style (`<!-- -->`): HTML
  - Django template tags (`{% comment %}`): Django HTML
  - R-style (`" "`): R
  - Perl POD (`=pod / =cut`): Perl
- **Markdown frontmatter**: Inserts a `---` delimited YAML block with placeholder tags for documentation metadata
- **Git repository detection**: Automatically reads the first remote URL from the active git repository
- **File creation time**: Reads the filesystem birth time and formats it with AM/PM time
- **Configurable fields**: Toggle author, filename, language, timestamps, and repository via settings
- **Comment box width**: Adjustable width (default 80 characters) with centered text alignment
- **Description prompt**: Prompts for a description that gets word-wrapped inside the comment box

## Commands

| Command | Description |
| ------- | ----------- |
| `GF28: Add Header` | Insert a comment header at the top of the current file |

## Configuration

| Setting | Type | Default | Description |
| ------- | ---- | ------- | ----------- |
| `addHeader.author` | string | `"Author Name"` | Author name for the header |
| `addHeader.commentBoxWidth` | number | `80` | Width of the comment box in characters |
| `addHeader.addFileName` | boolean | `true` | Include file name in header |
| `addHeader.addLanguage` | boolean | `true` | Include source language in header |
| `addHeader.addTimeCreated` | boolean | `true` | Include file creation time |
| `addHeader.addTimeUpdated` | boolean | `true` | Include last-updated timestamp |
| `addHeader.addRepo` | boolean | `true` | Include git repository URL |

## Key Modifications from Original

- Added markdown frontmatter generation (YAML tags template) for `.md` files
- Added git repository URL detection via the VS Code git API
- Added file creation time (birthtime) support
- Added support for additional languages: R, Perl, Django HTML
- Description text is now word-wrapped to fit within the comment box width

## Attribution

Based on [Add Header](https://marketplace.visualstudio.com/items?itemName=ch3rag.add-header) by ch3rag. This fork has been independently modified with additional language support and features, and is maintained separately.