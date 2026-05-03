# gtfish27-markdown-render-link

A VS Code markdown preview extension that adds support for backtick-enclosed URLs in links and pattern-based auto-linking. Extends the built-in markdown renderer via the `markdown.markdownItPlugins` API.

## Features

- **Backtick link syntax**: Renders `[title](`url`)` as clickable links in markdown preview, allowing URLs with special characters that would break standard markdown link parsing
- **Jira ticket auto-linking**: Automatically converts patterns like `RJQ-12345` into clickable links to the Jira issue page
- **Model identifier auto-linking**: Recognizes internal model naming patterns (UDS, MTM, bidding, post-apply, Glassdoor, I2A) and links them to the corresponding Butterfly configuration page
- **Non-destructive**: Only affects markdown preview rendering; does not modify the source document
- **Pattern-based text replacement**: Uses a configurable pattern list with regex matching and URL templates for auto-linking

## How It Works

The extension registers a `markdown-it` plugin that:
1. Adds an inline parsing rule for `[text](`url`)` syntax, processed before the default link rule
2. Overrides the text renderer to scan plain text nodes for configured regex patterns and wrap matches in anchor tags

## Supported Auto-Link Patterns

| Pattern | Example | Target |
| ------- | ------- | ------ |
| Jira tickets | `RJQ-12345` | Jira browse page |
| Internal models | `applyperseen_rj_hp_jp_52684ee` | Butterfly model config |
| I2A models | `elephant-multi-en-all_en-4e18057` | Butterfly model config |

## Attribution

Original extension by gtfish1988. Independently developed and maintained.