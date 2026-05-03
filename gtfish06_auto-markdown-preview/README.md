# gtfish06_markdown-auto-preview

Auto-open Markdown Preview Enhanced pane when editing markdown files.

## Description

This extension automatically opens a preview pane when a Markdown file is opened or becomes the active editor. It provides a seamless side-by-side editing and preview experience without requiring manual preview activation.

## Key Modifications

This is a custom fork of [`hnw.vscode-auto-open-markdown-preview`](https://marketplace.visualstudio.com/items?itemName=hnw.vscode-auto-open-markdown-preview) (v0.0.4) with the following changes:

- **Switched preview engine**: Changed from VS Code's built-in markdown preview (`markdown.showPreviewToSide`) to the [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced) extension (`markdown-preview-enhanced.openPreview`) for richer rendering capabilities
- **Editor group management**: Added automatic closing of other editor groups before opening preview to maintain a clean layout
- **Async execution**: Uses Promise chaining for proper sequential command execution

## Prerequisites

- [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced) extension must be installed

## Features

- Auto-opens preview when the first markdown file is activated
- Tracks already-opened state to avoid redundant preview windows
- Triggers on both editor activation and new document creation

## Attribution

Based on [Auto-Open Markdown Preview](https://marketplace.visualstudio.com/items?itemName=hnw.vscode-auto-open-markdown-preview) by hnw (v0.0.4). Independently modified and maintained.
