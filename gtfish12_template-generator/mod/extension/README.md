# gtfish12_template-generator

Generate new files and folders from customizable templates with keyboard shortcut support and explorer context menu integration.

## Features

- **File and folder templates**: Create new files or entire folder structures from predefined templates stored in a configurable templates directory
- **Template variable substitution**: Templates support dynamic fields including `name`, `camelCaseName`, `pascalCaseName`, `snakeCaseName`, `kebabCaseName`, `lowerDotCaseName`, `date`, `author`, `email`, and `link`
- **Explorer context menu**: Right-click any folder in the explorer to create a new file from template directly in that location
- **Keyboard shortcut**: Quickly invoke the "New File from Template" command with `Ctrl+Alt+N`
- **Customizable template path**: Configure where templates are stored via the `templateGenerator.templatesPath` setting (defaults to `~/.vscode/templates`)
- **Auto-open created files**: Optionally auto-open files after creation, configurable separately for file and folder templates
- **Custom date format**: Date fields use a localized "week, MM/dd/yyyy, hh:mm" format

## Commands

| Command | Description |
| ------- | ----------- |
| `Files: New File from Template` | Create a new file or folder from a saved template |
| `Template: Open Templates Folder` | Open the templates directory in the explorer |

## Configuration

| Setting | Description | Default |
| ------- | ----------- | ------- |
| `templateGenerator.templatesPath` | Path to the templates directory | `~/.vscode/templates` |
| `templateGenerator.openFileByFileTemplate` | Auto-open file after creation from file template | `true` |
| `templateGenerator.openFilesByFolderTemplate` | Auto-open all files after creation from folder template | `false` |
| `templateGenerator.fields.author` | Custom author field for template substitution | - |
| `templateGenerator.fields.email` | Custom email field for template substitution | - |
| `templateGenerator.fields.link` | Custom link field for template substitution | - |

## Key Modifications from Original

- Added keyboard shortcut `Ctrl+Alt+N` for faster template invocation
- Modified date format to use localized "week, MM/dd/yyyy, hh:mm" instead of default locale string

## Attribution

Based on [Template Generator](https://marketplace.visualstudio.com/items?itemName=DengSir.template-generator) by DengSir. Independently modified and maintained.
