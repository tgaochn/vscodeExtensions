# gtfish08_markdown-viewer

GitHub-styled markdown preview with high-contrast default theme settings.

## Description

This extension provides GitHub-style CSS theming for VS Code's built-in markdown preview. It supports multiple color themes including light, dark, high-contrast, and colorblind-friendly variants. The default theme is configured for high-contrast light mode for improved readability.

## Key Modifications

This is a custom fork of [`bierner.markdown-preview-github-styles`](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles) (v2.1.0) with the following changes:

- **Default theme changed**: Switched from "auto" to "light" as the default color theme
- **High-contrast defaults**: Both light and dark theme defaults set to `light_high_contrast` for improved readability and accessibility
- **Updated to v2.1.0**: Based on the latest version of the original extension

## Features

- GitHub-accurate markdown rendering with official CSS
- Multiple theme variants: light, dark, dimmed, high-contrast, colorblind-friendly (protanopia, tritanopia)
- Configurable via `markdown-preview-github-styles.colorTheme` setting

## Changelog

### [0.2.1] - 2025-04-01
- Updated to latest version of forked extension

### [0.1.0] - 2022-07-03
- Initial fork with customized theme defaults

## Attribution

Based on [Markdown Preview Github Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles) by bierner (v2.1.0). Independently modified and maintained.
